import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver, ArbeidsgiverType } from '../../../types';
import { FrilansFormDataPart } from '../../../types/SøknadFormData';
import { FrilansApiDataPart, getFrilansApiData } from '../getFrilansApiData';

const søknadsperiode: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 10),
};

const frilansoppdrag: Arbeidsgiver[] = [
    {
        type: ArbeidsgiverType.FRILANSOPPDRAG,
        id: '123',
        navn: 'Teest',
    },
];

describe('frilansApiData', () => {
    const formData: FrilansFormDataPart = {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    };

    it('returnerer _harHattInntektSomFrilanser===false dersom startdato er ugyldig', () => {
        const apiData = getFrilansApiData({ ...formData, startdato: undefined }, søknadsperiode, frilansoppdrag);
        expect(apiData._harHattInntektSomFrilanser).toBeFalsy();
        expect(apiData.frilans).toBeUndefined();
    });

    it(`returnerer _harHattInntektSomFrilanser===false, og frilans===undefined dersom harHattInntektSomFrilanser === ${YesOrNo.NO}`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            { ...formData, harHattInntektSomFrilanser: YesOrNo.NO },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData._harHattInntektSomFrilanser).toBeFalsy();
        expect(apiData.frilans).toBeUndefined();
    });

    it(`returnerer arbeidsforhold dersom starter som frilanser før periode, og er fortsatt frilanser`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                harHattInntektSomFrilanser: YesOrNo.YES,
                startdato: '2000-01-01',
                jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer arbeidsforhold dersom starter som frilanser i perioden, og er fortsatt frilanser`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                harHattInntektSomFrilanser: YesOrNo.YES,
                startdato: '2021-02-05',
                jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer arbeidsforhold dersom starter som frilanser i perioden, og slutter i perioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                harHattInntektSomFrilanser: YesOrNo.YES,
                startdato: '2021-02-05',
                sluttdato: '2021-02-06',
                jobberFortsattSomFrilans: YesOrNo.NO,
            },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer ikke arbeidsforhold dersom en starter som frilanser etter søknadsperioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                harHattInntektSomFrilanser: YesOrNo.YES,
                startdato: '2021-02-11',
                jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData.frilans).toBeUndefined();
    });
    it(`returnerer ikke arbeidsforhold dersom en slutter som frilanser før søknadsperioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                harHattInntektSomFrilanser: YesOrNo.YES,
                startdato: '2021-01-01',
                sluttdato: '2021-01-31',
                jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            frilansoppdrag
        );
        expect(apiData.frilans).toBeUndefined();
    });
});
