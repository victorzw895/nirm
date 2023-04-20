import { Droppable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Dynamic } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  Draggable,
} from "@thisbeyond/solid-dnd";
import { For, Show, JSXElement, Component, createSignal, ParentComponent, JSX } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { setSelectedAnime } from '../Components/Preview';
import { upsertAnimeWatched, Anime } from '../api';

interface SortableProps {
  item: {
    id: number,
  },
  children: JSXElement
}

const Sortable: ParentComponent<SortableProps> = (props) => {
  const sortable = createSortable(props.item.id);
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
  [key: string]: any;
}

export interface DraggableItemProps<T> {
  item: T,
  overlay?: boolean
}

export interface SortableListProps {
  draggableContainer: (SortableItem: Component<DraggableItemProps<any>>) => JSXElement
  updatedValues: any[],
}

const [activeItem, setActiveItem] = createSignal<SortableItem>(null);

const withSortableList = <
  TComponent extends SortableListProps,
  TList extends SortableItem,
>(
  SortableComponent: Component<TComponent>,
  sortableList: TList[],
  setSortableList: SetStoreFunction<TList[]>,
) => {
  return (props: Omit<TComponent, keyof SortableListProps>) => {
    const [updatedValues, setUpdatedValues] = createSignal<TList[]>([]);
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
        {...(props as TComponent)}
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