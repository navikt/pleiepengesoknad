import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';
import FormQuestion from '../../form-question/FormQuestion';
interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData, ValidationError>();

const IntroForm: React.FunctionComponent<Props> = ({ onValidSubmit }) => {
    const intl = useIntl();
    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values: { harLegeerklæring, erArbeidstaker } }) => {
                const legeerklæringBesvart = isYesOrNoAnswered(harLegeerklæring);
                const arbeidstakerBesvart = isYesOrNoAnswered(erArbeidstaker);
                const kanFortsette: boolean = legeerklæringBesvart && arbeidstakerBesvart;
                return (
                    <section aria-label="Se om du kan bruke det dette skjemaet:">
                        <IntroFormComponents.Form
                            runDelayedFormValidation={true}
                            includeValidationSummary={true}
                            includeButtons={kanFortsette}
                            noButtonsContentRenderer={
                                kanFortsette
                                    ? undefined
                                    : () => (
                                          <UnansweredQuestionsInfo>
                                              <FormattedMessage id="ubesvarteSpørsmålInfo" />
                                          </UnansweredQuestionsInfo>
                                      )
                            }
                            formErrorHandler={getIntlFormErrorHandler(intl)}
                            submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.form.${IntroFormField.harLegeerklæring}.spm`)}
                                name={IntroFormField.harLegeerklæring}
                                validate={getYesOrNoValidator()}
                                showInfo={harLegeerklæring !== YesOrNo.UNANSWERED}
                                infoMessage={
                                    <div className="infoMessageContent">
                                        <p>
                                            {harLegeerklæring === YesOrNo.YES
                                                ? intlHelper(intl, 'introForm.form.harLegeerklæring.ja.info')
                                                : intlHelper(intl, 'introForm.form.harLegeerklæring.nei.info')}
                                        </p>
                                    </div>
                                }
                            />
                            {legeerklæringBesvart && (
                                <FormQuestion
                                    legend={intlHelper(intl, `introForm.form.${IntroFormField.erArbeidstaker}.spm`)}
                                    name={IntroFormField.erArbeidstaker}
                                    validate={getYesOrNoValidator()}
                                    showInfo={erArbeidstaker !== YesOrNo.UNANSWERED}
                                    infoMessage={
                                        <div className="infoMessageContent">
                                            {erArbeidstaker === YesOrNo.YES && (
                                                <>
                                                    <p>{intlHelper(intl, 'introForm.form.erArbeidstaker.ja.info.1')}</p>
                                                </>
                                            )}
                                            {erArbeidstaker === YesOrNo.NO && (
                                                <p>{intlHelper(intl, 'introForm.form.erArbeidstaker.nei.info')}</p>
                                            )}
                                        </div>
                                    }
                                />
                            )}
                        </IntroFormComponents.Form>
                    </section>
                );
            }}
        />
    );
};

export default IntroForm;
