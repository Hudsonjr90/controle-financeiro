<template>
  <q-page class="q-pa-md" :class="ui.dark ? 'bg-dark' : 'bg-light'">
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
        <q-icon name="fa-solid fa-file-alt" :color="ui.dark ? 'white' : 'primary'" size="4em" class="q-mb-md" />
        <h6 class="text-h6 text-grey-6">Nenhum relatório salvo</h6>
        <p class="text-body2 text-grey-5 q-mb-lg">
          Crie um controle financeiro e salve como relatório para visualizar aqui.
        </p>
        <q-btn color="primary" to="/controle" label="Criar Primeiro Controle" />
      </div>

      <div v-else >
        <div class="row q-gutter-md">
          <div 
            v-for="(report, index) in store.reports" 
            :key="index"
            class="col-12 col-xs-12 col-sm-6 col-lg-4 q-mb-md q-pa-md"
          >
            <q-card class="cursor-pointer full-width" @click="visualizarRelatorio(report)">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ report.name }}</div>
                    <div class="text-caption text-grey-6">
                      {{ formatDate(report.createdAt) }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-gutter-sm">
                  <div class="col">
                    <div class="text-body2 text-positive">
                      Renda: R$ {{ report.data.income }}
                    </div>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-negative">
                      Gastos: {{ numberToReal(calcularTotalGastos(report.data.expenses)) }}
                    </div>
                  </div>
                </div>
                <div class="text-body2 q-mt-sm" :class="calcularSaldo(report.data) >= 0 ? 'text-positive' : 'text-negative'">
                  Saldo: {{ numberToReal(calcularSaldo(report.data)) }}
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
                    Renda: {{ numberToReal(selectedReport.data.income) }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip color="negative" text-color="white" icon="fa-solid fa-receipt">
                    Gastos: {{ numberToReal(calcularTotalGastos(selectedReport.data.expenses)) }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip 
                    :color="calcularSaldo(selectedReport.data) >= 0 ? 'positive' : 'negative'" 
                    text-color="white" 
                    icon="fa-solid fa-wallet"
                  >
                    Saldo: {{ numberToReal(calcularSaldo(selectedReport.data)) }}
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
                  <q-item-section side>{{ numberToReal(expense.value) }}</q-item-section>
                </q-item>
                <q-item v-if="selectedReport.data.expenses.length === 0">
                  <q-item-section class="text-grey-6">Nenhum gasto informado</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg q-gutter-sm">
          <q-btn 
            flat 
            color="negative" 
            icon="fa-solid fa-trash" 
            label="Excluir" 
            @click="excluirRelatorio"
          />
          <q-btn 
            flat 
            color="primary-dark" 
            icon="fa-solid fa-file-pdf" 
            label="Baixar PDF" 
            @click="baixarPDFRelatorio"
          />
          <q-btn 
            flat 
            color="primary-dark" 
            icon="fa-solid fa-file-csv" 
            label="Baixar CSV" 
            @click="baixarCSVRelatorio"
          />
          <q-btn 
            flat 
            color="primary-dark" 
            icon="fa-solid fa-pen" 
            label="Editar" 
            @click="carregarDadosRelatorio"
          />
          <q-btn   
            icon="fa-solid fa-xmark" 
            label="Fechar" 
            outline
            class="bg-primary text-white"
            @click="showReportDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useFinanceStore } from "@/stores/finance";
import { useUIStore } from "@/stores/ui";
import { formatDate, numberToReal } from "@/utils/functions";

const $q = useQuasar();
const router = useRouter();
const store = useFinanceStore();
const ui = useUIStore();

const showReportDialog = ref(false);
const selectedReport = ref<any>(null);

onMounted(() => {
  store.load();
});

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

function carregarDadosRelatorio() {
  if (!selectedReport.value) return;

  $q.dialog({
    title: 'Editar Relatório',
    message: `Deseja editar o relatório "${selectedReport.value.name}"? Os dados serão carregados na página de controle para edição.`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.loadFromReport(selectedReport.value.data, { 
      id: selectedReport.value.id, 
      name: selectedReport.value.name 
    });
    showReportDialog.value = false;
    
    $q.notify({
      type: 'positive',
      message: `Dados do relatório "${selectedReport.value.name}" carregados para edição!`,
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
    
    showReportDialog.value = false;
    
    $q.notify({
      type: 'positive',
      message: 'Relatório excluído com sucesso!',
      position: 'top'
    });
  });
}

function baixarPDFRelatorio() {
  if (!selectedReport.value) return;
  
  try {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const report = selectedReport.value;
      const totalGastos = calcularTotalGastos(report.data.expenses);
      const saldo = calcularSaldo(report.data);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Relatório Financeiro', 20, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Relatório: ${report.name}`, 20, 50);
      doc.text(`Data de Criação: ${formatDate(report.createdAt)}`, 20, 60);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Resumo Financeiro', 20, 80);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Renda: R$ ${report.data.income.toFixed(2)}`, 20, 95);
      doc.text(`Total de Gastos: R$ ${totalGastos.toFixed(2)}`, 20, 105);
      
      doc.setTextColor(saldo >= 0 ? 0 : 255, saldo >= 0 ? 128 : 0, 0);
      doc.text(`Saldo: R$ ${saldo.toFixed(2)}`, 20, 115);
      doc.setTextColor(0, 0, 0); 
      
      if (report.data.expenses.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Detalhamento de Gastos', 20, 135);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        let yPosition = 150;
        report.data.expenses.forEach((expense: any, index: number) => {
          if (yPosition > 270) { 
            doc.addPage();
            yPosition = 20;
          }
          
          const categoria = expense.category ? ` (${expense.category})` : '';
          doc.text(`${index + 1}. ${expense.name}${categoria}`, 25, yPosition);
          doc.text(`R$ ${expense.value.toFixed(2)}`, 160, yPosition);
          yPosition += 10;
        });
      }
      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Gerado pelo Sistema de Controle Financeiro', 20, 290);
        doc.text(`Página ${i} de ${pageCount}`, 160, 290);
      }
      
      const fileName = `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      
      $q.notify({
        type: 'positive',
        message: 'Relatório PDF baixado com sucesso!',
        position: 'top'
      });
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao gerar PDF. Tente novamente.',
      position: 'top'
    });
  }
}

function baixarCSVRelatorio() {
  if (!selectedReport.value) return;
  
  const report = selectedReport.value;
  const csvContent = [
    ['Relatório', report.name],
    ['Data de Criação', formatDate(report.createdAt)],
    [''],
    ['Tipo', 'Descrição', 'Valor'],
    ['Renda', 'Renda Mensal', report.data.income.toFixed(2)],
    ...report.data.expenses.map((expense: any) => ['Gasto', expense.name, expense.value.toFixed(2)]),
    [''],
    ['', 'Total Gastos', calcularTotalGastos(report.data.expenses).toFixed(2)],
    ['', 'Saldo', calcularSaldo(report.data).toFixed(2)]
  ]
  .map(row => row.join(','))
  .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  $q.notify({
    type: 'positive',
    message: 'Arquivo CSV baixado com sucesso!',
    position: 'top'
  });
}
</script>