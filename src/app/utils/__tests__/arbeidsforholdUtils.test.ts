import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { ArbeidsforholdAnsatt } from '../../types/PleiepengesøknadFormData';
import { Arbeidsgiver } from '../../types/Søkerdata';
import {
    ansettelsesforholdGjelderSøknadsperiode,
    harAnsettelsesforholdISøknadsperiode,
    syncArbeidsforholdWithArbeidsgivere,
} from '../arbeidsforholdUtils';

const søknadsperiode: DateRange = {
    from: new Date(2020, 1, 1),
    to: new Date(2020, 2, 1),
};

const organisasjoner: Arbeidsgiver[] = [
    { navn: 'Org1', organisasjonsnummer: '1' },
    { navn: 'Org2', organisasjonsnummer: '2' },
];

const organisasjonerPartiallyEqual: Arbeidsgiver[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'NewOrg', organisasjonsnummer: 'new' },
];

const organisasjonerEqual: Arbeidsgiver[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'Org4', organisasjonsnummer: '4' },
];

const arbeidsforholdErAnsatt: ArbeidsforholdAnsatt = {
    navn: 'Org3',
    organisasjonsnummer: '3',
    erAnsatt: YesOrNo.YES,
    jobberNormaltTimer: '10',
};

const arbeidsforholdUbesvart: ArbeidsforholdAnsatt = {
    navn: 'Org4',
    organisasjonsnummer: '4',
    erAnsatt: YesOrNo.UNANSWERED,
    jobberNormaltTimer: '20',
};

const arbeidsforholdIkkeAnsatt: ArbeidsforholdAnsatt = {
    navn: 'Org5',
    organisasjonsnummer: '5',
    erAnsatt: YesOrNo.NO,
    sluttdato: '2020-01-01',
};
const arbeidsforhold: ArbeidsforholdAnsatt[] = [arbeidsforholdErAnsatt, arbeidsforholdUbesvart];

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

describe('arbeidsforholdUtils', () => {
    describe('syncArbeidsforholdWithArbeidsgivere', () => {
        it('should replace all arbeidsforhold if none present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjoner, arbeidsforhold);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(organisasjoner));
        });

        it('should keep those arbeidsforhold which still are present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjonerPartiallyEqual, arbeidsforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsatt).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('new');
        });

        it('should keep all arbeidsforhold when all are present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjonerEqual, arbeidsforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsatt).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('4');
            expect(result[1].erAnsatt).toBe(YesOrNo.UNANSWERED);
        });
    });

    describe('ansettelsesforholdGjelderSøknadsperiode()', () => {
        it('returnerer true dersom bruker erAnsatt', () => {
            expect(ansettelsesforholdGjelderSøknadsperiode(arbeidsforholdErAnsatt, søknadsperiode)).toBeTruthy();
        });
        it('returnerer true dersom bruker ikke er ansatt men har sluttet i søknadsperioden', () => {
            const sluttdato = dayjs(søknadsperiode.to).subtract(2, 'days').toDate();
            expect(
                ansettelsesforholdGjelderSøknadsperiode(
                    { ...arbeidsforholdIkkeAnsatt, sluttdato: datepickerUtils.getDateStringFromValue(sluttdato) },
                    søknadsperiode
                )
            ).toBeTruthy();
        });
        it('returnerer false dersom bruker ikke er ansatt og har sluttet før søknadsperioden', () => {
            const sluttdato = dayjs(søknadsperiode.from).subtract(1, 'days').toDate();
            expect(
                ansettelsesforholdGjelderSøknadsperiode(
                    { ...arbeidsforholdIkkeAnsatt, sluttdato: datepickerUtils.getDateStringFromValue(sluttdato) },
                    søknadsperiode
                )
            ).toBeFalsy();
        });
    });

    describe('harAnsettelsesforholdISøknadsperiode()', () => {
        it('returnerer false når søker ikke har arbeidsgivere', () => {
            expect(harAnsettelsesforholdISøknadsperiode([], søknadsperiode)).toBeFalsy();
        });
        it('returnerer false søker har arbeidsgivere, men er ikke ansatt i søknadsperiode og sluttdato er før søknadsperiode', () => {
            expect(harAnsettelsesforholdISøknadsperiode([arbeidsforholdIkkeAnsatt], søknadsperiode)).toBeFalsy();
        });

        it('returnerer true når søker er ansatt', () => {
            expect(harAnsettelsesforholdISøknadsperiode([arbeidsforholdErAnsatt], søknadsperiode)).toBeTruthy();
        });
        it('returnerer trur når søker har avsluttet arbeidsforhold i søknadsperioden', () => {
            const sluttdato = dayjs(søknadsperiode.to).subtract(2, 'days').toDate();
            expect(
                harAnsettelsesforholdISøknadsperiode(
                    [{ ...arbeidsforholdIkkeAnsatt, sluttdato: datepickerUtils.getDateStringFromValue(sluttdato) }],
                    søknadsperiode
                )
            ).toBeTruthy();
        });
    });
});
