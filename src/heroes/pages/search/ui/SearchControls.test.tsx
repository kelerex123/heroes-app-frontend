import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    window.ResizeObserver = ResizeObserver;
}

const renderSearchControls = (initialEntries: string[] = ["/"]) => {

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <SearchControls />
        </MemoryRouter>
    )

}

describe('SearchControls', () => {

    test('should render with default values', () => {

        const { container } = renderSearchControls();

        expect(container).toMatchSnapshot();

    })

    test('should set input value when search param name is set', () => {

        renderSearchControls(["/?name=batman"]);

        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');

        expect(input.getAttribute('value')).toBe('batman');

    })

    test('should change params when input is changed and enter is pressed', () => {

        renderSearchControls(["/?name=batman"]);

        const input = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');

        fireEvent.change(input, { target: { value: 'superman' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(input.getAttribute('value')).toBe('superman');

    })

    test('should change params strength when slider is changed', () => {

        renderSearchControls(["/?name=batman&active-accordion=advance-filters"]);

        const slider = screen.getByRole('slider')

        fireEvent.keyDown(slider, { key: 'ArrowRight' });

        expect(slider.getAttribute('aria-valuenow')).toBe('1')

    })

    test('should accordion be open when active-accordion param is set', () => {

        renderSearchControls(["/?name=batman&active-accordion=advance-filters"]);

        const accordion = screen.getByTestId('accordion')

        const accordionItem = accordion.querySelector('div');

        expect(accordionItem?.getAttribute('data-state')).toBe('open')

    })

    test('should accordion be close when active-accordion param is not set', () => {

        renderSearchControls(["/?name=batman"]);

        const accordion = screen.getByTestId('accordion')

        const accordionItem = accordion.querySelector('div');

        expect(accordionItem?.getAttribute('data-state')).toBe('closed')

    })

})