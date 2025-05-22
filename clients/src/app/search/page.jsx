{results && results.length > 0 && (
  <div className="mt-4">
    <label className="fw-bold mb-2">النتائج:</label>
    <div className="d-flex gap-2 mb-2">
      <button
        className="btn btn-outline-secondary"
        onClick={handleCopy}
      >
        نسخ
      </button>
      <button
        className="btn btn-success text-white"
        onClick={handleWhatsAppCopy}
      >
        نسخ للواتساب
      </button>
    </div>
    <div className="border p-3 rounded bg-light">
      {results.map((item, index) => (
        <div key={index} className="mb-3">
          <div className="fw-bold">{item.name}:</div>
          <div>
            {item.entries.map((entry, idx) => (
              <span key={idx} className="badge bg-danger me-1">
                {entry}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
