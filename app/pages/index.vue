<template>
  <q-page class="flex flex-center" :class="uiStore.dark ? 'bg-dark' : 'bg-light'">
    <div class="text-center q-pa-xl">
      <div class="q-mb-xl">
        <q-img
          :src="dashboardLogo"
          style="width: 500px; height: 300px"
          class="q-mx-auto q-mb-lg"
          alt="Controle Financeiro"
        />
      </div>
      
      <h1 class="text-h3 q-mb-md font-weight-bold" :class="uiStore.dark ? 'text-white' : 'text-dark'">
        Controle Financeiro Pessoal
      </h1>
      
      <p class="text-h6 q-mb-xl opacity-80" :class="uiStore.dark ? 'text-white' : 'text-dark'">
        Gerencie suas finanças de forma simples e eficiente.
        Controle seus gastos, monitore sua renda e tome decisões financeiras inteligentes.
      </p>
      
      <div class="row q-gutter-md justify-center">
        <q-btn
          size="lg"
          :color="uiStore. dark ? 'primary' : 'transparent'"
          :text-color="uiStore.dark ? 'text-white' : 'text-dark'"
          unelevated
          outline
          to="/controle"
          class="q-px-xl"
        >
          <q-icon name="fa-solid fa-plus-circle" :color="uiStore.dark ? 'white' : 'primary'" class="q-mr-sm" />
          Criar Controle
        </q-btn>
        
        <q-btn
          size="lg"
          color="transparent"
          :text-color="uiStore.dark ? 'white' : 'dark'"
          outline
          to="/dashboard"
          class="q-px-xl"
        >
          <q-icon name="fa-solid fa-chart-line" :color="uiStore.dark ? 'white' : 'primary'" class="q-mr-sm" />
          Ver Dashboard
        </q-btn>
      </div>
      
      <div class="q-mt-xl" :class="uiStore.dark ? 'text-white' : 'text-dark'">
        <h6 class="text-h6 q-mb-md">Funcionalidades:</h6>
        <div class="row q-gutter-lg justify-center">
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-wallet" :color="uiStore.dark ? 'white' : 'primary'" size="2em" class="q-mb-sm" />
            <div class="text-body2">Controle de Renda</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-receipt" :color="uiStore.dark ? 'white' : 'primary'" size="2em" class="q-mb-sm" />
            <div class="text-body2">Gestão de Gastos</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-chart-bar" :color="uiStore.dark ? 'white' : 'primary'" size="2em" class="q-mb-sm" />
            <div class="text-body2">Relatórios Visuais</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-file-download" :color="uiStore.dark ? 'white' : 'primary'" size="2em" class="q-mb-sm" />
            <div class="text-body2">Exportar Dados</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/ui";
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import dashboardLogo from "@/assets/images/dashboard.png";

const uiStore = useUIStore();
const $q = useQuasar();

onMounted(() => {
  uiStore.load($q);
});
</script>
