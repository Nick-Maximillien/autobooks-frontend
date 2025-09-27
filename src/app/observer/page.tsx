'use client';

import React, { useEffect, useState } from 'react';
import BlockchainObserver from 'app/components/BlockchainObserver';
import EngineStats from 'app/components/EngineStats';

import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchObserverStats, ObserverStats } from '../../lib/api/fetchObserverStats';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from '@hello-pangea/dnd';

type ChartDatum = Record<string, string | number>;

const chartColors = ['#34d399', '#10b981', '#059669', '#047857', '#065f46'];

export default function ObserverPage() {
  const [stats, setStats] = useState<ObserverStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'bar' | 'line'>('bar');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [chartOrder, setChartOrder] = useState<string[]>([
    'diagnosis_trend',
    'farmer_growth',
    'most_diagnosed_crops',
    'crop_type_distribution',
  ]);

  useEffect(() => {
    fetchObserverStats()
      .then(setStats)
      .catch((err: Error) => {
        setError(err.message);
        setModalOpen(true);
      });
  }, []);

  function normalizeData(data: unknown[]): ChartDatum[] {
    return data.map((item) => {
      const normalized: ChartDatum = {};
      if (typeof item === 'object' && item !== null) {
        for (const [key, val] of Object.entries(item)) {
          normalized[key] =
            typeof val === 'string' || typeof val === 'number' ? val : String(val);
        }
      }
      return normalized;
    });
  }

  function toggleCollapse(id: string) {
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function renderChart(data: ChartDatum[], xKey: string, yKey: string) {
    const ChartComponent = viewType === 'bar' ? BarChart : LineChart;
    return (
      <ResponsiveContainer width="100%" height={250}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#4b5563" />
          <YAxis allowDecimals={false} stroke="#4b5563" />
          <Tooltip />
          {viewType === 'bar' ? (
            <Bar dataKey={yKey} fill="#34d399" />
          ) : (
            <Line type="monotone" dataKey={yKey} stroke="#34d399" strokeWidth={2} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  }

  function renderPieChart(data: ChartDatum[], nameKey: string) {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newOrder = Array.from(chartOrder);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setChartOrder(newOrder);
  }

  if (!stats) return <div className="observer-loading">⏳ Loading...</div>;

  return (
    <div className={`observer-container ${darkMode ? 'dark' : ''}`}>
      <h1 className="observer-title">Agrosight Observatory</h1>

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 bg-green-700 text-white rounded shadow-sm"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="observer-grid">
        <StatCard label="Farmers" value={stats.farmer_count} />
        <StatCard label="Farms" value={stats.farm_count} />
        <StatCard label="Diagnoses" value={stats.diagnosis_count} />
        <StatCard
          label="Drones Flying"
          value={`${stats.drone_flying_count} / ${stats.drone_total}`}
        />
        <StatCard label="With GPS Data" value={stats.geo_coverage_count} />
      </div>

      <div className="chart-toggle">
        {(['bar', 'line'] as const).map((type) => (
          <button
            key={type}
            className={viewType === type ? 'active' : ''}
            onClick={() => setViewType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="charts">
          {(provided: DroppableProvided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {chartOrder.map((chartId, index) => {
                const chartConfig = {
                  diagnosis_trend: {
                    title: 'Diagnosis Trend (Last 14 Days)',
                    data: stats.diagnosis_trend,
                    xKey: 'date',
                    yKey: 'count',
                    pie: false,
                  },
                  farmer_growth: {
                    title: 'Farmer Growth (Weekly)',
                    data: stats.farmer_growth,
                    xKey: 'week',
                    yKey: 'count',
                    pie: false,
                  },
                  most_diagnosed_crops: {
                    title: 'Most Diagnosed Crops',
                    data: stats.most_diagnosed_crops,
                    xKey: 'crop_type',
                    yKey: 'count',
                    pie: true,
                  },
                  crop_type_distribution: {
                    title: 'Crop Type Distribution',
                    data: stats.crop_type_distribution,
                    xKey: 'crop_type',
                    yKey: 'count',
                    pie: true,
                  },
                }[chartId];

                if (!chartConfig) return null;

                return (
                  <Draggable key={chartId} draggableId={chartId} index={index}>
                    {(provided: DraggableProvided) => (
                      <section
                        className="observer-section"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div {...provided.dragHandleProps} className="cursor-move pb-1">
                          <h2
                            className="observer-subtitle cursor-pointer"
                            onClick={() => toggleCollapse(chartId)}
                          >
                            {chartConfig.title}
                          </h2>
                        </div>
                        {!collapsed.includes(chartId) && (
                          <div className="observer-chart-box">
                            {chartConfig.data.length === 0 ? (
                              <p className="observer-empty">No data available.</p>
                            ) : chartConfig.pie ? (
                              renderPieChart(normalizeData(chartConfig.data), chartConfig.xKey)
                            ) : (
                              renderChart(
                                normalizeData(chartConfig.data),
                                chartConfig.xKey,
                                chartConfig.yKey
                              )
                            )}
                          </div>
                        )}
                      </section>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <section className="observer-section">
        <h2 className="observer-subtitle">Latest Diagnoses</h2>
        <div className="observer-diagnoses">
          {stats.latest_diagnoses.length === 0 ? (
            <p className="observer-empty">No diagnoses found.</p>
          ) : (
            stats.latest_diagnoses.map((d, i) => (
              <div key={i} className="diagnosis-card">
                <p className="diagnosis-meta">
                  <strong>{d.farmer__name}</strong> –{' '}
                  {new Date(d.timestamp).toLocaleString()}
                </p>
                <p className="diagnosis-text">{d.insight}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="observer-section">
        <h2 className="observer-subtitle">🚀 AI Engine Stats</h2>
        <EngineStats />
      </section>

      <section className="observer-section">
        <h2 className="observer-subtitle">🛰️ Blockchain Weather & Observation Feed</h2>
        <BlockchainObserver />
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md shadow-lg dark:bg-gray-900 dark:text-white">
            <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
            <p>{error}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1 bg-green-700 text-white rounded shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
