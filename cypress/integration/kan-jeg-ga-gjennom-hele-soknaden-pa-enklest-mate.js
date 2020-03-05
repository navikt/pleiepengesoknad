function clickFortsett() {
    cy.dataCy('fortsett-knapp').click();
}

function clickNeiPaAlleSporsmal() {
    cy.get('label[class="inputPanel radioPanel"]').each(element => {
        if (element.text() === 'Nei') {
            element.click();
        }
    });
}

describe('Kan jeg klikke meg gjennom en hele søknad på enklest mulig måte', () => {
    context('med utmocket, tom mellomlagring', () => {

            it('er mulig å klikke gjennom hele søknaden', () => {
                cy.visit('/');
                cy.server();
                cy.route("/mellomlagring", {}); // mellomlagring må slås av.
            });

            it('INTROSIDE', () => {
                cy.get('[type="radio"]')
                    .last()
                    .check({ force: true }); // Må, bruke force her, pga cypress tror radio-knappen har størrelse (0,0)
                cy.get('a.lenke')
                    .click();

            });

            it('VELKOMMEN SIDE', () => {

                cy.get('label[for=harForståttRettigheterOgPlikter]')
                    .click();
                cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]')
                    .click();

            });

            it('STEG 1: BARN', () => {
                cy.get('label[class="inputPanel radioPanel"]')
                    .last()
                    .click();

                clickFortsett();
            });

            it('STEG 2: PERIODEN MED PLEIEPENGER', () => {
                // TODO: Fikse bug som gjør at man ikke kan skrive i inputfeltet direkte. Må bruke datovelger.
                // cy.get('[name="periodeFra"]').type("01.01.2021");

                // Velg periode, fom
                cy.get("[class=nav-datovelger__kalenderknapp]")
                    .first()
                    .click();
                cy.get("[class=DayPicker-Week]").contains(14).first().click();

                // Velg periode, tom
                cy.get("[class=nav-datovelger__kalenderknapp]")
                    .last()
                    .click();
                cy.get("[class=DayPicker-Week]").contains(15).first().click();

                // Andre som søker om samme periode?
                cy.get("label[class=\"inputPanel radioPanel\"]").last().click();
                clickFortsett();

            });

            it('STEG 3: Arbeidsforhold', () => {
                clickNeiPaAlleSporsmal();
                clickFortsett();
            });

            it('STEG 4: Omsorgstilbud', () => {
                clickNeiPaAlleSporsmal();
                clickFortsett();
            });

            it('STEG 5: Medlemskap', () => {
                clickNeiPaAlleSporsmal();
                clickFortsett();
            });

            it('STEG 6: LAST OPP LEGEERKLÆRING', () => {
                const fileName="navlogopng.png";
                cy.fixture(fileName, 'binary')
                    .then(Cypress.Blob.binaryStringToBlob)
                    .then((fileContent) =>
                        cy.get('input[type=file]').upload({
                            fileContent,
                            fileName,
                            mimeType: "image/png",//getMimeType(fileName),
                            encoding: 'utf8'
                        })
                    );
                clickFortsett();
            });

            it('STEG 7: Oppsummering', () => {
                cy.get("label[for=harBekreftetOpplysninger]").first().click();
                clickFortsett();
            });

            it('SØKNAD SENDT page should have h1 header', () => {
                cy.get("h1").contains("Vi har mottatt søknad fra deg om pleiepenger");
            });
    });
});