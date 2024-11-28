export const formatTimestamp = (timestampInMilliseconds: number): string => {
    const date = new Date(timestampInMilliseconds);
  
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); //meses van de 0 a 11
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;
  }
  

  