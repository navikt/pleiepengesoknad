import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../box/Box';
import { EtikettLiten } from 'nav-frontend-typografi';
import { sendApplication } from '../../../utils/apiHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';

export interface SummaryStepProps {
    isValid: boolean;
    values: PleiepengesøknadFormData;
    onSubmit: () => Promise<void>;
}

interface State {
    sendingInProgress: boolean;
}

type Props = SummaryStepProps & HistoryProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            sendingInProgress: false
        };
    }

    async advanceFromStep() {
        const { values } = this.props;
        try {
            await sendApplication(mapFormDataToApiData(values));
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
                this.advanceFromStep
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
            </Step>
        );
    }
}

export default SummaryStep;
