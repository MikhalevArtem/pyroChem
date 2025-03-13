import * as XLSX from 'xlsx';

const createExcelFile = (secondTable, tableName = 'Новый состав') => {
  const table = [[tableName]];

  secondTable.forEach((item) => {
    table.push(Object.values(item));
  });

  const ws = XLSX.utils.aoa_to_sheet(table);
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  const wb = XLSX.utils.book_new();
  console.log('tableName', tableName);
  XLSX.utils.book_append_sheet(wb, ws, tableName);
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tableName}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

export { createExcelFile };
