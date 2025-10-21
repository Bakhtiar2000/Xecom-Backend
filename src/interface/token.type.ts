import { UserRole } from "@prisma/client";

export type TUser = {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
};
