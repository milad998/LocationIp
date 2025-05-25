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

  const handleSuggestionClick = (ip) => {
    const input = textareaRef.current;
    if (!input) return;

    const parts = input.value.trim().split(/\s+/);
    parts.pop();
    parts.push(ip);
    const newValue = parts.join(' ') + ' ';

    input.value = newValue;
    input.setSelectionRange(newValue.length - ip.length - 1, newValue.length - 1);
    input.focus();

    setIps(newValue);
    setSuggestions([]);
    setHighlightIndex(-1);
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
      handleSuggestionClick(suggestions[highlightIndex].ip);
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
    const grouped = {};
    let currentKey = '';

    for (const line of lines) {
      if (line.trim().endsWith(':')) {
        currentKey = line.replace(':', '').trim();
        grouped[currentKey] = [];
      } else if (line.trim() && currentKey) {
        grouped[currentKey].push(line.trim());
      }
    }

    const order = ['al_raqqa', 'al_tabaqa', 'kobani']; // ترتيب المدن

    let whatsappText = 'وضع المسار:\n';
    for (const key of order) {
      if (grouped[key]?.length) {
        const arabicName = CITY_MAP[key] || key;
        whatsappText += `*${arabicName}*:\n`;
        for (const item of grouped[key]) {
          whatsappText += `🔴 ${item}\n`;
        }
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
      .map((term) => term.trim())
      .filter(Boolean);

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

        const isMatched = terms.some((term) => content.includes(term));
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
    const term = searchTerm.toLowerCase();

    const lines = result.split('\n').filter(line => {
      const trimmed = line.trim();
      const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed);
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
            <CheckCircle
