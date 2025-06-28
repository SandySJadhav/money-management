import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const transactions = await Transaction.find({ userId: session.user.id });
  return NextResponse.json(transactions);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();

  if (body.amount < 0) {
    return NextResponse.json({ message: 'Amount cannot be negative' }, { status: 400 });
  }

  const newTransaction = new Transaction({ ...body, userId: session.user.id });
  await newTransaction.save();
  return NextResponse.json(newTransaction, { status: 201 });
}