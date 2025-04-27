"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";

interface Agendamento {
  id: number;
  data: string; // Format: YYYY-MM-DD
  hora: string; // Format: HH:mm:ss
}

export default function Scheduling() {
  // Contexts
  const { showToast } = useToast();

  const [data, setData] = useState<Agendamento[]>([
    {
      id: 1,
      data: "2025-05-01",
      hora: "14:30:00",
    },
    {
      id: 2,
      data: "2025-06-15",
      hora: "09:00:00",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formFields, setFormFields] = useState<FormField[]>([
    { label: "Cliente", name: "cliente", type: "select", options: ["João", "Fernanda", "Leticia"], value: "" },
    { label: "Data da Visita", name: "data", type: "date", value: "" },
    { label: "Hora da Visita", name: "hora", type: "time", value: "" },
  ]);

  const columns: ColumnDef<Agendamento>[] = [
    { accessorKey: "idcliente", header: "ID Cliente" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "telefone", header: "Telefone" },
    { accessorKey: "cep", header: "Cep" },
    { accessorKey: "id", header: "ID Agendamento" },
    { accessorKey: "data", header: "Data" },
    { accessorKey: "hora", header: "Hora" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleCreate = () => {
    const newAgendamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Agendamento
    );
    setData((prevData) => [...prevData, newAgendamento]);
    setIsModalOpen(false);
    showToast("success", "Agendamento cadastrado com sucesso!");
  };

  const handleEdit = (id: number) => {
    const agendamento = data.find((a) => a.id === id);
    if (agendamento) {
      setFormFields(
        Object.keys(agendamento).map((key) => ({
          label:
            key === "data"
              ? "Data da Visita"
              : key === "hora"
              ? "Hora da Visita"
              : key,
          name: key,
          type: key === "data" ? "date" : key === "hora" ? "time" : "text",
          value: agendamento[key as keyof Agendamento]?.toString() || "",
        }))
      );
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedAgendamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Agendamento
    );
    setData((prevData) =>
      prevData.map((agendamento) =>
        agendamento.id === updatedAgendamento.id ? updatedAgendamento : agendamento
      )
    );
    setIsModalOpen(false);
    showToast("success", "Agendamento editado com sucesso!");
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((agendamento) => agendamento.id !== id));
    showToast("success", "Agendamento deletado com sucesso!");
  };

  const handleAction = (action: "create" | "edit" | "delete" | "view", agendamento?: Agendamento) => {
    switch (action) {
      case "create":
        setFormFields(
          formFields.map((field) => ({
            ...field,
            value: "",
          }))
        );
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        if (agendamento) handleEdit(agendamento.id);
        break;
      case "delete":
        if (agendamento) handleDelete(agendamento.id);
        break;
      case "view":
        // Placeholder for "view" action
        console.log("View action triggered for:", agendamento);
        break;
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="Agendamentos"
        onAction={handleAction}
      />

      <ModalForm
        isOpen={isModalOpen}
        mode={modalMode}
        title="Agendamento"
        fields={formFields}
        onChange={handleChange}
        onSubmit={modalMode === "edit" ? handleSaveEdit : handleCreate}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}