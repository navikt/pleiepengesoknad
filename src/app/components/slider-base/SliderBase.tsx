import * as React from 'react';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import bemUtils from '../../utils/bemUtils';
import './sliderBase.less';

interface SliderBaseProps {
    name: string;
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
    valueRenderer?: (value: number) => React.ReactNode;
    minPointLabelRenderer?: (minPoint: number) => React.ReactNode;
    maxPointLabelRenderer?: (maxPoint: number) => React.ReactNode;
}

let inputElementRef: React.MutableRefObject<HTMLInputElement | null>;
let outputElementRef: React.MutableRefObject<HTMLOutputElement | null>;

const positionOutputElement = (currentValue: number, min: number, max: number) => {
    const inputElement = inputElementRef.current as HTMLElement;
    const outputElement = outputElementRef.current as HTMLElement;

    const numberOfPixelsPerPoint = inputElement.offsetWidth / (max - min) - 0.4;
    const nextDistanceFromLeft = (currentValue - min) * numberOfPixelsPerPoint;
    const pxAdjustment = -28;

    outputElement.style.left = `${nextDistanceFromLeft + pxAdjustment}px`;
};

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
    ...otherProps
}) => {
    inputElementRef = React.useRef(null);
    outputElementRef = React.useRef(null);

    React.useEffect(() => positionOutputElement(value, min, max), [value]);

    return (
        <CustomInputElement label={label}>
            <div className={valueEndpointLabelsBem.className}>
                <div className={valueEndpointLabelsBem.element('minPointLabel')}>
                    {minPointLabelRenderer ? minPointLabelRenderer(min) : min}
                </div>
                <div className={valueEndpointLabelsBem.element('maxPointLabel')}>
                    {maxPointLabelRenderer ? maxPointLabelRenderer(max) : max}
                </div>
            </div>
            <input
                className={sliderBem.className}
                type="range"
                ref={inputElementRef}
                min={min}
                max={max}
                value={value}
                {...otherProps}
            />
            <div className={sliderBem.element('arrow')} />
            <output className={sliderBem.element('valueContainer')} ref={outputElementRef}>
                <span className={sliderBem.element('valueContainer__arrow')} />
                <span>{valueRenderer ? valueRenderer(value) : value}</span>
            </output>
        </CustomInputElement>
    );
};

export default SliderBase;
