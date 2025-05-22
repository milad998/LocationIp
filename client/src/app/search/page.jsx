'use client';
import { useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import '../globals.css';
export default function SearchIps() {
  const [ips, setIps] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState(null); // success | error | null
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setResult('');

    try {
      const ipList = ips.split(' ').map(ip => ip.trim());
      const res = await fetch('http://localhost:8000/api/locations/search/ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ips: ipList })
      });

      const text = await res.text();
      setResult(text);
      setStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      setResult('حدث خطأ في الاتصال بالسيرفر.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">البحث عن عناوين IP</h1>

        {status === 'success' && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle size={20} /> تم جلب النتائج بنجاح.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <AlertCircle size={20} /> فشل في جلب البيانات.
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-gray-700">أدخل عناوين IP مفصولة بفاصلة</label>
          <textarea
            placeholder="مثال: 192.168.1.1, 10.0.0.1"
            value={ips}
            onChange={e => setIps(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white font-medium py-2 rounded-lg transition duration-200 ${
              loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? 'جارٍ البحث...' : 'بحث'}
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">النتائج:</h2>
            <pre className="bg-gray-100 border rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
