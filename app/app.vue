<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ConsentBanner
    :isVisible="true"
    @showPrivacy="datenschutzOpen = true"
    @showPrivacyFaq="faqOpen = true"
  />
  <PrivacyFaqModal :isOpen="faqOpen" @close="faqOpen = false" />
  <ModalDatenschutz :is-open="datenschutzOpen" @close="datenschutzOpen = false" />
</template>

<script setup>
import { ref } from 'vue'
const faqOpen = ref(false)
const datenschutzOpen = ref(false)
</script>
