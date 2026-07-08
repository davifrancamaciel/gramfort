export const formatName = (name: string) => {
  if (name.includes('automatic')) return { route: 'expenses/run-automatic' };
 
  if (name.includes('backup')) return { route: 'services/run-backup' };

  return { name, route: '' };
};
