"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

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

  const renderTable = (city: string) => {
    const cityData = filteredData.filter((item) => item.table === city);

    if (cityData.length === 0) return null;

    return (
      <div key={city} className={styles.tableSection}>
        <h2>{city}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>قائمة الأجهزة</h1>
        <input
          type="text"
          placeholder="ابحث بالاسم أو IP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {["الرقة", "الطبقة", "كوباني"].map(renderTable)}
      </main>
    </div>
  );
      }
