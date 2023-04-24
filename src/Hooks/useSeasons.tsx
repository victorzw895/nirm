import { createSignal, onMount } from 'solid-js';
import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnimeWatched,
  Anime,
  getSeasonYears,
  AnimesByYear,
} from '../api';
import moment from 'moment';

const useSeasons = (animeList: AnimesByYear) => {
  const [seasonYears, setSeasonYears] = createSignal([]);
  const latestYear = () => seasonYears().slice(-1)[0]

  onMount(async () => {
    const seasonYears = await getSeasonYears()
    setSeasonYears(seasonYears)
  })

  const loadMore = async () => {
    const limit = 20;
    const latestYearAnimeList = animeList[latestYear().toString()];
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
        setAnimeList(latestYear().toString(), (currentAnimeList) => ([...currentAnimeList, ...upsertAnimes]))
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

  return {seasonYears, setSeasonYears, loadMore}
}

export default useSeasons;