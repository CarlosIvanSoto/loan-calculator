"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Payment } from "./loan-calculator"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<Payment, string>[] = [
  {
    accessorKey: "number",
    header: () => <div className="text-center">Numero</div>,
    cell: ({ getValue }) =>  <div className="text-center">{getValue()}</div>
  },
  {
    accessorKey: "days",
    header: () => <div className="text-center">Días</div>,
    cell: ({ getValue }) =>  <div className="text-center">{getValue()}</div>
  },
  {
    accessorKey: "dueDate",
    header: () => <div className="text-center">Fecha de Vencimiento</div>,
    cell: ({ getValue }) =>  <div className="text-center">{format(getValue(), "P", { locale: es })}</div>
  },
  {
    accessorKey: "principal",
    header: () => <div className="text-center">Amortización de Capital</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "interest",
    header: () => <div className="text-center">Intereses sin IVA</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "fixedPaymentNoVAT",
    header: () => <div className="text-center">Pago Fijo sin IVA</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "interestVAT",
    header: () => <div className="text-center">IVA de los Intereses</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "totalPayment",
    header: () => <div className="text-center">Pago Total del Periodo</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "remainingBalance",
    header: () => <div className="text-center">Saldo Insoluto</div>,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue())
 
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount)
 
      return <div className="text-center">{formatted}</div>
    },
  }
]

interface LoanProps {
  data: Payment[]
  visibility?: VisibilityState
}
export function LoanTable({ data, visibility = { days: false } }: LoanProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(visibility)
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}
