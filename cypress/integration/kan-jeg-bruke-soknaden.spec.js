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
            it('Info panelet er synlig', ()=> {
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
});
