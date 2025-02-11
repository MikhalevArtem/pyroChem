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
  </v-app>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import {
    getWB,
    getSheetNames,
    getCoordinatesObj,
    findVerticles,
    getCoefficient1_2,
    getCoefficient3_T,
    findDPoint,
    getLengths,
  } from './functions';

  const inputFile = ref(null);
  const inputCoordinates = reactive({ x: 0, y: 0 });

  const sumbitFormHandler = async () => {
    if (Number(inputCoordinates.x) < 0 || Number(inputCoordinates.y) < 0) {
      return;
    }
    console.log(inputCoordinates);
    // Парсим страницы xlsx файла
    const wb = await getWB(inputFile.value);
    const sheetNames = getSheetNames(wb);
    const coordinatesObj = getCoordinatesObj(wb, sheetNames);
    console.log(coordinatesObj);

    // Находим координаты вершин треугольника
    const verticles = findVerticles(coordinatesObj);
    console.log(verticles);

    // Находим коэффициенты
    const coefficient1_2 = getCoefficient1_2(verticles);
    const coefficient3_T = getCoefficient3_T(verticles, inputCoordinates.x, inputCoordinates.y);

    // Находим растояния
    const dPoint = findDPoint(coefficient1_2, coefficient3_T);
    console.log(dPoint);
    const lengths = getLengths(verticles, +inputCoordinates.x, +inputCoordinates.y, dPoint);
    console.log(lengths);
  };
</script>

<style scoped></style>
