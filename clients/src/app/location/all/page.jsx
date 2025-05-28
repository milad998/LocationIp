'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';

export default function TabaqaPage() {
  const [senderIps, setSenderIps] = useState('');
  const [receiverIps, setReceiverIps] = useState('');
  const [senderResults, setSenderResults] = useState([]);
  const [receiverResults, setReceiverResults] = useState([]);

  const parseIps = (input) => {
    return input
      .split(/[\n, ]+/)
      .map(ip => ip.trim())
      .filter(ip => ip);
  };

  const fetchResults = async (ips, label, setResults) => {
    try {
      const response = await fetch('http://localhost:8000/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ips }),
      });

      const text = await response.text();

      if (text.includes('IP')) {
        const lines = text.trim().split('\n').filter(line => line.includes('IP:'));
        
        const formatted = lines.map((line) => {
          const nameMatch = line.match(/الاسم:\s*(.+?)\s*\|?/);
          const name = nameMatch ? nameMatch[1] : 'بدون اسم';
          return `🔴 ${name} (${label})`;
        });
        setResults(formatted);
      } 
      
    } catch {
      setResults([`❌ فشل الاتصال بالخادم (${label})`]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSenderResults([]);
    setReceiverResults([]);

    const senderList = parseIps(senderIps);
    const receiverList = parseIps(receiverIps);

    if (senderList.length > 0) await fetchResults(senderList, 'مرسل', setSenderResults);
    if (receiverList.length > 0) await fetchResults(receiverList, 'مستقبل', setReceiverResults);
  };

  const handleCopyAndWhatsApp = () => {
    const text = [...senderResults, ...receiverResults].join(' ');
    navigator.clipboard.writeText(text);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleReset = () => {
    setSenderIps('');
    setReceiverIps('');
    setSenderResults([]);
    setReceiverResults([]);
  };

  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light" dir="rtl">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: '750px' }}>
        <h3 className="text-center mb-4 text-primary">التحقق من عناوين IP في طبقة</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">عناوين IP (مرسل)</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="أدخل عناوين مفصولة بمسافة أو فاصلة أو أسطر"
              value={senderIps}
              onChange={(e) => setSenderIps(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">عناوين IP (مستقبل)</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="أدخل عناوين مفصولة بمسافة أو فاصلة أو أسطر"
              value={receiverIps}
              onChange={(e) => setReceiverIps(e.target.value)}
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success">🔍 بحث</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              🔄 إعادة تعيين
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h5 className="text-secondary">النتائج:</h5>
          {[...senderResults, ...receiverResults].length === 0 ? (
            <p className="text-muted">لا توجد نتائج بعد</p>
          ) : (
            <>
              <div className="bg-light p-3 rounded border mt-2 text-dark">
  <strong>وضع الشبكة:</strong>
  <ul className="mt-2">
    {[...senderResults, ...receiverResults].map((line, index) => (
      <li key={index}>{line}</li>
    ))}
  </ul>
</div>
              <div className="d-grid mt-3">
                <button
                  onClick={handleCopyAndWhatsApp}
                  className="btn btn-primary"
                >
                  📋 نسخ وفتح واتساب
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
                                                     }
