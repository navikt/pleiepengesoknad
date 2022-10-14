import { selectRadio, setInputValue, getTestElement } from '../../utils';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib/types';
import { TimerEllerProsent } from '../../../../../src/app/types/TimerEllerProsent';

export const fyllUtArbeidstidJobberIkke = () => {
    selectRadio(ArbeiderIPeriodenSvar.heltFravær);
};

export const fyllUtArbeidstidJobberSomVanlig = () => {
    selectRadio(ArbeiderIPeriodenSvar.somVanlig);
};

export const fyllUtArbeidstidRedusert = () => {
    selectRadio(ArbeiderIPeriodenSvar.redusert);
    selectRadio(TimerEllerProsent.TIMER);
    selectRadio('er-likt-hver-uke_yes');
    setInputValue('timer-verdi', 20);
};

export const fyllUtArbeidIPeriode = () => {
    getTestElement('arbeidIPerioden_ansatt').within(() => {
        fyllUtArbeidstidRedusert();
    });
    getTestElement('arbeidIPerioden_frilanser').within(() => {
        fyllUtArbeidstidJobberIkke();
    });
};
