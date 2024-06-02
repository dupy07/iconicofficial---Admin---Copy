import BarChart from "@/components/BarChart";
import Layout from "@/components/Layout";
import RecentOrder from "@/components/RecentOrder";

const Analytics = () => {
  return (
    <div>
      <Layout>
        <h1 className="pb-4 fw-bold text-3xl">Analytics</h1>
        <div className=" grid md:grid-cols-3 grid-cols-1 gap-4">
          <BarChart />
          <RecentOrder />
        </div>
      </Layout>
    </div>
  );
};

export default Analytics;
