import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import Panel from '../../panel/Panel';
import ContentWithHeader from '../../content-with-header/ContentWithHeader';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { prettifyDate } from '../../../utils/dateUtils';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { formatName } from '../../../utils/personUtils';
import { sendApplication } from '../../../api/api';
import { YesOrNo } from '../../../types/YesOrNo';
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';

export interface SummaryStepProps {
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
            navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    }

    render() {
        const { handleSubmit, values, history } = this.props;
        const { sendingInProgress } = this.state;
        const stepProps = { handleSubmit, showButtonSpinner: sendingInProgress, buttonDisabled: sendingInProgress };

        const {
            periodeFra,
            periodeTil,
            ansettelsesforhold,
            barnetsNavn,
            barnetHarIkkeFåttFødselsnummerEnda,
            barnetsForeløpigeFødselsnummerEllerDNummer,
            barnetsFødselsnummer,
            søkersRelasjonTilBarnet,
            harBoddUtenforNorgeSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            grad,
            harMedsøker
        } = values;

        return (
            <FormikStep
                id={StepID.SUMMARY}
                onValidFormSubmit={this.navigate}
                history={history}
                useValidationErrorSummary={false}
                {...stepProps}>
                <CounsellorPanel>
                    Les gjennom oppsummeringen før du sender inn søknaden. Hvis du trenger å gjøre endringer, kan du gå
                    tilbake.
                </CounsellorPanel>
                <Box margin="xl">
                    <Panel border={true}>
                        <SøkerdataContextConsumer>
                            {({ person: { fornavn, mellomnavn, etternavn, fodselsnummer } }: Søkerdata) => (
                                <ContentWithHeader header="Den som søker om pleiepenger">
                                    <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                    <Normaltekst>Fødselsnummer: {fodselsnummer}</Normaltekst>
                                </ContentWithHeader>
                            )}
                        </SøkerdataContextConsumer>
                        <Box margin="l">
                            <ContentWithHeader header="Tidsrom">
                                <Normaltekst>
                                    Fra {prettifyDate(periodeFra!)} til {prettifyDate(periodeTil!)}
                                </Normaltekst>
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Om barnet">
                                {barnetHarIkkeFåttFødselsnummerEnda && barnetsForeløpigeFødselsnummerEllerDNummer ? (
                                    <Normaltekst>
                                        Foreløpig fødselsnummer / D-nummer: {barnetsForeløpigeFødselsnummerEllerDNummer}
                                    </Normaltekst>
                                ) : null}
                                {!barnetHarIkkeFåttFødselsnummerEnda ? (
                                    <Normaltekst>Fødselsnummer: {barnetsFødselsnummer}</Normaltekst>
                                ) : null}
                                {barnetsNavn ? <Normaltekst>Navn: {barnetsNavn}</Normaltekst> : null}
                                <Normaltekst>Din relasjon til barnet: {søkersRelasjonTilBarnet}</Normaltekst>
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Grad">{grad}%</ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Er det en annen søker i samme tidsperiode">
                                {harMedsøker === YesOrNo.YES && 'Ja'}
                                {harMedsøker === YesOrNo.NO && 'Nei'}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Arbeidsforhold">
                                {ansettelsesforhold.length > 0
                                    ? ansettelsesforhold.map(({ navn, organisasjonsnummer }) => (
                                          <Normaltekst key={organisasjonsnummer}>
                                              {navn} (organisasjonsnummer: {organisasjonsnummer})
                                          </Normaltekst>
                                      ))
                                    : 'Ingen arbeidsforhold er valgt'}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Bodd i utlandet siste 12 måneder">
                                {harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && 'Ja'}
                                {harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO && 'Nei'}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Skal bo i utlandet neste 12 måneder">
                                {skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && 'Ja'}
                                {skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO && 'Nei'}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader header="Legeerklæring">
                                <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                            </ContentWithHeader>
                        </Box>
                    </Panel>
                </Box>
                <Box margin="l">
                    <ConfirmationCheckboxPanel
                        label="Jeg bekrefter at opplysningene er riktige, og at jeg ikke har holdt tilbake opplysninger som har betydning for retten til pleiepenger."
                        name={Field.harBekreftetOpplysninger}
                        validate={(value) => {
                            let result;
                            if (value !== true) {
                                result = 'Du må bekrefte opplysningene';
                            }
                            return result;
                        }}
                    />
                </Box>
            </FormikStep>
        );
    }
}

export default SummaryStep;
