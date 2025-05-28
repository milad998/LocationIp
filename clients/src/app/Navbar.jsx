"use client";
import Link from "next/link";
import { Home, PlusCircle, Trash2, Search, CheckCircle2 } from "lucide-react";

export default function NavbarComponent() {
  return (
    <nav className="navbar navbar-expand-lg bg-white px-3" dir="rtl">
      <div className="collapse navbar-collapse show w-100 justify-content-center" id="navbarContent">
        <ul className="navbar-nav d-flex flex-row gap-3 justify-content-center align-items-center">

          {/* الروابط القديمة */}
          <li className="nav-item">
            <Link href="/" className="nav-link p-2" title="الرئيسية">
              <Home size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add" className="nav-link p-2" title="إضافة قديم">
              <PlusCircle size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/del" className="nav-link p-2" title="مسح قديم">
              <Trash2 size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/search" className="nav-link p-2" title="بحث قديم">
              <Search size={22} />
            </Link>
          </li>

          {/* الروابط الجديدة داخل /location */}
          <li className="nav-item">
            <Link href="/location/add" className="nav-link p-2" title="إضافة جديدة">
              <PlusCircle size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/location/del" className="nav-link p-2" title="مسح جديدة">
              <Trash2 size={22} />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/location/all" className="nav-link p-2" title="تكميل">
              <CheckCircle2 size={22} />
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  );
              }
