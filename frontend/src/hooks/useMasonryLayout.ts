import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";

// Image dimension cache shared across instances
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

export const useMasonryLayout = <T>(
  items: T[],
  getId: (item: T) => string,
  getUrl: (item: T) => string,
  targetRowHeight: number = 320,
  spacing: number = 4
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<
    Map<string, { width: number; height: number; aspectRatio: number }>
  >(new Map());

  // Load image dimensions
  useEffect(() => {
    let mounted = true;
    const loadDimensions = async () => {
      const newDimensions = new Map(imageDimensions);
      let changed = false;

      await Promise.all(
        items.map(async (item) => {
          const id = getId(item);
          const url = getUrl(item);
          if (!newDimensions.has(id)) {
             const dim = await loadImageDimensions(url);
             newDimensions.set(id, dim);
             changed = true;
          }
        })
      );

      if (!mounted) return;
      if (changed) {
        setImageDimensions(newDimensions);
        // Trigger re-measure
         requestAnimationFrame(() => {
            if (containerRef.current) {
              const w = Math.max(
                containerRef.current.getBoundingClientRect().width,
                0
              );
              setContainerWidth(w);
            }
          });
      }
    };

    if (items.length > 0) loadDimensions();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); 

  // Measure container
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

    measure();

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(measure);
      });
      ro.observe(containerRef.current);
    } else {
      const onResize = () => requestAnimationFrame(measure);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, []);

  // Calculate layout
  const rows = useMemo(() => {
      if (!items.length) return [];

      const effectiveWidth = containerWidth > 0 ? containerWidth : window.innerWidth || 1200;
      const resultRows: { items: (T & { calculatedWidth: number; calculatedHeight: number })[], rowHeight: number }[] = [];
      
      let currentRow: (T & { width: number; height: number; aspectRatio: number; calculatedWidth: number; calculatedHeight: number })[] = [];
      let currentRowWidth = 0;

      items.forEach((item, index) => {
        const id = getId(item);
        const dim = imageDimensions.get(id) || {
          width: 300,
          height: 250,
          aspectRatio: 1.5,
        };
        const itemWidth = targetRowHeight * dim.aspectRatio;

        const layoutItem = {
          ...item,
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
          const availableWidth = Math.max(effectiveWidth - totalSpacing, 1);
          const currentWidthWithoutSpacing = currentRow.reduce((sum, it) => sum + it.width, 0) || 1;
          const ratio = availableWidth / currentWidthWithoutSpacing;

          const adjustedRow = currentRow.map((li) => ({
            ...li,
            calculatedWidth: li.width * ratio,
            calculatedHeight: li.height * ratio,
          }));

          resultRows.push({ items: adjustedRow, rowHeight: targetRowHeight * ratio });

          currentRow = [];
          currentRowWidth = 0;
        }
      });

      return resultRows;

  }, [items, imageDimensions, containerWidth, targetRowHeight, spacing, getId]);

  return { containerRef, rows };
};
