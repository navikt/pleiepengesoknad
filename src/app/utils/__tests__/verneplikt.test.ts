import { Arbeidsgiver } from '../../types/Søkerdata';
import { AppFormField, ArbeidsforholdAnsatt, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { visVernepliktSpørsmål } from '../../components/steps/arbeidsforholdStep/ArbeidsforholdStep';

const organisasjonTelenor: Arbeidsgiver = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
};

const organisasjonTelenorNO: ArbeidsforholdAnsatt = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
    erAnsattIPerioden: YesOrNo.NO,
};

export const organisasjonTelenorYES: ArbeidsforholdAnsatt = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
    erAnsattIPerioden: YesOrNo.YES,
};
const organisasjonMaxbo: ArbeidsforholdAnsatt = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
};
export const organisasjonMaxboNO: ArbeidsforholdAnsatt = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
    erAnsattIPerioden: YesOrNo.NO,
};

export const organisasjonMaxboYES: ArbeidsforholdAnsatt = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
    erAnsattIPerioden: YesOrNo.YES,
};

export const formDataMock: Partial<PleiepengesøknadFormData> = {
    [AppFormField.arbeidsforhold]: [{ ...organisasjonTelenor }, { ...organisasjonMaxbo }],
    frilans_harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
};

describe('Check visVernepliktSpørsmål function', () => {
    const data_frilans_harHattInntektSomFrilanserNo: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
    };

    const data_frilans_harHattInntektSomFrilanserYES: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        frilans_harHattInntektSomFrilanser: YesOrNo.YES,
    };

    const data_selvstendig_harHattInntektSomSNNO: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
    };

    const data_selvstendig_harHattInntektSomSNYES: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        selvstendig_harHattInntektSomSN: YesOrNo.YES,
    };

    const data_FrilanserOgSelvstendigNO: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
    };

    const data_FrilanserOgSelvstendigYES: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        frilans_harHattInntektSomFrilanser: YesOrNo.YES,
        selvstendig_harHattInntektSomSN: YesOrNo.YES,
    };

    const data_no_organizations: Partial<PleiepengesøknadFormData> = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [],
    };

    const data_no_organizations_Frilanser_NO: Partial<PleiepengesøknadFormData> = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [],
    };

    const data_no_organizations_SelvstendigNO: Partial<PleiepengesøknadFormData> = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [],
    };

    const data_no_organizations_FrilanserOgSelvstendigNO: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [],
    };

    const data_FrilanserOgSelvstendigNO_one_of_two_org_NO: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserOgSelvstendigUNANSWERED_one_of_two_org_NO: Partial<PleiepengesøknadFormData> = {
        ...formDataMock,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserNO_SelvstendigUNANSWERED_one_of_two_org_NO: Partial<PleiepengesøknadFormData> = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_NO: Partial<PleiepengesøknadFormData> = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };
    const data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxbo],
    };
    const data_FrilanserUNANSWERED_SelvstendigNO_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserNO_SelvstendigUNANSWERED_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigNO_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };
    const data_FrilanserSelvstendigYES_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };
    const data_FrilanserYES_SelvstendigNO_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_frilans_harHattInntektSomFrilanserYES,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserNO_SelvstendigYES_and_two_org_YES: Partial<PleiepengesøknadFormData> = {
        ...data_selvstendig_harHattInntektSomSNYES,
        frilans_harHattInntektSomFrilanser: YesOrNo.NO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigYES_and_two_org_NO: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigYES_and_no_organizations: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [],
    };

    const data_every_questions_NO: Partial<PleiepengesøknadFormData> = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxboNO],
    };

    it("Do not show verneplikt question (return false) if every questions 'UNANSWERED' ", () => {
        const resultingApiData = visVernepliktSpørsmål(formDataMock as PleiepengesøknadFormData);
        expect(resultingApiData).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if harHattInntektSomFrilanserNo and every another questions 'UNANSWERED' ", () => {
        const result = visVernepliktSpørsmål(data_frilans_harHattInntektSomFrilanserNo as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if selvstendig_harHattInntektSomSN and every another questions 'UNANSWERED' ", () => {
        const result = visVernepliktSpørsmål(data_selvstendig_harHattInntektSomSNNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'NO' and arbeidsgiver.erAnsattIPerioden 'UNANSWERED' ", () => {
        const result = visVernepliktSpørsmål(data_FrilanserOgSelvstendigNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'UNANSWERED' and user has no arbeidsgiver ", () => {
        const result = visVernepliktSpørsmål(data_no_organizations as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser - 'NO' and selvstendig - 'UNANSWERED' and user has no arbeidsgiver ", () => {
        const result = visVernepliktSpørsmål(data_no_organizations_Frilanser_NO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser - 'UNANSWERED' and selvstendig - 'NO' and user has no arbeidsgiver ", () => {
        const result = visVernepliktSpørsmål(data_no_organizations_SelvstendigNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'UNANSWERED' and user has arbeidsgiver but one of two org NO", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserOgSelvstendigUNANSWERED_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'NO' and user has arbeidsgiver but one of two org NO", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserOgSelvstendigNO_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser -'NO' and selvstendig - 'UNANSWERED' and user has arbeidsgiver but one of two org NO", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserNO_SelvstendigUNANSWERED_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver but one of two org NO", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver but one of two org YES", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserUNANSWERED_SelvstendigNO_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser -'NO' and selvstendig - 'UNANSWERED' and user has arbeidsgiver and two org YES", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserNO_SelvstendigUNANSWERED_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = visVernepliktSpørsmål(data_FrilanserSelvstendigNO_and_two_org_YES as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it('Do not show verneplikt question (return false) if every questions YES', () => {
        const result = visVernepliktSpørsmål(data_FrilanserSelvstendigYES_and_two_org_YES as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser 'YES' and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserYES_SelvstendigNO_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });
    it("Do not show verneplikt question (return false) if frilanser 'NO' and selvstendig - 'YES' and user has arbeidsgiver and two org YES", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserNO_SelvstendigYES_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'YES' and user has arbeidsgiver and two org NO", () => {
        const result = visVernepliktSpørsmål(data_FrilanserSelvstendigYES_and_two_org_NO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("Do not show verneplikt question (return false) if frilanser and selvstendig - 'YES' and user has no arbeidsgiver", () => {
        const result = visVernepliktSpørsmål(
            data_FrilanserSelvstendigYES_and_no_organizations as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("Show 'verneplikt' question (return true) when every questions - 'NO'", () => {
        const result = visVernepliktSpørsmål(data_every_questions_NO as PleiepengesøknadFormData);
        expect(result).toBeTruthy();
    });

    it("Show 'verneplikt' question (return true) if frilanser and selvstendig - 'NO' and user has no arbeidsgiver ", () => {
        const result = visVernepliktSpørsmål(
            data_no_organizations_FrilanserOgSelvstendigNO as PleiepengesøknadFormData
        );
        expect(result).toBeTruthy();
    });
});
