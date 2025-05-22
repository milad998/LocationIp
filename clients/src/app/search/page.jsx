"use client";

import { useState } from "react";
import { FaSearch, FaWhatsapp, FaCopy } from "react-icons/fa";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    const addresses = input.split(/\s+/).filter(Boolean);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ addresses }),
      });
      const data = await res.json();
      setResults(data);
      setSuccess(true);
      setCopied(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setSuccess(false);
    }
  };

  const handleCopy = (toWhatsapp = false) => {
    const text = results
      .map(
        (r) =>
          `${r.name}:\n` + r.entries.map((e) => `• ${e}`).join("\n")
      )
      .join("\n\n");

    navigator.clipboard.writeText(text);
    setCopied(true);

    if (toWhatsapp) {
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappURL, "_blank");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-3">البحث عن عناوين IP</h3>

      {success && (
        <div className="alert alert-success text-center">
          تم جلب النتائج بنجاح.
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">مفصولة بمسافات أو كلمات IP أدخل عناوين</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
        />
      </div>

      <button onClick={handleSearch} className="btn btn-success w-100 mb-3">
        <FaSearch /> بحث
      </button>

      {results.length > 0 && (
        <>
          <div className="mb-3 d-flex gap-2">
            <button onClick={() => handleCopy(false)} className="btn btn-light">
              <FaCopy /> نسخ
            </button>
            <button onClick={() => handleCopy(true)} className="btn btn-success">
              <FaWhatsapp /> نسخ للواتساب
            </button>
          </div>

          <div className="border p-3 rounded">
            {results.map((r, i) => (
              <div key={i} className="mb-2">
                <strong>{r.name}:</strong>
                <ul>
                  {[...new Set(r.entries)].map((e, j) => (
                    <li key={j}>{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
