import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

/* -------------------- */
/* Validation Schemas   */
/* -------------------- */

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  surname: z.string().min(2),
  password: z.string().min(8),
});

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "admin"]),
});

const deleteSchema = z.object({
  userId: z.string(),
});

/* -------------------- */
/* POST – Create user  */
/* -------------------- */
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

    const client = await clientPromise;
    const db = client.db("fivestar");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      email,
      name,
      surname,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* -------------------- */
/* GET – List users     */
/* -------------------- */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fivestar");
    const users = db.collection("users");

    const allUsers = await users
      .find({}, { projection: { password: 0 } }) // ⛔ hide password
      .toArray();

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* -------------------- */
/* PUT – Update role    */
/* -------------------- */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = roleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { userId, role } = parsed.data;

    const client = await clientPromise;
    const db = client.db("fivestar");
    const users = db.collection("users");

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "User role updated" });
  } catch (error) {
    console.error("❌ Error updating role:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* -------------------- */
/* DELETE – Remove user */
/* -------------------- */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { userId } = parsed.data;

    const client = await clientPromise;
    const db = client.db("fivestar");
    const users = db.collection("users");

    await users.deleteOne({ _id: new ObjectId(userId) });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
