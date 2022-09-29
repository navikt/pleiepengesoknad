import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { mapNormalarbeidstidApiDataToFormValues } from '../mapNormalarbeidstidToFormValues';

describe('mapNormalarbeidstidApiDataToNormalarbeidstidFormData', () => {
    it('returnerer riktig for normalarbeidstid med snitt', () => {
        const result = mapNormalarbeidstidApiDataToFormValues({
            erLiktHverUke: true,
            timerFasteDager: {
                mandag: 'PT1H0M',
            },
            _arbeiderDeltid: false,
            _arbeiderHelg: false,
        });
        expect(result).toBeDefined();
        expect(result?.erLikeMangeTimerHverUke).toEqual(YesOrNo.YES);
        expect(result?.timerFasteUkedager).toBeDefined();
    });
    it('returnerer riktig for normalarbeidstid med snitt', () => {
        const result = mapNormalarbeidstidApiDataToFormValues({
            erLiktHverUke: false,
            timerPerUkeISnitt: 'PT20H30M',
            _erLiktSnittSomForrigeSøknad: false,
        });
        expect(result).toBeDefined();
        expect(result?.timerPerUke).toEqual('20,5');
        expect(result?.erLikeMangeTimerHverUke).toEqual(YesOrNo.NO);
    });
});
