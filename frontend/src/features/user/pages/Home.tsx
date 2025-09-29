import React, { useRef, useCallback, useState, useMemo, useEffect } from "react";
import { useGetAllArt } from "../hooks/art/useGetAllArt";
import { useGetCategories, type Category } from "../hooks/art/useGetCategories";
import ArtCard from "../components/art/ArtCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [categoryScrollPos, setCategoryScrollPos] = useState(0);

  const { data: categories } = useGetCategories();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useGetAllArt(selectedCategory || undefined);

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
    return categories?.filter((cat) => cat.status === "active" && cat.count > 0) || [];
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

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error")
    return <div>Error: {(error as Error)?.message || "Something went wrong"}</div>;

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
          className="flex gap-2 overflow-x-auto no-scrollbar w-[1416px]"
          style={{ scrollBehavior: "smooth" }}
        >
          <button
            className={`flex-shrink-0 px-3 rounded-sm whitespace-nowrap transition-colors ${
              !selectedCategory ? "border border-main-color text-white" : " text-gray-300 border border-zinc-600"
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
        <div className="flex flex-wrap gap-2">
          {data?.pages.map((page, pageIndex) =>
            page.data.map((item, index) => {
              const isLastItem = pageIndex === data.pages.length - 1 && index === page.data.length - 1;
              return (
                <div key={item.art.id} ref={isLastItem ? lastArtRef : null}>
                  <ArtCard item={item} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
