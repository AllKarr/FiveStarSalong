import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import clientPromise from "@/lib/db";

// ✅ Validation schema using Zod
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, name, surname, password } = parsed.data;

    // ✅ Connect to Mongo
    const client = await clientPromise;
    const db = client.db("fivestar"); // ← Replace with your actual DB name
    const users = db.collection("users");

    // ✅ Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save new user
    const newUser = {
      email,
      name,
      surname,
      password: hashedPassword,
      role: "user", // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(newUser);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
