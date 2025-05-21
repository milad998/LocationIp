// pages/add-location.js 'use client'; import { useState } from 'react';
"use client"
export default function AddLocation() {
  const [ip, setIp] = useState('');
  const [name, setName] = useState(''); 
  const [table, setTable] = useState('al_tabaqa'); 
  const [response, setResponse] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault(); 
  const res = await fetch(`http://localhost:8000/api/locations/${table}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip, name }) }); 
  const data = await res.json(); 
  setResponse(data);
};

return ( <div className="p-4"> <h1 className="text-xl font-bold mb-4">إضافة IP واسم</h1> <form onSubmit={handleSubmit} className="space-y-4"> <select value={table} onChange={e => setTable(e.target.value)} className="border p-2"> <option value="al_tabaqa">الطبقة</option> <option value="al_raqqa">الرقة</option> <option value="kobani">كوباني</option> </select> <input type="text" placeholder="IP" value={ip} onChange={e => setIp(e.target.value)} className="border p-2 w-full" /> <input type="text" placeholder="الاسم" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" /> <button type="submit" className="bg-blue-600 text-white px-4 py-2">إضافة</button> </form> {response && <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(response, null, 2)}</pre>} </div> ); }

