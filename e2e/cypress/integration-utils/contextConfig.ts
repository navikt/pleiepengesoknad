import { cyApiMockData } from './cyApiMockData';

const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

const getUrlForStep = (step?) => {
    const url = `${PUBLIC_PATH}/soknad${step ? `/${step}` : '/velkommen'}`;
    return url;
};
interface ConfigProps {
    mellomlagring?: any;
    step?: string;
    arbeidsgivere?: any;
}

export const contextConfig = (props?: ConfigProps) => {
    const { mellomlagring, step, arbeidsgivere } = props || {};
    beforeEach('intercept mellomlagring og levere tomt objekt', () => {
        cy.intercept(`GET`, `/mellomlagring*`, mellomlagring || {});
        cy.intercept('GET', `/arbeidsgiver*`, arbeidsgivere || cyApiMockData.arbeidsgivereMock);
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