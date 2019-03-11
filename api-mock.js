const express = require('express');

const server = express();

server.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Origin', 'http://pleiepengesoknad-web.herokuapp.com/');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const søkerMock = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fodselsnummer: '12345123456'
};

const arbeidsgivereMock = {
    organisasjoner: [
        { navn: 'Arbeids- og velferdsetaten', orgnr: '123451234' },
        { navn: 'Arbeids- og sosialdepartementet', orgnr: '123451235' }
    ]
};

const startServer = () => {
    const port = process.env.PORT;

    server.get('/arbeidsgiver', (req, res) => {
        res.send(arbeidsgivereMock);
    });

    server.get('/soker', (req, res) => {
        res.send(søkerMock);
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        res.sendStatus(200);
    });

    server.get('/barn', (req, res) => res.sendStatus(200));
    server.post('/soknad', (req, res) => {
        res.sendStatus(200);
    });

    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
};

startServer();
