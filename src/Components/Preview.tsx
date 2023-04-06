import { Component, createSignal } from 'solid-js';
import moment from 'moment';
import { Anime } from '../api';

const [selectedAnime, setSelectedAnime] = createSignal<Anime | Partial<Anime> | null>(null);

interface PreviewProps {
  animeWatched: () => void,
  nextAnime: () => void,
}

// const handleNextAnime = () => {

// }

// const handlePreviousAnime = () => {

// }

// const handleWatchedAnime = () => {

// }

const Preview: Component<PreviewProps> = (props) => {
  return (
    <section class='col-span-2 self-center'>
      <div class='flex items-center mx-1'>
        <img class='max-h-80 m-2' src={selectedAnime()?.attributes.posterImage?.small}
        />
        <div class='ml-2'>
          <p>{selectedAnime()?.attributes.titles.en_jp}</p>
          <p class='text-xs'>{selectedAnime()?.attributes.titles.en}</p>
          <p class='text-xs'>Rating {selectedAnime()?.attributes.ageRatingGuide}</p>
          <p class='text-xs'>Release Date: {moment(selectedAnime()?.attributes.startDate).format('YYYY')}</p>
        </div>
      </div>
      <div class='ml-2 min-h-[10rem]'>
        <p>Description</p>
        <p class='text-xs line-clamp-8'>{selectedAnime()?.attributes.description}</p>
      </div>
      <div class='ml-2 flex justify-evenly'>
      <button
        class={`rounded my-3 p-2 ${selectedAnime()?.isWatched ? 'bg-light text-darkest' : 'bg-dark'}`}
        onClick={props.animeWatched}
      >
        Watched
      </button>
      <button
        class={`rounded my-3 p-2 bg-dark`}
        onClick={props.nextAnime}
      >
        Next
      </button>
      </div>
    </section>
  )
}

export { selectedAnime, setSelectedAnime };

export default Preview;