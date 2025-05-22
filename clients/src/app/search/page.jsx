"use client";
import { useState } from "react";
import { FaSearch, FaCheckCircle } from "react-icons/fa";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<
    { name: string; entries: string[] }[]
  >([]);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    // مثال بيانات ثابتة (بدّلها بـ API لاحقًا)
    const dummyResults = [
      { name: "الرقة", entries: ["قيادة المزرعة"] },
      { name: "الطبقة", entries: ["كومين هاركل"] },
    ];

    if (input.trim()) {
      setResults(dummyResults);
      setSuccess(true);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    const text = results
      .map((r) => `${r.name}: ${r.entries.join(", ")}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleWhatsAppCopy = () => {
    const text = results
      .map((r) => `${r.name}: ${r.entries.join(", ")}`)
      .join("\n");
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">البحث عن عناوين IP</h3>

      {success && (
        <div className="alert alert-success d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          تم جلب النتائج بنجاح.
        </div>
      )}

      <p>مفصولة بمسافات أو كلمات IP أدخل عناوين</p>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="مثال: 168.122 168.45"
        />
        <button className="btn btn-danger" onClick={() => setInput("")}>
          ✖
        </button>
      </div>

      <button className="btn btn-success w-100 mb-3" onClick={handleSearch}>
        <FaSearch className="me-2" />
        بحث
      </button>

      {results.length > 0 && (
        <div className="mt-4">
          <label className="fw-bold mb-2 d-block">النتائج:</label>

          <div className="d-flex gap-2 mb-2">
            <button className="btn btn-outline-secondary" onClick={handleCopy}>
              نسخ
            </button>
            <button
              className="btn btn-success text-white"
              onClick={handleWhatsAppCopy}
            >
              نسخ للواتساب
            </button>
          </div>

          <div className="border p-3 rounded bg-light">
            {results.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="fw-bold">{item.name}:</div>
                <div>
                  {item.entries.map((entry, idx) => (
                    <span key={idx} className="badge bg-danger me-1">
                      {entry}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
        }
