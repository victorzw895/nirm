import { Droppable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Dynamic } from 'solid-js/web';
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  Draggable,
} from "@thisbeyond/solid-dnd";
import { For, Show, JSXElement, Component, createSignal, ParentComponent } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface SortableProps {
  item: {
    id: number,
  },
  children: JSXElement
}

const Sortable: ParentComponent<SortableProps> = (props) => {
  const sortable = createSortable(props.item.id, props.item);
  const [state] = useDragDropContext();
  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!state.active.draggable,
      }}
    >
      {props.children}
    </div>
  );
};

interface SortableItem {
  id: number,
}

export interface DraggableItemProps<T> {
  item: T,
  overlay?: boolean
}

export interface SortableListProps<T> {
  draggableContainer: (SortableItem: Component<DraggableItemProps<T>>) => JSXElement
  updatedValues: any[],
}


const withSortableList = <
  TData extends SortableItem,
>(
  SortableComponent: Component<SortableListProps<TData>>,
  sortableList: TData[],
  setSortableList: SetStoreFunction<TData[]>,
) => {
  return (props: Omit<SortableListProps<TData>, keyof SortableListProps<TData>>) => {
    const [activeItem, setActiveItem] = createSignal<TData>(null);
    const [updatedValues, setUpdatedValues] = createSignal<TData[]>([]);

    const ids = () => sortableList.map(item => item.id);

    const onDragStart = ({ draggable }: { draggable: Draggable}) => {
      const draggedItem = sortableList.find(item => item.id === draggable.id)
      setActiveItem((_) => draggedItem)
    };
  
    const onDragOver = ({ draggable, droppable }: { draggable: Draggable, droppable: Droppable }) => {
      if (draggable && droppable) {
        // const currentItems = sortableList;
        // const fromIndex = ids().indexOf(Number(draggable.id));
        const toIndex = ids().indexOf(Number(droppable.id));
        // if (cardRef) {
        //   cardRef.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'start',
        //   })
        // }
  
        // TODO update all cards ranks as active draggable
        // const updatedItems = currentItems.slice();
        // updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        // const updatedItemRanks = updatedItems.map((anime, index) => ({
        //   ...anime,
        //   rank: index + 1
        // }))
  
        // setSortableList(updatedItemRanks);
  
        const draggedItem = sortableList.find(item => item.id === draggable.id)
        setActiveItem((_) => ({
          ...draggedItem,
          rank: toIndex + 1
        }))
      }
    }
  
    const onDragEnd = ({ draggable, droppable }: { draggable: Draggable, droppable: Droppable }) => {
      if (draggable && droppable) {
        const currentItems = sortableList;
        const fromIndex = ids().indexOf(Number(draggable.id));
        const toIndex = ids().indexOf(Number(droppable.id));
        if (fromIndex !== toIndex) {
          const updatedItems = currentItems.slice();
          updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
          const updatedItemRanks = updatedItems.map((item, index) => ({
            ...item,
            rank: index + 1
          }))
          
          setUpdatedValues(updatedItemRanks.filter((_, index) => {
            if (fromIndex < toIndex) {
              return index >= fromIndex && index <= toIndex
            }
            else {
              return index >= toIndex && index <= fromIndex
            }
          }))
          setSortableList(updatedItemRanks);
        }
      }
    };
  
    return (
      <SortableComponent 
        {...(props as SortableListProps<TData>)}
        updatedValues={updatedValues()}
        draggableContainer={
          (SortableItem) => (
            <DragDropProvider
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              collisionDetector={closestCenter}
            >
              <DragDropSensors />
              <SortableProvider ids={ids()}>
                <Dynamic component={() => 
                  <For each={sortableList} fallback={<div>Loading...</div>}>
                    {
                      (item) => 
                      <Sortable item={item}>
                        <SortableItem item={item} />
                      </Sortable>
                    }
                  </For>
                } />
        
              </SortableProvider>
              <DragOverlay>
                <div class="sortable">
                  <Show when={!!activeItem()}>
                    <SortableItem item={activeItem()} overlay />
                  </Show>
                </div>
              </DragOverlay>
            </DragDropProvider>
            )
        }
      />
    );
  }
}

export default withSortableList;