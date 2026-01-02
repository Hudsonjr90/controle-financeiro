<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-md">Meus Relatórios</h4>
        <p class="text-body1 text-grey-7">
          Visualize e gerencie seus relatórios financeiros salvos.
        </p>
      </div>
    </div>

    <client-only>
      <div v-if="store.reports.length === 0" class="text-center q-pa-xl">
        <q-icon name="assessment" size="4em" class="text-grey-5 q-mb-md" />
        <h6 class="text-h6 text-grey-6">Nenhum relatório salvo</h6>
        <p class="text-body2 text-grey-5 q-mb-lg">
          Crie um controle financeiro e salve como relatório para visualizar aqui.
        </p>
        <q-btn color="primary" to="/controle" label="Criar Primeiro Controle" />
      </div>

      <div v-else>
        <div class="row q-gutter-md">
          <div 
            v-for="(report, index) in store.reports" 
            :key="index"
            class="col-12 col-sm-6 col-lg-4"
          >
            <q-card class="cursor-pointer" @click="visualizarRelatorio(report)">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ report.name }}</div>
                    <div class="text-caption text-grey-6">
                      {{ formatarData(report.createdAt) }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      flat
                      round
                      icon="fa-solid fa-ellipsis-vertical"
                      @click.stop="mostrarMenuRelatorio(report, $event)"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-gutter-sm">
                  <div class="col">
                    <div class="text-body2 text-positive">
                      Renda: R$ {{ report.data.income.toFixed(2) }}
                    </div>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-negative">
                      Gastos: R$ {{ calcularTotalGastos(report.data.expenses).toFixed(2) }}
                    </div>
                  </div>
                </div>
                <div class="text-body2 q-mt-sm" :class="calcularSaldo(report.data) >= 0 ? 'text-positive' : 'text-negative'">
                  Saldo: R$ {{ calcularSaldo(report.data).toFixed(2) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </client-only>

    <!-- Dialog de visualização do relatório -->
    <q-dialog v-model="showReportDialog" maximized>
      <q-card v-if="selectedReport">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">{{ selectedReport.name }}</div>
          <q-space />
          <q-btn flat icon="fa-solid fa-xmark" @click="showReportDialog = false" />
        </q-bar>

        <q-card-section class="q-pa-lg">
          <div class="row q-gutter-lg">
            <!-- Resumo -->
            <div class="col-12">
              <h6 class="text-h6">Resumo Financeiro</h6>
              <div class="row q-gutter-md">
                <div class="col-auto">
                  <q-chip color="positive" text-color="white" icon="fa-solid fa-dollar-sign">
                    Renda: R$ {{ selectedReport.data.income.toFixed(2) }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip color="negative" text-color="white" icon="fa-solid fa-receipt">
                    Gastos: R$ {{ calcularTotalGastos(selectedReport.data.expenses).toFixed(2) }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip 
                    :color="calcularSaldo(selectedReport.data) >= 0 ? 'positive' : 'negative'" 
                    text-color="white" 
                    icon="fa-solid fa-wallet"
                  >
                    Saldo: R$ {{ calcularSaldo(selectedReport.data).toFixed(2) }}
                  </q-chip>
                </div>
              </div>
            </div>

            <!-- Lista de gastos -->
            <div class="col-12 col-md-6">
              <h6 class="text-h6">Gastos Detalhados</h6>
              <q-list bordered separator>
                <q-item v-for="(expense, index) in selectedReport.data.expenses" :key="index">
                  <q-item-section>{{ expense.name }}</q-item-section>
                  <q-item-section side>R$ {{ expense.value.toFixed(2) }}</q-item-section>
                </q-item>
                <q-item v-if="selectedReport.data.expenses.length === 0">
                  <q-item-section class="text-grey-6">Nenhum gasto informado</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn flat label="Fechar" @click="showReportDialog = false" />
          <q-btn 
            color="primary" 
            label="Carregar Dados" 
            @click="carregarDadosRelatorio"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Menu de ações do relatório -->
    <q-menu
      ref="menuRef"
      anchor="center right"
      self="center left"
    >
      <q-list style="min-width: 100px">
        <q-item clickable @click="carregarDadosRelatorio">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-pen" />
          </q-item-section>
          <q-item-section>Editar Dados</q-item-section>
        </q-item>
        <q-item clickable @click="excluirRelatorio">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-trash" />
          </q-item-section>
          <q-item-section>Excluir</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useFinanceStore } from "@/stores/finance";

const $q = useQuasar();
const router = useRouter();
const store = useFinanceStore();

const showReportDialog = ref(false);
const selectedReport = ref<any>(null);
const menuRef = ref();

onMounted(() => {
  store.load();
});

function formatarData(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calcularTotalGastos(expenses: any[]) {
  return expenses.reduce((sum, expense) => sum + expense.value, 0);
}

function calcularSaldo(data: any) {
  return data.income - calcularTotalGastos(data.expenses);
}

function visualizarRelatorio(report: any) {
  selectedReport.value = report;
  showReportDialog.value = true;
}

function mostrarMenuRelatorio(report: any, event: Event) {
  selectedReport.value = report;
  menuRef.value.show();
}

function carregarDadosRelatorio() {
  if (!selectedReport.value) return;

  $q.dialog({
    title: 'Carregar Dados',
    message: 'Isso irá substituir os dados atuais pelos dados do relatório. Deseja continuar?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.loadFromReport(selectedReport.value.data);
    showReportDialog.value = false;
    
    $q.notify({
      type: 'positive',
      message: 'Dados carregados com sucesso!',
      position: 'top'
    });
    
    router.push('/controle');
  });
}

function excluirRelatorio() {
  if (!selectedReport.value) return;

  $q.dialog({
    title: 'Excluir Relatório',
    message: `Tem certeza que deseja excluir o relatório "${selectedReport.value.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteReport(selectedReport.value.id);
    
    $q.notify({
      type: 'positive',
      message: 'Relatório excluído com sucesso!',
      position: 'top'
    });
  });
}
</script>