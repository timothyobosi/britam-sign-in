// ==============================|| INVOICE - TOTAL REVENUE BAR CHART ||============================== //

const chartData = {
    height: 286,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        },
        xaxis: {
            type: 'category',
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        legend: {
            show: false,
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: [
        {
            name: 'Investment',
            data: [2, 2.3, 2.5, 2.3, 2, 2.3, 2.7]
        },
        {
            name: 'Loss',
            data: [1.8, 2.3, 1.8, 2.5, 2.3, 1.8, 2.5]
        }
    ]
};
export default chartData;
