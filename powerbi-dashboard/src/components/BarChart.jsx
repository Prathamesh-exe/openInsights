import React, { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";

const BarChart = memo(({ name, labels, datasets, darkMode }) => {
  const option = useMemo(() => ({
    title: {
      text: name,
      left: "center",
      textStyle: {
        color: darkMode ? "#D1D5DB" : "#374151",
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
      borderColor: darkMode ? "#4B5563" : "#E5E7EB",
      textStyle: {
        color: darkMode ? "#F3F4F6" : "#111827",
      },
    },
    legend: {
      data: datasets.map((d) => d.label),
      textStyle: {
        color: darkMode ? "#D1D5DB" : "#374151",
      },
      bottom: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        color: darkMode ? "#D1D5DB" : "#374151",
        rotate: labels.length > 5 ? 45 : 0,
        interval: 0,
      },
      axisLine: {
        lineStyle: {
          color: darkMode ? "#4B5563" : "#D1D5DB",
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: darkMode ? "#D1D5DB" : "#374151",
        formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: darkMode ? "#4B5563" : "#D1D5DB",
        },
      },
      splitLine: {
        lineStyle: {
          color: darkMode ? "#374151" : "#E5E7EB",
          type: "dashed",
        },
      },
    },
    series: datasets.map((dataset, index) => ({
      name: dataset.label,
      type: "bar",
      barWidth: "60%",
      data: dataset.data,
      itemStyle: {
        color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][index % 5],
        borderRadius: [4, 4, 0, 0],
        opacity: 0.8,
      },
      emphasis: {
        itemStyle: {
          opacity: 1,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      animationDelay: (idx) => idx * 100,
    })),
    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
    animationEasing: "elasticOut",
    animationDelayUpdate: (idx) => idx * 5,
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

BarChart.displayName = "BarChart";
export default BarChart;
