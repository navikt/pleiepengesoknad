import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import {
    validateFødselsdato,
    validateNavn,
    validateRelasjonTilBarnet,
    validateValgtBarn
} from '../../../validation/fieldValidations';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { formatName } from 'common/utils/personUtils';
import { AppFormField, initialValues, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { resetFieldValue, resetFieldValues } from '../../../../common/formik/formikUtils';
import { prettifyDate, dateToday } from 'common/utils/dateUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { useIntl, FormattedMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import FormikInput from 'common/formik/formik-input/FormikInput';
import FormikCheckbox from 'common/formik/formik-checkbox/FormikCheckbox';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import FormikDatepicker from 'common/formik/formik-datepicker/FormikDatepicker';
import { persist } from '../../../api/api';
import { validateFødselsnummer } from 'common/validation/commonFieldValidations';

interface OpplysningerOmBarnetStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: { handleSubmit, setFieldValue, values },
    nextStepRoute,
    history
}: Props) => {
    const persistAndNavigateTo = (lastStepID: StepID, data: PleiepengesøknadFormData, nextStep?: string) => {
        persist(data, lastStepID);
        if (nextStep) {
            history.push(nextStep);
        }
    };
    const { søknadenGjelderEtAnnetBarn, barnetHarIkkeFåttFødselsnummerEnda } = values;
    const intl = useIntl();
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={() => persistAndNavigateTo(StepID.OPPLYSNINGER_OM_BARNET, values, nextStepRoute)}
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
                                                    AppFormField.barnetsNavn,
                                                    AppFormField.søkersRelasjonTilBarnet
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
                                    if (barnetHarIkkeFåttFødselsnummerEnda) {
                                        return validateNavn(navn, false);
                                    } else {
                                        return validateNavn(navn, true);
                                    }
                                }}
                                bredde="XL"
                            />
                            <FormikInput<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                                name={AppFormField.søkersRelasjonTilBarnet}
                                validate={validateRelasjonTilBarnet}
                                bredde="XL"
                                helperText={intlHelper(intl, 'steg.omBarnet.relasjon.eksempel')}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
