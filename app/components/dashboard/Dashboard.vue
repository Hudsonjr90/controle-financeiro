<template>
  <v-chart :option="chartOptions" autoresize style="height: 300px" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFinanceStore } from "@/stores/finance";
import VChart from "vue-echarts";

const store = useFinanceStore();

const chartOptions = computed(() => ({
  tooltip: { trigger: "item" },
  series: [
    {
      type: "pie",
      radius: "70%",
      data: Object.entries(store.expensesByCategory).map(
        ([name, value]) => ({ name, value })
      ),
    },
  ],
}));
</script>
