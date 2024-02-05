<template>
   <div class="workspace">
      <div class="container">
         <div class="workspace__area">
            <div class="row">
               <div class="col-4">
                  <div class="workspace__content">
                     <div class="workspace__content-nav">
                        <ul class="nav">
                           <li v-for="item in workspaceNavItems" @click="activeTab = item.type">
                              <div class="nav__item">{{ item.label }}</div>
                           </li>
                           <li class="audio-guide" @click="viewAudio = true">
                              <div class="nav__item">Аудиогид</div>
                           </li>
                           <li class="audio-guide" @click="activeTab = 'events'">
                              <div class="nav__item">Расписание событий</div>
                           </li>
                           <li class="audio-guide" @click="activeMap = activeMap === 'vue' ? 'js' : 'vue'">
                              <div class="nav__item">
                                 <template v-if="activeMap === 'vue'"> Построить маршрут </template>
                                 <template v-if="activeMap === 'js'"> Основная карта </template>
                              </div>
                           </li>
                        </ul>
                        <template v-if="activeTab === 'places' && activeMap === 'vue'">
                           <div class="controls-search">
                              <input type="text" placeholder="Поиск" v-model="searchModel" />
                           </div>
                        </template>
                     </div>
                     <template v-if="activeTab === 'places'">
                        <div class="workspace__content-list">
                           <div class="workspace__content-list-title">Список мест</div>
                           <ul class="list">
                              <li v-if="markers?.length > 0" v-for="(item, key) in markers" :key="Number(key) + 1">
                                 <div class="list__item">
                                    <div class="list__item-title">
                                       <h3>{{ item?.properties?.name }}</h3>
                                    </div>
                                    <div class="list__items-content">
                                       <p>Адрес: {{ item?.properties?.description }}</p>
                                    </div>
                                 </div>
                              </li>
                              <li v-else>
                                 <div class="list__item">
                                    <div class="list__item-title">
                                       <h3>Нет найденных событий!</h3>
                                    </div>
                                    <div class="list__items-content">
                                       <p>Воспользуйтесь поиском</p>
                                    </div>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </template>
                     <template v-if="activeTab === 'events'">
                        <div class="workspace__content-list">
                           <div class="workspace__content-list-title">Список событий</div>
                           <div class="add-event" @click="onAddEvent">Добавить событие</div>
                           <ul class="list">
                              <li v-for="(item, key) in events" :key="Number(key) + 1">
                                 <div class="list__item">
                                    <div class="list__item-title">
                                       <h3>{{ item.name }}</h3>
                                    </div>
                                    <div class="list__items-content">
                                       <p>Дата: {{ item.date }}</p>
                                    </div>
                                    <div class="list__items-controls">
                                       <button @click="removeEvent(key)">Удалить</button>
                                    </div>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </template>
                     <template v-if="activeTab === 'reviews'">
                        <div class="workspace__content-list workspace__content-list--reviews">
                           <div class="workspace__content-list-title">Отзывы и оценки</div>
                           <ul class="list">
                              <li v-for="(item, key) in getReviewsList()" :key="`place${key + 1}`">
                                 <div class="list__item">
                                    <div class="list__item-title">
                                       <h3>Отзыв "{{ item.placeName }}"</h3>
                                    </div>
                                    <div class="list__items-content">
                                       <p>{{ item.review }}</p>
                                    </div>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </template>
                  </div>
               </div>
               <div class="col-4">
                  <div v-if="mapKey" class="workspace__map" :key="mapKey">
                     <div class="workspace__map-controls" v-if="activeMap === 'vue'">
                        <button class="reset-btn" @click="routeLine = null">Сбросить путь</button>
                     </div>
                     <template v-if="activeMap === 'vue'">
                        <yandex-map
                           :settings="{
                              location: {
                                 center: location,
                                 zoom: 12,
                              },
                           }"
                           width="100%">
                           <yandex-map-default-scheme-layer />
                           <yandex-map-default-features-layer />
                           <yandex-map-controls :settings="{ position: 'right' }">
                              <yandex-map-zoom-control />
                           </yandex-map-controls>

                           <yandex-map-default-marker
                              :settings="{
                                 coordinates: location,
                                 title: 'Вы здесь!',
                                 color: 'red',
                              }">
                           </yandex-map-default-marker>

                           <template v-if="viewAudio">
                              <yandex-map-default-marker
                                 :settings="{
                                    coordinates: getGuideLocation(location),
                                    title: 'Тест аудиогида!',
                                    color: 'blue',
                                    popup: { position: 'top' },
                                 }">
                                 <template #popup="{ close }">
                                    <div class="marker-popup audio-guide-popup d-flex flex-column" @click="close()">
                                       <div class="mb-4">Нажмите на кнопку для запуска аудио!</div>
                                       <audio controls>
                                          <source src="./testAudio.mp3" type="audio/mpeg" />
                                       </audio>
                                    </div>
                                 </template>
                              </yandex-map-default-marker>
                           </template>

                           <template v-for="marker in markers">
                              <yandex-map-default-marker
                                 :settings="{
                                    coordinates: marker?.geometry?.coordinates,
                                    title: marker?.properties?.name,
                                    color: 'green',
                                    popup: { position: 'top' },
                                 }">
                                 <template #popup="{ close }">
                                    <div class="default-marker-popup">
                                       <div class="close-btn" @click="close()">+</div>
                                       <div class="popup-row popup-row--title">
                                          <div class="value">{{ marker?.properties?.name }}</div>
                                       </div>
                                       <div class="popup-row">
                                          <div class="label">Адрес</div>
                                          <div class="value">{{ marker?.properties?.description }}</div>
                                       </div>
                                       <div class="popup-row">
                                          <div class="label">Сайт</div>
                                          <div class="value">{{ marker?.properties?.CompanyMetaData?.url }}</div>
                                       </div>
                                       <div class="popup-row">
                                          <div class="label">Телефон</div>
                                          <div class="value">
                                             {{
                                                marker?.properties?.CompanyMetaData?.Phones?.length > 0
                                                   ? marker?.properties?.CompanyMetaData?.Phones[0]?.formatted
                                                   : ''
                                             }}
                                          </div>
                                       </div>
                                       <div class="popup-row">
                                          <div class="value" @click="() => onAddReview(marker?.properties, marker.geometry.coordinates)">
                                             Добавить отзыв
                                          </div>
                                       </div>
                                       <div class="popup-row">
                                          <div class="value" @click="() => onMarkerClick(marker.geometry.coordinates)">Построить маршрут</div>
                                       </div>
                                    </div>
                                 </template>
                              </yandex-map-default-marker></template
                           >

                           <template v-if="routeLine">
                              <yandex-map-feature :settings="routeLine" />
                           </template>
                        </yandex-map>
                     </template>
                     <template v-if="activeMap === 'js'">
                        <div id="map" style="width: 100%; height: 100%"></div>
                     </template>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <template v-if="eventsDialog">
         <VDialog title="Добавить событие" v-model="eventsDialog" @update:model-value="eventsDialog = false">
            <br />
            <div>
               <input type="text" placeholder="Введите наименование мероприятия" v-model="newEventObj.name" />
            </div>
            <div>
               <input type="text" placeholder="Введите дату мероприятия" v-model="newEventObj.date" />
            </div>
            <div>
               <button @click="addEvent">Сохранить</button>
            </div>
         </VDialog>
      </template>

      <template v-if="viewReview">
         <VDialog title="Оставить отзыв" v-model="viewReview" @update:model-value="viewReview = false">
            <div>Оставить отзыв о "{{ reviewedData.properties.name }}"</div>
            <br />
            <div>
               <input type="text" placeholder="Введите отзыв" v-model="reviewedData.review" />
            </div>
            <div>
               <button @click="addReview">Сохранить</button>
            </div>
         </VDialog>
      </template>

      <template v-if="viewGuide">
         <VDialog title="Привет!" v-model="viewGuide" @update:model-value="viewGuide = false" class="guide-dialog">
            <div>
               Это web-приложение, демонстрирующие работу различных API в HTML5. Используемый стек технологий: HTML, CSS/SCSS, Vue 3, NodeJS, TS. В
               проекте реализованы следующие функции:
            </div>
            <div>
               <ul>
                  <li>
                     - Поиск мест и отображение их на карте с помощью Yandex Maps API, Yandex API поиска организаций и Canvas API (основная рабочая
                     область, input поиска, кликабельные маркеры на карте), отображение информации о месте (адрес, телефон, ссылка на сайт) по нажатии
                     на маркер места. Frontend-часть проекта обращается к серверной посредством HTTP-запроса, получая в ответ массив локаций на карте.
                     <b>Если карта не загрузилась с первого, пожалуйста, перезагрузите страницу!</b>
                  </li>
                  <li>- Проверка поддержки браузером пользователя HTML5 API (статус отображается в верхнем правом углу интерфейса)</li>
                  <li>- Отображение локации пользователя с помощью Geolocation API (метка «Вы здесь» на основной карте)</li>
                  <li>
                     - Добавление отзывов о местах, отображением списка отзывов в отдельном разделе на рабочей области, сохранение данных в
                     localStorage (отзыв можно добавить, нажав на соответствующую кнопку в popup’е метки на карте).
                  </li>
                  <li>
                     - Демонстрация реализации аудиогида (по нажатию на соответсвующую кнопку на карте отображается маркер "Тест аудиогида!", по
                     нажатии на который открывается popup с аудиодорожкой).
                  </li>
                  <li>
                     - Отображение предстоящих событий и создание собственных с возможностью добавления наименования и даты событий, сохранение данных
                     в localStorage
                  </li>
                  <li>
                     - Построение маршрута от текущей локации пользователя до определенной точки (доступно на карте для построения маршрута, которая
                     открывается по нажатии на кнопку "Построить маршрут". Вернуться к основной карте можно, нажав на эту же кнопку)
                  </li>
                  <li>
                     - Сохранение и загрузка с сервера изображений в разделе Галерея с помощью Filemanager API и Filereader API (доступен только
                     формат JPG). Файлы сохраняются в директорию /uploads на Backend'е приложения, а на пользовательскую часть отпарвляются в виде
                     бинарного файла в FormData.
                  </li>
               </ul>
            </div>
            <div>
               <button @click="onGuideClose">Больше не показывать инструкцию</button>
            </div>
         </VDialog>
      </template>
   </div>
