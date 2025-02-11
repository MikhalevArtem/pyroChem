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
    l1_d: 0,
    l3_d: 0,
    ld_t: 0,
    l2_d: 0,
    l3_t: 0,
  };

  result.l1_2 = Math.sqrt(
    Math.pow(verticles.green[0] - verticles.blue[0], 2) + Math.pow(verticles.green[1] - verticles.blue[1], 2),
  );

  result.l1_d = Math.sqrt(Math.pow(verticles.green[0] - dPoint.xd, 2) + Math.pow(verticles.green[1] - dPoint.yd, 2));

  result.l3_d = Math.sqrt(Math.pow(verticles.red[0] - dPoint.xd, 2) + Math.pow(verticles.red[1] - dPoint.yd, 2));

  result.ld_t = Math.sqrt(Math.pow(+x - dPoint.xd, 2) + Math.pow(+y - dPoint.yd, 2));

  result.l2_d = Math.sqrt(Math.pow(verticles.blue[0] - dPoint.xd, 2) + Math.pow(verticles.blue[1] - dPoint.yd, 2));

  result.l3_t = Math.sqrt(Math.pow(+x - verticles.red[0], 2) + Math.pow(+y - verticles.red[1], 2));

  return result;
};

export { getCoefficient1_2, getCoefficient3_T, findDPoint, getLengths };
