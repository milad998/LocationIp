"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/all");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIPs();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ip.includes(search)
  );

  const renderTable = (city) => {
    const cityData = filteredData.filter((item) => item.table === city);
    if (cityData.length === 0) return null;

    return (
      <div key={city} style={{ marginBottom: "40px" }}>
        <h2>{city}</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>الاسم</th>
              <th style={thStyle}>IP</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    textAlign: "right",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "right",
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>قائمة الأجهزة</h1>
      <input
        type="text"
        placeholder="ابحث بالاسم أو IP"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          margin: "20px 0",
          width: "100%",
          maxWidth: "400px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      {["الرقة", "الطبقة", "كوباني"].map(renderTable)}
    </div>
  );
  }
