const { selectRadio, selectRadioYes, setInputTime } = require('../utils');

export const fyllUtArbeidIPeriode = () => {
    selectRadio('jobberRedusert');
    selectRadioYes('er-likt-hver-uke');
    setInputTime('arbeidstid-faste-ukedager__monday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__tuesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__wednesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__friday', '0', '0');
};
