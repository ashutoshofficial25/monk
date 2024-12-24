import { ListChildComponentProps } from "react-window";
import { IProduct, IVariant } from "../../interface/product";
import Checkbox from "../Checkbox";

const Row: React.FC<ListChildComponentProps> = ({
  data,
  style,
  index,
  isScrolling,
}) => {
  const { products, selected, onParentSelect, onChildSelect } = data;

  const product: IProduct = products[index];

  const isParentSelected = (productId: number) => {
    const checked = selected.find((el: any) => el.id === productId);

    if (checked) return true;
    else return false;
  };

  const isChildSelected = (productId: number, variantId: number) => {
    const checked = selected.find((el: any) => el.id === productId);

    if (!checked) return false;

    const child = checked.children.find((el: any) => el === variantId);

    if (child === 0) return true;

    if (child) return true;
    else return false;
  };

  return (
    <div key={product.id} style={style}>
      <div className="py-4 px-7 border-t border-[rgba(0,0,0,0.10)] flex gap-x-4 items-center">
        <Checkbox
          checked={isParentSelected(product.id)}
          onClick={() =>
            onParentSelect(
              product.id,
              product.variants?.map((el) => el.id)
            )
          }
        />

        <div className="h-8 w-8 rounded-4 overflow-hidden">
          <img
            src={product?.image?.src || "/dummy.jpg"}
            className="h-full w-full  rounded-[4px]"
            loading="lazy"
          />
        </div>

        <p className="text-base">{product.title}</p>
      </div>

      {/* children */}
      {product?.variants?.map((variant: IVariant, _childIndex) => (
        <div key={variant.id}>
          <div className="py-4 pl-[70px] pr-7 border-t border-[rgba(0,0,0,0.10)] flex gap-2 items-center justify-between text-text">
            <div className="flex items-center gap-x-4">
              <Checkbox
                checked={isChildSelected(product.id, variant?.id)}
                onClick={() => onChildSelect(product.id, variant?.id)}
              />
              <p className="text-base">{variant.title}</p>
            </div>

            <div className="flex items-center gap-x-6">
              <div>{variant?.inventory_quantity || 0} available</div>
              <div>${variant.price}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Row;
