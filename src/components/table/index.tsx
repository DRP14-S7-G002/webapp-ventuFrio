"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import style from "./style.module.css";
import { FiFilter } from "react-icons/fi";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  title: string;
  createRegister: () => void;
}

export function DataTable<TData>({ columns, data, title, createRegister }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <article className={style.container}>
      <div className={style.action_heade}>
        <div className={style.input_container}>
          <FiFilter className={style.input_icon} />
          <input
            className={style.input_search_table}
            type="text"
            placeholder="Buscar"
          />
        </div>
        <button className={style.create_resister_table} onClick={createRegister}>
          Adicionar novo
        </button>
      </div>

      <h1 className={style.heading}>{title}</h1>

      <table className={style.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={style.headerRow}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => (
            <tr key={row.id} className={idx % 2 === 0 ? style.rowEven : style.rowOdd}>
              {row.getVisibleCells().map((cell) => {
                const isStatus = cell.column.id === "status";
                const statusValue = String(cell.getValue()).toLowerCase();

                let statusClass = "";
                if (statusValue === "aprovado") statusClass = style.statusAprovado;
                else if (statusValue === "pendente") statusClass = style.statusPendente;
                else if (statusValue === "recusado") statusClass = style.statusRecusado;

                return (
                  <td key={cell.id} className={isStatus ? statusClass : ""}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.pagination}>
        <button className={style.button} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button className={style.button} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Próxima
        </button>
      </div>
    </article>
  );
}
