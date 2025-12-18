import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../../libs/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

import { useRequestCommissionMutation } from "../../hooks/commission/useRequestCommissionMutation";
import { useUploadArtImageMutation } from "../../hooks/art/useUploadArtImageMutation";
import { commissionRequestSchema } from "../../schemas/CommissionRequestSchema";
import type { CommissionRequestFormValues } from "../../schemas/CommissionRequestSchema";

import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import CustomLoader from "../../../../components/CustomLoader";
import toast from "react-hot-toast";

interface CommissionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistName: string;
}

export const CommissionRequestModal: React.FC<CommissionRequestModalProps> = ({
  isOpen,
  onClose,
  artistId,
  artistName,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Redux: Get Art Coin Rate
  const { artCoinRate } = useSelector((state: RootState) => state.platform);

  const requestCommissionMutation = useRequestCommissionMutation();
  const uploadImageMutation = useUploadArtImageMutation();

  const form = useForm<CommissionRequestFormValues>({
    resolver: zodResolver(commissionRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
    },
  });

  const { watch } = form;
  const budgetValue = watch("budget");

  // Cleanup previews on unmount or when files change (cleared)
  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(filePreviews[index]); // Cleanup memory
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveUploadedUrl = (index: number) => {
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const urls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const response = await uploadImageMutation.mutateAsync(file);
        // Ensure we handle response correctly
        // Assuming response.data.data is correct based on previous inspection usage in other files
        // If not, we might need to adjust.
        const url = response?.data?.data || response?.data?.url; 
        if (url) {
             urls.push(url);
        }
      }
      setUploadedImageUrls((prev) => [...prev, ...urls]);
      setSelectedFiles([]); 
      setFilePreviews([]);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Failed to upload some images.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: CommissionRequestFormValues) => {
    if (selectedFiles.length > 0) {
        toast.error("Please upload selected reference images first!");
        return;
    }

    requestCommissionMutation.mutate(
      {
        artistId,
        title: values.title,
        description: values.description,
        budget: values.budget,
        deadline: values.deadline,
        referenceImages: uploadedImageUrls,
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
          setUploadedImageUrls([]);
          setSelectedFiles([]);
          setFilePreviews([]);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto custom-scrollbar scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request Commission from {artistName}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Fill in the details to start a commission request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Cyberpunk Character Portrait" {...field} className="bg-zinc-900 border-zinc-700 focus-visible:ring-green-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Describe your vision in detail..." 
                        {...field} 
                        className="bg-zinc-900 border-zinc-700 min-h-[100px] focus-visible:ring-green-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Art Coin)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            className="bg-zinc-900 border-zinc-700 focus-visible:ring-green-500" 
                        />
                        {/* Live Conversion Display */}
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
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel className="mb-1">Deadline</FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-auto p-0 bg-zinc-900 border-zinc-800 z-[100]" 
                        align="start"
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                          }
                          className="bg-zinc-950 text-white rounded-md border border-zinc-800"
                          classNames={{
                              day_selected: "bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
                              day_today: "bg-zinc-800 text-white",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reference Images Section */}
            <div className="space-y-3">
              <FormLabel>Reference Images (Optional)</FormLabel>
              
              {/* Uploaded Images Display */}
              {uploadedImageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                      {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-zinc-700 group">
                              <img src={url} alt="Reference" className="w-full h-full object-cover" />
                               <button
                                  type="button"
                                  onClick={() => handleRemoveUploadedUrl(index)}
                                  className="absolute top-0 right-0 bg-red-500/90 p-1 opacity-0 group-hover:opacity-100 transition rounded-bl-md"
                                >
                                  <X size={14} className="text-white" />
                                </button>
                          </div>
                      ))}
                  </div>
              )}

              {/* Selected Files Preview & Upload */}
              {selectedFiles.length > 0 && (
                  <div className="space-y-2 border border-zinc-800 rounded-lg p-3 bg-zinc-900/50">
                      <div className="text-xs text-zinc-400 font-medium mb-2">Pending Uploads:</div>
                      <div className="flex flex-wrap gap-3">
                        {filePreviews.map((preview, index) => (
                            <div key={index} className="relative w-16 h-16 rounded overflow-hidden border border-zinc-600 group">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={20} className="text-white drop-shadow-md" />
                                </button>
                            </div>
                        ))}
                      </div>
                      
                      <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleUploadImages}
                          disabled={isUploading}
                          className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      >
                          {isUploading ? <CustomLoader /> : <><Upload size={14} className="mr-2"/> Upload All Pending</>}
                      </Button>
                  </div>
              )}

              <div className="flex items-center gap-2">
                   <input
                      type="file"
                      id="ref-images-upload"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                   />
                   <label 
                      htmlFor="ref-images-upload" 
                      className="cursor-pointer flex items-center gap-2 text-sm text-zinc-300 hover:text-green-400 transition border border-dashed border-zinc-700 hover:border-green-500 px-4 py-3 rounded-lg w-full justify-center bg-zinc-900/30"
                  >
                      <Upload size={16} /> Select Reference Images
                   </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-zinc-950 border-t border-zinc-800 mt-4 p-2 -mx-4 -mb-4 px-6 pb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={requestCommissionMutation.isPending || isUploading}
                className="hover:bg-zinc-800 text-zinc-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"main"}
                disabled={requestCommissionMutation.isPending || isUploading || selectedFiles.length > 0}
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
              >
                {requestCommissionMutation.isPending ? (
                  <CustomLoader />
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
