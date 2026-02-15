import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { heroApi } from "../api/hero.api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { usePaginatedHero } from "./usePaginatedHero";
import type { PropsWithChildren } from "react";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";
import type { HeroesResponse } from "../types/get-heroes.response";

vi.mock("../actions/get-heroes-by-page.action", () => ({
    getHeroesByPageAction: vi.fn(),
}))

const mockGetHeroByPageAction = vi.mocked(getHeroesByPageAction);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },

    },
})

const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

describe('usePaginatedHero', () => {

    beforeAll(() => {
        heroApi.defaults.adapter = 'http';
    });

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    })

    test('should return the initial state(isLoading)', () => {

        const { result } = renderHook(() => usePaginatedHero("1", "6"), {
            wrapper,
        });

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();

    })

    test('should return success state with data when API call success', async () => {

        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        } as HeroesResponse;

        mockGetHeroByPageAction.mockResolvedValue(mockHeroesData)

        const { result } = renderHook(() => usePaginatedHero("1", "6"), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        })

        expect(result.current.status).toBe('success')
        expect(mockGetHeroByPageAction).toHaveBeenCalledWith(1, 6, 'all');

    })

    test('should call getHeroesByPageActions with arguments', async () => {

        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        } as HeroesResponse;

        mockGetHeroByPageAction.mockResolvedValue(mockHeroesData)

        const { result } = renderHook(() => usePaginatedHero("2", "16", 'aea'), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        })

        expect(result.current.status).toBe('success')
        expect(mockGetHeroByPageAction).toHaveBeenCalled();
        expect(mockGetHeroByPageAction).toHaveBeenCalledWith(2, 16, 'aea');

    })

})