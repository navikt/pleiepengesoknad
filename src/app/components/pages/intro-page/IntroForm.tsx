import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

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
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                            submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.form.${IntroFormField.harLegeerklæring}.spm`)}
                                name={IntroFormField.harLegeerklæring}
                                validate={validateYesOrNoIsAnswered}
                                showInfo={harLegeerklæring !== YesOrNo.UNANSWERED}
                                infoMessage={
                                    <p style={{ marginTop: '0' }}>
                                        {harLegeerklæring === YesOrNo.YES
                                            ? intlHelper(intl, 'introForm.form.harLegeerklæring.ja.info')
                                            : intlHelper(intl, 'introForm.form.harLegeerklæring.nei.info')}
                                    </p>
                                }
                            />
                            {legeerklæringBesvart && (
                                <FormQuestion
                                    legend={intlHelper(intl, `introForm.form.${IntroFormField.erArbeidstaker}.spm`)}
                                    name={IntroFormField.erArbeidstaker}
                                    validate={validateYesOrNoIsAnswered}
                                    showInfo={erArbeidstaker !== YesOrNo.UNANSWERED}
                                    infoMessage={
                                        <>
                                            {erArbeidstaker === YesOrNo.YES && (
                                                <>
                                                    <p style={{ marginTop: '0' }}>
                                                        {intlHelper(intl, 'introForm.form.erArbeidstaker.ja.info.1')}
                                                    </p>
                                                    <p>{intlHelper(intl, 'introForm.form.erArbeidstaker.ja.info.2')}</p>
                                                </>
                                            )}
                                            {erArbeidstaker === YesOrNo.NO && (
                                                <p style={{ marginTop: '0' }}>
                                                    {intlHelper(intl, 'introForm.form.erArbeidstaker.nei.info')}
                                                </p>
                                            )}
                                        </>
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
