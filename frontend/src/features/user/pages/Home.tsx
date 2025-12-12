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
import { useMasonryLayout } from "../../../hooks/useMasonryLayout";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [categoryScrollPos, setCategoryScrollPos] = useState(0);

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

  const { containerRef, rows } = useMasonryLayout(
    allItems,
    (item) => item.art.id,
    (item) => item.art.imageUrl
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
    <div className="flex flex-col min-h-full">
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
          className="flex gap-2 overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" // ADDED: scrollbar styles
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

      <div className="p-2">
        <div ref={containerRef} className="w-full">
          {/* Render layout even when initial measurement was small, we use fallback width so it won't be blank */}
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              style={{ gap: "4px", marginBottom: "4px" }}
            >
              {row.items.map((item: any, itemIndex: number) => {
                const isLastItem =
                  rowIndex === rows.length - 1 &&
                  itemIndex === row.items.length - 1;
                return (
                  <div
                    key={item.art.id}
                    ref={isLastItem ? lastArtRef : null}
                    style={{
                      width: `${item.calculatedWidth}px`,
                      height: `${item.calculatedHeight}px`,
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
