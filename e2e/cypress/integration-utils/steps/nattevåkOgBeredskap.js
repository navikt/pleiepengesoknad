const { getTestElement, clickFortsett, selectRadioYes } = require('../utils');

const nattevåkTilleggsinfo = 'Test nattevåk tilleggsinfo';
const beredskapTilleggsinfo = 'Test beredskap tilleggsinfo';

const fyllUtNattevåkOgBeredskap = () => {
    selectRadioYes('nattevåk');
    getTestElement('nattevåk-tilleggsinfo').click().type(nattevåkTilleggsinfo).blur();

    selectRadioYes('beredskap');
    getTestElement('beredskap-tilleggsinfo').click().type(beredskapTilleggsinfo).blur();

    clickFortsett();
};

const oppsummeringTestNattevåkOgBeredskap = () => {
    getTestElement('oppsummering-nattevåk').should((element) => expect('Ja').equal(element.text()));
    getTestElement('oppsummering-nattevåk-tilleggsinformasjon').should((element) =>
        expect(nattevåkTilleggsinfo).equal(element.text())
    );

    getTestElement('oppsummering-beredskap').should((element) => expect('Ja').equal(element.text()));
    getTestElement('oppsummering-beredskap-tilleggsinformasjon').should((element) =>
        expect(beredskapTilleggsinfo).equal(element.text())
    );
};

export const fyllUtNattevåkOgBeredskapSteg = (testType) => {
    it('STEG 6: Nattevåk og beredskap', () => {
        switch (testType) {
            case 'full':
                fyllUtNattevåkOgBeredskap();
                break;
        }
    });
};

export const oppsummeringTestNattevåkOgBeredskapSteg = (testType) => {
    switch (testType) {
        case 'full':
            oppsummeringTestNattevåkOgBeredskap();
            break;
    }
};
