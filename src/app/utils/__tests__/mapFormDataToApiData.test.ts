/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { dateToISOFormattedDateString } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { RegistrerteBarn } from '../../types';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/Søknadsdata';
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
const søknadsperiode = { from: søknadsdato, to: dayjs(søknadsdato).add(1, 'day').toDate() };
const barnsFødselsdato = new Date(2020, 0, 20);
const barnMock: RegistrerteBarn[] = [
    { fødselsdato: barnsFødselsdato, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123', harSammeAdresse: true },
];
const søknadsdata: Søknadsdata = {
    søknadsperiode,
    medlemskap: {
        type: 'harIkkeBoddSkalIkkeBo',
        harBoddUtenforNorgeSiste12Mnd: false,
        skalBoUtenforNorgeNeste12Mnd: false,
    },
    barn: {
        type: 'registrerteBarn',
        aktørId: '123',
    },
};

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: SøknadFormData = {
    [SøknadFormField.harBekreftetOpplysninger]: true,
    [SøknadFormField.harForståttRettigheterOgPlikter]: true,
    [SøknadFormField.barnetsNavn]: 'Ola Foobar',
    [SøknadFormField.barnetsFødselsnummer]: '',
    [SøknadFormField.barnetSøknadenGjelder]: '12312312312',
    [SøknadFormField.barnetHarIkkeFnr]: false,
    [SøknadFormField.søknadenGjelderEtAnnetBarn]: false,
    [SøknadFormField.harMedsøker]: YesOrNo.NO,
    [SøknadFormField.samtidigHjemme]: YesOrNo.NO,
    [SøknadFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [SøknadFormField.harBeredskap]: YesOrNo.UNANSWERED,
    [SøknadFormField.ansatt_arbeidsforhold]: [],
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.NO,
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.periodeFra]: dateToISOFormattedDateString(søknadsperiode.from),
    [SøknadFormField.periodeTil]: dateToISOFormattedDateString(søknadsperiode.to),
    [SøknadFormField.utenlandsoppholdIPerioden]: [],
    [SøknadFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [SøknadFormField.skalTaUtFerieIPerioden]: undefined,
    [SøknadFormField.ferieuttakIPerioden]: [],
    [SøknadFormField.frilans]: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.selvstendig]: {
        harHattInntektSomSN: YesOrNo.UNANSWERED,
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
        resultingApiData = mapFormDataToApiData(formDataMock as SøknadFormData, barnMock, søknadsdata, 'nb')!;
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
            barnMock,
            søknadsdata,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.samtidigHjemme).toBeUndefined();
        }
    });

    it('should include samtidig_hjemme if harMedsøker is yes', () => {
        const dataHarMedsøker = { ...formData, harMedsøker: YesOrNo.YES };
        const resultingApiData = mapFormDataToApiData(dataHarMedsøker, barnMock, søknadsdata, 'nb');
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
            søknadsdata,
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
            søknadsdata,
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
            søknadsdata,
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
            søknadsdata,
            'nb'
        );
        expect(resultingApiData).toBeDefined();
        if (resultingApiData) {
            expect(resultingApiData.ferieuttakIPerioden!.ferieuttak.length).toBe(1);
        }
    });
});
