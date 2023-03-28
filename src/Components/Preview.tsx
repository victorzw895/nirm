import { Component, createSignal } from 'solid-js';

const [selectedAnime, setSelectedAnime] = createSignal<any>(null);

interface PreviewProps {
  animeWatched: () => void,
  nextAnime: () => void,
}

const Preview: Component<PreviewProps> = (props) => {
  return (
    <section class='grid auto-rows-auto content-center col-span-2'>
      <div class='flex items-center mx-1'>
        <img class='max-h-80 m-2' src={
          selectedAnime()?.attributes ? 
            selectedAnime()?.attributes.posterImage.small
              :
            selectedAnime()?.poster_small
          }
        />
        <div class='ml-2'>
          <p>{
            selectedAnime()?.attributes ? 
              selectedAnime()?.attributes.titles.en_jp
                :
              selectedAnime()?.title_jap
          }</p>
          <p class='text-xs'>{
            selectedAnime()?.attributes ? 
              selectedAnime()?.attributes.titles.en
                :
              selectedAnime()?.title_en
          }</p>
        </div>
      </div>
      <div class='ml-2'>
        <p>Description</p>
        <p class='text-xs'>{
          selectedAnime()?.attributes ? 
            selectedAnime()?.attributes.description
              :
            selectedAnime()?.description
        }</p>
      </div>
      <div class='ml-2 flex justify-evenly'>
      <button
        class={`border rounded my-3 p-2 ${selectedAnime()?.isWatched ? 'bg-gray-400 border-gray-400' : 'border-neutral-800'}`}
        onClick={props.animeWatched}
      >
        Watched
      </button>
      <button
        class={`border rounded my-3 p-2 border-neutral-800`}
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