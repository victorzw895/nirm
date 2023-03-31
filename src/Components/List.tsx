import { Component, For, createSignal, Switch, Match, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Card from './Card';
import { setSelectedAnime } from './Preview';
import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnimeWatched,
  Anime,
  getSeasonYears,
} from '../api';
import moment from 'moment';

interface ListProps {
  animeList: Anime[] | Partial<Anime>[],
}

const List: Component<ListProps> = (props) => {
  const [showAll, setShowAll] = createSignal(false);
  const [seasonYears, setSeasonYears] = createSignal([]);
  const latestYear = () => seasonYears().slice(-1)[0]

  onMount(async () => {
    setSeasonYears(await getSeasonYears())
  })

  const getList = () => {
    if (showAll()) {
      return props.animeList
    }
    else {
      return props.animeList.filter(anime => !anime.isWatched)
    }
  }

  const loadMore = async () => {
    const limit = 20;
    const offset = props.animeList.filter(anime => anime.seasonYear === latestYear()).length;
    const moreAnimes = await fetchAnimes({limit, offset, year: latestYear()});

    if (moreAnimes.data.length === 0) return;

    const upsertAnimes = (await upsertAnimeWatched(
      moreAnimes.data.map((anime: Partial<Anime>) => ({
        id: anime.id,
        attributes: anime.attributes,
        stars: 0,
        isWatched: false,
        seasonYear: latestYear()
      }))
    ))

    setAnimeList((animeList) => ([...animeList, ...upsertAnimes]))

    if (limit + offset <= moreAnimes.meta.count) return;
    if (latestYear() === moment().year()) return;

    setSeasonYears((years) => [...years, latestYear() + 1])
  }

  return (
    <section class='grid auto-rows-auto content-center col-span-1'>
      <div>
        <button onClick={() => setShowAll(true)}>All</button>
        <button onClick={() => setShowAll(false)}>Unwatched</button>
      </div>
      <div class='space-y-1 max-h-[37rem] overflow-y-scroll'>
        <Dynamic component={() => 
          <For each={seasonYears()}> 
            {
              (year) => 
              <div class={`collapse collapse-arrow border border-base-300 bg-base-100 rounded-box`}>
                <input type="checkbox" /> 
                <div class="collapse-title text-xl font-medium">
                  {year}
                </div>
                <div class="collapse-content"> 
                  <For each={getList().filter(anime => anime.seasonYear === year)}> 
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
                        poster={anime.attributes.posterImage?.tiny}
                        rank={null}
                        stars={null}
                      />
                    }
                  </For>
                </div>
              </div>
            }
          </For>
        } />
      </div>
      <button class='block mx-auto my-3' onClick={loadMore}>Load More</button>
    </section>
  )
}

export default List;