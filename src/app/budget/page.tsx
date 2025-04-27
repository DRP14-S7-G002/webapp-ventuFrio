"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";

interface Orcamento {
  id: number;
  descricaoInicial: string;
  descricaoItem: string;
  status: string;
  prazoEntrega: string;
  valor: number;
  cliente: string;
  agendamento: string;
}

export default function Budget() {
  // Contexts
  const { showToast } = useToast();

  const [data, setData] = useState<Orcamento[]>([
    {
      id: 1,
      descricaoInicial: "Descrição inicial 1",
      descricaoItem: "Item 1",
      status: "Pendente",
      prazoEntrega: "2025-05-01",
      valor: 1500.0,
      cliente: "João Silva",
      agendamento: "Agendamento 1",
    },
    {
      id: 2,
      descricaoInicial: "Descrição inicial 2",
      descricaoItem: "Item 2",
      status: "Aprovado",
      prazoEntrega: "2025-05-10",
      valor: 2500.0,
      cliente: "Maria Souza",
      agendamento: "Agendamento 2",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formFields, setFormFields] = useState<FormField[]>([
    { label: "Descrição Inicial", name: "descricaoInicial", type: "text", value: "" },
    { label: "Descrição Item", name: "descricaoItem", type: "text", value: "" },
    { label: "Status", name: "status", type: "select", options: ["Pendente", "Aprovado", "Recusado"], value: "Pendente",  },
    { label: "Prazo de Entrega", name: "prazoEntrega", type: "text", value: "" },
    { label: "Valor", name: "valor", type: "text", value: "" },
    { label: "Cliente", name: "cliente", type: "select", options: ["João", "Fernanda", "Leticia"], value: "" },
    { label: "Agendamento", name: "agendamento", type: "select", options: ["1", "2", "3"], value: "" },
  ]);

  const columns: ColumnDef<Orcamento>[] = [
    { accessorKey: "descricaoInicial", header: "Descrição Inicial" },
    { accessorKey: "descricaoItem", header: "Descrição Item" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "prazoEntrega", header: "Prazo de Entrega" },
    { accessorKey: "valor", header: "Valor" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "agendamento", header: "Agendamento" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleCreate = () => {
    const newOrcamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Orcamento
    );
    setData((prevData) => [...prevData, newOrcamento]);
    setIsModalOpen(false);
    showToast("success", "Orçamento cadastrado com sucesso!");
  };

  const handleEdit = (id: number) => {
    const orcamento = data.find((o) => o.id === id);
    if (orcamento) {
      setFormFields(
        Object.keys(orcamento).map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          name: key,
          type: key === "status" ? "select" : "text",
          value: orcamento[key as keyof Orcamento]?.toString() || "",
          options: key === "status" ? ["Pendente", "Aprovado", "Recusado"] : undefined,
        }))
      );
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedOrcamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Orcamento
    );
    setData((prevData) =>
      prevData.map((orcamento) =>
        orcamento.id === updatedOrcamento.id ? updatedOrcamento : orcamento
      )
    );
    setIsModalOpen(false);
    showToast("success", "Orçamento editado com sucesso!");
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((orcamento) => orcamento.id !== id));
    showToast("success", "Orçamento deletado com sucesso!");
  };

  const handleAction = (action: "create" | "edit" | "delete" | "view", orcamento?: Orcamento) => {
    switch (action) {
      case "create":
        setFormFields(
          formFields.map((field) => ({
            ...field,
            value: field.name === "status" ? "Pendente" : "",
          }))
        );
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        if (orcamento) handleEdit(orcamento.id);
        break;
      case "delete":
        if (orcamento) handleDelete(orcamento.id);
        break;
      case "view":
        // Placeholder for "view" action
        console.log("View action triggered for:", orcamento);
        break;
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="Orçamentos"
        onAction={handleAction}
      />

      <ModalForm
        isOpen={isModalOpen}
        mode={modalMode}
        title="Orçamento"
        fields={formFields}
        onChange={handleChange}
        onSubmit={modalMode === "edit" ? handleSaveEdit : handleCreate}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}