import * as React from 'react';

interface Props {
    text?: string;
}

const TextareaSummary: React.StatelessComponent<Props> = ({ text }) => {
    if (text && text.trim().length > 0) {
        return (
            <p
                dangerouslySetInnerHTML={{
                    __html: text.replace(/\n/, '<br/>')
                }}
            />
        );
    }
    return null;
};

export default TextareaSummary;
