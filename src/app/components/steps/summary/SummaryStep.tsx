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
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import { formatName } from '../../../utils/personUtils';
import { sendApplication } from '../../../api/api';
import { YesOrNo } from '../../../types/YesOrNo';
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';
import ContentSwitcher from '../../content-switcher/ContentSwitcher';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';

export interface SummaryStepProps {
    handleSubmit: () => void;
    values: PleiepengesøknadFormData;
}

interface State {
    sendingInProgress: boolean;
}

type Props = SummaryStepProps & HistoryProps & InjectedIntlProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(barn: BarnReceivedFromApi[]) {
        const { history, values } = this.props;
        this.setState({
            sendingInProgress: true
        });
        try {
            await sendApplication(mapFormDataToApiData(values, barn));
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
        const { handleSubmit, values, history, intl } = this.props;
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
            søknadenGjelderEtAnnetBarn,
            barnetSøknadenGjelder,
            søkersRelasjonTilBarnet,
            harBoddUtenforNorgeSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd,
            grad,
            harMedsøker
        } = values;

        return (
            <SøkerdataContextConsumer>
                {({ person: { fornavn, mellomnavn, etternavn, fodselsnummer }, barn }: Søkerdata) => (
                    <FormikStep
                        id={StepID.SUMMARY}
                        onValidFormSubmit={() => this.navigate(barn)}
                        history={history}
                        useValidationErrorSummary={false}
                        {...stepProps}>
                        <CounsellorPanel>
                            <FormattedMessage id="steg.oppsummering.info" />
                        </CounsellorPanel>
                        <Box margin="xl">
                            <Panel border={true}>
                                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                    <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                    <Normaltekst>
                                        <FormattedMessage id="steg.oppsummering.søker.fnr" values={{ fodselsnummer }} />
                                    </Normaltekst>
                                </ContentWithHeader>

                                <Box margin="l">
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="steg.oppsummering.tidsrom.fomtom"
                                                values={{
                                                    fom: prettifyDate(periodeFra!),
                                                    tom: prettifyDate(periodeTil!)
                                                }}
                                            />
                                        </Normaltekst>
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                                        <ContentSwitcher
                                            firstContent={() => {
                                                const barnReceivedFromApi = barn.find(
                                                    ({ aktoer_id }) => aktoer_id === barnetSøknadenGjelder
                                                );
                                                return barnReceivedFromApi ? (
                                                    <>
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.navn"
                                                                values={{
                                                                    navn: formatName(
                                                                        barnReceivedFromApi!.fornavn,
                                                                        barnReceivedFromApi!.etternavn,
                                                                        barnReceivedFromApi!.mellomnavn
                                                                    )
                                                                }}
                                                            />
                                                        </Normaltekst>
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.fodselsdato"
                                                                values={{
                                                                    dato: prettifyDate(barnReceivedFromApi!.fodselsdato)
                                                                }}
                                                            />
                                                        </Normaltekst>
                                                    </>
                                                ) : (
                                                    <></>
                                                );
                                            }}
                                            secondContent={() => (
                                                <>
                                                    {barnetHarIkkeFåttFødselsnummerEnda &&
                                                    barnetsForeløpigeFødselsnummerEllerDNummer ? (
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.forelopigFnr"
                                                                values={{
                                                                    fnr: barnetsForeløpigeFødselsnummerEllerDNummer
                                                                }}
                                                            />
                                                        </Normaltekst>
                                                    ) : null}
                                                    {!barnetHarIkkeFåttFødselsnummerEnda ? (
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.fnr"
                                                                values={{ fnr: barnetsFødselsnummer }}
                                                            />
                                                        </Normaltekst>
                                                    ) : null}
                                                    {barnetsNavn ? (
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.navn"
                                                                values={{ navn: barnetsNavn }}
                                                            />
                                                        </Normaltekst>
                                                    ) : null}
                                                    <Normaltekst>
                                                        <FormattedMessage
                                                            id="steg.oppsummering.barnet.søkersRelasjonTilBarnet"
                                                            values={{ relasjon: søkersRelasjonTilBarnet }}
                                                        />
                                                    </Normaltekst>
                                                </>
                                            )}
                                            showFirstContent={
                                                isFeatureEnabled(Feature.HENT_BARN_FEATURE) &&
                                                !søknadenGjelderEtAnnetBarn &&
                                                barn &&
                                                barn.length > 0
                                            }
                                        />
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.grad.header')}>
                                        {grad}%
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.annenSøkerSammePeriode.header')}>
                                        {harMedsøker === YesOrNo.YES && intlHelper(intl, 'Ja')}
                                        {harMedsøker === YesOrNo.NO && intlHelper(intl, 'Nei')}
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
                                        {ansettelsesforhold.length > 0 ? (
                                            ansettelsesforhold.map(({ navn, organisasjonsnummer }) => (
                                                <Normaltekst key={organisasjonsnummer}>
                                                    <FormattedMessage
                                                        id="steg.oppsummering.arbeidsforhold.forhold"
                                                        values={{ navn, organisasjonsnummer }}
                                                    />
                                                </Normaltekst>
                                            ))
                                        ) : (
                                            <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
                                        )}
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                        {harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && intlHelper(intl, 'Ja')}
                                        {harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO && intlHelper(intl, 'Nei')}
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                        {skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && intlHelper(intl, 'Ja')}
                                        {skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO && intlHelper(intl, 'Nei')}
                                    </ContentWithHeader>
                                </Box>
                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                        <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                    </ContentWithHeader>
                                </Box>
                            </Panel>
                        </Box>
                        <Box margin="l">
                            <ConfirmationCheckboxPanel
                                label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                name={Field.harBekreftetOpplysninger}
                                validate={(value) => {
                                    let result;
                                    if (value !== true) {
                                        result = intlHelper(
                                            intl,
                                            'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet'
                                        );
                                    }
                                    return result;
                                }}
                            />
                        </Box>
                    </FormikStep>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(SummaryStep);
