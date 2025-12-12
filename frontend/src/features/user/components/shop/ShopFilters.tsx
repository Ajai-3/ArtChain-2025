import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { Filter, X } from "lucide-react";

type FilterType = {
  category?: string[];
  priceOrder?: "asc" | "desc";
  titleOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
};

interface ShopFiltersProps {
  filters: FilterType;
  draftFilters: FilterType;
  setDraftFilters: React.Dispatch<React.SetStateAction<FilterType>>;
  categories: any[];
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  draftFilters,
  setDraftFilters,
  categories,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  onApplyFilters,
  onClearFilters,
}) => {
  const toggleCategory = (id: string) => {
    setDraftFilters((prev: FilterType) => {
      const selected = prev.category || [];
      if (selected.includes(id)) {
        return { ...prev, category: selected.filter((c) => c !== id) };
      }
      return { ...prev, category: [...selected, id] };
    });
  };

  const toggleAllCategories = () => {
    if (!categories) return;
    const allCategoryIds = categories.map((c: any) => c._id);
    setDraftFilters((prev: FilterType) => ({
      ...prev,
      category:
        prev.category?.length === categories.length ? [] : allCategoryIds,
    }));
  };

  return (
    <aside
      className={`
        fixed md:relative inset-y-0 left-0 z-40 w-64 bg-background/95 backdrop-blur-xl md:bg-transparent border-r border-white/20 p-4 flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out
        ${
          isMobileFilterOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <Filter size={20} className="text-main-color" />{" "}
          Filters
        </h2>
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <Label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-400 mb-3 uppercase tracking-wider">
          Categories
        </Label>
        <div className="max-h-48 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              id="all-categories"
              checked={draftFilters.category?.length === categories?.length}
              onCheckedChange={toggleAllCategories}
              className="border-zinc-700 data-[state=checked]:bg-main-color data-[state=checked]:border-main-color"
            />
            <Label
              htmlFor="all-categories"
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors cursor-pointer"
            >
              All Categories
            </Label>
          </div>
          {categories
            ?.filter((cat: any) => cat.count > 0)
            .map((cat: any) => (
              <div
                key={cat._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  id={cat._id}
                  checked={draftFilters.category?.includes(cat._id) || false}
                  onCheckedChange={() => toggleCategory(cat._id)}
                  className="border-zinc-600 data-[state=checked]:bg-main-color data-[state=checked]:border-main-color"
                />
                <Label
                  htmlFor={cat._id}
                  className="text:zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors flex-1 cursor-pointer"
                >
                  {cat.name}
                </Label>
                <span className="text-zinc-500 text-xs bg-zinc-800/50 px-1.5 py-0.5 rounded">
                  {cat.count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Price Order */}
      <div className="mb-6">
        <Label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-400 mb-3 uppercase tracking-wider">
          Price Order
        </Label>
        <RadioGroup
          value={draftFilters.priceOrder || ""}
          onValueChange={(value: string) =>
            setDraftFilters((prev: FilterType) => ({
              ...prev,
              priceOrder:
                value === prev.priceOrder
                  ? undefined
                  : (value as "asc" | "desc"),
            }))
          }
        >
          <div className="flex items-center gap-3 cursor-pointer group">
            <RadioGroupItem
              value="asc"
              id="price-asc"
              className="border-zinc-600 text-main-color"
            />
            <Label
              htmlFor="price-asc"
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors cursor-pointer"
            >
              Low → High
            </Label>
          </div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <RadioGroupItem
              value="desc"
              id="price-desc"
              className="border-zinc-600 text-main-color"
            />
            <Label
              htmlFor="price-desc"
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors cursor-pointer"
            >
              High → Low
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Title Order */}
      <div className="mb-6">
        <Label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-400 mb-3 uppercase tracking-wider">
          Title Order
        </Label>
        <RadioGroup
          value={draftFilters.titleOrder || ""}
          onValueChange={(value: string) =>
            setDraftFilters((prev: FilterType) => ({
              ...prev,
              titleOrder:
                value === prev.titleOrder
                  ? undefined
                  : (value as "asc" | "desc"),
            }))
          }
        >
          <div className="flex items-center gap-3 cursor-pointer group">
            <RadioGroupItem
              value="asc"
              id="title-asc"
              className="border-zinc-600 text-main-color"
            />
            <Label
              htmlFor="title-asc"
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors cursor-pointer"
            >
              A → Z
            </Label>
          </div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <RadioGroupItem
              value="desc"
              id="title-desc"
              className="border-zinc-600 text-main-color"
            />
            <Label
              htmlFor="title-desc"
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 group-hover:dark:text-white transition-colors cursor-pointer"
            >
              Z → A
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <Label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-400 mb-3 uppercase tracking-wider">
          Price Range
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={draftFilters.minPrice || ""}
            onChange={(e) =>
              setDraftFilters((prev: FilterType) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full bg-zinc-900/10 dark:bg-zinc-900/50 border-zinc-700 focus:border-main-color transition-colors"
          />
          <Input
            type="number"
            placeholder="Max"
            value={draftFilters.maxPrice || ""}
            onChange={(e) =>
              setDraftFilters((prev: FilterType) => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full bg-zinc-900/10 dark:bg-zinc-900/50 border-zinc-700 focus:border-main-color transition-colors"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <Button
          variant="outline"
          className="w-ful hover:bg-main-color-dark border-main-color"
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </aside>
  );
};

export default ShopFilters;
