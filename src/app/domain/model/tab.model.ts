export interface ITab {
  title: string;
  content: string;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  index: number;
  customClass?: string;
  data?: any
}
