import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deletedCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting category', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;
  const body = await request.json();
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ message: 'Category name already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error updating category', error: error.message }, { status: 500 });
  }
}