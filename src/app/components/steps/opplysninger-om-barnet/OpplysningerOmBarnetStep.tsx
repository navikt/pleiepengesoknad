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
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';
import FormikStep from '../../formik-step/FormikStep';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { getNextStepRoute } from '../../../utils/routeUtils';

interface OpplysningerOmBarnetStepProps {
    formikProps: FormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET);

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: {
        handleSubmit,
        setFieldValue,
        values: { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder, barnetHarIkkeFåttFødselsnummerEnda }
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
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    harRegistrerteBarn(søkerdata) && (
                        <>
                            <RadioPanelGroup
                                legend="Velg barnet du skal søke pleiepenger for"
                                name={Field.barnetSøknadenGjelder}
                                radios={søkerdata.barn.map((barn) => {
                                    const { fornavn, mellomnavn, etternavn } = barn;
                                    return {
                                        value: JSON.stringify(barn),
                                        key: formatName(fornavn, mellomnavn, etternavn),
                                        label: formatName(fornavn, mellomnavn, etternavn),
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
                                        setFieldValue(Field.barnetSøknadenGjelder, '');
                                    }
                                }}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    (søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
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
                                placeholder="Skriv inn fødselsnummer her"
                                disabled={barnetHarIkkeFåttFødselsnummerEnda}
                                bredde="XL"
                                type="number"
                            />
                            <Checkbox
                                label="Barnet har ikke fått fødselsnummer enda"
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
                                    placeholder="Skriv inn barnets foreløpige fødselsnummer / D-nummer her"
                                    validate={(foreløpigFnr) => {
                                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                                            return validateForeløpigFødselsnummer(foreløpigFnr);
                                        }
                                        return undefined;
                                    }}
                                    bredde="XXL"
                                    type="number"
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
                                placeholder="Skriv inn barnets navn her"
                                bredde="XL"
                            />
                            <Input
                                label="Min relasjon til barnet"
                                name={Field.søkersRelasjonTilBarnet}
                                validate={validateRelasjonTilBarnet}
                                placeholder="Skriv inn din relasjon til barnet her"
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
