import {
    Field,
    PleiepengesøknadFormData,
    AnsettelsesforholdForm,
    AnsettelsesforholdSkalJobbeSvar
} from '../../types/PleiepengesøknadFormData';
import { mapFormDataToApiData } from '../mapFormDataToApiData';
import {
    PleiepengesøknadApiData,
    AnsettelsesforholdApiNei,
    AnsettelsesforholdApiRedusert,
    AnsettelsesforholdApiVetIkke
} from '../../types/PleiepengesøknadApiData';
import * as dateUtils from './../dateUtils';
import * as attachmentUtils from './../attachmentUtils';
import { YesOrNo } from '../../types/YesOrNo';
import { BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';

const moment = require('moment');

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {}
}));

const todaysDate = moment()
    .startOf('day')
    .toDate();

const barnMock: BarnReceivedFromApi[] = [
    { fodselsdato: todaysDate, fornavn: 'Mock', etternavn: 'Mocknes', aktoer_id: '123' }
];

const ansettelsesforholdTelenor: AnsettelsesforholdForm = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778'
};
const ansettelsesforholdMaxbo: AnsettelsesforholdForm = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143'
};

const telenorRedusertJobbing = {
    ...ansettelsesforholdTelenor,
    skalJobbe: AnsettelsesforholdSkalJobbeSvar.redusert,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 50
};

const maxboIngenJobbing = {
    ...ansettelsesforholdMaxbo,
    skalJobbe: AnsettelsesforholdSkalJobbeSvar.nei,
    jobberNormaltTimer: 20,
    skalJobbeProsent: 0
};

const maxboVetIkke = {
    ...ansettelsesforholdMaxbo,
    skalJobbe: AnsettelsesforholdSkalJobbeSvar.vetIkke,
    jobberNormaltTimer: 20,
    vetIkkeEkstrainfo: 'ekstrainfo'
};

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<PleiepengesøknadFormData> = {
    [Field.barnetsNavn]: 'Ola Foobar',
    [Field.harBekreftetOpplysninger]: true,
    [Field.harForståttRettigheterOgPlikter]: true,
    [Field.søkersRelasjonTilBarnet]: 'mor',
    [Field.ansettelsesforhold]: [ansettelsesforholdTelenor, ansettelsesforholdMaxbo],
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [Field.periodeFra]: todaysDate,
    [Field.periodeTil]: moment(todaysDate)
        .add(1, 'day')
        .toDate(),
    [Field.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock]
};

jest.mock('../dateUtils', () => {
    return {
        formatDate: jest.fn((date: Date) => date.toDateString())
    };
});

jest.mock('../attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed)
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: PleiepengesøknadApiData;

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as PleiepengesøknadFormData, barnMock, 'nb');
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[Field.barnetsNavn]);
    });

    it("should set 'relasjon_til_barnet' in api data correctly", () => {
        expect(resultingApiData.relasjon_til_barnet).toEqual(formDataMock[Field.søkersRelasjonTilBarnet]);
    });

    it("should set 'medlemskap.skal_bo_i_utlandet_neste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.skal_bo_i_utlandet_neste_12_mnd).toBe(false);
    });

    it("should set 'medlemskap.har_bodd_i_utlandet_siste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.har_bodd_i_utlandet_siste_12_mnd).toBe(true);
    });

    it("should set 'fra_og_med' in api data correctly", () => {
        expect(dateUtils.formatDate).toHaveBeenCalledWith(formDataMock[Field.periodeFra]);
        expect(resultingApiData.fra_og_med).toEqual(dateUtils.formatDate(formDataMock[Field.periodeFra]!));
    });

    it("should set 'til_og_med' in api data correctly", () => {
        expect(dateUtils.formatDate).toHaveBeenCalledWith(formDataMock[Field.periodeTil]);
        expect(resultingApiData.til_og_med).toEqual(dateUtils.formatDate(formDataMock[Field.periodeTil]!));
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
            [Field.barnetsFødselsnummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result.barn.fodselsnummer).toEqual(fnr);
    });

    it("should set 'alternativ_id' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'alternativ_id' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.alternativ_id).toBeNull();
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result.barn.alternativ_id).toEqual(fnr);
    });

    it("should assign fnr to 'fodselsnummer' in api data, and set 'alternativ_id' to undefined, if both barnetsFødselsnummer and barnetsForeløpigeFødselsnummerEllerDNummer has values", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.alternativ_id).toBeNull();
        const formDataWithFnr: Partial<PleiepengesøknadFormData> = {
            ...formDataMock,
            [Field.barnetsFødselsnummer]: fnr,
            [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as PleiepengesøknadFormData, barnMock, 'nb');
        expect(result.barn.alternativ_id).toBeNull();
        expect(result.barn.fodselsnummer).toEqual(fnr);
    });

    it('should set har_bekreftet_opplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.har_bekreftet_opplysninger).toBe(formDataMock[Field.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.har_forstatt_rettigheter_og_plikter).toBe(
            formDataMock[Field.harForståttRettigheterOgPlikter]
        );
    });
});

