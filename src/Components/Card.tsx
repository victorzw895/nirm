import { Component, Show } from 'solid-js';

interface CardProps {
  japName: string,
  engName: string,
  poster: string,
  selectAnime: () => void,
  rank: number | null,
  stars: number | null,
}

const Card: Component<CardProps> = (props) => {
  return (
    <div class='flex border border-neutral-800 items-center rounded mx-1 bg-gray-50' onClick={props.selectAnime}>
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

export default Card;