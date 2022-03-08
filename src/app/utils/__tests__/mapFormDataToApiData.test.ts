/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { dateToISOFormattedDateString } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { RegistrerteBarn, Søkerdata } from '../../types';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { isFeatureEnabled } from '../featureToggleUtils';
import { mapFormDataToApiData } from '../formToApiMaps/mapFormDataToApiData';

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

const søknadsdato: Date = dayjs().startOf('day').toDate();

const søkerdata: Søkerdata = {
    barn: [],
    // onArbeidsgivereChange: () => null,
    søker: {
        mellomnavn: 'm',
        kjønn: 'm',
        fødselsnummer: '12345678901',
        fornavn: 'a',
        etternavn: 'b',
    },
};

const barnsFødselsdato = new Date(2020, 0, 20);
const barnMock: RegistrerteBarn[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123', harSammeAdresse: true },
];

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<SøknadFormData> = {
    [SøknadFormField.barnetsNavn]: 'Ola Foobar',
    [SøknadFormField.harBekreftetOpplysninger]: true,
    [SøknadFormField.harForståttRettigheterOgPlikter]: true,
    [SøknadFormField.ansatt_arbeidsforhold]: [],
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.periodeFra]: dateToISOFormattedDateString(søknadsdato),
    [SøknadFormField.periodeTil]: dateToISOFormattedDateString(dayjs(søknadsdato).add(1, 'day').toDate()),
    [SøknadFormField.utenlandsoppholdIPerioden]: [],
    [SøknadFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [SøknadFormField.skalTaUtFerieIPerioden]: undefined,
    [SøknadFormField.ferieuttakIPerioden]: [],
    [SøknadFormField.frilans]: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.frilansoppdrag]: [],
};

jest.mock('@navikt/sif-common-core/lib/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed),
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: SøknadApiData;

    const formData: SøknadFormData = {
        ...(formDataMock as SøknadFormData),
        [SøknadFormField.harMedsøker]: YesOrNo.YES,
        ansatt_arbeidsforhold: [],
    };

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as SøknadFormData, søkerdata, barnMock, 'nb')!;
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[SøknadFormField.barnetsNavn]);
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
        const formDataWithFnr: Partial<SøknadFormData> = {
            ...formDataMock,
            [SøknadFormField.barnetsFødselsnummer]: fnr,
        };
        const result = mapFormDataToApiData(formDataWithFnr as SøknadFormData, søkerdata, barnMock, 'nb');
        expect(result).toBeDefined();
        if (result) {
            expect(result.barn.fødselsnummer).toEqual(fnr);
        }
    });

    it('should set har_bekreftet_opplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.harBekreftetOpplysninger).toBe(formDataMock[SøknadFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.harForståttRettigheterOgPlikter).toBe(
            formDataMock[SøknadFormField.harForståttRettigheterOgPlikter]
        );
    });

    it('should not include samtidig_hjemme if harMedsøker is no', () => {
        const resultingApiData = mapFormDataToApiData(
            { ...formData, harMedsøker: YesOrNo.NO },
            søkerdata,
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.samtidigHjemme).toBeUndefined();
        }
    });

    it('should include samtidig_hjemme if harMedsøker is yes', () => {
        const dataHarMedsøker = { ...formData, harMedsøker: YesOrNo.YES };
        const resultingApiData = mapFormDataToApiData(dataHarMedsøker, søkerdata, barnMock, 'nb');
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
            søkerdata,
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
            søkerdata,
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
            søkerdata,
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
            søkerdata,
            barnMock,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.ferieuttakIPerioden!.ferieuttak.length).toBe(1);
        }
    });
});
