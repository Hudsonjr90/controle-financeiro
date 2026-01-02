<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          unelevated
          round
          icon="fa-solid fa-bars-staggered"
          @click="drawer = !drawer"
        />
        <q-toolbar-title>Controle Financeiro</q-toolbar-title>
        <q-btn flat round icon="fa-solid fa-moon" @click="toggle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-weight-bold">Menu Principal</q-item-label>
        
        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="fa-solid fa-house" />
          </q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>
        
        <q-item clickable to="/controle">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-plus-circle" />
          </q-item-section>
          <q-item-section>Criar Controle</q-item-section>
        </q-item>
        
        <q-item clickable to="/dashboard">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-chart-line" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        
        <q-separator class="q-my-md" />
        
        <q-item-label header class="text-weight-bold">Relatórios</q-item-label>
        
        <q-item clickable to="/relatorios">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-file-alt" />
          </q-item-section>
          <q-item-section>Meus Relatórios</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUIStore } from "@/stores/ui";
import { useQuasar } from "quasar";

const drawer = ref(false);
const ui = useUIStore();
const $q = useQuasar();

function toggle() {
  ui.toggleDark($q);
}


</script>
