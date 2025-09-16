import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Pencil } from "lucide-react";

interface Category {
  id: string;
  name: string;
  status: string;
}

interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  return (
    <div className="overflow-x-auto rounded-lg">
      <Table className="min-w-full border border-zinc-800">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900">
            <TableHead>No</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Use Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat, i) => (
            <TableRow key={cat.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{cat.id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>34</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs ${
                    cat.status === "Active" ? "bg-green-600" : "bg-rose-600"
                  }`}
                >
                  {cat.status}
                </span>
              </TableCell>
              <TableCell>September 3, 2025 3:54 PM</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm"><Pencil /></Button>
                <Button variant="destructive" size="sm" className="bg-red-600">Block</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
