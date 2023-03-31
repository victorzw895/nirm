import { Component, onMount, createSignal, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import List from './Components/List';
import Preview, { selectedAnime, setSelectedAnime } from './Components/Preview';
import { SortableWatchedAnimeList } from './Components/WatchedList';
import {
  getAnimeList,
  getAnimeWatchedList,
  insertAnime,
  upsertAnimeWatched,
  Anime,
} from './api';
import { setFocusAnimeId } from './Components/Card';

const [animeList, setAnimeList] = createSignal<Anime[] | Partial<Anime>[]>([]);
const [animeWatchedList, setAnimeWatchedList] = createStore<Anime[]>([]);

const App: Component = () => {
  onMount(async () => {
    const animeList = await getAnimeList()
    setAnimeList(animeList)
    
    const watchedAnimeList = await getAnimeWatchedList()
    setAnimeWatchedList(watchedAnimeList)
  })

  const handleAnimeWatched = async () => {
    const anime = {
      id: selectedAnime().id,
      attributes: selectedAnime().attributes,
      rank: selectedAnime().isWatched ? null : animeWatchedList.length + 1,
      stars: 0,
      isWatched: !selectedAnime().isWatched,
      seasonYear: selectedAnime().seasonYear,
    }

    const upsertAnime = (await upsertAnimeWatched(anime))[0]

    let updatedWatchedList = [];
    if (upsertAnime.isWatched) {
      setFocusAnimeId(upsertAnime.id)
      const nextAnimeIndex = animeList().findIndex(anime => anime.id === selectedAnime().id) + 1;
      if (nextAnimeIndex <= animeList().length) {
        setSelectedAnime(animeList()[nextAnimeIndex]);
      }

      updatedWatchedList = [...animeWatchedList, upsertAnime].sort((a, b) => a.rank - b.rank)
    }
    else {
      setSelectedAnime(null)
      updatedWatchedList = animeWatchedList
        .filter(anime => anime.id !== upsertAnime.id)
        .sort((a, b) => a.rank - b.rank)
    }

    setAnimeList(await getAnimeList())
    setAnimeWatchedList(updatedWatchedList)
  }

  return (
    <>
      <p class="text-2xl text-green-700 text-center py-10">App</p>
      <main class={`grid ${!!selectedAnime() ? 'grid-cols-4' : 'grid-cols-2'} gap-2 items-start h-full`}>
        <List animeList={animeList()} />
        <Show when={!!selectedAnime()}>
          <Preview
            animeWatched={handleAnimeWatched}
            nextAnime={() => {
              const nextAnimeIndex = animeList().findIndex(anime => anime.id === selectedAnime().id) + 1;
              if (nextAnimeIndex === animeList().length) return;

              const nextAnime = animeList()[nextAnimeIndex];
              setFocusAnimeId(nextAnime.id)
              setSelectedAnime(nextAnime);
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
