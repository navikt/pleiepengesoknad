import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import {
    validateFødselsdato,
    validateFødselsnummer,
    validateNavn,
    validateRelasjonTilBarnet,
    validateValgtBarn
} from '../../../validation/fieldValidations';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { CustomFormikProps } from '../../../types/FormikProps';
import { formatName } from 'common/utils/personUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';
import FormikStep from '../../formik-step/FormikStep';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import { resetFieldValue, resetFieldValues } from '../../../utils/formikUtils';
import { prettifyDate, dateToday } from 'common/utils/dateUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import Datepicker from 'app/components/datepicker/Datepicker';
import { persist } from '../../../api/api';

interface OpplysningerOmBarnetStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: { handleSubmit, setFieldValue, values },
    nextStepRoute,
    history,
    intl
}: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { søknadenGjelderEtAnnetBarn, barnetHarIkkeFåttFødselsnummerEnda } = values;
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={() => {
                persist(values);
                if (navigate) {
                    navigate();
                }
            }}
            handleSubmit={handleSubmit}
            history={history}
            formValues={values}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    harRegistrerteBarn(søkerdata) && (
                        <>
                            <RadioPanelGroup
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
                                <Checkbox
                                    label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                                    name={AppFormField.søknadenGjelderEtAnnetBarn}
                                    afterOnChange={(newValue) => {
                                        if (newValue) {
                                            resetFieldValue(AppFormField.barnetSøknadenGjelder, setFieldValue);
                                        } else {
                                            resetFieldValues(
                                                [
                                                    AppFormField.barnetsFødselsnummer,
                                                    AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                                    AppFormField.barnetsFødselsdato,
                                                    AppFormField.barnetsNavn,
                                                    AppFormField.søkersRelasjonTilBarnet
                                                ],
                                                setFieldValue
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
                            <Input
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
                            <Checkbox
                                label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                                name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue(AppFormField.barnetsFødselsnummer, '');
                                    }
                                }}
                            />
                            {barnetHarIkkeFåttFødselsnummerEnda && (
                                <Datepicker
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
                            <Input
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
                            <Input
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

export default injectIntl(OpplysningerOmBarnetStep);
