// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

// tslint:disable-next-line:no-namespace
declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select DOM element by data-cy attribute.
         * @example cy.dataCy('greeting')
         */
        dataCy(value: string): Chainable<Element>
    }
}