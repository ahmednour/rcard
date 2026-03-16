"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OccasionsManagement() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);

  const fetchOccasions = () => {
    setLoading(true);
    fetch("/api/occasions?all=true")
      .then((r) => r.json())
      .then((data) => setOccasions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOccasions(); }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", startDate: "", endDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/occasions/${editingId}` : "/api/occasions";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "حدث خطأ");
        return;
      }
      resetForm();
      fetchOccasions();
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (o) => {
    setForm({
      name: o.name,
      slug: o.slug,
      startDate: o.startDate.split("T")[0],
      endDate: o.endDate.split("T")[0],
    });
    setEditingId(o.id);
    setShowForm(true);
  };

  const handleToggle = async (id, isActive) => {
    await fetch(`/api/occasions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchOccasions();
  };

  const handleDelete = async (id, name) => {
    if (!confirm("هل أنت متأكد من حذف " + name + "؟ سيتم حذف كل القوالب المرتبطة بها.")) return;
    await fetch(`/api/occasions/${id}`, { method: "DELETE" });
    fetchOccasions();
  };

  // تحويل الاسم لـ slug تلقائياً
  const handleNameChange = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0621-\u064A-]/g, ""),
    }));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المناسبات</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-[#83923b] text-white px-4 py-2 rounded-lg hover:bg-[#6b7830]"
          >
            {showForm ? "إلغاء" : "إضافة مناسبة"}
          </button>
          <Link href="/admin" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>

      {/* فورم الإضافة/التعديل */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "تعديل المناسبة" : "إضافة مناسبة جديدة"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المناسبة</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
                placeholder="مثال: عيد الفطر المبارك ١٤٤٧"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرابط (slug)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full border rounded-lg p-2"
                required
                dir="ltr"
                placeholder="مثال: eid-alfitr-1447"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ البداية</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ النهاية</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 bg-[#83923b] text-white px-6 py-2 rounded-lg hover:bg-[#6b7830] disabled:opacity-50">
            {saving ? "جاري الحفظ..." : editingId ? "تحديث" : "إضافة"}
          </button>
        </form>
      )}

      {/* جدول المناسبات */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#84923a]"></div>
        </div>
      ) : occasions.length === 0 ? (
        <p className="text-center text-gray-500 py-10">لا توجد مناسبات. اضغط &laquo;إضافة مناسبة&raquo; للبدء.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-3 text-sm font-medium">المناسبة</th>
                <th className="text-right p-3 text-sm font-medium">الرابط</th>
                <th className="text-center p-3 text-sm font-medium">القوالب</th>
                <th className="text-center p-3 text-sm font-medium">الفترة</th>
                <th className="text-center p-3 text-sm font-medium">الحالة</th>
                <th className="text-center p-3 text-sm font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {occasions.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{o.name}</td>
                  <td className="p-3 text-sm text-gray-500" dir="ltr">{o.slug}</td>
                  <td className="p-3 text-center">
                    <Link href={`/admin/templates/new?occasionId=${o.id}`} className="text-blue-600 hover:underline">
                      {o.templateCount || 0} قالب
                    </Link>
                  </td>
                  <td className="p-3 text-center text-sm text-gray-500">
                    {new Date(o.startDate).toLocaleDateString("ar-SA")} — {new Date(o.endDate).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggle(o.id, o.isActive)}
                      className={`text-xs px-3 py-1 rounded-full ${o.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {o.isActive ? "نشط" : "معطل"}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(o)} className="text-blue-600 hover:underline text-sm">تعديل</button>
                      <button onClick={() => handleDelete(o.id, o.name)} className="text-red-600 hover:underline text-sm">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
