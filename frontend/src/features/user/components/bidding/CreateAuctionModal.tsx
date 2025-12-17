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
import { CalendarIcon, Loader2, UploadCloud, X, Check, Save } from "lucide-react";
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

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
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
      setIsStartOpen(false);
      setIsEndOpen(false);
    }
  }, [isOpen, reset]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedImageKey(null);
    }
  };

  const handleSaveImage = async () => {
    if (!imageFile) return;
    const result = await uploadBiddingImage(imageFile);
    
    if (result && result.key) {
      setUploadedImageKey(result.key);
      toast.success("Image saved successfully!");
    } else {
       if (result && (result as any).data && (result as any).data.key) {
           setUploadedImageKey((result as any).data.key);
           toast.success("Image saved successfully!");
       }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setUploadedImageKey(null);
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
       // handled by hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !creating && !uploadingImage && onClose()}>
      <DialogContent className="w-screen h-screen sm:max-w-6xl sm:w-[50vw] sm:max-h-[75vh] overflow-y-auto overflow-x-hidden lg:overflow-hidden bg-white dark:bg-secondary-color p-0 gap-0 shadow-none sm:shadow-2xl rounded-none sm:rounded-2xl grid grid-cols-1 lg:grid-cols-5">
        
        <div className="order-1 lg:col-span-5 border-b border-border/40 bg-white dark:bg-secondary-color">
           <div className="px-2 lg:px-3 py-1 lg:py-1 flex items-center justify-between">
              <div className="space-y-1">
                  <DialogTitle className="text-xl lg:text-3xl font-bold tracking-tight">Create Auction</DialogTitle>
                  <p className="text-xs lg:text-base text-muted-foreground">Fill in the details to list your masterpiece.</p>
              </div>
           </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border bg-white dark:bg-secondary-color flex flex-col relative min-h-[200px] lg:min-h-[250px]">
             <div className="flex-1 p-2 lg:p-3 flex flex-col items-center justify-center text-center">
                {previewUrl ? (
                   <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                     <div className="relative rounded-xl overflow-hidden shadow-sm border border-border/50 p-2 bg-white dark:bg-secondary-color">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className={`max-h-[120px] lg:max-h-[300px] w-auto object-contain rounded-lg ${uploadedImageKey ? "ring-2 ring-main-color" : ""}`}
                        />
                     </div>
                     
                     <div className="absolute top-2 right-2">
                         <Button 
                            type="button" variant="destructive" size="icon" 
                            className="h-8 w-8 lg:h-9 lg:w-9 rounded-full shadow-lg hover:scale-105 transition-transform"
                            onClick={removeImage} disabled={uploadingImage}
                         >
                            <X className="h-4 w-4 lg:h-5 lg:w-5" />
                         </Button>
                     </div>

                     {!uploadedImageKey && (
                         <div className="mt-4 lg:mt-8 w-full max-w-[180px] lg:max-w-[240px] animate-in slide-in-from-bottom-2">
                            <Button 
                                type="button" 
                                variant="main"
                                onClick={handleSaveImage} 
                                disabled={uploadingImage} 
                                className="w-full shadow-lg h-10 lg:h-11 text-sm lg:text-base relative"
                            >
                                {uploadingImage ? (
                                    <>
                                        <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                        <span>Click to Save Image</span>
                                    </>
                                )}
                            </Button>
                         </div>
                     )}

                     {uploadedImageKey && (
                        <div className="mt-3 lg:mt-6 flex items-center gap-2 lg:gap-3 text-green-600 bg-green-500/10 px-3 lg:px-5 py-1.5 lg:py-2 rounded-full border border-green-500/20">
                            <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span className="text-xs lg:text-sm font-bold">Image Ready</span>
                        </div>
                     )}
                   </div>
                ) : (
                   <div className="w-full h-full border-2 border-dashed border-border/60 hover:border-main-color/60 hover:bg-muted/30 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative group p-2 lg:p-3 bg-white dark:bg-secondary-color">
                      <div className="p-1.5 lg:p-2 rounded-full bg-white dark:bg-secondary-color border border-border shadow-sm mb-1 lg:mb-2 group-hover:scale-110 transition-transform">
                         <UploadCloud className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground group-hover:text-main-color" />
                      </div>
                      <h3 className="font-bold text-base lg:text-xl mb-1">Upload Artwork</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground">Click to browse your files</p>
                      <input 
                         type="file" accept="image/*" 
                         className="absolute inset-0 opacity-0 cursor-pointer"
                         onChange={handleFileSelect}
                      />
                   </div>
                )}
             </div>
        </div>

        <div className="order-3 lg:order-2 lg:col-span-3 flex flex-col bg-white dark:bg-secondary-color relative">
           <div className="flex-1 px-2 lg:px-3 py-2 lg:py-2 flex flex-col gap-2 lg:gap-3 overflow-y-visible">
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
                   <div className="pb-2">
                       <Label className="text-sm font-semibold text-foreground pl-1 mb-1.5 block">Title</Label>
                       <Controller name="title" control={control} render={({ field }) => (
                           <Input 
                                {...field} 
                                variant="green-focus" 
                                placeholder="E.g. The Golden Hour" 
                                className={`text-base ${errors.title ? "border-destructive" : ""}`} 
                           />
                       )} />
                       {errors.title && <p className="text-destructive text-xs mt-1.5 pl-1 leading-tight absolute">{errors.title.message}</p>}
                   </div>

                   <div className="pb-2">
                       <Label className="text-sm font-semibold text-foreground pl-1 mb-1.5 block">Start Price (ArtCoin)</Label>
                       <div className="relative">
                           <span className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-main-color font-bold text-base pointer-events-none">AC</span>
                           <Controller name="startPrice" control={control} render={({ field }) => (
                               <Input 
                                    {...field} 
                                    variant="green-focus"
                                    type="number" 
                                    placeholder="0.00" 
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                                    className={`pl-12 text-base ${errors.startPrice ? "border-destructive" : ""}`} 
                               />
                           )} />
                       </div>
                       {errors.startPrice && <p className="text-destructive text-xs mt-1.5 pl-1 leading-tight absolute">{errors.startPrice.message}</p>}
                   </div>
               </div>

               <div className="pb-2">
                   <Label className="text-sm font-semibold text-foreground pl-1 mb-1.5 block">Description</Label>
                   <Controller name="description" control={control} render={({ field }) => (
                       <Textarea 
                            {...field} 
                            variant="green-focus"
                            placeholder="Describe the artwork, technique, and inspiration..." 
                            className={`resize-none min-h-[100px] lg:min-h-[120px] text-base  lg:p-4 ${errors.description ? "border-destructive" : ""}`}
                       />
                   )} />
                   {errors.description && <p className="text-destructive text-xs mt-1.5 pl-1 leading-tight absolute">{errors.description.message}</p>}
               </div>

               <div className="flex flex-col gap-3">
                   <div>
                       <Label className="text-sm font-semibold text-foreground pl-1 mb-1.5 block">Start Date & Time</Label>
                       <div className="flex gap-2 lg:gap-3">
                           <Controller name="startDate" control={control} render={({ field }) => (
                               <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                                   <PopoverTrigger asChild>
                                       <Button variant="outline" className={`w-full flex-1 pl-3 lg:pl-4 text-left font-normal h-10 lg:h-10 text-sm lg:text-base ${!field.value ? "text-muted-foreground" : ""} ${errors.startDate ? "border-destructive" : ""}`}>
                                           {field.value ? format(field.value, "MMM dd, yyyy") : <span>Select Date</span>}
                                       </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0 z-[100]" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                                       <Calendar 
                                            mode="single" 
                                            selected={field.value} 
                                            onSelect={(date) => {
                                                if (date) {
                                                    field.onChange(date);
                                                    setIsStartOpen(false);
                                                }
                                            }}
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return date < today;
                                            }} 
                                            className="pointer-events-auto"
                                       />
                                   </PopoverContent>
                               </Popover>
                           )} />
                           <Controller name="startTime" control={control} render={({ field }) => (
                               <Input {...field} variant="green-focus" type="time" className={`w-[100px] lg:w-[110px] h-10 lg:h-10 px-1 lg:px-2 text-center text-sm lg:text-base cursor-pointer ${errors.startTime ? "border-destructive" : ""}`} />
                           )} />
                       </div>
                       {(errors.startDate || errors.startTime) && (
                           <p className="text-red-600 font-medium text-xs mt-1.5 pl-1 leading-tight">
                               {errors.startDate?.message || errors.startTime?.message}
                           </p>
                       )}
                   </div>

                   <div>
                       <Label className="text-sm font-semibold text-foreground pl-1 mb-1.5 block">End Date & Time</Label>
                       <div className="flex gap-2 lg:gap-3">
                           <Controller name="endDate" control={control} render={({ field }) => (
                               <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                                   <PopoverTrigger asChild>
                                       <Button variant="outline" className={`w-full flex-1 pl-3 lg:pl-4 text-left font-normal h-10 lg:h-10 text-sm lg:text-base ${!field.value ? "text-muted-foreground" : ""} ${errors.endDate ? "border-destructive" : ""}`}>
                                           {field.value ? format(field.value, "MMM dd, yyyy") : <span>Select Date</span>}
                                       </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0 z-[100]" align="end" onOpenAutoFocus={(e) => e.preventDefault()}>
                                       <Calendar 
                                            mode="single" 
                                            selected={field.value} 
                                            onSelect={(date) => {
                                                if (date) {
                                                    field.onChange(date);
                                                    setIsEndOpen(false);
                                                }
                                            }}
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return date < today;
                                            }}
                                            className="pointer-events-auto"
                                       />
                                   </PopoverContent>
                               </Popover>
                           )} />
                           <Controller name="endTime" control={control} render={({ field }) => (
                               <Input {...field} variant="green-focus" type="time" className={`w-[100px] lg:w-[110px] h-10 lg:h-10 px-1 lg:px-2 text-center text-sm lg:text-base cursor-pointer ${errors.endTime ? "border-destructive" : ""}`} />
                           )} />
                       </div>
                       {(errors.endDate || errors.endTime) && (
                           <p className="text-red-600 font-medium text-xs mt-1.5 pl-1 leading-tight">
                               {errors.endDate?.message || errors.endTime?.message}
                           </p>
                       )}
                   </div>
               </div>
           </div>

           <div className="px-2 lg:px-3 py-2 lg:py-2 lg:pb-4 border-t border-border/40 shrink-0 bg-white dark:bg-secondary-color flex justify-end gap-2 lg:gap-2">
               <Button variant="ghost" onClick={onClose} disabled={creating || uploadingImage} className="text-sm lg:text-base">
                  Cancel
               </Button>
               <Button 
                    variant="main"
                    onClick={handleSubmit(onSubmit)} 
                    disabled={creating || uploadingImage} 
                    className="min-w-[130px] lg:min-w-[180px] shadow-md text-sm lg:text-base font-semibold tracking-wide"
                >
                    {creating && <Loader2 className="mr-2 h-4 w-4 lg:h-5 lg:w-5 animate-spin" />}
                    {creating ? "Processing..." : "Create Auction"}
                </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
