'use client'; import { useEffect, useRef, useState } from 'react'; import { Search, Loader2, CheckCircle, AlertCircle, X, Clipboard } from 'lucide-react';

const CITY_MAP = { al_raqqa: 'الرقة', al_tabaqa: 'الطبقة', kobani: 'كوباني', };

export default function SearchIps() { const [ips, setIps] = useState(''); const [filterInput, setFilterInput] = useState(''); const [result, setResult] = useState(''); const [status, setStatus] = useState(null); const [loading, setLoading] = useState(false); const [suggestions, setSuggestions] = useState([]); const [highlightIndex, setHighlightIndex] = useState(-1); const [filterSuggestions, setFilterSuggestions] = useState([]); const [filterHighlightIndex, setFilterHighlightIndex] = useState(-1); const [allData, setAllData] = useState([]);

const containerRef = useRef(); const textareaRef = useRef(); const filterRef = useRef();

useEffect(() => { const fetchAll = async () => { try { const res = await fetch('http://localhost:8000/api/all'); const data = await res.json(); setAllData(data); } catch (err) { console.error('فشل في جلب البيانات:', err); } }; fetchAll(); }, []);

useEffect(() => { const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setSuggestions([]); setHighlightIndex(-1); } if (filterRef.current && !filterRef.current.contains(e.target)) { setFilterSuggestions([]); setFilterHighlightIndex(-1); } }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);

const handleInputChange = (e) => { const value = e.target.value; setIps(value); updateSuggestions(value); };

const updateSuggestions = (value) => { const lastWord = value.trim().split(/\s+/).pop()?.toLowerCase(); if (!lastWord) { setSuggestions([]); return; } const matches = allData.filter( (entry) => entry.name?.toLowerCase().includes(lastWord) || entry.ip?.startsWith(lastWord) ); setSuggestions(matches.slice(0, 10)); setHighlightIndex(-1); };

const updateFilterSuggestions = (value) => { const lastWord = value.trim().toLowerCase(); if (!lastWord) { setFilterSuggestions([]); return; } const matches = allData.filter( (entry) => entry.name?.toLowerCase().includes(lastWord) || entry.ip?.startsWith(lastWord) ); setFilterSuggestions(matches.slice(0, 10)); setFilterHighlightIndex(-1); };

const handleSuggestionClick = (entry) => { const tokens = ips.trim().split(/\s+/); tokens.pop(); tokens.push(entry.ip); const newIps = tokens.join(' ') + ' '; setIps(newIps); updateSuggestions(newIps); setSuggestions([]); setHighlightIndex(-1); setTimeout(() => { if (textareaRef.current) textareaRef.current.focus(); }, 0); };

const handleKeyDown = (e) => { if (suggestions.length === 0) return; if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex((prev) => (prev + 1) % suggestions.length); } else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex((prev) => prev <= 0 ? suggestions.length - 1 : prev - 1 ); } else if (e.key === 'Enter' && highlightIndex >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[highlightIndex]); } };

const handleClear = () => { setIps(''); setSuggestions([]); setResult(''); setStatus(null); };

const handleSearch = async (e) => { e.preventDefault(); setLoading(true); setStatus(null); setResult(''); try { const ipList = ips.trim().split(/\s+/); const res = await fetch('http://localhost:8000/api/locations/search/ips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ips: ipList }), }); const text = await res.text(); setResult(text); setStatus(res.ok ? 'success' : 'error'); } catch (err) { setResult('حدث خطأ في الاتصال بالسيرفر.'); setStatus('error'); } finally { setLoading(false); } };

const formatResultForDisplay = () => { if (!result) return []; const filter = filterInput.trim().toLowerCase(); return result.split('\n').map((line) => { if (line.trim().endsWith(':')) { const key = line.replace(':', '').trim(); return { type: 'header', text: CITY_MAP[key] || key }; } else if (line.trim()) { const matched = filter && line.toLowerCase().includes(filter); return { type: 'item', text: line.trim(), icon: matched ? '🟢' : '🔴', }; } else { return { type: 'empty', text: '' }; } }); };

const handleCopy = () => { navigator.clipboard.writeText(result); };

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
return ( <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light"> <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: '700px' }}> <h1 className="h4 text-center mb-4">البحث عن عناوين IP</h1>

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

      <div className="mb-3 position-relative" ref={filterRef}>
        <label className="form-label">فلترة النتائج (الاسم أو IP)</label>
        <input
          className="form-control"
          type="text"
          placeholder="اكتب لتصفية النتائج"
          value={filterInput}
          onChange={(e) => {
            setFilterInput(e.target.value);
            updateFilterSuggestions(e.target.value);
          }}
          onKeyDown={(e) => {
            if (filterSuggestions.length === 0) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setFilterHighlightIndex((prev) => (prev + 1) % filterSuggestions.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setFilterHighlightIndex((prev) =>
                prev <= 0 ? filterSuggestions.length - 1 : prev - 1
              );
            } else if (e.key === 'Enter' && filterHighlightIndex >= 0) {
              e.preventDefault();
              const selected = filterSuggestions[filterHighlightIndex];
              setFilterInput(selected.ip);
              setFilterSuggestions([]);
            }
          }}
        />
        {filterSuggestions.length > 0 && (
          <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
            {filterSuggestions.map((entry, idx) => (
              <li
                key={idx}
                className={`list-group-item list-group-item-action d-flex justify-content-between ${
                  idx === filterHighlightIndex ? 'active' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setFilterInput(entry.ip);
                  setFilterSuggestions([]);
                }}
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
          {formatResultForDisplay().map((line, idx) => (
            <div key={idx} className="d-flex align-items-start">
              {line.type === 'header' ? (
                <span className="fw-bold">{line.text}</span>
              ) : line.type === 'item' ? (
                <>
                  <span className="me-2">{line.icon}</span>
                  <span>{line.text}</span>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

); }

  
