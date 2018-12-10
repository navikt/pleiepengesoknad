import bemHelper from '../bemHelper';

const someClass = 'class';
const someElement = 'element';
const someModifier = 'element';

describe('bemHelper', () => {
    it('should return correct className when referring to .className-property', () => {
        expect(bemHelper(someClass).className).toEqual(someClass);
    });

    it('should return element className on correct format when calling .element', () => {
        expect(bemHelper(someClass).element(someElement)).toEqual(`${someClass}__${someElement}`);
    });

    it('should return modifier className on correct format when calling .modifier', () => {
        expect(bemHelper(someClass).modifier(someModifier)).toEqual(`${someClass}--${someModifier}`);
    });
});
