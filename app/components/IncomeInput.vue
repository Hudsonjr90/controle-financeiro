<template>
  <q-input
    v-model="displayValue"
    label="Renda mensal (R$)"
    type="number"
    filled
    @update:model-value="handleIncomeUpdate"    
    class="no-spinners full-width"
    :dense="$q.screen.lt.md"
    />
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useFinanceStore } from "@/stores/finance";

const store = useFinanceStore();

const displayValue = computed({
  get: () => store.income === 0 ? '' : store.income.toString(),
  set: (value: string) => {
    const numericValue = Number(value) || 0;
    store.setIncome(numericValue);
  }
});

const handleIncomeUpdate = (value: string | number | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  store.setIncome(numericValue);
};

onMounted(() => {
  store.load();
});
</script>

<style scoped>
.no-spinners :deep(input[type="number"]::-webkit-outer-spin-button),
.no-spinners :deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinners :deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
