import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query = { userId: session.user.id };
  if (type) {
    query.type = type;
  }

  const categories = await Category.find(query);

  return NextResponse.json(categories);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();
  try {
    const newCategoryData = { ...body, userId: session.user.id };
    if (!newCategoryData.icon) {
      newCategoryData.icon = 'FaQuestion'; // Assign default icon for custom categories
    }
    const newCategory = new Category(newCategoryData);
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error creating category', error: error.message }, { status: 500 });
  }
}