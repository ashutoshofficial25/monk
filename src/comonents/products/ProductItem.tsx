import { ISelectedProduct, IVariant } from "../../interface/product";
import { MdEdit } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import Variants from "./Variants";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { DragButton } from "../DragButton";

interface IProps {
  product: ISelectedProduct;
  index: number;
  showVariant: number[];
  openDiscount: number[];
  addDiscount: (productId: number) => void;
  handleShowVariant: (productId: number) => void;
  onEdit: (productId: number, index: number) => void;
  onRemoveVariant: (productId: number, variantId: number) => void;
  onRemoveProduct: (productId: number) => void;
  onChildDrag: (variants: IVariant[], productIndex: number) => void;
}

export default function ProductItem({
  product,
  index,
  onEdit,
  onRemoveProduct,
  onRemoveVariant,
  handleShowVariant,
  showVariant,
  addDiscount,
  openDiscount,
  onChildDrag,
}: IProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="border-b w-max pb-4 pt-7">
      <div>
        <div className="flex items-center ">
          <DragButton
            attributes={attributes}
            listeners={listeners}
            setActivatorNodeRef={setActivatorNodeRef}
          />
          <div className="flex-[.5] mx-3">
            <div className="flex items-center">
              <span className="mr-2"> {index + 1}.</span>
              <div className="bg-white rounded overflow-hidden shadow-md border w-56 h-8 flex items-center pr-2">
                <input
                  type="text"
                  className="px-4 py-1 outline-none  w-full"
                  name=""
                  id=""
                  value={product.title}
                  placeholder="Select Product"
                />
                <MdEdit
                  className="text-gray-400 text-xl"
                  onClick={() => onEdit(product.id, index)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-x-1">
            {openDiscount.includes(product.id) ? (
              <>
                <input className="bg-white shadow-md border outline-none w-[69px] h-8 text-center py-1 px-2" />
                <select className="w-[95px] h-8 bg-transparent text-center placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8  transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                  <option value="percent">% off</option>
                  <option value="flat">flat off</option>
                </select>
              </>
            ) : (
              <button
                onClick={() => addDiscount(product.id)}
                className="px-4 w-[165px] py-1 bg-primary text-white rounded-md shadow-md "
              >
                Add Discount
              </button>
            )}
          </div>
          <IoMdClose
            height={11.67}
            width={11.67}
            className="text-lightDark text-xl font-bold cursor-pointer ml-3"
            onClick={() => onRemoveProduct(product.id)}
          />
        </div>
        <div className="relative">
          {product.variants.length > 1 && (
            <div
              className="flex justify-end mt-2 mb-4 text-[#006eff]"
              onClick={() => handleShowVariant(product.id)}
            >
              <p className="text-xs underline">Show Variants</p>{" "}
              {showVariant.includes(product.id) ? (
                <IoIosArrowUp />
              ) : (
                <IoIosArrowDown />
              )}
            </div>
          )}

          {/* child item */}
          <div className="ml-12 mt-2">
            {(showVariant.includes(product.id) ||
              product.variants.length === 1) && (
              <Variants
                onDragEnd={onChildDrag}
                onRemoveVariant={onRemoveVariant}
                variants={product.variants}
                productIndex={index}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
