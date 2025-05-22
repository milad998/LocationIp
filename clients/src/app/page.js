"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/all"); // يجب إنشاء هذه الـ API
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIPs();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>قائمة الأجهزة</h1>
        {data.length === 0 ? (
          <p>جاري التحميل...</p>
        ) : (
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> - {item.ip} ({item.table})
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
                      }
