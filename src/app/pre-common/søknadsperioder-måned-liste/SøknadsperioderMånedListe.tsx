import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import SøknadFormComponents from '../../søknad/SøknadFormComponents';
import { getMonthsInDateRange } from '@navikt/sif-common-utils';

interface Props {
    periode: DateRange;
    fieldset?: {
        inputGroupFieldName: string;
        legend: React.ReactNode;
        description?: React.ReactNode;
        validate?: ValidationFunction<ValidationError>;
    };
    årstallHeadingLevel?: number;
    årstallHeaderRenderer?: (årstall: number) => React.ReactNode;
    månedContentRenderer: (måned: DateRange, søknadsperioderIMåned: DateRange[], index: number) => React.ReactNode;
}

const SøknadsperioderMånedListe: React.FunctionComponent<Props> = ({
    periode,
    fieldset,
    årstallHeadingLevel: headingLevel = 2,
    årstallHeaderRenderer,
    månedContentRenderer,
}) => {
    const måneder = getMonthsInDateRange(periode);
    const gårOverFlereÅr = periode.from.getFullYear() !== periode.to.getFullYear();

    const visÅrstallHeading = (index: number): boolean => {
        return (
            gårOverFlereÅr &&
            (index === 0 || måneder[index].from.getFullYear() !== måneder[index - 1].from.getFullYear())
        );
    };

    const renderMåned = (måned: DateRange, index: number) => {
        return (
            <FormBlock margin="none" paddingBottom="m" key={dayjs(måned.from).format('MM.YYYY')}>
                {årstallHeaderRenderer && visÅrstallHeading(index) && (
                    <Box margin="l" padBottom="m">
                        <Undertittel tag={`h${headingLevel}`} className={'yearHeader'}>
                            {årstallHeaderRenderer(måned.from.getFullYear())}:
                        </Undertittel>
                    </Box>
                )}
                {månedContentRenderer(måned, måneder, index)}
            </FormBlock>
        );
    };

    return fieldset ? (
        <SøknadFormComponents.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            name={`${fieldset.inputGroupFieldName}` as any}
            legend={fieldset.legend}
            description={fieldset.description}
            tag="div"
            validate={fieldset.validate}>
            {måneder.map(renderMåned)}
        </SøknadFormComponents.InputGroup>
    ) : (
        <>{måneder.map(renderMåned)}</>
    );
};

export default SøknadsperioderMånedListe;
