import connectDB from "@/lib/db";
import User from "@/lib/Schemas/user";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  try {
    const existingUser = await User.findOne({ userName: body.userName });

    if (existingUser) {
      return new Response(JSON.stringify({
        status: 409,
        error: 'Username Unavailable!'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    const savedUser = await User.findById(user._id).select('-password');
    delete savedUser.__v;
    return new Response(JSON.stringify({
      status: 200,
      data: {
        token,
        user: savedUser
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.log("This is error in creating new user -> ");
    console.log(err);
    return new Response(JSON.stringify({
      status: 500,
      error: "Internal Server Error!"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}