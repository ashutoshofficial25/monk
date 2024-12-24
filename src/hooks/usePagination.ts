import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { IProduct } from "../interface/product";

const API_KEY = "your-api-key";

interface UsePaginationReturn {
  products: IProduct[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

const usePagination = (search: string): UsePaginationReturn => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset when search changes
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);

      const res = await axiosInstance.get<IProduct[]>("/products/search", {
        params: { page, search },
        headers: { "x-api-key": API_KEY },
      });

      if (res.data && res.data.length > 0) {
        setProducts((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setIsLoading(false);
    }
  };

  return { products, isLoading, hasMore, loadMore };
};

export default usePagination;
