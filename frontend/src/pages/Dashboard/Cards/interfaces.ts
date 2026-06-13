export interface Filter {
  companyId?: string;
  date: Date;
  _date?: string;
}

export const initialState: Filter = {
  date: new Date(),
  // _date: ''
};
