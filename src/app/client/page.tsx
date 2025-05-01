'use client';

import { DataTable } from '@/components/table';
import ModalForm from '@/components/modalForm/ModalForm';
import ModalView from '@/components/modalView/ModalView';
import { ColumnDef } from '@tanstack/react-table';
import { FormField } from '@/types/FormField';
import { useState } from "react";
import { useToast } from '@/hooks/Toasts/ToastManager';
import axios from 'axios';
import dados from "../../../dados-exemplos.json"; 

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

const defaultFormFields: FormField[] = [
  { label: "Nome", name: "nome", type: "text", value: "" },
  { label: "Telefone", name: "telefone", type: "text", value: "" },
  { label: "CPF", name: "cpf", type: "text", value: "" },
  { label: "Rua", name: "rua", type: "text", value: "" },
  { label: "Número", name: "numero", type: "text", value: "" },
  { label: "Bairro", name: "bairro", type: "text", value: "" },
  { label: "CEP", name: "cep", type: "text", value: "" },
];

export default function Client() {
  const { showToast } = useToast();
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState<Cliente[]>(dados.cliente);


  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields);

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
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const Create = async () => {
    const newCliente = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Cliente
    );
    setData(prev => [...prev, newCliente]);
    showToast("success", "Cliente cadastrado com sucesso!");
/*     try {
      const response = await axios.post<Cliente>('https://apiservicetask.onrender.com/createTask', newCliente);
      setData(prev => [...prev, response.data]);
      showToast("success", "Cliente cadastrado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao persistir dados do cliente no servidor!");
    } */

    setIsModalOpen(false);
  };

  const SaveEdit = async () => {
    const updatedCliente = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Cliente
    );
    setData(prev => prev.map(cliente => cliente.id === updatedCliente.id ? updatedCliente : cliente));
    showToast("success", "Cliente editado com sucesso!");
/*     try {
      await axios.post<Cliente>('https://apiservicetask.onrender.com/createTask', updatedCliente);
      setData(prev => prev.map(cliente => cliente.id === updatedCliente.id ? updatedCliente : cliente));
      showToast("success", "Cliente editado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao atualizar cliente no servidor!");
    } */

    setIsModalOpen(false);
  };

  const Delete = () => {
    if (selectedCliente) {
      setData(prev => prev.filter(c => c.id !== selectedCliente.id));
      showToast("success", `Cliente ${selectedCliente.nome} deletado com sucesso!`);
      /*     try {
      await axios.post<Cliente>('https://apiservicetask.onrender.com/createTask', updatedCliente);
      setData(prev => prev.map(cliente => cliente.id === updatedCliente.id ? updatedCliente : cliente));
      showToast("success", `Cliente ${selectedCliente.nome} deletado com sucesso!`);
    } catch (error) {
      showToast("error", "Erro ao atualizar cliente no servidor!");
    } */
      setIsModalViewOpen(false);
    }
  };

  const handleAction = (
    action: "create" | "edit" | "delete" | "view",
    cliente?: Cliente
  ) => {
    switch (action) {
      case "create":
        setFormFields(formFields.map(f => ({ ...f, value: "" })));
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        const updateCliente = data.find(c => c.id === cliente?.id);
        if (updateCliente) {
          setFormFields(Object.keys(updateCliente).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            name: key,
            type: "text",
            value: updateCliente[key as keyof Cliente] as string,
          })));
          setSelectedCliente(updateCliente);
          setModalMode("edit");
          setIsModalOpen(true);
        }
        break;
      case "delete":
        if (cliente)
            setSelectedCliente(cliente);
            setModalMode("delete");
            setIsModalViewOpen(true);
        break;
      case "view":
        if (cliente) 
            setSelectedCliente(cliente);
            setModalMode("view");
            setIsModalViewOpen(true);
          break;
      };
    }

  const renderModal = () => {
    if (modalMode === "create" || modalMode === "edit") {
      return (
        <ModalForm
          isOpen={isModalOpen}
          mode={modalMode}
          title="Clientes"
          fields={formFields}
          onChange={handleChange}
          onSubmit={modalMode === "edit" ? SaveEdit : Create}
          onClose={() => setIsModalOpen(false)}
        />
      );
    }

    if (modalMode === "view" && selectedCliente) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Clientes"
          contextModal={[
            {
              label: "Detalhes do Cliente",
              text: `
                Nome: ${selectedCliente.nome}
                Telefone: ${selectedCliente.telefone}
                CPF: ${selectedCliente.cpf}
                Rua: ${selectedCliente.rua}
                Número: ${selectedCliente.numero}
                Bairro: ${selectedCliente.bairro}
                CEP: ${selectedCliente.cep}
              `,
            },
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }

    if (modalMode === "delete" && selectedCliente) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Clientes"
          contextModal={[
            {
              text: `Você tem certeza que deseja deletar o cliente ${selectedCliente.nome}?`,
            },
          ]}
          buttonExtra={[
            {
              label: "Deletar",
              onClick: Delete,
            },
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="Clientes"
        onAction={handleAction}
        filterField="nome"
      />

      {renderModal()}
    </>
  );
}
