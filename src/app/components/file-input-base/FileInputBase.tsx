import * as React from 'react';
import { Element } from 'nav-frontend-typografi';
import bemHelper from '../../utils/bemUtils';
import CustomSVG from '../custom-svg/CustomSVG';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import { SkjemaelementFeil as ValidationError } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { fileExtensionIsValid, VALID_EXTENSIONS } from '../../utils/attachmentUtils';
const uploadIcon = require('../../../assets/upload.svg').default;
import './fileInputBase.less';

interface FileInputProps {
    id: string;
    label: string;
    onFilesSelect: (files: File[]) => void;
    multiple?: boolean;
    feil?: ValidationError;
}

export default class FileInputBase extends React.Component<FileInputProps> {
    constructor(props: FileInputProps) {
        super(props);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
        this.onFileDropHandler = this.onFileDropHandler.bind(this);
        this.onFileDragOverHandler = this.onFileDragOverHandler.bind(this);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    getValidFiles(files: File[]): File[] {
        return files.filter((file: File) => {
            return fileExtensionIsValid(file.name);
        });
    }

    fileSelectHandler(fileList: FileList) {
        const files = Array.from(fileList) as File[];
        const validFiles = this.getValidFiles(files);
        if (validFiles.length > 0) {
            this.props.onFilesSelect(validFiles);
        }
    }

    onFileDragOverHandler(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
    }

    onFileDropHandler(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        this.fileSelectHandler(e.dataTransfer.files);
    }

    onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            this.fileSelectHandler(e.target.files);
            e.target.value = '';
        }
    }

    onKeyPress(e: React.KeyboardEvent<HTMLLabelElement>) {
        const { id } = this.props;
        const ENTER_KEYCODE = 13;
        const inputElement = document.getElementById(id);
        if (e.which === ENTER_KEYCODE && inputElement !== null) {
            inputElement.click();
        }
    }

    render() {
        const { id, label, multiple, feil } = this.props;
        const bem = bemHelper('attachmentButton');
        const inputId = `${id}-input`;
        return (
            <CustomInputElement validationError={feil}>
                <label
                    role="button"
                    id={id}
                    tabIndex={0}
                    htmlFor={inputId}
                    className={bem.className}
                    onDragOver={this.onFileDragOverHandler}
                    onDrop={this.onFileDropHandler}
                    onKeyPress={this.onKeyPress}>
                    <div className={bem.element('icon')}>
                        <CustomSVG iconRef={uploadIcon} size={22} />
                    </div>
                    <Element className={bem.element('label')}>{label}</Element>
                    <input
                        id={inputId}
                        type="file"
                        accept={VALID_EXTENSIONS.join(', ')}
                        onChange={(e) => this.onFileSelect(e)}
                        multiple={multiple === true}
                    />
                </label>
            </CustomInputElement>
        );
    }
}
