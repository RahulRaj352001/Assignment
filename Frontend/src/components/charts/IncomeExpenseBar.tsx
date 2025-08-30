import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { IncomeExpense } from "../../types/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseBarProps {
  data: IncomeExpense[];
}

const IncomeExpenseBar: React.FC<IncomeExpenseBarProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const labels = data.map((item) => {
      const date = new Date(item.month + "-01");
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    });

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: data.map((item) => item.income),
          backgroundColor: "#10B981",
          borderColor: "#059669",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: "Expenses",
          data: data.map((item) => item.expense),
          backgroundColor: "#EF4444",
          borderColor: "#DC2626",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Amount ($)",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense</h3>
      <div className="h-64 sm:h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default IncomeExpenseBar;
