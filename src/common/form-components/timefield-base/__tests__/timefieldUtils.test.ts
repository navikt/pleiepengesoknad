import utils from '../timefieldUtils';

describe('timefieldUtils', () => {
    it('converts correctly to string', () => {
        expect(utils.convertTimefieldValueToString({ hours: 12, minutes: 0 })).toEqual('12:00');
    });
    it('parses stringValue correctly', () => {
        expect(utils.parseTimefieldStringValue('12:00')).toEqual({ hours: 12, minutes: 0 });
    });
});
