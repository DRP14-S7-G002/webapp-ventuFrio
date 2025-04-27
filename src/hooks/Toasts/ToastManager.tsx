"use client"

import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../../components/Toasts/Toast';

interface ToastInfo {
  id: number;
  type: 'success' | 'error' | 'processing' | 'alert';
  message: string;
}

interface ToastContextProps {
  showToast: (type: ToastInfo['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextProps>({} as ToastContextProps);

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (type: ToastInfo['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
