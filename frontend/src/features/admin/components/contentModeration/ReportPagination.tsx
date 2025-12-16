import React from "react";
import { Button } from "../../../../components/ui/button";

interface ReportPaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const ReportPagination: React.FC<ReportPaginationProps> = ({
  page,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const visiblePages = 3;
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
      >
        First
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1 || isLoading}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
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
      >
        Next
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </Button>
    </div>
  );
};
