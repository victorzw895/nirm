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
  AnimesByYear,
} from '../api';
import moment from 'moment';

interface ListProps {
  animeList: AnimesByYear,
}

const List: Component<ListProps> = (props) => {
  const [showAll, setShowAll] = createSignal(false);
  const [seasonYears, setSeasonYears] = createSignal([]);
  const latestYear = () => seasonYears().slice(-1)[0]

  onMount(async () => {
    const seasonYears = await getSeasonYears()
    setSeasonYears(seasonYears)
  })

  const getList = (year: number) => {
    if (showAll()) {
      return props.animeList[year.toString()] || []
    }
    else {
      return (props.animeList[year.toString()] || [] ).filter(anime => !anime.isWatched)
    }
  }


  const loadMore = async () => {
    const limit = 20;
    const latestYearAnimeList = props.animeList[latestYear().toString()];
    const offset = latestYearAnimeList && latestYearAnimeList.length ?
      latestYearAnimeList.filter(anime => anime.seasonYear === latestYear()).length
      : 0;
    const moreAnimes = await fetchAnimes({limit, offset, year: latestYear()});

    if (moreAnimes.data.length) {
      const upsertAnimes = (await upsertAnimeWatched(
        moreAnimes.data.map((anime: Partial<Anime>) => ({
          id: anime.id,
          attributes: anime.attributes,
          stars: 0,
          isWatched: false,
          seasonYear: latestYear()
        }))
      ))
  
      if (latestYearAnimeList && latestYearAnimeList.length) {
        setAnimeList(latestYear().toString(), (animeList) => ([...animeList, ...upsertAnimes]))
      }
      else {
        setAnimeList((animeByYears) => ({
          ...animeByYears,
          [latestYear().toString()]: upsertAnimes
        }))
      }
    }

    if (limit + offset <= moreAnimes.meta.count) return;
    if (latestYear() === moment().year()) return;

    setSeasonYears((years) => [...years, latestYear() + 1])
  }

  return (
    <section class='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div class='box-border pt-3 px-3 h-full'>
        <div class='tabs'>
          <button class={`tab tab-lifted font-bold ${showAll() ? 'tab-active' : ''}`} onClick={() => setShowAll(true)}>All</button>
          <button class={`tab tab-lifted font-bold ${!showAll() ? 'tab-active' : ''}`} onClick={() => setShowAll(false)}>Unwatched</button>
        </div>
        <div class='space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem]'>
          <Dynamic component={() => 
            <For each={seasonYears()} fallback={<div>Loading...</div>}> 
              {
                (year) => 
                <div class={`collapse collapse-arrow bg-dark items-center`}>
                  <input type="checkbox" /> 
                  <div class="collapse-title text-xl font-medium">
                    {year}
                  </div>
                  <div class="space-y-1 collapse-content px-0 bg-light"> 
                    <For each={getList(year)}> 
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
      </div>
    </section>
  )
}

export default List;