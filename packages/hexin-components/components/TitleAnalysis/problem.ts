interface Node {
  node: any // 疑似出现问题的节点
  path: any[] // 疑似出现问题的节点的所在路径
}
export enum EProblemType {
  Problem1 = 1,
  Problem2 = 2,
}
export type TProblem = IProblem1 | IProblem2
/**
 * 问题1：相同内容处于不同层级
 */
export interface IProblem1 {
  id: string
  type: EProblemType
  content: string // 相同内容
  levels: Array<{ level: number; nodes: Node[] }>
}
/**
 * 问题2：相同层级、相似内容
 */
export interface IProblem2 {
  id: string
  type: EProblemType
  level: number
  contents: Array<{ content: string; nodes: Node[] }>
}
