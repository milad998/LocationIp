"use client"
import { useState } from 'react';

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
        method: 'DELETE'
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
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>حذف جهاز</h1>
      <input
        type="text"
        placeholder="اسم الجهاز"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
      />
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'جاري الحذف...' : 'حذف'}
      </button>
      <p>{message}</p>
    </div>
  );
    }
