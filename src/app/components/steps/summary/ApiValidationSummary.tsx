import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Feiloppsummering } from 'nav-frontend-skjema';
import { ApiValidationError } from '../../../validation/apiValuesValidation';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import { navigateToSoknadStep } from '../../../utils/navigationUtils';
import { stepConfig } from '../../../config/stepConfig';
import { useHistory } from 'react-router';
import { getStepTexts } from '../../../utils/stepUtils';

interface Props {
    errors: ApiValidationError[];
}

const ApiValidationSummary: React.FunctionComponent<Props> = ({ errors }) => {
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
                    const stepTexts = getStepTexts(intl, error.stepId, stepConfig);
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
                                {stepTexts.stepTitle}&quot;
                            </ActionLink>
                        </>
                    );
                }}
            />
        </FormBlock>
    );
};

export default ApiValidationSummary;
