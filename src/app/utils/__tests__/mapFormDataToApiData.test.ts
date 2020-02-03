import {
    AppFormField,
    PleiepengesøknadFormData,
    Arbeidsforhold,
    ArbeidsforholdSkalJobbeSvar
} from '../../types/PleiepengesøknadFormData';
import { mapFormDataToApiData } from '../mapFormDataToApiData';
import {
    PleiepengesøknadApiData,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiVetIkke,
    BostedUtlandApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData
} from '../../types/PleiepengesøknadApiData';
import * as dateUtils from 'common/utils/dateUtils';
import * as attachmentUtils from 'common/utils/attachmentUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { BarnReceivedFromApi, Arbeidsgiver } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { Attachment } from 'common/types/Attachment';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { UtenlandsoppholdÅrsak } from 'common/forms/utenlandsopphold/types';

const moment = require('moment');

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar'
    };
});

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {}
}));

const todaysDate = moment()
    .startOf('day')
    .toDate();

const barnsFødselsdato = new Date(2020, 0, 20);
const barnMock: BarnReceivedFromApi[] = [
    { fodselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktoer_id: '123' }
];

const organisasjonTelenor: Arbeidsgiver = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778'
};
const organisasjonMaxbo: Arbeidsgiver = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143'
};

const telenorRedusertJobbing: Arbeidsforhold = {
    ...organisasjonTelenor,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.redusert,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 50
};

const maxboIngenJobbing = {
    ...organisasjonMaxbo,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.nei,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 0
};

const maxboVetIkke = {
    ...organisasjonMaxbo,
    erAnsattIPerioden: YesOrNo.YES,
    skalJobbe: ArbeidsforholdSkalJobbeSvar.vetIkke,
    jobberNormaltTimer: 20,
    vetIkkeEkstrainfo: 'ekstrainfo'
};

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<PleiepengesøknadFormData> = {
    [AppFormField.barnetsNavn]: 'Ola Foobar',
    [AppFormField.harBekreftetOpplysninger]: true,
    [AppFormField.harForståttRettigheterOgPlikter]: true,
    [AppFormField.søkersRelasjonTilBarnet]: 'mor',
    [AppFormField.arbeidsforhold]: [organisasjonTelenor, organisasjonMaxbo],
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.periodeFra]: todaysDate,
    [AppFormField.utenlandsoppholdIPerioden]: [],
    [AppFormField.periodeTil]: moment(todaysDate)
        .add(1, 'day')
        .toDate(),
    [AppFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [AppFormField.skalTaUtFerieIPerioden]: undefined,
    [AppFormField.ferieuttakIPerioden]: []
};

jest.mock('common/utils/dateUtils', () => {
    return {
        formatDateToApiFormat: jest.fn((date: Date) => {
            const lPadNumber = (nbr: number): string => (nbr < 10 ? `${nbr}`.padStart(2, '0') : `${nbr}`);
            return `${date.getFullYear()}-${lPadNumber(date.getMonth())}-${lPadNumber(date.getDate())}`;
        }),
        apiStringDateToDate: jest.fn((date: ApiStringDate) => {
            const values = date.split('-');
            return new Date(parseInt(values[0], 10), parseInt(values[1], 10), parseInt(values[2], 10));
        })
    };
});

jest.mock('common/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed)
    };
});

const completedAttachmentMock = { uploaded: true, url: attachmentMock1.url, pending: false };

