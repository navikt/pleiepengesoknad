import intlHelper from '../intlUtils';

export const intlForTests = {
    formatMessage: jest.fn((a: any, b: any) => a + b)
};

describe('intlUtils', () => {
    it('should call formatMessage with provided parameters and return result', () => {
        const p2 = { v: 'arg2' };
        intlHelper(intlForTests as any, 'p1', p2);
        expect(intlForTests.formatMessage).toHaveBeenCalledWith({ id: 'p1' }, p2);
    });
});
