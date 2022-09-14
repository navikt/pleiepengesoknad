import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { Feiloppsummering } from 'nav-frontend-skjema';
import { navigateToSoknadStep } from '../../../utils/navigationUtils';
import { ApiValidationError } from '../../../validation/apiValuesValidation';
import { StepID } from '../../søknadStepsConfig';

interface Props {
    errors: ApiValidationError[];
    soknadStepsConfig: SoknadStepsConfig<StepID>;
}

const ApiValidationSummary: React.FunctionComponent<Props> = ({ errors, soknadStepsConfig }) => {
    const intl = useIntl();
    const history = useHistory();
    if (errors.length === 0) {
        return null;
    }
    return (
        <FormBlock>
            <Feiloppsummering
                tittel={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                feil={errors}
                customFeilRender={(f) => {
                    const error = f as ApiValidationError;
                    return (
                        <>
                            <p>{error.feilmelding}</p>
                            <p>
                                <FormattedMessage id="steg.oppsummering.validering.navigasjonTilStegInfo" />
                            </p>
                            <ActionLink onClick={() => navigateToSoknadStep(error.stepId, history)}>
                                <FormattedMessage
                                    id="steg.oppsummering.validering.navigasjonTilStegGåTil"
                                    tagName="span"
                                />{' '}
                                &quot;
                                {soknadStepUtils.getStepTexts(intl, soknadStepsConfig[error.stepId]).stepTitle}&quot;
                            </ActionLink>
                        </>
                    );
                }}
            />
        </FormBlock>
    );
};

export default ApiValidationSummary;
