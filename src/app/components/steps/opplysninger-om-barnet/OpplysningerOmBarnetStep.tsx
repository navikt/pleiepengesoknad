import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import FormikCheckbox from 'common/formik/formik-checkbox/FormikCheckbox';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import FormikInput from 'common/formik/formik-input/FormikInput';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { resetFieldValue, resetFieldValues } from 'common/formik/formikUtils';
import { HistoryProps } from 'common/types/History';
import { dateToday, prettifyDate } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import { validateFødselsnummer } from 'common/validation/fieldValidations';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { AppFormField, initialValues } from '../../../types/PleiepengesøknadFormData';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { Søkerdata } from '../../../types/Søkerdata';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import {
    validateFødselsdato, validateNavn, validateValgtBarn
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';

interface OpplysningerOmBarnetStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: { handleSubmit, setFieldValue, values },
    nextStepRoute,
    history
}: Props) => {
    const { søknadenGjelderEtAnnetBarn, barnetHarIkkeFåttFødselsnummerEnda } = values;
    const intl = useIntl();
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={() =>
                persistAndNavigateTo(history, StepID.OPPLYSNINGER_OM_BARNET, values, nextStepRoute)
            }
            handleSubmit={handleSubmit}
            history={history}
            formValues={values}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    harRegistrerteBarn(søkerdata) && (
                        <>
                            <FormikRadioPanelGroup<AppFormField>
                                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                                name={AppFormField.barnetSøknadenGjelder}
                                radios={søkerdata.barn.map((barn) => {
                                    const { fornavn, mellomnavn, etternavn, fodselsdato, aktoer_id } = barn;
                                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                                    return {
                                        value: aktoer_id,
                                        key: aktoer_id,
                                        label: (
                                            <>
                                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                                <Normaltekst>
                                                    <FormattedMessage
                                                        id="steg.omBarnet.hvilketBarn.født"
                                                        values={{ dato: prettifyDate(fodselsdato) }}
                                                    />
                                                </Normaltekst>
                                            </>
                                        ),
                                        disabled: søknadenGjelderEtAnnetBarn
                                    };
                                })}
                                validate={(value) => {
                                    if (søknadenGjelderEtAnnetBarn) {
                                        return undefined;
                                    }
                                    return validateValgtBarn(value);
                                }}
                            />
                            {appIsRunningInDemoMode() === false && (
                                <FormikCheckbox<AppFormField>
                                    label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                                    name={AppFormField.søknadenGjelderEtAnnetBarn}
                                    afterOnChange={(newValue) => {
                                        if (newValue) {
                                            resetFieldValue(
                                                AppFormField.barnetSøknadenGjelder,
                                                setFieldValue,
                                                initialValues
                                            );
                                        } else {
                                            resetFieldValues(
                                                [
                                                    AppFormField.barnetsFødselsnummer,
                                                    AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                                    AppFormField.barnetsFødselsdato,
                                                    AppFormField.barnetsNavn
                                                ],
                                                setFieldValue,
                                                initialValues
                                            );
                                        }
                                    }}
                                />
                            )}
                        </>
                    )
                }
            </SøkerdataContextConsumer>

            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    (søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <>
                            <FormikInput<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                                name={AppFormField.barnetsFødselsnummer}
                                validate={(fnr) => {
                                    if (!barnetHarIkkeFåttFødselsnummerEnda) {
                                        return validateFødselsnummer(fnr);
                                    }
                                    return undefined;
                                }}
                                disabled={barnetHarIkkeFåttFødselsnummerEnda}
                                bredde="XL"
                                type="tel"
                                maxLength={11}
                            />
                            <FormikCheckbox<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                                name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue(AppFormField.barnetsFødselsnummer, '');
                                    }
                                }}
                            />
                            {barnetHarIkkeFåttFødselsnummerEnda && (
                                <FormikDatepicker<AppFormField>
                                    showYearSelector={true}
                                    name={AppFormField.barnetsFødselsdato}
                                    dateLimitations={{ maksDato: dateToday }}
                                    label={intlHelper(intl, 'steg.omBarnet.fødselsdato')}
                                    validate={(dato) => {
                                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                                            return validateFødselsdato(dato);
                                        }
                                        return undefined;
                                    }}
                                />
                            )}
                            <FormikInput<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.navn')}
                                name={AppFormField.barnetsNavn}
                                validate={(navn) => {
                                    return validateNavn(navn, false);
                                }}
                                bredde="XL"
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
