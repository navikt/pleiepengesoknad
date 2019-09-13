import * as React from 'react';
import { render } from '@testing-library/react';
import ContentSwitcher from '../ContentSwitcher';

const firstContent = 'First content';
const firstContentFn = () => <p>{firstContent}</p>;
const secondContent = 'Second content';
const secondContentFn = () => <p>{secondContent}</p>;

describe('ContentSwitcher', () => {
    it('should switch correctly between rendering the two content functions based on "showFirstContent"', () => {
        const { getByText, queryByText, rerender } = render(
            <ContentSwitcher firstContent={firstContentFn} secondContent={secondContentFn} showFirstContent={true} />
        );
        expect(getByText(firstContent)).toBeTruthy();
        expect(queryByText(secondContent)).toBeNull();
        rerender(
            <ContentSwitcher firstContent={firstContentFn} secondContent={secondContentFn} showFirstContent={false} />
        );
        expect(getByText(secondContent)).toBeTruthy();
        expect(queryByText(firstContent)).toBeNull();
    });
});
