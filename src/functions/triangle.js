// создаём массив всех координат
const getCoordinatesArr = (coordinateObj) => {
  return Object.keys(coordinateObj).reduce((accum, key) => {
    const result = [...accum];

    Object.values(coordinateObj[key]).forEach((item) => {
      result.push(item);
    });
    return result;
  }, []);
};

// Находим точку, ближайшую к началу координат
const findBlueVerticle = (coordinatesArr = []) => {
  let result = coordinatesArr[0];
  let distance = Math.sqrt(coordinatesArr[0][0] * 2 + coordinatesArr[0][1] * 2);

  coordinatesArr.forEach((item, index) => {
    if (index === 0) {
      return;
    }

    const currentDistance = Math.sqrt(item[0] * 2 + item[1] * 2);

    if (currentDistance < distance) {
      result = coordinatesArr[index];
      distance = currentDistance;
    }
  });

  return result;
};
// Находим точку, с самым большим значением Y
const findGreenVerticle = (coordinatesArr = []) => {
  let result = coordinatesArr[0];
  coordinatesArr.forEach((item, index) => {
    if (index === 0) {
      return;
    }

    if (item[1] > result[1]) {
      result = item;
    }
  });
  return result;
};

// Находим точку, с самым большим значением X
const findRedVerticle = (coordinatesArr = []) => {
  let result = coordinatesArr[0];

  coordinatesArr.forEach((item, index) => {
    if (index === 0) {
      return;
    }

    if (item[0] > result[0]) {
      result = item;
    }
  });

  return result;
};

const findVerticles = (coordinateObj) => {
  const coordinatesArr = getCoordinatesArr(coordinateObj);

  const verticles = {
    blue: findBlueVerticle(coordinatesArr),
    green: findGreenVerticle(coordinatesArr),
    red: findRedVerticle(coordinatesArr),
  };

  console.log('треугольник', verticles);
  return verticles;
};

export { findVerticles };
