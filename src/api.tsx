
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const fetchAnimes = async ({limit, offset} = {limit: 7, offset: 0}) => {
    const response = await fetch(`${import.meta.env.VITE_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}`);
    return response.json();
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
    rank: number,
    stars: number,
    isWatched: boolean
}

const getAnimes = async () => {
    return await supabase
        .from('AnimeList')
        .select()
        .order('id', { ascending: true })
}

const getAnimeList = async () => {
    const env = import.meta.env.VITE_ENV;

    const { data } : { data: Partial<Anime>[] | Anime[] } = await (
        env !== 'local' ? 
            fetchAnimes()
                : 
            getAnimes()
    )

    return data;
}

const getAnimeWatchedList = async () => {
    const { data, error } = await supabase
        .from('AnimeList')
        .select()
        .eq('isWatched', true)
        .order('rank', { ascending: true });

    return data as Anime[];
}

const upsertAnimeWatched = async (anime: Anime | Anime[]) => {
    const { data, error } = await supabase
        .from('AnimeList')
        .upsert(anime)
        .select()
    
    return data as Anime[];
}

const updateAnimeWatched = async <T extends Anime>(anime: T) => {
    const { data, error } = await supabase
        .from('AnimeList')
        .update(anime)
        .eq('id', anime.id)
        .select()
    
    return data as T[];
}

export {
    fetchAnimes,
    getAnimeList,
    getAnimeWatchedList,
    upsertAnimeWatched,
    updateAnimeWatched
}