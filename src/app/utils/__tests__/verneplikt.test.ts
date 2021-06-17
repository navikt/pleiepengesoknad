import { Arbeidsgiver } from '../../types/Søkerdata';
import { AppFormField, Arbeidsforhold, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { erIkkeAnsattEllerFSN } from '../../components/steps/arbeidsforholdStep/ArbeidsforholdStep';

const organisasjonTelenor: Arbeidsgiver = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
};

const organisasjonTelenorNO: Arbeidsforhold = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
    erAnsattIPerioden: YesOrNo.NO,
};

export const organisasjonTelenorYES: Arbeidsforhold = {
    navn: 'Telenor',
    organisasjonsnummer: '973861778',
    erAnsattIPerioden: YesOrNo.YES,
};
const organisasjonMaxbo: Arbeidsforhold = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
};
export const organisasjonMaxboNO: Arbeidsforhold = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
    erAnsattIPerioden: YesOrNo.NO,
};

export const organisasjonMaxboYES: Arbeidsforhold = {
    navn: 'Maxbo',
    organisasjonsnummer: '910831143',
    erAnsattIPerioden: YesOrNo.YES,
};

export const formDataMock: Partial<PleiepengesøknadFormData> = {
    [AppFormField.arbeidsforhold]: [{ ...organisasjonTelenor }, { ...organisasjonMaxbo }],
    harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
};

