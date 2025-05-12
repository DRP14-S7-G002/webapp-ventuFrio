"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import ModalView from "@/components/modalView/ModalView";
import { ColumnDef } from "@tanstack/react-table";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";
import api from "@/service/api";

interface Agendamento {
  id: number;
  cliente_id: number;
  data_visita: string;
  cliente_nome?: string;
}

interface Cliente {
  id: number;
  nome: string;
}

export default function Scheduling() {
  const { showToast } = useToast();
  const [data, setData] = useState<Agendamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  const columns: ColumnDef<Agendamento>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "cliente_nome", header: "Cliente" },
    { accessorKey: "data_visita", header: "Data" }
  ];

  const getFormFields = (): FormField[] => [
    {
      label: "Cliente",
      name: "cliente_id",
      type: "select",
      options: clientes.map(c => `${c.id}`),
      value: ""
    },
    {
      label: "Data da Visita",
      name: "data_visita",
      type: "date",
      value: ""
    }
  ];

  const carregarAgendamentos = async () => {
    const [agRes, cliRes] = await Promise.all([
      api.get("/api/v1/agendamentos"),
      api.get("/api/v1/clientes")
    ]);

    const agendamentos = agRes.data.map((ag: Agendamento) => {
      const nome = cliRes.data.find((c: Cliente) => c.id === ag.cliente_id)?.nome || "Desconhecido";
      return { ...ag, cliente_nome: nome };
    });

    setClientes(cliRes.data);
    setData(agendamentos);
  };

  useEffect(() => {
    carregarAgendamentos().catch(err => {
      console.error("Erro ao carregar dados:", err);
      showToast("error", "Erro ao carregar agendamentos ou clientes.");
    });
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormFields(prev =>
      prev.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const Create = async () => {
    const payload = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as { cliente_id: string; data_visita: string }
    );

    try {
      await api.post("/api/v1/agendamentos", {
        cliente_id: Number(payload.cliente_id),
        data_visita: payload.data_visita
      });

      showToast("success", "Agendamento criado com sucesso!");
      setIsModalOpen(false);
      await carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      showToast("error", "Erro ao cadastrar agendamento.");
    }
  };

  const SaveEdit = async () => {
    if (!selectedAgendamento) return;

    const payload = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as { cliente_id: string; data_visita: string }
    );

    try {
      await api.put(`/api/v1/agendamentos/${selectedAgendamento.id}`, {
        cliente_id: Number(payload.cliente_id),
        data_visita: payload.data_visita
      });

      showToast("success", "Agendamento atualizado com sucesso!");
      setIsModalOpen(false);
      await carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao editar agendamento:", error);
      showToast("error", "Erro ao editar agendamento.");
    }
  };

  const Delete = async () => {
    if (!selectedAgendamento) return;

    try {
      await api.delete(`/api/v1/agendamentos/${selectedAgendamento.id}`);
      showToast("success", "Agendamento deletado com sucesso!");
      setIsModalViewOpen(false);
      await carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      showToast("error", "Erro ao deletar agendamento.");
    }
  };

  const handleAction = (
    action: "create" | "edit" | "delete" | "view",
    agendamento?: Agendamento
  ) => {
    switch (action) {
      case "create":
        setFormFields(getFormFields());
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        if (agendamento) {
          setSelectedAgendamento(agendamento);
          const fields = getFormFields().map(f => ({
            ...f,
            value:
              f.name === "cliente_id"
                ? agendamento.cliente_id.toString()
                : agendamento.data_visita
          }));
          setFormFields(fields);
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
            { label: "Cliente", text: selectedAgendamento.cliente_nome ?? "Desconhecido" },
            { label: "Data", text: selectedAgendamento.data_visita }
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
              text: `Tem certeza que deseja deletar o agendamento de ${selectedAgendamento.cliente_nome}?`
            }
          ]}
          buttonExtra={[
            {
              label: "Deletar",
              onClick: Delete
            }
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
        filterField="cliente_nome"
      />
      {renderModal()}
    </>
  );
}
