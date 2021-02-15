import * as React from 'react';
import { useIntl } from 'react-intl';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import BackLink from '@navikt/sif-common-core/lib/components/back-link/BackLink';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import AvbrytSøknadDialog from '@navikt/sif-common-core/lib/components/dialogs/avbrytSøknadDialog/AvbrytSøknadDialog';
import FortsettSøknadSenereDialog from '@navikt/sif-common-core/lib/components/dialogs/fortsettSøknadSenereDialog/FortsettSøknadSenereDialog';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik';
import { History } from 'history';
import { Innholdstittel } from 'nav-frontend-typografi';
import { purge } from '../../api/api';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../../config/stepConfig';
import { navigateToNAVno, navigateToWelcomePage } from '../../utils/navigationUtils';
import { getStepTexts } from '../../utils/stepUtils';
import StepIndicator from '../step-indicator/StepIndicator';
import StepFooter from '../stepFooter/StepFooter';
import './step.less';

export interface StepProps {
    id: StepID;
    useValidationErrorSummary?: boolean;
}

interface OwnProps {
    stepConfig: StepConfigInterface;
    children: React.ReactNode;
}

type Props = OwnProps & StepProps;

const bem = bemHelper('step');

const Step = ({ id, useValidationErrorSummary, stepConfig, children }: Props) => {
    const conf = stepConfig[id];
    const intl = useIntl();
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);
    const [visAvbrytDialog, setVisAvbrytDialog] = React.useState<boolean>(false);
    const [visFortsettSenereDialog, setVisFortsettSenereDialog] = React.useState<boolean>(false);

    const { logHendelse } = useAmplitudeInstance();

    const handleAvbrytSøknad = async () => {
        await purge();
        await logHendelse(ApplikasjonHendelse.avbryt);
        navigateToWelcomePage();
    };

    const handleAvsluttOgFortsettSenere = async () => {
        await logHendelse(ApplikasjonHendelse.avbryt);
        navigateToNAVno();
    };

    return (
        <Page
            className={bem.block}
            title={stepTexts.pageTitle}
            topContentRenderer={() => (
                <>
                    <StepBanner text={intlHelper(intl, 'application.title')} />
                    {useValidationErrorSummary !== false && <FormikValidationErrorSummary />}
                </>
            )}>
            {conf.backLinkHref && (
                <BackLink
                    href={conf.backLinkHref}
                    className={bem.element('backLink')}
                    onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                        event.preventDefault();
                        history.push(nextHref);
                    }}
                />
            )}

            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xxl">
                <Innholdstittel tag="h1" className={bem.element('title')}>
                    {stepTexts.stepTitle}
                </Innholdstittel>
            </Box>
            <Box margin="xl">{children}</Box>
            <StepFooter
                onFortsettSenere={() => setVisFortsettSenereDialog(true)}
                onAvbryt={() => setVisAvbrytDialog(true)}
            />
            <FortsettSøknadSenereDialog
                synlig={visFortsettSenereDialog}
                onFortsettSøknadSenere={() => handleAvsluttOgFortsettSenere()}
                onFortsettSøknad={() => setVisFortsettSenereDialog(false)}
            />
            <AvbrytSøknadDialog
                synlig={visAvbrytDialog}
                onAvbrytSøknad={() => handleAvbrytSøknad()}
                onFortsettSøknad={() => setVisAvbrytDialog(false)}
            />
        </Page>
    );
};

export default Step;
