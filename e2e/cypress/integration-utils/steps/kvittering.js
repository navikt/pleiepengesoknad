const { clickSendInnSøknad } = require('../../integration-utils/utils');
export const kvittering = () => {
    it('STEG 10: Kvittering', () => {
        cy.get('.bekreftCheckboksPanel label').click();
        clickSendInnSøknad();
    });
};
