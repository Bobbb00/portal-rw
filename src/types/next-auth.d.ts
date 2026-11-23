import 'next-auth';
import { AdminRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    role: AdminRole;
  }

  interface Session {
    user: User & {
      id: string;
      role: AdminRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}
