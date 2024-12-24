import { CiSearch } from "react-icons/ci";
import Dialog from "../Dialog";
import { IProduct } from "../../@types/product";
import { VariableSizeList as List } from "react-window";
import Row from "./Row";
import { useEffect, useRef } from "react";
import Loading from "../Loading";

interface IProps {
  open: boolean;
  onClose: VoidFunction;
  search: string;
  setSearch: (text: string) => void;
  products: IProduct[];
  selected: ISelect[];
  isLoading: boolean;
  onAddProduct: VoidFunction;
  onParentSelect: (productId: number, variantIds: number[]) => void;
  onChildSelect: (productId: number, variantId: number) => void;
}

interface ISelect {
  id: number;
  children: number[];
}

export default function AddProduct({
  open,
  onClose,
  products,
  search,
  setSearch,
  selected,
  isLoading,
  onAddProduct,
  onChildSelect,
  onParentSelect,
}: IProps) {
  const listRef = useRef<List>(null);

  const getItemSize = (index: number) => {
    let baseHeight = 57;
    let childHeight = 57;

    const h = baseHeight + childHeight * products[index]?.variants?.length;

    return h;
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  }, [products]);

  return (
    <div>
      <Dialog open={open} title="Select Product" onClose={onClose}>
        <div className="px-8 border-t border-[rgba(0,0,0,0.10)]">
          <div className="border border-gray-300 px-3 py-2 flex items-center my-2">
            <CiSearch className="text-xl text-[rgba(0,0,0,0.4)]" />
            <input
              value={search}
              placeholder="Search product"
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none leading-[1.0] text-[14px] px-2 w-full"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center">
            No product found matching for search "{search}"
          </div>
        )}

        <div className="w-full pr-1">
          <List
            ref={listRef}
            height={464}
            itemCount={products.length}
            itemSize={getItemSize}
            width={"100%"}
            overscanCount={10}
            useIsScrolling
            itemData={{ products, selected, onParentSelect, onChildSelect }}
          >
            {Row}
          </List>
        </div>

        <div className="py-2 px-4 flex justify-between items-center border-t">
          <div>{selected.length} Product Selected</div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-1 rounded-[4px] text-sm border border-[#00000066]"
            >
              Cancel
            </button>
            <button
              onClick={onAddProduct}
              className="bg-primary text-white px-5 py-1 rounded-[4px] text-sm border border-primary"
            >
              Add
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
