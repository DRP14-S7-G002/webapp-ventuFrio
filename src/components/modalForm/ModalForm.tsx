// components/ModalForm.tsx
import React from "react";
import { FormField } from "@/types/FormField";
import styles from "./style.module.css";

interface ModalFormProps {
  isOpen: boolean;
  title: string;
  fields: FormField[];
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalForm({
  isOpen,
  title,
  fields,
  onChange,
  onSubmit,
  onClose,
}: ModalFormProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className={styles.field}>
              <label className={styles.label}>{field.label}</label>
              {field.type === "text" && (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.input}
                  required
                />
              )}
              {field.type === "select" && (
                <select
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.select}
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <div className={styles.buttons}>
            <button className={styles.button_salve} type="submit">Salvar</button>
            <button className={styles.button_cancel} type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
