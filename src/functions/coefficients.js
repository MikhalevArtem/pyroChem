const getCoefficient1_2 = (verticles) => {
  const result = {};
  result.k = (verticles.blue[1] - verticles.green[1]) / (verticles.blue[0] - verticles.green[0]);
  result.b = verticles.green[1] - result.k * verticles.green[0];
  return result;
};

const getCoefficient3_T = (verticles, x, y) => {
  const result = {};
  result.k = (+y - verticles.red[1]) / (+x - verticles.red[0]);
  result.b = verticles.red[1] - result.k * verticles.red[0];

  return result;
};

const findDPoint = (coefficient1_2, coefficient3_T) => {
  const result = {};

  result.xd = (coefficient1_2.b - coefficient3_T.b) / (coefficient3_T.k - coefficient1_2.k);

  result.yd = coefficient1_2.k * result.xd + coefficient1_2.b;

  return result;
};

const getLengths = (verticles, x, y, dPoint) => {
  const result = {
    l1_2: 0,
    l1_D: 0,
    l3_D: 0,
    lD_T: 0,
    l2_D: 0,
    l3_T: 0,
  };

  result.l1_2 = Math.sqrt(
    Math.pow(verticles.green[0] - verticles.blue[0], 2) + Math.pow(verticles.green[1] - verticles.blue[1], 2),
  );

  result.l1_D = Math.sqrt(Math.pow(verticles.green[0] - dPoint.xd, 2) + Math.pow(verticles.green[1] - dPoint.yd, 2));

  result.l3_D = Math.sqrt(Math.pow(verticles.red[0] - dPoint.xd, 2) + Math.pow(verticles.red[1] - dPoint.yd, 2));

  result.lD_T = Math.sqrt(Math.pow(+x - dPoint.xd, 2) + Math.pow(+y - dPoint.yd, 2));

  result.l2_D = Math.sqrt(Math.pow(verticles.blue[0] - dPoint.xd, 2) + Math.pow(verticles.blue[1] - dPoint.yd, 2));

  result.l3_T = Math.sqrt(Math.pow(+x - verticles.red[0], 2) + Math.pow(+y - verticles.red[1], 2));

  return result;
};

const calcSD = (lengths) => {
  return lengths.l1_D / lengths.l1_2;
};

const calcST = (lengths) => {
  return lengths.lD_T / lengths.l3_D;
};

export { getCoefficient1_2, getCoefficient3_T, findDPoint, getLengths, calcSD, calcST };
