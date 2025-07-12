import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!process.env.WORDPRESS_URL) {
    return NextResponse.json(
      { error: "WordPress URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Login failed" }, { status: response.status });
    }

    const { token, user_display_name, user_email, user_nicename } = data;

    const user = {
      name: user_display_name,
      email: user_email,
      nicename: user_nicename,
    };
    
    const responseJson = { token, user };

    const nextResponse = NextResponse.json(responseJson);

    nextResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return nextResponse;

  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login." },
      { status: 500 }
    );
  }
}
