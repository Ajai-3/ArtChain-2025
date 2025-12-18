import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";
import { cn } from "../../../../../libs/utils";

import { useUpdateCommissionMutation } from "../../../hooks/commission/useUpdateCommissionMutation";
import { useUploadArtImageMutation } from "../../../hooks/art/useUploadArtImageMutation";
import { commissionRequestSchema } from "../../../schemas/CommissionRequestSchema";
import type { CommissionRequestFormValues } from "../../../schemas/CommissionRequestSchema";

import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Calendar } from "../../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import CustomLoader from "../../../../../components/CustomLoader";
import toast from "react-hot-toast";

interface CommissionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: any;
  isRequester: boolean;
}

export const CommissionEditModal: React.FC<CommissionEditModalProps> = ({
  isOpen,
  onClose,
  commission,
  isRequester,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(commission?.referenceImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { artCoinRate } = useSelector((state: RootState) => state.platform);
  const updateCommissionMutation = useUpdateCommissionMutation();
  const uploadImageMutation = useUploadArtImageMutation();

  const form = useForm<CommissionRequestFormValues>({
    resolver: zodResolver(commissionRequestSchema),
    defaultValues: {
      title: commission?.title || "",
      description: commission?.description || "",
      budget: commission?.budget || 0,
      deadline: commission?.deadline ? new Date(commission.deadline) : undefined,
    },
  });

  const { watch } = form;
  const budgetValue = watch("budget");

  useEffect(() => {
     if (commission) {
         form.reset({
            title: commission.title,
            description: commission.description,
            budget: commission.budget,
            deadline: new Date(commission.deadline),
         });
         setUploadedImageUrls(commission.referenceImages || []);
     }
  }, [commission, form]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRequester) return;
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (!isRequester) return;
    URL.revokeObjectURL(filePreviews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveUploadedUrl = (index: number) => {
      if (!isRequester) return;
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    if (!isRequester || selectedFiles.length === 0) return;
    setIsUploading(true);
    const urls: string[] = [];
    try {
      for (const file of selectedFiles) {
        const response = await uploadImageMutation.mutateAsync(file);
        const url = response?.data?.data || response?.data?.url; 
        if (url) urls.push(url);
      }
      setUploadedImageUrls((prev) => [...prev, ...urls]);
      setSelectedFiles([]); 
      setFilePreviews([]);
      toast.success("Images uploaded!");
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: CommissionRequestFormValues) => {
    if (isRequester && selectedFiles.length > 0) {
        toast.error("Please upload reference images first!");
        return;
    }

    updateCommissionMutation.mutate(
      {
        id: commission.id,
        data: {
          title: values.title,
          description: values.description,
          budget: values.budget,
          deadline: values.deadline,
          referenceImages: uploadedImageUrls,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isRequester ? "Edit Commission Request" : "Update Budget & Deadline"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isRequester ? "Update your commission details." : "Suggest a new price or completion date."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isRequester} className="bg-zinc-900 border-zinc-700 disabled:opacity-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={!isRequester} className="bg-zinc-900 border-zinc-700 min-h-[100px] disabled:opacity-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Budget (Art Coin)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} className="bg-zinc-900 border-zinc-700" />
                        {budgetValue > 0 && (
                            <div className="absolute right-3 top-2.5 text-xs text-green-400 font-medium bg-zinc-900/80 px-1 rounded">
                                ≈ ₹ {(budgetValue * artCoinRate).toFixed(2)}
                            </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel className="mb-1">Deadline</FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left bg-zinc-900 border-zinc-700", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date: Date | undefined) => { if (date) { field.onChange(date); setIsCalendarOpen(false); } }}
                          disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className="bg-zinc-950 text-white rounded-md border border-zinc-800"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormLabel>Reference Images</FormLabel>
              <div className="flex flex-wrap gap-3">
                {uploadedImageUrls.map((url, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-zinc-700 group">
                        <img src={url} alt="Reference" className="w-full h-full object-cover" />
                         {isRequester && (
                           <button type="button" onClick={() => handleRemoveUploadedUrl(index)} className="absolute top-0 right-0 bg-red-500/90 p-1 opacity-0 group-hover:opacity-100 transition rounded-bl-md">
                              <X size={14} className="text-white" />
                            </button>
                         )}
                    </div>
                ))}
              </div>
              {isRequester && (
                <>
                  <input type="file" id="edit-ref-upload" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                  <label htmlFor="edit-ref-upload" className="cursor-pointer flex items-center gap-2 text-sm text-zinc-300 hover:text-green-400 transition border border-dashed border-zinc-700 px-4 py-3 rounded-lg w-full justify-center bg-zinc-900/30">
                      <Upload size={16} /> Add More References
                  </label>
                </>
              )}
              {selectedFiles.length > 0 && (
                  <div className="space-y-2 border border-zinc-800 rounded-lg p-3 bg-zinc-900/50">
                    <div className="text-xs text-zinc-400 font-medium mb-2">Pending Uploads:</div>
                    <div className="flex flex-wrap gap-2">
                       {filePreviews.map((preview, index) => (
                          <div key={index} className="relative w-16 h-16 rounded overflow-hidden border border-zinc-600 group">
                              <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                              <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                              >
                                  <X size={16} className="text-white" />
                              </button>
                          </div>
                       ))}
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={handleUploadImages} disabled={isUploading} className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-[10px] h-7">
                        {isUploading ? <CustomLoader /> : "Upload Pending"}
                    </Button>
                  </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={updateCommissionMutation.isPending || isUploading}>Cancel</Button>
              <Button type="submit" disabled={updateCommissionMutation.isPending || isUploading || selectedFiles.length > 0} className="bg-green-600 hover:bg-green-700 min-w-[120px]">
                {updateCommissionMutation.isPending ? <CustomLoader /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
