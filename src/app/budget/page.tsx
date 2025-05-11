'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/table';
import ModalForm from '@/components/modalForm/ModalForm';
import ModalView from '@/components/modalView/ModalView';
import { FormField } from '@/types/FormField';
import { useToast } from '@/hooks/Toasts/ToastManager';
import axios from 'axios';
import dados from "../../../dados-exemplos.json";

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

const defaultFormFields: FormField[] = [
  { label: "Descricao Inicial", name: "descricao_nicial", type: "text", value: "" },
  { label: "Descrição Item", name: "descricao_item", type: "text", value: "" },
  { label: "Status", name: "status", type: "select", options: ["Pendente", "Aprovado", "Recusado"], value: "Pendente" },
  { label: "Prazo de Entrega", name: "prazoEntrega", type: "text", value: "" },
  { label: "Valor", name: "valor", type: "text", value: "" },
  { label: "Cliente", name: "cliente", type: "select", options: ["João", "Fernanda", "Leticia"], value: "" },
  { label: "Agendamento", name: "agendamento", type: "select", options: ["1", "2", "3"], value: "" },
];

export default function Budget() {
  const { showToast } = useToast();
  const [data, setData] = useState<Orcamento[]>(dados.orcamento);
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);

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
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const Create = async () => {
    const newOrcamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      { id: data.length + 1 } as Orcamento
    );
    setData(prev => [...prev, newOrcamento]);
    showToast("success", "Orçamento cadastrado com sucesso!");
/*     try {
      await axios.post('https://url', newOrcamento); // ajustar URL se necessário
      showToast("success", "Orçamento cadastrado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao cadastrar orçamento no servidor!");
    } */
    setIsModalOpen(false);
  };

  const SaveEdit = async () => {
    const updatedOrcamento = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Orcamento
    );
    setData(prev =>
      prev.map(o => o.id === updatedOrcamento.id ? updatedOrcamento : o)
    );
    showToast("success", "Orçamento atualizado com sucesso!");
/*     try {
      await axios.post('https://url', updatedOrcamento);
      showToast("success", "Orçamento atualizado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao atualizar orçamento no servidor!");
    } */
    setIsModalOpen(false);
  };

  const Delete = () => {
    if (selectedOrcamento) {
      setData(prev => prev.filter(o => o.id !== selectedOrcamento.id));
      showToast("success", `Orçamento deletado com sucesso!`);
      /*     try {
      await axios.post('https://url', updatedOrcamento);
      showToast("success", `Orçamento deletado com sucesso!`);
    } catch (error) {
      showToast("error", "Erro ao atualizar orçamento no servidor!");
    } */
      setIsModalViewOpen(false);
    }
  };

  const handleAction = (
    action: "create" | "edit" | "delete" | "view",
    orcamento?: Orcamento
  ) => {
    switch (action) {
      case "create":
        setFormFields(formFields.map(f => ({ ...f, value: f.name === "status" ? "Pendente" : "" })));
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        const updateOrcamento = data.find(o => o.id === orcamento?.id);
        if (updateOrcamento) {
          setFormFields(Object.keys(updateOrcamento).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            name: key,
            type: "text",
            value: updateOrcamento[key as keyof Orcamento]?.toString() || "",
          })));
          setSelectedOrcamento(updateOrcamento);
          setModalMode("edit");
          setIsModalOpen(true);
        }
        break;
      case "delete":
        if (orcamento) {
          setSelectedOrcamento(orcamento);
          setModalMode("delete");
          setIsModalViewOpen(true);
        }
        break;
      case "view":
        if (orcamento) {
          setSelectedOrcamento(orcamento);
          setModalMode("view");
          setIsModalViewOpen(true);
        }
        break;
    }
  };
  
  const renderModal = () => {
    if (modalMode === "create" || modalMode === "edit") {
      return (
        <ModalForm
          isOpen={isModalOpen}
          mode={modalMode}
          title="Orçamento"
          fields={formFields}
          onChange={handleChange}
          onSubmit={modalMode === "edit" ? SaveEdit : Create}
          onClose={() => setIsModalOpen(false)}
        />
      );
    }
  
    if (modalMode === "view" && selectedOrcamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Orçamentos"
          contextModal={[
            {
              label: "Detalhes do Orçamento",
              text: `
                Nome: ${selectedOrcamento.cliente}
                Descrição: ${selectedOrcamento.descricaoItem}
                Valor: R$ ${selectedOrcamento.valor}
                Status: ${selectedOrcamento.status}
                Prazo de Entrega: ${selectedOrcamento.prazoEntrega}
                Agendamento: ${selectedOrcamento.agendamento}
              `,
            },
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }
  
    if (modalMode === "delete" && selectedOrcamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Orçamentos"
          contextModal={[
            {
              text: `Você tem certeza que deseja deletar o orçamento "${selectedOrcamento.descricaoItem}"?`,
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
        title="Orçamentos"
        onAction={handleAction}
        filterField="descricaoItem"
      />
      {renderModal()}
    </>
  );  
}
