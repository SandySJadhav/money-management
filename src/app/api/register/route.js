import connectDB from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category'; // Import Category model
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();
  const { email, username, firstName, lastName, birthYear, password } = await request.json();

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return NextResponse.json({ message: 'User with that email or username already exists' }, { status: 409 });
    }

    const user = await User.create({
      email,
      username,
      firstName,
      lastName,
      birthYear,
      password,
    });

    // Insert default categories for the new user
    const defaultCategories = [
      { name: 'Salary', type: 'income', icon: 'FaMoneyBillWave', userId: user._id },
      { name: 'Other Income', type: 'income', icon: 'FaHandHoldingUsd', userId: user._id },
      { name: 'Food', type: 'expense', icon: 'FaUtensils', userId: user._id },
      { name: 'Transport', type: 'expense', icon: 'FaBus', userId: user._id },
      { name: 'Rent', type: 'expense', icon: 'FaHome', userId: user._id },
      { name: 'Utilities', type: 'expense', icon: 'FaLightbulb', userId: user._id },
      { name: 'Entertainment', type: 'expense', icon: 'FaGamepad', userId: user._id },
      { name: 'Other Expense', type: 'expense', icon: 'FaQuestion', userId: user._id },
    ];
    await Category.insertMany(defaultCategories);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
  }
}