</template>

<script setup lang="ts">
import { MainSerivce } from '@/services';
import VDialog from '@/components/VDialog.vue';
import { onMounted, ref, watch, Ref } from 'vue';
import type { YMapFeatureProps } from '@yandex/ymaps3-types';
import debounce from 'lodash.debounce';
import { notify } from '@kyvg/vue3-notification';

import {
   YandexMap,
   YandexMapControls,
   YandexMapDefaultFeaturesLayer,
   YandexMapDefaultMarker,
   YandexMapDefaultSchemeLayer,
   YandexMapFeature,
   YandexMapZoomControl,
} from 'vue-yandex-maps';
import { useWorkspaceStore } from '../stores/workspace';

const workspaceStore = useWorkspaceStore();

const viewReview = ref(false);
const reviewedData: any = ref({
   properties: null,
   location: null,
   review: '',
});

const viewAudio = ref(false);
const viewGuide = ref(true);
const searchModel = ref('');
const activeTab = ref('places');
const activeMap = ref('vue');

const eventsDialog = ref(false);
const newEventObj: any = ref({
   name: '',
   date: '',
});
const events: any = ref([]);

const mapKey: any = ref('');
const location: any = ref([]);
const markers: any = ref([]);
const routeLine: Ref<YMapFeatureProps | null> = ref(null);

