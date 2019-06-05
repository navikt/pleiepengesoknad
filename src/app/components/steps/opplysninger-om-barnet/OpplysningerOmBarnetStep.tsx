import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import {
    validateForeløpigFødselsnummer,
    validateFødselsnummer,
    validateNavn,
    validateRelasjonTilBarnet,
    validateValgtBarn
} from '../../../validation/fieldValidations';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { CustomFormikProps as FormikProps } from '../../../types/FormikProps';
import { formatName } from '../../../utils/personUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';
import FormikStep from '../../formik-step/FormikStep';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { getNextStepRoute } from '../../../utils/routeUtils';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import { resetFieldValue, resetFieldValues } from '../../../utils/formikUtils';
import { prettifyDate } from '../../../utils/dateUtils';
import { Normaltekst } from 'nav-frontend-typografi';

interface OpplysningerOmBarnetStepProps {
    formikProps: FormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET);

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: {
        handleSubmit,
        setFieldValue,
        values: { søknadenGjelderEtAnnetBarn, barnetHarIkkeFåttFødselsnummerEnda }
    },
    history
}: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={navigate}
            handleSubmit={handleSubmit}
            history={history}>
            {isFeatureEnabled(Feature.HENT_BARN_FEATURE) && (
                <SøkerdataContextConsumer>
                    {(søkerdata: Søkerdata) =>
                        harRegistrerteBarn(søkerdata) && (
                            <>
                                <RadioPanelGroup
                                    legend="Hvilket barn gjelder søknaden?"
                                    name={Field.barnetSøknadenGjelder}
                                    radios={søkerdata.barn.map((barn) => {
                                        const { fornavn, mellomnavn, etternavn, fodselsdato, aktoer_id } = barn;
                                        const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                                        return {
                                            value: aktoer_id,
                                            key: aktoer_id,
                                            label: (
                                                <>
                                                    <Normaltekst>{barnetsNavn}</Normaltekst>
                                                    <Normaltekst>Født {prettifyDate(fodselsdato)}</Normaltekst>
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
                                <Checkbox
                                    label="Søknaden gjelder et annet barn"
                                    name={Field.søknadenGjelderEtAnnetBarn}
                                    afterOnChange={(newValue) => {
                                        if (newValue) {
                                            resetFieldValue(Field.barnetSøknadenGjelder, setFieldValue);
                                        } else {
                                            resetFieldValues(
                                                [
                                                    Field.barnetsFødselsnummer,
                                                    Field.barnetHarIkkeFåttFødselsnummerEnda,
                                                    Field.barnetsForeløpigeFødselsnummerEllerDNummer,
                                                    Field.barnetsNavn,
                                                    Field.søkersRelasjonTilBarnet
                                                ],
                                                setFieldValue
                                            );
                                        }
                                    }}
                                />
                            </>
                        )
                    }
                </SøkerdataContextConsumer>
            )}
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    (!isFeatureEnabled(Feature.HENT_BARN_FEATURE) ||
                        søknadenGjelderEtAnnetBarn ||
                        !harRegistrerteBarn(søkerdata)) && (
                        <>
                            <Input
                                label="Barnets fødselsnummer"
                                name={Field.barnetsFødselsnummer}
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
                                label="Barnet har ikke fått fødselsnummer ennå"
                                name={Field.barnetHarIkkeFåttFødselsnummerEnda}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue(Field.barnetsFødselsnummer, '');
                                    }
                                }}
                            />
                            {barnetHarIkkeFåttFødselsnummerEnda && (
                                <Input
                                    label="Barnets foreløpige fødselsnummer eller D-nummer"
                                    name={Field.barnetsForeløpigeFødselsnummerEllerDNummer}
                                    validate={(foreløpigFnr) => {
                                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                                            return validateForeløpigFødselsnummer(foreløpigFnr);
                                        }
                                        return undefined;
                                    }}
                                    bredde="XXL"
                                    type="tel"
                                    maxLength={11}
                                />
                            )}
                            <Input
                                label="Barnets navn"
                                name={Field.barnetsNavn}
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
                                label="Min relasjon til barnet"
                                name={Field.søkersRelasjonTilBarnet}
                                validate={validateRelasjonTilBarnet}
                                bredde="XL"
                                helperText="Eksempler: mor, far, tante, onkel eller andre som står barnet nær"
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
