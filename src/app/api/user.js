import connectDB from "@/lib/db";
import User from "@/lib/Schemas/user";

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'GET') {
    const users = await User.find({});
    res.status(200).json({
      status: "success",
      data: users
    });
  } else if (req.method === 'POST') {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({
        status: "success",
        data: newUser
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}