import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { useCreateAuction } from "../../hooks/bidding/useCreateAuction";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useBiddingUpload } from "../../hooks/bidding/useBiddingUpload";
import { Calendar } from "../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, UploadCloud, X, Check, Save, AlertCircle } from "lucide-react";
import { Textarea } from "../../../../components/ui/textarea";
import { createAuctionSchema, type CreateAuctionFormValues } from "../../schemas/auction.schema";
import { toast } from "react-hot-toast";

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuctionCreated: () => void;
}

export const CreateAuctionModal = ({ isOpen, onClose, onAuctionCreated }: CreateAuctionModalProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { mutateAsync: createAuction, isPending: creating } = useCreateAuction();
  const { uploadBiddingImage, uploading: uploadingImage } = useBiddingUpload();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "12:00",
      endTime: "13:00",
      startPrice: 0,
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImageFile(null);
      setPreviewUrl(null);
      setUploadedImageKey(null);
      setFileError(null);
      setIsStartOpen(false);
      setIsEndOpen(false);
    }
  }, [isOpen, reset]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const allowedTypes = ["image/jpeg", "image/jpg", "image/webp", "image/png"];
      const maxSizeMB = 20;
      const fileSizeMB = file.size / (1024 * 1024);

      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, PNG, and WEBP formats are allowed!");
        e.target.value = "";
        return;
      }

      if (fileSizeMB > maxSizeMB) {
        setFileError(`File too large (${fileSizeMB.toFixed(1)}MB). Max limit is 20MB.`);
        e.target.value = "";
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedImageKey(null);
    }
  };

  const handleSaveImage = async () => {
    if (!imageFile) return;
    const result = await uploadBiddingImage(imageFile);
    
    if (result && (result.key || (result as any).data?.key)) {
      const key = result.key || (result as any).data.key;
      setUploadedImageKey(key);
      toast.success("Image saved successfully!");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setUploadedImageKey(null);
    setFileError(null);
  };

  const onSubmit = async (data: CreateAuctionFormValues) => {
    if (!uploadedImageKey) {
      toast.error("Please upload and save the image first.");
      return;
    }

    const start = new Date(data.startDate);
    const [startHours, startMinutes] = data.startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes);

    const end = new Date(data.endDate);
    const [endHours, endMinutes] = data.endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes);

    try {
      await createAuction({
        hostId: user?.id,
        title: data.title,
        description: data.description,
        imageKey: uploadedImageKey,
        startPrice: Number(data.startPrice),
        startTime: start,
        endTime: end,
      });

      onAuctionCreated();
      onClose();
    } catch (error) {
      // Handled by hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !creating && !uploadingImage && onClose()}>
      <DialogContent className="w-screen h-screen sm:max-w-6xl sm:w-[50vw] sm:max-h-[75vh] overflow-y-auto overflow-x-hidden lg:overflow-hidden bg-white dark:bg-secondary-color p-0 gap-0 shadow-none sm:shadow-2xl rounded-none sm:rounded-2xl grid grid-cols-1 lg:grid-cols-5">
        
        <div className="order-1 lg:col-span-5 border-b border-border/40 bg-white dark:bg-secondary-color">
           <div className="px-4 py-3 flex items-center justify-between">
              <div className="space-y-1">
                  <DialogTitle className="text-xl lg:text-3xl font-bold tracking-tight">Create Auction</DialogTitle>
                  <p className="text-xs lg:text-base text-muted-foreground">Fill in the details to list your masterpiece.</p>
              </div>
           </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border bg-white dark:bg-secondary-color flex flex-col relative min-h-[250px]">
             <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                {previewUrl ? (
                   <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                     <div className="relative rounded-xl overflow-hidden shadow-sm border border-border/50 p-2 bg-white dark:bg-secondary-color">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className={`max-h-[150px] lg:max-h-[300px] w-auto object-contain rounded-lg ${uploadedImageKey ? "ring-2 ring-main-color" : ""}`}
                        />
                     </div>
                     
                     <div className="absolute top-0 right-0">
                         <Button 
                            type="button" variant="destructive" size="icon" 
                            className="h-8 w-8 rounded-full shadow-lg"
                            onClick={removeImage} disabled={uploadingImage}
                         >
                            <X className="h-4 w-4" />
                         </Button>
                     </div>

                     {!uploadedImageKey && (
                         <div className="mt-4 w-full max-w-[200px]">
                            <Button 
                                type="button" 
                                variant="main"
                                onClick={handleSaveImage} 
                                disabled={uploadingImage} 
                                className="w-full h-10"
                            >
                                {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {uploadingImage ? "Saving..." : "Click to Save Image"}
                            </Button>
                         </div>
                     )}

                     {uploadedImageKey && (
                        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-bold">Image Ready</span>
                        </div>
                     )}
                   </div>
                ) : (
                   <div className={`w-full h-full border-2 border-dashed ${fileError ? 'border-destructive bg-destructive/5' : 'border-border/60'} hover:border-main-color/60 hover:bg-muted/30 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative group p-6`}>
                      <div className="p-3 rounded-full bg-white dark:bg-secondary-color border border-border shadow-sm mb-3 group-hover:scale-110 transition-transform">
                         <UploadCloud className={`h-10 w-10 ${fileError ? 'text-destructive' : 'text-muted-foreground'} group-hover:text-main-color`} />
                      </div>
                      <h3 className={`font-bold text-lg mb-1 ${fileError ? 'text-destructive' : ''}`}>Upload Artwork</h3>
                      <p className="text-xs text-muted-foreground">WEBP, PNG, JPG (Max 20MB)</p>
                      <input 
                         type="file" accept=".jpg,.jpeg,.png,.webp" 
                         className="absolute inset-0 opacity-0 cursor-pointer"
                         onChange={handleFileSelect}
                      />
                   </div>
                )}
                
                {fileError && (
                  <div className="mt-3 text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-semibold">{fileError}</span>
                  </div>
                )}
             </div>
        </div>

        <div className="order-3 lg:order-2 lg:col-span-3 flex flex-col bg-white dark:bg-secondary-color relative">
           <div className="flex-1 px-4 py-4 flex flex-col gap-4">
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                       <Label className="text-sm font-semibold pl-1">Title</Label>
                       <Controller name="title" control={control} render={({ field }) => (
                           <Input {...field} variant="green-focus" placeholder="The Golden Hour" className={errors.title ? "border-destructive" : ""} />
                       )} />
                       {errors.title && <p className="text-destructive text-xs pl-1">{errors.title.message}</p>}
                   </div>

                   <div className="space-y-1.5">
                       <Label className="text-sm font-semibold pl-1">Start Price (ArtCoin)</Label>
                       <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-main-color font-bold text-sm pointer-events-none">AC</span>
                           <Controller name="startPrice" control={control} render={({ field }) => (
                               <Input 
                                   {...field} 
                                   variant="green-focus"
                                   type="number" 
                                   className={`pl-10 ${errors.startPrice ? "border-destructive" : ""}`} 
                                   onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                               />
                           )} />
                       </div>
                       {errors.startPrice && <p className="text-destructive text-xs pl-1">{errors.startPrice.message}</p>}
                   </div>
               </div>

               <div className="space-y-1.5">
                   <Label className="text-sm font-semibold pl-1">Description</Label>
                   <Controller name="description" control={control} render={({ field }) => (
                       <Textarea {...field} variant="green-focus" placeholder="Describe your technique..." className={`min-h-[100px] ${errors.description ? "border-destructive" : ""}`} />
                   )} />
                   {errors.description && <p className="text-destructive text-xs pl-1">{errors.description.message}</p>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                       <Label className="text-sm font-semibold pl-1">Start Date & Time</Label>
                       <div className="flex gap-2">
                           <Controller name="startDate" control={control} render={({ field }) => (
                               <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                                   <PopoverTrigger asChild>
                                       <Button variant="outline" className={`w-full flex-1 text-left font-normal ${errors.startDate ? "border-destructive" : ""}`}>
                                           {field.value ? format(field.value, "MMM dd, yyyy") : <span>Select Date</span>}
                                       </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0 z-[100]" align="start">
                                       <Calendar mode="single" selected={field.value} onSelect={(d) => { field.onChange(d); setIsStartOpen(false); }} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
                                   </PopoverContent>
                               </Popover>
                           )} />
                           <Controller name="startTime" control={control} render={({ field }) => (
                               <Input {...field} variant="green-focus" type="time" className={`w-[110px] ${errors.startTime ? "border-destructive" : ""}`} />
                           )} />
                       </div>
                   </div>

                   <div className="space-y-1.5">
                       <Label className="text-sm font-semibold pl-1">End Date & Time</Label>
                       <div className="flex gap-2">
                           <Controller name="endDate" control={control} render={({ field }) => (
                               <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                                   <PopoverTrigger asChild>
                                       <Button variant="outline" className={`w-full flex-1 text-left font-normal ${errors.endDate ? "border-destructive" : ""}`}>
                                           {field.value ? format(field.value, "MMM dd, yyyy") : <span>Select Date</span>}
                                       </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0 z-[100]" align="end">
                                       <Calendar mode="single" selected={field.value} onSelect={(d) => { field.onChange(d); setIsEndOpen(false); }} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
                                   </PopoverContent>
                               </Popover>
                           )} />
                           <Controller name="endTime" control={control} render={({ field }) => (
                               <Input {...field} variant="green-focus" type="time" className={`w-[110px] ${errors.endTime ? "border-destructive" : ""}`} />
                           )} />
                       </div>
                   </div>
               </div>
           </div>

           <div className="px-4 py-4 border-t border-border/40 shrink-0 bg-white dark:bg-secondary-color flex justify-end gap-3">
               <Button variant="ghost" onClick={onClose} disabled={creating || uploadingImage}>Cancel</Button>
               <Button 
                    variant="main"
                    onClick={handleSubmit(onSubmit)} 
                    disabled={creating || uploadingImage} 
                    className="min-w-[150px] font-semibold"
                >
                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {creating ? "Processing..." : "Create Auction"}
                </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};