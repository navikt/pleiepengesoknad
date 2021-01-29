import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFrilanserStartdato } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikArbeidsforholdDetaljer from '../../formik-arbeidsforholdDetaljer/FormikArbeidsforholdDetaljer';
import FormikStep from '../../formik-step/FormikStep';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: { arbeidsforhold, harHattInntektSomFrilanser, selvstendig_harHattInntektSomSN },
    } = formikProps;
    const intl = useIntl();

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
            <div className="arbeidsforhold">
                {arbeidsforhold.map((arbeidsforhold, index) => (
                    <FormSection
                        title={arbeidsforhold.navn}
                        key={arbeidsforhold.organisasjonsnummer}
                        titleIcon={<BuildingIcon />}>
                        <FormikArbeidsforholdDetaljer arbeidsforhold={arbeidsforhold} index={index} />
                    </FormSection>
                ))}
            </div>
            {harHattInntektSomFrilanser && (
                <Box padBottom="xl">
                    <FormSection title="Frilanser">
                        <Box>
                            <AppForm.DatePicker
                                name={AppFormField.frilans_startdato}
                                label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={validateFrilanserStartdato}
                            />
                        </Box>
                        <Box margin="xl">
                            <AppForm.YesOrNoQuestion
                                name={AppFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    </FormSection>
                </Box>
            )}
            {selvstendig_harHattInntektSomSN && (
                <Box padBottom="xl">
                    <FormSection title="Selvstendig næringsdrivende">
                        <Box margin="l">
                            <Panel>
                                <VirksomhetListAndDialog
                                    name={AppFormField.selvstendig_virksomheter}
                                    labels={{
                                        listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                        addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                        modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel'),
                                    }}
                                    hideFormFields={{ harRevisor: true }}
                                    validate={validateRequiredList}
                                />
                            </Panel>
                        </Box>
                    </FormSection>
                </Box>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
