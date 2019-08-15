declare module 'react-simple-timefield' {
    interface TimefieldProps {
        value: string;
        input?: React.ReactNode;
        onChange: (value: string) => void;
    }
    export default class Timefield extends React.Component<TimefieldProps, {}> {}
}
