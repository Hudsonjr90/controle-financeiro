<template>
  <q-page class="q-pa-md" :class="ui.dark ? 'bg-dark' : 'bg-light'">
    <div class="row q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-md">Criar Controle Financeiro</h4>
        <p class="text-body1 text-grey-7">
          Preencha suas informações de renda e gastos para começar o controle
          financeiro.
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          color="positive"
          icon="fa-solid fa-save"
          label="Salvar Relatório"
          @click="salvarRelatorio"
          :disable="!temDados"
          class="q-ml-md"
        />
      </div>
    </div>

 <client-only>
  <div class="row q-col-gutter-lg items-start">

    <!-- COLUNA ESQUERDA -->
    <div class="col-12 col-md-6">
      <div class="column q-gutter-lg">

        <!-- RENDA -->
        <q-card class="q-pa-md">
          <q-card-section>
            <h6 class="text-h6 q-mt-none">Informações de Renda</h6>
            <IncomeInput />
          </q-card-section>
        </q-card>

        <!-- GASTOS -->
        <q-card class="q-pa-md">
          <q-card-section>
            <h6 class="text-h6 q-mt-none">Adicionar Gastos</h6>
            <ExpenseForm />
          </q-card-section>
        </q-card>

      </div>
    </div>

    <!-- COLUNA DIREITA -->
    <div class="col-12 col-md-6">
      <q-card class="q-pa-md" style="max-height: 610px;">
        <q-card-section>
          <h6 class="text-h6 q-mt-none">Lista de Gastos</h6>
          <div style="max-height: 460px; overflow-y: auto;">
            <ExpenseList />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- RESUMO (100%) -->
    <div class="col-12">
      <q-card class="q-pa-md">
        <q-card-section>
          <h6 class="text-h6 q-mt-none">Resumo Financeiro</h6>
          <FinanceSummary />
        </q-card-section>
      </q-card>
    </div>

  </div>
</client-only>


    <!-- Dialog de confirmação para salvar relatório -->
    <q-dialog v-model="showSaveDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Salvar Relatório</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="nomeRelatorio"
            autofocus
            label="Nome do relatório"
            @keyup.enter="confirmarSalvar"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="showSaveDialog = false" />
          <q-btn flat label="Salvar" @click="confirmarSalvar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useFinanceStore } from "@/stores/finance";
import IncomeInput from "@/components/IncomeInput.vue";
import ExpenseForm from "@/components/ExpenseForm.vue";
import ExpenseList from "@/components/ExpenseList.vue";
import FinanceSummary from "@/components/FinanceSummary.vue";

const $q = useQuasar();
const store = useFinanceStore();
const ui = useUIStore();

const showSaveDialog = ref(false);
const nomeRelatorio = ref("");

const temDados = computed(() => {
  return store.income > 0 || store.expenses.length > 0;
});

onMounted(() => {
  store.load();
});

function salvarRelatorio() {
  if (!temDados.value) {
    $q.notify({
      type: "warning",
      message: "Adicione algumas informações antes de salvar o relatório.",
      position: "top",
    });
    return;
  }

  // Se está editando um relatório existente, usa o nome original
  // Senão, define um nome padrão baseado na data
  if (store.editingReport) {
    nomeRelatorio.value = store.editingReport.name;
  } else {
    const agora = new Date();
    nomeRelatorio.value = `Relatório ${agora.toLocaleDateString("pt-BR")}`;
  }
  
  showSaveDialog.value = true;
}

function confirmarSalvar() {
  if (!nomeRelatorio.value.trim()) {
    $q.notify({
      type: "warning",
      message: "Digite um nome para o relatório.",
      position: "top",
    });
    return;
  }

  // Salva o relatório (cria novo ou atualiza existente)
  const isEditing = !!store.editingReport;
  store.saveReport(nomeRelatorio.value.trim());

  // Limpa os dados atuais
  store.clearData();

  showSaveDialog.value = false;
  nomeRelatorio.value = "";

  $q.notify({
    type: "positive",
    message: isEditing 
      ? "Relatório atualizado com sucesso! Os dados foram limpos para um novo controle."
      : "Relatório salvo com sucesso! Os dados foram limpos para um novo controle.",
    position: "top",
  });
}
</script>
