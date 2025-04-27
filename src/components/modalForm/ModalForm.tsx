import React from "react";
import { FormField } from "@/types/FormField";
import styles from "./style.module.css";

interface ModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  title: string;
  fields: FormField[];
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalForm({
  isOpen,
  mode,
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
        <h2>{mode === "edit" ? `Editar ${title}` : `Novo ${title}`}</h2>
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
                  placeholder={field.placeholder}
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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.input}
                  required
                />
              )}
              {field.type === "time" && (
                <input
                  type="time"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.input}
                  required
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.textarea}
                  placeholder={field.placeholder}
                  required
                />
              )}
              {field.type === "checkbox" && (
                <input
                  type="checkbox"
                  checked={field.value === "true"}
                  onChange={(e) => onChange(field.name, e.target.checked ? "true" : "false")}
                  className={styles.checkbox}
                />
              )}
              {field.type === "radio" && (
                field.options?.map((opt) => (
                  <label key={opt} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={field.name}
                      value={opt}
                      checked={field.value === opt}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      className={styles.radio}
                    />
                    {opt}
                  </label>
                ))
              )}
            </div>
          ))}
          <div className={styles.buttons}>
            <button className={styles.button_salve} type="submit">
              {mode === "edit" ? "Salvar Alterações" : "Criar"}
            </button>
            <button className={styles.button_cancel} type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}