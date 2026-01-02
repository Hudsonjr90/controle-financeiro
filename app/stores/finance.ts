import { defineStore } from "pinia";

interface Expense {
  name: string;
  value: number;
}

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    income: 0 as number,
    expenses: [] as Expense[],
  }),

  getters: {
    totalExpenses: (state) =>
      state.expenses.reduce((sum, e) => sum + e.value, 0),

    remaining: (state): number =>
      state.income - state.expenses.reduce((sum, e) => sum + e.value, 0),
  },

  actions: {
    load() {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem("finance");
        if (data) {
          Object.assign(this, JSON.parse(data));
        }
      }
    },

    save() {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          "finance",
          JSON.stringify({
            income: this.income,
            expenses: this.expenses,
          })
        );
      }
    },

    setIncome(value: number) {
      this.income = value;
      this.save();
    },

    addExpense(expense: { name: string; value: number; }) {
      this.expenses.push(expense);
      this.save();
    },

    removeExpense(index: number) {
      this.expenses.splice(index, 1);
      this.save();
    },
  },
});