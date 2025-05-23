'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle, X, Clipboard } from 'lucide-react';

const CITY_MAP = { al_raqqa: 'الرقة', al_tabaqa: 'الطبقة', kobani: 'كوباني' };

export default function SearchIps() {
  const [ips, setIps] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [filterSuggestions, setFilterSuggestions] = useState([]);
  const [filterHighlightIndex, setFilterHighlightIndex] = useState(-1);
  const [allData, setAllData] = useState([]);

  const containerRef = useRef();
  const textareaRef = useRef();
  const filterRef = useRef();

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
    if (typeof window !== 'undefined') {
      setResult(localStorage.getItem('lastResult') || '');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
        setHighlightIndex(-1);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterSuggestions([]);
        setFilterHighlightIndex(-1);
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
      (entry) => entry.name?.toLowerCase().includes(lastWord) || entry.ip?.startsWith(lastWord)
    );
    setSuggestions(matches.slice(0, 10));
    setHighlightIndex(-1);
  };

  const updateFilterSuggestions = (value) => {
    const filterValue = value.trim().toLowerCase();
    if (!filterValue || !result) {
      setFilterSuggestions([]);
      return;
    }

    const lines = result.split('\n').filter(line => line.trim() !== '');
    const matches = lines
      .map(line => line.trim())
      .filter(line => line.toLowerCase().includes(filterValue))
      .map(line => ({ ip: line, name: line }));

    setFilterSuggestions(matches.slice(0, 10));
    setFilterHighlightIndex(-1);
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
      if (textareaRef.current) textareaRef.current.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastResult', text);
      }
      setStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      setResult('حدث خطأ في الاتصال بالسيرفر.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const formatResultForDisplay = () => {
    if (!result) return [];
    const filter = filterInput.trim().toLowerCase();
    return result.split('\n').map((line) => {
      if (line.trim().endsWith(':')) {
        const key = line.replace(':', '').trim();
        return { type: 'header', text: CITY_MAP[key] || key };
      } else if (line.trim()) {
        const matched = filter && line.toLowerCase().includes(filter);
        return { type: 'item', text: line.trim(), icon: matched ? '🟢' : '🔴' };
      } else {
        return { type: 'empty', text: '' };
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleCopyWhatsapp = () => {
    const lines = formatResultForDisplay();
    let whatsappText = '';
    for (const line of lines) {
      if (line.type === 'header') {
        whatsappText += `*${line.text}*:\n`;
      } else if (line.type === 'item') {
        whatsappText += `${line.icon}${line.text}\n`;
      }
    }
    navigator.clipboard.writeText(whatsappText.trim());
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <h1 className="h4 text-center mb-4">البحث عن عناوين IP</h1>
        <form onSubmit={handleSearch} className="mb-3">
          <textarea
            ref={textareaRef}
            value={ips}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="أدخل عناوين IP مفصولة بمسافة"
            className="form-control mb-2"
            rows={3}
          />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="spin me-1" size={16} /> : <Search className="me-1" size={16} />}
              بحث
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              <X className="me-1" size={16} />
              مسح
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4">
            <h5>النتائج:</h5>
            <ul className="list-group mb-3">
              {formatResultForDisplay().map((line, idx) => (
                <li key={idx} className="list-group-item">
                  {line.type === 'header' ? (
                    <strong>{line.text}</strong>
                  ) : line.type === 'item' ? (
                    <span>{line.icon} {line.text}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="d-flex gap-2">
              <button onClick={handleCopy} className="btn btn-outline-primary">
                <Clipboard className="me-1" size={16} /> نسخ
              </button>
              <button onClick={handleCopyWhatsapp} className="btn btn-outline-success">
                <Clipboard className="me-1" size={16} /> نسخ للواتساب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
