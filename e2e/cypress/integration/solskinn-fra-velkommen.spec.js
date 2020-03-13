describe('Pleiepenger for sykt barn fra Velkommen', () => {

    beforeEach('intercept mellomlagring og levere tomt objekt', () => {
        cy.server();
        cy.route('/mellomlagring', {}); // mellomlagring må slås av.
    });
    before(() => {
        cy.visit('/soknad/velkommen');
    });
    describe('Velkommen', () => {
        context('Sjekker default verdier i skjema', () => {
            it('Vi har kommet til steget Velkommen', () => {

                it('Har checkboksen "Jeg har lest og forstått", som ikke er merket', () => {
                    cy.get('#harForståttRettigheterOgPlikter')
                        .should('not.be.checked');
                });
            });
            context('Klikker på knappen "GÅ TIL SØKNADEN"', () => {
                it('Går IKKE til neste steg, dersom checkbox ikke er merket', () => {
                    cy.get('button')
                        .click({ position: 'topLeft' });
                    cy.get('#harForståttRettigheterOgPlikter')
                        .should('not.be.checked');
                });
                it('Går til neste steg dersom checkbox er merket', () => {
                    cy.get('#harForståttRettigheterOgPlikter').click({ force: true });
                    cy.get('button')
                        .click({ position: 'topLeft' });
                    cy.location().should((loc) => {
                        expect(loc.pathname).to.eq('/soknad/opplysninger-om-barnet');
                    });
                });
            });
        });
        describe('Barn', () => {
            context('Sjekker default verdier i skjema Barn', () => {
                it('Vi har kommet til steget Barn', () => {
                    cy.location().should((loc) => {
                        expect(loc.pathname).to.eq('/soknad/opplysninger-om-barnet');
                    });
                });
                it('Ingen radio knapper eller checkboxer er merket', () => {
                    cy.get('[name="barnetSøknadenGjelder"]')
                        .parent()
                        .find('input')
                        .should('not.be.checked');
                });
            });
            context('Klikker på knappen "FORTSETT", når ingen av radio eller checkbox er merket', () => {
                it('Går IKKE til neste steg, dersom ingen av radio eller checkbox er merket', () => {
                    cy.get('button')
                        .click({ position: 'topLeft' });
                });
                it('Viser rødt feilmeldings panel', () => {
                    cy.get('article')
                        .should(($article) => {
                            expect($article).to.have.length(1);
                            const className = $article[0].className;
                            expect(className).to.eq('validationErrorSummary step__validationErrorSummary');
                        });
                });
            });
            context('Hvilket barn gjelder søknaden?', () => {
                it('Merker den første radio knappen', () => {
                    cy.get('input[type=radio]').first().click({ force: true });
                });
                it('Klikker på "FORTSETT" knappen', () => {
                    cy.get('button')
                        .click({ position: 'topLeft' });
                    cy.location().should((loc) => {
                        console.log(loc.pathname);
                        //expect(loc.pathname).to.eq('/soknad/tidsrom');
                    });
                });
            });
        });
    });
});
