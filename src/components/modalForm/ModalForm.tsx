"use client";
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
        <h2 className={styles.title}>{mode === "edit" ? `Editar ${title}` : `Novo ${title}`}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {fields.map((field, index) => {
            const nextField = fields[index + 1];

            const isInline =
              (field.name === "rua" && nextField?.name === "numero") ||
              (field.name === "bairro" && nextField?.name === "cep");

            if (isInline) {
              return (
                <div className={styles.row} key={`${field.name}-${nextField.name}`}>
                  {[field, nextField].map((f) => (
                    <div key={f.name} className={styles.field}>
                      <label className={styles.label}>{f.label}</label>
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => onChange(f.name, e.target.value)}
                        className={styles.input}
                        placeholder={f.placeholder}
                        required
                      />
                    </div>
                  ))}
                </div>
              );
            }

            // Pula o campo que já foi renderizado em par
            if (
              (field.name === "numero" && fields[index - 1]?.name === "rua") ||
              (field.name === "cep" && fields[index - 1]?.name === "bairro")
            ) {
              return null;
            }

            return (
              <div key={field.name} className={styles.field}>
                <label className={styles.label}>{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className={styles.input}
                  placeholder={field.placeholder}
                  required
                />
              </div>
            );
          })}

          <div className={styles.buttons}>
            <button className={styles.button_salve} type="submit">
              {mode === "edit" ? "Salvar" : "Criar"}
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