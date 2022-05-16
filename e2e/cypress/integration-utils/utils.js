export const clickFortsett = () => cy.get('button[aria-label="Fortsett til neste steg"]').click();
export const clickSendInnSøknad = () => cy.get('button[aria-label="Send inn søknaden"]').click();

export const clickNeiPaAlleSporsmal = () => {
    cy.get('label[class="inputPanel radioPanel"]').each((element) => {
        if (element.text() === 'Nei') {
            element.click();
        }
    });
};
export const clickJaPaAlleSporsmal = () => {
    cy.get('label[class="inputPanel radioPanel"]').each((element) => {
        if (element.text() === 'Ja') {
            element.click();
        }
    });
};

export const selectRadioYes = (key) => {
    getTestElement(`${key}_yes`).parent().click();
};

export const selectRadioNo = (key) => {
    getTestElement(`${key}_no`).parent().click();
};

export const getTestElement = (key) => {
    return cy.get(`[data-testid="${key}"]`);
};

export const setInputValue = (key, value) => {
    getTestElement(key).click().type(value);
};

export const setInputTime = (key, hours = '', minutes = '') => {
    setInputValue(`${key}_hours`, hours);
    setInputValue(`${key}_minutes`, minutes);
};

export const selectRadio = (key) => {
    getTestElement(key).parent().click();
};
