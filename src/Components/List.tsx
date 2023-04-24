import { Component, For, createSignal, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Card from './Card';
import { setSelectedAnime } from './Preview';
import {
  getSeasonYears,
  AnimesByYear,
} from '../api';
import useSeasons from '../Hooks/useSeasons';

export interface ListProps {
  animeList: AnimesByYear,
}

const List: Component<ListProps> = (props) => {
  const [showAll, setShowAll] = createSignal(false);
  const { seasonYears, setSeasonYears, loadMore } = useSeasons(props.animeList);

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

  return (
    <section class='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div class='box-border pt-3 px-3 h-full'>
        <div class='tabs'>
          <button class={`tab tab-lifted font-bold ${showAll() ? 'tab-active' : ''}`} onClick={() => setShowAll(true)}>All</button>
          <button class={`tab tab-lifted font-bold ${!showAll() ? 'tab-active' : ''}`} onClick={() => setShowAll(false)}>Unwatched</button>
        </div>
        <div class='space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem]'>
          <Dynamic component={() => 
            <For each={seasonYears()} fallback={<div data-testid='loading'>Loading...</div>}> 
              {
                (year) => 
                <div class='collapse collapse-arrow bg-dark items-center'>
                  <input type="checkbox" /> 
                  <div data-testid='grouped-by-year' class="collapse-title text-xl font-medium">
                    {year}
                  </div>
                  <div data-testid='anime-list' class="space-y-1 collapse-content px-0 bg-light"> 
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