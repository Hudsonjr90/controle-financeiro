import { defineStore } from "pinia";

interface Expense {
  name: string;
  value: number;
}

interface Report {
  id: string;
  name: string;
  createdAt: number;
  data: {
    income: number;
    expenses: Expense[];
  };
}

interface State {
  income: number;
  expenses: Expense[];
  reports: Report[];
}

export const useFinanceStore = defineStore("finance", {
  state: (): State => ({
    income: 0 as number,
    expenses: [] as Expense[],
    reports: [] as Report[],
  }),

  getters: {
    totalExpenses: (state) =>
      state.expenses.reduce((sum, e) => sum + e.value, 0),

    remaining: (state): number =>
      state.income - state.expenses.reduce((sum, e) => sum + e.value, 0),
  },

  actions: {
    load() {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("finance");
        if (data) {
          const parsed = JSON.parse(data);
          this.income = parsed.income || 0;
          this.expenses = parsed.expenses || [];
          this.reports = parsed.reports || [];
        }
      }
    },

    save() {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "finance",
          JSON.stringify({
            income: this.income,
            expenses: this.expenses,
            reports: this.reports,
          })
        );
      }
    },

    setIncome(value: number) {
      this.income = value;
      this.save();
    },

    addExpense(expense: Expense) {
      this.expenses.push(expense);
      this.save();
    },

    removeExpense(index: number) {
      this.expenses.splice(index, 1);
      this.save();
    },

    // Funções para relatórios
    saveReport(name: string) {
      const report: Report = {
        id: Date.now().toString(),
        name: name,
        createdAt: Date.now(),
        data: {
          income: this.income,
          expenses: [...this.expenses]
        }
      };
      
      this.reports.push(report);
      this.save();
    },

    clearData() {
      this.income = 0;
      this.expenses = [];
      this.save();
    },

    loadFromReport(reportData: { income: number; expenses: Expense[] }) {
      this.income = reportData.income;
      this.expenses = [...reportData.expenses];
      this.save();
    },

    deleteReport(reportId: string) {
      const index = this.reports.findIndex(r => r.id === reportId);
      if (index !== -1) {
        this.reports.splice(index, 1);
        this.save();
      }
    },
  },
});
