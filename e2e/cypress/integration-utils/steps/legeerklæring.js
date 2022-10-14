const { clickFortsett, getTestElementByType, getTestElementByClass, getTestElement } = require('../utils');

const fileName = 'navlogopng.png';
const ingenVedleggText = 'Ingen vedlegg er lastet opp';

const fyllUtLegeerklæringEnFil = () => {
    cy.fixture(fileName, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) =>
            getTestElementByType('file').attachFile({
                fileContent,
                fileName,
                mimeType: 'image/png', //getMimeType(fileName),
                encoding: 'utf8',
            })
        );
    clickFortsett();
};

const oppsummeringTestLegeerklæringEnFil = () => {
    getTestElementByClass('lenke attachmentLabel__text').should((element) => expect(fileName).equal(element.text()));
};

const oppsummeringTestLegeerklæringIngen = () => {
    getTestElement('ingenLegeerklæring').should((element) => expect(ingenVedleggText).equal(element.text()));
};

export const fyllUtLegeerklæringSteg = (testType) => {
    it('STEG 8: LAST OPP LEGEERKLÆRING', () => {
        switch (testType) {
            case 'komplett':
                fyllUtLegeerklæringEnFil();
                break;
            default:
                clickFortsett();
                break;
        }
    });
};

export const oppsummeringTestLegeerklæringSteg = (testType) => {
    switch (testType) {
        case 'komplett':
            oppsummeringTestLegeerklæringEnFil();
            break;
        default:
            oppsummeringTestLegeerklæringIngen();
            break;
    }
};
