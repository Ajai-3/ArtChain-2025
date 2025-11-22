import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useGetAllArt } from "../hooks/art/useGetAllArt";
import { useGetCategories, type Category } from "../hooks/art/useGetCategories";
import ArtCard from "../components/art/ArtCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArtCardSkeleton from "../components/skeletons/ArtCardSkeleton";
import type { ArtWithUser } from "../hooks/art/useGetAllArt";

// Image dimension cache
const imageDimensionsCache = new Map<
  string,
  { width: number; height: number; aspectRatio: number }
>();

// Load image dimensions
const loadImageDimensions = (
  url: string
): Promise<{ width: number; height: number; aspectRatio: number }> => {
  if (imageDimensionsCache.has(url)) {
    return Promise.resolve(imageDimensionsCache.get(url)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      };
      imageDimensionsCache.set(url, dimensions);
      resolve(dimensions);
    };
    img.onerror = () => {
      const dimensions = {
        width: 300,
        height: 200,
        aspectRatio: 1.5,
      };
      resolve(dimensions);
    };
    img.src = url;
  });
};

// Moreh Layout Algorithm
const calculateMorehLayout = (
  items: ArtWithUser[],
  dimensions: Map<
    string,
    { width: number; height: number; aspectRatio: number }
  >,
  containerWidth: number,
  targetRowHeight: number = 250,
  spacing: number = 4
) => {
  if (!items.length || containerWidth <= 0) return [];

  const rows: any[] = [];
  let currentRow: any[] = [];
  let currentRowWidth = 0;

  items.forEach((item, index) => {
    const dim = dimensions.get(item.art.id) || {
      width: 300,
      height: 200,
      aspectRatio: 1.5,
    };

    const itemWidth = targetRowHeight * dim.aspectRatio;

    const layoutItem = {
      item,
      width: itemWidth,
      height: targetRowHeight,
      aspectRatio: dim.aspectRatio,
      calculatedWidth: itemWidth,
      calculatedHeight: targetRowHeight,
    };

    currentRow.push(layoutItem);
    currentRowWidth += itemWidth + spacing;

    const isLastItem = index === items.length - 1;
    const rowIsFull = currentRowWidth >= containerWidth;

    if (rowIsFull || isLastItem) {
      const totalSpacing = spacing * (currentRow.length - 1);
      const availableWidth = containerWidth - totalSpacing;
      const currentWidthWithoutSpacing = currentRow.reduce(
        (sum, item) => sum + item.width,
        0
      );
      const ratio = availableWidth / currentWidthWithoutSpacing;

      const adjustedRow = currentRow.map((layoutItem) => ({
        ...layoutItem,
        calculatedWidth: layoutItem.width * ratio,
        calculatedHeight: layoutItem.height * ratio,
      }));

      rows.push({
        items: adjustedRow,
        rowHeight: targetRowHeight * ratio,
      });

      currentRow = [];
      currentRowWidth = 0;
    }
  });

  return rows;
};

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [categoryScrollPos, setCategoryScrollPos] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<
    Map<string, { width: number; height: number; aspectRatio: number }>
  >(new Map());
  const [loadedCount, setLoadedCount] = useState(0);

  const { data: categories } = useGetCategories();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetAllArt(selectedCategory || undefined);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastArtRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Load image dimensions
  useEffect(() => {
    const loadDimensions = async () => {
      const newDimensions = new Map<
        string,
        { width: number; height: number; aspectRatio: number }
      >();

      await Promise.all(
        allItems.map(async (item) => {
          const dim = await loadImageDimensions(item.art.imageUrl);
          newDimensions.set(item.art.id, dim);
        })
      );

      setImageDimensions(newDimensions);
      setLoadedCount(allItems.length);
    };

    if (allItems.length > 0) {
      loadDimensions();
    }
  }, [allItems]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const rows = useMemo(
    () =>
      calculateMorehLayout(allItems, imageDimensions, containerWidth, 320, 4),
    [allItems, imageDimensions, containerWidth, loadedCount]
  );

  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 200;
      categoriesScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    const el = categoriesScrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = categoriesScrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);
    return () => clearTimeout(timer);
  }, [categories]);

  const activeCategories = useMemo(() => {
    return (
      categories?.filter((cat) => cat.status === "active" && cat.count > 0) ||
      []
    );
  }, [categories]);

  const getCategoryId = (cat: Category): string => cat._id || cat.id;

  const handleCategoryClick = (id: string | null) => {
    if (categoriesScrollRef.current) {
      setCategoryScrollPos(categoriesScrollRef.current.scrollLeft);
    }
    setSelectedCategory(id);
  };

  useEffect(() => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollLeft = categoryScrollPos;
    }
  }, [categoryScrollPos]);

  if (status === "pending")
    return (
      <div>
        <ArtCardSkeleton />
      </div>
    );
  if (status === "error")
    return (
      <div>Error: {(error as Error)?.message || "Something went wrong"}</div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 px-2 z-10 w-full bg-black/30 backdrop-blur-sm flex items-center h-12">
        {showLeft && (
          <button
            onClick={() => scrollCategories("left")}
            className="absolute left-2 p-1 rounded-full bg-green-950 hover:bg-zinc-700 transition-colors z-20"
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
        )}

        <div
          ref={categoriesScrollRef}
          className="flex gap-2 overflow-x-auto w-[1416px]"
          style={{ scrollBehavior: "smooth" }}
        >
          <button
            className={`flex-shrink-0 px-3 rounded-sm whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "border border-main-color text-white"
                : " text-gray-300 border border-zinc-600"
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All Art
          </button>

          {activeCategories?.map((cat: Category) => (
            <button
              key={getCategoryId(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-sm whitespace-nowrap transition-colors ${
                selectedCategory === getCategoryId(cat)
                  ? "border border-main-color text-white"
                  : "bg-transparent border border-zinc-600 text-gray-300"
              }`}
              onClick={() => handleCategoryClick(getCategoryId(cat))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scrollCategories("right")}
            className="absolute right-1 p-1 rounded-full bg-green-950 hover:bg-zinc-700 transition-colors z-20"
          >
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div ref={containerRef} className="w-full">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              style={{ gap: "4px", marginBottom: "4px" }}
            >
              {row.items.map((layoutItem: any, itemIndex: number) => {
                const isLastItem =
                  rowIndex === rows.length - 1 &&
                  itemIndex === row.items.length - 1;
                const item = layoutItem.item;

                return (
                  <div
                    key={item.art.id}
                    ref={isLastItem ? lastArtRef : null}
                    style={{
                      width: `${layoutItem.calculatedWidth}px`,
                      height: `${layoutItem.calculatedHeight}px`,
                    }}
                  >
                    <ArtCard item={item} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
