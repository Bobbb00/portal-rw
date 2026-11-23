import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { AdminRole } from '@prisma/client';

// Rate limiter in-memory untuk mitigasi brute force pada login
interface LoginAttempt {
  count: number;
  lockUntil: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 menit

function checkRateLimit(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (record && record.lockUntil > now) {
    const remainingMinutes = Math.ceil((record.lockUntil - now) / 60000);
    throw new Error(
      `Terlalu banyak percobaan gagal. Akun dikunci sementara demi keamanan. Coba lagi dalam ${remainingMinutes} menit.`
    );
  }
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  // Pembersihan berkala jika memory map membesar
  if (loginAttempts.size > 1000) {
    for (const [k, v] of loginAttempts.entries()) {
      if (v.lockUntil < now) loginAttempts.delete(k);
    }
  }

  const record = loginAttempts.get(key) || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS;
  }
  loginAttempts.set(key, record);
}

function resetAttempts(key: string) {
  loginAttempts.delete(key);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();
        checkRateLimit(normalizedEmail);

        const user = await prisma.adminUser.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.isActive) {
          recordFailedAttempt(normalizedEmail);
          throw new Error('Akun tidak ditemukan atau tidak aktif');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          recordFailedAttempt(normalizedEmail);
          throw new Error('Email atau password salah');
        }

        // Login berhasil, bersihkan riwayat percobaan gagal
        resetAttempts(normalizedEmail);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AdminRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
};
