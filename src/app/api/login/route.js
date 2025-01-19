import connectDB from "@/lib/db";
import User from "@/lib/Schemas/user";


export async function POST(req) {
  await connectDB();
  const { userName, password } = await req.json();
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return new Response(JSON.stringify({
        status: 404,
        error: 'User not found!'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (!(await user.comparePassword(password))) {
      return new Response(JSON.stringify({
        status: 401,
        error: 'Invalid password!'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const token = user.generateAuthToken();
    return new Response(JSON.stringify({
      status: 200,
      data: {
        token,
        user: {
          ...user._doc,
          password: undefined,
          __v: undefined
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({
      status: 500,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}