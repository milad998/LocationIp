'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';

export default function AddLocationPage() {
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/add-location-tabaqa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, name }),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage(`✅ تمت إضافة: ${result.name}`);
        setIp('');
        setName('');
      } else {
        setModalMessage(`❌ خطأ: ${result.error}`);
      }
    } catch {
      setModalMessage('❌ فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light" dir="rtl">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center text-primary mb-4">إضافة عنوان IP إلى طبقة</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">عنوان IP</label>
            <input
              type="text"
              className="form-control"
              placeholder="مثال: 192.168.1.1"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">الاسم</label>
            <input
              type="text"
              className="form-control"
              placeholder="اسم الموقع أو الجهاز"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                جاري الإرسال...
              </>
            ) : (
              '➕ إضافة'
            )}
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">رسالة</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-center">{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary w-100" onClick={() => setShowModal(false)}>
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                }
