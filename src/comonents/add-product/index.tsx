import { CiSearch } from "react-icons/ci";
import Dialog from "../Dialog";
import { IProduct } from "../../@types/product";
import Row from "./Row";
import Loading from "../Loading";
import InfiniteScroll from "react-infinite-scroll-component";

interface IProps {
  open: boolean;
  onClose: VoidFunction;
  search: string;
  hasMore: boolean;
  setSearch: (text: string) => void;
  products: IProduct[];
  selected: ISelect[];
  isLoading: boolean;
  setPage: any;
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
  hasMore,
  products,
  setPage,
  search,
  setSearch,
  selected,
  isLoading,
  onAddProduct,
  onChildSelect,
  onParentSelect,
}: IProps) {
  function fetchMore() {
    console.log("log: image");
    setPage((prev: number) => prev + 1);
  }

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

        {/* {isLoading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )} */}

        {/* {products.length === 0 && !isLoading && (
          <div className="text-center">
            No product found matching for search "{search}"
          </div>
        )} */}

        <div className="w-full pr-1">
          <InfiniteScroll
            dataLength={products.length + 10}
            next={fetchMore}
            loader={
              <div className="flex justify-center">
                <Loading />
              </div>
            }
            height={464}
            endMessage={<div className="text-center">No Products .</div>}
            hasMore={hasMore}
          >
            {products.map((el) => (
              <Row
                product={el}
                onChildSelect={onChildSelect}
                onParentSelect={onParentSelect}
                selected={selected}
              />
            ))}
          </InfiniteScroll>
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
