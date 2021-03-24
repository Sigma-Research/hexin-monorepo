interface INodeContent {}
interface ICommonNode {
  node_type: 'chapter' | 'paragraph' | 'question'
  node_level: number
  content: INodeContent
  children: TNode[]
}
export interface IQuestionNode extends ICommonNode {
  question_type: 'true_or_false' | 'choice' | 'blank' | 'material' | 'other'
}
export interface IChapterNode extends ICommonNode {
  node_name: string
}
export interface IParagraphNode extends ICommonNode {}
// TODO
// export type TNode = IQuestionNode | IChapterNode | IParagraphNode;
export type TNode = any
export type TProcessNode = TNode & {
  _id: string
}
export type TJson = Node[]
