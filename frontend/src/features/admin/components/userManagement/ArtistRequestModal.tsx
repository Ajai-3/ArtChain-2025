// components/admin/ArtistRequestsModal.tsx
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Loader2, User } from "lucide-react";
import { useGetArtistRequests } from "../../hooks/user-management/useGetArtistRequests";
import CustomToaster from "../../../../components/CustomToaster";
import { useApproveArtistRequest } from "../../hooks/user-management/useApproveArtistRequest";
import { useRejectArtistRequest } from "../../hooks/user-management/useRejectArtistRequest";
import RejectModal from "./RejectModal";
import ConfirmModal from "../../../../components/modals/ConfirmModal";

const ArtistRequestsModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, refetch } = useGetArtistRequests(page, limit, {
    enabled: open,
  });
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const { mutate: approveMutate, isPending: approving } =
    useApproveArtistRequest();
  const { mutate: rejectMutate, isPending: rejecting } =
    useRejectArtistRequest();

  const [confirmData, setConfirmData] = useState<{ id: string } | null>(null);
  const [rejectData, setRejectData] = useState<{ id: string } | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="yellow">
            <User /> Artist Requests
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-5xl h-[600px]">
          <DialogHeader>
            <DialogTitle>Pending Artist Requests</DialogTitle>
            <DialogDescription>
              Review and approve or reject user requests to become artists.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto mt-4 rounded-lg border border-zinc-800">
            <Table className="min-w-full dark:bg-secondary-color">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-zinc-950">
                  <TableHead>No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Submitted at</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : data?.requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.requests?.map((req, idx) => (
                    <TableRow
                      key={req.id}
                      className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {req.profileImage ? (
                            <>
                              <img
                                src={req.profileImage}
                                alt={req.name}
                                className="w-10 h-10 rounded-full"
                              />
                            </>
                          ) : (
                            <>
                              <User className="bg-zinc-700 rounded-full p-1 w-10 h-10" />
                            </>
                          )}
                          <p>{req.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>{req.username}</TableCell>
                      <TableCell className="px-4 py-2">
                        {req.createdAt ? (
                          <>
                            <div>
                              {new Date(req.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div>
                              {new Date(req.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`/${req.username}`, "_blank")
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={req.status !== "pending" || approving}
                          onClick={() => setConfirmData({ id: req.id })}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600"
                          disabled={req.status !== "pending" || rejecting}
                          onClick={() => setRejectData({ id: req.id })}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>

            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={page === idx + 1 ? "default" : "outline"}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {confirmData && (
        <ConfirmModal
          isOpen={!!confirmData}
          onClose={() => setConfirmData(null)}
          onConfirm={() =>
            approveMutate(confirmData.id, {
              onSuccess: () => setConfirmData(null),
            })
          }
          title="Approve Artist Request"
          description="Are you sure you want to approve this request?"
          confirmText="Approve"
          confirmVariant="default"
          isLoading={approving}
        />
      )}
      {rejectData && (
        <RejectModal
          isOpen={!!rejectData}
          onClose={() => setRejectData(null)}
          onConfirm={(reason) =>
            rejectMutate(
              { id: rejectData.id, reason },
              { onSuccess: () => setRejectData(null) }
            )
          }
          isLoading={rejecting}
        />
      )}{" "}
    </>
  );
};

export default ArtistRequestsModal;
