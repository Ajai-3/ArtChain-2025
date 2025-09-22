import React, { useRef, useCallback } from "react";
import { useGetAllArt } from "../hooks/art/useGetAllArt";
import ArtCard from "../components/art/ArtCard";

const Home: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetAllArt();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastArtRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const typedStatus = status as "loading" | "error" | "success";

  if (typedStatus === "loading") return <div>Loading...</div>;
  if (typedStatus === "error")
    return (
      <div>Error: {(error as Error)?.message || "Something went wrong"}</div>
    );

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">All Art</h1>

      <div className="flex flex-wrap gap-1 items-start">
        {data?.pages.map((page, pageIndex) =>
          page.data.map((item, index) => {
            const isLastItem =
              pageIndex === data.pages.length - 1 &&
              index === page.data.length - 1;

            return (
              <div key={item.art.id}>
                <ArtCard
                  item={item}
                  lastArtRef={isLastItem ? lastArtRef : undefined}
                />
              </div>
            );
          })
        )}
      </div>

      {isFetchingNextPage && <div className="mt-4">Loading more...</div>}
    </div>
  );
};

export default Home;
