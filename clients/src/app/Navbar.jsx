"use client";
import Link from "next/link";

export default function NavbarComponent() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link href="/" className="navbar-brand">
        لوحة التحكم
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              الرئيسية
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add" className="nav-link">
              إضافة جهاز
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/delete" className="nav-link">
              حذف جهاز
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/search" className="nav-link">
              بحث
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
