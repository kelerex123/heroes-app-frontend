import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";


vi.mock("@/heroes/hooks/usePaginatedHero")
vi.mock("@/heroes/hooks/useHeroSummary")

const mockUsePaginatedHero = vi.mocked(usePaginatedHero);
const mockUseHeroSummary = vi.mocked(useHeroSummary);

mockUsePaginatedHero.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    isSuccess: true,
} as unknown as ReturnType<typeof usePaginatedHero>);

mockUseHeroSummary.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    isSuccess: true,
} as unknown as ReturnType<typeof useHeroSummary>);

const renderHomePage = (initialEntries: string[] = ['/']) => {
    return render(
        <FavoriteHeroProvider>
            <MemoryRouter initialEntries={initialEntries}>
                <HomePage />
            </MemoryRouter>
        </FavoriteHeroProvider>
    )
}




describe('HomePage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('should render HomePage with default values', () => {

        const { container } = renderHomePage();

        expect(container).toMatchSnapshot();

    })

    test('should call usePaginatedHero with default values', () => {

        renderHomePage();

        expect(usePaginatedHero).toHaveBeenCalledWith("1", "6", "all");

    })

    test('should call usePaginatedHero with custom query params', () => {

        renderHomePage(["/?page=2&limit=10&category=villain"]);

        expect(usePaginatedHero).toHaveBeenCalledWith("2", "10", "villain");

    })

    test('should called usePaginatedHero with default page and same limit on tab clicked', () => {

        renderHomePage(["/?tab=favorite&page=2&limit=10"]);

        const [, , , villainsTab] = screen.getAllByRole('tab');

        fireEvent.click(villainsTab);

        expect(usePaginatedHero).toHaveBeenCalledWith("1", "10", "villain");

    })

})