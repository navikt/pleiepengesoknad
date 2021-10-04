/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { dateToISOFormattedDateString } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { mapFormDataToApiData } from '../mapFormDataToApiData';

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

const todaysDate: Date = dayjs().startOf('day').toDate();

const barnsFødselsdato = new Date(2020, 0, 20);
const barnMock: BarnReceivedFromApi[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123', harSammeAdresse: true },
];

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<PleiepengesøknadFormData> = {
    [AppFormField.barnetsNavn]: 'Ola Foobar',
    [AppFormField.harBekreftetOpplysninger]: true,
    [AppFormField.harForståttRettigheterOgPlikter]: true,
    [AppFormField.ansatt_arbeidsforhold]: [],
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.periodeFra]: dateToISOFormattedDateString(todaysDate),
    [AppFormField.periodeTil]: dateToISOFormattedDateString(dayjs(todaysDate).add(1, 'day').toDate()),
    [AppFormField.utenlandsoppholdIPerioden]: [],
    [AppFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [AppFormField.skalTaUtFerieIPerioden]: undefined,
    [AppFormField.ferieuttakIPerioden]: [],
};

jest.mock('@navikt/sif-common-core/lib/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed),
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: PleiepengesøknadApiData;

    const formData: PleiepengesøknadFormData = {
        ...(formDataMock as PleiepengesøknadFormData),
        [AppFormField.harMedsøker]: YesOrNo.YES,
        ansatt_arbeidsforhold: [],
    };

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as PleiepengesøknadFormData, barnMock, 'nb')!;
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[AppFormField.barnetsNavn]);
    });

    it("should set 'medlemskap.skal_bo_i_utlandet_neste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.skalBoIUtlandetNeste12Mnd).toBe(false);
    });

    it("should set 'medlemskap.har_bodd_i_utlandet_siste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.harBoddIUtlandetSiste12Mnd).toBe(true);
    });

    it("should set 'fra_og_med' in api data correctly", () => {
        expect(resultingApiData.fraOgMed).toEqual(formDataMock.periodeFra);
    });

    it("should set 'til_og_med' in api data correctly", () => {
        expect(resultingApiData.tilOgMed).toEqual(formDataMock.periodeTil);
    });

    it("should set 'vedlegg' in api data correctly by only including the urls of attachments that have been successfully uploaded", () => {
        expect(attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
        expect(resultingApiData.vedlegg).toHaveLength(1);
        expect(resultingApiData.vedlegg[0]).toEqual(attachmentMock2.url);
    });

    it("should set 'fodselsnummer' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'fodselsnummer' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.fødselsnummer).toBeNull();
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsnummer]: fnr,
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result).toBeDefined();
        if (result) {
            expect(result.barn.fødselsnummer).toEqual(fnr);
        }
    });

    it('should set har_bekreftet_opplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.harBekreftetOpplysninger).toBe(formDataMock[AppFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.harForståttRettigheterOgPlikter).toBe(
            formDataMock[AppFormField.harForståttRettigheterOgPlikter]
        );
    });

    it('should not include samtidig_hjemme if harMedsøker is no', () => {
        const resultingApiData = mapFormDataToApiData({ ...formData, harMedsøker: YesOrNo.NO }, barnMock, 'nb');
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.samtidigHjemme).toBeUndefined();
        }
    });

    it('should include samtidig_hjemme if harMedsøker is yes', () => {
        const dataHarMedsøker = { ...formData, harMedsøker: YesOrNo.YES };
        const resultingApiData = mapFormDataToApiData(dataHarMedsøker, barnMock, 'nb');
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.samtidigHjemme).toBeDefined();
        }
    });

    it('should not include utenlandsoppholdIPerioden if skalOppholdeSegIUtlandet is NO', () => {
        const resultingApiData = mapFormDataToApiData(
            {
                ...formData,
                skalOppholdeSegIUtlandetIPerioden: YesOrNo.NO,
                utenlandsoppholdIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                        landkode: 'SE',
                    },
                ],
            },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.utenlandsoppholdIPerioden?.opphold.length).toBe(0);
        }
    });

    it('should include utenlandsoppholdIPerioden if skalOppholdeSegIUtlandet is YES', () => {
        const resultingApiData = mapFormDataToApiData(
            {
                ...formData,
                skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
                utenlandsoppholdIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                        landkode: 'SE',
                    },
                ],
            },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.utenlandsoppholdIPerioden).toBeDefined();
            expect(resultingApiData.utenlandsoppholdIPerioden!.opphold.length).toBe(1);
        }
    });

    it('should not include ferieuttakIPerioden if skalTaUtFerieIPerioden is NO', () => {
        const resultingApiData = mapFormDataToApiData(
            {
                ...formData,
                skalTaUtFerieIPerioden: YesOrNo.NO,
                ferieuttakIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                    },
                ],
            },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.ferieuttakIPerioden).toBeDefined();
            expect(resultingApiData.ferieuttakIPerioden!.ferieuttak.length).toBe(0);
        }
    });

    it('should include ferieuttakIPerioden if skalTaUtFerieIPerioden is YES', () => {
        const resultingApiData = mapFormDataToApiData(
            {
                ...formData,
                skalTaUtFerieIPerioden: YesOrNo.YES,
                ferieuttakIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                    },
                ],
            },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.ferieuttakIPerioden!.ferieuttak.length).toBe(1);
        }
    });
});

