"use client";
import Link from "next/link";
import {
  Home,
  PlusCircle,
  Trash2,
  Search
} from "lucide-react";

export default function NavbarComponent() {
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-white px-3">
      <Link href="/" className="navbar-brand">
        لوحة التحكم
      </Link>

      <div className="collapse navbar-collapse show" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href="/" className="nav-link d-flex align-items-center gap-1">
              <Home size={18} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add" className="nav-link d-flex align-items-center gap-1">
              <PlusCircle size={18} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/delete" className="nav-link d-flex align-items-center gap-1">
              <Trash2 size={18} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/search" className="nav-link d-flex align-items-center gap-1">
              <Search size={18} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
