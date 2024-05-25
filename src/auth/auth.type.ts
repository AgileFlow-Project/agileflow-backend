import { Request } from 'express';
import { Role } from './role.enum';

export type RequestUser = {
  id: string;
  email: string;
  roles: Role[];
};

export interface AuthRequest extends Request {
  user: RequestUser | undefined;
}
