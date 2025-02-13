// function linearInterpolation(p1, p2, x) {
//   return p1.y + ((x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
// }

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

  // Шаг 1: Вычисление h[i]
  for (let i = 0; i < n; i++) {
    h[i] = points[i + 1].x - points[i].x;
  }

  // Шаг 2: Вычисление alpha[i]
  for (let i = 1; i < n; i++) {
    alpha[i] = (3 / h[i]) * (points[i + 1].y - points[i].y) - (3 / h[i - 1]) * (points[i].y - points[i - 1].y);
  }

  // Шаг 3: Инициализация массивов l, mu, z
  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  // Шаг 4: Решение системы уравнений для c[i]
  for (let i = 1; i < n; i++) {
    l[i] = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n] = 1;
  z[n] = 0;
  c[n] = 0;

  // Шаг 5: Обратная подстановка для нахождения c[i]
  for (let j = n - 1; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (points[j + 1].y - points[j].y) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  // Возвращаем коэффициенты
  return { b, c, d };
}

// Функция для вычисления значения сплайна в точке x
function evaluateSpline(points, coefficients, x) {
  const { b, c, d } = coefficients;
  let i = 0;

  // Находим интервал, в котором находится x
  while (i < points.length - 1 && x > points[i + 1].x) {
    i++;
  }

  const dx = x - points[i].x;
  return points[i].y + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
}

// Функция для нахождения x по заданному y
function findXForY(points, coefficients, y) {
  let low = points[0].x;
  let high = points[points.length - 1].x;
  const tolerance = 1e-6;
  let mid;

  // Используем метод бинарного поиска
  while (high - low > tolerance) {
    mid = (low + high) / 2;
    const midY = evaluateSpline(points, coefficients, mid);

    if (midY < y) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

const calcPercentOne = (points, sD) => {
  const intPoints = [];

  Object.values(points).forEach((point) => {
    const compName = Object.keys(point[3])[0];
    intPoints.push({ x: point[3][compName], y: point[2] });
  });

  intPoints.sort((a, b) => {
    return a['x'] - b['x'];
  });

  const coef = calculateCubicSplineCoefficients(intPoints);

  return findXForY(intPoints, coef, sD).toFixed(2);
};

export { calcPercentOne };
