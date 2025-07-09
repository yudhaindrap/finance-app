import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../services/api";
import TransactionCard from "../components/TransactionCard";
import FinanceCharts from "../components/FinanceCharts";
import exportToCSV from "../utils/exportToCSV";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data transaksi.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data kategori.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Berhasil logout.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transactions", form);
      setForm({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().slice(0, 10),
      });
      fetchTransactions();
      toast.success("Transaksi berhasil ditambahkan!");
    } catch (err) {
      toast.error("Gagal menambahkan transaksi.");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <ToastContainer />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-gray-500 text-sm mb-1">Pemasukan</p>
            <p className="text-green-600 text-2xl font-bold">
              Rp{totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-gray-500 text-sm mb-1">Pengeluaran</p>
            <p className="text-red-600 text-2xl font-bold">
              Rp{totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <p className="text-gray-500 text-sm mb-1">Saldo</p>
            <p className="text-blue-600 text-2xl font-bold">
              Rp{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Grafik Statistik */}
        <div className="mb-8 bg-white p-5 rounded-xl shadow">
          <FinanceCharts transactions={transactions} />
        </div>

        {/* Form Tambah Transaksi */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Tambah Transaksi</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value, category: "" })
              }
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories
                .filter((cat) => cat.type === form.type)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Jumlah"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />

            <input
              type="text"
              placeholder="Catatan (opsional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Simpan
            </button>
          </form>
        </div>

        {/* Daftar Transaksi */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Daftar Transaksi</h2>
            <button
              onClick={() => exportToCSV(transactions)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Export CSV
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-500">Belum ada transaksi.</p>
          ) : (
            transactions.map((tx) => (
              <TransactionCard key={tx._id} tx={tx} refresh={fetchTransactions} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
