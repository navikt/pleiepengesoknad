import React from 'react';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { OpptjeningIUtlandetApiData } from '../../../types/søknad-api-data/SøknadApiData';

const bem = bemUtils('opptjeningIUtlandetSummaryItem');

export const renderOpptjeningIUtlandetSummary = (opptjening: OpptjeningIUtlandetApiData): React.ReactNode => {
    return (
        <div className={bem.block}>
            <span className={bem.element('dates')} data-testid="oppsummering-opptjeningUtland-date">
                {prettifyDateExtended(apiStringDateToDate(opptjening.fraOgMed))} -{' '}
                {prettifyDateExtended(apiStringDateToDate(opptjening.tilOgMed))}
            </span>
            <span data-testid="oppsummering-opptjeningUtland-info">{`Jobbet i ${
                opptjening.land.landnavn
            } som ${opptjening.opptjeningType.toLowerCase()} hos ${opptjening.navn}`}</span>
        </div>
    );
};
