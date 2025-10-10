import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/guard/roles.guard';

export function RoleGuardWith(role: Role[]) {
  return new RolesGuard(new Reflector(), role);
}
