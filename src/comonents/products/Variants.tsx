import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { IVariant } from "../../@types/product";
import { Fragment } from "react/jsx-runtime";
import VariantItem from "./VariantItem";

interface IProps {
  productIndex: number;
  onDragEnd: (variants: IVariant[], productIndex: number) => void;
  variants: IVariant[];
  onRemoveVariant: (productId: number, variantId: number) => void;
}

export default function Variants({
  onDragEnd,
  variants,
  onRemoveVariant,
  productIndex,
}: IProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      sensors={sensors}
      //   onDragStart={({ active }) => {
      //     setActive(active);
      //   }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = variants.findIndex(({ id }) => id === active.id);
          const overIndex = variants.findIndex(({ id }) => id === over.id);

          onDragEnd(arrayMove(variants, activeIndex, overIndex), productIndex);
        }
        // setActive(null);
      }}
      //   onDragCancel={() => {
      //     setActive(null);
      //   }}
    >
      <SortableContext items={variants}>
        {variants.map((variant: any) => (
          <Fragment key={variant?.id}>
            <VariantItem onRemoveVariant={onRemoveVariant} variant={variant} />
          </Fragment>
        ))}
      </SortableContext>
    </DndContext>
  );
}
