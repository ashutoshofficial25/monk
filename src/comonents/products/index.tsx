import { Fragment, useState } from "react";

import { IProduct, ISelectedProduct, IVariant } from "../../interface/product";
import {
  DndContext,
  DragEndEvent,
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
import ProductItem from "./ProductItem";
import AddProduct from "../add-product";
import clsx from "clsx";

interface ISelect {
  id: number;
  children: number[];
}

interface IProps {
  search: string;
  products: IProduct[];
  onSearch: (text: string) => string;
  isLoading: boolean;
  selectedProduct: ISelectedProduct[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<ISelectedProduct[]>>;
  onRemoveVariant: (productId: number, variantId: number) => void;
  onRemoveProduct: (productId: number) => void;
  onParentDrag: (products: ISelectedProduct[]) => void;
  onChildDrag: (variants: IVariant[], productIndex: number) => void;
}

export default function Products({
  search,
  products,
  onSearch,
  isLoading,
  selectedProduct,
  setSelectedProduct,
  onRemoveVariant,
  onRemoveProduct,
  onParentDrag,
  onChildDrag,
}: IProps) {
  const [showVariant, setShowVariant] = useState<number[]>([]);

  const [selected, setSelected] = useState<ISelect[]>([]);

  const [open, setOpen] = useState<boolean>(false);

  const [editId, setEditId] = useState<{
    index: number;
    productId: number;
  } | null>(null);

  const [openDiscount, setOpenDiscount] = useState<number[]>([]);

  const handleAddProduct = () => {
    const temp: ISelectedProduct[] = [];

    selected.map((item) => {
      const product = products.find((el) => el.id === item.id);

      let child: IVariant[] = [];
      if (!product) return;

      product.variants.map((el: IVariant) => {
        if (item.children.includes(el.id)) {
          child.push(el);
        }
      });

      product.variants = child;

      temp.push({ ...product, discount: { value: "", type: "" } });
    });

    setSelectedProduct((prev) => [...prev, ...temp]);
    handleClose();
  };

  const handleEditProduct = () => {
    const temp = [...selectedProduct];

    //check this time selected or not
    const isExist = selected.find((item) => item.id === editId?.productId);

    //filter new selected
    const newSelected = selected.filter(
      (item) => !temp.some((el) => el.id === item.id)
    );

    const newSelectedProduct: ISelectedProduct[] = [];

    //find new products
    products.map((item) => {
      if (newSelected.some((el) => el.id === item.id)) {
        newSelectedProduct.push({
          ...item,
          discount: { type: "", value: "" },
        });
      }
    });

    //exist then insert without delete else delete
    if (isExist) {
      temp.splice(editId?.index!, 0, ...newSelectedProduct);
    } else {
      temp.splice(editId?.index!, 1, ...newSelectedProduct);
    }

    setSelectedProduct(temp);

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    onSearch("");
    setSelected([]);
  };

  const addDiscount = (productId: number) => {
    setOpenDiscount((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setOpenDiscount((prev) => prev.filter((el) => el !== productId));
    setShowVariant((prev) => prev.filter((el) => el !== productId));
    onRemoveProduct(productId);
  };

  const handleShowVariant = (productId: number) => {
    setShowVariant((prev) =>
      prev.includes(productId)
        ? prev.filter((item) => item !== productId)
        : [...prev, productId]
    );
  };

  const onEdit = (productId: number, index: number) => {
    setOpen(true);
    setEditId({ productId, index });
    return;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && active.id !== over?.id) {
      const activeIndex = selectedProduct.findIndex(
        ({ id }) => id === active.id
      );
      const overIndex = selectedProduct.findIndex(({ id }) => id === over.id);

      onParentDrag(arrayMove(selectedProduct, activeIndex, overIndex));
    }
  };

  const handleParentSelect = (productId: number, variantIds: number[]) => {
    const temp = [...selected];

    const index = temp.findIndex((el) => el.id === productId);

    if (index !== -1) {
      temp.splice(index, 1);
    } else {
      temp.push({
        id: productId,
        children: variantIds,
      });
    }

    setSelected(temp);
  };

  const handleChildSelect = (productId: number, childId: number) => {
    const temp = [...selected];

    const parentIndex = temp.findIndex((item) => item.id === productId);

    if (parentIndex === -1) {
      temp.push({
        id: productId,
        children: [childId],
      });
    } else {
      const children = temp[parentIndex].children;

      const childIndex = children.findIndex((el) => el === childId);

      if (childIndex !== -1) {
        temp[parentIndex] = {
          id: productId,
          children: children.filter((el) => el !== childId),
        };
      } else {
        temp[parentIndex] = {
          id: productId,
          children: [...children, childId],
        };
      }
    }

    setSelected(temp);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="max-w-xl mx-auto rounded-lg text-dark relative lg:-left-[10vw] ">
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={selectedProduct}>
          {selectedProduct.map((product, index) => (
            <Fragment key={product.id}>
              <ProductItem
                addDiscount={addDiscount}
                handleShowVariant={handleShowVariant}
                index={index}
                onEdit={onEdit}
                onRemoveProduct={handleRemoveProduct}
                onRemoveVariant={onRemoveVariant}
                openDiscount={openDiscount}
                product={product}
                showVariant={showVariant}
                onChildDrag={onChildDrag}
              />
            </Fragment>
          ))}
        </SortableContext>
      </DndContext>
      <div
        className={clsx(
          `mt-5  `,
          selectedProduct.length ? "ml-[162px]" : "ml-[115px]"
        )}
      >
        <button
          className="px-[54px] py-3 border border-primary  rounded-[4px]  text-primary font-semibold transition"
          onClick={() => setOpen(true)}
        >
          Add Product
        </button>
      </div>

      <div>
        <AddProduct
          open={open}
          onClose={handleClose}
          search={search}
          setSearch={onSearch}
          onAddProduct={editId ? handleEditProduct : handleAddProduct}
          onParentSelect={handleParentSelect}
          onChildSelect={handleChildSelect}
          products={
            editId
              ? products
              : products.filter(
                  (product) =>
                    !selectedProduct.some((el) => el.id === product.id)
                )
          }
          selected={selected}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
