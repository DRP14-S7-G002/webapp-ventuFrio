import Link from "next/link";

export default function Menu() {

    return (
      <div>
        <Link href={"/home"}>Home</Link>
        <Link href={"/budget"}>Agendamento</Link>
        <Link href={""}>Orçamento</Link>
        <Link href={""}>Clientes</Link>
      </div>
    );
  }
  