import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;
  const transaction = await Transaction.findOne({ _id: id, userId: session.user.id });
  if (!transaction) {
    return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
  }
  return NextResponse.json(transaction);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;
  const body = await request.json();

  if (body.amount !== undefined && body.amount < 0) {
    return NextResponse.json({ message: 'Amount cannot be negative' }, { status: 400 });
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    body,
    { new: true }
  );
  if (!updatedTransaction) {
    return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
  }
  return NextResponse.json(updatedTransaction);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;
  const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!deletedTransaction) {
    return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Transaction deleted' });
}