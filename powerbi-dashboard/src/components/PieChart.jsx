import React, { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";

const PieChart = memo(({ name, labels, datasets, darkMode }) => {
  const option = useMemo(() => ({
    title: {
      text: name,
      left: "center",
      textStyle: {
        color: darkMode ? "#D1D5DB" : "#374151",
        fontSize: 14,
        fontWeight: 'bold'
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
      textStyle: {
        color: darkMode ? '#F3F4F6' : '#111827'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        color: darkMode ? "#D1D5DB" : "#374151",
      },
    },
    series: [{
      name: name,
      type: "pie",
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: darkMode ? '#1F2937' : '#FFFFFF',
        borderWidth: 2
      },
      label: {
        show: true,
        color: darkMode ? "#D1D5DB" : "#374151",
        formatter: '{b}: {c} ({d}%)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: labels.map((label, index) => ({
        name: label,
        value: datasets[0].data[index],
        itemStyle: {
          color: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
          ][index % 5],
        }
      })),
    }],
    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
    animationEasing: 'elasticOut',
  }), [name, labels, datasets, darkMode]);

  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <ReactECharts 
        option={option} 
        style={{ height: "400px", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
});

PieChart.displayName = 'PieChart';
export default PieChart;