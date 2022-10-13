const { selectRadio, setInputValue, getTestElement } = require('../utils');

export const fyllUtArbeidIPeriode = () => {
    getTestElement('arbeidIPerioden_ansatt').within(() => {
        selectRadio('ansatt_arbeidsforhold.0.arbeidIPeriode.arbeiderIPerioden_jobberRedusert');
        selectRadio('jobberTimer');
        selectRadio('er-likt-hver-uke_yes');
        setInputValue('timer-verdi', 20);
    });
    getTestElement('arbeidIPerioden_frilanser').within(() => {
        selectRadio('frilans.arbeidsforhold.arbeidIPeriode.arbeiderIPerioden_jobberIkke');
    });
};
