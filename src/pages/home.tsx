import { useEffect, useState } from "react";

import { MdEdit } from "react-icons/md";

import axiosInstance from "../utils/axios";

import { IProduct, ISelectedProduct, IVariant } from "../@types/product";

import Products from "../comonents/products";
import { API_KEY } from "../utils/configs";
import clsx from "clsx";

export default function Home() {
  const [page, setPage] = useState<number>(1);

  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState<string>("");

  const [debounceSearch, setDebounceSearch] = useState<string>("");

  const [products, setProducts] = useState<IProduct[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct[]>(
    []
  );

  const onRemoveProduct = (productId: number) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((item) => item.id !== productId)
    );
  };

  const onRemoveVariant = (productId: number, variantId: number) => {
    setSelectedProduct((prevProducts) =>
      prevProducts.map((item) => {
        if (item.id === productId) {
          const updatedVariants = item.variants.filter(
            (el) => el.id !== variantId
          );

          return { ...item, variants: updatedVariants };
        }
        return item;
      })
    );
  };

  const onParentDrag = (products: ISelectedProduct[]) => {
    setSelectedProduct(products);
  };

  const handleChildDrag = (variants: IVariant[], productIndex: number) => {
    const data = [...selectedProduct];

    data[productIndex] = {
      ...data[productIndex],
      variants: variants,
    };

    setSelectedProduct(data);
  };

  const onSearch = (input: string) => {
    setSearch(input);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        let params = {
          page: page,
          limit: page * 10,
          search: debounceSearch,
        };
        setHasMore(true);
        setIsLoading(true);
        const res = await axiosInstance.get("/products/search", {
          params,
          headers: {
            "x-api-key": API_KEY,
          },
        });

        setIsLoading(false);
        if (res.data) {
          setProducts((prev) => [...prev, ...res.data]);
        } else {
          setProducts([]);
          setHasMore(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("log: er", error);
      }
    };
    getProduct();
  }, [page, debounceSearch]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      setProducts([]);
      setDebounceSearch(search);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [search]);

  return (
    <div>
      <div className="max-w-xl mx-auto rounded-lg mt-16 text-dark relative lg:-left-[10vw]">
        <h2 className="text-xl w-full text-left font-semibold mb-8 px-4">
          Add Products
        </h2>
        <div
          className={`flex flex-col  space-y-4  ${
            selectedProduct.length === 0 ? "w-fit" : ""
          }`}
        >
          <div className="flex gap-x-4">
            <div className="flex-[.5]">
              <span
                className={clsx(
                  "flex ml-16 text-sm font-medium text-gray-700",
                  selectedProduct.length === 0 && "mb-4"
                )}
              >
                Product
              </span>

              {selectedProduct.length === 0 && (
                <div className="flex items-center gap-2">
                  <img src="/drag.png" />
                  1.
                  <div className="bg-white rounded-md shadow-md border w-56 flex items-center pr-2">
                    <input
                      type="text"
                      className="px-4 py-1 outline-none w-full"
                      name=""
                      id=""
                      placeholder="Select Product"
                    />
                    <MdEdit
                      className="text-gray-400 text-xl cursor-pointer"
                      // onClick={() => setOpen(true)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-[.5]">
              <span
                className={clsx(
                  "flex text-sm font-medium text-gray-700 ",
                  selectedProduct.length === 0 && "mb-4"
                )}
              >
                Discount
              </span>
              {selectedProduct.length === 0 && (
                <button className="px-4 w-[165px] py-1 bg-primary text-white rounded-md shadow-md ">
                  Add Discount
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Products
        search={search}
        products={products}
        hasMore={hasMore}
        isLoading={isLoading}
        setPage={setPage}
        onSearch={onSearch}
        setSelectedProduct={setSelectedProduct}
        selectedProduct={selectedProduct}
        onRemoveVariant={onRemoveVariant}
        onRemoveProduct={onRemoveProduct}
        onParentDrag={onParentDrag}
        onChildDrag={handleChildDrag}
      />
    </div>
  );
}
