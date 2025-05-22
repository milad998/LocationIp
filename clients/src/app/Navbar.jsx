"use client";
import Link from "next/link";

export default function NavbarComponent() {
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-white px-3">
      <Link href="/" className="navbar-brand">
        لوحة التحكم
      </Link>

      <div className="collapse navbar-collapse show" id="navbarContent">
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
