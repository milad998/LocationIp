'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';

export default function DeleteDevicePage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/location/tabaqa-del/${name}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage(`✅ ${result.message}`);
        setName('');
      } else {
        setModalMessage(`❌ ${result.message}`);
      }
    } catch {
      setModalMessage('❌ حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light" dir="rtl">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center text-danger mb-4">حذف جهاز من طبقة</h2>

        <form onSubmit={handleDelete}>
          <div className="mb-3">
            <label className="form-label">اسم الجهاز</label>
            <input
              type="text"
              className="form-control"
              placeholder="أدخل اسم الجهاز المراد حذفه"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                جاري الحذف...
              </>
            ) : (
              '🗑️ حذف'
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
