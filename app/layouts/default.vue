<template>
  <q-layout view="hHh lpR fFf">
    <q-header unelevated bordered :class="ui.dark ? 'bg-dark' : 'bg-primary'">
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
        <q-btn 
          flat 
          round 
          :icon="ui.dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" 
          @click="toggle" 
        >
          <q-tooltip>{{ ui.dark ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered :class="ui.dark ? 'bg-dark' : 'bg-light'"> 
      <q-list>
        <q-item-label header class="text-weight-bold">Menu Principal</q-item-label>       
        <q-item clickable to="/" exact @click="drawer = false" :class="ui.dark ? 'text-white' : 'text-primary'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-house" />
          </q-item-section>
          <q-item-section >Início</q-item-section>
        </q-item>
        
        <q-item clickable to="/controle" @click="drawer = false" :class="ui.dark ? 'text-white' : 'text-primary'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-plus-circle" />
          </q-item-section>
          <q-item-section>Criar Controle</q-item-section>
        </q-item>
        
        <q-item clickable to="/dashboard" @click="drawer = false" :class="ui.dark ? 'text-white' : 'text-primary'">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-chart-line" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        
        <q-separator class="q-my-md" />
        
        <q-item-label header class="text-weight-bold">Relatórios</q-item-label> 
        <q-item clickable to="/relatorios" @click="drawer = false" :class="ui.dark ? 'text-white' : 'text-primary'">
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
import { ref, onMounted } from "vue";
import { useUIStore } from "@/stores/ui";
import { useQuasar } from "quasar";

const drawer = ref(false);
const ui = useUIStore();
const $q = useQuasar();

function toggle() {
  ui.toggleDark($q);
}

onMounted(() => {
  ui.load($q);
});
</script>
