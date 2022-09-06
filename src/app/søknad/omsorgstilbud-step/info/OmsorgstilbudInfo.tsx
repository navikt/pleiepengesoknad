import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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
            <Box>
                <ExpandableInfo
                    title={intlHelper(intl, 'steg.omsorgstilbud.veileder.ny.tittel')}
                    filledBackground={false}>
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
                </ExpandableInfo>
            </Box>

            <Box>
                <ExpandableInfo title={intlHelper(intl, 'steg.omsorgstilbud.eksempel.tittel')} filledBackground={false}>
                    <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.1')}</p>
                    <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.2')}</p>
                </ExpandableInfo>
            </Box>
            <Box>
                <ExpandableInfo
                    title={intlHelper(intl, 'steg.omsorgstilbud.info.flereBarnSamtidig.tittel')}
                    filledBackground={false}>
                    <p>
                        <FormattedMessage id="steg.omsorgstilbud.info.flereBarnSamtidig" />
                    </p>
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

const ErLiktHverUke: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'steg.omsorgstilbud.erLiktHverUke.info.tittel')}>
            <FormattedMessage id={'steg.omsorgstilbud.erLiktHverUke.info.1'} />
            <br />
            <FormattedMessage id={'steg.omsorgstilbud.erLiktHverUke.info.2'} />
        </ExpandableInfo>
    );
};

const ErIOmsorgstilbud: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud.description.tittel')}>
            <p>
                <FormattedMessage id={'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud.description.info.1.1'} />
            </p>
            <p>
                <FormattedMessage id={'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud.description.info.1.2'} />
            </p>
        </ExpandableInfo>
    );
};

const HvorMye: React.FunctionComponent = () => {
    return (
        <p>
            <FormattedMessage id={'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud.description.info.2'} />
        </p>
    );
};

const omsorgstilbudInfo = {
    stepIntro: <OmsorgstilbudStepInfo />,
    advarselSøkerKunHelgedager: <AdvarselSøkerKunHelgedager />,
    erLiktHverUke: <ErLiktHverUke />,
    erIOmsorgstilbud: <ErIOmsorgstilbud />,
    hvorMye: <HvorMye />,
};

export default omsorgstilbudInfo;
