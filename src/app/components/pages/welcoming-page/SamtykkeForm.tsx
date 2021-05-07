import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';

interface Props {
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
}

const AppForm = getTypedFormComponents<AppFormField, PleiepengesøknadFormData, ValidationError>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm = ({ onConfirm, onOpenDinePlikterModal }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={AppFormField.harForståttRettigheterOgPlikter}
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
