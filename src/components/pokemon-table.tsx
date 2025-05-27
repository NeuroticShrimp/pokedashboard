"use client"

import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Chip,
  Avatar,
  Typography,
  TablePagination,
  IconButton,
} from "@mui/material"
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"
import type { Pokemon } from "@/types/pokemon"

const columnHelper = createColumnHelper<Pokemon>()

interface PokemonTableProps {
  pokemon: Pokemon[]
}

export default function PokemonTable({ pokemon }: PokemonTableProps) {
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <Typography variant="body2" fontWeight="bold">
            #{info.getValue().toString().padStart(3, "0")}
          </Typography>
        ),
        size: 80,
      }),
      columnHelper.accessor("name", {
        header: "Pokemon",
        cell: (info) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={info.row.original.sprite} alt={info.getValue()} sx={{ width: 48, height: 48 }} />
            <Typography variant="body1" fontWeight="medium" textTransform="capitalize">
              {info.getValue()}
            </Typography>
          </Box>
        ),
        size: 200,
      }),
      columnHelper.accessor("types", {
        header: "Types",
        cell: (info) => (
          <Box display="flex" gap={1} flexWrap="wrap">
            {info.getValue().map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  backgroundColor: getTypeColor(type),
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Box>
        ),
        enableSorting: false,
        size: 200,
      }),
      columnHelper.accessor("height", {
        header: "Height (m)",
        cell: (info) => (info.getValue() / 10).toFixed(1),
        size: 100,
      }),
      columnHelper.accessor("weight", {
        header: "Weight (kg)",
        cell: (info) => (info.getValue() / 10).toFixed(1),
        size: 100,
      }),
      columnHelper.accessor("baseExperience", {
        header: "Base EXP",
        size: 100,
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: pokemon,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <Paper sx={{ width: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Pokemon Database
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Pokemon by name, type, or ID..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <IconButton size="small" sx={{ color: "white" }}>
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpward fontSize="small" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownward fontSize="small" />
                          ) : null}
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        rowsPerPage={table.getState().pagination.pageSize}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  )
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  }
  return colors[type] || "#68A090"
}
