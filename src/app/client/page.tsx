"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import ModalView from "@/components/modalView/ModalView";
import { ColumnDef } from "@tanstack/react-table";
import { FormField } from "@/types/FormField";
import { useToast } from "@/hooks/Toasts/ToastManager";
import api from "@/service/api";
import ModalDelete from "@/components/modalDelete/ModalDelete";

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

  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11
      ? cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : cpf;
  };

  const formatTelefone = (tel: string) => {
    const cleaned = tel.replace(/\D/g, "");
    return cleaned.length === 11
      ? cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : tel;
  };

  const formatCEP = (cep: string) => {
    const cleaned = cep.replace(/\D/g, "");
    return cleaned.length === 8
      ? cleaned.replace(/(\d{5})(\d{3})/, "$1-$2")
      : cep;
  };

  const columns: ColumnDef<Cliente>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nome", header: "Nome" },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ getValue }) => formatCPF(String(getValue() ?? "")),
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      cell: ({ getValue }) => formatTelefone(String(getValue() ?? "")),
    },
    {
      header: "Endereço",
      cell: ({ row }) => {
        const { rua, numero, bairro } = row.original;
        return `${rua}, ${numero} - ${bairro}`;
      },
    },
    {
      accessorKey: "cep",
      header: "CEP",
      cell: ({ getValue }) => formatCEP(String(getValue() ?? "")),
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

  const clean = (value: string, name: string): string => {
    if (["cpf", "telefone", "cep"].includes(name)) {
      return value.replace(/\D/g, "");
    }
    return value;
  };

  const Create = async () => {
    try {
      const clienteParaEnviar = formFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: clean(field.value, field.name),
        }),
        {} as Omit<Cliente, "id">
      );

      const response = await api.post("/api/v1/clientes", clienteParaEnviar);

      // O backend deve retornar o cliente criado com ID
      const clienteCriado: Cliente = response.data;

      // Adiciona o cliente no topo
      setData(prev => [clienteCriado, ...prev]);

      showToast("success", "Cliente cadastrado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      showToast("error", "Erro ao cadastrar cliente.");
    }
  };

  const SaveEdit = async () => {
  console.log("🛠 Salvando cliente...");

  const atualizado = formFields
    .filter(field => field.name !== "id")
    .reduce((acc, field) => ({
      ...acc,
      [field.name]: clean(field.value, field.name),
    }), {});

  console.log("📦 Dados a enviar:", atualizado);

  try {
    await api.put(`/api/v1/clientes/${selectedCliente?.id}`, atualizado);

    const response = await api.get("/api/v1/clientes");
    setData(response.data);

    showToast("success", "Cliente atualizado com sucesso!");
    setIsModalOpen(false);
  } catch (error) {
    console.error("❌ Erro ao salvar cliente:", error);
    showToast("error", "Erro ao salvar alterações.");
  }
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
        <ModalDelete
          isOpen={isModalViewOpen}
          title="Excluir Cliente"
          message={
            <>
              Tem certeza que deseja deletar o cliente {" "}
              <span style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "1.5em" }}>
                {selectedCliente.nome} ?
              </span>
            </>
          }
          onConfirm={Delete}
          onCancel={() => setIsModalViewOpen(false)}
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