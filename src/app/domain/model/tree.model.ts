export interface TreeNode {
  data : {
    active?: boolean;
    code: string;
    parentId: string | null;
    childCount: number;
    level: number;
    name: string;
    id: string;
    path: string;
  }
  expanded: boolean;
  children: TreeNode[]; // Array untuk children nodes
}
