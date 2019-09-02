import * as React from 'react';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import bemUtils from '../../utils/bemUtils';
import { SkjemaelementFeil as ValidationError } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { guid } from 'nav-frontend-js-utils';
import classnames from 'classnames';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import './sliderBase.less';

interface SliderBasePrivateProps {
    name: string;
    value: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
    feil?: ValidationError;
}

export interface SliderBasePublicProps {
    showTextInput?: boolean;
    minPointLabelRenderer?: (minPoint: number) => React.ReactText;
    maxPointLabelRenderer?: (maxPoint: number) => React.ReactText;
    label: string;
    min: number;
    max: number;
    step?: number;
    helperText?: string | React.ReactNode;
}

type SliderBaseProps = SliderBasePrivateProps & SliderBasePublicProps;

const sliderBem = bemUtils('slider');
const valueEndpointLabelsBem = bemUtils('valueEndpointLabels');

const SliderBase: React.FunctionComponent<SliderBaseProps> = ({
    label,
    value,
    min,
    max,
    minPointLabelRenderer,
    maxPointLabelRenderer,
    feil,
    helperText,
    showTextInput,
    step,
    onChange,
    ...otherProps
}) => {
    const sliderId = guid();
    const labelId = guid();
    const classNames = classnames(sliderBem.block, {
        [sliderBem.modifier('withTextInput')]: showTextInput !== undefined
    });

    return (
        <SkjemaGruppe feil={feil}>
            <CustomInputElement
                className={classNames}
                helperText={helperText}
                label={label}
                labelId={labelId}
                labelHtmlFor={sliderId}>
                {showTextInput && (
                    <input
                        type="number"
                        className="skjemaelement__input"
                        maxLength={3}
                        min={min}
                        max={max}
                        aria-labelledby={labelId}
                        aria-valuemin={min}
                        aria-valuemax={max}
                        autoComplete="off"
                        {...otherProps}
                        value={value === undefined ? '' : value}
                        onChange={(event) => {
                            if (Number.isInteger(+event.target.value)) {
                                onChange(event);
                            }
                        }}
                    />
                )}
                <input
                    id={sliderId}
                    className={sliderBem.element('input')}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                    aria-labelledby={labelId}
                    {...otherProps}
                />
                <div className={valueEndpointLabelsBem.block}>
                    <div className={valueEndpointLabelsBem.element('minPointLabel')}>
                        {minPointLabelRenderer ? minPointLabelRenderer(min) : min}
                    </div>
                    <div className={valueEndpointLabelsBem.element('maxPointLabel')}>
                        {maxPointLabelRenderer ? maxPointLabelRenderer(max) : max}
                    </div>
                </div>
            </CustomInputElement>
        </SkjemaGruppe>
    );
};

export default SliderBase;
