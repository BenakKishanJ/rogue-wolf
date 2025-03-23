// app/api/admin/verify-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { password } = await request.json();
  console.log(process.env.ADMIN_PASSWORD_HASH!);
  console.log(password);

  if (!password) {
    return NextResponse.json(
      { success: false, message: "Password is required" },
      { status: 400 },
    );
  }

  try {
    const storedHash = process.env.ADMIN_PASSWORD_HASH!;
    const isMatch = await bcrypt.compare(password, storedHash);

    if (isMatch) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Password verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
