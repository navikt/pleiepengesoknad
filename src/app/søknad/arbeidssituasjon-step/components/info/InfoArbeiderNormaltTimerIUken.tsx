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
        <>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.ansatt.normalTimer.info.tittel')}>
                <p>
                    <FormattedMessage id={`arbeidsforhold.normalTimer.info.turnus`} />
                </p>
                <ExpandableInfo
                    filledBackground={false}
                    title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />
                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                        </strong>
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
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                    </p>
                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                    </p>
                </ExpandableInfo>
                <p>
                    <FormattedMessage id="arbeidsforhold.ansatt.normalTimer.info" />
                </p>
            </ExpandableInfo>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.ansatt.normalTimer.info.utbetalingNav.tittel')}>
                <FormattedMessage id="arbeidsforhold.ansatt.normalTimer.info.utbetalingNav.info" />
            </ExpandableInfo>
        </>
    );
};

const InfoArbeiderNormaltTimerFrilanser = () => {
    const intl = useIntl();
    return (
        <>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.frilanser.normalTimer.info.tittel')}>
                <ExpandableInfo
                    filledBackground={false}
                    title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                        </strong>
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
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                    </p>
                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                    </p>
                </ExpandableInfo>
            </ExpandableInfo>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.frilanser.normalTimer.info.utbetalingNav.tittel')}>
                <FormattedMessage id="arbeidsforhold.frilanser.normalTimer.info.utbetalingNav.info" />
            </ExpandableInfo>
        </>
    );
};

const InfoArbeiderNormaltTimerSN = () => {
    const intl = useIntl();
    return (
        <>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.selvstendig.normalTimer.info.tittel')}>
                <ExpandableInfo
                    filledBackground={false}
                    title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                        </strong>
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
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                    </p>
                    <p>
                        <strong>
                            <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                        </strong>
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                    </p>
                </ExpandableInfo>
            </ExpandableInfo>
            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.sn.normalTimer.info.utbetalingNav.tittel')}>
                <FormattedMessage id="arbeidsforhold.sn.normalTimer.info.utbetalingNav.info" />
            </ExpandableInfo>
        </>
    );
};

export default InfoArbeiderNormaltTimerIUken;
