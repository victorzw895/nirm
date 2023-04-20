import {
  animeRankedList,
  setAnimeRankedList,
} from '../App';
import Card from '../Components/Card';
import withSortableList, { SortableListProps, DraggableItemProps } from '../HOC/withSortableList';
import { setSelectedAnime } from '../Components/Preview';
import { JSXElement, Component, createEffect } from "solid-js";
import { upsertAnimeWatched, Anime } from '../api';

const SortableCard = (props: DraggableItemProps<Anime>) => {
  return (
    <Card
      id={props.item.id}
      selectAnime={() => 
        props.overlay ? 
          {}
          : 
          setSelectedAnime((currentAnime) => {
            if (!!currentAnime && currentAnime.id === props.item.id) return null;

            return props.item;
          })
      }
      japName={props.item.attributes.titles.en_jp} 
      engName={props.item.attributes.titles.en}
      poster={props.item.attributes.posterImage?.tiny}
      rank={props.item.rank}
      stars={props.item.stars}
    />
  )
}

const WatchedList = (props: SortableListProps) => {
  createEffect(() => {
    upsertAnimeWatched(props.updatedValues)
  })

  return (
    <section class='col-span-1'>
      <div class='box-border pt-3 px-3 h-full'>
        <div class='tabs'>
          <button class={`tab tab-lifted font-bold ${true ? 'tab-active' : ''}`} onClick={() => {}}>Ranked</button>
          <button class={`tab tab-lifted font-bold ${!true ? 'tab-active' : ''}`} onClick={() => {}}>WatchList</button>
        </div>
        <div class='space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
          {props.draggableContainer(SortableCard)}
        </div>
      </div>
    </section>
  )
}


const SortableWatchedList = () => {
  const AnimeSortableList = withSortableList<Anime>(WatchedList, animeRankedList, setAnimeRankedList)

  return (
    <AnimeSortableList />
  )
}


export default SortableWatchedList;
