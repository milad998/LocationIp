"use client";
import Link from "next/link";
import { Home, PlusCircle, Trash2, Search } from "lucide-react";

export default function NavbarComponent() {
  return (
    <nav className="navbar navbar-expand-lg bg-white px-3">
      <div className="collapse navbar-collapse show w-100 justify-content-center" id="navbarContent">
        <ul className="navbar-nav d-flex flex-row gap-3 justify-content-center align-items-center">
          <li className="nav-item">
            <Link href="/" className="nav-link p-2">
              <Home size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add" className="nav-link p-2">
              <PlusCircle size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/del" className="nav-link p-2">
              <Trash2 size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/search" className="nav-link p-2">
              <Search size={22} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
