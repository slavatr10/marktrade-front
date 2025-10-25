export const getModuleNumber = (moduleId: string) => {
  const moduleNumber = moduleId.split("-")[1];
  return moduleNumber;
};