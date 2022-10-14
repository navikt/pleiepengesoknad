const { getElement, getTestElementByClass } = require('../utils');

export const fyllUtVelkommenSide = () => {
    it('Velkommenside', () => {
        getElement('.bekreftCheckboksPanel label').click();
        getTestElementByClass('knapp welcomingPage__startApplicationButton knapp--hoved').click();
    });
};