const completeFormDataMock: PleiepengesøknadFormData = {
    arbeidsforhold: [{ ...organisasjonMaxbo, erAnsattIPerioden: YesOrNo.YES }],
    barnetHarIkkeFåttFødselsnummerEnda: false,
    barnetSøknadenGjelder: barnMock[0].aktoer_id,
    harBekreftetOpplysninger: true,
    harMedsøker: YesOrNo.YES,
    harBeredskap: YesOrNo.YES,
    harNattevåk: YesOrNo.YES,
    harForståttRettigheterOgPlikter: true,
    harBeredskap_ekstrainfo: 'harBeredskap_ekstrainfo',
    harNattevåk_ekstrainfo: 'harNattevåk_ekstrainfo',
    søkersRelasjonTilBarnet: '',
    legeerklæring: [completedAttachmentMock as AttachmentMock],
    samtidigHjemme: YesOrNo.YES,
    harBoddUtenforNorgeSiste12Mnd: YesOrNo.YES,
    skalBoUtenforNorgeNeste12Mnd: YesOrNo.YES,
    søknadenGjelderEtAnnetBarn: false,
    skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
    utenlandsoppholdIPerioden: [
        {
            fom: dateUtils.apiStringDateToDate('2020-01-05'),
            tom: dateUtils.apiStringDateToDate('2020-01-07'),
            landkode: 'SE',
            erBarnetInnlagt: YesOrNo.YES
        },
        {
            fom: dateUtils.apiStringDateToDate('2020-01-08'),
            tom: dateUtils.apiStringDateToDate('2020-01-09'),
            landkode: 'US',
            erBarnetInnlagt: YesOrNo.YES,
            årsak: UtenlandsoppholdÅrsak.ANNET
        }
    ],
    skalTaUtFerieIPerioden: YesOrNo.YES,
    ferieuttakIPerioden: [
        {
            fom: dateUtils.apiStringDateToDate('2020-01-05'),
            tom: dateUtils.apiStringDateToDate('2020-01-07')
        }
    ],
    periodeFra: dateUtils.apiStringDateToDate('2020-01-01'),
    periodeTil: dateUtils.apiStringDateToDate('2020-02-01'),
    tilsynsordning: {
        skalBarnHaTilsyn: YesOrNo.YES,
        ja: {
            ekstrainfo: 'tilsynsordning-ekstrainfo',
            harEkstrainfo: YesOrNo.YES,
            tilsyn: {
                fredag: {
                    hours: 1,
                    minutes: 0
                }
            }
        }
    },
    utenlandsoppholdSiste12Mnd: [
        {
            landkode: 'SE',
            fom: new Date(2020, 1, 1),
            tom: new Date(2020, 2, 1),
            id: '345'
        }
    ],
    utenlandsoppholdNeste12Mnd: [
        {
            landkode: 'NO',
            fom: new Date(2020, 3, 1),
            tom: new Date(2020, 4, 1),
            id: '123'
        }
    ],
    barnetsNavn: 'barnets-navn',
    barnetsFødselsdato: undefined,
    barnetsFødselsnummer: 'barnets-fnr',
    harHattInntektSomFrilanser: YesOrNo.UNANSWERED
};

describe('mapFormDataToApiData', () => {
    let resultingApiData: PleiepengesøknadApiData;

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as PleiepengesøknadFormData, barnMock, 'nb');
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[AppFormField.barnetsNavn]);
    });

    it("should set 'relasjon_til_barnet' in api data correctly", () => {
        expect(resultingApiData.relasjon_til_barnet).toEqual(formDataMock[AppFormField.søkersRelasjonTilBarnet]);
    });

    it("should set 'medlemskap.skal_bo_i_utlandet_neste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.skal_bo_i_utlandet_neste_12_mnd).toBe(false);
    });

    it("should set 'medlemskap.har_bodd_i_utlandet_siste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.har_bodd_i_utlandet_siste_12_mnd).toBe(true);
    });

    it("should set 'fra_og_med' in api data correctly", () => {
        expect(dateUtils.formatDateToApiFormat).toHaveBeenCalledWith(formDataMock[AppFormField.periodeFra]);
        expect(resultingApiData.fra_og_med).toEqual(
            dateUtils.formatDateToApiFormat(formDataMock[AppFormField.periodeFra]!)
        );
    });

    it("should set 'til_og_med' in api data correctly", () => {
        expect(dateUtils.formatDateToApiFormat).toHaveBeenCalledWith(formDataMock[AppFormField.periodeTil]);
        expect(resultingApiData.til_og_med).toEqual(
            dateUtils.formatDateToApiFormat(formDataMock[AppFormField.periodeTil]!)
        );
    });

    it("should set 'vedlegg' in api data correctly by only including the urls of attachments that have been successfully uploaded", () => {
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
        expect(resultingApiData.vedlegg).toHaveLength(1);
        expect(resultingApiData.vedlegg[0]).toEqual(attachmentMock2.url);
    });

    it("should set 'fodselsnummer' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'fodselsnummer' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.fodselsnummer).toBeNull();
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsnummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result.barn.fodselsnummer).toEqual(fnr);
    });

    it("should set 'fodselsdato' in api data to null if it doesnt exist, and otherwise it should assign value to 'fodselsdato' in api data", () => {
        expect(resultingApiData.barn.fodselsdato).toBeNull();
        const fdato = new Date();
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsdato]: fdato
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result.barn.fodselsdato).toEqual(dateUtils.formatDateToApiFormat(fdato));
    });

    it('should set har_bekreftet_opplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.har_bekreftet_opplysninger).toBe(formDataMock[AppFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.har_forstatt_rettigheter_og_plikter).toBe(
            formDataMock[AppFormField.harForståttRettigheterOgPlikter]
        );
    });
});

