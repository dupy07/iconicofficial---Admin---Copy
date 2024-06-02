import connectMongoDB from "@/libs/connectMongoDB";
import { Product } from "@/libs/model/product";
import { Order } from "@/libs/model/orders"; // Ensure you have imported the Order model
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Function to update the available quantity of a product
async function updateAvailableQuantity(productId: string) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const orders = await Order.find({
    "items.product": new ObjectId(productId),
    orderStatus: "Delivered",
    paymentStatus: "Paid",
  });

  const orderedQuantity = orders.reduce((acc, order) => {
    const item = order.items.find(
      (i: any) => i.product.toString() === productId
    );
    return acc + (item ? item.quantity : 0);
  }, 0);

  const totalQuantity = product.variants.reduce(
    (acc, variant) => acc + variant.quantity,
    0
  );
  const availableQuantity = totalQuantity - orderedQuantity;

  product.availableQuantity = availableQuantity;
  await product.save();
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body as JSON
    const requiredFields = [
      "name",
      "description",
      "category", // Assuming "category" is received as a string in the request body
      "cost_price",
      "selling_price",
      "images",
      "variants",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Field ${field} is required`,
          },
          {
            status: 400,
          }
        );
      }
    }

    await connectMongoDB();

    const createdProduct = await Product.create(body); // Create new product with received data

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: createdProduct, // Optionally, send back the created product
      },
      {
        status: 201, // Use 201 Created status for successful resource creation
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}

// GET: Fetch all products
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const products = await Product.find({}).populate("category");

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectMongoDB();
    const result = await Product.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error occurred during deletion:", e);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}

// PUT: Update a product by ID
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body = await req.json();

    await connectMongoDB();
    const result = await Product.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // Update availableQuantity after updating the product
    await updateAvailableQuantity(id);

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error occurred during update:", e);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