enum NavigationType {
   places = 'places',
   reviews = 'reviews',
}

const eventsExampleData: any = [
   {
      name: 'Prodexpo 2024',
      date: '10.02.2024',
   },
   {
      name: 'Aquatherm Moscow 2024',
      date: '24.02.2024',
   },
   {
      name: 'Стэндап в Москве от комиков из проектов ТНТ и YouTube',
      date: '13.02.2024',
   },
];

const workspaceNavItems: any = ref([
   {
      type: NavigationType.places,
      label: 'Мои места',
   },
   {
      type: NavigationType.reviews,
      label: 'Отзывы',
   },
]);

const setScripts = () => {
   let yandexMaps = document.createElement('script');
   yandexMaps.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?apikey=3c973482-c71c-42d1-aa81-99863e90e25c&lang=ru_RU');
   yandexMaps.setAttribute('type', 'text/javascript');
   document.head.appendChild(yandexMaps);

   let jquery = document.createElement('script');
   jquery.setAttribute('src', 'https://yandex.st/jquery/2.2.3/jquery.min.js');
   jquery.setAttribute('type', 'text/javascript');
   document.head.appendChild(jquery);
};

const onGuideClose = () => {
   localStorage.isGuideDisabled = true;
   viewGuide.value = false;
};

const getGuideLocation = (location: any) => {
   return [location[0] + 0.01, location[1] + 0.01];
};

