import React, { JSX } from "react";
import styles from "./style.module.css";

interface ModalFormProps {
  isOpen: boolean;
  title: string;
  contextModal: {
    label?: string;
    text: string;
    grouped?: boolean;
  }[];
  buttonExtra?: {
    label: string;
    onClick: () => void;
  }[];
  onClose: () => void;
}

export default function ModalView({
  isOpen,
  title,
  onClose,
  buttonExtra,
  contextModal,
}: ModalFormProps) {
  if (!isOpen) return null;

  const renderContext = () => {
    const output: JSX.Element[] = [];

    for (let i = 0; i < contextModal.length; i++) {
      const curr = contextModal[i];
      const next = contextModal[i + 1];

      if (curr.grouped && next?.grouped) {
        output.push(
          <div key={`row-${i}`} className={styles.viewRow}>
            <div>
              {curr.label && <label className={styles.viewLabel}>{curr.label}</label>}
              <div className={styles.viewBox}>{curr.text}</div>
            </div>
            <div>
              {next.label && <label className={styles.viewLabel}>{next.label}</label>}
              <div className={styles.viewBox}>{next.text}</div>
            </div>
          </div>
        );
        i++;
      } else {
        output.push(
          <div key={`item-${i}`} className={styles.viewText}>
            {curr.label && <label className={styles.viewLabel}>{curr.label}</label>}
            <div className={styles.viewBox}>{curr.text}</div>
          </div>
        );
      }
    }

    return output;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}> Detalhes</h2>
        </div>

        <div className={styles.body}>{renderContext()}</div>

        <div className={styles.footer}>
          {buttonExtra?.map((item, index) => (
            <button
              key={index}
              className={styles.confirmButton}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
          <button className={styles.cancelButton} onClick={onClose}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}