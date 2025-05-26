'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Clipboard,
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const containerRef = useRef();
  const inputRef = useRef();

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
        setSearchSuggestions([]);
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
  };

  const handleSuggestionClick = (ip) => {
    if (!inputRef.current) return;

    const parts = inputRef.current.value.trim().split(/\s+/);
    parts.pop();
    parts.push(ip);
    const newValue = parts.join(' ') + ' ';

    inputRef.current.value = newValue;
    inputRef.current.setSelectionRange(newValue.length, newValue.length);
    inputRef.current.focus();

    setIps(newValue);
    setSuggestions([]);
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

    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const lines = result.split('\n');
    const grouped = {};
    let currentKey = '';

    for (const line of lines) {
      if (line.trim().endsWith(':')) {
        currentKey = line.replace(':', '').trim();
        grouped[currentKey] = [];
      } else if (line.trim() && currentKey) {
        let content = line.trim();
        let symbol = '🔴';

        if (content.startsWith('🔴') || content.startsWith('🟢')) {
          symbol = content.slice(0, 2);
          content = content.slice(2).trim();
        }

        const isMatch = searchWords.some((word) =>
          content.toLowerCase().includes(word)
        );

        const finalSymbol = isMatch ? '🟢' : symbol;
        grouped[currentKey].push(`${finalSymbol} ${content}`);
      }
    }

    const order = ['al_raqqa', 'al_tabaqa', 'kobani'];
    let whatsappText = 'وضع المسار:\n';

    for (const key of order) {
      if (grouped[key]?.length) {
        const arabicName = CITY_MAP[key] || key;
        whatsappText += `*${arabicName}*:\n`;
        for (const item of grouped[key]) {
          whatsappText += `${item}\n`;
        }
      }
    }

    return encodeURIComponent(whatsappText.trim());
  };

  const handleWhatsappShare = () => {
    const text = formatResultForWhatsapp();
    if (text) {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const getDisplayResult = () => {
    if (!result) return [];

    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const ipWords = ips.toLowerCase().split(/\s+/).filter(Boolean);
    const terms = [...new Set([...searchWords, ...ipWords])];

    const blocks = {};
    let currentKey = null;

    result.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.endsWith(':')) {
        currentKey = trimmed.replace(':', '');
        blocks[currentKey] = [];
      } else if (currentKey) {
        const hasSymbol = trimmed.startsWith('🔴') || trimmed.startsWith('🟢');
        const symbol = hasSymbol ? trimmed.slice(0, 2) : '🔴';
        const content = hasSymbol ? trimmed.slice(2).trim() : trimmed;

        const isMatched = terms.some((term) =>
          content.toLowerCase().includes(term)
        );
        const lineWithStatus = `${isMatched ? '🟢' : symbol} ${content}`;
        blocks[currentKey].push(lineWithStatus);
      }
    });

    const orderedKeys = ['al_raqqa', 'al_tabaqa', 'kobani'];
    const finalResult = [];

    for (const key of orderedKeys) {
      if (blocks[key]) {
        finalResult.push(`${key}:`);
        finalResult.push(...blocks[key]);
      }
    }

    return finalResult;
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const lastWord = searchTerm.trim().split(/\s+/).pop()?.toLowerCase();
    if (!lastWord) {
      setSearchSuggestions([]);
      return;
    }

    const matches = allData.filter(
      (entry) =>
        entry.name?.toLowerCase().includes(lastWord) ||
        entry.ip?.startsWith(lastWord)
    );

    const suggestions = matches.map((entry) => entry.name).slice(0, 10);
    setSearchSuggestions(suggestions);
  }, [searchTerm, allData]);

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
                ref={inputRef}
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
                    style={{ cursor: 'pointer' }}
                    className="list-group-item d-flex justify-content-between"
                    onClick={() => handleSuggestionClick(entry.ip)}
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
            />
            {searchSuggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
                {searchSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    style={{ cursor: 'pointer' }}
                    className="list-group-item"
                    onClick={() => {
                      const parts = searchTerm.trim().split(/\s+/);
                      parts.pop();
                      parts.push(s);
                      const updated = parts.join(' ') + ' ';
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
                <button
                  onClick={handleWhatsappShare}
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
        )}
      </div>
    </div>
  );
}
