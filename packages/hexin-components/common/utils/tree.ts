import { TJson, TNode } from '@/common/types/json'

/**
 * 拖拽节点
 * @param node
 * @param target
 * @param position
 * @param tree
 * @param flattenTree
 * @returns
 */
export const drag = (
  node: TNode,
  target: TNode,
  position: string,
  tree: TJson,
  flattenTree?: TNode[],
) => {
  const nodeInJson: TNode = findNode(node._id, tree, flattenTree)
  const targetInJson: TNode = findNode(target._id, tree, flattenTree)
  console.log(
    '[drag-end]',
    nodeInJson ? nodeInJson.node_name : '不存在',
    targetInJson ? targetInJson.node_name : '不存在',
    position,
  )
  if (position === 'none') {
    return
  }
  if (!nodeInJson || !targetInJson) {
    return
  }
  // target 在 json 数据中的父节点
  const targetInJsonParent = findNodeParent(targetInJson, tree, flattenTree)
  // target 在 json 数据中处于父节点的位置
  // target 的父节点不存在，说明是根元素
  const targetInJsonIndex = (targetInJsonParent
    ? targetInJsonParent.children
    : tree
  ).findIndex((i: TNode) => i._id === targetInJson._id)
  // 删除 node 在 json 数据中的位置
  const nodeInJsonParent = findNodeParent(nodeInJson, tree, flattenTree)
  let children = nodeInJsonParent ? nodeInJsonParent.children : tree
  const nodeInJsonIndex = children.findIndex(
    (i: TNode) => i._id === nodeInJson._id,
  )
  children.splice(nodeInJsonIndex, 1)
  // 更新 node 在 json 数据中的位置
  children = targetInJsonParent ? targetInJsonParent.children : tree
  if (position === 'before') {
    children.splice(targetInJsonIndex, 0, nodeInJson)
    // 更新 node 在 json 数据中的层级
    nodeInJson.node_level = targetInJson.node_level
  } else if (position === 'after') {
    children.splice(targetInJsonIndex + 1, 0, nodeInJson)
    // 更新 node 在 json 数据中的层级
    nodeInJson.node_level = targetInJson.node_level
  } else if (position === 'inner') {
    targetInJson.children = targetInJson.children || []
    targetInJson.children.push(nodeInJson)
    // 更新 node 在 json 数据中的层级
    nodeInJson.node_level = targetInJson.node_level + 1
  }
  // 这里需要注意，children 需要递归修改 node_level
  treeIterate(nodeInJson.children, nodeInJson, (item: TNode, parent: TNode) => {
    item.node_level = parent.node_level + 1
  })
}
/**
 * 删除某个节点，及其子节点
 * @param node
 * @param tree
 * @param nodes
 */
export const deleteTreeNode = (node: TNode, tree: TJson, nodes?: TNode[]) => {
  const parent = findNodeParent(node, tree, nodes)
  console.log('[delete]', node.node_name, parent)
  if (parent && parent.children) {
    const index = parent.children.findIndex((i: TNode) => i._id === node._id)
    parent.children.splice(index, 1)
    return
  }
  // 若 parent 不存在，认为是根节点
  const index = tree.findIndex((i: TNode) => i._id === node._id)
  if (index === -1) {
    return
  }
  tree.splice(index, 1)
}
/**
 * 寻找节点的父节点
 * @param node
 * @param tree
 * @param nodes
 */
export const findNodeParent = (
  node: TNode,
  tree: TJson,
  nodes?: TNode[],
): TNode => {
  let r = null
  // 传参打平的 Json 数据，提高遍历的效率
  if (nodes && nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].children) {
        continue
      }
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (nodes[i].children[j]._id === node._id) {
          return nodes[i]
        }
      }
    }
  }
  treeIterate(tree, null, (item: TNode, parent: TNode) => {
    if (item._id === node._id) {
      r = parent
    }
  })
  return r
}
/**
 * 根据 id 查找某个节点
 * @param nid
 * @param tree
 * @param nodes
 */
