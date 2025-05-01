'use client';

import { DataTable } from '@/components/table';
import ModalForm from '@/components/modalForm/ModalForm';
import ModalView from '@/components/modalView/ModalView';
import { ColumnDef } from '@tanstack/react-table';
import { FormField } from '@/types/FormField';
import { useState } from "react";
import { useToast } from '@/hooks/Toasts/ToastManager';
// import axios from 'axios'; // Para requisições futuras
import dados from "../../../dados-exemplos.json";

interface Agendamento {
  id: number;
  cliente: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm:ss
}

const defaultFormFields: FormField[] = [
  { label: "Cliente", name: "cliente", type: "select", options: ["João", "Fernanda", "Leticia"], value: "" },
  { label: "Data da Visita", name: "data", type: "date", value: "" },
  { label: "Hora da Visita", name: "hora", type: "time", value: "" },
];

export default function Scheduling() {
  const { showToast } = useToast();
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Agendamento[]>(dados.agendamento);
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields);

  const columns: ColumnDef<Agendamento>[] = [
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "data", header: "Data" },
    { accessorKey: "hora", header: "Hora" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const Create = async () => {
    const newAgendamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Agendamento
    );
    setData(prev => [...prev, newAgendamento]);
    showToast("success", "Agendamento cadastrado com sucesso!");
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
    const updatedAgendamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Agendamento
    );
    setData(prev =>
      prev.map(a => a.id === updatedAgendamento.id ? updatedAgendamento : a)
    );
    showToast("success", "Agendamento editado com sucesso!");
    /*     try {
      const response = await axios.post<Cliente>('https://apiservicetask.onrender.com/createTask', newCliente);
      setData(prev => [...prev, response.data]);
      showToast("success", "Cliente cadastrado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao persistir dados do cliente no servidor!");
    } */
    setIsModalOpen(false);
  };

  const Delete = () => {
    if (selectedAgendamento) {
      setData(prev => prev.filter(a => a.id !== selectedAgendamento.id));
      showToast("success", `Agendamento deletado com sucesso!`);
      /*     try {
      const response = await axios.post<Cliente>('https://apiservicetask.onrender.com/createTask', newCliente);
      setData(prev => [...prev, response.data]);
      showToast("success", "Cliente cadastrado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao persistir dados do cliente no servidor!");
    } */
      setIsModalViewOpen(false);
    }
  };

  const handleAction = (
    action: "create" | "edit" | "delete" | "view",
    agendamento?: Agendamento
  ) => {
    switch (action) {
      case "create":
        setFormFields(formFields.map(f => ({ ...f, value: "" })));
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        const updateAgendamento = data.find(a => a.id === agendamento?.id);
        if (updateAgendamento) {
          setFormFields(Object.keys(updateAgendamento).map((key) => ({
            label:
              key === "data"
                ? "Data da Visita"
                : key === "hora"
                ? "Hora da Visita"
                : key.charAt(0).toUpperCase() + key.slice(1),
            name: key,
            type: key === "data" ? "date" : key === "hora" ? "time" : key === "cliente" ? "select" : "text",
            value: updateAgendamento[key as keyof Agendamento]?.toString() || "",
            options: key === "cliente" ? ["João", "Fernanda", "Leticia"] : undefined,
          })));
          setSelectedAgendamento(updateAgendamento);
          setModalMode("edit");
          setIsModalOpen(true);
        }
        break;
      case "delete":
        if (agendamento) {
          setSelectedAgendamento(agendamento);
          setModalMode("delete");
          setIsModalViewOpen(true);
        }
        break;
      case "view":
        if (agendamento) {
          setSelectedAgendamento(agendamento);
          setModalMode("view");
          setIsModalViewOpen(true);
        }
        break;
    }
  };

  // === Função para renderizar os modais ===
  const renderModal = () => {
    if (modalMode === "create" || modalMode === "edit") {
      return (
        <ModalForm
          isOpen={isModalOpen}
          mode={modalMode}
          title="Agendamento"
          fields={formFields}
          onChange={handleChange}
          onSubmit={modalMode === "edit" ? SaveEdit : Create}
          onClose={() => setIsModalOpen(false)}
        />
      );
    }

    if (modalMode === "view" && selectedAgendamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Agendamento"
          contextModal={[
            {
              label: "Detalhes do Agendamento",
              text: `
                Cliente: ${selectedAgendamento.cliente}
                Data: ${selectedAgendamento.data}
                Hora: ${selectedAgendamento.hora}
              `,
            },
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }

    if (modalMode === "delete" && selectedAgendamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Agendamento"
          contextModal={[
            {
              text: `Você tem certeza que deseja deletar o agendamento de ${selectedAgendamento.cliente}?`,
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
        title="Agendamentos"
        onAction={handleAction}
        filterField="cliente"
      />

      {renderModal()}
    </>
  );
}
