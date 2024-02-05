import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWorkspaceStore = defineStore('workspaceStore', () => {
   const html5check: any = ref(false);

   return {
      html5check,
   };
});
