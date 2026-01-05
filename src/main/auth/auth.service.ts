import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from '@prisma/client';
import { ChangePasswordDto } from './auth.dto';
import { MailerService } from 'src/utils/sendMail';
import { TUser } from 'src/interface/token.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) { }

  // Login
  public async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email, status: UserStatus.ACTIVE, },
    });

    if (!user) throw new HttpException('User not found', 401);

    const isCorrectPassword = bcrypt.compare(password, user.password);
    console.log(password, user.password);
    if (!isCorrectPassword) throw new HttpException('Invalid credentials', 401);

    const payload = { email: user.email, role: user.role, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_SECRET_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_SECRET_EXPIRES_IN'),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  // Refresh Token
  public async refreshToken(token: string) {
    // Verify the refresh token
    let decoded: any;
    try {
      decoded = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('REFRESH_SECRET'),
      });
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Check if the user is blocked
    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException('This user is blocked!', HttpStatus.FORBIDDEN);
    }

    // Generate new access token
    const payload = { email: user.email, role: user.role, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_SECRET_EXPIRES_IN'),
    });

    return {
      accessToken,
    };
  }

  // ----------------------------------------------Change Password-------------------------------------------------
  public async changePassword(user: TUser, payload: ChangePasswordDto) {
    const userData = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: user?.email,
        status: UserStatus.ACTIVE,
      },
    });

    const isCorrectPassword = bcrypt.compare(
      payload.password,
      userData.password as string,
    );
    if (!isCorrectPassword) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword: string = await bcrypt.hash(payload.confirmPassword, 12);

    // Update operation
    await this.prisma.user.update({
      where: {
        email: userData?.email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return null;
  }

  // ---------------------------------------------------Forgot Password-------------------------------------------------
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, status: UserStatus.ACTIVE },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const payload = { email: user.email, role: user.role, id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_SECRET'),
      expiresIn: this.configService.get('ACCESS_SECRET_EXPIRES_IN'),
    });
    const resetPassLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    await this.mailerService.sendMail(
      user.email,
      `<div>
          <p>Dear User,</p>
          <p>Click on this Button to reset your password. Link expires in 10 minutes.</p> 
          <p>
              <a href="${resetPassLink}">
                  <button>
                      Reset Password
                  </button>
              </a>
          </p>
      </div>`,
      "Reset Password Link 🔗",
      "Click on the link to reset your password. Link expires in 10 minutes."
    );
    return null;
  }

  public async resetPassword(payload: { newPassword: string }, token: string) {
    console.log(payload, token);
    // 1. Decode token
    const decoded: any = this.jwtService.verify(token, {
      secret: this.configService.get('ACCESS_SECRET'),
    });

    // 2. Fetch user
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException('This user is blocked!', HttpStatus.FORBIDDEN);
    }

    // 3. Hash new password
    const newHashedPassword = await bcrypt.hash(
      payload.newPassword,
      Number(this.configService.get('BCRYPT_SALT_ROUNDS') || 10),
    );

    // 4. Update user
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        updatedAt: new Date(),
      },
    });

    return null;
  }
}
