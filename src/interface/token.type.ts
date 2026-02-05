import { UserRole } from 'src/generated/prisma';

export type TUser = {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
};
