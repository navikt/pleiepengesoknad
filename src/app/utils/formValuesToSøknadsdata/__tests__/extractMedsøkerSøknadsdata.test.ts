import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { extractMedsøkerSøknadsdata } from '../extractMedsøkerSøknadsdata';

describe('extractMedsøkerSøknadsdata', () => {
    describe('Har ikke medsøker', () => {
        it('returnerer undefined', () => {
            const result = extractMedsøkerSøknadsdata({ harMedsøker: YesOrNo.NO });
            expect(result).toBeUndefined();
        });
    });
    describe('Har medsøker', () => {
        it('returnerer harMedsøker og samtidigHjemme false', () => {
            const result = extractMedsøkerSøknadsdata({ harMedsøker: YesOrNo.YES, samtidigHjemme: YesOrNo.NO });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('harMedsøker');
            expect(result?.samtidigHjemme).toEqual(false);
        });
    });

    describe('Har medsøker og samtidigHjemme', () => {
        it('returnerer harMedsøker og samtidigHjemme tru', () => {
            const result = extractMedsøkerSøknadsdata({ harMedsøker: YesOrNo.YES, samtidigHjemme: YesOrNo.YES });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('harMedsøker');
            expect(result?.samtidigHjemme).toEqual(true);
        });
    });
});
