"use client";
import React, { useEffect, useState } from "react";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface Item {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: Customer;
  items: Item[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
}

interface Product {
  _id: string;
  name: string;
}

interface UpdateOrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (updatedOrder: Order) => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  order,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Order>({ ...order });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : "Unknown Product";
  };

  const totalAmount = formData.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl md:w-1/3 lg:w-1/3 relative h-[700px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-4">Update Order</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="mb-4">
              <label
                htmlFor="customer-name"
                className="block text-gray-700 mb-2"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customer-name"
                name="name"
                value={formData.customer.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer: { ...formData.customer, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            {/* Customer Email */}
            <div className="mb-4">
              <label
                htmlFor="customer-email"
                className="block text-gray-700 mb-2"
              >
                Customer Email
              </label>
              <input
                type="email"
                id="customer-email"
                name="email"
                value={formData.customer.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer: { ...formData.customer, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            {/* Customer Phone */}
            <div className="mb-4">
              <label
                htmlFor="customer-phone"
                className="block text-gray-700 mb-2"
              >
                Customer Phone
              </label>
              <input
                type="tel"
                id="customer-phone"
                name="phone"
                value={formData.customer.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer: { ...formData.customer, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            {/* Order Status */}
            <div className="mb-4">
              <label htmlFor="orderStatus" className="block text-gray-700 mb-2">
                Order Status
              </label>
              <select
                id="orderStatus"
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {/* Payment Status */}
            <div className="mb-4">
              <label
                htmlFor="paymentStatus"
                className="block text-gray-700 mb-2"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            {/* Payment Method */}
            <div className="mb-4">
              <label
                htmlFor="paymentMethod"
                className="block text-gray-700 mb-2"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          {/* Items */}
          {formData.items.map((item, index) => (
            <div key={index} className="mb-4 border p-4 rounded-lg">
              <h5 className="text-lg font-semibold mb-2">Item {index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product */}
                <div className="mb-2">
                  <label
                    htmlFor={`item-product-${index}`}
                    className="block text-gray-700"
                  >
                    Product
                  </label>
                  <select
                    id={`item-product-${index}`}
                    name="product"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Quantity */}
                <div className="mb-2">
                  <label
                    htmlFor={`item-quantity-${index}`}
                    className="block text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`item-quantity-${index}`}
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Price */}
                <div className="mb-2">
                  <label
                    htmlFor={`item-price-${index}`}
                    className="block text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id={`item-price-${index}`}
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Total Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Amount</label>
            <input
              type="number"
              value={totalAmount}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-200"
            />
          </div>

          {/* Update button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
