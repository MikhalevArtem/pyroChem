const calcPointsDistance = (x, y, coordinate = []) => {
  return Math.sqrt(Math.pow(x - coordinate[0], 2) + Math.pow(y - coordinate[1], 2));
};

const calcNearestPoints = (coordinatesObj, x, y) => {
  const result = {};

  const sheetNames = Object.keys(coordinatesObj);

  sheetNames.forEach((name) => {
    const coord = Object.values(coordinatesObj[name]);
    result[name] = [coord[0], coord[1], coord[2]];
    let distanceOne = calcPointsDistance(x, y, result[name][0]);
    let distanceTwo = calcPointsDistance(x, y, result[name][1]);
    let distanceThree = calcPointsDistance(x, y, result[name][2]);
    coord.forEach((coordinate, index) => {
      if (index < 2) {
        return;
      }
      const distance = calcPointsDistance(x, y, coordinate);
      if (distance < distanceOne) {
        result[name] = [coordinate, result[name][0], result[name][1]];
        distanceThree = distanceTwo;
        distanceTwo = distanceOne;
        distanceOne = distance;
      } else if (distance < distanceTwo) {
        result[name] = [result[name][0], coordinate, result[name][1]];
        distanceThree = distanceTwo;
        distanceTwo = distance;
      } else if (distance < distanceThree) {
        result[name] = [result[name][0], result[name][1], coordinate];
        distanceThree = distance;
      }
    });
  });
  return result;
};

//Находим для ближайших двух точек каждой таблицы уравнение прямой и расстояние до неё расстояние от заданной точки, находим минимальное расстояние
const calcCoefficients = (pointA, pointB) => {
  const m = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
  const b = pointA[1] - m * pointA[0];

  console.log('m: ', m, 'b: ', b);
  return {
    m,
    b,
  };
};

const calcStraightDistance = (m, b, x, y) => {
  return Math.abs(m * x - y + b) / Math.sqrt(Math.pow(m + 1, 2));
};

const calcNearestSheetPoints = (nearestPoints, inputX, inputY) => {
  const sheetNames = Object.keys(nearestPoints);

  let result = { [sheetNames[0]]: nearestPoints[sheetNames[0]] };
  let coeff = calcCoefficients(nearestPoints[sheetNames[0]][0], nearestPoints[sheetNames[0]][1]);

  let distance = calcStraightDistance(coeff.m, coeff.b, inputX, inputY);

  sheetNames.forEach((name, index) => {
    if (index === 0) {
      return;
    }
    const currentCoeff = calcCoefficients(nearestPoints[name][0], nearestPoints[name][1]);

    const currentDistance = calcStraightDistance(currentCoeff.m, currentCoeff.b, inputX, inputY);

    if (currentDistance < distance) {
      distance = currentDistance;
      result = { [name]: nearestPoints[name] };
    }
  });

  console.log('distance', distance);

  return result;
};

export { calcNearestPoints, calcNearestSheetPoints };
