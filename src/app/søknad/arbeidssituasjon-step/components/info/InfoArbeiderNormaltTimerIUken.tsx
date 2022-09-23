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
            <p>
                <FormattedMessage id={`arbeidsforhold.frilanser.normalTimer.info.1`} />
            </p>
            <p>
                <FormattedMessage id={`arbeidsforhold.frilanser.normalTimer.info.2`} />
            </p>

            <ul style={{ paddingInlineStart: '20px' }}>
                <li>
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
                </li>
                <li>
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
                </li>
                <li>
                    <ExpandableInfo
                        title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.småoppdrag.tittel')}
                        filledBackground={false}>
                        <FormattedMessage id="arbeidsforhold.normalTimer.info.småoppdrag.tekst" />
                    </ExpandableInfo>
                </li>
                <li>
                    <ExpandableInfo
                        title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.omsorgsstønad.tittel')}
                        filledBackground={false}>
                        <FormattedMessage id="arbeidsforhold.normalTimer.info.omsorgsstønad.tekst" />
                    </ExpandableInfo>
                </li>
            </ul>
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
