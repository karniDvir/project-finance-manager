// configs/paymentConfig.ts
export const paymentConfig = {
  INCOME: {
    source: { allowNew: true, types: ["BALANCE", "LOAN", "INVESTMENT"] },
    destination: null,
  },
  EXPENSE: {
    source: { allowNew: false, types: ["BALANCE", "LOAN", "INVESTMENT"] },
    destination: { type: "BENEFICIARIES", allowNew: true },
  },
  REPAYMENT: {
    source: { allowNew: false, types: ["BALANCE", "LOAN", "INVESTMENT"] },
    destination: { type: "LOAN", allowNew: false },
  },
};
