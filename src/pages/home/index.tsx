import { useState } from "react";
import Menu from "../../components/menu";
import Header from "@/components/header";

export default function Home() {

  return (
    <div>
      <Header/>
      <Menu/>
      
      <div>
        <h1>Faturamento - criar um componente</h1> 
        <h1>Atendimento - criar um componente</h1>
      </div>
    </div>
  );
}
