<template>
  <q-page class="flex flex-center bg-primary">
    <div class="text-center q-pa-xl">
      <div class="q-mb-xl">
        <q-img
          src="/images/finance-hero.svg"
          style="width: 300px; height: 200px"
          class="q-mx-auto q-mb-lg"
          alt="Controle Financeiro"
        />
      </div>
      
      <h1 class="text-h3 text-white q-mb-md font-weight-bold">
        Controle Financeiro Pessoal
      </h1>
      
      <p class="text-h6 text-white q-mb-xl opacity-80">
        Gerencie suas finanças de forma simples e eficiente.
        Controle seus gastos, monitore sua renda e tome decisões financeiras inteligentes.
      </p>
      
      <div class="row q-gutter-md justify-center">
        <q-btn
          size="lg"
          color="white"
          text-color="primary"
          unelevated
          to="/controle"
          class="q-px-xl"
        >
          <q-icon name="fa-solid fa-plus-circle" class="q-mr-sm" />
          Criar Controle
        </q-btn>
        
        <q-btn
          size="lg"
          color="transparent"
          text-color="white"
          outline
          to="/dashboard"
          class="q-px-xl"
        >
          <q-icon name="fa-solid fa-chart-line" class="q-mr-sm" />
          Ver Dashboard
        </q-btn>
      </div>
      
      <div class="q-mt-xl text-white">
        <h6 class="text-h6 q-mb-md">Funcionalidades:</h6>
        <div class="row q-gutter-lg justify-center">
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-wallet" size="2em" class="q-mb-sm" />
            <div class="text-body2">Controle de Renda</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-receipt" size="2em" class="q-mb-sm" />
            <div class="text-body2">Gestão de Gastos</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-chart-bar" size="2em" class="q-mb-sm" />
            <div class="text-body2">Relatórios Visuais</div>
          </div>
          <div class="col-auto text-center">
            <q-icon name="fa-solid fa-file-download" size="2em" class="q-mb-sm" />
            <div class="text-body2">Exportar Dados</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Página inicial - apresentação do projeto
</script>
