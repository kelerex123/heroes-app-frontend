import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from '@testing-library/react';
import { useHeroSummary } from "./useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { heroApi } from "../api/hero.api";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../types/summary-information.response";

vi.mock('../actions/get-summary.action', () => ({
    getSummaryAction: vi.fn(),
}))

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },

    },
})

const wrapper = ({ children }: PropsWithChildren) => (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)

describe('useHeroSummary', () => {

    beforeAll(() => {
        heroApi.defaults.adapter = 'http';
    });

    beforeEach(() => {
        queryClient.clear()
    })

    test('should return the initial state (isLoading)', () => {

        const mockSummaryData = {
            totalHeroes: 10,
        } as SummaryInformationResponse

        mockGetSummaryAction.mockResolvedValue(mockSummaryData)

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper,
        });

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();
    })

    test('should return success state with data when API call succeeds', async () => {

        const mockSummaryData = {
            totalHeroes: 10,
            strongestHero: {
                id: '1',
                name: 'superman'
            },
            smartestHero: {
                id: '2',
                name: 'Batman',
            },
            heroCount: 18,
            villainCount: 7,
        } as SummaryInformationResponse

        mockGetSummaryAction.mockResolvedValue(mockSummaryData)

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        })


        expect(result.current.data).toStrictEqual(mockSummaryData)

    })

    test('should return error state if API call fails', async () => {

        const mockError = new Error('Failed to fetch summary')

        mockGetSummaryAction.mockRejectedValue(mockError)

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.isError).toBeTruthy();
        })

        expect(result.current.error).toBeTruthy();
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.error?.message).toBe(mockError.message);

    })

})