import styles from "./style.module.css";
import { FiAlertTriangle } from "react-icons/fi";

interface ModalDeleteProps {
  isOpen: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalDelete({
  isOpen,
  title = "Confirmação",
  message,
  onConfirm,
  onCancel,
}: ModalDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <FiAlertTriangle className={styles.fiAlertTriangle}/>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.viewText}>
            <div className={styles.viewBox}>{message}</div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}