import React from "react";
import Layout from "../components/Layout";

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the dashboard. This is where you can manage everything.</p>
    </Layout>
  );
};

export default DashboardPage;
