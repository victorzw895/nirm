import { Component, Show, createEffect, createSignal } from 'solid-js';
export interface CardProps {
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
    <div ref={cardRef} data-testid='card' class='flex items-center bg-dark' onClick={props.selectAnime}>
      <img class='max-h-16 m-2 flex-grow-0' src={props.poster}/>
      <div class='mx-2 overflow-hidden'>
        <p data-testid='jap-name' class='truncate'>{props.japName}</p>
        <p data-testid='eng-name' class='text-xs truncate'>{props.engName}</p>
      </div>
      <Show when={props.rank}>
        <div class='ml-auto mr-3 flex-grow-0'>
          <p data-testid='rank' class='text-3xl'>{props.rank}</p>
          <p data-testid='stars' class='text-xs'>{props.stars ? props.stars : 0}</p>
        </div>
      </Show>
    </div>
  )
}

export { setFocusAnimeId };

export default Card;