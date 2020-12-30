import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents } from '@sif-common/formik/';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import bemHelper from '@sif-common/core/utils/bemUtils';
import { commonFieldErrorRenderer } from '@sif-common/core/utils/commonFieldErrorRenderer';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';

interface Props {
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
}

const AppForm = getTypedFormComponents<AppFormField, PleiepengesøknadFormData>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm = ({ onConfirm, onOpenDinePlikterModal }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <AppForm.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={AppFormField.harForståttRettigheterOgPlikter}
                    data-cy={'harForståttRettigheterOgPlikter'}
                    validate={(value) => {
                        let result;
                        if (value !== true) {
                            result = intlHelper(intl, 'welcomingPage.samtykke.harIkkeGodkjentVilkår');
                        }
                        return result;
                    }}>
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
                    <FormattedMessage id="welcomingPage.samtykke.omMellomlagring" tagName="p" />
                    <FormattedMessage id="welcomingPage.samtykke.omSkjema" tagName="p" />
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