// const organisasjonTelenor: Arbeidsgiver = {
//     navn: 'Telenor',
//     organisasjonsnummer: '973861778',
// };
// const organisasjonMaxbo: Arbeidsgiver = {
//     navn: 'Maxbo',
//     organisasjonsnummer: '910831143',
// };

// const telenorRedusertJobbing: ArbeidsforholdAnsatt = {
//     ...organisasjonTelenor,
//     erAnsatt: YesOrNo.YES,
//     jobberNormaltTimer: '20',
//     arbeidsform: Arbeidsform.fast,
// };

// const maxboIngenJobbing: ArbeidsforholdAnsatt = {
//     ...organisasjonMaxbo,
//     erAnsatt: YesOrNo.YES,
//     jobberNormaltTimer: '20',
//     arbeidsform: Arbeidsform.fast,
// };

// const completedAttachmentMock = { uploaded: true, url: attachmentMock1.url, pending: false };

// const frilansPartialFormData: Partial<PleiepengesøknadFormData> = {
//     frilans_harHattInntektSomFrilanser: YesOrNo.YES,
//     frilans_jobberFortsattSomFrilans: YesOrNo.YES,
//     frilans_startdato: '2018-02-01',
//     frilans_arbeidsforhold: {
//         arbeidsform: Arbeidsform.fast,
//         jobberNormaltTimer: '10',
//     },
// };
// // const selvstendigPartialFormData: Partial<PleiepengesøknadFormData> = {
// //     selvstendig_harHattInntektSomSN: YesOrNo.YES,
// //     selvstendig_harFlereVirksomheter: YesOrNo.NO,
// //     selvstendig_virksomhet: {
// //         fom: new Date(),
// //         erPågående: true,
// //         navnPåVirksomheten: 'abc',
// //         næringsinntekt: 200,
// //         næringstype: Næringstype.ANNEN,
// //         registrertINorge: YesOrNo.YES,
// //         organisasjonsnummer: '123123123',
// //         harRegnskapsfører: YesOrNo.NO,
// //     },
// // };

// const completeFormDataMock: PleiepengesøknadFormData = {
//     ansatt_arbeidsforhold: [
//         {
//             ...organisasjonMaxbo,
//             erAnsatt: YesOrNo.YES,
//             arbeidsform: Arbeidsform.fast,
//             jobberNormaltTimer: '37,5',
//         },
//     ],
//     barnetSøknadenGjelder: barnMock[0].aktørId,
//     harBekreftetOpplysninger: true,
//     harMedsøker: YesOrNo.YES,
//     harBeredskap: YesOrNo.YES,
//     harNattevåk: YesOrNo.YES,
//     harForståttRettigheterOgPlikter: true,
//     harBeredskap_ekstrainfo: 'harBeredskap_ekstrainfo',
//     harNattevåk_ekstrainfo: 'harNattevåk_ekstrainfo',
//     legeerklæring: [completedAttachmentMock as AttachmentMock],
//     samtidigHjemme: YesOrNo.YES,
//     harBoddUtenforNorgeSiste12Mnd: YesOrNo.YES,
//     skalBoUtenforNorgeNeste12Mnd: YesOrNo.YES,
//     søknadenGjelderEtAnnetBarn: false,
//     periodeFra: '2020-01-01',
//     periodeTil: '2020-02-01',

