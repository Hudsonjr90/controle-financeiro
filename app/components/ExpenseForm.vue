<template>
  <div>
    <q-input v-model="name" label="Descrição" filled class="q-mb-sm" />
    
    <q-select
      v-model="category"
      label="Categoria"
      :options="categoriaOptions"
      filled
      clearable
      use-input
      fill-input
      hide-selected
      input-debounce="0"
      new-value-mode="add-unique"
      class="q-mb-sm"
      hint="Digite para criar nova categoria ou selecione existente"
      @filter="filtrarCategorias"
    />
    
    <q-input
      v-model.number="value"
      label="Valor (R$)"
      type="number"
      step="0.01"
      min="0"
      filled
      class="q-mb-sm"
    />
    
    <q-btn label="Adicionar" color="primary" class="full-width" @click="add" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useFinanceStore } from "@/stores/finance";
import { expenseCategories } from "@/constants/categories";

const $q = useQuasar();
const store = useFinanceStore();

const name = ref("");
const value = ref(0);
const category = ref("");
const categoriaOptions = ref<string[]>([]);

// Categorias das constantes + categorias dos gastos existentes
const categoriasExistentes = computed(() => {
  const categorias = new Set<string>();
  
  // Adicionar categorias das constantes
  expenseCategories.forEach(cat => categorias.add(cat));
  
  // Adicionar categorias dos gastos existentes que não estão nas constantes
  store.expenses.forEach(expense => {
    if (expense.category && expense.category.trim()) {
      categorias.add(expense.category);
    }
  });
  
  return Array.from(categorias).sort();
});

// Inicializar opções
categoriaOptions.value = categoriasExistentes.value;

function filtrarCategorias(val: string, update: Function) {
  update(() => {
    if (val === '') {
      categoriaOptions.value = categoriasExistentes.value;
    } else {
      const needle = val.toLowerCase();
      categoriaOptions.value = categoriasExistentes.value.filter(
        categoria => categoria.toLowerCase().includes(needle)
      );
    }
  });
}

function add() {
  if (!name.value || !value.value) {
    $q.notify({
      type: 'warning',
      message: 'Preencha pelo menos o nome e valor do gasto',
      position: 'top'
    });
    return;
  }

  const expenseData: any = {
    name: name.value,
    value: value.value
  };
  
  if (category.value && category.value.trim()) {
    expenseData.category = category.value.trim();
  }

  store.addExpense(expenseData);

  $q.notify({
    type: 'positive',
    message: 'Gasto adicionado com sucesso!',
    position: 'top'
  });

  // Limpar campos
  name.value = "";
  value.value = 0;
  category.value = "";
}
</script>
