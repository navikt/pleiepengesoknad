import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { Arbeidsform, JobberIPeriodeSvar } from '../../../types';
import {
    AppFormField,
    ArbeidIPeriode,
    ArbeidsforholdAnsatt,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';

const arbeidIPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    jobberSomVanlig: YesOrNo.YES,
    enkeltdager: {},
};

const periode: DateRange = {
    from: new Date(2020, 1, 1),
    to: new Date(2020, 1, 12),
};

const arbeidsforholdAnsatt: ArbeidsforholdAnsatt = {
    navn: 'abc',
    organisasjonsnummer: '213',
    arbeidsform: Arbeidsform.fast,
    erAnsatt: YesOrNo.YES,
    historisk: arbeidIPeriode,
};

const formData: Partial<PleiepengesøknadFormData> = {
    [AppFormField.periodeFra]: dateToISOString(periode.from),
    [AppFormField.periodeTil]: dateToISOString(periode.to),
    [AppFormField.ansatt_arbeidsforhold]: [arbeidsforholdAnsatt],
};

describe('mapArbeidsforholdToApiData', () => {
    it('exists', () => {
        expect(formData).toBeDefined();
    });
});
