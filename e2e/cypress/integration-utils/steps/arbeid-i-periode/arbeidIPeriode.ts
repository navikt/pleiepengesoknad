import { selectRadioPanel, setInputValue, getTestElement, clickFortsett } from '../../utils';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib/types';

export const fyllUtArbeidstidJobberIkke = () => {
    selectRadioPanel(ArbeiderIPeriodenSvar.heltFravær);
};

export const fyllUtArbeidstidJobberSomVanlig = () => {
    selectRadioPanel(ArbeiderIPeriodenSvar.somVanlig);
};

export const fyllUtArbeidstidRedusert = () => {
    selectRadioPanel(ArbeiderIPeriodenSvar.redusert);
    selectRadioPanel('er-likt-hver-uke_yes');
    selectRadioPanel('timer');
    setInputValue('timer-verdi', 20);
};

export const fyllUtArbeidstidRedusertVarierendeTimer = () => {
    const timer: string[] = ['10', '0', '20', '10', '10'];
    selectRadioPanel(ArbeiderIPeriodenSvar.redusert);
    selectRadioPanel('er-likt-hver-uke_no');
    getTestElement('arbeidsuker').within(() => {
        cy.get(`[data-testid="timer-verdi"]`).each((element, idx) => {
            cy.wrap(element).click().type(timer[idx]);
        });
    });
};

export const fyllUtArbeidIPeriodeSteg = () => {
    it('Steg 4: Arbeid i perioden', () => {
        getTestElement('arbeidIPerioden_ansatt').within(() => {
            fyllUtArbeidstidRedusertVarierendeTimer();
        });
        getTestElement('arbeidIPerioden_frilansOppdrag').within(() => {
            fyllUtArbeidstidJobberIkke();
        });
        clickFortsett();
    });
};
