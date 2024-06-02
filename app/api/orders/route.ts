import connectMongoDB from "@/libs/connectMongoDB";
import { Order } from "@/libs/model/orders";
import { Product } from "@/libs/model/product";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Define required fields for creating and updating an order
const requiredFields = [
  "customer",
  "items",
  "totalAmount",
  "orderStatus",
  "paymentStatus",
  "paymentMethod",
];

// Function to check if required fields are present in the request body
const validateFields = (body: any) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      return field;
    }
  }
  return null;
};

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

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body as JSON
    const missingField = validateFields(body); // Validate required fields

    if (missingField) {
      return NextResponse.json(
        {
          success: false,
          message: `Field ${missingField} is required`,
        },
        {
          status: 400,
        }
      );
    }

    await connectMongoDB();

    const createdOrder = await Order.create(body); // Create new order with received data

    for (const item of createdOrder.items) {
      await updateAvailableQuantity(item.product.toString());
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: createdOrder, // Optionally, send back the created order
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

// GET: Fetch all orders
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const orders = await Order.find({});

    return NextResponse.json(
      {
        success: true,
        data: orders,
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

// DELETE: Delete an order by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectMongoDB();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const result = await Order.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    for (const item of order.items) {
      await updateAvailableQuantity(item.product.toString());
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order deleted successfully",
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

// PUT: Update an order by ID
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body = await req.json();
    const missingField = validateFields(body); // Validate required fields

    if (missingField) {
      return NextResponse.json(
        {
          success: false,
          message: `Field ${missingField} is required`,
        },
        {
          status: 400,
        }
      );
    }

    await connectMongoDB();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const result = await Order.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or no changes made",
        },
        {
          status: 404,
        }
      );
    }

    for (const item of body.items) {
      await updateAvailableQuantity(item.product.toString());
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
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
