import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
}

const InfoArbeiderNormaltTimerIUken: React.FunctionComponent<Props> = ({ arbeidsforholdType }) => {
    switch (arbeidsforholdType) {
        case ArbeidsforholdType.ANSATT:
            return <InfoArbeiderNormaltTimerAnsatt />;
        case ArbeidsforholdType.FRILANSER:
            return <InfoArbeiderNormaltTimerFrilanser />;
        case ArbeidsforholdType.SELVSTENDIG:
            return <InfoArbeiderNormaltTimerSN />;
    }
};

const InfoArbeiderNormaltTimerAnsatt = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.tittel')}>
            <FormattedMessage id={`arbeidsforhold.ansatt.normalTimer.info`} />

            <ul style={{ paddingInlineStart: '20px' }}>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.1'} />
                </li>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.2'} />
                </li>
            </ul>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.utbetalingFraNAV.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.utbetalingFraNAV.avsnitt.1'} />
            </ExpandableInfo>
        </ExpandableInfo>
    );
};

const InfoArbeiderNormaltTimerFrilanser = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.tittel')}>
            <FormattedMessage id={`arbeidsforhold.frilanser.normalTimer.info`} />

            <ul style={{ paddingInlineStart: '20px' }}>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.1'} />
                </li>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.2'} />
                </li>
                <li>
                    Hvis du har veldig små frilansoppdrag som for eksempel styreverv tar du utgangspunkt i antall timer
                    på et helt år når du skal regne snitt per uke.
                </li>
                <li>
                    Hvis du har omsorgsstønad må du ta utgangspunkt i hvor mange timer du har fått tildelt omsorgsstønad
                    for.
                </li>
            </ul>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                </p>
            </ExpandableInfo>

            <ExpandableInfo filledBackground={false} title="Hvordan regner jeg ut et snitt ved små frilansoppdrag?">
                Du regner ut et snitt ved å legge sammen antall timer du totalt har jobbet de siste 12 måneder og deler
                dette på 52. Hvis du ikke har hatt frilansoppdrag i minst 12 måneder tar du utgangspunkt i så mange
                måneder du har vært frilanser og deler på antall uker dette tilsvarer.
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title="Hvordan regner jeg ut et snitt når jeg mottar omsorgsstønad">
                Du må sjekke i kontrakten du har fått fra kommunen om hvor mange timer du er tildelt omsorgsstønad for.
                Hvis det ikke er opplyst et timeantall per uke må du regne det om til uke. F.eks. om du har fått et
                timeantall for en hel måned må du dele dette på 4.
            </ExpandableInfo>
        </ExpandableInfo>
    );
};

const InfoArbeiderNormaltTimerSN = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.tittel')}>
            <FormattedMessage id={`arbeidsforhold.selvstendig.normalTimer.info`} />

            <ul style={{ paddingInlineStart: '20px' }}>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.1'} />
                </li>
                <li>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.2'} />
                </li>
            </ul>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                </p>
            </ExpandableInfo>
        </ExpandableInfo>
    );
};

export default InfoArbeiderNormaltTimerIUken;
