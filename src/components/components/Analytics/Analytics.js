import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Analytics({ bookings }) {
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);

  const monthlyRevenue = Object.values(
    bookings.reduce((acc, b) => {
      if (!b.date) return acc;
      const month = new Date(b.date).toLocaleString("default", { month: "short" });

      if (!acc[month]) acc[month] = { name: month, revenue: 0 };
      acc[month].revenue += Number(b.price || 0);

      return acc;
    }, {})
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>📊 Analytics</h2>

      <h3>💰 Revenue: R{totalRevenue}</h3>

      <BarChart width={400} height={250} data={monthlyRevenue}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" />
      </BarChart>
    </div>
  );
}