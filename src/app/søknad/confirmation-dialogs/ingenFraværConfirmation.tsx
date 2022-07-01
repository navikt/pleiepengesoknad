import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { ConfirmationDialog } from '../../types/ConfirmationDialog';

type Props = Pick<ConfirmationDialog, 'onCancel' | 'onConfirm'>;

export const getIngenFraværConfirmationDialog = (props: Props): ConfirmationDialog => ({
    ...props,
    title: 'Ingen fravær registrert',
    okLabel: 'Ja, det stemmer',
    cancelLabel: 'Nei, det stemmer ikke',
    content: (
        <div style={{ maxWidth: '35rem' }}>
            <Undertittel>Fravær fra jobb</Undertittel>
            <p>
                Du har oppgitt at du jobber som normalt og ikke har fravær i perioden du søker for. For å ha rett til
                pleiepenger må du ha fravær fra jobb fordi du tar vare på og pleier barn. Stemmer det at du ikke har
                fravær fra jobb i perioden du søker for?
            </p>
        </div>
    ),
});
