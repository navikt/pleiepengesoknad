const { selectRadio, selectRadioYes, setInputTime } = require('../utils');

export const fyllUtArbeidIPeriode = () => {
    selectRadio('ansatt_arbeidsforhold.0.arbeidIPeriode.arbeiderIPerioden_jobberRedusert');
    selectRadioYes('er-likt-hver-uke');
    setInputTime('arbeidstid-faste-ukedager__monday', '1', '0');
    setInputTime('arbeidstid-faste-ukedager__tuesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__wednesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__friday', '0', '0');
    selectRadio('frilans.arbeidsforhold.arbeidIPeriode.arbeiderIPerioden_jobberIkke');
};
