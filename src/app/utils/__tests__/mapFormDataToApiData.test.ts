/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Attachment } from '@sif-common/core/types/Attachment';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import * as attachmentUtils from '@sif-common/core/utils/attachmentUtils';
import * as dateUtils from '@sif-common/core/utils/dateUtils';
/* eslint-disable @typescript-eslint/camelcase */
import { UtenlandsoppholdÅrsak } from '@sif-common/forms/utenlandsopphold/types';
import { Næringstype } from '@sif-common/forms/virksomhet/types';
import {
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiVetIkke,
    PleiepengesøknadApiData,
    UtenlandsoppholdIPeriodenApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
} from '../../types/PleiepengesøknadApiData';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdSkalJobbeSvar,
    PleiepengesøknadFormData,
} from '../../types/PleiepengesøknadFormData';
import { Arbeidsgiver, BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { jsonSort } from '../jsonSort';
import { getValidSpråk, mapFormDataToApiData } from '../mapFormDataToApiData';

const moment = require('moment');

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

const todaysDate: Date = moment().startOf('day').toDate();

const barnsFødselsdato = new Date(2020, 0, 20);
const barnMock: BarnReceivedFromApi[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123', harSammeAdresse: true },
];

const organisasjonTelenor: Arbeidsgiver = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
};
const organisasjonMaxbo: Arbeidsgiver = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
};

const telenorRedusertJobbing: Arbeidsforhold = {
    ...organisasjonTelenor,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.redusert,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 50,
};

const maxboIngenJobbing = {
    ...organisasjonMaxbo,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.nei,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 0,
};

const maxboVetIkke = {
    ...organisasjonMaxbo,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.vetIkke,
    jobberNormaltTimer: 20,
    vetIkkeEkstrainfo: 'ekstrainfo',
};

const maxboJobbeSomVanlig = {
    ...organisasjonMaxbo,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.ja,
    jobberNormaltTimer: 20,
};

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<PleiepengesøknadFormData> = {
    [AppFormField.barnetsNavn]: 'Ola Foobar',
    [AppFormField.harBekreftetOpplysninger]: true,
    [AppFormField.harForståttRettigheterOgPlikter]: true,
    [AppFormField.arbeidsforhold]: [
        { ...organisasjonTelenor, jobberNormaltTimer: 10 },
        { ...organisasjonMaxbo, jobberNormaltTimer: 20 },
    ],
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.periodeFra]: dateUtils.dateToISOFormattedDateString(todaysDate),
    [AppFormField.periodeTil]: dateUtils.dateToISOFormattedDateString(moment(todaysDate).add(1, 'day').toDate()),
    [AppFormField.utenlandsoppholdIPerioden]: [],
    [AppFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [AppFormField.skalTaUtFerieIPerioden]: undefined,
    [AppFormField.ferieuttakIPerioden]: [],
};

jest.mock('@sif-common/core/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed),
    };
});

const completedAttachmentMock = { uploaded: true, url: attachmentMock1.url, pending: false };

const frilansPartialFormData: Partial<PleiepengesøknadFormData> = {
    harHattInntektSomFrilanser: YesOrNo.YES,
    frilans_jobberFortsattSomFrilans: YesOrNo.YES,
    frilans_startdato: '2018-02-01',
};
const selvstendigPartialFormData: Partial<PleiepengesøknadFormData> = {
    selvstendig_harHattInntektSomSN: YesOrNo.YES,
    selvstendig_virksomheter: [
        {
            fom: new Date(),
            erPågående: true,
            navnPåVirksomheten: 'abc',
            næringsinntekt: 200,
            næringstyper: [Næringstype.ANNEN],
            registrertINorge: YesOrNo.YES,
            organisasjonsnummer: '123123123',
            harRegnskapsfører: YesOrNo.NO,
        },
    ],
};

