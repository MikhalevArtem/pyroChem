<template>
  <v-app>
    <v-app-bar
      app
      color="surface-light"
    ></v-app-bar>
    <v-main>
      <v-container>
        <v-form @submit.prevent="sumbitFormHandler">
          <v-container>
            <v-row justify="center">
              <v-col
                cols="12"
                lg="6"
              >
                <v-file-input
                  clearable
                  label="Выберите файл"
                  v-model="inputFile"
                ></v-file-input>
                <v-container>
                  <v-row justify="center">
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-text-field
                        v-model="inputCoordinates.x"
                        label="Введите координату X"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-text-field
                        v-model="inputCoordinates.y"
                        label="Введите координату Y"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <v-btn
                  color="secondary"
                  block
                  type="submit"
                  :disabled="!inputFile"
                  >Расчитать</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <h4
                  class="text-center"
                  v-if="firstTableItems"
                >
                  Расчёт произведёт по таблице {{ firstTableItems.get('Название состава') }}
                </h4>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col
                cols="6"
                lg="6"
              >
                <v-btn
                  v-show="secondTableItems"
                  class="w-100"
                  color="secondary"
                  type="button"
                  @click="() => createExcelFile(secondTableItems)"
                  >Скачать результат</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-table v-if="secondTableItems">
                  <thead>
                    <tr>
                      <th class="text-left">Компонент</th>
                      <th class="text-left">Состав в процентах%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in secondTableItems"
                      :key="item.name"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-container>
    </v-main>
    <v-footer
      app
      color="surface-light"
    ></v-footer>
    <v-snackbar v-model="showSnack">
      {{ errors[0] }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="removeError"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import Decimal from 'decimal.js';
  import {
    getWB,
    getSheetNames,
    getCoordinatesObj,
    findVerticles,
    getCoefficient1_2,
    getCoefficient3_T,
    findDPoint,
    getLengths,
    calcSD,
    calcST,
    calcNearestPoints,
    calcNearestSheetPoints,
    calcPercentOne,
    CONSTANTS,
    COMPONENTS,
    COMPONENTS_NAMES,
    COMPOUNDS,
    COMPOUNDS_NAMES,
    COMPOSITION,
    createExcelFile,
  } from './functions';

  const inputFile = ref(null);
  const inputCoordinates = reactive({ x: 0, y: 0 });
  const errors = reactive([]);

  const firstTableItems = ref(null);
  const secondTableItems = ref(null);

  const showSnack = computed({
    get() {
      return Boolean(errors.length);
    },
    set() {
      errors.shift();
    },
  });

  const removeError = () => {
    errors.shift();
  };

  const fullproof = (lengths) => {
    const conditionOne = Boolean(lengths.lD_T + lengths.l3_T > lengths.l3_D);
    const conditionTwo = Boolean(lengths.l1_D + lengths.l2_D > lengths.l1_2);
    if (conditionOne || conditionTwo) {
      errors.push('Заданный цвет находится вне доступного диапазона');
      inputCoordinates.x = 0;
      inputCoordinates.y = 0;
    }
  };

  const calcnearestSheetName = (nearestSheetPoints) => {
    return Object.keys(nearestSheetPoints)[0];
  };

  const calcPercentTwoThree = (points, percentOne, isThirdCompound) => {
    const pointsArr = Object.entries(points).sort((a, b) => +a[0] - +b[0]);
    console.log('pointsArr', pointsArr);

    const percentTwoCoef = new Decimal(Object.values(pointsArr[0][1][5])[0]).dividedBy(new Decimal(100));
    console.log('percentTwoCoef', percentTwoCoef.toNumber());

    const percentThreeCoef = isThirdCompound
      ? new Decimal(Object.values(pointsArr[0][1][6])[0]).dividedBy(new Decimal(100))
      : null;
    console.log('percentThreeCoef', percentThreeCoef?.toNumber() || percentThreeCoef);

    const percentTwo = new Decimal(100).minus(percentOne).mul(percentTwoCoef);
    const percentThree = percentThreeCoef ? new Decimal(100).minus(percentOne).mul(percentThreeCoef) : null;

    return [percentTwo, percentThree];
  };

  const calcCompundsNames = (isThirdCompound, points) => {
    const pointArr = Object.values(points);

    const compOneName = Object.keys(pointArr[0][4])[0].trim();
    const compTwoName = Object.keys(pointArr[0][5])[0].trim();
    const compThreeName = isThirdCompound ? Object.keys(pointArr[0][6])[0].trim() : null;

    let result = [compOneName, compTwoName];
    if (compThreeName) {
      result = [...result, compThreeName];
    }

    return result;
  };

  const calcFirstTableItems = (nearestSheetName, compoundNames, percents = []) => {
    const result = new Map();

    result.set('Название состава', nearestSheetName);
    result.set('Координата X', inputCoordinates.x);
    result.set('Координата Y', inputCoordinates.y);

    compoundNames.forEach((item, index) => {
      result.set(`${item}%`, percents[index].toNumber());
    });

    // const components = {};

    // Object.keys(COMPONENTS).forEach((component) => {
    //   components[component] = {
    //     name: COMPONENTS_NAMES[component],
    //     value: 0,
    //   };
    // });

    // compoundNames.forEach((compoundName, index) => {
    //   Object.entries(COMPOSITION[COMPOUNDS_NAMES[compoundName]]).forEach(([key, value]) => {
    //     components[key].value = new Decimal(components[key].value)
    //       .plus(percents[index].mul(value).dividedBy(100))
    //       .toNumber();
    //   });
    // });

    // console.log('components', components);
    return result;
  };

  const calcSecondTabelItems = (compoundNames, percents = []) => {
    const components = {};

    Object.keys(COMPONENTS).forEach((component) => {
      components[component] = {
        name: COMPONENTS_NAMES[component],
        value: 0,
      };
    });

    compoundNames.forEach((compoundName, index) => {
      Object.entries(COMPOSITION[COMPOUNDS_NAMES[compoundName]]).forEach(([key, value]) => {
        new Decimal(
          (components[key].value = new Decimal(components[key].value)
            .plus(percents[index].mul(value).dividedBy(100))
            .toFixed(1, Decimal.ROUND_DOWN)),
        ).toNumber();
      });
    });

    console.log('ahahahahah', components);
    return Object.values(components).filter((item) => +item.value);
  };

  const sumbitFormHandler = async () => {
    errors.length = 0;
    if (Number(inputCoordinates.x) < 0 || Number(inputCoordinates.y) < 0) {
      errors.push('Значения координат не могут быть отрицательными');
      inputCoordinates.x = 0;
      inputCoordinates.y = 0;
      return;
    }
    // Парсим страницы xlsx файла
    const wb = await getWB(inputFile.value);
    const sheetNames = getSheetNames(wb);
    const coordinatesObj = getCoordinatesObj(wb, sheetNames);
    console.log('coordinatesObj', coordinatesObj);

    // Находим координаты вершин треугольника
    const verticles = findVerticles(coordinatesObj);

    // Находим коэффициенты
    const coefficient1_2 = getCoefficient1_2(verticles);
    const coefficient3_T = getCoefficient3_T(verticles, inputCoordinates.x, inputCoordinates.y);

    // Находим растояния
    const dPoint = findDPoint(coefficient1_2, coefficient3_T);
    const lengths = getLengths(verticles, +inputCoordinates.x, +inputCoordinates.y, dPoint);

    // Проверка на соответсвие диапазона
    // fullproof(lengths);

    //Вычисление Сд и Ст
    // const sD = calcSD(lengths);
    // const sT = calcST(lengths);
    // console.log('sD', sD);
    // console.log('sT', sT);

    //Находим из каждой таблицы 3 ближайшие точки к заданным координатам
    const nearestPoints = calcNearestPoints(coordinatesObj, +inputCoordinates.x, +inputCoordinates.y);
    console.log('nearestPoints', nearestPoints);

    //Вычислеям таблицу и координаты, данные которорых ближе всего к заданной точке
    const nearestSheetPoints = calcNearestSheetPoints(nearestPoints, inputCoordinates.x, inputCoordinates.y);
    console.log('nearestSheetPoints', nearestSheetPoints);

    const nearestSheetName = calcnearestSheetName(nearestSheetPoints);
    console.log('nearestSheetName', nearestSheetName);

    const dX = Decimal.abs(
      new Decimal(coordinatesObj[nearestSheetName][CONSTANTS.START_ROW][0]).minus(new Decimal(inputCoordinates.x)),
    );
    const dY = Decimal.abs(
      new Decimal(coordinatesObj[nearestSheetName][CONSTANTS.START_ROW][1]).minus(new Decimal(inputCoordinates.y)),
    );

    const cABC = Decimal.hypot(dX, dY);
    console.log('cABC', cABC.toNumber());

    const nearestSheetKeys = Object.keys(coordinatesObj[nearestSheetName]);

    const sheetRowCount = nearestSheetKeys.reduce((accum, current) => {
      if (+current > accum) return +current;
    }, 0);
    console.log('sheetRowCount', sheetRowCount);

    const sD = cABC.dividedBy(new Decimal(coordinatesObj[nearestSheetName][sheetRowCount][3]));

    console.log('sd', sD.toNumber());

    const percentOne = calcPercentOne(coordinatesObj[nearestSheetName], sD.toNumber()).round();
    console.log(percentOne);

    const isThirdCompound = coordinatesObj[nearestSheetName][CONSTANTS.START_ROW].length === 7;
    console.log('isThirdCompund', isThirdCompound);

    const [percentTwo, percentThree] = calcPercentTwoThree(
      coordinatesObj[nearestSheetName],
      percentOne,
      isThirdCompound,
    );

    console.log('percentOne', percentOne.toNumber());
    console.log('percentTwo', percentTwo.toNumber());
    console.log('percentThree', percentThree?.toNumber() || percentThree);

    const compundsNames = calcCompundsNames(isThirdCompound, coordinatesObj[nearestSheetName]);
    console.log('compoundsNames', compundsNames);

    firstTableItems.value = calcFirstTableItems(nearestSheetName, compundsNames, [
      percentOne,
      percentTwo,
      percentThree,
    ]);
    console.log('firstTableItems', firstTableItems.value);
    secondTableItems.value = calcSecondTabelItems(compundsNames, [percentOne, percentTwo, percentThree]);
    console.log('secondTableItems', secondTableItems.value);
  };

  // const downloadFile = (tableName = 'Новый состав') => {
  //   const blob = createExcelFile(secondTableItems.value, tableName);
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = tableName;
  //   document.body.appendChild(link);
  //   link.click();

  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };
</script>

<style scoped></style>
