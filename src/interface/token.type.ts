import { Role } from "@prisma/client";

export type TUser = {
  id: string;
  email: string;
  userType: Role;
  iat: number;
};
