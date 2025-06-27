import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/Schemas/user';

export async function middleware(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Access denied. No token provided.' }, { status: 401 });
  }

  await connectDB();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    req.user = user;
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
}

export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/money/:path*',
    '/api/account/:path*',
    '/api/accountGroup/:path*'
  ],
};