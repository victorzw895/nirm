import { Component, createSignal } from 'solid-js';
import moment from 'moment';
import { Anime } from '../api';

const [selectedAnime, setSelectedAnime] = createSignal<Anime | Partial<Anime> | null>(null);

export interface PreviewProps {
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
        <img data-testid='poster' class='max-h-80 m-2' src={selectedAnime()?.attributes.posterImage?.small}
        />
        <div data-testid='text-content' class='ml-2'>
          <p>{selectedAnime()?.attributes.titles.en_jp}</p>
          <p class='text-xs'>{selectedAnime()?.attributes.titles.en}</p>
          <p class='text-xs'>Rating {selectedAnime()?.attributes.ageRatingGuide}</p>
          <p class='text-xs'>Release Date: {moment(selectedAnime()?.attributes.startDate).format('YYYY')}</p>
        </div>
      </div>
      <div class='ml-2 min-h-[10rem]'>
        <p>Description</p>
        <p data-testid='description' class='text-xs line-clamp-8'>{selectedAnime()?.attributes.description}</p>
      </div>
      <div class='ml-2 flex justify-evenly'>
      <button
        data-testid='watched-button'
        class={`rounded my-3 p-2 ${selectedAnime()?.isWatched ? 'bg-light text-darkest' : 'bg-dark'}`}
        onClick={props.animeWatched}
      >
        Watched
      </button>
      <button
        data-testid='next-button'
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