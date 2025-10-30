import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { productSchema } from "@/lib/validations/product";

//  GET ALL PRODUCTS (optionally filter by ?category=extensions)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const client = await clientPromise;
    const db = client.db("fivestar");

    const filter = category ? { category } : {};
    const products = await db.collection("products").find(filter).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

//  CREATE NEW PRODUCT
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fivestar");

    const newProduct = { ...parsed.data, createdAt: new Date() };
    await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

//  UPDATE PRODUCT
export async function PUT(req: Request) {
  try {
    const { productId, updates } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const parsed = productSchema.partial().safeParse(updates);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fivestar");

    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: { ...parsed.data, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

//  DELETE PRODUCT
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("fivestar");

    await db.collection("products").deleteOne({ _id: new ObjectId(productId) });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
