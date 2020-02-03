import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { prettifyDate, apiStringDateToDate } from 'common/utils/dateUtils';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import { formatName } from 'common/utils/personUtils';
import { sendApplication, purge } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';
import ContentSwitcher from 'common/components/content-switcher/ContentSwitcher';
import { WrappedComponentProps, FormattedMessage, injectIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { Locale } from 'common/types/Locale';
import ArbeidsforholdSummary from 'app/components/arbeidsforhold-summary/ArbeidsforholdSummary';
import TilsynsordningSummary from './TilsynsordningSummary';
import TextareaSummary from '../../../../common/components/textarea-summary/TextareaSummary';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import ValidationErrorSummaryBase from '../../../../common/components/validation-error-summary-base/ValidationErrorSummaryBase';
import { validateApiValues } from '../../../validation/apiValuesValidation';
import SummaryList from 'common/components/summary-list/SummaryList';
import {
    renderUtenlandsoppholdSummary,
    renderUtenlandsoppholdIPeriodenSummary,
    renderFerieuttakIPeriodenSummary
} from 'app/components/summary-renderers/renderUtenlandsoppholdSummary';
import FormikConfirmationCheckboxPanel from 'common/formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import Panel from 'nav-frontend-paneler';

interface State {
    sendingInProgress: boolean;
}

type Props = CommonStepFormikProps & HistoryProps & WrappedComponentProps;

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
                await purge();
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
                    const apiValuesValidationErrors = validateApiValues(apiValues, intl);

                    const {
                        medlemskap,
                        tilsynsordning,
                        nattevaak,
                        beredskap,
                        utenlandsopphold_i_perioden,
                        ferieuttak_i_perioden
                    } = apiValues;

                    return (
                        <FormikStep
                            id={StepID.SUMMARY}
                            onValidFormSubmit={() => this.navigate(barn)}
                            history={history}
                            useValidationErrorSummary={false}
                            showSubmitButton={apiValuesValidationErrors === undefined}
                            customErrorSummaryRenderer={
                                apiValuesValidationErrors
                                    ? () => (
                                          <ValidationErrorSummaryBase
                                              title={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                                              errors={apiValuesValidationErrors}
                                          />
                                      )
                                    : undefined
                            }
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
                                                        fom: prettifyDate(apiStringDateToDate(apiValues.fra_og_med)),
                                                        tom: prettifyDate(apiStringDateToDate(apiValues.til_og_med))
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
                                                                    id="steg.oppsummering.barnet.fødselsdato"
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
                                                        {apiValues.barn.fodselsdato ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fødselsdato"
                                                                    values={{
                                                                        dato: prettifyDate(
                                                                            apiStringDateToDate(
                                                                                apiValues.barn.fodselsdato
                                                                            )
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {!apiValues.barn.fodselsdato ? (
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
                                    {apiValues.har_medsoker && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                                <FormattedMessage id={apiValues.samtidig_hjemme ? 'Ja' : 'Nei'} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                    {/* Utenlandsopphold i perioden */}
                                    {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) && utenlandsopphold_i_perioden && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                    )}>
                                                    <FormattedMessage
                                                        id={
                                                            utenlandsopphold_i_perioden.skal_oppholde_seg_i_i_utlandet_i_perioden
                                                                ? 'Ja'
                                                                : 'Nei'
                                                        }
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                            {utenlandsopphold_i_perioden.opphold.length > 0 && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.utenlandsoppholdIPerioden.listetittel'
                                                        )}>
                                                        <SummaryList
                                                            items={utenlandsopphold_i_perioden.opphold}
                                                            itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                                                        />
                                                    </ContentWithHeader>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                    {/* Ferieuttak i perioden */}
                                    {isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK) && ferieuttak_i_perioden && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.ferieuttakIPerioden.header'
                                                    )}>
                                                    <FormattedMessage
                                                        id={
                                                            ferieuttak_i_perioden.skal_ta_ut_ferie_i_periode
                                                                ? 'Ja'
                                                                : 'Nei'
                                                        }
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                            {ferieuttak_i_perioden.ferieuttak.length > 0 && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.ferieuttakIPerioden.listetittel'
                                                        )}>
                                                        <SummaryList
                                                            items={ferieuttak_i_perioden.ferieuttak}
                                                            itemRenderer={renderFerieuttakIPeriodenSummary}
                                                        />
                                                    </ContentWithHeader>
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
                                            {apiValues.arbeidsgivere.organisasjoner.length > 0 ? (
                                                apiValues.arbeidsgivere.organisasjoner.map((forhold) => (
                                                    <ArbeidsforholdSummary
                                                        key={forhold.organisasjonsnummer}
                                                        arbeidsforhold={forhold}
                                                    />
                                                ))
                                            ) : (
                                                <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
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
                                    {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_siste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetSiste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_siste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_neste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetNeste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_neste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
                                    </Box>
                                </Panel>
                            </Box>
                            <Box margin="l">
                                <FormikConfirmationCheckboxPanel<AppFormField>
                                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                    name={AppFormField.harBekreftetOpplysninger}
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
