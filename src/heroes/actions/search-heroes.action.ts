import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

interface Options {
    name?: string;
    team?: string;
    category?: string;
    universe?: string;
    status?: string;
    strength?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const searchHeroesAction = async ({ name = '', team, category, universe, status, strength }: Options): Promise<Hero[]> => {

    if (!name && !team && !category && !universe && !status && (!strength || strength === '0')) return [];

    const { data: heroesResponse } = await heroApi.get<Hero[]>('/search', {
        params: {
            name,
            team,
            category,
            universe,
            status,
            strength,
        }
    });

    const heroes = heroesResponse.map(hero => ({
        ...hero,
        image: `${BASE_URL}/images/${hero.image}`
    }))

    return [
        ...heroes
    ];
} 