<template>
  <q-list bordered separator v-if="store.expenses.length" class="full-width">
    <q-item v-for="(item, index) in store.expenses" :key="index" class="full-width">
      <q-item-section>
        <div class="text-body2">{{ item.name }}</div>
        <div v-if="item.category" class="text-caption text-grey-6">
          <q-chip dense size="sm" color="grey-3" text-color="grey-8">
            {{ item.category }}
          </q-chip>
        </div>
      </q-item-section>

      <q-item-section side>
        {{ numberToReal(item.value) }}
      </q-item-section>

      <q-item-section side class="q-gutter-xs">
        <q-btn
          icon="fas fa-edit"
          color="primary"
          flat
          round
          size="sm"
          @click="editarGasto(index)"
        >
          <q-tooltip>Editar gasto</q-tooltip>
        </q-btn>
        <q-btn
          icon="far fa-trash-alt"
          color="negative"
          flat
          round
          size="sm"
          @click="store.removeExpense(index)"
        >
          <q-tooltip>Remover gasto</q-tooltip>
        </q-btn>
      </q-item-section>
    </q-item>
  </q-list>

  <div v-else class="text-grey">Nenhum gasto informado</div>

  <!-- Dialog para editar gasto -->
  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="min-width: 300px; max-width: 95vw; width: 100%;">
      <q-card-section>
        <div class="text-h6">Editar Gasto</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="editingExpense.name"
          label="Descrição do gasto"
          dense
          class="q-mb-md"
        />
        
        <q-select
          v-model="editingExpense.category"
          label="Categoria"
          :options="categoriaOptions"
          dense
          clearable
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          new-value-mode="add-unique"
          class="q-mb-md"
          hint="Digite para criar nova categoria ou selecione existente"
          @filter="filtrarCategorias"
        />
        
        <q-input
          v-model.number="editingExpense.value"
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0"
          dense
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" @click="cancelarEdicao" />
        <q-btn flat label="Salvar" @click="salvarEdicao" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useFinanceStore } from "@/stores/finance";
import { numberToReal } from "@/utils/functions";
import { expenseCategories } from "@/constants/categories";

const $q = useQuasar();
const store = useFinanceStore();

const showEditDialog = ref(false);
const editingExpense = ref({ name: "", value: 0, category: "" });
const editingIndex = ref(-1);
const categoriaOptions = ref<string[]>([]);

// Lista de categorias das constantes + categorias dos gastos existentes
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

function editarGasto(index: number) {
  editingIndex.value = index;
  const expense = store.expenses[index];
  if (!expense) return;
  editingExpense.value = {
    name: expense.name,
    value: expense.value,
    category: expense.category || ""
  };
  categoriaOptions.value = categoriasExistentes.value;
  showEditDialog.value = true;
}

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

function cancelarEdicao() {
  showEditDialog.value = false;
  editingExpense.value = { name: "", value: 0, category: "" };
  editingIndex.value = -1;
}

function salvarEdicao() {
  if (!editingExpense.value.name || !editingExpense.value.value) {
    $q.notify({
      type: 'warning',
      message: 'Preencha pelo menos o nome e valor do gasto',
      position: 'top'
    });
    return;
  }

  const expenseData: any = {
    name: editingExpense.value.name,
    value: editingExpense.value.value
  };
  
  if (editingExpense.value.category && editingExpense.value.category.trim()) {
    expenseData.category = editingExpense.value.category.trim();
  }

  store.editExpense(editingIndex.value, expenseData);

  $q.notify({
    type: 'positive',
    message: 'Gasto editado com sucesso!',
    position: 'top'
  });

  cancelarEdicao();
}
</script>
