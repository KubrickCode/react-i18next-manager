import {
  DragDropContext as DndDragDropContext,
  DragDropContextProps,
} from "@hello-pangea/dnd";

export const DragDropContext = (props: DragDropContextProps) => (
  <DndDragDropContext {...props} />
);