const completeFormDataMock: PleiepengesøknadFormData = {
    arbeidsforhold: [{ ...organisasjonMaxbo, erAnsattIPerioden: YesOrNo.YES, jobberNormaltTimer: 37.5 }],
    barnetHarIkkeFåttFødselsnummerEnda: false,
    barnetSøknadenGjelder: barnMock[0].aktørId,
    harBekreftetOpplysninger: true,
    harMedsøker: YesOrNo.YES,
    harBeredskap: YesOrNo.YES,
    harNattevåk: YesOrNo.YES,
    harForståttRettigheterOgPlikter: true,
    harBeredskap_ekstrainfo: 'harBeredskap_ekstrainfo',
    harNattevåk_ekstrainfo: 'harNattevåk_ekstrainfo',
    legeerklæring: [completedAttachmentMock as AttachmentMock],
    samtidigHjemme: YesOrNo.YES,
    harBoddUtenforNorgeSiste12Mnd: YesOrNo.YES,
    skalBoUtenforNorgeNeste12Mnd: YesOrNo.YES,
    søknadenGjelderEtAnnetBarn: false,
    periodeFra: '2020-01-01',
    periodeTil: '2020-02-01',
    tilsynsordning: {
        skalBarnHaTilsyn: YesOrNo.YES,
        ja: {
            ekstrainfo: 'tilsynsordning-ekstrainfo',
            harEkstrainfo: YesOrNo.YES,
            tilsyn: {
                fredag: {
                    hours: 1,
                    minutes: 0,
                },
            },
        },
    },
    utenlandsoppholdSiste12Mnd: [
        {
            landkode: 'SE',
            fom: new Date(2020, 0, 1),
            tom: new Date(2020, 1, 1),
            id: '345',
        },
    ],
    utenlandsoppholdNeste12Mnd: [
        {
            landkode: 'NO',
            fom: new Date(2020, 2, 1),
            tom: new Date(2020, 3, 1),
            id: '123',
        },
    ],
    barnetsNavn: 'barnets-navn',
    barnetsFødselsdato: undefined,
    barnetsFødselsnummer: 'barnets-fnr',
};

