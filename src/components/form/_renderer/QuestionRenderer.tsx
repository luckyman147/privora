import { ShortText } from '../_inputs/ShortText'
import { LongText } from '../_inputs/LongText'
import { Rating } from '../_inputs/Rating'
import { MultipleChoice } from '../_choices/MultipleChoice'
import { Checkboxes } from '../_choices/Checkboxes'
import { Dropdown } from '../_choices/Dropdown'
import { DateInput } from '../_special/DateInput'
import { FileUpload } from '../_special/FileUpload'
import { MatrixQuestion } from '../_special/MatrixQuestion'
import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function QuestionRenderer({ q, d, answers, onAnswer }: Props) {
  switch (q.type) {
    case 'short_text':
      return <ShortText q={q} d={d} onAnswer={onAnswer} />
    case 'long_text':
      return <LongText q={q} d={d} onAnswer={onAnswer} />
    case 'multiple_choice':
      return <MultipleChoice q={q} d={d} onAnswer={onAnswer} />
    case 'checkboxes':
      return <Checkboxes q={q} d={d} answers={answers} onAnswer={onAnswer} />
    case 'dropdown':
      return <Dropdown q={q} d={d} onAnswer={onAnswer} />
    case 'rating':
      return <Rating q={q} d={d} answers={answers} onAnswer={onAnswer} />
    case 'date':
      return <DateInput q={q} d={d} onAnswer={onAnswer} />
    case 'file_upload':
      return <FileUpload q={q} d={d} answers={answers} onAnswer={onAnswer} />
    case 'matrix':
      return <MatrixQuestion q={q} d={d} answers={answers} onAnswer={onAnswer} />
    default:
      return null
  }
}
