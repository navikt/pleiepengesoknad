import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    erHistorisk: boolean;
}

const OmsorgstilbudStepInfo = () => {
    const intl = useIntl();
    return (
        <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
            <p>
                <FormattedMessage id="steg.omsorgstilbud.veileder.ny.1" />
            </p>
            <p>
                <FormattedMessage id="steg.omsorgstilbud.veileder.ny.2" />
            </p>
            <p>
                <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3a" />{' '}
                <strong>
                    <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3b" />
                </strong>{' '}
                <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3c" />
            </p>
            <p>
                <FormattedMessage id="steg.omsorgstilbud.veileder.ny.4" />
            </p>
            <Box>
                <ExpandableInfo title={intlHelper(intl, 'steg.omsorgstilbud.eksempel.tittel')} filledBackground={false}>
                    <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.1')}</p>
                    <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.2')}</p>
                </ExpandableInfo>
            </Box>
        </CounsellorPanel>
    );
};

const AdvarselSøkerKunHelgedager = () => (
    <AlertStripe type="advarsel">
        <p>
            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.1" />
        </p>
        <p>
            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.2" />
        </p>
        <p>
            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.3" />
        </p>
    </AlertStripe>
);

const ErLiktHverUke: React.FunctionComponent<Props> = ({ erHistorisk }) => {
    const intl = useIntl();
    return (
        <ExpandableInfo
            title={intlHelper(
                intl,
                erHistorisk
                    ? 'steg.omsorgstilbud.historisk.erLiktHverUke.info.tittel'
                    : 'steg.omsorgstilbud.planlagt.erLiktHverUke.info.tittel'
            )}>
            <FormattedMessage
                id={
                    erHistorisk
                        ? 'steg.omsorgstilbud.historisk.erLiktHverUke.info.1'
                        : 'steg.omsorgstilbud.planlagt.erLiktHverUke.info.1'
                }
            />
            <br />
            <FormattedMessage
                id={
                    erHistorisk
                        ? 'steg.omsorgstilbud.historisk.erLiktHverUke.info.2'
                        : 'steg.omsorgstilbud.planlagt.erLiktHverUke.info.2'
                }
            />
        </ExpandableInfo>
    );
};

const ErIOmsorgstilbud: React.FunctionComponent<Props> = ({ erHistorisk }) => {
    const intl = useIntl();
    return (
        <ExpandableInfo
            title={intlHelper(
                intl,
                erHistorisk
                    ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.tittel'
                    : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
            )}>
            <p>
                <FormattedMessage
                    id={
                        erHistorisk
                            ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.info.1'
                            : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.info.1'
                    }
                />
            </p>
        </ExpandableInfo>
    );
};

const HvorMye: React.FunctionComponent<Props> = ({ erHistorisk }) => {
    return (
        <p>
            <FormattedMessage
                id={
                    erHistorisk
                        ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.info.2'
                        : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.info.2'
                }
            />
        </p>
    );
};

type PeriodeType = 'historisk' | 'planlagt';
const erHistorisk = (periode: PeriodeType) => (periode === 'historisk' ? true : false);

const omsorgstilbudInfo = {
    stepIntro: <OmsorgstilbudStepInfo />,
    advarselSøkerKunHelgedager: <AdvarselSøkerKunHelgedager />,
    erLiktHverUke: (periode: PeriodeType) => <ErLiktHverUke erHistorisk={erHistorisk(periode)} />,
    erIOmsorgstilbud: (periode: PeriodeType) => <ErIOmsorgstilbud erHistorisk={erHistorisk(periode)} />,
    hvorMye: (periode: PeriodeType) => <HvorMye erHistorisk={erHistorisk(periode)} />,
};

export default omsorgstilbudInfo;
