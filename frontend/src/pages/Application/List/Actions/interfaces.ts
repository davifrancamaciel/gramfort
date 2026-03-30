import { Application } from '../../interfaces';

export interface PropTypes {
  actionFilter: (type: string) => void;
  items: Application[];
  print?: boolean;
  title: string;
}
