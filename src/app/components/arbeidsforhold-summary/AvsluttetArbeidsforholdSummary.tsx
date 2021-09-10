import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { apiStringDateToDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdAnsattApi, ArbeidsforholdType } from '../../types/PleiepengesøknadApiData';
import './arbeidsforholdSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsattApi;
}

const bem = bemUtils('arbeidsforholdSummary');

const AvsluttetArbeidsforholdSummary = ({ arbeidsforhold }: Props) => {
    const intl = useIntl();
    const { sluttdato } = arbeidsforhold;
    const sluttdatoDate: Date | undefined = sluttdato ? apiStringDateToDate(sluttdato) : undefined;

    if (!sluttdatoDate) {
        return null;
    }

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
            <ul>
                <li>
                    <FormattedMessage
                        id="arbeidsforhold.oppsummering.avsluttet"
                        values={{ dato: prettifyDateFull(sluttdatoDate) }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default AvsluttetArbeidsforholdSummary;
