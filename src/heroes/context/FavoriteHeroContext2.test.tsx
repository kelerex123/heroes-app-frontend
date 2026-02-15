import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const localStorageMock = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

const mockHeroe = {
    id: '1',
    name: 'batman',
} as Hero;

const TestComponent = () => {

    const { favoriteCount, favorites, isFavorite, toggleFavorite } = use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid="favorite-count">{favoriteCount}</div>
            <div data-testid="favorites-list">
                {
                    favorites.map(hero => (
                        <div key={hero.id} data-testid={`hero-${hero.id}`}>
                            {hero.name}
                        </div>
                    ))
                }
            </div>

            <button data-testid='toggle-favorite'
                onClick={() => toggleFavorite(mockHeroe)}
            >
                Toggle Favorite
            </button>

            <div data-testid="is-favorite">
                {isFavorite(mockHeroe).toString()}
            </div>

        </div>
    )
}

describe('FavoriteHeroContext', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('should initialize with default values', () => {

        render(<FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>)

        expect(screen.getByTestId('favorite-count').textContent).toBe('0')
        expect(screen.getByTestId('favorites-list').children.length).toBe(0)

    })

    test('should add hero to favorites when toggleFavorite is called with new Hero', () => {

        render(<FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>)

        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('1')
        expect(screen.getByTestId('favorites-list').children.length).toBe(1)
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', "[{\"id\":\"1\",\"name\":\"batman\"}]");
    })


    test('should remove heroes to favorites when toggleFavorite is called with initial data in localStorage', () => {

        localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHeroe]))

        render(<FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>)

        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);


        expect(screen.getByTestId('favorite-count').textContent).toBe('0')
        expect(screen.getByTestId('favorites-list').children.length).toBe(0);
        expect(screen.queryByTestId('hero-1')).toBeNull();
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]');
    })

})