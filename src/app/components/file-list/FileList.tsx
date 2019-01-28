import * as React from 'react';
import DeleteButton from '../delete-button/DeleteButton';
import './fileList.less';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from '../../utils/bemHelper';
const attachmentIcon = require('../../../assets/attachment.svg').default;

interface FileListProps {
    files: File[];
    onRemoveFileClick: (file: File, e: React.SyntheticEvent) => void;
}

const listBem = bemHelper('fileList');
const listElementBem = bemHelper(`${listBem.className}__element`);

const FileList: React.FunctionComponent<FileListProps> = ({ files, onRemoveFileClick }) => (
    <ul className={listBem.className}>
        {files.map((file, index) => (
            <li className={listElementBem.className} key={file.name + index}>
                <span>
                    <CustomSVG iconRef={attachmentIcon} size={22} />
                    <div className={listElementBem.element('text')}>
                        {file.name} ({file.size})
                    </div>
                </span>
                <DeleteButton ariaLabel="Slett vedlegg" onClick={(e) => onRemoveFileClick(file, e)}>
                    Fjern fil
                </DeleteButton>
            </li>
        ))}
    </ul>
);

export default FileList;
