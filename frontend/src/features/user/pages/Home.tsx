import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import { useGetAllArt } from "../hooks/art/useGetAllArt";
import { useGetCategories, type Category } from "../hooks/art/useGetCategories";
import ArtCard from "../components/art/ArtCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArtCardSkeleton from "../components/skeletons/ArtCardSkeleton";
import type { ArtWithUser } from "../hooks/art/useGetAllArt";

// Image dimension cache (unchanged)
const imageDimensionsCache = new Map<
  string,
  { width: number; height: number; aspectRatio: number }
>();

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
      resolve({ width: 300, height: 200, aspectRatio: 1.5 });
    };
    img.src = url;
  });
};

// Moreh layout: uses effectiveWidth fallback so it never returns empty due to 0 width
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
  if (!items.length) return [];

  // fallback to a reasonable width if containerWidth is 0 (pre-measure)
  const effectiveWidth =
    containerWidth > 0 ? containerWidth : window.innerWidth || 1200;

  const rows: any[] = [];
  let currentRow: any[] = [];
  let currentRowWidth = 0;

  items.forEach((item, index) => {
    const dim = dimensions.get(item.art.id) || {
      width: 300,
      height: 250,
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
    const rowIsFull = currentRowWidth >= effectiveWidth;

    if (rowIsFull || isLastItem) {
      const totalSpacing = spacing * (currentRow.length - 1);
      const availableWidth = Math.max(effectiveWidth - totalSpacing, 1); // guard divide by zero
      const currentWidthWithoutSpacing =
        currentRow.reduce((sum, it) => sum + it.width, 0) || 1;
      const ratio = availableWidth / currentWidthWithoutSpacing;

      const adjustedRow = currentRow.map((li) => ({
        ...li,
        calculatedWidth: li.width * ratio,
        calculatedHeight: li.height * ratio,
      }));

      rows.push({ items: adjustedRow, rowHeight: targetRowHeight * ratio });

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

  // last item infinite-scroll ref
  const lastArtRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const allItems = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data]
  );

  // load image dimensions (unchanged but triggers measurement after complete)
  useEffect(() => {
    let mounted = true;
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
      if (!mounted) return;
      setImageDimensions(newDimensions);
      setLoadedCount(allItems.length);
      // trigger re-measure immediately so layout uses new dimensions
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const w = Math.max(
            containerRef.current.getBoundingClientRect().width,
            0
          );
          setContainerWidth(w);
        } else {
          setContainerWidth(window.innerWidth || 1200);
        }
      });
    };

    if (allItems.length > 0) loadDimensions();

    return () => {
      mounted = false;
    };
  }, [allItems]);

  // --- Use useLayoutEffect to measure container width synchronously before paint ---
  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current) {
        setContainerWidth(window.innerWidth || 1200);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.max(Math.round(rect.width), 0);
      setContainerWidth(w || window.innerWidth || 1200);
    };

    // initial synchronous measurement (pre-paint) to avoid blank render
    measure();

    // ResizeObserver (preferred)
    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        // measure inside RAF to avoid layout thrash
        requestAnimationFrame(measure);
      });
      ro.observe(containerRef.current);
    } else {
      // fallback
      const onResize = () => requestAnimationFrame(measure);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, []);

  // compute rows using effective width fallback, re-compute when dimensions change
  const rows = useMemo(
    () =>
      calculateMorehLayout(allItems, imageDimensions, containerWidth, 320, 4),
    [allItems, imageDimensions, containerWidth, loadedCount]
  );

  // categories scroll helpers (unchanged)
  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    const el = categoriesScrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1); // Added -1 for better boundary detection
  };

  // FIX: Use useLayoutEffect for initial scroll check and add timeout for safe measure
  useLayoutEffect(() => {
    checkScroll();
  }, [categories]); // Re-check when categories change

  useEffect(() => {
    const el = categoriesScrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // FIX: Add multiple timeouts to ensure scrollbar detection after render
  useEffect(() => {
    const timers = [
      setTimeout(() => checkScroll(), 100),
      setTimeout(() => checkScroll(), 300), // Additional check after render
      setTimeout(() => checkScroll(), 500), // Final check to be sure
    ];

    return () => timers.forEach(clearTimeout);
  }, [categories, selectedCategory]); // Also check when selected category changes

  const activeCategories = useMemo(
    () => categories?.filter((c) => c.status === "active" && c.count > 0) || [],
    [categories]
  );

  const getCategoryId = (cat: Category) => cat._id || cat.id;

  const handleCategoryClick = (id: string | null) => {
    if (categoriesScrollRef.current)
      setCategoryScrollPos(categoriesScrollRef.current.scrollLeft);
    setSelectedCategory(id);
  };

  useEffect(() => {
    if (categoriesScrollRef.current)
      categoriesScrollRef.current.scrollLeft = categoryScrollPos;
  }, [categoryScrollPos]);

  // FIX: Also check scroll after category selection
  useEffect(() => {
    const timer = setTimeout(() => checkScroll(), 150);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Loading/error UI same as before
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

  // Final render: same layout and styles as you provided
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
          className="flex gap-2 overflow-x-auto w-[1416px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" // ADDED: scrollbar styles
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

      <div className="p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div ref={containerRef} className="w-full">
          {/* Render layout even when initial measurement was small, we use fallback width so it won't be blank */}
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
