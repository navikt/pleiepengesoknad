import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field } from '../../../types/PleiepengesøknadFormData';
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
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';
import ContentSwitcher from '../../content-switcher/ContentSwitcher';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import { Locale } from 'app/types/Locale';
import GradertAnsettelsesforholdSummary from 'app/components/gradert-ansettelsesforhold-summary/GradertAnsettelsesforholdSummary';
import TilsynsordningSummary from './TilsynsordningSummary';
import TextareaSummary from '../../textarea-summary/TextareaSummary';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';

interface State {
    sendingInProgress: boolean;
}

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(barn: BarnReceivedFromApi[]) {
        const { history, formValues, intl } = this.props;
        this.setState({
            sendingInProgress: true
        });
        if (appIsRunningInDemoMode()) {
            navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
        } else {
            try {
                await sendApplication(mapFormDataToApiData(formValues, barn, intl.locale as Locale));
                navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
                }
            }
        }
    }

    render() {
        const { handleSubmit, formValues, history, intl } = this.props;
        const { sendingInProgress } = this.state;
        const stepProps = {
            formValues,
            handleSubmit,
            showButtonSpinner: sendingInProgress,
            buttonDisabled: sendingInProgress
        };

        return (
            <SøkerdataContextConsumer>
                {({ person: { fornavn, mellomnavn, etternavn, fodselsnummer }, barn }: Søkerdata) => {
                    const apiValues = mapFormDataToApiData(formValues, barn, intl.locale as Locale);

                    const { tilsynsordning, nattevaak, beredskap } = apiValues;

                    return (
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
                                            <FormattedMessage
                                                id="steg.oppsummering.søker.fnr"
                                                values={{ fodselsnummer }}
                                            />
                                        </Normaltekst>
                                    </ContentWithHeader>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                            <Normaltekst>
                                                <FormattedMessage
                                                    id="steg.oppsummering.tidsrom.fomtom"
                                                    values={{
                                                        fom: prettifyDate(apiValues.fra_og_med),
                                                        tom: prettifyDate(apiValues.til_og_med)
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
                                                        ({ aktoer_id }) =>
                                                            aktoer_id === formValues.barnetSøknadenGjelder
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
                                                                        dato: prettifyDate(
                                                                            barnReceivedFromApi!.fodselsdato
                                                                        )
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
                                                        {apiValues.barn.alternativ_id ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.forelopigFnr"
                                                                    values={{
                                                                        fnr: apiValues.barn.alternativ_id
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {!apiValues.barn.alternativ_id ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fnr"
                                                                    values={{ fnr: apiValues.barn.fodselsnummer }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {apiValues.barn.navn ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.navn"
                                                                    values={{ navn: apiValues.barn.navn }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.søkersRelasjonTilBarnet"
                                                                values={{ relasjon: apiValues.relasjon_til_barnet }}
                                                            />
                                                        </Normaltekst>
                                                    </>
                                                )}
                                                showFirstContent={
                                                    !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0
                                                }
                                            />
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.har_medsoker && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                                <FormattedMessage id={apiValues.samtidig_hjemme ? 'Ja' : 'Nei'} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.annenSøkerSammePeriode.header'
                                            )}>
                                            {apiValues.har_medsoker === true && intlHelper(intl, 'Ja')}
                                            {apiValues.har_medsoker === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.ansettelsesforhold.header')}>
                                            {apiValues.arbeidsgivere.organisasjoner.length > 0 ? (
                                                apiValues.arbeidsgivere.organisasjoner.map((forhold) => (
                                                    <GradertAnsettelsesforholdSummary
                                                        key={forhold.organisasjonsnummer}
                                                        ansettelsesforhold={forhold}
                                                    />
                                                ))
                                            ) : (
                                                <FormattedMessage id="steg.oppsummering.ansettelsesforhold.ingenAnsettelsesforhold" />
                                            )}
                                        </ContentWithHeader>
                                    </Box>

                                    {tilsynsordning && <TilsynsordningSummary tilsynsordning={tilsynsordning} />}
                                    {nattevaak && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(intl, 'steg.oppsummering.nattevåk.header')}>
                                                    {nattevaak.har_nattevaak === true && intlHelper(intl, 'Ja')}
                                                    {nattevaak.har_nattevaak === false && intlHelper(intl, 'Nei')}
                                                    {nattevaak.har_nattevaak === true &&
                                                        nattevaak.tilleggsinformasjon && (
                                                            <TextareaSummary text={nattevaak.tilleggsinformasjon} />
                                                        )}
                                                </ContentWithHeader>
                                            </Box>
                                        </>
                                    )}
                                    {beredskap && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.beredskap.header')}>
                                                {beredskap.i_beredskap === true && intlHelper(intl, 'Ja')}
                                                {beredskap.i_beredskap === false && intlHelper(intl, 'Nei')}
                                                {beredskap.tilleggsinformasjon && (
                                                    <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                                )}
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
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
                    );
                }}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(SummaryStep);
