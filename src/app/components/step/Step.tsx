import * as React from 'react';
import { useIntl } from 'react-intl';
import BackLink from '@navikt/sif-common-core/lib/components/back-link/BackLink';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import StepFooter from '@navikt/sif-common-core/lib/components/step-footer/StepFooter';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik';
import { History } from 'history';
import { Innholdstittel } from 'nav-frontend-typografi';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../../søknad/søknadStepsConfig';
import { getStepTexts } from '../../utils/stepUtils';
import StepIndicator from '../step-indicator/StepIndicator';
import './step.less';

export interface StepProps {
    id: StepID;
    stepSubTitle?: string;
    onAvbryt: () => void;
    onFortsettSenere: () => void;
    useValidationErrorSummary?: boolean;
}

interface OwnProps {
    stepConfig: StepConfigInterface;
    children: React.ReactNode;
}

type Props = OwnProps & StepProps;

const bem = bemHelper('step');

const Step = ({
    id,
    useValidationErrorSummary,
    stepConfig,
    onAvbryt,
    onFortsettSenere,
    children,
    stepSubTitle,
}: Props) => {
    const conf = stepConfig[id];
    const intl = useIntl();
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);

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
            <Box margin={conf.backLinkHref ? 'none' : 'xl'}>
                <StepIndicator stepConfig={stepConfig} activeStep={conf.stepNumber} />
            </Box>
            <Box margin="xxl">
                <Innholdstittel tag="h1" className={bem.element('title')}>
                    {stepTexts.stepTitle}
                    {stepSubTitle && (
                        <>
                            {' '}
                            <span className={bem.element('subTitle')}>{stepSubTitle}</span>
                        </>
                    )}
                </Innholdstittel>
            </Box>
            <Box margin="xl">{children}</Box>
            <StepFooter onAvbrytOgFortsettSenere={onFortsettSenere} onAvbrytOgSlett={onAvbryt} />
        </Page>
    );
};

export default Step;
