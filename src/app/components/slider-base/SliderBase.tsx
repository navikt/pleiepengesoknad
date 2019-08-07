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
    valueRenderer?: (value: number) => React.ReactText;
    minPointLabelRenderer?: (minPoint: number) => React.ReactText;
    maxPointLabelRenderer?: (maxPoint: number) => React.ReactText;
    label: string;
    min: number;
    max: number;
    helperText?: string | React.ReactNode;
}

type SliderBaseProps = SliderBasePrivateProps & SliderBasePublicProps;

const sliderBem = bemUtils('slider');
const valueEndpointLabelsBem = bemUtils('valueEndpointLabels');

const SliderBase: React.FunctionComponent<SliderBaseProps> = ({
    label,
    valueRenderer,
    value,
    min,
    max,
    minPointLabelRenderer,
    maxPointLabelRenderer,
    feil,
    helperText,
    showTextInput,
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
                        type="text"
                        className="skjemaelement__input"
                        value={value}
                        maxLength={3}
                        aria-labelledby={labelId}
                        aria-valuemin={20}
                        aria-valuemax={100}
                        autoComplete="off"
                        {...otherProps}
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
