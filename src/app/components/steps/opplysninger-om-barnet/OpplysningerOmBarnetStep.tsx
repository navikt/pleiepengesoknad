import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateFnr, validateNavn, validateRelasjonTilBarnet } from '../../../utils/validationHelper';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { CustomFormikProps as FormikProps } from '../../../types/FormikProps';
import { formatName } from '../../../utils/personHelper';
import { Field } from '../../../types/PleiepengesøknadFormData';
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';
import FormikStep from '../../formik-step/FormikStep';

interface OpplysningerOmBarnetStepProps {
    formikProps: FormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET);

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps: {
        handleSubmit,
        setFieldValue,
        isSubmitting,
        isValid,
        values: { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder }
    },
    history
}: Props) => {
    const stepProps = {
        handleSubmit,
        isSubmitting,
        isValid,
        showSubmitButton:
            søknadenGjelderEtAnnetBarn === true || (barnetSøknadenGjelder !== undefined && barnetSøknadenGjelder !== '')
    };
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={navigate} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.barn && (
                        <>
                            <RadioPanelGroup
                                legend="Hvilket barn gjelder søknaden?"
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
                            />
                            <Checkbox
                                label="Søknaden gjelder et annet barn"
                                name={Field.søknadenGjelderEtAnnetBarn}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue('barnetSøknadenGjelder', '');
                                    }
                                }}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
            {søknadenGjelderEtAnnetBarn && (
                <>
                    <Input label="Hva er barnets etternavn?" name={Field.barnetsEtternavn} validate={validateNavn} />
                    <Input label="Hva er barnets fornavn?" name={Field.barnetsFornavn} validate={validateNavn} />
                    <Input
                        label="Hva er barnets fødselsnummer?"
                        name={Field.barnetsFødselsnummer}
                        validate={validateFnr}
                    />
                    <Input label="Hva er barnets adresse?" name={Field.barnetsAdresse} validate={validateAdresse} />
                    <Input
                        label="Hva er din relasjon til barnet?"
                        name={Field.søkersRelasjonTilBarnet}
                        validate={validateRelasjonTilBarnet}
                    />
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
