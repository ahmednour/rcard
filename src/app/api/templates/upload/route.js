import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";
import { supabase } from "@/lib/supabase";

// POST /api/templates/upload — رفع صورة قالب
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WebP)" },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الملف يجب أن يكون أقل من 10 ميجابايت" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // إنشاء اسم فريد للملف
    const ext = file.name.split(".").pop();
    const fileName = `template-${Date.now()}.${ext}`;
    const storagePath = `templates/${fileName}`;

    // رفع الملف إلى Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "حدث خطأ أثناء رفع الملف" },
        { status: 500 }
      );
    }

    // الحصول على الرابط العام
    const { data: urlData } = supabase.storage
      .from("templates")
      .getPublicUrl(storagePath);

    const imagePath = urlData.publicUrl;

    return NextResponse.json({ imagePath }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الملف" },
      { status: 500 }
    );
  }
}
