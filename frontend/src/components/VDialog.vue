<template>
   <div class="modal-overlay" @click="close">
      <div class="modal-card" @click.stop="">
         <div class="modal-header">
            <span>{{ title }}</span>
            <svg class="modal-close" @click="close" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
               <path
                  d="M1 7C1 4.17157 1 2.75736 1.87868 1.87868C2.75736 1 4.17157 1 7 1C9.82843 1 11.2426 1 12.1213 1.87868C13 2.75736 13 4.17157 13 7C13 9.82843 13 11.2426 12.1213 12.1213C11.2426 13 9.82843 13 7 13C4.17157 13 2.75736 13 1.87868 12.1213C1 11.2426 1 9.82843 1 7Z"
                  fill="#FD2271"
                  stroke="#E3145F" />
               <path d="M9.99998 4.00002L4 10M3.99997 4L9.99995 9.99998" stroke="white" stroke-linecap="round" />
            </svg>
         </div>

         <div class="modal-body scrollable">
            <slot></slot>
         </div>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'Dialog',
   props: {
      modelValue: { type: Boolean, required: true },
      title: { type: String, required: false, default: '' },
   },
   setup() {
      return {};
   },
   methods: {
      close() {
         this.$emit('update:modelValue', false);
      },
   },
});
</script>

<style lang="scss">
.modal-overlay {
   position: fixed;
   top: 0;
   bottom: 0;
   left: 0;
   right: 0;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(1, 0, 74, 0.2);
   overflow: hidden;
   z-index: 20001;

   .modal_card_large {
      width: 80% !important;
   }

   .modal-card {
      width: 892px;
      max-height: 512px;
      padding: 23px 20px;
      border-radius: 16px;
      background: var(--Colours-Base-Colours-Gray-Light, #f1f4ff);
      display: flex;
      flex-direction: column;

      > div {
         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         font-family: Roboto;
         font-size: 12px;
         font-style: normal;
         font-weight: 400;
         line-height: 16px;

         input {
            padding: 8px 20px;
            max-width: 80%;
            width: 100%;
            border-radius: 4px;
            border: 1px solid #f1f4ff;
            background: #fff !important;
            color: var(--Colours-Base-Colours-Gray-D-Dark, #49576f);

            /* XS */
            font-family: Roboto;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 16px; /* 133.333% */
            margin-bottom: 16px;
         }

         button {
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

      .modal-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 12px;

         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         font-size: 16px;
         font-weight: 500;
         line-height: 24px;

         .modal-close {
            cursor: pointer;
         }
      }

      .modal-body {
         color: var(--Colours-Base-Colours-Gray-Dark, #637189);
         font-size: 16px;
         font-weight: 500;
         line-height: 24px;
      }
   }
}
</style>
