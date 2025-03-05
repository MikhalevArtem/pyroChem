import { read, utils } from 'xlsx';

const CONSTANTS = {
  NAME_CELL: 'A1',
  START_ROW: 5,
  X_COLL: 'E',
  Y_COLL: 'F',
  SD_COL: 'J',
  C_ABC: 'I',
  PERCENT_ONE_COL: 'A',
  PERCENT_TWO_COL: 'B',
  PERCENT_THREE_COL: 'C',
  COMPOSITION_ONE_NAME: 'A3',
  COMPOSITION_TWO_NAME: 'B3',
  COMPOSITION_THREE_NAME: 'C3',
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
  return sheet[cellName] || null;
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
    const compositionOneName = getSheetCell(sheet, CONSTANTS.COMPOSITION_ONE_NAME)?.v;
    const compositionTwoName = getSheetCell(sheet, CONSTANTS.COMPOSITION_TWO_NAME)?.v;
    const compositionThreeName = getSheetCell(sheet, CONSTANTS.COMPOSITION_THREE_NAME)?.v;
    const result = {
      ...accum,
      [name]: {},
    };
    for (let i = CONSTANTS.START_ROW; i <= sheetRowsCount; i++) {
      result[name][i] = [
        +getSheetCell(sheet, `${CONSTANTS.X_COLL}${i}`).w,
        +getSheetCell(sheet, `${CONSTANTS.Y_COLL}${i}`).w,
        +getSheetCell(sheet, `${CONSTANTS.SD_COL}${i}`).w,
        +getSheetCell(sheet, `${CONSTANTS.C_ABC}${i}`).w,
      ];
      if (compositionOneName) {
        result[name][i].push({
          [compositionOneName]: parseInt(getSheetCell(sheet, `${CONSTANTS.PERCENT_ONE_COL}${i}`).w),
        });
      }
      if (compositionTwoName) {
        result[name][i].push({
          [compositionTwoName]: parseInt(getSheetCell(sheet, `${CONSTANTS.PERCENT_TWO_COL}${i}`).w),
        });
      }
      if (compositionThreeName) {
        result[name][i].push({
          [compositionThreeName]: parseInt(getSheetCell(sheet, `${CONSTANTS.PERCENT_THREE_COL}${i}`)?.w),
        });
      }
    }
    console.log('parse', result);
    return result;
  }, {});
};

export { getWB, getSheetNames, getCoordinatesObj, CONSTANTS };
