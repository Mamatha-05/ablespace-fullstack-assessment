import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  guestLogin() {
    return {
      token: randomUUID(),
      user: {
        id: randomUUID(),
        name: 'Guest User',
        role: 'guest',
      },
      createdAt: new Date().toISOString(),
    };
  }
}
