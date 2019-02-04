import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { navigateTo } from '../../../utils/navigationHelper';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { sendApplication } from '../../../utils/apiHelper';
import Panel from '../../panel/Panel';
import ContentWithHeader from '../../content-with-header/ContentWithHeader';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { prettifyDate } from '../../../utils/dateHelper';

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

        const {
            periodeFra,
            periodeTil,
            ansettelsesforhold,
            barnetsNavn,
            barnetHarIkkeFåttFødselsnummerEnda,
            barnetsForeløpigeFødselsnummerEllerDNummer,
            barnetsFødselsnummer,
            søkersRelasjonTilBarnet
        } = values;

        return (
            <FormikStep id={StepID.SUMMARY} onValidFormSubmit={this.navigate} {...stepProps}>
                <Box margin="l">
                    <Panel border={true}>
                        <ContentWithHeader header="Det søkes pleiepenger av:">
                            <Normaltekst>Ola Nordmann</Normaltekst>
                            <Normaltekst>Fødselsnummer: 123412341234</Normaltekst>
                        </ContentWithHeader>
                        <Box margin="l">
                            <ContentWithHeader header="Tidsrom:">
                                <Normaltekst>
                                    Fra {prettifyDate(periodeFra!)} til {prettifyDate(periodeTil!)}
                                </Normaltekst>
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Om barnet:">
                                {barnetHarIkkeFåttFødselsnummerEnda && barnetsForeløpigeFødselsnummerEllerDNummer ? (
                                    <Normaltekst>
                                        Foreløpig fødselsnummer / D-nummer: {barnetsForeløpigeFødselsnummerEllerDNummer}
                                    </Normaltekst>
                                ) : null}
                                {!barnetHarIkkeFåttFødselsnummerEnda ? (
                                    <Normaltekst>Fødselsnummer: {barnetsFødselsnummer}</Normaltekst>
                                ) : null}
                                {barnetsNavn !== undefined ? <Normaltekst>Navn: {barnetsNavn}</Normaltekst> : null}
                                <Normaltekst>Din relasjon til barnet: {søkersRelasjonTilBarnet}</Normaltekst>
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Arbeidsforhold:">
                                {ansettelsesforhold.map(({ navn, organisasjonsnummer }) => (
                                    <Normaltekst key={organisasjonsnummer}>
                                        {navn} (organisasjonsnummer: {organisasjonsnummer})
                                    </Normaltekst>
                                ))}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Legeerklæring:">
                                <LegeerklæringAttachmentList />
                            </ContentWithHeader>
                        </Box>
                    </Panel>
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
