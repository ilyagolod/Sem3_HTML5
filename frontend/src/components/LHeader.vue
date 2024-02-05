<template>
   <header class="header">
      <div class="container">
         <div class="row d-flex justify-content-between align-items-center">
            <div class="col-2">
               <div class="header__logo d-flex justify-content-start align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 20 30" fill="none">
                     <path d="M10.7764 12.1023L9.99991 15.0001L9.22345 17.8978" stroke="#1C274C" stroke-linecap="round" />
                     <path
                        d="M4 15C4 12.1716 4 10.7574 4.87868 9.87868C5.75736 9 7.17157 9 10 9C12.8284 9 14.2426 9 15.1213 9.87868C16 10.7574 16 12.1716 16 15C16 17.8284 16 19.2426 15.1213 20.1213C14.2426 21 12.8284 21 10 21C7.17157 21 5.75736 21 4.87868 20.1213C4 19.2426 4 17.8284 4 15Z"
                        stroke="#1C274C" />
                  </svg>
                  <h1>HTML5 APIs project</h1>
               </div>
            </div>
            <div class="col-2">
               <div class="header__nav">
                  <ul class="d-flex justify-content-between align-items-center">
                     <li>
                        <div class="header__nav-item">
                           <RouterLink to="/">Главная</RouterLink>
                        </div>
                     </li>
                     <li>
                        <div class="header__nav-item"><RouterLink to="/gallery">Галлерея</RouterLink></div>
                     </li>
                  </ul>
               </div>
            </div>

            <div class="col-2">
               <div class="header__support-tip d-flex justify-content-end align-items-center">
                  <span :class="{ active: workspaceStore.html5check }"></span>
                  <span>HTML 5 <template v-if="!workspaceStore.html5check">НЕ</template>поддерживается</span>
               </div>
            </div>
         </div>
      </div>
   </header>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '../stores/workspace';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';

const workspaceStore = useWorkspaceStore();

const checkHTML5 = () => {
   try {
      workspaceStore.html5check = true;
   } catch (error) {
      workspaceStore.html5check = true;
   }
};

onMounted(() => {
   checkHTML5();
});
</script>

<style lang="scss" scoped>
.header {
   width: 100%;
   min-height: 60px;
   padding: 16px 0;
   background: var(--colours-exterior-colours-bg-header-1, rgba(224, 235, 252, 0.5));

   .header__nav {
      ul {
         margin: 0;

         li {
            .header__nav-item {
               color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
               font-family: Roboto;
               font-size: 16px;
               font-style: normal;
               font-weight: 400;
               line-height: 16px; /* 133.333% */
            }
         }
      }
   }

   .header__support-tip {
      span:first-child {
         width: 8px;
         height: 8px;
         border-radius: 50%;
         background-color: red;
         margin-right: 8px;

         &.active {
            background-color: yellow;
         }
      }

      span:last-child {
         color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 400;
         line-height: 16px; /* 133.333% */
      }
   }
   .header__logo {
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
         margin-right: 8px;
      }

      h1 {
         font-size: 24px;
         font-weight: 500;
         color: var(--Colours-Exterior-Colours-Blue-Dark, #01004a);
         font-family: Roboto;
         font-style: normal;
         font-weight: 400;
      }
   }
}
</style>