export const findNode = (
  nid: string,
  tree: TJson,
  nodes?: TNode[],
): TNode | null => {
  if (nodes && nodes.length) {
    return nodes.find(i => i._id === nid)
  }
  let r = null
  treeIterate(tree, null, (item: TNode) => {
    if (item._id === nid) {
      r = item
    }
  })
  return r
}
/**
 * 向上合并
 * @param node
 * @param tree
 * @param nodes
 */
export const mergeup = (node: TNode, tree: TJson, nodes?: TNode[]) => {
  if (!node || !tree) {
    return
  }
  const parent = findNodeParent(node, tree, nodes)
  // 这里需要注意，Json 数据中可能存在试题和标题同级
  let children = (parent ? parent.children : tree).filter(
    (i: TNode) => i.node_type === 'chapter',
  )
  let index = children.findIndex((i: TNode) => i._id === node._id)
  if (index === 0) {
    return
  }
  // 将待合并节点的子节点迁移至目标节点
  const sibling = children[index - 1]
  sibling.children.push(...(node.children || []))
  // 将待合并节点在父节点中删除
  children = parent ? parent.children : tree
  index = children.findIndex((i: TNode) => i._id === node._id)
  children.splice(index, 1)
  console.log('[mergeup]', node.node_name, sibling)
}
/**
 * 向下合并
 * @param node
 * @param tree
 * @param nodes
 */
export const mergedown = (node: TNode, tree: TJson, nodes?: TNode[]) => {
  if (!node || !tree) {
    return
  }
  const parent = findNodeParent(node, tree, nodes)
  // 这里需要注意，Json 数据中可能存在试题和标题同级
  let children = (parent ? parent.children : tree).filter(
    (i: TNode) => i.node_type === 'chapter',
  )
  let index = children.findIndex((i: TNode) => i._id === node._id)
  if (index === children.length - 1) {
    return
  }
  // 将待合并节点的子节点迁移至目标节点
  const sibling = children[index + 1]
  sibling.children.unshift(...(node.children || []))
  // 将待合并节点在父节点中删除
  children = parent ? parent.children : tree
  index = children.findIndex((i: TNode) => i._id === node._id)
  children.splice(index, 1)
  console.log('[mergedown]', node.node_name, sibling)
}

interface ITreeIterateOptions {}
/**
 * 广度优先遍历
 * TODO：冗余的遍历待优化掉
 * @param data
 * @param parent
 * @param callback
 * @param option
 */
export const treeIterate = (
  data: TJson,
  parent: TNode,
  callback: (item: TNode, parent: TNode) => void,
  option?: ITreeIterateOptions,
) => {
  ;(data || []).forEach((item: TNode) => {
    callback(item, parent)
    if (item.children) {
      treeIterate(item.children, item, callback, option)
    }
  })
}
/**
 * 寻找节点的路径
 * @param tree
 * @param node
 */
export const findNodePath = (tree: TNode, node: TNode) => {
  const rpath: TNode[] = []
  // TODO：为以后需要保存多条路径作准备
  const result: { [key: string]: TNode[] } = {}
  const _findNodePath = (root: TNode, path: TNode[], target: TNode) => {
    if (!root) {
      return
    }
    path.push(root)
    if (root._id === target._id) {
      result[node._id] = [...path]
      return
    }
    if (root.children && root.children.length) {
      for (let i = 0; i < root.children.length; i++) {
        _findNodePath(root.children[i], path, target)
      }
    }
    path.pop()
  }
  _findNodePath(tree, rpath, node)
  return result[node._id] as TNode[]
}
/**
 * 把树状的 Json 数据结构打平成列表，便于检索
 * @param json
 * @returns
 */
export const flattenJson = (json: TJson): TNode[] => {
  const nodes: TNode[] = []
  treeIterate(json, null, (item: TNode) => {
    nodes.push(item)
  })
  return nodes
}
