const clickFortsett = () => cy.get('button[aria-label="Gå til neste steg"]').click();
const clickSendInnSøknad = () => cy.get('button[aria-label="Send inn søknaden"]').click();

const clickNeiPaAlleSporsmal = () => {
    cy.get('label[class="inputPanel radioPanel"]').each((element) => {
        if (element.text() === 'Nei') {
            element.click();
        }
    });
};

describe('Kan jeg klikke meg gjennom en hele søknad på enklest mulig måte', () => {
    context('med utmocket, tom mellomlagring', () => {
        beforeEach('intercept mellomlagring og levere tomt objekt', () => {
            cy.server();
            cy.route('/mellomlagring', {}); // mellomlagring må slås av.
        });
        before('gå til startsiden', () => {
            cy.visit('/soknad');
        });
        it('VELKOMMEN SIDE', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]').click();
        });
        it('STEG 1: BARN', () => {
            cy.get('[type="radio"').first().check({ force: true });

            clickFortsett(cy);
        });

        it('STEG 2: PERIODEN MED PLEIEPENGER', () => {
            // TODO: Fikse bug som gjør at man ikke kan skrive i inputfeltet direkte. Må bruke datovelger.
            // cy.get('[name="periodeFra"]').type("01.01.2021");

            // Velg periode, fom
            cy.get('[class=nav-datovelger__kalenderknapp]').first().click();
            cy.get('[class=DayPicker-Day]').not('.DayPicker-Day--disabled').first().click();

            // Velg periode, tom
            cy.get('[class=nav-datovelger__kalenderknapp]').last().click();
            cy.get('[class=DayPicker-Day]').not('.DayPicker-Day--disabled').first().click();

            clickNeiPaAlleSporsmal();

            clickFortsett(cy);
        });

        it('STEG 3: Arbeidsforhold', () => {
            clickNeiPaAlleSporsmal();
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
        });

        it('STEG 4: Omsorgstilbud', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
        });

        it('STEG 5: Medlemskap', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
        });

        it('STEG 6: LAST OPP LEGEERKLÆRING', () => {
            const fileName = 'navlogopng.png';
            cy.fixture(fileName, 'binary')
                .then(Cypress.Blob.binaryStringToBlob)
                .then((fileContent) =>
                    cy.get('input[type=file]').attachFile({
                        fileContent,
                        fileName,
                        mimeType: 'image/png', //getMimeType(fileName),
                        encoding: 'utf8',
                    })
                );
            clickFortsett(cy);
        });

        it('STEG 7: Oppsummering', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            clickSendInnSøknad(cy);
        });

        // it('SØKNAD SENDT page should have h1 header', () => {
        //     cy.get('h1').contains('Vi har mottatt søknad fra deg om pleiepenger');
        // });
    });
});
