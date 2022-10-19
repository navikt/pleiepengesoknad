const { selectRadio, selectRadioYes, setInputTime, clickFortsett } = require('../utils');

export const fyllUtArbeidIPeriode = () => {
    selectRadio('jobberRedusert');
    selectRadioYes('er-likt-hver-uke');
    setInputTime('arbeidstid-faste-ukedager__monday', '1', '0');
    setInputTime('arbeidstid-faste-ukedager__tuesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__wednesday', '2', '0');
    setInputTime('arbeidstid-faste-ukedager__friday', '0', '0');
    clickFortsett();
};

export const fyllUtArbeidIPeriodeSteg = (testType) => {
    it('STEG 4: Arbeid i perioden', () => {
        switch (testType) {
            case 'redusertArbeid':
                fyllUtArbeidIPeriode();
                break;
        }
    });
};

/*
export const oppsummeringTestArbeidIPeriodeSteg = (testType) => {
    switch (testType) {
        case 'redusertArbeid':
            oppsummeringTestArbeidssituasjon();
            break;
    }
};
*/
