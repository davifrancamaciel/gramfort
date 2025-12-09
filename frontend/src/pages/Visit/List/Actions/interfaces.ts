import { Visit } from '../../interfaces';

export interface PropTypes {
  actionFilter: (type: string) => void;
  items: Visit[];
  print?: boolean;
  title: string;
}
