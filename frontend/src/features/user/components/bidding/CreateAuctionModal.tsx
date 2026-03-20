import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { useCreateAuction } from '../../hooks/bidding/useCreateAuction';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';
import { useBiddingUpload } from '../../hooks/bidding/useBiddingUpload';
import { Calendar } from '../../../../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import { format } from 'date-fns';
import { Loader2, UploadCloud, X, Check, Save } from 'lucide-react';
import { Textarea } from '../../../../components/ui/textarea';
import {
  createAuctionSchema,
  type CreateAuctionFormValues,
} from '../../schemas/auction.schema';
import { toast } from 'react-hot-toast';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuctionCreated: () => void;
}

export const CreateAuctionModal = ({
  isOpen,
  onClose,
  onAuctionCreated,
}: CreateAuctionModalProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { mutateAsync: createAuction, isPending: creating } =
    useCreateAuction();
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
      title: '',
      description: '',
      startTime: '12:00',
      endTime: '13:00',
      startPrice: 0,
    },
    mode: 'onChange',
  });

  // Reset form and state when modal closes
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
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/png',
      ];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Only JPG, JPEG, PNG, and WEBP formats are allowed!');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedImageKey(null);
    }
  };

  const handleSaveImage = async () => {
    if (!imageFile) return;
    try {
      const result = await uploadBiddingImage(imageFile);
      const key = result?.key || (result as any)?.data?.key;
      if (key) {
        setUploadedImageKey(key);
        toast.success('Image saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to upload image.');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setUploadedImageKey(null);
  };

  const onSubmit = async (data: CreateAuctionFormValues) => {
    if (!uploadedImageKey) {
      toast.error('Please upload and save the image first.');
      return;
    }

    try {
      const startDateTime = combineDateAndTime(data.startDate, data.startTime);
      const endDateTime = combineDateAndTime(data.endDate, data.endTime);

      // Debug: Check if dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast.error('Invalid date or time format');
        return;
      }

      await createAuction({
        hostId: user?.id,
        title: data.title,
        description: data.description,
        imageKey: uploadedImageKey,
        startPrice: Number(data.startPrice),
        startDate: startDateTime.toISOString(),
        startTime: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      onAuctionCreated();
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  function combineDateAndTime(
    dateInput: Date | string,
    timeString: string,
  ): Date {
    // Parse the date
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Parse time "HH:MM"
    const [hours, minutes] = timeString.split(':').map(Number);

    // Create new date with combined values
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);

    return combined;
  }

  const onInvalid = (errors: any) => {
    console.warn('Validation failed:', errors);
    toast.error('Please fill all required fields correctly.');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => !val && !creating && !uploadingImage && onClose()}
    >
      <DialogContent className="scrollbar w-screen h-screen sm:max-w-6xl sm:w-[50vw] sm:max-h-[75vh] overflow-y-auto overflow-x-hidden lg:overflow-hidden bg-white dark:bg-secondary-color p-0 gap-0 rounded-none sm:rounded-2xl grid grid-cols-1 lg:grid-cols-5">
        <div className="order-1 lg:col-span-5 border-b border-border/40 p-0">
          <DialogTitle className="text-xl lg:text-3xl font-bold">
            Create Auction
          </DialogTitle>
          <p className="text-xs lg:text-base text-muted-foreground">
            Fill in the details to list your masterpiece.
          </p>
        </div>

        {/* Left Side: Image Upload */}
        <div className="order-2 lg:order-1 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-border p-6 flex flex-col items-center justify-center min-h-[250px]">
          {previewUrl ? (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[200px] object-contain rounded-lg shadow-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              {!uploadedImageKey && (
                <Button
                  type="button"
                  variant="main"
                  className="mt-4 w-full"
                  onClick={handleSaveImage}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {uploadingImage ? 'Saving...' : 'Save Image'}
                </Button>
              )}
              {uploadedImageKey && (
                <div className="mt-4 text-green-600 flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" /> Image Ready
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 relative group hover:border-main-color transition-colors">
              <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-main-color" />
              <p className="mt-2 text-sm font-semibold">Upload Artwork</p>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
              {fileError && (
                <p className="text-destructive text-xs mt-2">{fileError}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Form Fields */}
        <div className="order-3 lg:order-2 lg:col-span-3 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input {...field} variant="green-focus" />
                )}
              />
              {errors.title && (
                <p className="text-destructive text-[10px]">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Start Price (AC)</Label>
              <Controller
                name="startPrice"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="number" variant="green-focus" />
                )}
              />
              {errors.startPrice && (
                <p className="text-destructive text-[10px]">
                  {errors.startPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  variant="green-focus"
                  className="min-h-[80px]"
                />
              )}
            />
            {errors.description && (
              <p className="text-destructive text-[10px]">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date & Time */}
            <div className="space-y-1">
              <Label>Start Date & Time</Label>
              <div className="flex gap-2">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full text-left font-normal ${errors.startDate ? 'border-destructive' : ''}`}
                        >
                          {field.value
                            ? format(field.value, 'MMM dd')
                            : 'Select Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[120] pointer-events-auto"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(d) => {
                              field.onChange(d);
                              setIsStartOpen(false);
                            }}
                            disabled={(d) =>
                              d < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="time" className="w-[100px]" />
                  )}
                />
              </div>
              {/* ✅ FIX: Show startDate required error OR startTime validation error */}
              {(errors.startDate || errors.startTime) && (
                <p className="text-destructive text-[10px]">
                  {errors.startDate?.message ?? errors.startTime?.message}
                </p>
              )}
            </div>

            {/* End Date & Time */}
            <div className="space-y-1">
              <Label>End Date & Time</Label>
              <div className="flex gap-2">
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full text-left font-normal ${errors.endDate ? 'border-destructive' : ''}`}
                        >
                          {field.value
                            ? format(field.value, 'MMM dd')
                            : 'Select Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[120] pointer-events-auto"
                        align="end"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(d) => {
                              field.onChange(d);
                              setIsEndOpen(false);
                            }}
                            disabled={(d) =>
                              d < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="time" className="w-[100px]" />
                  )}
                />
              </div>
              {/* ✅ FIX: Show endDate required error OR endTime validation error */}
              {(errors.endDate || errors.endTime) && (
                <p className="text-destructive text-[10px]">
                  {errors.endDate?.message ?? errors.endTime?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-auto pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={creating || uploadingImage}
            >
              Cancel
            </Button>
            <Button
              variant="main"
              onClick={handleSubmit(onSubmit, onInvalid)}
              disabled={creating || uploadingImage}
              className="min-w-[150px]"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Auction'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
