import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { CategoryBreakdown } from "../../types/analytics";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface CategoryPieProps {
  data: CategoryBreakdown[];
}

const CategoryPie: React.FC<CategoryPieProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: [
          "#3B82F6", // Blue
          "#10B981", // Green
          "#F59E0B", // Yellow
          "#EF4444", // Red
          "#8B5CF6", // Purple
          "#06B6D4", // Cyan
          "#F97316", // Orange
          "#84CC16", // Lime
          "#EC4899", // Pink
          "#14B8A6", // Teal
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverBorderWidth: 3,
        hoverBorderColor: "#1F2937",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
          title: function (tooltipItems: any) {
            return tooltipItems[0].label;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
      <div className="h-64 sm:h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryPie;
