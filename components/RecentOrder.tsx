"use client";
import React, { useState, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface Order {
  _id: string;
  customer: {
    name: string;
  };
  totalAmount: number;
  createdDate: string; // Ensure createdDate is in ISO 8601 format
}

const RecentOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resOrders = await fetch("/api/orders");

        if (!resOrders.ok) {
          throw new Error("Failed to fetch data");
        }

        const ordersResult = await resOrders.json();

        if (ordersResult.success) {
          setOrders(ordersResult.data);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] p-4 m-auto border rounded-lg bg-background overflow-scroll">
      <h1 className="text-xl font-bold mb-4">Recent Orders</h1>
      <ul>
        {orders.map((order) => (
          <li
            key={order._id}
            className="flex items-center justify-between p-4 mb-2 border-b"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <FaShoppingBag className="text-purple-800" />
              </div>
              <div className="pl-4">
                <p className="font-bold text-gray-800">
                  रू {order.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">{order.customer.name}</p>
              </div>
            </div>
            <p className="text-sm">
              {formatDistanceToNow(new Date(order.createdDate), {
                addSuffix: true,
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrder;
