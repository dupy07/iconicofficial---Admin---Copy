// pages/products.tsx

import BarChart from "@/components/BarChart";
import Layout from "@/components/Layout";
import RecentOrder from "@/components/RecentOrder";

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="p-5 fw-bold text-3xl">Dashboard</h1>
      <div className="grid lg:grid-cols-5 gap-4 p-4">
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold ">123</p>
            <p className="text-gray-600">Daily Revenue</p>
          </div>
          <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
            <span className="text-green-700 text-lg">+18%</span>
          </p>
        </div>
        <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold ">123</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
            <span className="text-green-700 text-lg">+18%</span>
          </p>
        </div>
        <div className=" bg-white flex justify-between w-full border  p-4 rounded-lg">
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold ">123</p>
            <p className="text-gray-600">Total Stock left</p>
          </div>
          <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
            <span className="text-green-700 text-lg">+18%</span>
          </p>
        </div>
      </div>
      <div className="p-5 grid md:grid-cols-3 grid-cols-1 gap-4">
        <BarChart />
        <RecentOrder />
      </div>
    </Layout>
  );
};

export default Dashboard;
