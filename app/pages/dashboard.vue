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
          icon="fa-solid fa-file-pdf"
          label="Gerar PDF"
          @click="gerarPDF"
          :disable="!temDados"
        />
        <q-btn
          color="secondary"
          icon="fa-solid fa-file-csv"
          label="Exportar CSV"
          @click="exportarCSV"
          :disable="!temDados"
        />
      </div>
    </div>

    <client-only>
      <div v-if="!temDados" class="text-center q-pa-xl">
        <q-icon name="fa-solid fa-file-alt" :color="uiStore.dark ? 'white' : 'primary'" size="4em" class="q-mb-md" />
        <h6 class="text-h6 text-grey-6">Nenhum dado disponível</h6>
        <p class="text-body2 text-grey-5 q-mb-lg">
          Adicione informações de renda e gastos para visualizar os gráficos.
        </p>
        <q-btn color="primary" to="/controle" label="Criar Controle" />
      </div>

      <div v-else>
        <!-- Indicador da fonte dos dados -->
        <div v-if="dadosParaExibir.fonte === 'relatorio'" class="q-mb-md">
          <q-banner class="bg-info text-white">
            <q-icon name="fa-solid fa-info" :color="uiStore.dark ? 'white' : 'primary'" class="q-mr-sm" />
            Exibindo dados do relatório: <strong>{{ dadosParaExibir.nomeRelatorio }}</strong>
          </q-banner>
        </div>
        
        <!-- Cartões de resumo -->
        <div class="row q-gutter-md q-mb-xl">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="fa-solid fa-dollar-sign" size="2em" class="text-positive" />
                <div class="text-h6 q-mt-sm">{{ (numberToReal(dadosParaExibir.income)) }}</div>
                <div class="text-caption text-grey-6">Renda Total</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="fa-solid fa-receipt" size="2em" class="text-negative" />
                <div class="text-h6 q-mt-sm">{{ (numberToReal(totalGastos)) }}</div>
                <div class="text-caption text-grey-6">Gastos Total</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon 
                  :name="saldoCalculado >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'" 
                  size="2em" 
                  :class="saldoCalculado >= 0 ? 'text-positive' : 'text-negative'" 
                />
                <div 
                  class="text-h6 q-mt-sm"
                  :class="saldoCalculado >= 0 ? 'text-positive' : 'text-negative'"
                >
                  {{ numberToReal(saldoCalculado) }}
                </div>
                <div class="text-caption text-grey-6">Saldo</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="fa-solid fa-percent" size="2em" class="text-info" />
                <div class="text-h6 q-mt-sm">{{ percentualGasto }} %</div>
                <div class="text-caption text-grey-6">da Renda Gasta</div>
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
import { computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useFinanceStore } from "@/stores/finance";
import { useUIStore } from "@/stores/ui";
import { numberToReal } from "@/utils/functions";
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
const uiStore = useUIStore();

const temDados = computed(() => {
  const temDadosAtuais = store.income > 0 || store.expenses.length > 0;

  const temRelatorios = store.reports && store.reports.length > 0;
  
  return temDadosAtuais || temRelatorios;
});

const dadosParaExibir = computed(() => {
  const temDadosAtuais = store.income > 0 || store.expenses.length > 0;
  
  if (temDadosAtuais) {
    return {
      income: store.income,
      expenses: store.expenses,
      fonte: 'atual'
    };
  } else if (store.reports && store.reports.length > 0) {
    const ultimoRelatorio = store.reports[store.reports.length - 1];
    if (ultimoRelatorio) {
      return {
        income: ultimoRelatorio.data.income,
        expenses: ultimoRelatorio.data.expenses,
        fonte: 'relatorio',
        nomeRelatorio: ultimoRelatorio.name
      };
    }
  }
  
  return { income: 0, expenses: [], fonte: 'nenhum' };
});

const totalGastos = computed(() => {
  return dadosParaExibir.value.expenses.reduce((sum: number, expense: any) => sum + expense.value, 0);
});

const saldoCalculado = computed(() => {
  return dadosParaExibir.value.income - totalGastos.value;
});

const percentualGasto = computed(() => {
  if (dadosParaExibir.value.income === 0) return 0;
  return Math.round((totalGastos.value / dadosParaExibir.value.income) * 100);
});


const pieChartOption = computed(() => {
  const isDark = uiStore.dark;
  const textColor = isDark ? '#fff' : '#000000';
  
  const gastosAgrupados = dadosParaExibir.value.expenses.reduce((acc: any, expense: any) => {
    const categoria = expense.category || 'Outros';
    if (acc[categoria]) {
      acc[categoria] += expense.value;
    } else {
      acc[categoria] = expense.value;
    }
    return acc;
  }, {});
  
  // Converte o objeto agrupado em array para o gráfico
  const dadosGrafico = Object.entries(gastosAgrupados).map(([categoria, valor]) => ({
    value: valor,
    name: categoria
  }));
  
  return {
    title: {
      text: 'Gastos por Categoria',
      left: 'center',
      textStyle: {
        color: textColor
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: R$ {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: textColor
      }
    },
    series: [
      {
        name: 'Gastos',
        type: 'pie',
        radius: '50%',
        data: dadosGrafico,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
});


const barChartOption = computed(() => {
  const isDark = uiStore.dark;
  const textColor = isDark ? '#ffffff' : '#000000';
  const gridLineColor = isDark ? '#444444' : '#e6e6e6';
  
  return {
    title: {
      text: 'Renda vs Gastos',
      left: 'center',
      textStyle: {
        color: textColor
      }
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
      data: ['Renda', 'Gastos', 'Saldo'],
      axisLabel: {
        color: textColor
      },
      axisLine: {
        lineStyle: {
          color: textColor
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: 'R$ {value}',
        color: textColor
      },
      axisLine: {
        lineStyle: {
          color: textColor
        }
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor
        }
      }
    },
    series: [
      {
        name: 'Valor',
        type: 'bar',
        data: [
          {
            value: dadosParaExibir.value.income,
            itemStyle: { color: '#21ba45' }
          },
          {
            value: totalGastos.value,
            itemStyle: { color: '#f44336' }
          },
          {
            value: saldoCalculado.value,
            itemStyle: { 
              color: saldoCalculado.value >= 0 ? '#21ba45' : '#f44336' 
            }
          }
        ]
      }
    ]
  };
});

onMounted(() => {
  store.load();
  uiStore.load($q);
});

watch(() => uiStore.dark, () => {
}, { immediate: true });

function gerarPDF() {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de PDF em desenvolvimento...',
    position: 'top'
  });
}

function exportarCSV() {
  if (!temDados.value) return;
  
  const dados = dadosParaExibir.value;
  const csvContent = [
    ['Tipo', 'Descrição', 'Valor'],
    ['Renda', 'Renda Mensal', numberToReal(dados.income)],
    ...dados.expenses.map((expense: any) => ['Gasto', expense.name, numberToReal(expense.value)]),
    ['', 'Total Gastos', numberToReal(totalGastos.value)],
    ['', 'Saldo', numberToReal(saldoCalculado.value)]
  ]
  .map(row => row.join(','))
  .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  
  const filename = dados.fonte === 'relatorio' 
    ? `dashboard_${dados.nomeRelatorio?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    : `dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    
  link.setAttribute('download', filename);
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