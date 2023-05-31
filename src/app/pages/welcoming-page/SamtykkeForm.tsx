import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core-ds/lib/atoms/form-block/FormBlock';
import bemHelper from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik-ds';
import getIntlFormErrorHandler from '@navikt/sif-common-formik-ds/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik-ds/lib/validation/types';
import Lenke from 'nav-frontend-lenker';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { getCheckedValidator } from '@navikt/sif-common-formik-ds/lib/validation';
import { Undertittel } from 'nav-frontend-typografi';
import InfoList from './components/info-list/InfoList';
import getLenker from '../../lenker';
import { Button } from '@navikt/ds-react';

interface Props {
    onConfirm: () => void;
}

const AppForm = getTypedFormComponents<SøknadFormField, SøknadFormValues, ValidationError>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm = ({ onConfirm }: Props) => {
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <div data-testid={'welcomingPage-harForståttRettigheterOgPlikter'}>
                    <AppForm.ConfirmationCheckbox
                        label={intlHelper(intl, 'page.velkommen.form.bekreftLabel')}
                        name={SøknadFormField.harForståttRettigheterOgPlikter}
                        validate={getCheckedValidator()}>
                        <Undertittel tag="h2">
                            <strong>
                                <FormattedMessage id="page.velkommen.form.ansvar.tittel" />
                            </strong>
                        </Undertittel>
                        <InfoList>
                            <li>
                                <FormattedMessage id="page.velkommen.form.ansvar.list.1" />
                            </li>
                            <li>
                                <FormattedMessage id="page.velkommen.form.ansvar.list.2.1" />{' '}
                                <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                                    <FormattedMessage id="page.velkommen.form.ansvar.list.2.2" />
                                </Lenke>
                            </li>
                        </InfoList>
                    </AppForm.ConfirmationCheckbox>
                </div>
            </FormBlock>
            <FormBlock>
                <div data-testid={'welcomingPage-begynnsøknad'}>
                    <Button variant="primary" type="submit" className={bem.element('startApplicationButton')}>
                        {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                    </Button>
                </div>
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
