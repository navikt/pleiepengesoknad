import * as React from 'react';
import DeleteButton from '../delete-button/DeleteButton';
import './fileList.less';

interface FileListProps {
    files: File[];
    onRemoveFileClick: (file: File, e: React.SyntheticEvent) => void;
}

const FileList: React.FunctionComponent<FileListProps> = ({ files, onRemoveFileClick }) => (
    <ul className="fileList">
        {files.map((file, index) => (
            <li key={file.name + index}>
                <span>
                    {file.name} ({file.size})
                </span>
                <DeleteButton ariaLabel="Slett vedlegg" onClick={(e) => onRemoveFileClick(file, e)}>
                    Fjern fil
                </DeleteButton>
            </li>
        ))}
    </ul>
);

export default FileList;
