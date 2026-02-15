import { beforeEach, describe, expect, test } from "vitest";
import { heroApi } from "../api/hero.api";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";

import AxiosMockAdapter from "axios-mock-adapter";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('getHeroesByPageAction', () => {

    // beforeAll(() => {
    //     heroApi.defaults.adapter = 'http';
    // });

    const heroesApiMock = new AxiosMockAdapter(heroApi);

    beforeEach(() => {
        heroesApiMock.reset();
    });

    test('should return default heroes', async () => {

        heroesApiMock.onGet('/').reply(200, {
            total: 10,
            pages: 2,
            heroes: [
                {
                    image: '1.jpg',
                },
                {
                    image: '2.jpg',
                },
            ]
        });
        const result = await getHeroesByPageAction(1);

        expect(result).toStrictEqual({
            total: 10,
            pages: 2,
            heroes: [
                {
                    image: `${BASE_URL}/images/1.jpg`,
                },
                {
                    image: `${BASE_URL}/images/2.jpg`,
                },
            ]
        })

    })

    test('should return the correct heroes when page is not a number', async () => {

        const responseObject = {
            total: 10,
            pages: 1,
            heroes: [],
        }

        heroesApiMock.onGet('/').reply(200, responseObject);

        await getHeroesByPageAction('asda' as unknown as number);

        const params = heroesApiMock.history[0].params;

        expect(params.offset).toBe(0);

    })

    test('should call the api with the correct params', async () => {

        const responseObject = {
            total: 10,
            pages: 1,
            heroes: [],
        }

        const page = 2;
        const limit = 10;
        const category = 'all';

        heroesApiMock.onGet('/').reply(200, responseObject);

        await getHeroesByPageAction(page, limit, category);

        const params = heroesApiMock.history[0].params;

        expect(params.offset).toBe(limit * (page - 1));
        expect(params.limit).toBe(limit);
        expect(params.category).toBe(category);
    })

})