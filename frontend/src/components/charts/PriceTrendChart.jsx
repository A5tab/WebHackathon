import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PriceTrendChart = ({ data, lineColor = '#4CAF50' }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', ''], // Empty labels for cleaner look
                datasets: [{
                    data: data,
                    borderColor: lineColor,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0 // Hide points
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, lineColor]);

    return (
        <div style={{ width: '100%', height: '30px' }}>
            <canvas ref={chartRef} />
        </div>
    );
};

export default PriceTrendChart;