describe('mapFormDataToApiData', () => {
    const formData = { ...formDataMock };

    const formDataFeatureOn: PleiepengesøknadFormData = {
        ...(formData as PleiepengesøknadFormData),
        [Field.harMedsøker]: YesOrNo.YES,
        ansettelsesforhold: [telenorRedusertJobbing, maxboIngenJobbing]
    };
    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
    });
    it('should not include samtidig_hjemme if harMedsøker is no', () => {
        const resultingApiData = mapFormDataToApiData(
            { ...formDataFeatureOn, harMedsøker: YesOrNo.NO },
            barnMock,
            'nb'
        );
        expect(resultingApiData.samtidig_hjemme).toBeUndefined();
    });

    it('should include samtidig_hjemme if harMedsøker is yes', () => {
        const dataHarMedsøker = { ...formDataFeatureOn, harMedsøker: YesOrNo.YES };
        const resultingApiData = mapFormDataToApiData(dataHarMedsøker, barnMock, 'nb');
        expect(resultingApiData.samtidig_hjemme).toBeDefined();
    });

    it('should include prosentAvVanligUke when skalJobbe is redusert', () => {
        const resultApiData = mapFormDataToApiData(
            { ...formDataFeatureOn, ansettelsesforhold: [telenorRedusertJobbing] },
            barnMock,
            'nb'
        );
        const result: AnsettelsesforholdApiRedusert = {
            ...ansettelsesforholdTelenor,
            jobber_normalt_timer: 20,
            skal_jobbe: 'redusert',
            skal_jobbe_prosent: 50
        };
        expect(resultApiData.arbeidsgivere.organisasjoner).toEqual([result]);
    });
    it('should include prosentAvVanligUke when skalJobbe is nei', () => {
        const {
            arbeidsgivere: { organisasjoner }
        } = mapFormDataToApiData({ ...formDataFeatureOn, ansettelsesforhold: [maxboIngenJobbing] }, barnMock, 'nb');
        const result: AnsettelsesforholdApiNei = {
            ...ansettelsesforholdMaxbo,
            skal_jobbe: 'nei',
            skal_jobbe_prosent: 0
        };
        expect(organisasjoner).toEqual([result]);
    });
    it('should include correct ansettelsesdata when skalJobbe is vet_ikke', () => {
        const {
            arbeidsgivere: { organisasjoner }
        } = mapFormDataToApiData({ ...formDataFeatureOn, ansettelsesforhold: [maxboVetIkke] }, barnMock, 'nb');
        const result: AnsettelsesforholdApiVetIkke = {
            ...ansettelsesforholdMaxbo,
            jobber_normalt_timer: 20,
            skal_jobbe: 'vet_ikke',
            vet_ikke_ekstrainfo: 'ekstrainfo'
        };
        expect(organisasjoner).toEqual([result]);
        expect(organisasjoner[0].skal_jobbe_timer).toBeUndefined();
        expect(organisasjoner[0].skal_jobbe_prosent).toBeUndefined();
    });
});
