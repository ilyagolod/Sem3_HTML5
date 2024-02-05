<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import LHeader from './components/LHeader.vue';
import LFooter from './components/LFooter.vue';
</script>

<template>
   <notifications />
   <l-header></l-header>
   <RouterView />
</template>
