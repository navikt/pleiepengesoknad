describe('Kan jeg bruke den digitale pleiepengesøknaden', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    context('Radioknapp gruppen', () => {
        it('Har 2 radio knapper', () => {
            cy.get('[name="erDuSelvstendigNæringsdrivendeEllerFrilanser"]')
                .should('have.length', 2);
        });
        it('Både Ja og Nei knappene er unchecked', () => {
            cy.get('[name="erDuSelvstendigNæringsdrivendeEllerFrilanser"]')
                .parent()
                .find('input')
                .should('not.be.checked');
        });
    });
    describe('Er du selvstendig næringsdrivende eller frilanser', () => {
        context('Ja, jeg er selvstendig næringsdrivende', () => {
            it('Info panelet er synlig', () => {
                cy.get('[type="radio"]')
                    .first()
                    .check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.dataCy('erSelvstendigEllerFrilanser'); // Custom command; <==> cy.get('[data-cy="erSelvstendigEllerFrilanser"');
            });
        });
        context('Nei, jeg er privatperson', () => {

            it('Linken til søknaden er synlig', () => {
                cy.get('[type="radio"]')
                    .last()
                    .check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.get('a.lenke'); // Sjekk at lenken finnes
            });
        });
    });
    describe('Klikke gjennom og sende inn happy case', () => {
        context('med utmocket, tom mellomlagring', () => {
            it('Gå til welcome page', () => {
                cy.server();
                cy.route("/mellomlagring", {}); // mellomlagring må slås av.
                cy.get('[type="radio"]')
                    .last()
                    .check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.get('a.lenke')
                    .click();
                cy.get('label[for=harForståttRettigheterOgPlikter]')
                    .click();
                cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]')
                    .click();
                cy.get('label[for="RadioPanel-2"]')
                    .last()
                    .click();
                cy.dataCy('fortsett-knapp').click();
                cy.dataCy('fortsett-knapp').click();
                cy.dataCy('fortsett-knapp').click();
                cy.dataCy('fortsett-knapp').click();
            });
        });
    });
});
