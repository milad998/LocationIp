"use client";
import { useState } from "react";

export default function DeleteDevicePage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!name) {
      setMessage('يرجى إدخال الاسم');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/api/ip/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`تم الحذف: ${data.message}`);
      } else {
        setMessage(`خطأ: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('حدث خطأ أثناء الاتصال بالخادم');
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center">حذف جهاز</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="اسم الجهاز"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`btn w-100 ${loading ? 'btn-secondary' : 'btn-danger'}`}
        >
          {loading ? 'جاري الحذف...' : 'حذف'}
        </button>
        {message && (
          <div className={`alert mt-3 ${message.includes('تم') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
        }
