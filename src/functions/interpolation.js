const calcDistance = (x, y, coordinate = []) => {
  return Math.sqrt(Math.pow(x - coordinate[0], 2) + Math.pow(y - coordinate[1], 2));
};

const calcNearest = (coordinatesObj, x, y) => {
  const result = {};

  const sheetNames = Object.keys(coordinatesObj);

  sheetNames.forEach((name) => {
    const coord = Object.values(coordinatesObj[name]);
    result[name] = [coord[0], coord[1], coord[2]];
    let distanceOne = calcDistance(x, y, result[name][0]);
    let distanceTwo = calcDistance(x, y, result[name][1]);
    let distanceThree = calcDistance(x, y, result[name][2]);
    coord.forEach((coordinate, index) => {
      if (index < 2) {
        return;
      }
      const distance = calcDistance(x, y, coordinate);
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

export { calcNearest };
