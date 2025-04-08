'use client';

import {  useBudgetContext } from "@/hooks/budget";

export default function Home() {
  const {toggleBudget, budget } = useBudgetContext();

  
  return (
    <div>
      <div>
        <h1>Faturamento - criar um componente</h1>
        <h1>Atendimento - criar um componente</h1>
        <span>{budget}</span>
        <br />
        <button onClick={()=>toggleBudget()}>mais oba</button>
      </div>
    </div>
  );
}
