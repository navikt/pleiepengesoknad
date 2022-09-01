import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import { ForrigeSøknad } from '../../types/ForrigeSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';

interface Props {
    forrigeSøknad?: ForrigeSøknad;
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
}

const AppForm = getTypedFormComponents<SøknadFormField, SøknadFormValues, ValidationError>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm = ({ forrigeSøknad, onConfirm, onOpenDinePlikterModal }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            {forrigeSøknad && (
                <Box margin="xl">
                    <Undertittel tag="h3">Ønsker du å bruke informasjon fra din forrige søknad?</Undertittel>
                    <p>
                        Du sendte inn en søknad om pleiepenger for Barn Barnesen den 28. juni. 2022. Ønsker du at vi
                        skal fylle ut denne nye søknaden med informasjon fra den forrige søknaden?
                    </p>
                    <ExpandableInfo title="Hva betyr det?">
                        <p>
                            Det betyr at vi fyller ut denne nye søknaden med innhold fra den forrige. Perioden må du
                            velge på nytt. Informasjon som var knytter til datoer som er utenfor denne nye perioden, må
                            du endre når du går gjennom søknaden.
                        </p>
                        <p>
                            Det er viktig at du kontroller all informasjonen og ser at det fortsatt er riktig for den
                            nye perioden.
                        </p>
                        <p>
                            Informasjonen som kopieres over er kun basert på forrige søknad, og tar ikke høyde for
                            endringer som er gjort i saksbehandlingen etterpå.
                        </p>
                    </ExpandableInfo>
                    <AppForm.YesOrNoQuestion
                        name={SøknadFormField.brukForrigeSøknad}
                        labels={{
                            yes: 'Ja, bruk informasjon fra forrige søknaden',
                            no: 'Nei, jeg vil starte med en som søknad',
                        }}
                    />
                </Box>
            )}
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={SøknadFormField.harForståttRettigheterOgPlikter}
                    data-cy={'harForståttRettigheterOgPlikter'}
                    validate={getCheckedValidator()}>
                    <FormattedMessage
                        id="welcomingPage.samtykke.harForståttLabel"
                        values={{
                            plikterLink: (
                                <Lenke href="#" onClick={onOpenDinePlikterModal}>
                                    {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                </Lenke>
                            ),
                        }}
                    />
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
