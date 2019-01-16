import * as React from 'react';
import axios from 'axios';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { PleiepengesøknadField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../box/Box';
import { EtikettLiten } from 'nav-frontend-typografi';
import { getEnvironmentVariable } from '../../../utils/envHelper';
import { navigateTo } from '../../../utils/navigationHelper';

export interface SummaryStepProps {
    isValid: boolean;
    values: PleiepengesøknadFormData;
    onSubmit: () => Promise<void>;
}

interface State {
    sendingInProgress: boolean;
}

type Props = SummaryStepProps & HistoryProps;

const apiUrl = getEnvironmentVariable('API_URL');

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendApplication = this.sendApplication.bind(this);

        this.state = {
            sendingInProgress: false
        };
    }

    async sendApplication() {
        const { values } = this.props;
        try {
            await axios.post(`${apiUrl}/soknad`, values);
            navigateTo('/soknad-sendt', this.props.history);
        } catch (error) {
            navigateTo('/soknad-sendt', this.props.history);
        }
    }

    async handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { onSubmit, isValid } = this.props;
        await onSubmit();
        if (isValid) {
            this.setState(
                {
                    sendingInProgress: true
                },
                this.sendApplication
            );
        }
    }

    render() {
        const { values } = this.props;
        const { sendingInProgress } = this.state;
        return (
            <Step id={StepID.SUMMARY} onSubmit={this.handleSubmit} showButtonSpinner={sendingInProgress}>
                <Box margin="m">
                    {Object.keys(values)
                        .filter((key) => values[key] !== '' && values[key])
                        .map((key) => (
                            <EtikettLiten key={key}>
                                {key}: {values[key] === true ? 'Ja' : values[key]}
                            </EtikettLiten>
                        ))}
                </Box>
                <Box margin="l">
                    <ConfirmationCheckboxPanel
                        label="Jeg bekrefter at disse opplysningene stemmer"
                        name={PleiepengesøknadField.HarBekreftetOpplysninger}
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
            </Step>
        );
    }
}

export default SummaryStep;
