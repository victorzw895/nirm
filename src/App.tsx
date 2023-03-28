import { Component, onMount, createSignal, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import List from './Components/List';
import Preview, { selectedAnime, setSelectedAnime } from './Components/Preview';
import { SortableWatchedAnimeList } from './Components/WatchedList';
import {
  getAnimeList,
  getAnimeWatchedList,
  upsertAnimeWatched,
} from './api';

const [animeList, setAnimeList] = createSignal([]);
const [animeWatchedList, setAnimeWatchedList] = createStore([]);

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
      rank: animeWatchedList.length + 1,
      stars: 0,
      isWatched: !selectedAnime().isWatched
    }

    const upsertAnime = (await upsertAnimeWatched(anime))[0]

    let updatedWatchedList = [];
    if (upsertAnime.isWatched) {
      setSelectedAnime(animeList()[selectedAnime().id])
      updatedWatchedList = [...animeWatchedList, upsertAnime].sort((a, b) => a.rank - b.rank)
    }
    else {
      setSelectedAnime(upsertAnime)
      updatedWatchedList = animeWatchedList
        .filter(anime => anime.id !== upsertAnime.id)
        .sort((a, b) => a.rank - b.rank)
    }

    setAnimeWatchedList(updatedWatchedList)
  }

  return (
    <>
      <p class="text-2xl text-green-700 text-center py-10">App</p>
      <main class={`grid ${!!selectedAnime() ? 'grid-cols-4' : 'grid-cols-2'} gap-2 items-start`}>
        <List animeList={animeList()} />
        <Show when={!!selectedAnime()}>
          <Preview
            animeWatched={handleAnimeWatched}
            nextAnime={() => {
              const nextAnimeIndex = animeList().findIndex(anime => anime.id === selectedAnime().id) + 1;
              if (nextAnimeIndex === animeList().length) return

              setSelectedAnime(animeList()[nextAnimeIndex]);
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
