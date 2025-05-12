"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import ModalView from "@/components/modalView/ModalView";
import { ColumnDef } from "@tanstack/react-table";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";
import api from "@/service/api";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  telefone: string;
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

export default function ClientPage() {
  const { showToast } = useToast();
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Cliente[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields);

 const columns: ColumnDef<Cliente>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nome", header: "Nome" },
  {
     header: "CPF",
  accessorKey: "cpf",
  cell: ({ getValue }) => {
    const cpf = getValue()?.toString().replace(/\D/g, "") ?? "";
    return cpf.length === 11
      ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : cpf;
    },
  },
  {
    header: "Endereço",
    cell: ({ row }) => {
      const { rua, numero, bairro } = row.original;
      return `${rua}, ${numero} - ${bairro}`;
    },
  },
  {
    header: "CEP",
    accessorKey: "cep",
    cell: ({ getValue }) => {
      const cep = String(getValue() ?? "").replace(/\D/g, "");
      return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    },
  },
  {
     header: "Telefone",
  accessorKey: "telefone",
  cell: ({ getValue }) => {
    const tel = getValue()?.toString().replace(/\D/g, "") ?? "";
    return tel.length === 11
      ? tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : tel;
    },
  },
];

 useEffect(() => {
  api.get("/api/v1/clientes")
    .then(res => {
      console.log("Dados recebidos:", res.data);
      setData(res.data);
    })
    .catch(err => {
      console.error("Erro ao buscar clientes:", err);
      showToast("error", "Erro ao carregar clientes.");
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
    const novoCliente = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Cliente
    );
    setData(prev => [...prev, { ...novoCliente, id: prev.length + 1 }]);
    showToast("success", "Cliente cadastrado com sucesso!");
    setIsModalOpen(false);
  };

  const SaveEdit = async () => {
    const atualizado = formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.value }),
      {} as Cliente
    );
    setData(prev =>
      prev.map(c => c.id === atualizado.id ? atualizado : c)
    );
    showToast("success", "Cliente atualizado com sucesso!");
    setIsModalOpen(false);
  };

  const Delete = () => {
    if (selectedCliente) {
      setData(prev => prev.filter(c => c.id !== selectedCliente.id));
      showToast("success", "Cliente removido com sucesso!");
      setIsModalViewOpen(false);
    }
  };

  const handleAction = (
    action: "create" | "edit" | "delete" | "view",
    cliente?: Cliente
  ) => {
    switch (action) {
      case "create":
        setFormFields(defaultFormFields);
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case "edit":
        if (cliente) {
          setSelectedCliente(cliente);
          setFormFields(Object.keys(cliente).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            name: key,
            type: "text",
            value: cliente[key as keyof Cliente]?.toString() || "",
          })));
          setModalMode("edit");
          setIsModalOpen(true);
        }
        break;
      case "delete":
        if (cliente) {
          setSelectedCliente(cliente);
          setModalMode("delete");
          setIsModalViewOpen(true);
        }
        break;
      case "view":
        if (cliente) {
          setSelectedCliente(cliente);
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
          title="Cliente"
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
          title="Cliente"
          contextModal={[
            { label: "Nome", text: selectedCliente.nome },
            { label: "Rua", text: selectedCliente.rua, grouped: true },
            { label: "Número", text: selectedCliente.numero, grouped: true },
            { label: "Bairro", text: selectedCliente.bairro, grouped: true },
            { label: "CEP", text: selectedCliente.cep, grouped: true },
            { label: "Telefone", text: selectedCliente.telefone },
            { label: "CPF", text: selectedCliente.cpf }
          ]}
          onClose={() => setIsModalViewOpen(false)}
        />
      );
    }

    if (modalMode === "delete" && selectedCliente) {
      return (
        <ModalView
          isOpen={isModalViewOpen}
          title="Cliente"
          contextModal={[
            {
              text: `Tem certeza que deseja deletar o cliente ${selectedCliente.nome}?`
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
        title="Clientes"
        onAction={handleAction}
        filterField="nome"
      />
      {renderModal()}
    </>
  );
}