import { Droppable, useDragDropContext } from "@thisbeyond/solid-dnd";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  Draggable
} from "@thisbeyond/solid-dnd";
import { createSignal, For, Show, JSXElement } from "solid-js";
import { animeWatchedList, setAnimeWatchedList } from '../App';
import { setSelectedAnime } from '../Components/Preview';
import Card, { setFocusAnimeId } from '../Components/Card';
import {
  upsertAnimeWatched,
  Anime
} from '../api';

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      sortable: boolean;
    }
  }
}

const Sortable = (props: {item: {id: number}, children: JSXElement}) => {
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

const [activeItem, setActiveItem] = createSignal<Anime>(null);
export const SortableWatchedAnimeList = () => {

  const ids = () => animeWatchedList.map(anime => anime.id);
  const onDragStart = ({ draggable }: { draggable: Draggable}) => {
    const draggedAnime = animeWatchedList.find(anime => anime.id === draggable.id)
    setActiveItem(draggedAnime)
  };

  const onDragOver = ({ draggable, droppable }: { draggable: Draggable, droppable: Droppable }) => {
    if (draggable && droppable) {
      // const currentItems = animeWatchedList;
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

      // setAnimeWatchedList(updatedItemRanks);

      const draggedAnime = animeWatchedList.find(anime => anime.id === draggable.id)
      setActiveItem({
        ...draggedAnime,
        rank: toIndex + 1
      })
    }
  }

  const onDragEnd = ({ draggable, droppable }: { draggable: Draggable, droppable: Droppable }) => {
    if (draggable && droppable) {
      const currentItems = animeWatchedList;
      const fromIndex = ids().indexOf(Number(draggable.id));
      const toIndex = ids().indexOf(Number(droppable.id));
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        const updatedItemRanks = updatedItems.map((anime, index) => ({
          ...anime,
          rank: index + 1
        }))
        
        upsertAnimeWatched(updatedItemRanks.filter((_, index) => {
          if (fromIndex < toIndex) {
            return index >= fromIndex && index <= toIndex
          }
          else {
            return index >= toIndex && index <= fromIndex
          }
        }))
        setAnimeWatchedList(updatedItemRanks);
      }
    }
  };

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <section class='grid auto-rows-auto content-center col-span-1'>
        <div class='space-y-1 max-h-[37rem] overflow-y-scroll'>
          <SortableProvider ids={ids()}>
            <For each={animeWatchedList}>
              {
                (anime) => 
                <Sortable item={anime}>
                  <Card
                    id={anime.id}
                    selectAnime={() => {
                      setSelectedAnime((currentAnime) => {
                        if (!!currentAnime && currentAnime.id === anime.id) return null;

                        return anime;
                      })
                    }}
                    japName={anime.attributes.titles.en_jp} 
                    engName={anime.attributes.titles.en}
                    poster={anime.attributes.posterImage?.tiny}
                    rank={anime.rank}
                    stars={anime.stars}
                  />
                </Sortable>
              }
            </For>
          </SortableProvider>
        </div>
      </section>
      <DragOverlay>
        <div class="sortable">
          <Show when={!!activeItem()}>
            <Card
              id={activeItem().id}
              selectAnime={() => {}}
              japName={activeItem().attributes.titles.en_jp} 
              engName={activeItem().attributes.titles.en}
              poster={activeItem().attributes.posterImage?.tiny}
              rank={activeItem().rank}
              stars={activeItem().stars}
            />
          </Show>
        </div>
      </DragOverlay>
    </DragDropProvider>
  );
};

export {activeItem}