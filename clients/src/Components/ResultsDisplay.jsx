import { Clipboard } from 'lucide-react';

export default function ResultsDisplay({ result, CITY_MAP, onWhatsappShare, getDisplayResult }) {
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h6 mb-0">النتائج:</h2>
        <div className="d-flex gap-2">
          <button
            onClick={onWhatsappShare}
            className="btn btn-success btn-sm d-flex align-items-center gap-1"
          >
            <Clipboard size={16} /> واتساب
          </button>
        </div>
      </div>
      <div className="bg-light border rounded p-3 text-muted small overflow-auto" style={{ maxHeight: '300px' }}>
        {getDisplayResult().map((line, idx) => {
          const isTitle = line.trim().endsWith(':');
          const symbol = line.startsWith('🟢') ? '🟢' : line.startsWith('🔴') ? '🔴' : null;
          const content = symbol ? line.slice(2).trim() : line;

          return (
            <div key={idx} className="d-flex align-items-start mb-1">
              {isTitle ? (
                <span className="fw-bold">{CITY_MAP[content.replace(':', '').trim()] || content}</span>
              ) : (
                <>
                  {symbol && <span className="me-2">{symbol}</span>}
                  <span>{content}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
