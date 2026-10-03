/** Dispara la descarga de un archivo de texto generado en el navegador. */
export const downloadTextFile = (filename: string, content: string, mimeType = 'text/csv') => {
  // BOM para que Excel abra bien los acentos de un CSV en UTF-8.
  const blob = new Blob(['﻿', content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
