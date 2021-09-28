import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilansApiData } from '../../../../types/PleiepengesøknadApiData';
import DatoSvar from '../enkeltsvar/DatoSvar';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';

interface Props {
    frilans?: FrilansApiData;
}

const FrilansSummary = ({ frilans }: Props) => {
    const intl = useIntl();
    return (
        <SummaryBlock header={intlHelper(intl, 'arbeidsforhold.oppsummering.frilanser')} indentChildren={true}>
            <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={frilans !== undefined} />
            </SummaryBlock>
            {frilans !== undefined && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                    </SummaryBlock>

                    {frilans.jobberFortsattSomFrilans === false && frilans.sluttdato && (
                        <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårSluttet.header')}>
                            <DatoSvar apiDato={frilans.sluttdato} />
                        </SummaryBlock>
                    )}
                    <SummaryBlock
                        header={intlHelper(
                            intl,
                            frilans.arbeidsforhold.erAktivtArbeidsforhold === false
                                ? 'frilans.arbeidsforhold.arbeidsform.avsluttet.spm'
                                : 'frilans.arbeidsforhold.arbeidsform.spm'
                        )}>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.arbeidsform.${frilans.arbeidsforhold.arbeidsform}`}
                        />
                    </SummaryBlock>
                    <SummaryBlock
                        header={intlHelper(
                            intl,
                            frilans.arbeidsforhold.erAktivtArbeidsforhold === false
                                ? `snFrilanser.arbeidsforhold.${frilans.arbeidsforhold.arbeidsform}.avsluttet.spm`
                                : `snFrilanser.arbeidsforhold.${frilans.arbeidsforhold.arbeidsform}.spm`
                        )}>
                        <FormattedMessage
                            id="timer.ikkeTall"
                            values={{ timer: frilans.arbeidsforhold.jobberNormaltTimer }}
                        />
                    </SummaryBlock>
                </>
            )}
        </SummaryBlock>
    );
};

export default FrilansSummary;
