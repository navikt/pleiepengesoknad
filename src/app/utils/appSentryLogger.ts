import getSentryLoggerForApp from '@navikt/sif-common-sentry';

const appSentryLogger = getSentryLoggerForApp('pleiepengesoknad', ['sykdom-i-familien']);

export default appSentryLogger;
