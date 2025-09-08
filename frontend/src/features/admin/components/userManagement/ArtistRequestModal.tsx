// components/admin/ArtistRequestsModal.tsx
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";

import {   Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger, } from "../../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Loader2, User } from "lucide-react";

// Dummy artist requests
const dummyRequests = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  username: `user${i + 1}`,
  status: "pending",
}));

const ArtistRequestsModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState(dummyRequests);

  const handleAction = (id: number, action: "approve" | "reject") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "processing" } : r))
    );

    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: action === "approve" ? "approved" : "rejected" }
            : r
        )
      );
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="yellow"> <User /> Artist Requests</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl h-[600px]">
        <DialogHeader>
          <DialogTitle>Pending Artist Requests</DialogTitle>
          <DialogDescription>
            Review and approve or reject user requests to become artists.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto mt-4 rounded-lg border border-zinc-800">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-zinc-900">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.username}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={req.status !== "pending"}
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      {req.status === "processing" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Reject"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={req.status !== "pending"}
                      onClick={() => handleAction(req.id, "approve")}
                    >
                      {req.status === "processing" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistRequestsModal;