const searchData = debounce(async () => {
   try {
      markers.value = [];
      const { data } = await MainSerivce.requestSearchData(searchModel.value, location.value.join(','));
      markers.value = data;
      return false;
   } catch (error) {}
}, 500);

const checkHTML5 = () => {
   try {
      workspaceStore.html5check = true;
   } catch (error) {
      alert(error);
      workspaceStore.html5check = true;
   }
};

const onMarkerClick = (markerLocation: any) => {
   routeLine.value = {
      id: 'one',
      draggable: true,
      geometry: {
         type: 'LineString',
         coordinates: [
            // Specify the coordinates of the vertices of the polyline.
            location.value,
            markerLocation,
         ],
      },
      style: { stroke: [{ color: '#f00', width: 4 }] },
   };
};

const onAddReview = (properties: any, location: any) => {
   viewReview.value = true;
   reviewedData.value = {
      properties: properties,
      location: location,
   };
};

const addReview = () => {
   try {
      let reviews: any = localStorage.getItem('reviews') ? JSON.parse(localStorage.getItem('reviews')) : { data: [] };

      localStorage.setItem('reviews', JSON.stringify({ data: [...reviews.data, reviewedData.value] }));
      viewReview.value = false;
      notify({
         title: 'Отзыв сохранен!',
      });
   } catch (error) {}
};

const setLocation = () => {
   try {
      const geolocationSuccess = (position: any) => {
         location.value = [position.coords.longitude, position.coords.latitude];
      };

      const geolocationFailure = (positionError: any) => {
         location.value = [];
      };

      // Если функциональность геолокации доступна,
      // пытаемся определить координаты посетителя
      if (navigator.geolocation) {
         // Передаем две функции
         navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
         });

         // Выводим результат
         // location.value = 'Поиск начался';
      } else {
         // Выводим результат
         // location.value = 'Ваш браузер не поддерживает геолокацию';
         alert('Ваш браузер не поддерживает геолокацию');
      }
   } catch (error) {
      console.log(error);
   }
};

const getReviewsList = () => {
   if (localStorage.reviews) {
      try {
         const { data: reviews } = JSON.parse(localStorage.reviews);
         return reviews.map((item: any) => {
            return {
               location: item?.location,
               placeName: item?.properties?.name,
               review: item?.review,
            };
         });
      } catch (error) {
         console.log(error);
         return [];
      }
   } else {
      return [];
   }
};

const onAddEvent = () => {
   newEventObj.value = {
      name: '',
      date: '',
   };
   eventsDialog.value = true;
};

const addEvent = () => {
   events.value.push(newEventObj.value);

   let _events: any = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : { data: [] };
   localStorage.setItem('events', JSON.stringify({ data: [..._events.data, newEventObj.value] }));
   eventsDialog.value = false;

   notify({
      title: 'Событие сохранено сохранен!',
   });
};

const removeEvent = (key: any) => {
   events.value.splice(key, 1);
   localStorage.setItem('events', JSON.stringify({ data: [...events.value] }));

   notify({
      title: 'Событие удалено!',
   });
};

watch(
   () => searchModel.value,
   async (newValue, oldValue) => {
      if (!String(newValue).trim()) return;

      await searchData(newValue);
   },
);

watch(
   () => activeMap.value,
   async newValue => {
      if (newValue === 'js') {
         setScripts();

         setTimeout(() => {
            initMap();
         }, 200);
      }
   },
);

