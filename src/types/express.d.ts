import { User } from '../modules/users/entities/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