//     omsorgstilbud: {
//         skalBarnIOmsorgstilbud: YesOrNo.YES,
//         harBarnVærtIOmsorgstilbud: YesOrNo.YES,
//         historisk: {
//             enkeltdager: {
//                 '2020-01-01': { hours: '1', minutes: '' },
//             },
//         },
//         planlagt: {
//             vetHvorMyeTid: VetOmsorgstilbud.VET_ALLE_TIMER,
//             erLiktHverUke: YesOrNo.YES,
//             fasteDager: {
//                 fredag: {
//                     hours: '1',
//                     minutes: '0',
//                 },
//             },
//         },
//     },
//     utenlandsoppholdSiste12Mnd: [
//         {
//             landkode: 'SE',
//             fom: new Date(2020, 0, 1),
//             tom: new Date(2020, 1, 1),
//             id: '345',
//         },
//     ],
//     utenlandsoppholdNeste12Mnd: [
//         {
//             landkode: 'NO',
//             fom: new Date(2020, 2, 1),
//             tom: new Date(2020, 3, 1),
//             id: '123',
//         },
//     ],
//     barnetsNavn: 'barnets-navn',
//     barnetsFødselsdato: undefined,
//     barnetsFødselsnummer: 'barnets-fnr',
// };

// describe('mapFormDataToApiData', () => {
//     const formData: PleiepengesøknadFormData = {
//         ...(formDataMock as PleiepengesøknadFormData),
//         [AppFormField.harMedsøker]: YesOrNo.YES,
//         ansatt_arbeidsforhold: [telenorRedusertJobbing, maxboIngenJobbing],
//     };

//     beforeAll(() => {
//         (isFeatureEnabled as any).mockImplementation(() => true);
//     });

//     describe('frilanser and selvstendig næringsdrivende part', () => {
//         it('should map frilanserdata if user har answered yes to question about frilans', () => {
//             const formDataWithFrilansInfo = { ...formData, ...frilansPartialFormData };
//             const mappedData = mapFormDataToApiData(formDataWithFrilansInfo, barnMock, 'nb');
//             expect(mappedData).toBeDefined();
//             if (mappedData) {
//                 expect(mappedData._harHattInntektSomFrilanser).toBeTruthy();
//                 expect(mappedData.frilans).toBeDefined();
//             }
//         });

//         it('should include frilanserdata', () => {
//             (isFeatureEnabled as any).mockImplementation(() => true);
//             const formDataWithFrilansInfo: Partial<PleiepengesøknadFormData> = {
//                 ...formData,
//                 ...frilansPartialFormData,
//                 frilans_harHattInntektSomFrilanser: YesOrNo.NO,
//             };
//             const mappedData = mapFormDataToApiData(formDataWithFrilansInfo as any, barnMock, 'nb');
//             expect(mappedData).toBeDefined();
//             if (mappedData) {
//                 expect(mappedData._harHattInntektSomFrilanser).toBeFalsy();
//                 expect(mappedData.frilans).toBeUndefined();
//             }
//         });
//         // it('should include selvstendig info', () => {
//         //     (isFeatureEnabled as any).mockImplementation(() => true);
//         //     const formDataWithSelvstendigInfo: Partial<PleiepengesøknadFormData> = {
//         //         ...formData,
//         //         ...selvstendigPartialFormData,
//         //         selvstendig_harHattInntektSomSN: YesOrNo.YES,
//         //         selvstendig_arbeidsforhold: {
//         //             arbeidsform: Arbeidsform.fast,
//         //             jobberNormaltTimer: '10',
//         //         },
//         //     };
//         //     const mappedData = mapFormDataToApiData(formDataWithSelvstendigInfo as any, barnMock, 'nb');
//         //     expect(mappedData).toBeDefined();
//         //     if (mappedData) {
//         //         expect(mappedData.harHattInntektSomSelvstendigNæringsdrivende).toBeTruthy();
//         //         expect(mappedData.selvstendigVirksomheter).toBeDefined();
//         //     }
//         // });
//     });
// });

// describe('Test complete applications', () => {
//     const resultApiData: PleiepengesøknadApiData = {
//         språk: 'nb',
//         barn: {
//             navn: 'Mock Mocknes',
//             fødselsnummer: null,
//             aktørId: barnMock[0].aktørId,
//             fødselsdato: '2020-01-20',
//             sammeAdresse: true,
//         },
//         arbeidsgivere: [
//             // {
//             //     navn: 'Maxbo',
//             //     organisasjonsnummer: '910831143',
//             //     skalJjoobbe: JobberSvar.JA,
//             //     jobberNormaltTimer: 37.5,
//             //     arbeidsform: Arbeidsform.fast,
//             //     // erAnsatt: true,
//             //     _type: ArbeidsforholdType.ANSATT,
//             // },
//         ],

