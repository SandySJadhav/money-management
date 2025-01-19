import connectDB from "@/lib/db";
import User from "@/lib/Schemas/user";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  try {
    const existingUser = await User.findOne({
      userName: body.userName
    });

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
    return new Response(JSON.stringify({ status: 200 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.log("Error creating new user -> ");
    console.log(err);
    return new Response(JSON.stringify({
      status: 500,
      error: "Internal Server Error!",
      errorDetails: err
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}