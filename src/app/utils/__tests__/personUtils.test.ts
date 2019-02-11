import { formatName } from '../personUtils';

describe('formatName', () => {
    it('should format navn containing only fornavn and etternavn correctly', () => {
        expect(formatName('Ola', 'Nordmann')).toBe('Ola Nordmann');
    });

    it('should format navn containing fornavn, etternavn and mellomnavn correctly', () => {
        expect(formatName('Ola', 'Nordmann', 'Foobar')).toBe('Ola Foobar Nordmann');
    });
});
