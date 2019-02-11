import intlHelper from '../intlUtils';

const intl = {
    formatMessage: jest.fn((a: any, b: any) => a + b)
};

describe('intlUtils', () => {
    it('should call formatMessage with provided parameters and return result', () => {
        const p2 = { v: 'arg2' };
        intlHelper(intl as any, 'p1', p2);
        expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'p1' }, p2);
    });
});
