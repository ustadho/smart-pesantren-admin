export interface ParentChild {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  childCount: number;
  level: number;
  active?: boolean;
  path: string;
}
