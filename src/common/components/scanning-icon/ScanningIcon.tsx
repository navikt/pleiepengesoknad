import React from 'react';

export type StatusKey = 'good' | 'keystone' | 'horizontal' | 'shadow';

export interface OwnProps {
  status: StatusKey;
  title?: string;
  size?: number;
}

type Props = OwnProps;

const GoodScanning: React.StatelessComponent<Props> = (props) => {
  return (
    <svg role="presentation" focusable="false" viewBox="0 0 83 121" width={props.size} height={props.size}>
      <title>{"1_bra"}</title>
      <defs>
        <filter
          x="-10.6%"
          y="-5.4%"
          width="121.2%"
          height="115.1%"
          filterUnits="objectBoundingBox"
          id="prefix__a"
        >
          <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={2}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            in="shadowBlurOuter1"
          />
        </filter>
        <path id="prefix__b" d="M8 11h66v93H8z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          d="M1 1h81v119H1z"
          fill="#BABABA"
          stroke="#000"
          strokeOpacity={0.85}
          strokeWidth={2}
        />
        <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
        <use fill="#FFF" xlinkHref="#prefix__b" />
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M15.5 30.5h53M15.5 44.5h50M15.5 23.5h45M15.5 37.5h43" />
        </g>
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M15.5 77.5h41M15.5 63.5h50M15.5 84.5h45M15.5 70.5h43" />
        </g>
      </g>
    </svg>
  );
};
const KeystoneScanning: React.StatelessComponent<Props> = (props) => {
  return (
    <svg role="presentation" focusable="false" viewBox="0 0 83 121" width={props.size} height={props.size}>
      <title>2-bad-A</title>
      <desc>Bildet er ikke tatt ovenfra</desc>
      <defs>
        <filter
          x="-9.7%"
          y="-7.2%"
          width="119.4%"
          height="120.3%"
          filterUnits="objectBoundingBox"
          id="prefix__a"
        >
          <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={2}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            in="shadowBlurOuter1"
          />
        </filter>
        <path id="prefix__b" d="M16.528 20h49.06L78 89H6z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          d="M1 1h81v119H1z"
          fill="#BABABA"
          stroke="#000"
          strokeOpacity={0.85}
          strokeWidth={2}
        />
        <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
        <use fill="#FFF" xlinkHref="#prefix__b" />
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M20 41.5h37M21 35.5h39M22 29.5h36M19 47.5h43" />
        </g>
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M15 70.5h48M16 64.5h45M17 58.5h38M14 76.5h45" />
        </g>
      </g>
    </svg>
  );
};
const HorizontalScanning: React.StatelessComponent<Props> = (props) => {
return (
  <svg role="presentation" focusable="false" viewBox="0 0 83 121" width={props.size} height={props.size}>
    <title>3-bad-B</title>
    <desc>Bildet har ikke riktig retning</desc>
    <defs>
      <filter
        x="-10%"
        y="-10.6%"
        width="120%"
        height="129.8%"
        filterUnits="objectBoundingBox"
        id="prefix__a"
      >
        <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation={2}
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
          in="shadowBlurOuter1"
        />
      </filter>
      <path id="prefix__b" d="M6 36h70v47H6z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        strokeOpacity={0.85}
        stroke="#000"
        strokeWidth={2}
        fill="#BABABA"
        d="M1 1h81v119H1z"
      />
      <path fill="#FFF" d="M7 37h70v47H7z" />
      <g transform="translate(1 1)">
        <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
        <use fill="#FFF" xlinkHref="#prefix__b" />
      </g>
      <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
        <path d="M69 43v30M63 42.833v35.334M56 43v30M49.5 43v33" />
      </g>
      <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
        <path d="M38 43v30M25 42.833v35.334M18.5 43v33M32 43v30" />
      </g>
    </g>
  </svg>
);
};
const ShadowScanning: React.StatelessComponent<Props> = (props) => {
  return (
    <svg role="presentation" focusable="false" viewBox="0 0 83 121" width={props.size} height={props.size}>
      <title>3-bad-B</title>
      <desc>Bildet har har skygge oppå legeerklæring</desc>
      <defs>
        <filter
          x="-10%"
          y="-5.2%"
          width="120%"
          height="114.6%"
          filterUnits="objectBoundingBox"
          id="prefix__a"
        >
          <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={2}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            in="shadowBlurOuter1"
          />
        </filter>
        <path id="prefix__b" d="M6 12h70v96H6z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          strokeOpacity={0.85}
          stroke="#000"
          strokeWidth={2}
          fill="#BABABA"
          d="M1 1h81v119H1z"
        />
        <g transform="translate(1 1)">
          <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
          <use fill="#FFF" xlinkHref="#prefix__b" />
        </g>
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M15.5 30.5h53M15.5 44.5h50M15.5 23.5h45M15.5 37.5h43" />
        </g>
        <g stroke="#B7B4B4" strokeLinecap="square" strokeWidth={2}>
          <path d="M15.5 77.5h41M15.5 63.5h50M15.5 84.5h45M15.5 70.5h43" />
        </g>
        <path
          d="M53.57 120C65.186 86.185 63.996 65.163 50 56.935 29.004 44.593 1 69.565 1 90v30h52.57z"
          fillOpacity={0.3}
          fill="#7C7C7C"
        />
      </g>
    </svg>
  );
};
const ScanningIkon = (props: Props) => {
  const { size = 100 } = props;
  switch (props.status) {
    case 'good':
      return <GoodScanning {...props} size={size} />;
    case 'keystone':
      return <KeystoneScanning {...props} size={size} />;
    case 'horizontal':
      return <HorizontalScanning {...props} size={size} />;
    case 'shadow':
      return <ShadowScanning {...props} size={size} />;
    default:
      return <GoodScanning {...props} size={size} />;
  }
};

export default ScanningIkon;
