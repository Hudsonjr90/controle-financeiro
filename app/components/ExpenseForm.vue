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
    <q-select
      v-model="category"
      :options="categories"
      label="Categoria"
      filled
      class="q-mb-md"
    />
    <q-btn label="Adicionar" color="primary" class="full-width" @click="add" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFinanceStore } from "@/stores/finance";
import { expenseCategories } from "@/constants/categories";

const store = useFinanceStore();
const categories = expenseCategories;

const name = ref("");
const value = ref(0);
const category = ref("Outros");


function add() {
  if (!name.value || !value.value) return;

  store.addExpense({
    name: name.value,
    value: value.value,
    category: category.value,
  });

  name.value = "";
  value.value = 0;
  category.value = "Outros";
}
</script>
