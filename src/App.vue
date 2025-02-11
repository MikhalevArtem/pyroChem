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
                md="4"
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
                      md="6"
                    >
                      <v-text-field
                        v-model="inputCoordinates.x"
                        label="Введите координату X"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
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
    calcNearest,
  } from './functions';

  const inputFile = ref(null);
  const inputCoordinates = reactive({ x: 0, y: 0 });
  const errors = reactive([]);

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

    // Находим координаты вершин треугольника
    const verticles = findVerticles(coordinatesObj);

    // Находим коэффициенты
    const coefficient1_2 = getCoefficient1_2(verticles);
    const coefficient3_T = getCoefficient3_T(verticles, inputCoordinates.x, inputCoordinates.y);

    // Находим растояния
    const dPoint = findDPoint(coefficient1_2, coefficient3_T);
    const lengths = getLengths(verticles, +inputCoordinates.x, +inputCoordinates.y, dPoint);

    // Проверка на соответсвие диапазона
    fullproof(lengths);

    //Вычисление Сд и Ст
    const sD = calcSD(lengths);
    const sT = calcST(lengths);

    //Находим из каждой таблицы 3 ближайшие точки к заданным координатам
    const nearest = calcNearest(coordinatesObj, +inputCoordinates.x, +inputCoordinates.y);
    console.log(nearest);
  };
</script>

<style scoped></style>
