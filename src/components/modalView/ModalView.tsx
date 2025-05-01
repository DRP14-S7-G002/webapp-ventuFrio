import React from "react";
import styles from "./style.module.css";

interface ModalFormProps {
  isOpen: boolean;
  title: string;
  contextModal: {
    label?: string;
    text: string;
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.body}>
          {contextModal.map((item, index) => (
            <div key={index} className={styles.text}>
              {item.label && <label className={styles.label}>{item.label}</label>}
              <p>{item.text}</p>
            </div>
          ))}
        </div>

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
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
