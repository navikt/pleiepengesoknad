import * as React from 'react';

interface FileListProps {
    files: File[];
    onRemoveFileClick: (file: File, e: React.SyntheticEvent) => void;
}

const FileList: React.FunctionComponent<FileListProps> = ({ files, onRemoveFileClick }) => (
    <ul className="fileList">
        {files.map((file, index) => (
            <li key={file.name + index}>
                {file.name} ({file.size}) <a onClick={(e) => onRemoveFileClick(file, e)}>Fjern fil</a>
            </li>
        ))}
    </ul>
);

export default FileList;
