import { selectRadio, setInputValue, getTestElement } from '../../utils';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib/types';

export const fyllUtArbeidstidJobberIkke = () => {
    selectRadio(ArbeiderIPeriodenSvar.heltFravær);
};

export const fyllUtArbeidstidJobberSomVanlig = () => {
    selectRadio(ArbeiderIPeriodenSvar.somVanlig);
};

export const fyllUtArbeidstidRedusert = () => {
    selectRadio(ArbeiderIPeriodenSvar.redusert);
    selectRadio('timer');
    selectRadio('er-likt-hver-uke_yes');
    setInputValue('timer-verdi', 20);
};

export const fyllUtArbeidstidRedusertVarierendeTimer = () => {
    const timer: string[] = ['10', '0', '20', '10', '10'];
    selectRadio(ArbeiderIPeriodenSvar.redusert);
    selectRadio('timer');
    selectRadio('er-likt-hver-uke_no');
    getTestElement('arbeidsuker').within(() => {
        cy.get(`[data-testid="timer-verdi"]`).each((element, idx) => {
            cy.wrap(element).click().type(timer[idx]);
        });
    });
};

export const fyllUtArbeidIPeriode = () => {
    getTestElement('arbeidIPerioden_ansatt').within(() => {
        fyllUtArbeidstidRedusertVarierendeTimer();
    });
    getTestElement('arbeidIPerioden_frilanser').within(() => {
        fyllUtArbeidstidJobberIkke();
    });
};
