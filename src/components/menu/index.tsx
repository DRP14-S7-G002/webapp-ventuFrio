"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import style from "./style.module.css";

export default function Menu() {
  const pathname = usePathname();

  return (
    <div className={style.main_menu}>
      <Link href="/" className={pathname === "/" ? style.active : ""}>Home</Link>
      <Link href="/scheduling" className={pathname === "/scheduling" ? style.active : ""}>Agendamentos</Link>
      <Link href="/budget" className={pathname === "/budget" ? style.active : ""}>Orçamentos</Link>
      <Link href="/client" className={pathname === "/client" ? style.active : ""}>Clientes</Link>
    </div>
  );
}

  