describe('Check erIkkeAnsattEllerFSN function', () => {
    it("return false if every questions 'UNANSWERED' ", () => {
        const resultingApiData = erIkkeAnsattEllerFSN(formDataMock as PleiepengesøknadFormData);
        expect(resultingApiData).toBeFalsy();
    });

    const data_frilans_harHattInntektSomFrilanserNo = {
        ...formDataMock,
        harHattInntektSomFrilanser: YesOrNo.NO,
    };

    const data_frilans_harHattInntektSomFrilanserYES = {
        ...formDataMock,
        harHattInntektSomFrilanser: YesOrNo.YES,
    };

    const data_selvstendig_harHattInntektSomSNNO = {
        ...formDataMock,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
    };

    const data_selvstendig_harHattInntektSomSNYES = {
        ...formDataMock,
        selvstendig_harHattInntektSomSN: YesOrNo.YES,
    };

    const data_FrilanserOgSelvstendigNO = {
        ...formDataMock,
        harHattInntektSomFrilanser: YesOrNo.NO,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
    };

    const data_FrilanserOgSelvstendigYES = {
        ...formDataMock,
        harHattInntektSomFrilanser: YesOrNo.YES,
        selvstendig_harHattInntektSomSN: YesOrNo.YES,
    };

    const data_no_organizations = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [],
    };

    const data_no_organizations_Frilanser_NO = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [],
    };

    const data_no_organizations_SelvstendigNO = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [],
    };

    const data_no_organizations_FrilanserOgSelvstendigNO = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [],
    };

    const data_FrilanserOgSelvstendigNO_one_of_two_org_NO = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserOgSelvstendigUNANSWERED_one_of_two_org_NO = {
        ...formDataMock,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserNO_SelvstendigUNANSWERED_one_of_two_org_NO = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };

    const data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_NO = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxbo],
    };
    const data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_YES = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxbo],
    };
    const data_FrilanserUNANSWERED_SelvstendigNO_and_two_org_YES = {
        ...data_selvstendig_harHattInntektSomSNNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserNO_SelvstendigUNANSWERED_and_two_org_YES = {
        ...data_frilans_harHattInntektSomFrilanserNo,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigNO_and_two_org_YES = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };
    const data_FrilanserSelvstendigYES_and_two_org_YES = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };
    const data_FrilanserYES_SelvstendigNO_and_two_org_YES = {
        ...data_frilans_harHattInntektSomFrilanserYES,
        selvstendig_harHattInntektSomSN: YesOrNo.NO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserNO_SelvstendigYES_and_two_org_YES = {
        ...data_selvstendig_harHattInntektSomSNYES,
        harHattInntektSomFrilanser: YesOrNo.NO,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigYES_and_two_org_NO = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [organisasjonTelenorYES, organisasjonMaxboYES],
    };

    const data_FrilanserSelvstendigYES_and_no_organizations = {
        ...data_FrilanserOgSelvstendigYES,
        arbeidsforhold: [],
    };

    const data_every_questions_NO = {
        ...data_FrilanserOgSelvstendigNO,
        arbeidsforhold: [organisasjonTelenorNO, organisasjonMaxboNO],
    };

    it("return false if harHattInntektSomFrilanserNo and every another questions 'UNANSWERED' ", () => {
        const result = erIkkeAnsattEllerFSN(data_frilans_harHattInntektSomFrilanserNo as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if selvstendig_harHattInntektSomSN and every another questions 'UNANSWERED' ", () => {
        const result = erIkkeAnsattEllerFSN(data_selvstendig_harHattInntektSomSNNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'NO' and arbeidsgiver.erAnsattIPerioden 'UNANSWERED' ", () => {
        const result = erIkkeAnsattEllerFSN(data_FrilanserOgSelvstendigNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'UNANSWERED' and user has no arbeidsgiver ", () => {
        const result = erIkkeAnsattEllerFSN(data_no_organizations as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser - 'NO' and selvstendig - 'UNANSWERED' and user has no arbeidsgiver ", () => {
        const result = erIkkeAnsattEllerFSN(data_no_organizations_Frilanser_NO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser - 'UNANSWERED' and selvstendig - 'NO' and user has no arbeidsgiver ", () => {
        const result = erIkkeAnsattEllerFSN(data_no_organizations_SelvstendigNO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'UNANSWERED' and user has arbeidsgiver but one of two org NO", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserOgSelvstendigUNANSWERED_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'NO' and user has arbeidsgiver but one of two org NO", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserOgSelvstendigNO_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser -'NO' and selvstendig - 'UNANSWERED' and user has arbeidsgiver but one of two org NO", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserNO_SelvstendigUNANSWERED_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver but one of two org NO", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_NO as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver but one of two org YES", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserUNANSWERED_SelvstendigNO_one_of_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser -'UNANSWERED' and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserUNANSWERED_SelvstendigNO_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser -'NO' and selvstendig - 'UNANSWERED' and user has arbeidsgiver and two org YES", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserNO_SelvstendigUNANSWERED_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = erIkkeAnsattEllerFSN(data_FrilanserSelvstendigNO_and_two_org_YES as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it('return false if every questions YES', () => {
        const result = erIkkeAnsattEllerFSN(data_FrilanserSelvstendigYES_and_two_org_YES as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser 'YES' and selvstendig - 'NO' and user has arbeidsgiver and two org YES", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserYES_SelvstendigNO_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });
    it("return false if frilanser 'NO' and selvstendig - 'YES' and user has arbeidsgiver and two org YES", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserNO_SelvstendigYES_and_two_org_YES as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'YES' and user has arbeidsgiver and two org NO", () => {
        const result = erIkkeAnsattEllerFSN(data_FrilanserSelvstendigYES_and_two_org_NO as PleiepengesøknadFormData);
        expect(result).toBeFalsy();
    });

    it("return false if frilanser and selvstendig - 'YES' and user has no arbeidsgiver", () => {
        const result = erIkkeAnsattEllerFSN(
            data_FrilanserSelvstendigYES_and_no_organizations as PleiepengesøknadFormData
        );
        expect(result).toBeFalsy();
    });

    it("return true every questions - 'NO'", () => {
        const result = erIkkeAnsattEllerFSN(data_every_questions_NO as PleiepengesøknadFormData);
        expect(result).toBeTruthy();
    });

    it("return true if frilanser and selvstendig - 'NO' and user has no arbeidsgiver ", () => {
        const result = erIkkeAnsattEllerFSN(data_no_organizations_FrilanserOgSelvstendigNO as PleiepengesøknadFormData);
        expect(result).toBeTruthy();
    });
});
