// types/FormField.ts
export interface FormField {
    label: string;
    name: string;
    type: "text" | "select";
    options?: string[]; // para select
    value: string;
  }
  