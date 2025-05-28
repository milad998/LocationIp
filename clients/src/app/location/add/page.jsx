'use client';

import { useState } from 'react';

export default function AddLocationPage() {
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const isValidIPv4 = (ip: string) => {
    const regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return regex.test(ip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!isValidIPv4(ip)) {
      setError('❌ عنوان IP غير صالح. مثال: 192.168.1.1');
      return;
    }

    try {
      setStatus('⏳ جاري الإرسال...');
      const response = await fetch('http://localhost:8000/api/add-location-tabaqa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, name }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ تمت إضافة: ${data.name}`);
        setIp('');
        setName('');
      } else {
        const error = await response.json();
        setError(`❌ خطأ: ${error.error}`);
      }
    } catch {
      setError('❌ حدث خطأ في الاتصال بالخادم');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-white p-4"
      dir="rtl"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl flex flex-col md:flex-row gap-8">
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2">
          <img
            src="https://www.svgrepo.com/show/420960/ip-address.svg"
            alt="IP Address Illustration"
            className="w-48 h-48"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            إضافة عنوان IP إلى طبقة
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان IP
              </label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                placeholder="مثال: 192.168.1.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                placeholder="اسم الموقع أو الجهاز"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              ➕ إضافة
            </button>
          </form>

          {/* الرسائل */}
          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
          {status && (
            <p className="mt-4 text-green-700 text-sm text-center">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
        }
