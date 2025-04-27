'use client';

import { DataTable } from '@/components/table';
import ModalForm from '@/components/modalForm/ModalForm';
import { ColumnDef } from '@tanstack/react-table';
import { FormField } from '@/types/FormField';
import { useState } from "react";
import { useToast } from '@/hooks/Toasts/ToastManager';
interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
}

export default function Client() {
  //contexts
  const { showToast } = useToast();

  const [data, setData] = useState<Cliente[]>([
    {
      id: 1,
      nome: "João Silva",
      telefone: "11999999999",
      cpf: "12345678901",
      rua: "Rua A",
      numero: "123",
      bairro: "Centro",
      cep: "12345678",
    },
    {
      id: 2,
      nome: "Maria Souza",
      telefone: "11888888888",
      cpf: "98765432100",
      rua: "Rua B",
      numero: "456",
      bairro: "Jardim",
      cep: "87654321",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formFields, setFormFields] = useState<FormField[]>([
    { label: "Nome", name: "nome", type: "text", value: "" },
    { label: "Telefone", name: "telefone", type: "text", value: "" },
    { label: "CPF", name: "cpf", type: "text", value: "" },
    { label: "Rua", name: "rua", type: "text", value: "" },
    { label: "Número", name: "numero", type: "text", value: "" },
    { label: "Bairro", name: "bairro", type: "text", value: "" },
    { label: "CEP", name: "cep", type: "text", value: "" },
  ]);

  const columns: ColumnDef<Cliente>[] = [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "telefone", header: "Telefone" },
    { accessorKey: "cpf", header: "CPF" },
    { accessorKey: "rua", header: "Rua" },
    { accessorKey: "numero", header: "Número" },
    { accessorKey: "bairro", header: "Bairro" },
    { accessorKey: "cep", header: "CEP" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleCreate = () => {
    setModalMode("create");
    setIsModalOpen(true)
    const newCliente = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Cliente
    );
    setData((prevData) => [...prevData, newCliente]);
    setIsModalOpen(false);
    showToast("success", "Cliente cadastrado com sucesso!");
  }

  const handleEdit = (id: number) => {
    const cliente = data.find((c) => c.id === id);
    if (cliente) {
      setFormFields(
        Object.keys(cliente).map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          name: key,
          type: "text",
          value: cliente[key as keyof Cliente] as string,
        }))
      );
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedCliente = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Cliente
    );
    setData((prevData) =>
      prevData.map((cliente) =>
        cliente.id === updatedCliente.id ? updatedCliente : cliente
      )
    );
    setIsModalOpen(false);
    showToast("success", "Cliente Editado com sucesso!");
  };

  const handleView = (cliente: any) => {
  }

  const handleDelete = (id: number) => {

    showToast("success", "Cliente Deletado com sucesso!");
  }

  const handleAction = (action: 'create' | 'edit' | 'delete' | 'view', cliente?: Cliente) => {
    switch (action) {
      case 'create':
        setFormFields(
          formFields.map((field) => ({
            label: field.label,
            name: field.name,
            type: "text",
            value: "",
          }))
        );
        setModalMode('create');
        setIsModalOpen(true);
        break;
      case 'edit':
        if (cliente) handleEdit(cliente.id);
        break;
      case 'delete':
        if (cliente) handleDelete(cliente.id);
        break;
      case 'view':
        if (cliente) handleView(cliente);
        break;
    }
  };


  return (
  <>

    <DataTable
      columns={columns}
      data={data}
      title="Clientes"
      onAction={handleAction}
    />

    <ModalForm
      isOpen={isModalOpen}
      mode={modalMode}
      title="Clientes"
      fields={formFields}
      onChange={handleChange}
      onSubmit={modalMode === "edit" ? handleSaveEdit : handleCreate}
      onClose={() => setIsModalOpen(false)}
    />
  </>
  );
}
