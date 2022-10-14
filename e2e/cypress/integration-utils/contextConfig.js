const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

export const contextConfig = () => {
    beforeEach('intercept mellomlagring og levere tomt objekt', () => {
        cy.server();
        cy.route(`/mellomlagring`, {}); // mellomlagring må slås av.
    });
    before('gå til startsiden', () => {
        cy.visit(`${PUBLIC_PATH}/soknad`);
    });
};
