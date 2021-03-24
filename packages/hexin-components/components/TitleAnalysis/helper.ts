import { findNodePath } from '../../common/utils/tree'
import { uuid } from '../../common/utils/uuid'
import { EProblemType, IProblem1, IProblem2 } from './problem'

const stringSimilarity = require('string-similarity')

/**
 *
 * @param a
 * @param b
 */
const LevenshteinDistance = (a: string, b: string) => {
  const len1 = a.length
  const len2 = b.length
  const diff = []
  for (let i = 0; i <= len1; i++) {
    diff[i] = [] as number[]
    diff[i][0] = i
  }
  for (let j = 0; j <= len2; j++) {
    diff[0][j] = j
  }
  let temp
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (a[i - 1] == b[j - 1]) {
        temp = 0
      } else {
        temp = 1
      }
      diff[i][j] = Math.min(
        ...[diff[i - 1][j - 1] + temp, diff[i][j - 1] + 1, diff[i - 1][j] + 1],
      )
    }
  }
  return 1 - diff[len1][len2] / Math.max(len1, len2)
}
const similarity = (a: string, b: string) => {
  return Math.max(
    ...[LevenshteinDistance(a, b), stringSimilarity.compareTwoStrings(a, b)],
  )
}
/**
 * 过滤掉字符串中的数字字符
 * 详细参考：https://www.haomeili.net/ZhiShi/29
 * @param s
 */
const filterNumber = (s: string): string => {
  const c =
    '一二三四五六七八九十0123456789⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛⓪⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾❶❷❸❹❺❻❼❽❾❿➀➁➂➃➄➅➆➇➈➉➊➋➌➍➎➏➐➑➒➓'
  const r = new RegExp(`[${c}]`, 'g')
  return s.replace(r, '')
}
/**
 * 检查类型3问题：父节点下不能存在名称相同的子节点
 * @param nodes
 * @param json
 */
export const checkProblem3 = () => {}
/**
 * 检查类型2问题：相同层级存在相似标题
 * TODO：部分代码牺牲性能提高可读性，待优化
 * @param nodes
 * @param json
 */
export const checkProblem2 = (nodes: any[], json: any[]) => {
  const problem2s: IProblem2[] = []
  const levels = Array.from(new Set(nodes.map(i => i.node_level)))
  // 层级相同的节点，二维数组
  const levelNodes = levels.map(level =>
    nodes.filter(node => node.node_level === level),
  )
  // 这些 node 数组中疑似有问题的数组
  levelNodes.forEach((nodes: any[]) => {
    // 用来记录相似度较高的标题，标记为相似后不再进行识别
    const t: any = {}
    // 用来记录相似度较高的 node 数组
    const r: any = {}
    for (let i = 0; i < nodes.length; i++) {
      if (t[nodes[i].node_name] === 1) {
        continue
      }
      r[nodes[i].node_name] = r[nodes[i].node_name] || [nodes[i]]
      for (let j = i + 1; j < nodes.length; j++) {
        if (t[nodes[j].node_name] === 1) {
          continue
        }
        const s = similarity(
          filterNumber(nodes[i].node_name),
          filterNumber(nodes[j].node_name),
        )
        // 若相似度高于0.5则标记为相似
        if (s > 0.5 && s < 1.0) {
          r[nodes[i].node_name].push(nodes[j])
          t[nodes[j].node_name] = 1
        }
      }
    }
    Object.keys(r).forEach(key => {
      if (r[key].length <= 1) {
        return
      }
      const snodes = r[key]
      const problem2 = {} as IProblem2
      problem2.id = uuid()
      problem2.type = EProblemType.Problem2
      problem2.level = snodes[0].node_level
      const contents: string[] = Array.from(
        new Set(snodes.map((i: any) => i.node_name)),
      )
      problem2.contents = contents.map(content => ({
        content,
        nodes: snodes
          .filter((i: any) => i.node_name === content)
          .map((i: any) => ({
            node: i,
            path: findNodePath({ children: json }, i),
          })),
      }))
      problem2s.push(problem2)
    })
  })
  return problem2s
}
/**
 * 检查类型1问题：相同内容处于不同层级
 * TODO：部分代码牺牲性能提高可读性，待优化
 * @param nodes - 待检查节点
 * @param json
 */
export const checkProblem1 = (nodes: any[], json: any[]) => {
  const contents = Array.from(new Set(nodes.map(i => i.node_name)))
  // 若有相同内容存在于不同层级的标题中，则疑似异常
  // 标题内容相同的节点，二维数组
  const contentNodes = contents.map(content =>
    nodes.filter(node => node.node_name === content),
  )
  // 这些 node 数组中疑似有问题的数组
  const contentBorkenNodes = contentNodes.filter((nodes: any[]) => {
    // node 数组中 level 的和
    const sum = nodes.map(i => i.node_level).reduce((a, b) => a + b)
    // trick 方案，若 level 的平均数和首个 node_level 不相等，则认为数组中有疑似问题存在
    return sum / nodes.length !== nodes[0].node_level
  })
  // 这些 node 数组中是否存在疑似有问题的数组
  if (contentBorkenNodes.length > 0) {
    return contentBorkenNodes.map((nodes: any[]) => {
      const problem1 = {} as IProblem1
      problem1.id = uuid()
      problem1.type = EProblemType.Problem1
      problem1.content = nodes[0].node_name
      const levels = Array.from(new Set(nodes.map(i => i.node_level)))
      problem1.levels = levels.map(level => ({
        level,
        nodes: nodes
          .filter(i => i.node_level)
          .map(i => ({
            node: i,
            path: findNodePath({ children: json }, i),
          })),
      }))
      return problem1
    })
  }
  return []
}
