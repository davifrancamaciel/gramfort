import { Sale, Filter } from '../../interfaces';

export interface PropTypes {
  actionFilter: (type: string) => void;
  items: Sale[];
  print?: boolean;
  title: string;
  path: string;
  state?: Filter;
}
