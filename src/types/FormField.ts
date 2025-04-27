// types/FormField.ts
export interface FormField {
    label: string;
    name: string;
    type: "text" | "select" | "date" | "time" | "textarea" | "checkbox" | "radio"; // Adicionei o tipo 'checkbox' e 'radio'
    placeholder?: string; // para text, textarea e select
    options?: string[]; // para select
    value: string;
  }
  