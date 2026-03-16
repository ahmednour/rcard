"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TemplateManagerPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#84923a]"></div>
      </div>
    }>
      <TemplateManager />
    </Suspense>
  );
}

function TemplateManager() {
  const searchParams = useSearchParams();
  const initialOccasionId = searchParams.get("occasionId") || "";

  const [occasions, setOccasions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedOccasionId, setSelectedOccasionId] = useState(initialOccasionId);
  const [loading, setLoading] = useState(false);

  // فورم القالب الجديد
  const [uploading, setUploading] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [form, setForm] = useState({
    nameX: 0, nameY: 700, deptX: 0, deptY: 740,
    fontSize: 36, fontColor: "#f98500", fontFamily: "Alexandria",
    deptFontSize: 26, deptFontColor: "#8f5c22", deptFontFamily: "Alexandria",
  });
  const [saving, setSaving] = useState(false);
  const [previewName, setPreviewName] = useState("محمد أحمد");
  const [previewDept, setPreviewDept] = useState("إدارة تقنية المعلومات");

  // القالب اللي بنعدله
  const [editingTemplate, setEditingTemplate] = useState(null);

  const canvasRef = useRef(null);
  const loadedImageRef = useRef(null); // كاش الصورة المحملة

  // جلب المناسبات
  useEffect(() => {
    fetch("/api/occasions?all=true")
      .then((r) => r.json())
      .then(setOccasions)
      .catch(console.error);
  }, []);

  // جلب القوالب عند اختيار مناسبة
  useEffect(() => {
    if (!selectedOccasionId) { setTemplates([]); return; }
    setLoading(true);
    fetch(`/api/templates?occasionId=${selectedOccasionId}`)
      .then((r) => r.json())
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedOccasionId]);

  // تحميل الصورة مرة واحدة عند تغيير المصدر
  const imgSrc = editingTemplate ? editingTemplate.imagePath : uploadedImagePath;

  useEffect(() => {
    if (!imgSrc) {
      loadedImageRef.current = null;
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      loadedImageRef.current = img;
      drawCanvas();
    };
    img.src = imgSrc;
  }, [imgSrc]);

  // رسم الكانفاس فوراً من الصورة المخزنة
  const drawCanvas = useCallback(() => {
    const img = loadedImageRef.current;
    if (!canvasRef.current || !img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const currentForm = editingTemplate
      ? { ...editingTemplate, ...form }
      : form;

    // رسم الاسم + النقطة الحمراء
    if (previewName) {
      ctx.font = `bold ${currentForm.fontSize}px ${currentForm.fontFamily}`;
      ctx.fillStyle = currentForm.fontColor;
      ctx.textAlign = "center";
      const nameX = canvas.width / 2 + currentForm.nameX;
      const nameY = (canvas.height + currentForm.nameY) / 2;
      ctx.fillText(previewName, nameX, nameY);

      ctx.beginPath();
      ctx.arc(nameX, nameY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // رسم الإدارة + النقطة الزرقاء
    if (previewDept) {
      ctx.font = `${currentForm.deptFontSize}px ${currentForm.deptFontFamily}`;
      ctx.fillStyle = currentForm.deptFontColor;
      ctx.textAlign = "center";
      const deptX = canvas.width / 2 + currentForm.deptX;
      const deptY = (canvas.height + currentForm.deptY) / 2;
      ctx.fillText(previewDept, deptX, deptY);

      ctx.beginPath();
      ctx.arc(deptX, deptY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [editingTemplate, form, previewName, previewDept]);

  // إعادة رسم الكانفاس فوراً عند أي تغيير
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // رفع صورة
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/templates/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      setUploadedImagePath(data.imagePath);
    } catch {
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  // حفظ قالب جديد
  const handleSave = async () => {
    if (!selectedOccasionId) { alert("يرجى اختيار المناسبة"); return; }
    if (!uploadedImagePath) { alert("يرجى رفع صورة القالب أولاً"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasionId: selectedOccasionId,
          imagePath: uploadedImagePath,
          ...form,
          order: templates.length,
        }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      setUploadedImagePath("");
      setForm({ nameX: 0, nameY: 700, deptX: 0, deptY: 740, fontSize: 36, fontColor: "#f98500", fontFamily: "Alexandria", deptFontSize: 26, deptFontColor: "#8f5c22", deptFontFamily: "Alexandria" });
      const tRes = await fetch(`/api/templates?occasionId=${selectedOccasionId}`);
      setTemplates(await tRes.json());
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  // تعديل قالب
  const startEdit = (t) => {
    setEditingTemplate(t);
    setForm({
      nameX: t.nameX, nameY: t.nameY,
      deptX: t.deptX, deptY: t.deptY,
      fontSize: t.fontSize, fontColor: t.fontColor, fontFamily: t.fontFamily,
      deptFontSize: t.deptFontSize ?? 26, deptFontColor: t.deptFontColor ?? "#8f5c22", deptFontFamily: t.deptFontFamily ?? "Alexandria",
    });
  };

  const handleUpdate = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error); return; }
      setEditingTemplate(null);
      const tRes = await fetch(`/api/templates?occasionId=${selectedOccasionId}`);
      setTemplates(await tRes.json());
    } catch {
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    await fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    const tRes = await fetch(`/api/templates?occasionId=${selectedOccasionId}`);
    setTemplates(await tRes.json());
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القالب؟")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    const tRes = await fetch(`/api/templates?occasionId=${selectedOccasionId}`);
    setTemplates(await tRes.json());
  };

  const handleOrderChange = async (id, newOrder) => {
    await fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    const tRes = await fetch(`/api/templates?occasionId=${selectedOccasionId}`);
    setTemplates(await tRes.json());
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const showPreview = uploadedImagePath || editingTemplate;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة القوالب</h1>
        <div className="flex gap-2">
          <Link href="/admin/occasions" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            إدارة المناسبات
          </Link>
          <Link href="/admin" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            لوحة التحكم
          </Link>
        </div>
      </div>

      {/* اختيار المناسبة */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium mb-2">اختر المناسبة</label>
        <select
          value={selectedOccasionId}
          onChange={(e) => { setSelectedOccasionId(e.target.value); setEditingTemplate(null); }}
          className="w-full border rounded-lg p-2"
        >
          <option value="">-- اختر مناسبة --</option>
          {occasions.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      {selectedOccasionId && (
        <>
          {/* رفع قالب جديد */}
          {!editingTemplate && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">رفع قالب جديد</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">صورة القالب</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="border rounded-lg p-2 w-full"
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">جاري الرفع...</p>}
              </div>
            </div>
          )}

          {/* محرر الإحداثيات + Preview */}
          {showPreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* الإعدادات */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                  {editingTemplate ? "تعديل إحداثيات القالب" : "إعدادات القالب"}
                </h2>

                {/* اسم وإدارة تجريبية */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium mb-1">اسم تجريبي</label>
                    <input type="text" value={previewName} onChange={(e) => setPreviewName(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">إدارة تجريبية</label>
                    <input type="text" value={previewDept} onChange={(e) => setPreviewDept(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                  </div>
                </div>

                {/* إحداثيات الاسم */}
                <fieldset className="border border-red-200 rounded-lg p-3 mb-3">
                  <legend className="text-sm font-medium px-2 text-red-600">الاسم (النقطة الحمراء)</legend>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs mb-1">إزاحة X (من المنتصف)</label>
                      <input type="number" value={form.nameX} onChange={(e) => updateForm("nameX", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={-500} max={500} value={form.nameX} onChange={(e) => updateForm("nameX", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">إزاحة Y</label>
                      <input type="number" value={form.nameY} onChange={(e) => updateForm("nameY", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={-500} max={1500} value={form.nameY} onChange={(e) => updateForm("nameY", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs mb-1">حجم الخط</label>
                      <input type="number" value={form.fontSize} onChange={(e) => updateForm("fontSize", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={12} max={120} value={form.fontSize} onChange={(e) => updateForm("fontSize", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">اللون</label>
                      <input type="color" value={form.fontColor} onChange={(e) => updateForm("fontColor", e.target.value)} className="w-full h-8 border rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">نوع الخط</label>
                      <select value={form.fontFamily} onChange={(e) => updateForm("fontFamily", e.target.value)} className="w-full border rounded p-1.5 text-sm">
                        <option value="Alexandria">Alexandria</option>
                        <option value="Arial">Arial</option>
                        <option value="Tahoma">Tahoma</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* إحداثيات الإدارة */}
                <fieldset className="border border-blue-200 rounded-lg p-3 mb-4">
                  <legend className="text-sm font-medium px-2 text-blue-600">الإدارة (النقطة الزرقاء)</legend>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs mb-1">إزاحة X (من المنتصف)</label>
                      <input type="number" value={form.deptX} onChange={(e) => updateForm("deptX", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={-500} max={500} value={form.deptX} onChange={(e) => updateForm("deptX", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">إزاحة Y</label>
                      <input type="number" value={form.deptY} onChange={(e) => updateForm("deptY", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={-500} max={1500} value={form.deptY} onChange={(e) => updateForm("deptY", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs mb-1">حجم الخط</label>
                      <input type="number" value={form.deptFontSize} onChange={(e) => updateForm("deptFontSize", Number(e.target.value))} className="w-full border rounded p-1.5 text-sm" />
                      <input type="range" min={12} max={120} value={form.deptFontSize} onChange={(e) => updateForm("deptFontSize", Number(e.target.value))} className="w-full mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">اللون</label>
                      <input type="color" value={form.deptFontColor} onChange={(e) => updateForm("deptFontColor", e.target.value)} className="w-full h-8 border rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">نوع الخط</label>
                      <select value={form.deptFontFamily} onChange={(e) => updateForm("deptFontFamily", e.target.value)} className="w-full border rounded p-1.5 text-sm">
                        <option value="Alexandria">Alexandria</option>
                        <option value="Arial">Arial</option>
                        <option value="Tahoma">Tahoma</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* أزرار */}
                <div className="flex gap-2">
                  {editingTemplate ? (
                    <>
                      <button onClick={handleUpdate} disabled={saving} className="bg-[#83923b] text-white px-4 py-2 rounded-lg hover:bg-[#6b7830] disabled:opacity-50 flex-1">
                        {saving ? "جاري التحديث..." : "تحديث القالب"}
                      </button>
                      <button onClick={() => setEditingTemplate(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button onClick={handleSave} disabled={saving || !uploadedImagePath} className="bg-[#83923b] text-white px-4 py-2 rounded-lg hover:bg-[#6b7830] disabled:opacity-50 flex-1">
                      {saving ? "جاري الحفظ..." : "حفظ القالب"}
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">معاينة حية</h2>
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border rounded-lg"
                  style={{ maxHeight: "500px", objectFit: "contain" }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-1 align-middle"></span> موضع الاسم
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-3 ml-1 align-middle"></span> موضع الإدارة
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  استخدم الأشرطة المنزلقة لتحريك النقاط بشكل حي
                </p>
              </div>
            </div>
          )}

          {/* جدول القوالب الموجودة */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">القوالب الحالية ({templates.length})</h2>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#84923a]"></div>
              </div>
            ) : templates.length === 0 ? (
              <p className="text-gray-500 text-center py-6">لا توجد قوالب لهذه المناسبة</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((t, idx) => (
                  <div key={t.id} className={`border rounded-lg p-3 ${!t.isActive ? "opacity-50" : ""} ${editingTemplate?.id === t.id ? "ring-2 ring-[#83923b]" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.imagePath}
                      alt={`قالب ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <div className="text-xs text-gray-500 mb-2">
                      ترتيب: {t.order} | خط: {t.fontSize}px | لون: {t.fontColor}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => startEdit(t)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        تعديل
                      </button>
                      <button onClick={() => handleToggle(t.id, t.isActive)} className={`text-xs px-2 py-1 rounded ${t.isActive ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                        {t.isActive ? "تعطيل" : "تفعيل"}
                      </button>
                      <button onClick={() => handleDeleteTemplate(t.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                        حذف
                      </button>
                      {idx > 0 && (
                        <button onClick={() => handleOrderChange(t.id, t.order - 1)} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">↑</button>
                      )}
                      {idx < templates.length - 1 && (
                        <button onClick={() => handleOrderChange(t.id, t.order + 1)} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">↓</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
