// function linearInterpolation(p1, p2, x) {
//   return p1.y + ((x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
// }

// Функция для вычисления коэффициентов кубического сплайна
// function calculateCubicSplineCoefficients(points) {
//   const n = points.length - 1;
//   const h = [];
//   const alpha = [];
//   const l = [];
//   const mu = [];
//   const z = [];
//   const c = [];
//   const b = [];
//   const d = [];

//   // Вычисление h[i]
//   for (let i = 0; i < n; i++) {
//     h[i] = points[i + 1].x - points[i].x;
//   }

//   // Вычисление alpha[i]
//   for (let i = 1; i < n; i++) {
//     alpha[i] = (3 / h[i]) * (points[i + 1].y - points[i].y) - (3 / h[i - 1]) * (points[i].y - points[i - 1].y);
//   }

//   // Инициализация массивов l, mu, z
//   l[0] = 1;
//   mu[0] = 0;
//   z[0] = 0;

//   // Решение системы уравнений для c[i]
//   for (let i = 1; i < n; i++) {
//     l[i] = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1];
//     mu[i] = h[i] / l[i];
//     z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
//   }

//   l[n] = 1;
//   z[n] = 0;
//   c[n] = 0;

//   // Обратная подстановка для нахождения c[i]
//   for (let j = n - 1; j >= 0; j--) {
//     c[j] = z[j] - mu[j] * c[j + 1];
//     b[j] = (points[j + 1].y - points[j].y) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
//     d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
//   }

//   // Возвращаем коэффициенты
//   console.log('коэффициенты', { b, c, d });
//   return { b, c, d };
// }

// // Функция для вычисления значения сплайна в точке x
// function evaluateSpline(points, coefficients, x) {
//   const { b, c, d } = coefficients;
//   let i = 0;

//   // Находим интервал, в котором находится x
//   while (i < points.length - 1 && x > points[i + 1].x) {
//     i++;
//   }

//   const dx = x - points[i].x;
//   return points[i].y + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
// }

// // Функция для нахождения x по заданному y
// function findXForY(points, coefficients, y) {
//   let low = points[0].x;
//   let high = points[points.length - 1].x;
//   const tolerance = 1e-6;
//   let mid;

//   // Используем метод бинарного поиска
//   while (high - low > tolerance) {
//     mid = (low + high) / 2;
//     const midY = evaluateSpline(points, coefficients, mid);

//     if (midY < y) {
//       low = mid;
//     } else {
//       high = mid;
//     }
//   }

//   return (low + high) / 2;
// }

// const calcPercentOne = (points, sD) => {
//   const intPoints = [];

//   Object.values(points).forEach((point) => {
//     const compName = Object.keys(point[4])[0];
//     intPoints.push({ x: point[4][compName], y: point[2] });
//   });

//   intPoints.sort((a, b) => {
//     return a['x'] - b['x'];
//   });

//   const coef = calculateCubicSplineCoefficients(intPoints);

//   return findXForY(intPoints, coef, sD);
// };

// export { calcPercentOne };

import Decimal from 'decimal.js';

// Функция для вычисления коэффициентов кубического сплайна
function calculateCubicSplineCoefficients(points) {
  const n = points.length - 1;
  const h = [];
  const alpha = [];
  const l = [];
  const mu = [];
  const z = [];
  const c = [];
  const b = [];
  const d = [];

  // Вычисление h[i]
  for (let i = 0; i < n; i++) {
    h[i] = new Decimal(points[i + 1].x).minus(points[i].x);
  }

  // Вычисление alpha[i]
  for (let i = 1; i < n; i++) {
    alpha[i] = new Decimal(3)
      .dividedBy(h[i])
      .times(new Decimal(points[i + 1].y).minus(points[i].y))
      .minus(new Decimal(3).dividedBy(h[i - 1]).times(new Decimal(points[i].y).minus(points[i - 1].y)));
  }

  // Инициализация массивов l, mu, z
  l[0] = new Decimal(1);
  mu[0] = new Decimal(0);
  z[0] = new Decimal(0);

  // Решение системы уравнений для c[i]
  for (let i = 1; i < n; i++) {
    l[i] = new Decimal(2).times(new Decimal(points[i + 1].x).minus(points[i - 1].x)).minus(h[i - 1].times(mu[i - 1]));
    mu[i] = h[i].dividedBy(l[i]);
    z[i] = new Decimal(alpha[i]).minus(h[i - 1].times(z[i - 1])).dividedBy(l[i]);
  }

  l[n] = new Decimal(1);
  z[n] = new Decimal(0);
  c[n] = new Decimal(0);

  // Обратная подстановка для нахождения c[i]
  for (let j = n - 1; j >= 0; j--) {
    c[j] = new Decimal(z[j]).minus(mu[j].times(c[j + 1]));
    b[j] = new Decimal(points[j + 1].y)
      .minus(points[j].y)
      .dividedBy(h[j])
      .minus(h[j].times(new Decimal(c[j + 1]).plus(new Decimal(2).times(c[j]))).dividedBy(3));
    d[j] = new Decimal(c[j + 1]).minus(c[j]).dividedBy(new Decimal(3).times(h[j]));
  }

  // Возвращаем коэффициенты
  console.log('коэффициенты', { b, c, d });
  return { b, c, d };
}

// Функция для вычисления значения сплайна в точке x
function evaluateSpline(points, coefficients, x) {
  const { b, c, d } = coefficients;
  let i = 0;

  // Находим интервал, в котором находится x
  while (i < points.length - 1 && new Decimal(x).greaterThan(points[i + 1].x)) {
    i++;
  }

  const dx = new Decimal(x).minus(points[i].x);
  return new Decimal(points[i].y)
    .plus(b[i].times(dx))
    .plus(c[i].times(dx).times(dx))
    .plus(d[i].times(dx).times(dx).times(dx))
    .toNumber();
}

// Функция для нахождения x по заданному y
function findXForY(points, coefficients, y) {
  let low = new Decimal(points[0].x);
  let high = new Decimal(points[points.length - 1].x);
  const tolerance = new Decimal(1e-6);
  let mid;

  // Используем метод бинарного поиска
  while (high.minus(low).greaterThan(tolerance)) {
    mid = low.plus(high).dividedBy(2);
    const midY = evaluateSpline(points, coefficients, mid.toNumber());

    if (new Decimal(midY).lessThan(y)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low.plus(high).dividedBy(2).toNumber();
}

const calcPercentOne = (points, sD) => {
  const intPoints = [];

  Object.values(points).forEach((point) => {
    const compName = Object.keys(point[4])[0];
    intPoints.push({ x: new Decimal(point[4][compName]), y: new Decimal(point[2]) });
  });

  intPoints.sort((a, b) => {
    return a.x.minus(b.x).toNumber();
  });

  const coef = calculateCubicSplineCoefficients(intPoints);

  return findXForY(intPoints, coef, sD);
};

export { calcPercentOne };
