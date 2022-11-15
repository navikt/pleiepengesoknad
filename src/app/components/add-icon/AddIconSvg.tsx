import React from 'react';

function AddIcon(props: any) {
    return (
        <svg
            contentScriptType="text/ecmascript"
            width={24}
            viewBox="0 0 24 24"
            height={24}
            role="presentation"
            focusable={false}
            aria-hidden={true}
            {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M11 13v8h2v-8h8v-2h-8V3h-2v8H3v2h8Z" fill="currentColor" />
        </svg>
    );
}

export default AddIcon;
