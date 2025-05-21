// pages/search-ips.js 'use client'; import { useState } from 'react';
"use client"
export default function SearchIps() {
  const [ips, setIps] = useState('');
  const [result, setResult] = useState('');

const handleSearch = async (e) => {
  e.preventDefault(); 
  const ipList = ips.split(',').map(ip => ip.trim());

const res = await fetch('http://localhost:8000/api/locations/search/ips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ips: ipList })
});

const text = await res.text();
setResult(text);

};

return ( <div className="p-4"> <h1 className="text-xl font-bold mb-4">البحث عن IPs</h1> <form onSubmit={handleSearch} className="space-y-4"> <textarea placeholder="أدخل IPs مفصولة بفاصلة" value={ips} onChange={e => setIps(e.target.value)} className="border p-2 w-full h-32"></textarea> <button type="submit" className="bg-green-600 text-white px-4 py-2">بحث</button> </form> {result && <pre className="mt-4 bg-gray-100 p-2 whitespace-pre-wrap">{result}</pre>} </div> ); }

