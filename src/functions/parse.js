import { read, utils } from 'xlsx';

const CONSTANTS = {
  NAME_CELL: 'A1',
  START_ROW: 5,
  X_COLL: 'E',
  Y_COLL: 'F',
};

const getWB = async (file) => {
  if (!file) {
    return;
  }
  const ab = await file.arrayBuffer();
  return read(ab);
};

const getSheetNames = (wb) => {
  return wb.SheetNames.filter((item) => item.includes('Sostav_'));
};

const getSheetByName = (wb, sheetName) => {
  return wb.Sheets[sheetName];
};

const getSheetCell = (sheet, cellName) => {
  return sheet[cellName];
};

const getSheetRowsCount = (sheet) => {
  const range = sheet['!ref'];
  const decodedRange = utils.decode_range(range);
  const rowCount = decodedRange.e.r + 1;
  return rowCount;
};

const getCoordinatesObj = (wb, sheetNames = []) => {
  return sheetNames.reduce((accum, sheetName) => {
    const sheet = getSheetByName(wb, sheetName);
    const sheetRowsCount = getSheetRowsCount(sheet);
    const name = getSheetCell(sheet, CONSTANTS.NAME_CELL).v;
    const result = {
      ...accum,
      [name]: {},
    };
    for (let i = CONSTANTS.START_ROW; i <= sheetRowsCount; i++) {
      result[name][i] = [
        +getSheetCell(sheet, `${CONSTANTS.X_COLL}${i}`).w,
        +getSheetCell(sheet, `${CONSTANTS.Y_COLL}${i}`).w,
      ];
    }
    return result;
  }, {});
};

export { getWB, getSheetNames, getCoordinatesObj };
