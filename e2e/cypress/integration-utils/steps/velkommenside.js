const { getElement, getTestElement, getTestElementByType } = require('../utils');

export const fyllUtVelkommenSide = () => {
    it('Velkommenside', () => {
        getTestElement('welcomingPage-harForståttRettigheterOgPlikter').within(() => {
            getTestElementByType('checkbox').click({ force: true });
        });
        getTestElement('welcomingPage-begynnsøknad').within(() => {
            getElement('button').click();
        });
    });
};
