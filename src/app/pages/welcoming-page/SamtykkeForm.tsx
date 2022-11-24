import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { dateFormatter } from '@navikt/sif-common-utils/lib';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Element, Undertittel } from 'nav-frontend-typografi';
import getLenker from '../../lenker';
import { RegistrerteBarn } from '../../types';
import { ImportertSøknad } from '../../types/ImportertSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';

interface Props {
    forrigeSøknad?: ImportertSøknad;
    onConfirm: () => void;
}

const AppForm = getTypedFormComponents<SøknadFormField, SøknadFormValues, ValidationError>();

const bem = bemHelper('welcomingPage');

const getBarnNavn = (barn: RegistrerteBarn): string => {
    return formatName(barn.fornavn, barn.etternavn, barn.mellomnavn);
};

const SamtykkeForm = ({ forrigeSøknad, onConfirm }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            {forrigeSøknad && (
                <Box margin="xl">
                    <Undertittel tag="h2">Vil du bruke informasjon fra den forrige søknaden du sendte?</Undertittel>
                    <p>
                        Du sendte en søknad om pleiepenger for {getBarnNavn(forrigeSøknad.metaData.barn)}{' '}
                        {dateFormatter.full(forrigeSøknad.metaData.mottatt)}. Vil du at vi skal kopiere informasjonen du
                        fylte inn da, og legge den inn i denne søknaden? Noe må du fremdeles fylle ut selv, og du må
                        kontrollere at alt er riktig før du sender inn søknaden.
                    </p>
                    <ExpandableInfo title="Hva betyr dette?">
                        <p>
                            Dette betyr at du får en søknad som er fylt ut likt som den forrige søknaden du sendte. Vi
                            kopierer informasjonen du fylte inn, og legger den over i denne nye søknaden. På den måten
                            får du en søknad som nesten er ferdig utfylt, men noe må du fremdeles fylle ut selv.
                        </p>
                        <Box margin="l">
                            <Element tag="h3">Det er viktig å legge merke til at</Element>
                            <ul>
                                <li>
                                    du fremdeles må gjennom alle spørsmålene, og kontrollere at alt fremdeles stemmer.
                                </li>
                                <li>noe må du fylle inn på nytt, som for eksempel perioden du søker for nå.</li>
                                <li>
                                    eventuelle datoer som kommer utenfor perioden du søker om nå, må du endre. Det kan
                                    for eksempel være at du la inn ferie i den forrige søknaden, som ikke gjelder
                                    lenger.
                                </li>
                                <li>
                                    Informasjonen vi kopierer og legger inn er kun basert på det du la inn i forrige
                                    søknad, og tar for eksempel ikke med eventuelle endringer som er gjort i
                                    saksbehandlingen.
                                </li>
                            </ul>
                        </Box>
                    </ExpandableInfo>
                    <AppForm.YesOrNoQuestion
                        data-testid="brukForrigeSøknad"
                        name={SøknadFormField.brukForrigeSøknad}
                        labels={{
                            yes: 'Ja, bruk informasjon fra forrige søknad',
                            no: 'Nei, jeg vil fylle ut all informasjon på nytt',
                        }}
                    />
                </Box>
            )}
            <FormBlock>
                <div data-testid={'welcomingPage-harForståttRettigheterOgPlikter'}>
                    <AppForm.ConfirmationCheckbox
                        label="Jeg bekrefter at jeg har lest og forstått"
                        name={SøknadFormField.harForståttRettigheterOgPlikter}
                        data-cy={'harForståttRettigheterOgPlikter'}
                        validate={getCheckedValidator()}>
                        <Element tag="h3">
                            <strong>Ditt ansvar som søker</strong>
                        </Element>
                        <ul>
                            <li>
                                Jeg forstår at hvis jeg gir uriktige opplysninger, kan det få konsekvenser for retten
                                min til det jeg søker om
                            </li>
                            <li>
                                Jeg har lest og forstått det som står på{' '}
                                <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                                    nav.no/rett og plikt
                                </Lenke>
                            </li>
                        </ul>
                    </AppForm.ConfirmationCheckbox>
                </div>
            </FormBlock>
            <FormBlock>
                <div data-testid={'welcomingPage-begynnsøknad'}>
                    <Hovedknapp className={bem.element('startApplicationButton')}>
                        {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                    </Hovedknapp>
                </div>
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
