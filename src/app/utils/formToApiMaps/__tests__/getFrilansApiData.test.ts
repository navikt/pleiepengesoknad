import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { FrilansFormDataPart } from '../../../types/SøknadFormData';
import { FrilansApiDataPart, getFrilansApiData } from '../getFrilansApiData';

const søknadsperiode: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 10),
};

// const frilansArbeidsforhold: Arbeidsforhold = {
//     navn: 'Teest',
//     id: '123',
//     type: ArbeidsgiverType.ORGANISASJON,
//     jobberNormaltTimer: '10',
//     arbeidIPeriode: {
//         jobberIPerioden: JobberIPeriodeSvar.JA,
//         enkeltdager: {
//             '2021-01-31': { hours: '5', minutes: '0' },
//             '2021-02-01': { hours: '5', minutes: '0' },
//             '2021-02-10': { hours: '5', minutes: '0' },
//             '2021-02-11': { hours: '5', minutes: '0' },
//         },
//     },
// };

describe('frilansApiData', () => {
    const formData: FrilansFormDataPart = {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    };

    it('returnerer _harHattInntektSomFrilanser===false dersom startdato er ugyldig', () => {
        const apiData = getFrilansApiData({ ...formData, startdato: undefined }, søknadsperiode);
        expect(apiData._harHattInntektSomFrilanser).toBeFalsy();
        expect(apiData.frilans).toBeUndefined();
    });

    it(`returnerer _harHattInntektSomFrilanser===false, og frilans===undefined dersom harHattInntektSomFrilanser === ${YesOrNo.NO}`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            { ...formData, harHattInntektSomFrilanser: YesOrNo.NO },
            søknadsperiode
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
            søknadsperiode
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
            søknadsperiode
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
            søknadsperiode
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
            søknadsperiode
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
            søknadsperiode
        );
        expect(apiData.frilans).toBeUndefined();
    });
    // describe('frilans arbeidsforhold', () => {
    //     const formDataMedArbeidsforhold = {
    //         ...formData,
    //         harHattInntektSomFrilanser: YesOrNo.YES,
    //         startdato: '2021-01-01',
    //         jobberFortsattSomFrilans: YesOrNo.YES,
    //         frilans: frilansArbeidsforhold,
    //     };
    //     it(`returnerer arbeidIPerioden dersom en har registrert arbeidstid før søknadsdato og jobber i perioden`, () => {
    //         const apiData: FrilansApiDataPart = getFrilansApiData(formDataMedArbeidsforhold, søknadsperiode);
    //         expect(apiData.frilans?.arbeidsforhold).toBeDefined();
    //         if (apiData.frilans && apiData.frilans.arbeidsforhold) {
    //             expect(apiData.frilans.arbeidsforhold.arbeidIPeriode).toBeDefined();
    //         }
    //     });
    //     it(`returnerer "jobber ikke i perioden",  dersom en ikke har registrert arbeidstid før søknadsdato, men jobber i perioden`, () => {
    //         const apiData: FrilansApiDataPart = getFrilansApiData(
    //             {
    //                 ...formDataMedArbeidsforhold,
    //                 arbeidsforhold: {
    //                     ...frilansArbeidsforhold,
    //                     arbeidIPeriode: { jobberIPerioden: JobberIPeriodeSvar.NEI },
    //                 },
    //             },
    //             søknadsperiode
    //         );
    //         expect(apiData.frilans?.arbeidsforhold).toBeDefined();
    //         if (apiData.frilans && apiData.frilans.arbeidsforhold) {
    //             expect(apiData.frilans.arbeidsforhold.arbeidIPeriode?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
    //         }
    //     });
    // });
});
