<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-md">Dashboard Financeiro</h4>
        <p class="text-body1 text-grey-7">
          Visualize seus dados financeiros em gráficos interativos.
        </p>
      </div>
      <div class="col-auto q-gutter-sm">
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Gerar PDF"
          @click="gerarPDF"
          :disable="!temDados"
        />
        <q-btn
          color="secondary"
          icon="file_download"
          label="Exportar CSV"
          @click="exportarCSV"
          :disable="!temDados"
        />
      </div>
    </div>

    <client-only>
      <div v-if="!temDados" class="text-center q-pa-xl">
        <q-icon name="analytics" size="4em" class="text-grey-5 q-mb-md" />
        <h6 class="text-h6 text-grey-6">Nenhum dado disponível</h6>
        <p class="text-body2 text-grey-5 q-mb-lg">
          Adicione informações de renda e gastos para visualizar os gráficos.
        </p>
        <q-btn color="primary" to="/controle" label="Criar Controle" />
      </div>

      <div v-else>
        <!-- Cartões de resumo -->
        <div class="row q-gutter-md q-mb-xl">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="account_balance_wallet" size="2em" class="text-positive" />
                <div class="text-h6 q-mt-sm">R$ {{ store.income.toFixed(2) }}</div>
                <div class="text-caption text-grey-6">Renda Total</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="receipt_long" size="2em" class="text-negative" />
                <div class="text-h6 q-mt-sm">R$ {{ store.totalExpenses.toFixed(2) }}</div>
                <div class="text-caption text-grey-6">Gastos Total</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon 
                  :name="store.remaining >= 0 ? 'trending_up' : 'trending_down'" 
                  size="2em" 
                  :class="store.remaining >= 0 ? 'text-positive' : 'text-negative'" 
                />
                <div 
                  class="text-h6 q-mt-sm"
                  :class="store.remaining >= 0 ? 'text-positive' : 'text-negative'"
                >
                  R$ {{ store.remaining.toFixed(2) }}
                </div>
                <div class="text-caption text-grey-6">Saldo</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="percent" size="2em" class="text-info" />
                <div class="text-h6 q-mt-sm">{{ percentualGasto }}%</div>
                <div class="text-caption text-grey-6">% da Renda Gasta</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="row q-gutter-lg">
          <div class="col-12 col-lg-6">
            <q-card>
              <q-card-section>
                <h6 class="text-h6 q-mt-none">Distribuição de Gastos</h6>
                <div style="height: 400px;">
                  <v-chart :option="pieChartOption" autoresize />
                </div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-lg-6">
            <q-card>
              <q-card-section>
                <h6 class="text-h6 q-mt-none">Comparativo Renda vs Gastos</h6>
                <div style="height: 400px;">
                  <v-chart :option="barChartOption" autoresize />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </client-only>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useFinanceStore } from "@/stores/finance";
// @ts-ignore
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent,
  GridComponent 
} from "echarts/components";

// Registrar componentes do ECharts
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const $q = useQuasar();
const store = useFinanceStore();

// Computed para verificar se há dados
const temDados = computed(() => {
  return store.income > 0 || store.expenses.length > 0;
});

// Percentual gasto da renda
const percentualGasto = computed(() => {
  if (store.income === 0) return 0;
  return Math.round((store.totalExpenses / store.income) * 100);
});

// Configuração do gráfico de pizza (gastos)
const pieChartOption = computed(() => ({
  title: {
    text: 'Gastos por Categoria',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: R$ {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Gastos',
      type: 'pie',
      radius: '50%',
      data: store.expenses.map(expense => ({
        value: expense.value,
        name: expense.name
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

// Configuração do gráfico de barras (comparativo)
const barChartOption = computed(() => ({
  title: {
    text: 'Renda vs Gastos',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: 'R$ {c}'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Renda', 'Gastos', 'Saldo']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: 'R$ {value}'
    }
  },
  series: [
    {
      name: 'Valor',
      type: 'bar',
      data: [
        {
          value: store.income,
          itemStyle: { color: '#21ba45' }
        },
        {
          value: store.totalExpenses,
          itemStyle: { color: '#f44336' }
        },
        {
          value: store.remaining,
          itemStyle: { 
            color: store.remaining >= 0 ? '#21ba45' : '#f44336' 
          }
        }
      ]
    }
  ]
}));

onMounted(() => {
  store.load();
});

function gerarPDF() {
  // Implementação básica - pode ser expandida
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de PDF em desenvolvimento...',
    position: 'top'
  });
}

function exportarCSV() {
  if (!temDados.value) return;
  
  const csvContent = [
    ['Tipo', 'Descrição', 'Valor'],
    ['Renda', 'Renda Mensal', store.income.toFixed(2)],
    ...store.expenses.map(expense => ['Gasto', expense.name, expense.value.toFixed(2)]),
    ['', 'Total Gastos', store.totalExpenses.toFixed(2)],
    ['', 'Saldo', store.remaining.toFixed(2)]
  ]
  .map(row => row.join(','))
  .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  $q.notify({
    type: 'positive',
    message: 'Arquivo CSV exportado com sucesso!',
    position: 'top'
  });
}
</script>