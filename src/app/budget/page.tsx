"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import ModalView from "@/components/modalView/ModalView";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";
import api from "@/service/api";

interface Orcamento {
  id: number;
  descricaoInicial: string;
  descricaoItem: string;
  status: string;
  prazoEntrega: string;
  valor: number;
  clienteID: number;
  agendamentoID: number;
}

interface Cliente { id: number; nome: string; }
interface Agendamento { id: number; cliente: string; data: string; hora: string; }

export default function Budget() {
  const { showToast } = useToast();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("view");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/orcamentos"),
      api.get("/api/v1/clientes"),
      api.get("/api/v1/agendamentos"),
    ]).then(([orc, cli, agd]) => {
      const tratados = orc.data.map((o: any) => ({
        id: o.id,
        descricaoInicial: o.descricao_inicial,
        descricaoItem: o.descricao_item,
        status: o.status,
        prazoEntrega: o.prazo_entrega,
        valor: o.valor,
        clienteID: o.cliente_id,
        agendamentoID: o.agendamento_id,
      }));
      setOrcamentos(tratados);
      setClientes(cli.data);
      setAgendamentos(agd.data);
    }).catch(() => showToast("error", "Erro ao carregar dados."));
  }, []);

  const getClienteNome = (id: number) => clientes.find(c => c.id === id)?.nome || "";
  const getAgendamentoLabel = (id: number) => {
    const ag = agendamentos.find(a => a.id === id);
    return ag ? `${ag.cliente} - ${ag.data}` : "";
  };

  const columns: ColumnDef<Orcamento>[] = [
    { accessorKey: "descricaoInicial", header: "Descrição Inicial" },
    { accessorKey: "descricaoItem", header: "Descrição Item" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "prazoEntrega", header: "Prazo de Entrega" },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: info => Number(info.getValue()).toLocaleString("pt-BR", {
        style: "currency", currency: "BRL",
      }),
    },
    {
      accessorKey: "clienteID",
      header: "Cliente",
      cell: info => getClienteNome(info.getValue() as number),
    },
  ];

  const openForm = (mode: "create" | "edit", orcamento?: Orcamento) => {
    const fields: FormField[] = [
      { label: "Descrição Inicial", name: "descricaoInicial", type: "text", value: orcamento?.descricaoInicial || "" },
      { label: "Descrição Item", name: "descricaoItem", type: "text", value: orcamento?.descricaoItem || "" },
      { label: "Status", name: "status", type: "select", options: ["Pendente", "Aprovado", "Recusado"], value: orcamento?.status || "Pendente" },
      { label: "Prazo de Entrega", name: "prazoEntrega", type: "date", value: orcamento?.prazoEntrega || "" },
      { label: "Valor", name: "valor", type: "text", value: orcamento?.valor?.toString() || "" },
      { label: "Cliente", name: "clienteID", type: "select", options: clientes.map(c => c.id.toString()), value: orcamento?.clienteID.toString() || "" },
    ];
    setFormFields(fields);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleChange = (name: string, value: string) => {
    setFormFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
  };

  const handleSubmit = async () => {
    const payload = formFields.reduce((acc, f) => ({ ...acc, [f.name]: f.name.includes("ID") ? Number(f.value) : f.value }), {});
    try {
      if (modalMode === "create") {
        await api.post("/api/v1/orcamentos", payload);
        showToast("success", "Orçamento criado!");
      } else if (modalMode === "edit" && selectedOrcamento) {
        await api.put(`/api/v1/orcamentos/${selectedOrcamento.id}`, payload);
        showToast("success", "Orçamento atualizado!");
      }
      location.reload();
    } catch {
      showToast("error", "Erro ao salvar orçamento.");
    }
  };

  const handleDelete = async () => {
    if (!selectedOrcamento) return;
    try {
      await api.delete(`/api/v1/orcamentos/${selectedOrcamento.id}`);
      showToast("success", "Orçamento excluído!");
      location.reload();
    } catch {
      showToast("error", "Erro ao excluir.");
    }
  };

  const handleAction = (action: "create" | "edit" | "delete" | "view", orcamento?: Orcamento) => {
    setSelectedOrcamento(orcamento || null);
    if (action === "create") return openForm("create");
    if (action === "edit" && orcamento) return openForm("edit", orcamento);
    if (action === "delete" && orcamento) {
      setModalMode("delete");
      setIsModalViewOpen(true);
    }
    if (action === "view" && orcamento) {
      setModalMode("view");
      setIsModalViewOpen(true);
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
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      );
    }
    if (modalMode === "view" && selectedOrcamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Orçamento"
          contextModal={[
            { label: "Cliente", text: getClienteNome(selectedOrcamento.clienteID) },
            { label: "Descrição Item", text: selectedOrcamento.descricaoItem },
            { label: "Status", text: selectedOrcamento.status },
            { label: "Valor", text: selectedOrcamento.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
            { label: "Prazo de Entrega", text: selectedOrcamento.prazoEntrega },
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }
    if (modalMode === "delete" && selectedOrcamento) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Excluir Orçamento"
          contextModal={[{ text: `Deseja excluir o orçamento de ${getClienteNome(selectedOrcamento.clienteID)}?` }]}
          buttonExtra={[{ label: "Deletar", onClick: handleDelete }]}
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
        data={orcamentos}
        title="Orçamentos"
        onAction={handleAction}
        filterField="descricaoItem"
      />
      {renderModal()}
    </>
  );
}