import { Component, onMount, createSignal, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import List from './Components/List';
import Preview, { selectedAnime, setSelectedAnime } from './Components/Preview';
import { SortableWatchedAnimeList } from './Components/WatchedList';
import {
  getAnimeList,
  getAnimeWatchedList,
  insertAnime,
  AnimesByYear,
  upsertAnimeWatched,
  Anime,
} from './api';
import { setFocusAnimeId } from './Components/Card';

const [animeList, setAnimeList] = createStore<AnimesByYear>({});
const [animeWatchedList, setAnimeWatchedList] = createStore<Anime[]>([]);

const App: Component = () => {
  onMount(async () => {
    const animeList = await getAnimeList()
    setAnimeList(animeList)
    
    const watchedAnimeList = await getAnimeWatchedList()
    setAnimeWatchedList(watchedAnimeList)
  })

  const handleAnimeWatched = async () => {
    const updatedAnime = {
      id: selectedAnime().id,
      attributes: selectedAnime().attributes,
      rank: selectedAnime().isWatched ? null : animeWatchedList.length + 1,
      stars: 0,
      isWatched: !selectedAnime().isWatched,
      seasonYear: selectedAnime().seasonYear,
    }

    const upsertedAnime = (await upsertAnimeWatched(updatedAnime))[0]
    const currentSeason = updatedAnime.seasonYear;

    let updatedWatchedList = [];
    if (upsertedAnime.isWatched) {
      setFocusAnimeId(upsertedAnime.id)
      const nextAnimeIndex = animeList[currentSeason.toString()].findIndex(anime => anime.id === selectedAnime().id) + 1;
      // const nextAnimeIndex = animeList.findIndex(anime => anime.id === selectedAnime().id) + 1;
      if (nextAnimeIndex < animeList[currentSeason.toString()].length) {
        setSelectedAnime(animeList[currentSeason.toString()][nextAnimeIndex]);
      }
      else if ((currentSeason + 1).toString() in animeList) {
        setSelectedAnime(animeList[(currentSeason + 1).toString()][0]);
      }

      updatedWatchedList = [...animeWatchedList, upsertedAnime]
      // .sort((a, b) => a.rank - b.rank)
    }
    else {
      setSelectedAnime(null)
      updatedWatchedList = animeWatchedList
        .filter(anime => anime.id !== upsertedAnime.id)
        // .sort((a, b) => a.rank - b.rank)
    }

    // setAnimeList((anime) => anime.id === updatedAnime.id, 'isWatched', (isWatched) => !isWatched)
    setAnimeList(currentSeason.toString(), (anime) => anime.id === updatedAnime.id, 'isWatched', (isWatched) => !isWatched)
    setAnimeWatchedList(updatedWatchedList)
  }

  return (
    <>
      <p class="text-2xl text-green-700 text-center py-10">App</p>
      <main class={`grid ${!!selectedAnime() ? 'grid-cols-4' : 'grid-cols-2'} gap-2 items-start h-full`}>
        <List animeList={animeList} />
        <Show when={!!selectedAnime()}>
          <Preview
            animeWatched={handleAnimeWatched}
            nextAnime={() => {
             const currentSeason = selectedAnime().seasonYear;
              const nextAnimeIndex = animeList[currentSeason.toString()].findIndex(anime => anime.id === selectedAnime().id) + 1;
              if (nextAnimeIndex < animeList[currentSeason.toString()].length) {
                const nextAnime = animeList[currentSeason.toString()][nextAnimeIndex];
                setFocusAnimeId(nextAnime.id)
                setSelectedAnime(nextAnime);
              }
              else if ((currentSeason + 1).toString() in animeList) {
                const nextAnime = animeList[(currentSeason + 1).toString()][0];
                setFocusAnimeId(nextAnime.id)
                setSelectedAnime(nextAnime);
              }
            }}
          />
        </Show>
        <SortableWatchedAnimeList />
      </main>
    </>
  );
};

export {animeList, setAnimeList, animeWatchedList, setAnimeWatchedList}

export default App;
