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

  const getMaxLength = (name: string): number | undefined => {
    switch (name) {
      case "cpf":
        return 14;
      case "telefone":
        return 15;
      case "cep":
        return 9;
      default:
        return undefined;
    }
  };

  const applyMask = (name: string, value: string): string => {
    const numeric = value.replace(/\D/g, "");

    switch (name) {
      case "cpf":
        return numeric
          .replace(/^(\d{3})(\d)/, "$1.$2")
          .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
          .slice(0, 14);
      case "telefone":
        return numeric
          .replace(/^(\d{2})(\d)/, "($1) $2")
          .replace(/^(\(\d{2}\)) (\d{5})(\d)/, "$1 $2-$3")
          .slice(0, 15);
      case "cep":
        return numeric
          .replace(/^(\d{5})(\d)/, "$1-$2")
          .slice(0, 9);
      default:
        return value;
    }
  };

  const handleInputChange = (name: string, value: string) => {
    if (["cpf", "telefone", "cep"].includes(name)) {
      const raw = value.replace(/\D/g, ""); // só números
      onChange(name, raw);
    } else {
      onChange(name, value); // mantém letras, números e espaços
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {mode === "edit" ? `Editar ${title}` : `Novo ${title}`}
        </h2>
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

            const isReadOnly = field.name === "id";
            const maskedValue = applyMask(field.name, field.value);

            const inputElement = (
              <input
                type="text"
                value={maskedValue}
                onChange={(e) => {
                  if (!isReadOnly) {
                    handleInputChange(field.name, e.target.value);
                  }
                }}
                className={styles.input}
                placeholder={field.placeholder}
                required
                maxLength={getMaxLength(field.name)}
                readOnly={isReadOnly}
                style={
                  isReadOnly
                    ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                    : {}
                }
              />
            );

            if (isInline) {
              return (
                <div className={styles.row} key={`${field.name}-${nextField.name}`}>
                  {[field, nextField].map((f) => {
                    const isFReadOnly = f.name === "id";
                    const fMasked = applyMask(f.name, f.value);
                    return (
                      <div key={f.name} className={styles.field}>
                        <label className={styles.label}>{f.label}</label>
                        <input
                          type="text"
                          value={fMasked}
                          onChange={(e) => {
                            if (!isFReadOnly) {
                              handleInputChange(f.name, e.target.value);
                            }
                          }}
                          className={styles.input}
                          placeholder={f.placeholder}
                          required
                          maxLength={getMaxLength(f.name)}
                          readOnly={isFReadOnly}
                          style={
                            isFReadOnly
                              ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                              : {}
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }

            if (
              (field.name === "numero" && fields[index - 1]?.name === "rua") ||
              (field.name === "cep" && fields[index - 1]?.name === "bairro")
            ) {
              return null;
            }

            return (
              <div key={field.name} className={styles.field}>
                <label className={styles.label}>{field.label}</label>
                {inputElement}
              </div>
            );
          })}

          <div className={styles.buttons}>
            <button className={styles.button_salve} type="submit">
              {mode === "edit" ? "Salvar" : "Criar"}
            </button>
            <button
              className={styles.button_cancel}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
