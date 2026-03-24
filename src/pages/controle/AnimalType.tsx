import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockTypes = [
  { id: 1, name: "Cachorro", status: "ATIVO" },
  { id: 2, name: "Gato", status: "ATIVO" },
  { id: 3, name: "Pássaro", status: "INATIVO" },
];

export default function AnimalType() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Controle dos Tipos de Animal</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTypes.map((type, index) => (
              <motion.tr
                key={type.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      type.status === "ATIVO"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {type.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => console.log("Editar", type.id)}
                      className="p-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => console.log("Excluir", type.id)}
                      className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
