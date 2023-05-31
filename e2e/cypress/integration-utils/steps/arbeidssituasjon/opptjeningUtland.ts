import dayjs = require('dayjs');
import { gotoStep } from '../../contextConfig';
import { TestType } from '../../types/TestTyper';
import {
    getElement,
    getInputByName,
    getTestElement,
    getTestElementByType,
    gåTilOppsummeringFraArbeidssituasjon,
    selectRadioNo,
    selectRadioYes,
} from '../../utils';

const arbeidsgiverenAnnetEQS = 'Google';
const dato = dayjs().startOf('day').subtract(1, 'day');
const fraDatoTilDato = dato.format('DD.MM.YYYY');
const expectedOpptjeningLand = 'Belgia';
const expectedOpptjeningType = 'arbeidstaker';
const expectedOpptjeningDato = `${dato.format('D. MMM YYYY')} - ${dato.format('D. MMM YYYY')}`;

const fyllUtArbeidssituasjonUtenOpptjeningUtland = () => {
    getTestElement('arbeidssituasjonOpptjeningUtland').within(() => {
        selectRadioNo('har-opptjeningUtland');
    });
};

const fyllUtArbeidssituasjonMedOpptjeningUtland = () => {
    getTestElement('arbeidssituasjonOpptjeningUtland').within(() => {
        selectRadioYes('har-opptjeningUtland');
    });
    getElement('button').contains('Legg til jobb i et annet EØS-land').click();
    cy.get('[aria-label="Jobbet i et annet EØS-land"]').within(() => {
        getInputByName('fom').click().type(fraDatoTilDato).blur();
        getInputByName('tom').click().type(fraDatoTilDato).blur();
        getElement('select').select(1);
        getTestElementByType('radio').eq(0).check({ force: true });
        getInputByName('navn').click().type(arbeidsgiverenAnnetEQS).blur();
        getElement('button[type="submit"]').click();
    });
};

// arbeidssituasjon-opptjeningUtland

export const fyllUtArbeidssituasjonOpptjeningUtland = (type: TestType = TestType.ENKEL) => {
    switch (type) {
        case TestType.KOMPLETT:
            fyllUtArbeidssituasjonMedOpptjeningUtland();
            break;
        default:
            fyllUtArbeidssituasjonUtenOpptjeningUtland();
            break;
    }
};

export const testArbeidssituasjonOpptjeningUtland = () => {
    it('har ikke utenlandsk opptjening', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonUtenOpptjeningUtland();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('oppsummering-opptjeningUtland-nei');
        el.should('contain', 'Nei');
    });
    it('har utenlandsk opptjening', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonMedOpptjeningUtland();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('oppsummering-opptjeningUtland');
        el.should('contain', expectedOpptjeningDato);
        el.should(
            'contain',
            `Jobbet i ${expectedOpptjeningLand} som ${expectedOpptjeningType} hos ${arbeidsgiverenAnnetEQS}`
        );
    });
};
