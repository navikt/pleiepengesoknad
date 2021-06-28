import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    ArbeidsforholdAnsattApi,
    ArbeidsforholdApi,
    ArbeidsforholdType,
    isArbeidsforholdAnsattApi,
    SkalJobbe,
} from '../../types/PleiepengesøknadApiData';
import './arbeidsforholdSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdApi | ArbeidsforholdAnsattApi;
}

const bem = bemUtils('arbeidsforholdSummary');

const ArbeidsforholdSummary = ({ arbeidsforhold }: Props) => {
    const intl = useIntl();
    const { skalJobbeProsent, skalJobbeTimer, jobberNormaltTimer, skalJobbe, arbeidsform, _type } = arbeidsforhold;
    const intlValues = {
        timerNormalt: jobberNormaltTimer,
        timerRedusert: skalJobbeTimer,
        prosentRedusert: skalJobbeProsent,
        arbeidsform: intlHelper(intl, `arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`),
    };

    const tittel = isArbeidsforholdAnsattApi(arbeidsforhold)
        ? intlHelper(intl, 'arbeidsforhold.oppsummering.ansatt', {
              navn: arbeidsforhold.navn,
              organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
          })
        : _type === ArbeidsforholdType.FRILANSER
        ? intlHelper(intl, 'arbeidsforhold.oppsummering.frilanser')
        : intlHelper(intl, 'arbeidsforhold.oppsummering.selvstendig');

    return (
        <div className={bem.block}>
            <div className={bem.element('tittel')}>{tittel}</div>
            <p>
                <FormattedMessage id="arbeidsforhold.oppsummering.duHarOppgitt" />
            </p>
            <ul>
                <li>
                    <FormattedMessage id="arbeidsforhold.oppsummering.jobberVanligvis" values={intlValues} />
                </li>
                <li>
                    {skalJobbe === SkalJobbe.JA && (
                        <FormattedMessage id={`arbeidsforhold.oppsummering.skalJobbeSomVanlig`} values={intlValues} />
                    )}
                    {skalJobbe === SkalJobbe.NEI && (
                        <FormattedMessage id={`arbeidsforhold.oppsummering.skalIkkeJobbe`} />
                    )}
                    {skalJobbe === SkalJobbe.VET_IKKE && (
                        <FormattedMessage id={`arbeidsforhold.oppsummering.vetIkke`} values={intlValues} />
                    )}
                    {skalJobbe === SkalJobbe.REDUSERT && jobberNormaltTimer && (
                        <>
                            {skalJobbeTimer !== undefined ? (
                                <FormattedMessage
                                    id="arbeidsforhold.oppsummering.skalJobbeRedusert.timer"
                                    values={intlValues}
                                />
                            ) : (
                                <FormattedMessage
                                    id="arbeidsforhold.oppsummering.skalJobbeRedusert.prosent"
                                    values={intlValues}
                                />
                            )}
                        </>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default ArbeidsforholdSummary;
