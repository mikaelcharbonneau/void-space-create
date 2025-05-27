export const logDebug = (context: string, data: any) => {
  if (import.meta.env.DEV) {
    console.group(`Debug: ${context}`);
    console.log(data);
    console.groupEnd();
  }
};