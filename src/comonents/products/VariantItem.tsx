import { IVariant } from "../../@types/product";
import { IoMdClose } from "react-icons/io";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { DragButton } from "../DragButton";

interface IProps {
  variant: IVariant;
  onRemoveVariant: (productId: number, variantId: number) => void;
}

export default function VariantItem({ variant, onRemoveVariant }: IProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: variant.id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-x-2 mb-2 items-center my-5 ml-4"
    >
      <DragButton
        attributes={attributes}
        listeners={listeners}
        setActivatorNodeRef={setActivatorNodeRef}
      />

      <div className="bg-white rounded-[30px] h-8 shadow-md border w-[184px] flex items-center px-4 mx-1 py-1">
        {variant.title}
      </div>

      <div className="flex gap-x-1 items-center">
        <>
          <input className="bg-white rounded-[30px] h-8 shadow-md border outline-none w-[69px] text-center py-1 px-2" />
          <select className="rounded-[30px] h-8 w-[95px] text-center bg-transparent placeholder:text-slate-400 border bg-white text-slate-700 text-sm rounded-full px-2  py-1 outline-none focus:border-slate-400 shadow-md appearance-none cursor-pointer">
            <option value="percent">% off</option>
            <option value="flat">flat off</option>
          </select>
        </>
      </div>
      <div>
        <IoMdClose
          className="text-lightDark text-xl font-bold cursor-pointer"
          onClick={() => onRemoveVariant(variant?.product_id, variant.id)}
        />
      </div>
    </div>
  );
}
