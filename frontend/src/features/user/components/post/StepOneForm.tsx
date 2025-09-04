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
import ART_TYPES from "../../../../constants/artTypesConstants";

interface StepOneFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  artType: string | undefined;
  setArtType: (val: string) => void;
  hashtags: string;
  setHashtags: (val: string) => void;
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
  return (
    <div className="space-y-6">
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
            <SelectValue placeholder="Select art type" />
          </SelectTrigger>
          <SelectContent>
            {ART_TYPES.map((type, i) => (
              <SelectItem key={i} value={type}>
                {type}
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
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
    </div>
  );
};

export default StepOneForm;
