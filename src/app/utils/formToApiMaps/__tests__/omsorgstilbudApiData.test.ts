import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Omsorgstilbud } from '../../../types/SøknadFormData';
import { mapOmsorgstilbudToApiData } from '../omsorgstilbudApiData';

const søknadsperiode: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 10),
};

const omsorgstilbud: Omsorgstilbud = {
    erIOmsorgstilbud: YesOrNo.YES,
    enkeltdager: { '2021-02-01': { hours: '1', minutes: '0' } },
    erLiktHverUke: YesOrNo.NO,
};

describe('omsorgstilbudApiData', () => {
    describe('mapOmsorgstilbudToApiData', () => {
        it('returnerer undefined dersom erIOmsorgstilbud er ulikt YES', () => {
            const result = mapOmsorgstilbudToApiData({ erIOmsorgstilbud: YesOrNo.NO }, søknadsperiode);
            expect(result).toBeUndefined();
        });
        it('returnerer undefined dersom erIOmsorgstilbud er ulikt YES', () => {
            const result = mapOmsorgstilbudToApiData({ erIOmsorgstilbud: YesOrNo.UNANSWERED }, søknadsperiode);
            expect(result).toBeUndefined();
        });
        it('returnerer undefined dersom erIOmsorgstilbud er undefined', () => {
            const result = mapOmsorgstilbudToApiData(undefined, søknadsperiode);
            expect(result).toBeUndefined();
        });

        it('returnerer enkeltdager dersom hver uke ikke er lik', () => {
            const result = mapOmsorgstilbudToApiData(
                {
                    ...omsorgstilbud,
                    erLiktHverUke: YesOrNo.NO,
                },
                søknadsperiode
            );
            expect(result).toBeDefined();
            expect(result?.enkeltdager).toBeDefined();
        });
        it('returnerer fasteDager dersom hver uke er lik', () => {
            const result = mapOmsorgstilbudToApiData(
                {
                    ...omsorgstilbud,
                    erLiktHverUke: YesOrNo.YES,
                    fasteDager: {
                        friday: { hours: '1', minutes: '0' },
                    },
                },
                søknadsperiode
            );
            expect(result?.enkeltdager).toBeUndefined();
            expect(result).toBeDefined();
            expect(result?.ukedager).toBeDefined();
            expect(result?.ukedager?.fredag).toBeDefined();
        });
    });
});
