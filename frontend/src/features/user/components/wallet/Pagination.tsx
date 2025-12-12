import React from "react";
import { Button } from "../../../../components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const visiblePages = 3; // Similar logic to admin side
  let startPage = Math.max(page - 1, 1);
  let endPage = Math.min(startPage + visiblePages - 1, totalPages);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1 || isLoading}
        onClick={() => onPageChange(1)}
        className="border-zinc-700 text-gray-400 hover:text-white"
      >
        First
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1 || isLoading}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className="border-zinc-700 text-gray-400 hover:text-white"
      >
        Prev
      </Button>

      {startPage > 1 && <span className="px-2 text-muted-foreground">...</span>}
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "default" : "outline"}
          onClick={() => onPageChange(p)}
          className={
            p === page
              ? "!bg-main-color text-white"
              : "border-zinc-700 text-gray-400 hover:text-white"
          }
        >
          {p}
        </Button>
      ))}
      {endPage < totalPages && <span className="px-2 text-muted-foreground">...</span>}

      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        className="border-zinc-700 text-gray-400 hover:text-white"
      >
        Next
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(totalPages)}
        className="border-zinc-700 text-gray-400 hover:text-white"
      >
        Last
      </Button>
    </div>
  );
};