//         medlemskap: {
//             harBoddIUtlandetSiste12Mnd: true,
//             skalBoIUtlandetNeste12Mnd: true,
//             utenlandsoppholdSiste12Mnd: [
//                 {
//                     landnavn: 'Sverige',
//                     landkode: 'SE',
//                     fraOgMed: '2020-01-01',
//                     tilOgMed: '2020-02-01',
//                 },
//             ],
//             utenlandsoppholdNeste12Mnd: [
//                 {
//                     landnavn: 'Norge',
//                     landkode: 'NO',
//                     fraOgMed: '2020-03-01',
//                     tilOgMed: '2020-04-01',
//                 },
//             ],
//         },
//         fraOgMed: '2020-01-01',
//         tilOgMed: '2020-02-01',
//         vedlegg: ['nav.no/1'],
//         harMedsøker: true,
//         harBekreftetOpplysninger: true,
//         harForståttRettigheterOgPlikter: true,
//         samtidigHjemme: true,
//         omsorgstilbudV2: {
//             historisk: {
//                 enkeltdager: [
//                     {
//                         dato: '2020-01-01',
//                         tid: 'PT1H0M',
//                     },
//                 ],
//             },
//             planlagt: {
//                 vetOmsorgstilbud: VetOmsorgstilbud.VET_ALLE_TIMER,
//                 erLiktHverUke: true,
//                 ukedager: { fredag: 'PT1H0M' },
//             },
//         },

//         nattevåk: {
//             harNattevåk: true,
//             tilleggsinformasjon: 'harNattevåk_ekstrainfo',
//         },
//         beredskap: {
//             beredskap: true,
//             tilleggsinformasjon: 'harBeredskap_ekstrainfo',
//         },
//         harVærtEllerErVernepliktig: undefined,
//         andreYtelserFraNAV: [],
//         _harHattInntektSomFrilanser: false,
//         _harHattInntektSomSelvstendigNæringsdrivende: false,
//         // selvstendigVirksomheter: [],
//     };

//     const utenlandsoppholdISverigeApiData: UtenlandsoppholdIPeriodenApiData = {
//         landnavn: 'Sverige',
//         landkode: 'SE',
//         fraOgMed: '2020-01-05',
//         tilOgMed: '2020-01-07',
//     };

//     const utenlandsoppholdIUSAApiData: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
//         landnavn: 'USA',
//         landkode: 'US',
//         fraOgMed: '2020-01-08',
//         tilOgMed: '2020-01-09',
//         erUtenforEøs: true,
//         erBarnetInnlagt: true,
//         perioderBarnetErInnlagt: [{ fraOgMed: '2020-01-08', tilOgMed: '2020-01-09' }],
//         årsak: UtenlandsoppholdÅrsak.ANNET,
//     };

//     const featureUtenlandsoppholdIPeriodenApiData: Partial<PleiepengesøknadApiData> = {
//         utenlandsoppholdIPerioden: {
//             skalOppholdeSegIUtlandetIPerioden: true,
//             opphold: [utenlandsoppholdISverigeApiData, utenlandsoppholdIUSAApiData],
//         },
//     };
//     const featureFerieIPeriodenApiData: Partial<PleiepengesøknadApiData> = {
//         ferieuttakIPerioden: {
//             skalTaUtFerieIPerioden: true,
//             ferieuttak: [
//                 {
//                     fraOgMed: '2020-01-05',
//                     tilOgMed: '2020-01-07',
//                 },
//             ],
//         },
//     };
//     const frilansDate = '2020-01-01';
//     const featureFrilansApiData: Partial<PleiepengesøknadApiData> = {
//         _harHattInntektSomFrilanser: true,
//         frilans: {
//             arbeidsforhold: {
//                 arbeidsform: Arbeidsform.fast,
//                 jobberNormaltTimer: 10,
//                 // skalJobbe: JobberSvar.NEI,
//                 _type: ArbeidsforholdType.FRILANSER,
//             },
//             jobberFortsattSomFrilans: true,
//             startdato: frilansDate,
//             sluttdato: undefined,
//         },
//     };

