export const formatResponse = (statusCode: number, body: any) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
  },
});


export const cleanErrorMessage = (message: any): string => {
  if (typeof message !== 'string') {
     return '';
  }
  return message.replace(/["\\]/g, '');
};