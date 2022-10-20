import { cyApiMockData } from './cyApiMockData';

const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

const getUrlForStep = (step?) => {
    const url = `${PUBLIC_PATH}/soknad${step ? `/${step}` : '/velkommen'}`;
    return url;
};
interface ConfigProps {
    mellomlagring?: any;
    step?: string;
}

export const contextConfig = (props?: ConfigProps) => {
    const { mellomlagring, step } = props || {};

    let m = mellomlagring;

    beforeEach('intercept mellomlagring og levere tomt objekt', () => {
        cy.intercept(`GET`, `/mellomlagring*`, m || {});
        cy.intercept(`PUT`, `/mellomlagring*`, (r) => {
            m = r.body;
        });
        cy.intercept('GET', `/arbeidsgiver*`, cyApiMockData.arbeidsgivereMock);
        cy.intercept('GET', `/soker*`, cyApiMockData.søkerMock);
        cy.intercept('GET', `/barn*`, cyApiMockData.barnMock);
        cy.intercept(`https://ryujtq87.api.sanity.io*`, {});
    });

    before('gå til ønsket side', () => {
        cy.visit(getUrlForStep(step));
    });
};

export const gotoStep = (step: string) => {
    const url = `${PUBLIC_PATH}/soknad${step ? `/${step}` : ''}`;
    cy.visit(url);
};
