import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface IProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  className?: string;
}

export function DragButton({
  className,
  attributes,
  listeners,
  setActivatorNodeRef,
}: IProps) {
  return (
    <button
      className={`DragHandle ${className}`}
      {...attributes}
      {...listeners}
      ref={setActivatorNodeRef}
    >
      <svg
        width="7"
        height="14"
        viewBox="0 0 7 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="1" cy="7" r="1" fill="black" fill-opacity="0.5" />
        <circle cx="6" cy="7" r="1" fill="black" fill-opacity="0.5" />
        <circle cx="1" cy="1" r="1" fill="black" fill-opacity="0.5" />
        <circle cx="6" cy="1" r="1" fill="black" fill-opacity="0.5" />
        <circle cx="1" cy="13" r="1" fill="black" fill-opacity="0.5" />
        <circle cx="6" cy="13" r="1" fill="black" fill-opacity="0.5" />
      </svg>
    </button>
  );
}
