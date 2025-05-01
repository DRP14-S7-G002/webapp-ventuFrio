"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import style from "./style.module.css";
import { useEffect, useMemo, useState } from "react";

interface DataTableProps<TData extends { id: number; nome?: string }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  title: string;
  onAction?: (action: 'create' | 'edit' | 'delete' | 'view', data?: TData) => void;
  filterField?: keyof TData;
}

export function DataTable<TData extends { id: number; nome?: string }>({
  columns,
  data,
  title,
  onAction,
  filterField,
}: DataTableProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fixedColumns: ColumnDef<TData, any>[] = [
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className={style.actionButtons}>
          <button
            className={style.button_action}
            onClick={() => onAction?.('edit', row.original)}
          >
            <FiEdit size={20} style={{ color: "#0096c4", marginRight: "8px" }} />
          </button>
          <button
            className={style.button_action}
            onClick={() => onAction?.('delete', row.original)}
          >
            <FiTrash2 size={20} style={{ color: "#bd0000", marginRight: "8px" }} />
          </button>
          <button
            className={style.button_action}
            onClick={() => onAction?.('view', row.original)}
          >
            <BsEye size={20} style={{ color: "#0096c4" }} />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!filterField) return data;
    const term = searchTerm.toLowerCase();
  
    return data.filter((item) => {
      const fieldValue = item[filterField];
      return typeof fieldValue === "string" && fieldValue.toLowerCase().includes(term);
    });
  }, [data, searchTerm, filterField]);

  const table = useReactTable({
    data: filteredData,
    columns: [...columns, ...fixedColumns],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <>
      <article className={style.container_main}>
        <div className={style.container}>
          <div className={style.action_heade}>
            <div className={style.input_container}>
            <input
              className={style.input_search_table}
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            </div>
            <button
              className={style.create_resister_table}
              onClick={() => onAction?.('create')}
            >
              Adicionar novo
            </button>
          </div>
        </div>
        <h3 className={style.heading}>{title}</h3>
        {isLoading ? (
          <div className={style.loading}>
            <div className={style.spinner}></div>
          </div>
        ) : (
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
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? style.rowEven : style.rowOdd}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className={style.pagination}>
          <button
            className={style.button}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <button
            className={style.button}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </button>
        </div>
      </article>
    </>
  );
}