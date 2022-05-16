import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdFormData } from '../../../../types/ArbeidsforholdFormData';
import { Arbeidsgiver, ArbeidsgiverType } from '../../../../types/Arbeidsgiver';
import { syncAnsattArbeidsforhold } from '../arbeidsgivereUtils';

const organisasjoner: Arbeidsgiver[] = [
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org1', id: '1' },
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org2', id: '2' },
];

const arbeidsforholdOrganisasjoner: ArbeidsforholdFormData[] = [
    {
        arbeidsgiver: { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org1', id: '1' },
    },
    {
        arbeidsgiver: { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org2', id: '2' },
    },
];

const organisasjonerPartiallyEqual: Arbeidsgiver[] = [
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org3', id: '3' },
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'NewOrg', id: 'new' },
];

const organisasjonerEqual: Arbeidsgiver[] = [
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org3', id: '3' },
    { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org4', id: '4' },
];

const arbeidsforholdErAnsatt: ArbeidsforholdFormData = {
    arbeidsgiver: {
        type: ArbeidsgiverType.ORGANISASJON,
        navn: 'Org3',
        id: '3',
    },
    erAnsatt: YesOrNo.YES,
    normalarbeidstid: {
        timerPerUke: '10',
    },
};

const arbeidsforholdUbesvart: ArbeidsforholdFormData = {
    arbeidsgiver: {
        type: ArbeidsgiverType.ORGANISASJON,
        navn: 'Org4',
        id: '4',
    },
    erAnsatt: YesOrNo.UNANSWERED,
    normalarbeidstid: {
        timerPerUke: '20',
    },
};

const arbeidsforhold: ArbeidsforholdFormData[] = [arbeidsforholdErAnsatt, arbeidsforholdUbesvart];

jest.mock('../../../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

describe('syncArbeidsforholdWithArbeidsgivere', () => {
    it('should replace all arbeidsforhold if none present in arbeidsgivere', () => {
        const result = syncAnsattArbeidsforhold(organisasjoner, arbeidsforhold);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(arbeidsforholdOrganisasjoner));
    });

    it('should keep those arbeidsforhold which still are present in arbeidsgivere', () => {
        const result = syncAnsattArbeidsforhold(organisasjonerPartiallyEqual, arbeidsforhold);
        expect(result[0]?.arbeidsgiver?.id).toBe('3');
        expect(result[0].erAnsatt).toBe(YesOrNo.YES);
        expect(result[1].arbeidsgiver?.id).toBe('new');
    });

    it('should keep all arbeidsforhold when all are present in arbeidsgivere', () => {
        const result = syncAnsattArbeidsforhold(organisasjonerEqual, arbeidsforhold);
        expect(result[0].arbeidsgiver?.id).toBe('3');
        expect(result[0].erAnsatt).toBe(YesOrNo.YES);
        expect(result[1].arbeidsgiver?.id).toBe('4');
        expect(result[1].erAnsatt).toBe(YesOrNo.UNANSWERED);
    });
});
