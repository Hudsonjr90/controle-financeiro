<template>
  <div>
    <q-input v-model="name" label="Descrição" filled class="q-mb-sm" />
    <q-input
      v-model.number="value"
      label="Valor (R$)"
      type="number"
      filled
      class="q-mb-sm"
    />
    <q-btn label="Adicionar" color="primary" class="full-width" @click="add" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFinanceStore } from "@/stores/finance";

const store = useFinanceStore();
const name = ref("");
const value = ref(0);

function add() {
  if (!name.value || !value.value) return;

  store.addExpense({ name: name.value, value: value.value });
  name.value = "";
  value.value = 0;
}
</script>
