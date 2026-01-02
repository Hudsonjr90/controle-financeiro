<template>
  <q-list bordered separator v-if="store.expenses.length">
    <q-item v-for="(item, index) in store.expenses" :key="index">
      <q-item-section>{{ item.name }}</q-item-section>

      <q-item-section side>
        {{ numberToReal(item.value) }}
      </q-item-section>

      <q-item-section side>
        <q-btn
          icon="far fa-trash-alt"
          color="negative"
          flat
          round
          size="sm"
          @click="store.removeExpense(index)"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <div v-else class="text-grey">Nenhum gasto informado</div>
</template>

<script setup lang="ts">
import { useFinanceStore } from "@/stores/finance";
import { numberToReal } from "@/utils/functions";
const store = useFinanceStore();
</script>
