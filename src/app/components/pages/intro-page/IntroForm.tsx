import React from 'react';
import { useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
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
                console.log('whoa');

                onValidSubmit();
            }}
            renderForm={({ values: { harLegeerklæring, erArbeidstaker } }) => {
                return (
                    <section aria-label="Se om du kan bruke det dette skjemaet:">
                        <IntroFormComponents.Form
                            runDelayedFormValidation={true}
                            includeValidationSummary={true}
                            includeButtons={true}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                            submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.form.${IntroFormField.harLegeerklæring}.spm`)}
                                name={IntroFormField.harLegeerklæring}
                                validate={validateYesOrNoIsAnswered}
                                showInfo={harLegeerklæring !== YesOrNo.UNANSWERED}
                                infoMessage={
                                    harLegeerklæring === YesOrNo.YES
                                        ? intlHelper(intl, 'introForm.form.harLegeerklæring.ja.info')
                                        : intlHelper(intl, 'introForm.form.harLegeerklæring.nei.info')
                                }
                            />
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.form.${IntroFormField.erArbeidstaker}.spm`)}
                                name={IntroFormField.erArbeidstaker}
                                validate={validateYesOrNoIsAnswered}
                                showInfo={erArbeidstaker === YesOrNo.NO}
                                infoMessage={intlHelper(intl, 'introForm.form.erArbeidstaker.nei.info')}
                            />
                        </IntroFormComponents.Form>
                    </section>
                );
            }}
        />
    );
};

export default IntroForm;