//     const featureSelvstendigApiData: Partial<PleiepengesøknadApiData> = {
//         _harHattInntektSomSelvstendigNæringsdrivende: false,
//     };

//     it('All features on', () => {
//         (isFeatureEnabled as any).mockImplementation(() => true);

//         const featureUtenlandsoppholdIPeriodenFormData: Partial<PleiepengesøknadFormData> = {
//             skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
//             utenlandsoppholdIPerioden: [
//                 {
//                     fom: dateUtils.apiStringDateToDate('2020-01-05'),
//                     tom: dateUtils.apiStringDateToDate('2020-01-07'),
//                     landkode: 'SE',
//                     erBarnetInnlagt: YesOrNo.YES,
//                 },
//                 {
//                     fom: dateUtils.apiStringDateToDate('2020-01-08'),
//                     tom: dateUtils.apiStringDateToDate('2020-01-09'),
//                     landkode: 'US',
//                     erBarnetInnlagt: YesOrNo.YES,
//                     barnInnlagtPerioder: [
//                         {
//                             fom: dateUtils.apiStringDateToDate('2020-01-08'),
//                             tom: dateUtils.apiStringDateToDate('2020-01-09'),
//                         },
//                     ],
//                     årsak: UtenlandsoppholdÅrsak.ANNET,
//                 },
//             ],
//         };

//         const featureFerieIPeriodenFormData: Partial<PleiepengesøknadFormData> = {
//             skalTaUtFerieIPerioden: YesOrNo.YES,
//             ferieuttakIPerioden: [
//                 {
//                     fom: dateUtils.apiStringDateToDate('2020-01-05'),
//                     tom: dateUtils.apiStringDateToDate('2020-01-07'),
//                 },
//             ],
//         };

//         const featureFrilanserFormData: Partial<PleiepengesøknadFormData> = {
//             frilans_harHattInntektSomFrilanser: YesOrNo.YES,
//             frilans_startdato: frilansDate,
//             frilans_jobberFortsattSomFrilans: YesOrNo.YES,
//             frilans_arbeidsforhold: {
//                 arbeidsform: Arbeidsform.fast,
//                 jobberNormaltTimer: '10',
//             },
//         };

//         const featureSelvstendigFormData: Partial<PleiepengesøknadFormData> = {
//             selvstendig_harHattInntektSomSN: YesOrNo.NO,
//         };

//         const featureBekreftOmsorgFormData: Partial<PleiepengesøknadFormData> = {
//             skalPassePåBarnetIHelePerioden: YesOrNo.NO,
//             beskrivelseOmsorgsrolleIPerioden: 'avhengighet',
//         };

//         const featuresOnFormData: PleiepengesøknadFormData = {
//             ...completeFormDataMock,
//             ...featureFerieIPeriodenFormData,
//             ...featureFrilanserFormData,
//             ...featureUtenlandsoppholdIPeriodenFormData,
//             ...featureSelvstendigFormData,
//             ...featureBekreftOmsorgFormData,
//         };

//         const mapFeaturesOnData = (data: PleiepengesøknadFormData): PleiepengesøknadApiData => {
//             return mapFormDataToApiData(data, barnMock, 'nb')!;
//         };

//         const resultApiDataWithFeatures = {
//             ...resultApiData,
//             ...featureFrilansApiData,
//             ...featureSelvstendigApiData,
//             ...featureFerieIPeriodenApiData,
//             ...featureUtenlandsoppholdIPeriodenApiData,
//         };

//         const mappedData = mapFeaturesOnData(featuresOnFormData);
//         expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(resultApiDataWithFeatures)));
//     });
// });

// describe('getValidSpråk', () => {
//     it('always returns nn if selected', () => {
//         expect(getValidSpråk('nn')).toBe('nn');
//         expect(getValidSpråk('NN')).toBe('nn');
//     });
//     it('returns nb in all other cases than nn', () => {
//         expect(getValidSpråk()).toBe('nb');
//         expect(getValidSpråk(null)).toBe('nb');
//         expect(getValidSpråk(undefined)).toBe('nb');
//         expect(getValidSpråk('nb')).toBe('nb');
//         expect(getValidSpråk('en')).toBe('nb');
//         expect(getValidSpråk('NB')).toBe('nb');
//         expect(getValidSpråk('nn')).toBe('nn');
//     });
// });
