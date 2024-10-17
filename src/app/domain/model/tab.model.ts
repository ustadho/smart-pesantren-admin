export interface ITab {
  title: string;
  content: string;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  customClass?: string;
  data?: any
}
