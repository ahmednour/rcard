import React, { useState } from "react";

const TrackingSystemHelp = () => {
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleQuestion = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs = [
    {
      id: "data-collected",
      question: "ما البيانات التي يتم جمعها عند تحميل البطاقة؟",
      answer: `يتم جمع بيانات أساسية فقط مثل توقيت التحميل، نوع الجهاز، المتصفح، ونظام التشغيل. 
      لا يتم جمع أي بيانات شخصية أو معلومات تعريفية من المستخدم. نحن نحترم خصوصيتك تمامًا.`,
    },
    {
      id: "feedback-purpose",
      question: "كيف يتم استخدام بيانات التقييم والتعليقات؟",
      answer: `يتم استخدام التقييمات والتعليقات لتحسين جودة البطاقات وتطوير تجربة المستخدم.
      تساعدنا آراؤك في فهم احتياجاتك بشكل أفضل وتطوير محتوى يناسب تطلعاتك.`,
    },
    {
      id: "data-storage",
      question: "أين يتم تخزين البيانات؟",
      answer: `يتم تخزين جميع البيانات محليًا في متصفحك فقط (Local Storage). 
      لا يتم إرسال أي بيانات إلى خوادم خارجية أو طرف ثالث.
      عند مسح بيانات المتصفح الخاص بك، سيتم حذف هذه البيانات.`,
    },
    {
      id: "milestones",
      question: "ما هي الإنجازات التي يتم الاحتفال بها؟",
      answer: `نحتفل بإنجازات تحميل البطاقات عندما نصل إلى أرقام مميزة مثل 10 أو 50 أو 100 تحميل.
      هذه الاحتفالات هي طريقتنا لشكرك على دعمك المستمر واستخدامك للبطاقات.`,
    },
    {
      id: "browser-support",
      question: "هل تعمل جميع الميزات على كافة المتصفحات؟",
      answer: `نعم، تم تصميم نظام التتبع والتحميل ليعمل على جميع المتصفحات الحديثة مثل Chrome وSafari وFirefox وEdge.
      قد تختلف بعض التفاصيل البصرية قليلاً بين المتصفحات، لكن الوظائف الأساسية متوافقة تمامًا.`,
    },
    {
      id: "share-support",
      question: "هل يمكنني مشاركة البطاقة مباشرة على وسائل التواصل الاجتماعي؟",
      answer: `نعم، بعد تحميل البطاقة، ستظهر لك خيارات المشاركة المباشرة على منصات مختلفة 
      مثل WhatsApp وTwitter وFacebook وغيرها. كما يمكنك نسخ الرابط ومشاركته بأي طريقة تفضلها.`,
    },
    {
      id: "privacy",
      question: "كيف تحافظون على خصوصية المستخدمين؟",
      answer: `نحن نلتزم بأعلى معايير الخصوصية. لا نقوم بجمع أي معلومات شخصية أو تعريفية.
      البيانات المجمعة تكون مجهولة المصدر تمامًا وتستخدم فقط لأغراض تحسين الخدمة.
      نحن لا نشارك أي بيانات مع أطراف ثالثة.`,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-6">
        الأسئلة الشائعة حول نظام التتبع والتحميل
      </h3>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-50 text-right"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-200 ${
                  expandedQuestions[faq.id] ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedQuestions[faq.id] && (
              <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <h4 className="text-base font-medium text-green-800 mb-2">
          هل لديك استفسار آخر؟
        </h4>
        <p className="text-sm text-green-700">
          إذا كان لديك أي استفسارات أخرى حول نظام التتبع أو تحميل البطاقات، لا
          تتردد في التواصل معنا عبر:
        </p>
        <div className="mt-2 flex items-center text-sm text-green-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>support@amana-card.example.com</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingSystemHelp;
