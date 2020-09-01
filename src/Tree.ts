export class TreeNode {
  public children: TreeNode[];

  constructor(public data: Object | string) {
    this.data = data;
    this.children = [];
  }

  add(data: string | Object) {
    this.children.push(new TreeNode(data));
  }

  remove(data: string) {
    this.children.filter((node) => {
      return node.data !== data;
    });
  }
}

class Tree {
  constructor(public root: TreeNode | null) {
    this.root = null;
  }
}