describe('mapFormDataToApiData', () => {
    let resultingApiData: PleiepengesøknadApiData;

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
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
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

    it("should set 'fødselsdato' in api data to null if it doesnt exist, and otherwise it should assign value to 'fødselsdato' in api data", () => {
        expect(resultingApiData.barn.fødselsdato).toBeNull();
        const fdato = '2020-10-10';
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsdato]: fdato,
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result).toBeDefined();
        if (result) {
            expect(result.barn.fødselsdato).toEqual(fdato);
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
});

describe('mapFormDataToApiData', () => {
    const formData: PleiepengesøknadFormData = {
        ...(formDataMock as PleiepengesøknadFormData),
        [AppFormField.harMedsøker]: YesOrNo.YES,
        arbeidsforhold: [telenorRedusertJobbing, maxboIngenJobbing],
    };

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
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

    it('should include prosentAvVanligUke when skalJobbe is redusert', () => {
        const resultingApiData = mapFormDataToApiData(
            { ...formData, arbeidsforhold: [telenorRedusertJobbing] },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            const result: ArbeidsforholdApiRedusert = {
                ...organisasjonTelenor,
                jobberNormaltTimer: 20,
                skalJobbe: 'redusert',
                skalJobbeProsent: 50,
            };
            expect(resultingApiData.arbeidsgivere.organisasjoner).toEqual([result]);
        }
    });

    describe('should always include jobber_normalt_timer and skal_jobbe_prosent', () => {
        it('when skalJobbe is nei', () => {
            const resultingApiData = mapFormDataToApiData(
                { ...formData, arbeidsforhold: [maxboIngenJobbing] },
                barnMock,
                'nb'
            );
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].jobberNormaltTimer).toBeDefined();
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].skalJobbeProsent).toBeDefined();
        });
        it('when skalJobbe is vetIkke', () => {
            const resultingApiData = mapFormDataToApiData(
                { ...formData, arbeidsforhold: [maxboVetIkke] },
                barnMock,
                'nb'
            );
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].jobberNormaltTimer).toBeDefined();
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].skalJobbeProsent).toBeDefined();
        });
        it('when skalJobbe is redusert', () => {
            const resultingApiData = mapFormDataToApiData(
                { ...formData, arbeidsforhold: [telenorRedusertJobbing] },
                barnMock,
                'nb'
            );
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].jobberNormaltTimer).toBeDefined();
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].skalJobbeProsent).toBeDefined();
        });
        it('when skalJobbe is somVanlig', () => {
            const resultingApiData = mapFormDataToApiData(
                {
                    ...formData,
                    arbeidsforhold: [maxboJobbeSomVanlig],
                },
                barnMock,
                'nb'
            );
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].jobberNormaltTimer).toBeDefined();
            expect(resultingApiData?.arbeidsgivere.organisasjoner[0].skalJobbeProsent).toBeDefined();
        });
    });

    it('should include prosentAvVanligUke when skalJobbe is nei', () => {
        const resultingApiData = mapFormDataToApiData(
            { ...formData, arbeidsforhold: [maxboIngenJobbing] },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            const {
                arbeidsgivere: { organisasjoner },
            } = resultingApiData;
            const result: ArbeidsforholdApiNei = {
                ...organisasjonMaxbo,
                skalJobbe: 'nei',
                skalJobbeProsent: 0,
                jobberNormaltTimer: 20,
            };
            expect(JSON.stringify(jsonSort(organisasjoner))).toEqual(JSON.stringify(jsonSort([result])));
        }
    });

    it('should include correct arbeidsforhold when skalJobbe is vetIkke', () => {
        const resultingApiData = mapFormDataToApiData({ ...formData, arbeidsforhold: [maxboVetIkke] }, barnMock, 'nb');
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            const {
                arbeidsgivere: { organisasjoner },
            } = resultingApiData;
            const result: ArbeidsforholdApiVetIkke = {
                ...organisasjonMaxbo,
                jobberNormaltTimer: 20,
                skalJobbe: 'vetIkke',
                skalJobbeProsent: 0,
            };
            expect(organisasjoner).toEqual([result]);
            expect(organisasjoner[0].skalJobbeTimer).toBeUndefined();
        }
    });

    it('should not include arbeidsforhold where user is not ansatt', () => {
        const resultingApiData = mapFormDataToApiData(
            { ...formData, arbeidsforhold: [{ ...maxboVetIkke, erAnsattIPerioden: YesOrNo.NO }] },
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            const {
                arbeidsgivere: { organisasjoner },
            } = resultingApiData;
            expect(organisasjoner).toEqual([]);
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
            const { utenlandsoppholdIPerioden: utenlandsopphold_i_perioden } = resultingApiData;
            expect(utenlandsopphold_i_perioden!.opphold.length).toBe(0);
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
            const { utenlandsoppholdIPerioden: utenlandsopphold_i_perioden } = resultingApiData;
            expect(utenlandsopphold_i_perioden).toBeDefined();
            expect(utenlandsopphold_i_perioden!.opphold.length).toBe(1);
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
            const { ferieuttakIPerioden: ferieuttak_i_perioden } = resultingApiData;
            expect(ferieuttak_i_perioden).toBeDefined();
            expect(ferieuttak_i_perioden!.ferieuttak.length).toBe(0);
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
            const { ferieuttakIPerioden: ferieuttak_i_perioden } = resultingApiData;
            expect(ferieuttak_i_perioden!.ferieuttak.length).toBe(1);
        }
    });

    describe('frilanser part', () => {
        it('should map frilanserdata if user har answered yes to question about frilans', () => {
            const formDataWithFrilansInfo = { ...formData, ...frilansPartialFormData };
            const mappedData = mapFormDataToApiData(formDataWithFrilansInfo, barnMock, 'nb');
            expect(mappedData).toBeDefined();
            if (mappedData) {
                expect(mappedData.harHattInntektSomFrilanser).toBeTruthy();
                expect(mappedData.frilans).toBeDefined();
            }
        });

        it('should include frilanserdata', () => {
            (isFeatureEnabled as any).mockImplementation(() => true);
            const formDataWithFrilansInfo = {
                ...formData,
                ...frilansPartialFormData,
                harHattInntektSomFrilanser: YesOrNo.NO,
            };
            const mappedData = mapFormDataToApiData(formDataWithFrilansInfo, barnMock, 'nb');
            expect(mappedData).toBeDefined();
            if (mappedData) {
                expect(mappedData.harHattInntektSomFrilanser).toBeFalsy();
                expect(mappedData.frilans).toBeDefined();
            }
        });
        it('should include selvstendig info', () => {
            (isFeatureEnabled as any).mockImplementation(() => true);
            const formDataWithSelvstendigInfo = {
                ...formData,
                ...selvstendigPartialFormData,
                harHattInntektSomFrilanser: YesOrNo.NO,
            };
            const mappedData = mapFormDataToApiData(formDataWithSelvstendigInfo, barnMock, 'nb');
            expect(mappedData).toBeDefined();
            if (mappedData) {
                expect(mappedData.harHattInntektSomSelvstendigNæringsdrivende).toBeTruthy();
                expect(mappedData.selvstendigVirksomheter).toBeDefined();
            }
        });
    });
});

