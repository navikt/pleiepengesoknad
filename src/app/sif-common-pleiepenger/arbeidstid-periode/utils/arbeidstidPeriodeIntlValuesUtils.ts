import { IntlShape } from 'react-intl';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { DateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeIntlValues, ArbeidsforholdType } from '../../../types';
import { getArbeidstidPeriodeIntl } from '../i18n/arbeidstidPeriodeMessages';

export const getArbeidstidIPeriodeIntlValues = (
    intl: IntlShape,
    info: {
        periode: DateRange;
        arbeidsforhold:
            | {
                  type: ArbeidsforholdType.ANSATT;
                  arbeidsstedNavn: string;
                  jobberNormaltTimer: string | number | undefined;
              }
            | {
                  type: ArbeidsforholdType.FRILANSER | ArbeidsforholdType.SELVSTENDIG;
                  jobberNormaltTimer: string | number | undefined;
              };
    }
): ArbeidIPeriodeIntlValues => {
    const arbIntl = getArbeidstidPeriodeIntl(intl);
    const getTimerTekst = (): string => {
        const timer =
            typeof info.arbeidsforhold.jobberNormaltTimer === 'number'
                ? info.arbeidsforhold.jobberNormaltTimer
                : getNumberFromNumberInputValue(info.arbeidsforhold.jobberNormaltTimer);
        return timer !== undefined
            ? arbIntl.intlText('arbeidstidPeriode.timer', { timer })
            : arbIntl.intlText('arbeidstidPeriode.timer.ikkeTall', {
                  timer: info.arbeidsforhold.jobberNormaltTimer || '-',
              });
    };

    const getHvorTekst = () => {
        switch (info.arbeidsforhold.type) {
            case ArbeidsforholdType.ANSATT:
                return arbIntl.intlText('arbeidstidPeriode.arbeidIPeriodeIntlValues.somAnsatt', {
                    arbeidsstedNavn: info.arbeidsforhold.arbeidsstedNavn,
                });
            case ArbeidsforholdType.FRILANSER:
                return arbIntl.intlText('arbeidstidPeriode.arbeidIPeriodeIntlValues.somFrilanser');
            case ArbeidsforholdType.SELVSTENDIG:
                return arbIntl.intlText('arbeidstidPeriode.arbeidIPeriodeIntlValues.somSN');
        }
    };

    return {
        skalEllerHarJobbet: arbIntl.intlText('arbeidstidPeriode.arbeidIPeriodeIntlValues.skalJobbe'),
        hvor: getHvorTekst(),
        timer: getTimerTekst(),
        fra: prettifyDateFull(info.periode.from),
        til: prettifyDateFull(info.periode.to),
        iPerioden: arbIntl.intlText('arbeidstidPeriode.arbeidIPeriodeIntlValues.iPerioden', {
            fra: prettifyDate(info.periode.from),
            til: prettifyDate(info.periode.to),
        }),
    };
};
