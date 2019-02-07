import { removeElementFromArray } from '../listUtils';

const obj1 = { a: 1 };
const obj2 = { b: 2 };

describe('listUtils', () => {
    describe('removeElementFromArray', () => {
        it('should remove the specified element from array and return the resulting array', () => {
            const originalArray = [obj1, obj2];
            const resultingArray = removeElementFromArray(obj2, originalArray);
            expect(resultingArray.length).toBe(1);
            expect(resultingArray.indexOf(obj2)).toBe(-1);
        });
    });
});
