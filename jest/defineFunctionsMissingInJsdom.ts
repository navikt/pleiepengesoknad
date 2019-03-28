/*
 * JSDOM, which is being used by Jest, only implements a subset of browser APIs,
 * and will give warnings when we're running unit tests that test code that call
 * functions that aren't implemented in JSDOM, which is why we need to define those
 * that we use in the initial setup of Jest.
 */
export default () => {
    window.scrollTo = () => {
        return;
    };
};
