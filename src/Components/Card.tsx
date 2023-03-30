import { Component, Show, createEffect, createSignal } from 'solid-js';

interface CardProps {
  id: number,
  japName: string,
  engName: string,
  poster: string,
  selectAnime: () => void,
  rank: number | null,
  stars: number | null,
}

const [focusAnimeId, setFocusAnimeId] = createSignal<number>()

const Card: Component<CardProps> = (props) => {
  let cardRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (!cardRef) return;
    if (focusAnimeId() === props.id) {
      cardRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  })

  return (
    <div ref={cardRef} class='flex border border-neutral-800 items-center rounded mx-1 bg-gray-50' onClick={props.selectAnime}>
      <img class='max-h-16 m-2 flex-grow-0' src={props.poster}/>
      <div class='ml-2'>
        <p>{props.japName}</p>
        <p class='text-xs'>{props.engName}</p>
      </div>
      <Show when={props.rank}>
        <div class='ml-auto mr-3 flex-grow-0'>
          <p class='text-3xl'>{props.rank}</p>
          <p class='text-xs'>{props.stars ? props.stars : 0}</p>
        </div>
      </Show>
    </div>
  )
}

export { setFocusAnimeId };

export default Card;