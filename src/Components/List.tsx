import { Component, For, createSignal, Switch, Match } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Card from './Card';
import { setSelectedAnime } from './Preview';
import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnimeWatched,
  Anime,
} from '../api';

interface ListProps {
  animeList: Anime[] | Partial<Anime>[],
}

const List: Component<ListProps> = (props) => {
  const [showAll, setShowAll] = createSignal(false);

  const getList = () => {
    if (showAll()) {
      return props.animeList
    }
    else {
      return props.animeList.filter(anime => !anime.isWatched)
    }
  }

  const loadMore = async () => {
    const limit = 7;
    const moreAnimes = await fetchAnimes({limit, offset: props.animeList.length + limit});

    if (moreAnimes.data.length === 0) return;

    const upsertAnimes = (await upsertAnimeWatched(
      moreAnimes.data.map((anime: Partial<Anime>) => ({
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
      <div>
        <button onClick={() => setShowAll(true)}>All</button>
        <button onClick={() => setShowAll(false)}>Unwatched</button>
      </div>
      <div class='space-y-1 max-h-[37rem] overflow-y-scroll'>
        {/* TODO filter all / unwatched */}
        <Dynamic component={() =>
          <For each={getList()}> 
            {
              (anime) => 
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
                poster={anime.attributes.posterImage.tiny}
                rank={null}
                stars={null}
              />
            }
          </For>
        } />
      </div>
      <button class='block mx-auto my-3' onClick={loadMore}>Load More</button>
    </section>
  )
}

export default List;