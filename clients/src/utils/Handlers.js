// utils/handlers.js

export const handleInputChange = (e, setIps, allData, setSuggestions) => {
  const value = e.target.value;
  setIps(value);

  if (!value.trim()) {
    setSuggestions([]);
    return;
  }

  const lastWord = value.trim().split(/\s+/).pop().toLowerCase();

  const matches = allData.filter(
    (entry) =>
      entry.name?.toLowerCase().includes(lastWord) ||
      entry.ip?.startsWith(lastWord)
  );

  setSuggestions(matches.slice(0, 10));
};

export const handleSuggestionClick = (ip, ips, setIps, setSuggestions, inputRef) => {
  const parts = ips.trim().split(/\s+/);
  parts.pop();
  parts.push(ip);
  setIps(parts.join(' ') + ' ');
  setSuggestions([]);

  inputRef?.current?.focus();
};

export const handleClear = (setIps, setSuggestions) => {
  setIps('');
  setSuggestions([]);
};

export const handleSearch = async (e, ips, setLoading, setStatus, setResult) => {
  e.preventDefault();

  const cleanedIps = ips
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (cleanedIps.length === 0) {
    setStatus('error');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ips: cleanedIps }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error');

    setResult(data.result || '');
    setStatus('success');
  } catch (err) {
    setStatus('error');
  } finally {
    setLoading(false);
  }
};
