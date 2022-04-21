import React from 'react';
import { useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikInputGroup, FormikTimeInput } from '@navikt/sif-common-formik';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { LabelInputInfoLayout } from '@navikt/sif-common-pleiepenger';
import { getTidFasteUkerdagerInputMessages } from '@navikt/sif-common-pleiepenger/lib/tid/tid-faste-ukedager-input/tidFasteUkerdagerInputMessages';
import { Weekday } from '@navikt/sif-common-utils';
import './arbeidstidFasteUkedagerInput.less';

export interface ArbeidstidUkeTekster {
    dag: React.ReactNode;
    jobber: React.ReactNode;
    ariaLabelTidInput: (dagNavn: string) => React.ReactNode;
}
interface Props {
    fieldName: string;
    utilgjengeligeUkedager?: Weekday[];
    skjulUtilgjengeligeUkedager?: boolean;
    tidPerDagValidator?: (weekday: Weekday, value: any) => ValidationResult<ValidationError>;
    tekst: ArbeidstidUkeTekster;
}

const bem = bemUtils('arbeidstidFasteUkedagerInput');

const ArbeidstidFasteUkedagerInput: React.FunctionComponent<Props> = ({
    fieldName,
    tidPerDagValidator,
    utilgjengeligeUkedager,
    skjulUtilgjengeligeUkedager,
    tekst,
}: Props) => {
    const txt = getTidFasteUkerdagerInputMessages(useIntl().locale);

    const renderWeekdayTimeInput = (weekday: Weekday, weekdayLabel: string) => {
        const erUtilgjengeligUkedag = utilgjengeligeUkedager?.some((d) => d === weekday);
        if (erUtilgjengeligUkedag && skjulUtilgjengeligeUkedager) {
            return null;
        }

        return (
            <FormikInputGroup
                key={weekday}
                legend={<span className="sr-only">{weekdayLabel}</span>}
                name={`arbeidstid_${weekday}`}
                className={bem.element('dag', erUtilgjengeligUkedag ? 'utilgjengelig' : undefined)}>
                <LabelInputInfoLayout
                    label={weekdayLabel}
                    input={
                        <FormikTimeInput
                            aria-describedby="iPerioden"
                            name={`${fieldName}.${weekday}`}
                            label={
                                <span className={'sr-only'}>{tekst.ariaLabelTidInput(weekdayLabel.toLowerCase())}</span>
                            }
                            timeInputLayout={{
                                direction: 'horizontal',
                            }}
                            validate={tidPerDagValidator ? (value) => tidPerDagValidator(weekday, value) : undefined}
                        />
                    }
                />
            </FormikInputGroup>
        );
    };
    return (
        <div className={bem.classNames(bem.block)}>
            {renderWeekdayTimeInput(Weekday.monday, txt.Mandager)}
            {renderWeekdayTimeInput(Weekday.tuesday, txt.Tirsdager)}
            {renderWeekdayTimeInput(Weekday.wednesday, txt.Onsdager)}
            {renderWeekdayTimeInput(Weekday.thursday, txt.Torsdager)}
            {renderWeekdayTimeInput(Weekday.friday, txt.Fredager)}
        </div>
    );
};

export default ArbeidstidFasteUkedagerInput;
