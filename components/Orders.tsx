"use client";
import { useEffect, useState } from "react";
import UpdateOrderModal from "./UpdateOrderModal";
import { useRouter } from "next/navigation";

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
  createdDate?: string; // Optional createdAt field
}

const OrderComponent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const router = useRouter();

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

  async function deleteOrder(orderId: string) {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete order: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete order");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error: any) {
      console.error("Error deleting order:", error.message);
      setError(error.message);
    }
  }

  // Update Function
  const openUpdateModal = (order: Order) => {
    setCurrentOrder(order);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const res = await fetch(`/api/orders?id=${updatedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) {
        throw new Error(`Failed to update order: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      closeUpdateModal();
    } catch (error: any) {
      console.error("Error updating order:", error.message);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="">
        <h3 className="text-xl sm:text-2xl font-bold pb-2">Orders</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-3 pb-8">
          <div className="flex gap-2">
            <button className="bg-green-400 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
              Active
            </button>
            <button className="bg-green-400 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
              Pending
            </button>
            <button className="bg-green-400 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg">
              Completed
            </button>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="bg-green-500 text-white px-3 py-2 rounded-lg"
              onClick={() => router.push("/Orders/AddOrder")}
            >
              Add Order
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="border-b text-xs sm:text-base font-semibold">
              <tr>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">#</th>
                <th className="w-3/16 px-2 sm:px-4 py-2 sm:py-4 text-left">
                  Customer Name
                </th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">Email</th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">Phone</th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">
                  Total Amount
                </th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">
                  Order Status
                </th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">
                  Payment Status
                </th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">
                  Payment Method
                </th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">Created At</th>
                <th className="w-1/16 px-2 sm:px-4 py-2 sm:py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="text-center border-b hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-2 sm:px-5 py-2 sm:py-3">{index + 1}</td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3 text-left"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.customer.name}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.customer.email}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.customer.phone}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    रू {order.totalAmount.toFixed(2)}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.orderStatus}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.paymentStatus}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.paymentMethod}
                  </td>
                  <td
                    className="px-2 sm:px-5 py-2 sm:py-3"
                    onClick={() => openUpdateModal(order)}
                  >
                    {order.createdDate
                      ? new Date(order.createdDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-5 py-2 sm:py-3">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="bg-red-500 text-white px-2 sm:px-5 py-2 sm:py-3 rounded-lg mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openUpdateModal(order)}
                      className="bg-green-400 text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isUpdateModalOpen && currentOrder && (
          <UpdateOrderModal
            order={currentOrder}
            onClose={closeUpdateModal}
            onUpdate={handleUpdateOrder}
          />
        )}
      </div>
    </>
  );
};

export default OrderComponent;