const initMap = () => {
   ymaps.ready(function () {
      var myMap = new ymaps.Map('map', {
         center: [location.value[1], location.value[0]],
         zoom: 9,
         // Добавим панель маршрутизации.
         controls: ['routePanelControl'],
      });

      var control = myMap.controls.get('routePanelControl');

      // Зададим состояние панели для построения машрутов.
      control.routePanel.state.set({
         // Тип маршрутизации.
         type: 'masstransit',
         // Выключим возможность задавать пункт отправления в поле ввода.
         fromEnabled: true,
         // Адрес или координаты пункта отправления.
         from: [location.value[1], location.value[0]],
         // Включим возможность задавать пункт назначения в поле ввода.
         toEnabled: true,
         // Адрес или координаты пункта назначения.
         //to: 'Петербург'
      });

      // Зададим опции панели для построения машрутов.
      control.routePanel.options.set({
         // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
         allowSwitch: false,
         // Включим определение адреса по координатам клика.
         // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
         reverseGeocoding: true,
         // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
         types: { masstransit: true, pedestrian: true, taxi: true },
      });

      // Создаем кнопку, с помощью которой пользователи смогут менять местами начальную и конечную точки маршрута.
      var switchPointsButton = new ymaps.control.Button({
         data: { content: 'Поменять местами', title: 'Поменять точки местами' },
         options: { selectOnClick: false, maxWidth: 160 },
      });
      // Объявляем обработчик для кнопки.
      switchPointsButton.events.add('click', function () {
         // Меняет местами начальную и конечную точки маршрута.
         control.routePanel.switchPoints();
      });
      myMap.controls.add(switchPointsButton);
   });
};

const makeid = (length: number) => {
   let result = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   let counter = 0;
   while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
   }
   return result;
};

onMounted(async () => {
   if (localStorage?.isGuideDisabled) viewGuide.value = false;
   if (!localStorage?.events) localStorage.setItem('events', JSON.stringify({ data: eventsExampleData }));

   try {
      events.value = JSON.parse(localStorage.events)?.data;
   } catch {}

   setTimeout(() => {
      mapKey.value = makeid(5);
   }, 100);

   checkHTML5();
   setLocation();
});
</script>

<style lang="scss">
.guide-dialog {
   .modal-header {
      span {
         font-family: Roboto;
         font-size: 14px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px; /* 142.857% */
      }
   }
   .modal-body {
      > div {
         font-family: Roboto;
         font-size: 14px;
         font-style: normal;
         font-weight: 400;
         line-height: 20px; /* 142.857% */
      }

      ul {
         list-style: none;
         padding: 0;

         li {
            margin: 8px;
         }
      }

      button {
         border-radius: var(--Corner-radius-Rounded---MD, 6px);
         border: 2px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);
         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         text-align: center;
         background: #fff;
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 400;
         line-height: 16px;
         padding: 8px;
         cursor: pointer;
      }
   }
}

.marker-popup {
   background: #fff;
   border-radius: 10px;
   padding: 10px;
   color: black;
   cursor: pointer;
   font-size: 14px;
   white-space: nowrap;
}

