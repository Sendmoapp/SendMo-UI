import BalanceAndPrices from "@/app/components/dashboard/BalanceAndPrices";
import ConversionButton from "@/app/components/dashboard/ConversionButton";
import FinanceButton from "@/app/components/dashboard/FinanceButton";
import TransactionHistory from "@/app/components/TransactionHistory";

const DashboardPage = () => {
  return (
    <div className="w-full mx-auto p-6 space-y-6 ">
      <BalanceAndPrices />

      <FinanceButton />
      <ConversionButton />
      {/* Recent Transactions */}
      <TransactionHistory />
    </div>
  );
};

export default DashboardPage;
