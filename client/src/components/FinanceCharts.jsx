import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";

const COLORS = ["#4ade80", "#f87171"]; // green for income, red for expense

export default function FinanceCharts({ transactions }) {
  const income = transactions.filter((t) => t.category?.type === "income");
  const expense = transactions.filter((t) => t.category?.type === "expense");

  const pieData = [
    {
      name: "Pemasukan",
      value: income.reduce((sum, t) => sum + Number(t.amount), 0),
    },
    {
      name: "Pengeluaran",
      value: expense.reduce((sum, t) => sum + Number(t.amount), 0),
    },
  ];

  // Bar chart data per kategori
  const categoryTotals = {};
  transactions.forEach((t) => {
    const catName = t.category?.name || "Tanpa Kategori";
    const catKey = `${t.category?.type === "income" ? "P+" : "K-"} ${catName}`;
    categoryTotals[catKey] = (categoryTotals[catKey] || 0) + Number(t.amount);
  });

  const barData = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
  }));

  // Line chart data: monthly trend
  const monthlyMap = {};
  transactions.forEach((t) => {
    const month = dayjs(t.date).format("YYYY-MM");
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, income: 0, expense: 0 };
    }
    if (t.category?.type === "income") {
      monthlyMap[month].income += Number(t.amount);
    } else if (t.category?.type === "expense") {
      monthlyMap[month].expense += Number(t.amount);
    }
  });

  const monthlyData = Object.values(monthlyMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {/* Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-2">Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => `Rp${Number(val).toLocaleString("id-ID")}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-2">Total per Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(val) => `Rp${Number(val).toLocaleString("id-ID")}`}
            />
            <Legend />
            <Bar dataKey="total" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-4 shadow rounded col-span-2">
        <h2 className="text-lg font-bold mb-2">Monthly Trend</h2>
        {monthlyData.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada data bulanan.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(val) => `Rp${Number(val).toLocaleString("id-ID")}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4ade80"
                name="Pemasukan"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                name="Pengeluaran"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
