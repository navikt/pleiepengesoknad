import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import InnsendtSøknadCard from '../../components/innsendt-søknad-card/InnsendtSøknadCard';
import { ImportertSøknad } from '../../types/ImportertSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';

interface Props {
    forrigeSøknad?: ImportertSøknad;
    onConfirm: () => void;
}

const AppForm = getTypedFormComponents<SøknadFormField, SøknadFormValues, ValidationError>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm = ({ forrigeSøknad, onConfirm }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            {forrigeSøknad && (
                <>
                    <InnsendtSøknadCard
                        barn={forrigeSøknad.metaData.barn}
                        mottattDato={forrigeSøknad.metaData.mottatt}
                    />
                    <Box margin="xl">
                        <Element tag="h3">Ønsker du å bruke informasjonen du fylte inn i din forrige søknad?</Element>
                    </Box>
                    <Box margin="s" padBottom="m">
                        <ExpandableInfo title="Hva betyr det?">
                            <p>
                                Det betyr at vi fyller ut denne nye søknaden med innhold fra den forrige. Perioden må du
                                velge på nytt. Informasjon som var knytter til datoer som er utenfor denne nye perioden,
                                må du endre når du går gjennom søknaden.
                            </p>
                            <p>
                                Det er viktig at du kontroller all informasjonen og ser at det fortsatt er riktig for
                                den nye perioden.
                            </p>
                            <p>
                                Informasjonen som kopieres over er kun basert på forrige søknad, og tar ikke høyde for
                                endringer som er gjort i saksbehandlingen etterpå.
                            </p>
                        </ExpandableInfo>
                    </Box>
                    <AppForm.YesOrNoQuestion
                        data-testid="brukForrigeSøknad"
                        name={SøknadFormField.brukForrigeSøknad}
                        labels={{
                            yes: 'Ja, bruk informasjon fra forrige søknaden',
                            no: 'Nei, start en ny søknad',
                        }}
                    />
                </>
            )}
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={SøknadFormField.harForståttRettigheterOgPlikter}
                    data-cy={'harForståttRettigheterOgPlikter'}
                    validate={getCheckedValidator()}>
                    <Box padBottom="s">
                        <Element tag="h3">Takk for at du er ærlig!</Element>
                        <ul style={{ margin: '.5rem', paddingLeft: '1rem' }}>
                            <li style={{ margin: '.5rem 0' }}>
                                Jeg forstår at hvis jeg gir uriktige eller holder tilbake opplysninger kan det få
                                konsekvenser for retten min til pleiepenger.
                            </li>
                            <li>Jeg har lest og forstått det som står på nav.no/rettogplikt</li>
                        </ul>
                    </Box>
                </AppForm.ConfirmationCheckbox>
            </FormBlock>
            <FormBlock>
                <Hovedknapp className={bem.element('startApplicationButton')}>
                    {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                </Hovedknapp>
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
