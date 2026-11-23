<script setup lang="ts">
import CapabilitiesSection from '@/components/site/CapabilitiesSection.vue'
import ClientsMarquee from '@/components/site/ClientsMarquee.vue'
import ContactSection from '@/components/site/ContactSection.vue'
import HeroSection from '@/components/site/HeroSection.vue'
import ManifestoSection from '@/components/site/ManifestoSection.vue'
import PhilosophySection from '@/components/site/PhilosophySection.vue'
import StatsSection from '@/components/site/StatsSection.vue'
import WorkSection from '@/components/site/WorkSection.vue'
</script>

<template>
  <main id="main" class="min-h-screen">
    <HeroSection />
    <ManifestoSection />
    <WorkSection />
    <ClientsMarquee />
    <CapabilitiesSection />
    <StatsSection />
    <PhilosophySection />
    <ContactSection />
  </main>
</template>
