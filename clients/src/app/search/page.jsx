'use client';
import { useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: '700px' }}>
        <h1 className="h4 text-center mb-4">البحث عن عناوين IP</h1>

        {status === 'success' && (
          <div className="alert alert-success d-flex align-items-center gap-2">
            <CheckCircle size={20} /> تم جلب النتائج بنجاح.
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <AlertCircle size={20} /> فشل في جلب البيانات.
          </div>
        )}

        <form onSubmit={handleSearch}>
          <div className="mb-3">
            <label className="form-label">أدخل عناوين IP مفصولة بفاصلة</label>
            <textarea
              className="form-control"
              placeholder="مثال: 192.168.1.1, 10.0.0.1"
              rows={5}
              value={ips}
              onChange={e => setIps(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
              loading ? 'btn-success disabled' : 'btn-success'
            }`}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spinner-border spinner-border-sm" /> : <Search size={18} />}
            {loading ? 'جارٍ البحث...' : 'بحث'}
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <h2 className="h6 mb-2">النتائج:</h2>
            <div className="bg-light border rounded p-3 text-muted small overflow-auto">
              {result.split('\n').map((line, idx) => (
                <div key={idx}>
                  {line.trim().startsWith('.') ? (
                    <>
                      <span className="text-danger me-2">●</span>
                      {line.slice(1)}
                    </>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
                }
