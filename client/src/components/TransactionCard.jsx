import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

export default function TransactionCard({ tx, refresh }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...tx });
  const [categories, setCategories] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const confirmDelete = () => {
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/transactions/${tx._id}`);
      toast.success("Transaction deleted");
      setShowConfirm(false);
      refresh();
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/transactions/${tx._id}`, {
        ...form,
        category: form.category,
        type: form.type,
      });
      setEditMode(false);
      toast.success("Transaction updated");
      refresh();
    } catch (err) {
      toast.error("Failed to update transaction");
      console.error(err);
    }
  };

  if (editMode) {
    return (
      <form
        onSubmit={handleEdit}
        className="border p-3 mb-2 rounded bg-yellow-100 shadow space-y-2"
      >
        <select
          className="border p-1 w-full rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>

        <input
          className="border p-1 w-full rounded"
          value={form.note || ""}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <input
          className="border p-1 w-full rounded"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />

        <input
          className="border p-1 w-full rounded"
          type="date"
          value={form.date?.slice(0, 10)}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 px-3 py-1 rounded text-white"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => {
              setEditMode(false);
              setForm({ ...tx });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const isIncome = tx.category?.type === "income";

  return (
    <>
      <div className="border p-3 mb-2 rounded bg-white shadow flex justify-between items-center">
        <div>
          <div className="font-bold">{tx.category?.name || "No Category"}</div>
          {tx.note && <div className="text-sm text-gray-500">{tx.note}</div>}
          <div className="text-xs text-gray-400">
            {new Date(tx.date).toLocaleDateString()}
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-lg font-semibold ${
              isIncome ? "text-green-500" : "text-red-500"
            }`}
          >
            {isIncome ? "+" : "-"} Rp
            {Number(tx.amount).toLocaleString("id-ID")}
          </div>

          <div className="space-x-2 text-sm mt-1">
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={confirmDelete}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Hapus Transaksi</h2>
            <p className="text-gray-700 mb-6">
              Apakah kamu yakin ingin menghapus transaksi ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
