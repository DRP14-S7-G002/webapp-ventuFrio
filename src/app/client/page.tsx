'use client';

import {  useBudgetContext } from "@/hooks/budget";

export default function Client() {
  const {toggleBudget, budget } = useBudgetContext();

  
  return (
    <div>
      <div>
        <span>{budget}</span>
        <br />
        <button onClick={()=>toggleBudget()}>mais oba</button>
      </div>
    </div>
  );
}