describe('Test complete applications', () => {
    const resultApiData: PleiepengesøknadApiData = {
        newVersion: true,
        språk: 'nb',
        barn: {
            navn: 'Mock Mocknes',
            fødselsnummer: null,
            aktørId: barnMock[0].aktørId,
            fødselsdato: '2020-01-20',
            sammeAdresse: true,
        },
        arbeidsgivere: {
            organisasjoner: [
                {
                    navn: 'Maxbo',
                    organisasjonsnummer: '910831143',
                    skalJobbe: 'ja',
                    skalJobbeProsent: 100,
                    jobberNormaltTimer: 37.5,
                },
            ],
        },
        medlemskap: {
            harBoddIUtlandetSiste12Mnd: true,
            skalBoIUtlandetNeste12Mnd: true,
            utenlandsoppholdSiste12Mnd: [
                {
                    landnavn: 'Sverige',
                    landkode: 'SE',
                    fraOgMed: '2020-01-01',
                    tilOgMed: '2020-02-01',
                },
            ],
            utenlandsoppholdNeste12Mnd: [
                {
                    landnavn: 'Norge',
                    landkode: 'NO',
                    fraOgMed: '2020-03-01',
                    tilOgMed: '2020-04-01',
                },
            ],
        },
        fraOgMed: '2020-01-01',
        tilOgMed: '2020-02-01',
        vedlegg: ['nav.no/1'],
        harMedsøker: true,
        harBekreftetOpplysninger: true,
        harForståttRettigheterOgPlikter: true,
        samtidigHjemme: true,
        tilsynsordning: {
            svar: 'ja',
            ja: {
                fredag: 'PT1H0M',
                tilleggsinformasjon: 'tilsynsordning-ekstrainfo',
            },
        },
        nattevåk: {
            harNattevåk: true,
            tilleggsinformasjon: 'harNattevåk_ekstrainfo',
        },

        beredskap: {
            beredskap: true,
            tilleggsinformasjon: 'harBeredskap_ekstrainfo',
        },
    };

    const utenlandsoppholdISverigeApiData: UtenlandsoppholdIPeriodenApiData = {
        landnavn: 'Sverige',
        landkode: 'SE',
        fraOgMed: '2020-01-05',
        tilOgMed: '2020-01-07',
    };

    const utenlandsoppholdIUSAApiData: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
        landnavn: 'USA',
        landkode: 'US',
        fraOgMed: '2020-01-08',
        tilOgMed: '2020-01-09',
        erUtenforEøs: true,
        erBarnetInnlagt: true,
        perioderBarnetErInnlagt: [{ fraOgMed: '2020-01-08', tilOgMed: '2020-01-09' }],
        årsak: UtenlandsoppholdÅrsak.ANNET,
    };

    const featureUtenlandsoppholdIPeriodenApiData: Partial<PleiepengesøknadApiData> = {
        utenlandsoppholdIPerioden: {
            skalOppholdeSegIUtlandetIPerioden: true,
            opphold: [utenlandsoppholdISverigeApiData, utenlandsoppholdIUSAApiData],
        },
    };
    const featureFerieIPeriodenApiData: Partial<PleiepengesøknadApiData> = {
        ferieuttakIPerioden: {
            skalTaUtFerieIPerioden: true,
            ferieuttak: [
                {
                    fraOgMed: '2020-01-05',
                    tilOgMed: '2020-01-07',
                },
            ],
        },
    };
    const frilansDate = '2020-01-01';
    const featureFrilansApiData: Partial<PleiepengesøknadApiData> = {
        harHattInntektSomFrilanser: true,
        frilans: {
            jobberFortsattSomFrilans: true,
            startdato: frilansDate,
        },
    };

    const featureSelvstendigApiData: Partial<PleiepengesøknadApiData> = {
        harHattInntektSomSelvstendigNæringsdrivende: true,
        selvstendigVirksomheter: [],
    };

    const baseDato = new Date(2020, 0, 1);

    const feature8UkerDatoerFormOverrideData: {
        under8Uker: {
            periodeFra: string;
            periodeTil: string;
        };
        over8Uker: {
            periodeFra: string;
            periodeTil: string;
        };
    } = {
        under8Uker: {
            periodeFra: dateUtils.formatDateToApiFormat(moment(baseDato).toDate()),
            periodeTil: dateUtils.formatDateToApiFormat(moment(baseDato).add(3, 'weeks').toDate()),
        },
        over8Uker: {
            periodeFra: dateUtils.formatDateToApiFormat(moment(baseDato).toDate()),
            periodeTil: dateUtils.formatDateToApiFormat(moment(baseDato).add(9, 'weeks').toDate()),
        },
    };

    it('All features on', () => {
        (isFeatureEnabled as any).mockImplementation(() => true);

        const featureUtenlandsoppholdIPeriodenFormData: Partial<PleiepengesøknadFormData> = {
            skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
            utenlandsoppholdIPerioden: [
                {
                    fom: dateUtils.apiStringDateToDate('2020-01-05'),
                    tom: dateUtils.apiStringDateToDate('2020-01-07'),
                    landkode: 'SE',
                    erBarnetInnlagt: YesOrNo.YES,
                },
                {
                    fom: dateUtils.apiStringDateToDate('2020-01-08'),
                    tom: dateUtils.apiStringDateToDate('2020-01-09'),
                    landkode: 'US',
                    erBarnetInnlagt: YesOrNo.YES,
                    barnInnlagtPerioder: [
                        {
                            fom: dateUtils.apiStringDateToDate('2020-01-08'),
                            tom: dateUtils.apiStringDateToDate('2020-01-09'),
                        },
                    ],
                    årsak: UtenlandsoppholdÅrsak.ANNET,
                },
            ],
        };

        const featureFerieIPeriodenFormData: Partial<PleiepengesøknadFormData> = {
            skalTaUtFerieIPerioden: YesOrNo.YES,
            ferieuttakIPerioden: [
                {
                    fom: dateUtils.apiStringDateToDate('2020-01-05'),
                    tom: dateUtils.apiStringDateToDate('2020-01-07'),
                },
            ],
        };

        const featureFrilanserFormData: Partial<PleiepengesøknadFormData> = {
            harHattInntektSomFrilanser: YesOrNo.YES,
            frilans_startdato: frilansDate,
            frilans_jobberFortsattSomFrilans: YesOrNo.YES,
        };

        const featureSelvstendigFormData: Partial<PleiepengesøknadFormData> = {
            selvstendig_harHattInntektSomSN: YesOrNo.YES,
            selvstendig_virksomheter: [],
        };

        const featureBekreftOmsorgFormData: Partial<PleiepengesøknadFormData> = {
            skalPassePåBarnetIHelePerioden: YesOrNo.NO,
            beskrivelseOmsorgsrolleIPerioden: 'avhengighet',
        };

        const featuresOnFormData: PleiepengesøknadFormData = {
            ...completeFormDataMock,
            ...featureFerieIPeriodenFormData,
            ...featureFrilanserFormData,
            ...featureUtenlandsoppholdIPeriodenFormData,
            ...featureSelvstendigFormData,
            ...featureBekreftOmsorgFormData,
        };

        const mapFeaturesOnData = (data: PleiepengesøknadFormData): PleiepengesøknadApiData => {
            return mapFormDataToApiData(data, barnMock, 'nb')!;
        };

        const resultApiDataWithFeatures = {
            ...resultApiData,
            ...featureFrilansApiData,
            ...featureSelvstendigApiData,
            ...featureFerieIPeriodenApiData,
            ...featureUtenlandsoppholdIPeriodenApiData,
        };

        expect(JSON.stringify(jsonSort(mapFeaturesOnData(featuresOnFormData)))).toEqual(
            JSON.stringify(jsonSort(resultApiDataWithFeatures))
        );

        const feature8UkerOver8ukerFormData: Partial<PleiepengesøknadFormData> = {
            ...feature8UkerDatoerFormOverrideData.over8Uker,
            bekrefterPeriodeOver8uker: YesOrNo.YES,
        };

        const feature8UkerOver8UkerApiData: Partial<PleiepengesøknadApiData> = {
            fraOgMed: feature8UkerDatoerFormOverrideData.over8Uker.periodeFra,
            tilOgMed: feature8UkerDatoerFormOverrideData.over8Uker.periodeTil,
            bekrefterPeriodeOver8Uker: true,
        };

        expect(
            JSON.stringify(jsonSort(mapFeaturesOnData({ ...featuresOnFormData, ...feature8UkerOver8ukerFormData })))
        ).toEqual(JSON.stringify(jsonSort({ ...resultApiDataWithFeatures, ...feature8UkerOver8UkerApiData })));

        const feature8UkerUnder8ukerFormData: Partial<PleiepengesøknadFormData> = {
            ...feature8UkerDatoerFormOverrideData.under8Uker,
        };
        const feature8UkerUnder8UkerApiData: Partial<PleiepengesøknadApiData> = {
            fraOgMed: feature8UkerDatoerFormOverrideData.under8Uker.periodeFra,
            tilOgMed: feature8UkerDatoerFormOverrideData.under8Uker.periodeTil,
        };

        expect(
            JSON.stringify(jsonSort(mapFeaturesOnData({ ...featuresOnFormData, ...feature8UkerUnder8ukerFormData })))
        ).toEqual(JSON.stringify(jsonSort({ ...resultApiDataWithFeatures, ...feature8UkerUnder8UkerApiData })));
    });
});

describe('getValidSpråk', () => {
    it('always returns nn if selected', () => {
        expect(getValidSpråk('nn')).toBe('nn');
        expect(getValidSpråk('NN')).toBe('nn');
    });
    it('returns nb in all other cases than nn', () => {
        expect(getValidSpråk()).toBe('nb');
        expect(getValidSpråk(null)).toBe('nb');
        expect(getValidSpråk(undefined)).toBe('nb');
        expect(getValidSpråk('nb')).toBe('nb');
        expect(getValidSpråk('en')).toBe('nb');
        expect(getValidSpråk('NB')).toBe('nb');
        expect(getValidSpråk('nn')).toBe('nn');
    });
});
