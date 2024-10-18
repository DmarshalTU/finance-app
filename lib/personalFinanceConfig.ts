export const personalFinanceConfig = {
    loan: {
      amount: 29529,
      monthlyPayment: 400,
      totalTermMonths: 74
    },
    income: {
      monthlySalary: 3400
    },
    expenses: {
      rentWithoutUtilities: 1300,
      rentWithUtilities: 1800,
      utilitiesBimonthly: 500
    },
    creditCards: 2,
    dependents: 1 // wife
  };
  
  export const calculateMonthlyBalance = (additionalIncome: number, additionalExpenses: number, isUtilityMonth: boolean) => {
    const totalIncome = personalFinanceConfig.income.monthlySalary + additionalIncome;
    const rent = isUtilityMonth ? personalFinanceConfig.expenses.rentWithUtilities : personalFinanceConfig.expenses.rentWithoutUtilities;
    const totalExpenses = rent + personalFinanceConfig.loan.monthlyPayment + additionalExpenses;
    
    return totalIncome - totalExpenses;
  };
  
  export const calculateRemainingLoanPayments = () => {
    const { amount, monthlyPayment, totalTermMonths } = personalFinanceConfig.loan;
    const paymentsAlreadyMade = 2;  // Assuming 2 months of payments have been made
    const remainingPayments = totalTermMonths - paymentsAlreadyMade;
    const remainingAmount = amount - (paymentsAlreadyMade * monthlyPayment);
    
    return {
      remainingPayments,
      remainingAmount
    };
  };