import React from 'react';
import { useIntl } from 'react-intl';

const FrilansEksempeltHtml = () => {
    const intl = useIntl();
    return intl.locale === 'nb' ? (
        <>
            Eksempel på hvem som kan være frilansere er:
            <ul>
                <li>Personer med omsorgsstønad</li>
                <li>Fosterforeldre</li>
                <li>Musikere</li>
                <li>Tekstforfattere</li>
                <li>Skuespillere</li>
                <li>Journalister</li>
                <li>Oversettere</li>
                <li>
                    Folkevalgt, politikere i kommuner, fylkeskommuner og på Stortinget som får godtgjørelse for politisk
                    arbeid
                </li>
                <li>Støttekontakt</li>
            </ul>
            Hvis du er usikker på om du er frilanser, kan du lese mer om hva det betyr å være frilanser på skatteetaten
            sinhjemmeside.
        </>
    ) : (
        <>
            Eksempel på hvem som kan være frilansere er:
            <ul>
                <li>Personer med omsorgsstønad</li>
                <li>Fosterforeldre</li>
                <li>Musikere</li>
                <li>Tekstforfattere</li>
                <li>Skuespillere</li>
                <li>Journalister</li>
                <li>Oversettere</li>
                <li>
                    Folkevalgt, politikere i kommuner, fylkeskommuner og på Stortinget som får godtgjørelse for politisk
                    arbeid
                </li>
                <li>Støttekontakt</li>
            </ul>
            Hvis du er usikker på om du er frilanser, kan du lese mer om hva det betyr å være frilanser på skatteetaten
            sinhjemmeside.
        </>
    );
};

export default FrilansEksempeltHtml;
