import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriode } from '../../../types/PleiepengesøknadFormData';
import { getHistoriskArbeidIArbeidsforhold, getPlanlagtArbeidIArbeidsforhold } from '../mapArbeidsforholdToApiData';

// const søknadsdato = apiStringDateToDate('2021-02-06');

// const søknadsperiode: DateRange = {
//     from: apiStringDateToDate('2021-02-01'),
//     to: apiStringDateToDate('2021-02-10'),
// };

const historiskPeriode: DateRange = {
    from: apiStringDateToDate('2021-02-01'),
    to: apiStringDateToDate('2021-02-05'),
};

const planlagtPeriode: DateRange = {
    from: apiStringDateToDate('2021-02-06'),
    to: apiStringDateToDate('2021-02-10'),
};

const arbeidHistoriskPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    jobberSomVanlig: YesOrNo.NO,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2021-02-01': { hours: '2' },
    },
};

const arbeidPlanlagtPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    jobberSomVanlig: YesOrNo.NO,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2021-02-07': { hours: '2' },
    },
};

// const arbeidsforholdAnsatt: ArbeidsforholdAnsatt = {
//     navn: 'abc',
//     organisasjonsnummer: '213',
//     arbeidsform: Arbeidsform.fast,
//     erAnsatt: YesOrNo.YES,
//     historisk: arbeidIPeriode,
// };

// const formData: Partial<PleiepengesøknadFormData> = {
//     [AppFormField.periodeFra]: dateToISOString(søknadsperiode.from),
//     [AppFormField.periodeTil]: dateToISOString(søknadsperiode.to),
//     [AppFormField.ansatt_arbeidsforhold]: [arbeidsforholdAnsatt],
// };

describe('mapArbeidsforholdToApiData', () => {
    describe('getHistoriskArbeidIArbeidsforhold', () => {
        it('returnerer undefined dersom søker kun planlagt', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerHistorisk: false,
                søkerPlanlagt: true,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result).toBeUndefined();
        });
        it('returnerer jobberIPerioden: JA på historisk arbeid dersom søker kun historisk', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: false,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        });
        it('returnerer jobberIPerioden: JA på historisk arbeid dersom søker historisk og planlagt', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: true,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        });
        it('returnerer jobberIPerioden: NEI på historisk arbeid dersom søker historisk, men historiskArbeid er undefined', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: true,
                arbeidHistoriskPeriode: undefined,
                historiskPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
        });
    });
    describe('getPlanlagtArbeidIArbeidsforhold', () => {
        it('returnerer undefined dersom søker kun historisk', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: false,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result).toBeUndefined();
        });
        it('returnerer jobberIPerioden: JA på planlagt arbeid dersom søker kun planlagt', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerHistorisk: false,
                søkerPlanlagt: true,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        });
        it('returnerer jobberIPerioden: JA på planlagt arbeid dersom søker historisk og planlagt', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: true,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        });
        it('returnerer jobberIPerioden: NEI på planlagt arbeid dersom søker planlagt, men planlagtArbeid er undefined', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerHistorisk: true,
                søkerPlanlagt: true,
                arbeidPlanlagtPeriode: undefined,
                planlagtPeriode,
            });
            expect(result?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
        });
    });
});
