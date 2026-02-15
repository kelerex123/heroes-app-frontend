import { describe, expect, test } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

describe('CustomPagination', () => {

    test('should render component with default values', () => {

        render(<>
            <MemoryRouter>
                <CustomPagination totalPages={5} />
            </MemoryRouter>
        </>);

        expect(screen.getByText('Anterior')).toBeDefined();
        expect(screen.getByText('Siguiente')).toBeDefined();
    })

    test('should disabled previous button when page is 1', () => {
        render(<>
            <MemoryRouter>
                <CustomPagination totalPages={5} />
            </MemoryRouter>
        </>);

        expect(screen.getByText('Anterior').getAttribute('disabled')).not.toBeNull();
    })

    test('should disabled next button when page is the last', () => {
        render(<>
            <MemoryRouter initialEntries={['/?page=5']}>
                <CustomPagination totalPages={5} />
            </MemoryRouter>
        </>);

        expect(screen.getByText('Siguiente').getAttribute('disabled')).not.toBeNull();
    })

    test('should disabled button 3 when we are in page 3', () => {
        render(<>
            <MemoryRouter initialEntries={['/?page=3']}>
                <CustomPagination totalPages={10} />
            </MemoryRouter>
        </>);

        expect(screen.getByText('3').getAttribute('data-variant')).toBe("default");
        expect(screen.getByText('2').getAttribute('data-variant')).toBe("outline");
    })

    test('should go to the page that we clicked', () => {
        render(<>
            <MemoryRouter initialEntries={['/?page=3']}>
                <CustomPagination totalPages={10} />
            </MemoryRouter>
        </>);

        const button4 = screen.getByText('4');

        fireEvent.click(button4)

        expect(screen.getByText('4').getAttribute('data-variant')).toBe('default');
        expect(screen.getByText('3').getAttribute('data-variant')).toBe('outline');

    })

})