.default-marker-popup {
   background: #fff;
   border-radius: 10px;
   padding: 10px;
   color: black;
   cursor: pointer;
   font-size: 14px;
   white-space: nowrap;
   position: relative;
   padding-top: 23px;
   max-width: 400px;

   .close-btn {
      transform: rotate(45deg);
      position: absolute;
      right: 10px;
      top: 10px;
      overflow: hidden;
      color: var(--Colours-Base-Colours-Gray-Dark, #637189);
      text-overflow: ellipsis;
      white-space: nowrap;

      /* SM */
      font-family: Roboto;
      font-size: 22px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
   }

   .popup-row {
      width: 100%;
      padding: 4px 8px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      &:not(:last-child) {
         margin-bottom: 8px;
      }

      .value {
         width: 100%;
         color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 400;
         line-height: 16px; /* 133.333% */
         text-overflow: ellipsis;
         overflow: hidden;
      }

      .label {
         width: 100%;
         color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 500;
         line-height: 16px; /* 133.333% */
         text-overflow: ellipsis;
         overflow: hidden;
      }

      &.popup-row--title {
         .value {
            color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
            text-align: center;
            font-family: Roboto;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px; /* 133.333% */
         }
      }
   }
}

.marker {
   background: green;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 10px;
   cursor: pointer;
   color: #fff;
   padding: 10px 20px;
   white-space: nowrap;
}

.popup {
   position: absolute;
   top: calc(100% + 10px);
   background: #fff;
   border-radius: 10px;
   padding: 10px;
   color: black;
}
.workspace {
   .workspace__area {
      height: calc(100vh - 116px);

      border-radius: var(--Corner-radius-Rounded---2XL, 16px);
      background: radial-gradient(98.93% 55.04% at 76.05% 55.01%, #f1f4ff 2.19%, rgba(241, 244, 255, 0.1) 92.08%),
         var(--Colours-Internal-Colours-BG, #ccdbf1);
      overflow: hidden;

      .workspace__map {
         height: 100%;
         position: relative;

         .workspace__map-controls {
            z-index: 10;
            position: absolute;
            right: 10px;
            top: 10px;
            width: 100px;
            height: 40px;
            background-color: transparent;

            .reset-btn {
               width: auto;
               height: 36px;
               color: var(--Colours-Base-Colours-Gray-Dark, #637189);
               text-align: center;
               font-family: Roboto;
               font-size: 12px;
               font-style: normal;
               font-weight: 400;
               line-height: 16px; /* 133.333% */
               background-color: #fff;
               border-radius: var(--Corner-radius-Rounded---MD, 6px);
               border: 2px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);
               transition: all 0.2s ease;

               &:hover {
                  background-color: #f1f4ff;
               }
            }
         }
      }

      .workspace__content {
         height: calc(100vh - 116px);
         width: 100%;
         background: #fff;
         padding: 16px;

         .workspace__content-nav {
            width: 100%;

            .controls-search {
               margin: 16px 0;

               input {
                  padding: 8px 20px;
                  max-width: 207px;
                  width: 100%;
                  border-radius: 4px;
                  border: 1px solid #f1f4ff;
                  background: #f1f4ff;

                  color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);

                  /* XS */
                  font-family: Roboto;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 16px; /* 133.333% */
               }
            }
            .nav {
               display: flex;
               justify-content: flex-start;
               list-style: none;
               margin: 0;
               padding: 0;

               li {
                  display: block;
                  width: 100%;
                  max-width: fit-content !important;
                  margin-right: 10px;
                  .nav__item {
                     border-radius: var(--Corner-radius-Rounded---MD, 6px);
                     border: 2px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);
                     color: var(--Colours-Base-Colours-Gray-Dark, #637189);
                     text-align: center;
                     font-family: Roboto;
                     font-size: 12px;
                     font-style: normal;
                     font-weight: 400;
                     line-height: 16px; /* 133.333% */
                     padding: 8px;
                     cursor: pointer;
                  }
               }
            }
         }

         .workspace__content-list {
            margin-top: 10px;
            .workspace__content-list-title {
               color: var(--Colours-Base-Colours-Gray-Dark, #637189);
               text-overflow: ellipsis;
               white-space: nowrap;
               font-family: Roboto;
               font-size: 16px;
               font-style: normal;
               font-weight: 500;
               line-height: 20px; /* 142.857% */
               padding: 8px;
            }

            .add-event {
               padding: 8px;
               color: var(--Colours-Base-Colours-Gray-Dark, #637189);
               text-overflow: ellipsis;
               white-space: nowrap;
               font-family: Roboto;
               font-size: 14px;
               font-style: normal;
               font-weight: 400;
               line-height: 20px; /* 142.857% */
               padding: 8px;
               text-decoration: underline;
               cursor: pointer;
            }

            .list {
               padding: 0 8px;
               overflow-y: auto;
               height: calc(100vh - 316px);

               li {
                  .list__item {
                     width: 100%;
                     display: flex;
                     flex-direction: column;
                     justify-content: flex-start;
                     align-items: flex-start;
                     padding: 8px;
                     border-bottom: 1px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);

                     .list__item-title {
                        margin-bottom: 10px;
                        h3 {
                           overflow: hidden;
                           color: var(--Colours-Base-Colours-Gray-Dark, #637189);
                           text-overflow: ellipsis;
                           white-space: nowrap;
                           font-family: Roboto;
                           font-size: 14px;
                           font-style: normal;
                           font-weight: 400;
                           line-height: 20px; /* 142.857% */
                        }
                     }

                     .list__items-controls {
                        button {
                           padding: 8px 0;
                           color: var(--Colours-Base-Colours-Gray-Dark, #637189);
                           text-overflow: ellipsis;
                           white-space: nowrap;
                           font-family: Roboto;
                           font-size: 14px;
                           font-style: normal;
                           font-weight: 400;
                           line-height: 20px; /* 142.857% */
                           text-decoration: underline;
                           cursor: pointer;
                           border: none;
                           background: transparent;
                        }
                     }

                     .list__items-content {
                        width: 100%;

                        p {
                           display: inline-block;
                           color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
                           /* Additional style/Sidebar */
                           font-family: 'Roboto Condensed';
                           font-size: 12px;
                           font-style: normal;
                           font-weight: 400;
                           line-height: 16px; /* 133.333% */
                        }
                     }
                  }
               }
            }
         }
      }
   }
}
</style>
