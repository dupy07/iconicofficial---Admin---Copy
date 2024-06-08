"use client"; // pages/dashboard.tsx
import { useEffect, useState } from "react";
import BarChart from "@/components/BarChart";
import Layout from "@/components/Layout";
import RecentOrder from "@/components/RecentOrder";

interface Order {
  _id: string;
  totalAmount: number;
  discount: number;
  additionalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdDate?: string;
}

interface Variant {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

interface Product {
  _id: string;
  availableQuantity: number;
  variants: Variant[];
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resOrders, resCategories] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/categories"),
        ]);

        if (!resProducts.ok) throw new Error("Failed to fetch products");
        if (!resOrders.ok) throw new Error("Failed to fetch orders");
        if (!resCategories.ok) throw new Error("Failed to fetch categories");

        const [productsData, ordersData, categoriesData] = await Promise.all([
          resProducts.json(),
          resOrders.json(),
          resCategories.json(),
        ]);

        if (!productsData.success) throw new Error("Failed to fetch products");
        if (!ordersData.success) throw new Error("Failed to fetch orders");
        if (!categoriesData.success)
          throw new Error("Failed to fetch categories");

        const products: Product[] = productsData.data;
        const orders: Order[] = ordersData.data;
        const categories: Category[] = categoriesData.data;

        // Filter orders to include only those that are paid and delivered
        const paidAndDeliveredOrders = orders.filter(
          (order) =>
            order.orderStatus === "Delivered" && order.paymentStatus === "Paid"
        );

        // Calculate total revenue
        const revenue = paidAndDeliveredOrders.reduce(
          (acc, order) => acc + order.totalAmount,
          0
        );
        setTotalRevenue(revenue);

        // Calculate orders count
        setOrdersCount(orders.length);

        // Calculate available stock
        const stock = products.reduce(
          (acc, product) =>
            acc +
            product.variants.reduce(
              (variantAcc, variant) => variantAcc + variant.quantity,
              0
            ),
          0
        );
        setAvailableStock(stock);

        setLoading(false);
      } catch (error: any) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <h1 className="pb-5 font-bold text-3xl">Dashboard</h1>
      <div className="pb-4 grid lg:grid-cols-3 gap-4">
        <div className="bg-white flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">रू {totalRevenue.toFixed(2)}</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <div className="flex justify-center items-center p-2 rounded-lg bg-green-200">
            <span className="text-green-700 text-lg">+#%</span>
          </div>
        </div>
        <div className="bg-white flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">{ordersCount}</p>
            <p className="text-gray-600">Orders</p>
          </div>
          <div className="flex justify-center items-center p-2 rounded-lg bg-green-200">
            <span className="text-green-700 text-lg">+#%</span>
          </div>
        </div>
        <div className="bg-white flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">{availableStock}</p>
            <p className="text-gray-600">Total Stock</p>
          </div>
          <div className="flex justify-center items-center p-2 rounded-lg bg-green-200">
            <span className="text-green-700 text-lg">+#%</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
        <BarChart />
        <RecentOrder />
      </div>
    </Layout>
  );
};

export default Dashboard;
