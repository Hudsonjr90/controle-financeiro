<template>
  <q-page class="q-pa-md">
    <client-only>
      <IncomeInput class="q-mb-md" />
      <ExpenseForm class="q-mb-md" />
      <ExpenseList class="q-mb-md" />
      <FinanceSummary />
    </client-only>
  </q-page>
</template>

<script setup lang="ts">
import IncomeInput from "@/components/IncomeInput.vue";
import ExpenseForm from "@/components/ExpenseForm.vue";
import ExpenseList from "@/components/ExpenseList.vue";
import FinanceSummary from "@/components/FinanceSummary.vue";
</script>
