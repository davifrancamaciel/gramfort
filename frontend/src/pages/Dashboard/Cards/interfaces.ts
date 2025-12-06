export interface Filter {
  companyId?: string;
  date: Date;
}

export const initialState: Filter = {
  date: new Date()
};
