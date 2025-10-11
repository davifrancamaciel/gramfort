export const formatName = (name: string) => {
  if (name.includes('comission')) return { route: 'expenses/run-comission' };
 
  if (name.includes('backup')) return { route: 'services/run-backup' };

  return { name, route: '' };
};
