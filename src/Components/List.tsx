import { Component, For, Show } from 'solid-js';
import Card from './Card';
import { setSelectedAnime } from './Preview';
import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnimeWatched,
} from '../api';

interface ListProps {
  animeList: any[],
  watchedList?: boolean
}

const List: Component<ListProps> = (props) => {
  const loadMore = async () => {
    const limit = 7;
    const moreAnimes = await fetchAnimes({limit, offset: props.animeList.length + limit});

    if (moreAnimes.data.length === 0) return;

    const upsertAnimes = (await upsertAnimeWatched(
      moreAnimes.data.map(anime => ({
        id: anime.id,
        attributes: anime.attributes,
        stars: 0,
        isWatched: false
      }))
    ))

    setAnimeList((animeList) => ([...animeList, ...upsertAnimes]))
  }

  return (
    <section class='grid auto-rows-auto content-center col-span-1'>
      <div class='space-y-1 max-h-[37rem] overflow-y-scroll'>
        {/* TODO filter all / unwatched */}
        <For each={props.animeList}> 
          {
            (anime) => 
            <Card
              selectAnime={() => {
                setSelectedAnime((currentAnime) => {
                  if (!!currentAnime && currentAnime.id === anime.id) return null;

                  return anime;
                })
              }}
              japName={anime.attributes.titles.en_jp} 
              engName={anime.attributes.titles.en}
              poster={anime.attributes.posterImage.tiny}
              rank={props.watchedList ? anime.rank : null}
              stars={props.watchedList ? anime.stars : null}
            />
          }
        </For>
      </div>
      <Show when={!props.watchedList}>
        <button class='block mx-auto my-3' onClick={loadMore}>Load More</button>
      </Show>
    </section>
  )
}

export default List;