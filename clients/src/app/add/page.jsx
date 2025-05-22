'use client';
import { useState } from 'react';
import { Server, Type, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export default function AddLocation() {
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [table, setTable] = useState('al_tabaqa');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/locations/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, name }),
      });
      const data = await res.json();
      setResponse(data);
      setStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      setResponse({ error: 'حدث خطأ أثناء الاتصال بالسيرفر' });
      setStatus('error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: '500px' }}>
        <h1 className="h4 text-center mb-4">إضافة عنوان IP واسم</h1>

        {status === 'success' && (
          <div className="alert alert-success d-flex align-items-center gap-2">
            <CheckCircle size={20} /> تم الإضافة بنجاح
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <AlertCircle size={20} /> فشل في الإرسال. تحقق من البيانات أو الاتصال.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">الجدول</label>
            <select
              className="form-select"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              <option value="al_tabaqa">الطبقة</option>
              <option value="al_raqqa">الرقة</option>
              <option value="kobani">كوباني</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">عنوان IP</label>
            <div className="input-group">
              <span className="input-group-text">
                <Globe size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="مثال: 192.168.1.1"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">الاسم</label>
            <div className="input-group">
              <span className="input-group-text">
                <Type size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="اسم الجهاز أو الموقع"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            إضافة
          </button>
        </form>

        {response && (
          <pre className="mt-4 bg-light border rounded p-3 text-muted small overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
  }
