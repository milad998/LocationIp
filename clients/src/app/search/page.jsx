'use client';
import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle, X, Clipboard } from 'lucide-react';

const CITY_MAP = {
  al_raqqa: 'الرقة',
  al_tabaqa: 'الطبقة',
  kobani: 'كوباني',
};

export default function SearchIps() {
  const [ips, setIps] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [highlightSearchIndex, setHighlightSearchIndex] = useState(-1);

  const containerRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/all');
        const data = await res.json();
        setAllData(data);
      } catch (err) {
        console.error('فشل في جلب البيانات:', err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
        setHighlightIndex(-1);
        setSearchSuggestions([]);
        setHighlightSearchIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setIps(value);
    updateSuggestions(value);
  };

  const updateSuggestions = (value) => {
    const lastWord = value.trim().split(/\s+/).pop()?.toLowerCase();
    if (!lastWord) {
      setSuggestions([]);
      return;
    }
    const matches = allData.filter(
      (entry) =>
        entry.name?.toLowerCase().includes(lastWord) ||
        entry.ip?.startsWith(lastWord)
    );
    setSuggestions(matches.slice(0, 10));
    setHighlightIndex(-1);
  };

  const handleSuggestionClick = (entry) => {
    const tokens = ips.trim().split(/\s+/);
    tokens.pop();
    tokens.push(entry.ip);
    const newIps = tokens.join(' ') + ' ';
    setIps(newIps);
    updateSuggestions(newIps);
    setSuggestions([]);
    setHighlightIndex(-1);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightIndex]);
    }
  };

  const handleSearchKeyDown = (e) => {
  if (searchSuggestions.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setHighlightSearchIndex((prev) => (prev + 1) % searchSuggestions.length);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightSearchIndex((prev) =>
      prev <= 0 ? searchSuggestions.length - 1 : prev - 1
    );
  } else if (e.key === 'Enter' && highlightSearchIndex >= 0) {
    e.preventDefault();
    const chosen = searchSuggestions[highlightSearchIndex];
    setSearchTerm((prev) => (prev + ' ' + chosen).trim());
    setSearchSuggestions([]);
  }
};

  const handleClear = () => {
    setIps('');
    setSuggestions([]);
    setResult('');
    setStatus(null);
    setSearchTerm('');
    setSearchSuggestions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setResult('');
    try {
      const ipList = ips.trim().split(/\s+/);
      const res = await fetch('http://localhost:8000/api/locations/search/ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ips: ipList }),
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

  const formatResultForWhatsapp = () => {
    if (!result) return '';
    const lines = result.split('\n');
    let whatsappText = '';
    for (const line of lines) {
      if (line.trim().endsWith(':')) {
        const key = line.replace(':', '').trim();
        const arabicName = CITY_MAP[key] || key;
        whatsappText += `*${arabicName}*:\n`;
      } else if (line.trim()) {
        whatsappText += `🔴 ${line.trim()}\n`;
      }
    }
    return whatsappText.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(formatResultForWhatsapp());
  };

  const getDisplayResult = () => {
  if (!result) return [];
  const terms = searchTerm
    .split(/\s+/)
    .map((term) => term.toLowerCase().trim())
    .filter(Boolean);

  return result.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.endsWith(':')) return trimmed;

    const hasSymbol = trimmed.startsWith('🔴') || trimmed.startsWith('🟢');
    const symbol = hasSymbol ? trimmed.slice(0, 2) : '';
    const content = hasSymbol ? trimmed.slice(2).trim() : trimmed;

    const isMatched = terms.some((term) => content.toLowerCase().includes(term));
    return `${isMatched ? '🟢' : symbol || '🔴'} ${content}`;
  });
};

  useEffect(() => {
  if (!searchTerm.trim()) {
    setSearchSuggestions([]);
    return;
  }
  const term = searchTerm.toLowerCase();

  const lines = result.split('\n').filter(line => {
    const trimmed = line.trim();
    const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed); // يتحقق هل السطر هو IP
    return trimmed && !trimmed.endsWith(':') && !isIP && trimmed.toLowerCase().includes(term);
  });

  const uniqueLines = Array.from(new Set(lines)).slice(0, 10);
  setSearchSuggestions(uniqueLines);
  setHighlightSearchIndex(-1);
}, [searchTerm, result]);


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
          <div className="mb-3 position-relative" ref={containerRef}>
            <label className="form-label">أدخل عناوين IP مفصولة بمسافات أو كلمات</label>
            <div className="position-relative">
              <input
                className="form-control"
                type="text"
                placeholder="اكتب جزء من الاسم أو IP وسيظهر اقتراح"
                value={ips}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={textareaRef}
              />
              {ips && (
                <X
                  size={18}
                  className="position-absolute top-0 end-0 mt-2 me-2 text-danger"
                  style={{ cursor: 'pointer' }}
                  onClick={handleClear}
                />
              )}
            </div>

            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
                {suggestions.map((entry, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item list-group-item-action d-flex justify-content-between ${
                      idx === highlightIndex ? 'active' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSuggestionClick(entry)}
                  >
                    <span>{entry.name}</span>
                    <span className="text-muted small">{entry.ip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">بحث في النتائج</label>
            <input
              className="form-control"
              type="text"
              placeholder="ابحث عن IP أو اسم لتغيير 🔴 إلى 🟢"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchSuggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
                {searchSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item list-group-item-action ${idx === highlightSearchIndex ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const cleanText = s.trim();
                      const updated = searchTerm ? `${searchTerm} ${cleanText}`.trim() : cleanText;
                      setSearchTerm(updated);
                      setSearchSuggestions([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
              loading ? 'btn-success disabled' : 'btn-success'
            }`}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? 'جارٍ البحث...' : 'بحث'}
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 mb-0">النتائج:</h2>
              <div className="d-flex gap-2">
                <button onClick={handleCopy} className="btn btn-light btn-sm d-flex align-items-center gap-1">
                  <Clipboard size={16} /> نسخ
                </button>
                <button onClick={handleCopyWhatsapp} className="btn btn-success btn-sm d-flex align-items-center gap-1">
                  <Clipboard size={16} /> نسخ للواتساب
                </button>
              </div>
            </div>
            <div className="bg-light border rounded p-3 text-muted small overflow-auto">
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
        )}
      </div>
    </div>
  );
}
