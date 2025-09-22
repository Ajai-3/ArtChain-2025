import React from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { User } from "lucide-react";
import { useFetchArtCategories, type ArtCategory } from "../../hooks/art/useFetchArtCategories";
interface StepOneFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  artType: string | undefined;
  setArtType: (val: string) => void;
  hashtags: string[];
  setHashtags: (val: string[]) => void;
  errors: { [key: string]: string };
  validateField: (field: string, value: string) => void;
}

const StepOneForm: React.FC<StepOneFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  artType,
  setArtType,
  hashtags,
  setHashtags,
  errors,
  validateField,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: categories, isLoading, error } = useFetchArtCategories();

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        {user?.profileImage ? (
          <img
            src={user?.profileImage}
            alt="Profile"
            className="w-11 h-11 rounded-full border border-zinc-300 dark:border-zinc-600"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white text-xl">
            {user?.name?.charAt(0).toUpperCase() || (
              <User className="w-8 h-8" />
            )}
          </div>
        )}
        <div>
          <h1>{user?.name}</h1>
          <p className="text-sm text-zinc-900 dark:text-zinc-600">
            {user?.username}
          </p>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-main-color">*</span>
        </Label>
        <Input
          variant="green-focus"
          placeholder="Enter art work title"
          className="w-full"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            validateField("title", e.target.value);
          }}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-main-color">*</span>
        </Label>
        <Textarea
          variant="green-focus"
          placeholder="Enter description for your art work"
          className="w-full min-h-[180px]"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            validateField("description", e.target.value);
          }}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Art type <span className="text-main-color">*</span>
        </Label>
        <Select
          onValueChange={(val) => {
            setArtType(val);
            if (!val) {
              errors.artType = "Art type is required";
            } else {
              delete errors.artType;
            }
          }}
          value={artType}
        >
          <SelectTrigger variant="green-focus" className="w-full">
            <SelectValue
              placeholder={
                isLoading ? "Loading categories..." : "Select art type"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {isLoading && (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            )}
            {error && (
              <SelectItem value="error" disabled>
                Failed to load
              </SelectItem>
            )}
            {categories?.data.map((cat: ArtCategory) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.artType && (
          <p className="text-red-500 text-sm mt-1">{errors.artType}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hashtags
        </Label>
        <Input
          variant="green-focus"
          type="text"
          placeholder="#digitalart #ai"
          className="w-full"
          value={hashtags.join(" ")}
          onChange={(e) =>
            setHashtags(
              e.target.value
                .split(/[\s,]+/)
                .map((h) => h.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
    </div>
  );
};

export default StepOneForm;
