import { defineStore } from "pinia";

interface Expense {
  name: string;
  value: number;
  category?: string;
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
  editingReport: { id: string; name: string } | null;
}

export const useFinanceStore = defineStore("finance", {
  state: (): State => ({
    income: 0 as number,
    expenses: [] as Expense[],
    reports: [] as Report[],
    editingReport: null,
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

    editExpense(index: number, expense: Expense) {
      if (index >= 0 && index < this.expenses.length) {
        this.expenses[index] = expense;
        this.save();
      }
    },

    removeExpense(index: number) {
      this.expenses.splice(index, 1);
      this.save();
    },

    saveReport(name: string) {
      if (this.editingReport) {
        const index = this.reports.findIndex(r => r.id === this.editingReport!.id);
       if (index !== -1) {
          const existingReport = this.reports[index];
          if (existingReport) {
            this.reports[index] = {
              id: existingReport.id,
              name: name,
              createdAt: existingReport.createdAt,
              data: {
                income: this.income,
                expenses: [...this.expenses]
              }
            };
          }
        }
      } else {
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
      }
      
      this.save();
    },

    clearData() {
      this.income = 0;
      this.expenses = [];
      this.editingReport = null;
      this.save();
    },

    loadFromReport(reportData: { income: number; expenses: Expense[] }, reportInfo?: { id: string; name: string }) {
      this.income = reportData.income;
      this.expenses = [...reportData.expenses];
      this.editingReport = reportInfo || null;
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