describe('mapFormDataToApiData', () => {
    const formData: PleiepengesøknadFormData = {
        ...(formDataMock as PleiepengesøknadFormData),
        [AppFormField.harMedsøker]: YesOrNo.YES,
        arbeidsforhold: [telenorRedusertJobbing, maxboIngenJobbing]
    };

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
    });
    it('should not include samtidig_hjemme if harMedsøker is no', () => {
        const resultingApiData = mapFormDataToApiData({ ...formData, harMedsøker: YesOrNo.NO }, barnMock, 'nb');
        expect(resultingApiData.samtidig_hjemme).toBeUndefined();
    });

    it('should include samtidig_hjemme if harMedsøker is yes', () => {
        const dataHarMedsøker = { ...formData, harMedsøker: YesOrNo.YES };
        const resultingApiData = mapFormDataToApiData(dataHarMedsøker, barnMock, 'nb');
        expect(resultingApiData.samtidig_hjemme).toBeDefined();
    });

    it('should include prosentAvVanligUke when skalJobbe is redusert', () => {
        const resultApiData = mapFormDataToApiData(
            { ...formData, arbeidsforhold: [telenorRedusertJobbing] },
            barnMock,
            'nb'
        );
        const result: ArbeidsforholdApiRedusert = {
            ...organisasjonTelenor,
            jobber_normalt_timer: 20,
            skal_jobbe: 'redusert',
            skal_jobbe_prosent: 50
        };
        expect(resultApiData.arbeidsgivere.organisasjoner).toEqual([result]);
    });
    it('should include prosentAvVanligUke when skalJobbe is nei', () => {
        const {
            arbeidsgivere: { organisasjoner }
        } = mapFormDataToApiData({ ...formData, arbeidsforhold: [maxboIngenJobbing] }, barnMock, 'nb');
        const result: ArbeidsforholdApiNei = {
            ...organisasjonMaxbo,
            skal_jobbe: 'nei',
            skal_jobbe_prosent: 0
        };
        expect(organisasjoner).toEqual([result]);
    });

    it('should include correct arbeidsforhold when skalJobbe is vet_ikke', () => {
        const {
            arbeidsgivere: { organisasjoner }
        } = mapFormDataToApiData({ ...formData, arbeidsforhold: [maxboVetIkke] }, barnMock, 'nb');
        const result: ArbeidsforholdApiVetIkke = {
            ...organisasjonMaxbo,
            jobber_normalt_timer: 20,
            skal_jobbe: 'vet_ikke'
        };
        expect(organisasjoner).toEqual([result]);
        expect(organisasjoner[0].skal_jobbe_timer).toBeUndefined();
        expect(organisasjoner[0].skal_jobbe_prosent).toBeUndefined();
    });

    it('should not include arbeidsforhold where user is not ansatt', () => {
        const {
            arbeidsgivere: { organisasjoner }
        } = mapFormDataToApiData(
            { ...formData, arbeidsforhold: [{ ...maxboVetIkke, erAnsattIPerioden: YesOrNo.NO }] },
            barnMock,
            'nb'
        );
        expect(organisasjoner).toEqual([]);
    });

    it('should not include utenlandsoppholdIPerioden if skalOppholdeSegIUtlandet is NO', () => {
        const { utenlandsopphold_i_perioden } = mapFormDataToApiData(
            {
                ...formData,
                skalOppholdeSegIUtlandetIPerioden: YesOrNo.NO,
                utenlandsoppholdIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                        landkode: 'SE'
                    }
                ]
            },
            barnMock,
            'nb'
        );
        expect(utenlandsopphold_i_perioden!.opphold.length).toBe(0);
    });

    it('should include utenlandsoppholdIPerioden if skalOppholdeSegIUtlandet is YES', () => {
        const { utenlandsopphold_i_perioden } = mapFormDataToApiData(
            {
                ...formData,
                skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
                utenlandsoppholdIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date(),
                        landkode: 'SE'
                    }
                ]
            },
            barnMock,
            'nb'
        );
        expect(utenlandsopphold_i_perioden).toBeDefined();
        expect(utenlandsopphold_i_perioden!.opphold.length).toBe(1);
    });

    it('should not include ferieuttakIPerioden if skalTaUtFerieIPerioden is NO', () => {
        const { ferieuttak_i_perioden } = mapFormDataToApiData(
            {
                ...formData,
                skalTaUtFerieIPerioden: YesOrNo.NO,
                ferieuttakIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date()
                    }
                ]
            },
            barnMock,
            'nb'
        );
        expect(ferieuttak_i_perioden).toBeDefined();
        expect(ferieuttak_i_perioden!.ferieuttak.length).toBe(0);
    });
    it('should include ferieuttakIPerioden if skalTaUtFerieIPerioden is YES', () => {
        const { ferieuttak_i_perioden } = mapFormDataToApiData(
            {
                ...formData,
                skalTaUtFerieIPerioden: YesOrNo.YES,
                ferieuttakIPerioden: [
                    {
                        fom: new Date(),
                        tom: new Date()
                    }
                ]
            },
            barnMock,
            'nb'
        );
        expect(ferieuttak_i_perioden!.ferieuttak.length).toBe(1);
    });

    it('should use correct format for a complete mapped application', () => {
        const mappedData = mapFormDataToApiData(completeFormDataMock, barnMock, 'nb');

        const utenlandsoppholdISverige: BostedUtlandApiData = {
            landnavn: 'Sverige',
            landkode: 'SE',
            fra_og_med: '2020-01-05',
            til_og_med: '2020-01-07'
        };

        const utenlandsoppholdIUSA: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
            landnavn: 'USA',
            landkode: 'US',
            fra_og_med: '2020-01-08',
            til_og_med: '2020-01-09',
            er_utenfor_eos: true,
            er_barnet_innlagt: true,
            arsak: UtenlandsoppholdÅrsak.ANNET
        };

        const resultApiData: PleiepengesøknadApiData = {
            new_version: true,
            sprak: 'nb',
            barn: {
                navn: 'Mock Mocknes',
                fodselsnummer: null,
                aktoer_id: barnMock[0].aktoer_id,
                fodselsdato: '2020-00-20'
            },
            relasjon_til_barnet: null,
            arbeidsgivere: {
                organisasjoner: [
                    { navn: 'Maxbo', organisasjonsnummer: '910831143', skal_jobbe: 'ja', skal_jobbe_prosent: 100 }
                ]
            },
            medlemskap: {
                har_bodd_i_utlandet_siste_12_mnd: true,
                skal_bo_i_utlandet_neste_12_mnd: true,
                utenlandsopphold_siste_12_mnd: [
                    {
                        landnavn: 'Sverige',
                        landkode: 'SE',
                        fra_og_med: '2020-01-01',
                        til_og_med: '2020-02-01'
                    }
                ],
                utenlandsopphold_neste_12_mnd: [
                    {
                        landnavn: 'Norge',
                        landkode: 'NO',
                        fra_og_med: '2020-03-01',
                        til_og_med: '2020-04-01'
                    }
                ]
            },
            fra_og_med: '2020-01-01',
            til_og_med: '2020-02-01',
            vedlegg: ['nav.no/1'],
            har_medsoker: true,
            har_bekreftet_opplysninger: true,
            har_forstatt_rettigheter_og_plikter: true,
            utenlandsopphold_i_perioden: {
                skal_oppholde_seg_i_i_utlandet_i_perioden: true,
                opphold: [utenlandsoppholdISverige, utenlandsoppholdIUSA]
            },
            ferieuttak_i_perioden: {
                skal_ta_ut_ferie_i_periode: true,
                ferieuttak: [
                    {
                        fra_og_med: '2020-01-05',
                        til_og_med: '2020-01-07'
                    }
                ]
            },

            samtidig_hjemme: true,
            tilsynsordning: {
                svar: 'ja',
                ja: {
                    fredag: 'PT1H0M',
                    tilleggsinformasjon: 'tilsynsordning-ekstrainfo'
                }
            },
            nattevaak: {
                har_nattevaak: true,
                tilleggsinformasjon: 'harNattevåk_ekstrainfo'
            },

            beredskap: {
                i_beredskap: true,
                tilleggsinformasjon: 'harBeredskap_ekstrainfo'
            }
        };
        expect(JSON.stringify(mappedData)).toEqual(JSON.stringify(resultApiData));
    });
});
