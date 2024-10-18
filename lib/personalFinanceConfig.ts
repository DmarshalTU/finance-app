export const personalFinanceConfig = {
    loan: {
      amount: 29529,
      monthlyPayment: 400,
      totalTermMonths: 74  // Assuming this is a 6-year loan (72 months) plus 2 months already paid
    },
    income: {
      monthlySalary: 3400
    },
    expenses: {
      rent: 1300,
      utilities: 500
    },
    creditCards: 2,
    dependents: 1 // wife
  };
  
  export const calculateMonthlyBalance = () => {
    const totalIncome = personalFinanceConfig.income.monthlySalary;
    const totalExpenses = 
      personalFinanceConfig.expenses.rent + 
      personalFinanceConfig.expenses.utilities + 
      personalFinanceConfig.loan.monthlyPayment;
    
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