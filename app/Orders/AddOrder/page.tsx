"use client";
import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";

interface OrderItem {
  product: string; // product id
  quantity: number;
  price: number;
  productName?: string;
}

interface OrderFormData {
  customer: {
    name: string;
    email: string;
    phone: string;
    province?: string;
    city?: string;
    address?: string;
    landmark?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderNote?: string;
}

interface Product {
  _id: string;
  name: string;
  selling_price: number;
}

const AddOrder: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    customer: {
      name: "",
      email: "",
      phone: "",
      province: "",
      city: "",
      address: "",
      landmark: "",
    },
    items: [],
    totalAmount: 0,
    orderStatus: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "COD",
    orderNote: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const result = await res.json();
        if (result && result.success) {
          setProducts(result.data);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate customer name
    if (!formData.customer.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    // Validate customer email
    if (!formData.customer.email.trim()) {
      newErrors.email = "Customer email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate customer phone
    if (!formData.customer.phone.trim()) {
      newErrors.phone = "Customer phone is required";
    } else if (!/^\d{10}$/.test(formData.customer.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    // Validate order items
    if (formData.items.length === 0) {
      newErrors.items = "At least one product is required";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.product.trim()) {
          newErrors[
            `item-${index}-product`
          ] = `Product selection is required for item ${index + 1}`;
        }
        if (item.quantity <= 0) {
          newErrors[
            `item-${index}-quantity`
          ] = `Quantity must be greater than 0 for item ${index + 1}`;
        }
        if (item.price <= 0) {
          newErrors[
            `item-${index}-price`
          ] = `Price must be greater than 0 for item ${index + 1}`;
        }
      });
    }

    // Validate total amount
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0";
    }

    // Validate order status
    if (!formData.orderStatus.trim()) {
      newErrors.orderStatus = "Order status is required";
    }

    // Validate payment status
    if (!formData.paymentStatus.trim()) {
      newErrors.paymentStatus = "Payment status is required";
    }

    // Validate payment method
    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = "Payment method is required";
    }

    // Validate other optional fields if necessary
    // ...

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      customer: { ...formData.customer, [name]: value },
    });
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]:
        name === "quantity" || name === "price" ? parseFloat(value) : value,
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotalAmount = () => {
    const total = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: total,
    }));
  };

  const addItem = () => {
    if (products.length > 0) {
      const product = products[0]; // Select the first product by default
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            product: product._id,
            quantity: 1,
            price: product.selling_price,
            productName: product.name,
          },
        ],
      });
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formData.items]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setMessage(`Order created: ${result}`);
      } else {
        const errorResponse = await res.json();
        if (typeof errorResponse === "string") {
          setMessage(`Failed to create order: ${errorResponse}`);
        } else {
          setMessage(
            `Failed to create order: ${JSON.stringify(errorResponse)}`
          );
        }
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Layout>
        <div className="p-5">
          <div className="flex gap-2 py-5 px-6 text-2xl fw-bold">
            <span>Back | </span>
            <h3 className="">Add Order</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-4">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="block fw-bold tracking-tight">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.customer.name}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="block fw-bold tracking-tight">
                  Customer Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.customer.email}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="block fw-bold tracking-tight">
                  Customer Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="province"
                  className="block fw-bold tracking-tight"
                >
                  Province
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.customer.province}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="block fw-bold tracking-tight">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.customer.city}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="address"
                  className="block fw-bold tracking-tight"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.customer.address}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="landmark"
                  className="block fw-bold tracking-tight"
                >
                  Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.customer.landmark}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="bg-white p-4">
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="product"
                  className="block fw-bold tracking-tight"
                >
                  Product
                </label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      id={`product-${index}`}
                      name="product"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                    <input
                      type="number"
                      id={`price-${index}`}
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
              >
                Add Product
              </button>
            </div>

            <div className="bg-white p-4">
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="totalAmount"
                  className="block fw-bold tracking-tight"
                >
                  Total Amount
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="orderStatus"
                  className="block fw-bold tracking-tight"
                >
                  Order Status
                </label>
                <select
                  id="orderStatus"
                  name="orderStatus"
                  value={formData.orderStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, orderStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="paymentStatus"
                  className="block fw-bold tracking-tight"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="paymentMethod"
                  className="block fw-bold tracking-tight"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="COD">COD</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="orderNote"
                  className="block fw-bold tracking-tight"
                >
                  Order Note
                </label>
                <textarea
                  id="orderNote"
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNote: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {message && (
              <div className="text-center text-red-500">{message}</div>
            )}
            <button
              type="submit"
              className="mt-5 ml-2 w-32 bg-green-500 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Order
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default AddOrder;
