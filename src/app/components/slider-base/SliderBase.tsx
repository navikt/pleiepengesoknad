import * as React from 'react';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import bemUtils from '../../utils/bemUtils';
import { SkjemaelementFeil as ValidationError } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { guid } from 'nav-frontend-js-utils';
import './sliderBase.less';

interface SliderBasePrivateProps {
    name: string;
    value: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
    feil?: ValidationError;
}

export interface SliderBasePublicProps {
    showTextInput?: boolean;
    valueRenderer?: (value: number) => React.ReactNode;
    minPointLabelRenderer?: (minPoint: number) => React.ReactNode;
    maxPointLabelRenderer?: (maxPoint: number) => React.ReactNode;
    label: string;
    min: number;
    max: number;
    helperText?: string;
}

type SliderBaseProps = SliderBasePrivateProps & SliderBasePublicProps;

let inputElementRef: React.MutableRefObject<HTMLInputElement | null>;

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
    ...otherProps
}) => {
    inputElementRef = React.useRef(null);

    return (
        <CustomInputElement
            label={label}
            className={sliderBem.className}
            id={guid()}
            validationError={feil}
            helperText={helperText}>
            {showTextInput && <input type="text" className="skjemaelement__input" value={value} {...otherProps} />}
            <input
                className={sliderBem.element('input')}
                type="range"
                ref={inputElementRef}
                min={min}
                max={max}
                value={value}
                {...otherProps}
            />
            <div className={valueEndpointLabelsBem.className}>
                <div className={valueEndpointLabelsBem.element('minPointLabel')}>
                    {minPointLabelRenderer ? minPointLabelRenderer(min) : min}
                </div>
                <div className={valueEndpointLabelsBem.element('maxPointLabel')}>
                    {maxPointLabelRenderer ? maxPointLabelRenderer(max) : max}
                </div>
            </div>
        </CustomInputElement>
    );
};

export default SliderBase;
