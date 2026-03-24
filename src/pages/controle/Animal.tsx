import { motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const mockAnimals = [
  { id: 1, name: "Rex", status: "ATIVO" },
  { id: 2, name: "Bobby", status: "ATIVO" },
  { id: 3, name: "Kiosk", status: "INATIVO" },
];

export default function Animal() {
  return (
    <main className="">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          <span className="relative inline-block py-4">
            List
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-full"></span>
          </span>
          agem dos Animais
        </h1>

        {/* Botão de Novo Item */}
        <Button
          onClick={() => console.log("Novo Animal")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-10 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Novo
        </Button>
      </div>
      <div className="h-px w-full bg-black/5" />
      <div className="relative my-6 max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          type="text"
          placeholder="Pesquisar animal..."
          className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAnimals.map((animal, index) => (
              <motion.tr
                key={animal.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium">{animal.name}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      animal.status === "ATIVO"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {animal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => console.log("Editar", animal.id)}
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => console.log("Excluir", animal.id)}
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Excluir"
                    >
                      X
                    </button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
