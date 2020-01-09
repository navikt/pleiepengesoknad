import React from 'react';
import { Field, FieldProps } from 'formik';
import { AppFormField, AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { showValidationErrors } from 'app/utils/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Ansettelsesforhold } from 'app/types/Søkerdata';
import { YesOrNo } from 'common/types/YesOrNo';
import YesOrNoQuestionBase from 'common/form-components/yes-or-no-question-base/YesOrNoQuestionBase';
import intlHelper from 'common/utils/intlUtils';
import { validateErAnsattIPerioden } from 'app/validation/fieldValidations';

interface Props {
    ansettelsesforhold: Ansettelsesforhold;
}

const FormikErAnsattIPerioden: React.FunctionComponent<Props & InjectedIntlProps> = ({ intl, ansettelsesforhold }) => (
    <Field
        name={AppFormField.ansettelsesforhold}
        validate={(value: AnsettelsesforholdForm[]) => {
            return validateErAnsattIPerioden(value, ansettelsesforhold.organisasjonsnummer);
        }}>
        {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};

            const valgteAnsettelsesforhold: AnsettelsesforholdForm[] = field.value;
            const formAnsettelsesforhold: AnsettelsesforholdForm | undefined = valgteAnsettelsesforhold.find(
                (va) => va.organisasjonsnummer === ansettelsesforhold.organisasjonsnummer
            );
            const registeredAnswer: YesOrNo =
                formAnsettelsesforhold && formAnsettelsesforhold.erAnsattIPerioden
                    ? formAnsettelsesforhold.erAnsattIPerioden
                    : YesOrNo.UNANSWERED;

            return (
                <YesOrNoQuestionBase
                    legend={intlHelper(intl, 'gradertAnsettelsesforhold.erAnsattIPerioden.spm')}
                    {...errorMsgProps}
                    onChange={(answer) => {
                        if (answer === YesOrNo.UNANSWERED) {
                            setFieldValue(field.name, [
                                ...valgteAnsettelsesforhold,
                                { ...formAnsettelsesforhold, erAnsattIPerioden: answer }
                            ]);
                        } else {
                            const updatedForhold: AnsettelsesforholdForm = {
                                ...(formAnsettelsesforhold || ansettelsesforhold),
                                erAnsattIPerioden: answer
                            };
                            setFieldValue(field.name, [
                                ...valgteAnsettelsesforhold.filter(
                                    (va) => va.organisasjonsnummer !== ansettelsesforhold.organisasjonsnummer
                                ),
                                updatedForhold
                            ]);
                        }
                    }}
                    name={`ansettelsesforhold.${ansettelsesforhold.organisasjonsnummer}.erAnsatt`}
                    checked={registeredAnswer}
                />
            );
        }}
    </Field>
);

export default injectIntl(FormikErAnsattIPerioden);
