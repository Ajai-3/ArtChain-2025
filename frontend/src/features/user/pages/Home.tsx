  import React, { useEffect, useRef } from 'react';
  import { useFetchArtworks } from '../../../api/user/art/queries';

  const Home: React.FC = () => {
    const {
      data,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useFetchArtworks();

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1 }
      );

      if (observerRef.current) observer.observe(observerRef.current);

      return () => {
        if (observerRef.current) observer.unobserve(observerRef.current);
      };
    }, [fetchNextPage, hasNextPage]);

    return (
      <div className='h-[calc(100vh-62px)] w-full p-4 overflow-auto scrollbar'>
        <h1 className='text-xl font-bold mb-4'>Latest Artworks</h1>

        {isLoading && <p>Loading...</p>}
        {isError && <p>Something went wrong.</p>}

        <div className='flex flex-wrap'>
          {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.map((art) => (
              <div key={art._id} className='border p-3 rounded mb-4'>
                <h2 className='font-semibold'>{art.title}</h2>
                <p className='text-sm text-gray-600'>{art.description}</p>
                {art.images?.[0] && (
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className='mt-2 rounded w-52'
                  />
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
        </div>

        {isFetchingNextPage && <p>Loading more...</p>}
        <div ref={observerRef} className='h-10'></div>
      </div>
    );
  };

  export default Home;
