"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import ModalForm from "@/components/modalForm/ModalForm";
import { FormField } from "@/types/FormField";
import { BsEye } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import style from "./style.module.css"
interface Agendamento {
  id: number;
  nome: string;
  status: string;
  endereco: string,
  data: string,
}

const columns: ColumnDef<Agendamento>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "endereco", header: "Endereço",},
  { accessorKey: "data", header: "Data",},
  { accessorKey: "status", header: "Status",},
  {
    header: "Ações",
    meta: { className: style.actionColumn },
    cell: ({ row }) => (
      <>
        <button className={style.button_action}
          onClick={() => alert(`Editando ${row.original.nome}`)}
        >
       <FiEdit size={20} style={{ marginRight: "12px", color: "#dfbd00"}} />
        </button>
        <button className={style.button_action}
          onClick={() => alert(`Deletando ${row.original.nome}`)}
        >
          <FiTrash2 size={20} style={{ marginRight: "12px", color: "#bd0000" }}/>
        </button>
        <button className={style.button_action}
          onClick={() => alert(`viws ${row.original.nome}`)}
        ><BsEye size={20} style={{ marginRight: "12px", color: "#0096c4" }} />
        </button>
      </>
    ),
  },
];

export default function Budget() {
  const [data, setData] = useState<Agendamento[]>([
    { id: 1, nome: "João Silva", endereco: "Rua A", data: "12/03/2025", status: "aprovado" },
    { id: 2, nome: "Maria Souza", endereco: "Rua B", data: "25/03/2025", status: "pendente" },
    { id: 3, nome: "Carlos Lima", endereco: "Rua c", data: "07/03/2025", status: "recusado" },
    { id: 4, nome: "A", endereco: "Rua A", data: "12/03/2025", status: "aprovado" },
    { id: 5, nome: "B", endereco: "Rua B", data: "25/03/2025", status: "pendente" },
    { id: 6, nome: "c", endereco: "Rua c", data: "07/03/2025", status: "recusado" },
    { id: 7, nome: "D", endereco: "Rua A", data: "12/03/2025", status: "aprovado" },
    { id: 8, nome: "B", endereco: "Rua B", data: "25/03/2025", status: "pendente" },
    { id: 9, nome: "c", endereco: "Rua c", data: "07/03/2025", status: "recusado" },
    { id: 10, nome: "r", endereco: "Rua A", data: "12/03/2025", status: "aprovado" },
    { id: 11, nome: "B", endereco: "Rua B", data: "25/03/2025", status: "pendente" },
    { id: 12, nome: "c", endereco: "Rua c", data: "07/03/2025", status: "recusado" },
  ]);
  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formFields, setFormFields] = useState<FormField[]>([
    { label: "Nome", name: "nome", type: "text", value: "" },
    { label: "Endereço", name: "endereco", type: "text", value: "" },
    { label: "Data", name: "data", type: "text", value: "" },
    {
      label: "Status", name: "status", type: "select",
      options: ["Confirmado", "Pendente"],
      value: "Pendente",
    },
  ]);

  const handleChange = (name: string, value: string) => {
    setFormFields((prev) =>
      prev.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleCreate = () => {
    const values = Object.fromEntries(
      formFields.map((f) => [f.name, f.value])
    );
    const newId = data.length + 1;
    const newItem: Agendamento = {
      id: newId,
      nome: values.nome,
      status: values.status,
      endereco: values.enderecom,
      data: values.data
    };
    setData((prev) => [...prev, newItem]);
    setFormFields((prev) =>
      prev.map((field) =>
        field.name === "status"
          ? { ...field, value: "Pendente" }
          : { ...field, value: "" }
      )
    );
    setIsModalOpen(false);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="Orçamento"
        createRegister={() => setIsModalOpen(true)}
      />

      <ModalForm
        isOpen={isModalOpen}
        title="Novo Orçamento"
        fields={formFields}
        onChange={handleChange}
        onSubmit={handleCreate}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
