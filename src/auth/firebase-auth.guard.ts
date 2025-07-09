import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { auth, db } from '../firebase/firebase-admin';
import { User } from '../modules/users/entities/user.model';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split('Bearer ')[1].trim();

    try {
      const decodedToken = await auth.verifyIdToken(token);
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        throw new UnauthorizedException('User record not found');
      }

      const userData = userDoc.data() as {
        displayName?: string;
        createdAt: FirebaseFirestore.Timestamp;
        updatedAt: FirebaseFirestore.Timestamp;
        preferences?: User['preferences'];
      };

      const enrichedUser: User = {
        uid: decodedToken.uid,
        email: decodedToken.email ?? '',
        displayName: userData.displayName,
        photoURL: decodedToken.picture ?? '',
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate(),
        preferences: userData.preferences,
      };

      req.user = enrichedUser;
      return true;
    } catch (err) {
      console.error('Auth error:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
