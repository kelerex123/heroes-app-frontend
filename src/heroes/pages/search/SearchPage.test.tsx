import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { heroApi } from "@/heroes/api/hero.api";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import type { Hero } from "@/heroes/types/hero.interface";

vi.mock('./ui/SearchControls', () => ({
    SearchControls: () => <div data-testid="search-controls"></div>
}));

vi.mock('@/heroes/actions/search-heroes.action');

const mockSearchHeroesAction = vi.mocked(searchHeroesAction);

vi.mock("@/components/custom/CustomJumbotron", () => ({
    CustomJumbotron: () => <div data-testid='custom-jumbotron'></div>
}))

vi.mock("@/heroes/components/HeroGrid", () => ({
    HeroGrid: ({ heroes }: { heroes: Hero[] }) => (<div data-testid="hero-grid">
        {
            heroes.map(hero => <div key={hero.id}>{hero.name}</div>)
        }
    </div>)
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },

    },
})

const renderSearchPage = (initialEntries: string[] = ["/"]) => {

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <QueryClientProvider client={queryClient}>
                <SearchPage />
            </QueryClientProvider>
        </MemoryRouter>
    )

}

describe('SearchPage', () => {

    beforeAll(() => {
        heroApi.defaults.adapter = 'http';
    });

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('should render searchParge with default values', () => {

        const { container } = renderSearchPage();

        expect(container).toMatchSnapshot();
        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            category: '',
            name: '',
            status: '',
            strength: '',
            team: '',
            universe: '',
        });

    })

    test('should call searchActions with strength parameter', () => {

        const { container } = renderSearchPage(['/search?strength=6']);

        expect(container).toMatchSnapshot();
        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            category: '',
            name: '',
            status: '',
            strength: '6',
            team: '',
            universe: '',
        });

    })

    test('should call searchActions with strength and name parameter', () => {

        const { container } = renderSearchPage(['/search?strength=6&name=batman']);

        expect(container).toMatchSnapshot();
        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            category: '',
            name: 'batman',
            status: '',
            strength: '6',
            team: '',
            universe: '',
        });

    })

    test('should render HeroGrid with searchResults', async () => {

        const mockHeroes = [
            {
                id: '1', name: 'Clark Kent'
            } as unknown as Hero,
            {
                id: '2', name: 'Bruce Wayne'
            } as unknown as Hero
        ]

        mockSearchHeroesAction.mockResolvedValue(mockHeroes);

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Clark Kent')).toBeDefined();
            expect(screen.getByText('Bruce Wayne')).toBeDefined();
        })

    })

})