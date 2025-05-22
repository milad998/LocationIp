"use client"
import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle, X, Copy, Check } from 'lucide-react';

export default function SearchIps() {
  const [ips, setIps] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef();

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
    setIps(tokens.join(' ') + ' ');
    updateSuggestions(tokens.join(' ') + ' ');
    // لا نقوم بإخفاء الاقتراحات هنا
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

  const handleClear = () => {
    setIps('');
    setSuggestions([]);
    setResult('');
    setStatus(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <textarea
                className="form-control"
                placeholder="اكتب جزء من الاسم أو IP وسيظهر اقتراح"
                rows={4}
                value={ips}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              ></textarea>
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
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 mb-0">النتائج:</h2>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
            <div className="bg-light border rounded p-3 text-muted small overflow-auto">
              {result.split('\n').map((line, idx) => (
                <div key={idx} className="d-flex align-items-center">
                  <span className="me-2">🔴</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
    }
