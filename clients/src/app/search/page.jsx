'use client';

import { useEffect, useRef, useState } from 'react';
import {Search,Loader2,CheckCircle,AlertCircle,X,Clipboard,} from 'lucide-react';
import IpInput from '../../Components/IpInput';
import SearchBox from '../../Components/SearchBox';
import ResultsDisplay from '../../Components/ResultsDisplay';

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

                  
  // باقي useEffect ومعالجات الإدخال تبقى كما هي...
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
          <IpInput
            ips={ips}
            setIps={setIps}
            suggestions={suggestions}
            containerRef={containerRef}
            inputRef={inputRef}
            onClear={handleClear}
            onSuggestionClick={handleSuggestionClick}
            onChange={handleInputChange}
          />

          <SearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchSuggestions={searchSuggestions}
          />

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
          <ResultsDisplay
            result={result}
            CITY_MAP={CITY_MAP}
            onWhatsappShare={handleWhatsappShare}
            getDisplayResult={getDisplayResult}
          />
        )}
      </div>
    </div>
  );
  }
