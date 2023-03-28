
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const fetchAnimes = async ({limit, offset} = {limit: 7, offset: 0}) => {
    const response = await fetch(`${import.meta.env.VITE_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}`);
    return response.json();
}


const getAnimeList = async () => {
    const env = import.meta.env.VITE_ENV;

    const { data } = await (
        env !== 'local' ? 
            fetchAnimes()
                : 
            supabase
                .from('AnimeList')
                .select()
                .order('id', { ascending: true })
    )

    return data;
}

const getAnimeWatchedList = async () => {
    const { data, error } = await supabase
        .from('AnimeList')
        .select()
        .eq('isWatched', true)
        .order('rank', { ascending: true });

    console.log('data', data, error)

    return data;
}

const upsertAnimeWatched = async (anime) => {
    const { data, error } = await supabase
        .from('AnimeList')
        .upsert(anime)
        .select()
    
    return data;
}

const updateAnimeWatched = async (anime) => {
    const { data, error } = await supabase
        .from('AnimeList')
        .update(anime)
        .eq('id', anime.id)
        .select()
    
    return data;
}

export {
    fetchAnimes,
    getAnimeList,
    getAnimeWatchedList,
    upsertAnimeWatched,
    updateAnimeWatched
}