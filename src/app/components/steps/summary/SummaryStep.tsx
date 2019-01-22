import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../box/Box';
import { EtikettLiten } from 'nav-frontend-typografi';
import { navigateTo } from '../../../utils/navigationHelper';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { sendApplication } from '../../../utils/apiHelper';

export interface SummaryStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
    values: PleiepengesøknadFormData;
}

interface State {
    sendingInProgress: boolean;
}

type Props = SummaryStepProps & HistoryProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate() {
        const { history, values } = this.props;
        this.setState({
            sendingInProgress: true
        });
        try {
            await sendApplication(mapFormDataToApiData(values));
            navigateTo('/soknad-sendt', history);
        } catch {
            navigateTo('/soknad-sendt', history);
        }
    }

    render() {
        const { handleSubmit, values, isSubmitting, isValid } = this.props;
        const { sendingInProgress } = this.state;
        const stepProps = { handleSubmit, isSubmitting, isValid, showButtonSpinner: sendingInProgress };

        return (
            <FormikStep id={StepID.SUMMARY} onValidFormSubmit={this.navigate} {...stepProps}>
                <Box margin="m">
                    {Object.keys(values)
                        .filter((key) => values[key] !== '' && values[key])
                        .map((key) => (
                            <EtikettLiten key={key}>
                                {key}: {values[key] === true ? 'Ja' : `${values[key]}`}
                            </EtikettLiten>
                        ))}
                </Box>
                <Box margin="l">
                    <ConfirmationCheckboxPanel
                        label="Jeg bekrefter at disse opplysningene stemmer"
                        name={Field.harBekreftetOpplysninger}
                        validate={(value) => {
                            let result;
                            if (value !== true) {
                                result = 'Du må bekrefte opplysningene';
                            }
                            return result;
                        }}>
                        Før du sender søknaden, les nøye gjennom alle opplysningene du har oppgitt og bekreft med å huke
                        av her.
                    </ConfirmationCheckboxPanel>
                </Box>
            </FormikStep>
        );
    }
}

export default SummaryStep;
