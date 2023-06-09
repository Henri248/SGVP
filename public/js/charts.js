google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawBasic1);
google.charts.setOnLoadCallback(drawBasic2);

function drawBasic1() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Vendas');

    data.addRows([
        [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9],
        [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 80]
    ]);

    var options = {
        hAxis: {
            title: 'Mês'
        },
        vAxis: {
            title: 'Quantidade de Vendas'
        },
        colors: ['#3E5BB2', '#fff', "#3E5BB2"]
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div1'));

    chart.draw(data, options);

}

function drawBasic2() {

    var wrapper = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        dataTable: [
            ['', 'Receita em reais',],
            ['2023', 8175000],
            ['2022', 3792000],
            ['2021', 2695000],
            ['2020', 2099000],
            ['2019', 1526000]
        ],
        options: {
            title: 'Receita ao longo dos Anos',
            chartArea: { width: '50%' },
            hAxis: {
                title: 'Total de Vendas',
                minValue: 0
            },
            vAxis: {
                title: 'Anos'
            },
            colors: ['#3E5BB2']
        },
        containerId: 'chart_div2'
    });

    wrapper.draw();
    /*
    var data = google.visualization.arrayToDataTable([
        ['', 'Receita em reais',],
        ['2023', 8175000],
        ['2022', 3792000],
        ['2021', 2695000],
        ['2020', 2099000],
        ['2019', 1526000]
    ]);

    var options = {
        title: 'Receita ao longo dos Anos',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Total de Vendas',
            minValue: 0
        },
        vAxis: {
            title: 'Anos'
        },
        colors: ['#3E5BB2']
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div2'));

    chart.draw(data, options);
    */
}