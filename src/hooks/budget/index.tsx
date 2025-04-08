"use client"

import { createContext, useState, ReactNode, useContext } from "react";

interface BudgetContextType {
  budget: string;
  toggleBudget: () => void;
}

export const BudgetContext = createContext<BudgetContextType | null>(null);
interface BudgetProviderProps {
  children: ReactNode;
}

function BudgetProvider({ children }: BudgetProviderProps) {
  const [budget, setBudget] = useState("light");

  function toggleBudget() {
    setBudget((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <BudgetContext.Provider value={{ budget, toggleBudget }}>
      {children}
    </BudgetContext.Provider>
  );
}

function useBudgetContext(){
  const context = useContext(BudgetContext)

  if(context === null){
      throw new Error ('Não Esta dentro do contexto')
  }
  return context
}

export { BudgetProvider, useBudgetContext };
