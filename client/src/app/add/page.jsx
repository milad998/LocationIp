'use client';
import { useState } from 'react';
import { Server, Type, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import '../globals.css';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">إضافة عنوان IP واسم</h1>

        {status === 'success' && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle size={20} /> تم الإضافة بنجاح
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <AlertCircle size={20} /> فشل في الإرسال. تحقق من البيانات أو الاتصال.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">الجدول</label>
            <select
              value={table}
              onChange={e => setTable(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="al_tabaqa">الطبقة</option>
              <option value="al_raqqa">الرقة</option>
              <option value="kobani">كوباني</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">عنوان IP</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Globe size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="مثال: 192.168.1.1"
                value={ip}
                onChange={e => setIp(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">الاسم</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Type size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="اسم الجهاز أو الموقع"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            إضافة
          </button>
        </form>

        {response && (
          <pre className="mt-4 bg-gray-100 border rounded-lg p-4 text-sm text-gray-800 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
