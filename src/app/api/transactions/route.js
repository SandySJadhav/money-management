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

  const { repeatType, repeatCount, date, ...rest } = body;
  const transactionsToCreate = [];
  let currentDate = new Date(date);

  if (repeatType === 'None') {
    transactionsToCreate.push({ ...rest, date: currentDate, userId: session.user.id });
  } else {
    let numTransactions = repeatCount || 1; // Use repeatCount, default to 1 if not provided
    for (let i = 0; i < numTransactions; i++) {
      transactionsToCreate.push({ ...rest, date: new Date(currentDate), userId: session.user.id });
      switch (repeatType) {
        case 'Daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'Weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'Monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'Annually':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }
  }

  try {
    const savedTransactions = await Transaction.insertMany(transactionsToCreate);
    return NextResponse.json(savedTransactions, { status: 201 });
  } catch (error) {
    console.error('Error saving transactions:', error);
    return NextResponse.json({ message: 'Error saving transactions' }, { status: 500 });
  }
}