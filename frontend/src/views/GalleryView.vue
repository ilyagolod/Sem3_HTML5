<template>
   <div class="workspace">
      <div class="container">
         <div class="workspace__area">
            <div class="row">
               <div class="col-8">
                  <div class="workspace__content gallery__content">
                     <div class="gallery__title">
                        <h3>Галерея</h3>
                        <button @click="onUploadImage">Загрузить фото</button>
                     </div>
                     <div class="gallery__grid">
                        <div class="row w-100 d-flex justify-content-between align-items-center">
                           <template v-for="(item, key) in images">
                              <div class="col-2">
                                 <div class="gallery__item">
                                    <img :id="`image${key + 1}`" height="200" />
                                 </div>
                              </div>
                           </template>
                        </div>
                     </div>
                     <form ref="formFile">
                        <input
                           type="file"
                           name="uploadExcel"
                           id="file"
                           ref="file"
                           v-on:change.prevent.stop="requestUploadImage()"
                           style="display: none"
                           accept="image/jpeg" />
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { MainSerivce } from '@/services';
import { onMounted, ref } from 'vue';
import { notify } from '@kyvg/vue3-notification';

const formFile: any = ref(null);
const file: any = ref(null);
const images: any = ref([]);

const requestUploadImage = async () => {
   let _file = file.value.files[0];
   let _data = new FormData();
   _data.append('file', _file);
   await uploadImage(1, _data);
   formFile.value.reset();
};

const uploadImage = async (id: any, data: any) => {
   try {
      const { data: response } = await MainSerivce.uploadImage(id, data);

      if (response?.status === true) {
         setTimeout(async () => {
            await getImages();
         }, 200);

         notify({
            title: 'Изображение загружено сохранен!',
         });
      } else {
         throw new Error();
      }
   } catch (error: any) {
      console.log(error);
      notify({
         title: 'Изображение не загружено!',
      });
   }
};

const getImages = async () => {
   try {
      const response = await MainSerivce.images();
      const formData = await response.formData();
      const files = Array.from(formData.values());
      images.value = files;

      setTimeout(() => {
         for (const key in files) {
            onFileSelected(files[key], key);
         }
      }, 100);

      return response;
   } catch (error: any) {
      console.log(error);
   }
};

const onFileSelected = (file: any, key: any) => {
   var reader = new FileReader();
   const imgtag: any = document.getElementById(`image${Number(key) + 1}`);
   imgtag.title = file.name;

   reader.onload = function (event) {
      imgtag.src = event.target.result;
   };

   reader.readAsDataURL(file);
};

const onUploadImage = async () => {
   file.value.click();
};

onMounted(async () => {
   await getImages();
});
</script>

<style lang="scss">
.gallery__content {
   .gallery__title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 32px;

      h3 {
         display: block;
         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         text-overflow: ellipsis;
         white-space: nowrap;
         font-family: Roboto;
         font-size: 16px;
         font-style: normal;
         font-weight: 500;
         line-height: 20px; /* 142.857% */
         margin-right: 16px;
      }

      button {
         width: auto;
         height: 36px;
         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         text-align: center;
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 400;
         line-height: 16px;
         background-color: #fff;
         border-radius: var(--Corner-radius-Rounded---MD, 6px);
         border: 2px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);
      }
   }
}

.gallery__grid {
   .gallery__item {
      margin: 0 8px;
      border-radius: var(--Corner-radius-Rounded---MD, 6px);
      border: 2px solid var(--Colours-Internal-Colours-Gray-Main-Area, #e2e6f5);

      img {
         width: 100%;
      }
   }
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
                  max-width: 100px;
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
            .list {
               padding: 0 8px;
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
