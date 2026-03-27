import React, { useState } from 'react';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Textarea } from '../../../../../components/ui/textarea';
import { COUNTRIES } from '../../../../../constants/countries';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../redux/store';
import ProfileImageSection from './ProfileImageSection';
import ImageCropper from './ImageCropper';
import { useUploadUserImage } from '../../../hooks/profile/useUploadUserImage';
import { useUpdateProfileMutation } from '../../../hooks/profile/useUpdateProfileMutation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string()
    .min(3, "Name is too short")
    .max(20, "Name is too long")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
  username: z.string()
    .min(3, "Username too short")
    .max(20, "Username too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores allowed")
    .transform((val) => val.toLowerCase()),
  bio: z.string()
    .max(160, "Bio is too long (max 160 characters)")
    .optional()
    .or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSettings: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [bannerImage, setBannerImage] = useState<string | null>(
    userData?.bannerImage || null,
  );
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    userData?.backgroundImage || null,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropType, setCropType] = useState<'banner' | 'background'>('banner');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      username: userData?.username || '',
      bio: userData?.bio || '',
      country: userData?.country || '',
    },
    mode: 'onChange',
  });

  const nameValue = watch('name');
  const usernameValue = watch('username');

  const uploadUserImage = useUploadUserImage();
  const updateProfileMutation = useUpdateProfileMutation();

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'banner' | 'background',
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setCropType(type);
      setCropperOpen(true);
      e.target.value = '';
    }
  };

  const handleCropSave = (file: File) => {
    if (!file) return;

    setIsSaving(true);

    const imageType = cropType === 'banner' ? 'bannerImage' : 'backgroundImage';

    uploadUserImage.mutate(
      { file, type: imageType },
      {
        onSuccess: (updatedUser) => {
          if (cropType === 'banner') setBannerImage(updatedUser.data.url);
          else setBackgroundImage(updatedUser.data.url);

          setCropperOpen(false);
          setSelectedFile(null);
          setIsSaving(false);
        },
        onError: () => {
          setCropperOpen(false);
          setSelectedFile(null);
          setIsSaving(false);
        },
      },
    );
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setSelectedFile(null);
  };

  const onSubmit = (data: ProfileFormValues) => {
    const updatedFields: any = {};
    if (data.name !== userData?.name) updatedFields.name = data.name;
    if (data.username !== userData?.username) updatedFields.username = data.username;
    if (data.bio !== userData?.bio) updatedFields.bio = data.bio;
    if (data.country !== userData?.country) updatedFields.country = data.country;

    if (Object.keys(updatedFields).length > 0) {
      updateProfileMutation.mutate(updatedFields);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Image Section */}
        <ProfileImageSection
          profileImage={userData?.profileImage || null}
          name={nameValue}
          username={usernameValue}
        />

        {/* Banner & Background */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          {/* Banner Upload */}
          <div>
            <label className='text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2 block'>
              Banner
            </label>
            <label className='relative cursor-pointer w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 hover:border-green-500 transition-colors'>
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt='Banner Preview'
                  className='w-full h-full object-cover rounded-xl'
                />
              ) : (
                <span className='text-zinc-500 text-sm'>
                  Click to upload banner
                </span>
              )}
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => handleFileSelect(e, 'banner')}
              />
            </label>
          </div>

          {/* Background Upload */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Background
            </label>
            <label className='relative cursor-pointer w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 hover:border-green-500 transition-colors'>
              {backgroundImage ? (
                <img
                  src={backgroundImage}
                  alt='Background Preview'
                  className='w-full h-full object-cover rounded-xl'
                />
              ) : (
                <span className='text-zinc-500 text-sm'>
                  Click to upload background
                </span>
              )}
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => handleFileSelect(e, 'background')}
              />
            </label>
          </div>
        </div>

        {/* Text Inputs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Full Name
            </label>
            <Input
              variant='green-focus'
              placeholder='Your full name'
              className={`text-sm ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Username
            </label>
            <Input
              variant='green-focus'
              placeholder='Your username'
              className={`text-sm ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Bio
            </label>
            <Textarea
              variant='green-focus'
              placeholder='Tell something about yourself...'
              rows={3}
              className={`text-sm ${errors.bio ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register('bio')}
            />
            <div className="flex justify-between mt-1">
              {errors.bio ? (
                <p className="text-xs text-red-500">{errors.bio.message}</p>
              ) : (
                <div />
              )}
              <p className={`text-[10px] ${watch('bio')?.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {watch('bio')?.length || 0}/160
              </p>
            </div>
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              Country
            </label>
            <select
              {...register('country')}
              className={`w-full rounded-md border bg-transparent dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${
                errors.country ? 'border-red-500 ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Select your country</option>
              {COUNTRIES.map((c) => (
                <option
                  key={c}
                  value={c}
                  className='bg-zinc-200 dark:bg-zinc-950'
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-2'>
          <Button
            type='submit'
            variant='main'
            className='px-6 py-2 text-sm'
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Cropper Modal */}
      {cropperOpen && selectedFile && (
        <ImageCropper
          file={selectedFile}
          aspect={cropType === 'banner' ? 21 / 4 : 6 / 2.75}
          cropShape='rect'
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
