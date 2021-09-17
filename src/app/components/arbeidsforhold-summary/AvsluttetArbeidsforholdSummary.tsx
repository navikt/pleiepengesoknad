import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdAnsattApi, ArbeidsforholdType } from '../../types/PleiepengesøknadApiData';
import './arbeidsforholdSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsattApi;
}

const bem = bemUtils('arbeidsforholdSummary');

const AvsluttetArbeidsforholdSummary = ({ arbeidsforhold }: Props) => {
    const intl = useIntl();

    const tittel = intlHelper(intl, 'arbeidsforhold.oppsummering.ansatt', {
        navn: arbeidsforhold.navn,
        organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
    });

    return (
        <div className={bem.block}>
            <div className={bem.element('tittel')}>{tittel}</div>
            <p>
                <FormattedMessage id={`arbeidsforhold.oppsummering.duHarOppgitt.${ArbeidsforholdType.ANSATT}`} />
            </p>
        </div>
    );
};

export default AvsluttetArbeidsforholdSummary;
