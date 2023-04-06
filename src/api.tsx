import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const fetchAnimes = async ({limit, offset, year} = {limit: 20, offset: 0, year: 2000}) => {
    const response = await fetch(`${import.meta.env.VITE_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}&filter[season_year]=${year}&sort=createdAt`);
    return await response.json();
}

type ImageSizes = 'original' | 'tiny' | 'small' | 'medium' | 'large'
interface Images extends Record<ImageSizes, string> {
    meta: {
        dimensions: Record<ImageSizes, {
            width: number,
            height: number
        }>
    }
}

export interface Anime {
    id: number,
    attributes: {
        'createdAt': string,
        'updatedAt': string,
        'slug': string,
        'synopsis': string,
        'description': string,
        'coverImageTopOffset': number,
        'titles': Record<'en' | 'en_jp' | 'ja_jp', string>,
        'canonicalTitle': string,
        'abbreviatedTitles': string[],
        'averageRating': string,
        'ratingFrequencies': Record<string, string>,
        'userCount': number,
        'favoritesCount': number,
        'startDate': string,
        'endDate': string,
        'nextRelease': null,
        'popularityRank': number,
        'ratingRank': number,
        'ageRating': string,
        'ageRatingGuide': string,
        'subtype': string,
        'status': string,
        'tba': null,
        'posterImage': Images,
        'coverImage': Images,
        'episodeCount': number,
        'episodeLength': number,
        'totalLength': number,
        'youtubeVideoId': string,
        'showType': string,
        'nsfw': boolean
    },
    rank: number | null,
    stars: number,
    isWatched: boolean,
    seasonYear: number,
    watchlist: boolean,
}

const getSeasonYears = async () => {
    let { data }: { data: number[]} = await supabase
        .rpc('getseasonyears')

    return data;
}

export type AnimesByYear = Record<string, Anime[]>

const getAnimesByYear = async (year: number) => {
    const { data } = await supabase
        .from('AnimeList')
        .select()
        .eq('seasonYear', year)
        .order('id', { ascending: true })
    
    return data as Anime[];
}

const getAllAnimes = async () => {
    const dbSeasonYears = await getSeasonYears()
    const animes = await Promise.all(dbSeasonYears.map(async (year) => await getAnimesByYear(year)))

    const animesByYear: {[x: string]: Anime[]} = dbSeasonYears.reduce((acc, year, index) => ({
        ...acc,
        [year.toString()]: animes[index]
    }), {})

    return animesByYear;
}

const getAnimeList = async () => {
    let data: AnimesByYear;
    const dbAnimes = await getAllAnimes();

    if (dbAnimes && Object.keys(dbAnimes).length) {
        data = dbAnimes
    }
    else {
        const { data: fetchInitialAnimesData }: {data: Partial<Anime>[]} = await fetchAnimes()

        data = {
            '2000': fetchInitialAnimesData.map(anime => 
                ({
                    id: anime.id,
                    attributes: anime.attributes,
                    rank: null,
                    stars: 0,
                    isWatched: false,
                    seasonYear: 2000,
                }) as Anime
            )
        }
        
        insertAnime(data['2000'])
    };

    return data;
}

const getAnimeRankedList = async () => {
    const { data } = await supabase
        .from('AnimeList')
        .select()
        .eq('isWatched', true)
        .order('rank', { ascending: true });

    return data as Anime[];
}

const getAnimeWatchList = async () => {
    const { data } = await supabase
        .from('AnimeList')
        .select()
        .eq('watchlist', true)
        .order('rank', { ascending: true });

    return data as Anime[];
}

const insertAnime = async (anime: Anime[]) => {
    const { error } = await supabase
        .from('AnimeList')
        .insert(anime)
}

const upsertAnimeWatched = async (anime: Anime | Anime[]) => {
    const { data }: {data: Anime[]} = await supabase
        .from('AnimeList')
        .upsert(anime)
        .select()
    
    return data;
}

const updateAnimeWatched = async (anime: Anime) => {
    const { data }: {data: Anime} = await supabase
        .from('AnimeList')
        .update(anime)
        .eq('id', anime.id)
        .select()
        .single()
    
    return data;
}

export {
    fetchAnimes,
    getAnimeList,
    getAnimeRankedList,
    getSeasonYears,
    insertAnime,
    upsertAnimeWatched,
    updateAnimeWatched
}