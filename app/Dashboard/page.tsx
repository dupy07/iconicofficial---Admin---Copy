"use client"; // pages/dashboard.tsx
import { useEffect, useState } from "react";
import BarChart from "@/components/BarChart";
import Layout from "@/components/Layout";
import RecentOrder from "@/components/RecentOrder";
import Image from "next/image";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [resCategories, resProducts, resOrders] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);

        if (!resProducts.ok || !resCategories.ok || !resOrders.ok) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesResult, productsResult, ordersResult] =
          await Promise.all([
            resCategories.json(),
            resProducts.json(),
            resOrders.json(),
          ]);

        if (
          productsResult.success &&
          categoriesResult.success &&
          ordersResult.success
        ) {
          setProducts(productsResult.data);
          setCategories(categoriesResult.data);

          const orders: Order[] = ordersResult.data;

          // Filter orders to include only those that are paid and delivered
          const paidAndDeliveredOrders = orders.filter(
            (order) =>
              order.orderStatus === "Delivered" &&
              order.paymentStatus === "Paid"
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
          const stock = productsResult.data.reduce(
            (acc: number, product: Product) =>
              acc +
              product.variants.reduce(
                (variantAcc, variant) => variantAcc + variant.quantity,
                0
              ),
            0
          );
          setAvailableStock(stock);
        } else {
          throw new Error("Failed to fetch products or categories");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else {
      return "Good afternoon";
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <h1 className="font-semibold text-black dark:text-primary text-xl tracking-tight">
            {getGreeting()}
          </h1>
          <h1 className="pb-4 fs-300 tracking-tight text-black dark:text-primary">
            {" "}
            Here are your stats for today,{" "}
            <span className="text-[#8830f7] dark:text-[#ad85ff] tracking-tight">
              {getCurrentDate()}
            </span>
          </h1>
          <div className="pb-4 grid lg:grid-cols-3 gap-4">
            <div className="bg-secondary border flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
              <div className="flex flex-col w-full pb-4">
                <Image
                  src={"/revenue.png"}
                  alt="revenue"
                  width={40}
                  height={40}
                  className="pb-4"
                />
                <p className="text-[#adb5bd] pb-2"> Revenue</p>
                <p className="text-3xl font-bold text-primary">
                  रू {totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="bg-secondary border flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
              <div className="flex flex-col w-full pb-4">
                <Image
                  src={"/order.png"}
                  alt="revenue"
                  width={40}
                  height={40}
                  className="pb-4"
                />
                <p className="text-[#adb5bd] pb-2">Orders</p>
                <p className="text-3xl font-bold text-primary">{ordersCount}</p>
              </div>
            </div>
            <div className="bg-secondary border flex flex-col md:flex-row justify-between w-full p-4 rounded-lg">
              <div className="flex flex-col w-full pb-4">
                <Image
                  src={"/stock.png"}
                  alt="revenue"
                  width={40}
                  height={40}
                  className="pb-4"
                />
                <p className="text-[#adb5bd] pb-2"> Stock</p>
                <p className="text-3xl font-bold text-primary">
                  {availableStock}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            <BarChart />
            <RecentOrder />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
