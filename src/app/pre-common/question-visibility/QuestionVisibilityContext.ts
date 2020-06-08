import { createContext } from 'react';
import { QuestionVisibility } from './questions/Questions';

interface VisibilityContext<FieldName> {
    visibility: QuestionVisibility<FieldName>;
}

export const QuestionVisibilityContext = createContext<VisibilityContext<any> | undefined>(undefined);
