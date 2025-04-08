import Link from "next/link";
import style from "./style.module.css";

export default function Menu() {

    return (
      <div className={style.main_menu}>
        <Link href={"/"}>Home</Link>
        <Link href={"/scheduling"}>Agendamento</Link>
        <Link href={"/budget"}>Orçamento</Link>
        <Link href={"/client"}>Clientes</Link>
      </div>
    );
  }
  