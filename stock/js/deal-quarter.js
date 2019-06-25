$(function () {
    dealQuarter.queryQuarterInfo('601998');
    dealQuarter.queryQuarterInfo('601169');
});

var dealQuarter = {
    queryQuarterInfo(stockCode) {
        $.ajax({
            url: '/getQuarterInfo',
            type: 'post',
            data: {'stockCode': stockCode},
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let priceAry = dataObj["priceRows"];
                let option = {legend: {data: ['价格', '每股收益', '市盈率', '比值']},
                    xAxis: {data: []},
                    series: [{name: '价格', data: []}, {name: '每股收益', data: []}, {name: '市盈率', data: []}, {data: []}]};
                let tmpTime ='';
                for(let i=0; i<priceAry.length; i++) {
                    let item = priceAry[i];
                    let time = item['deal_time'].trim();
                    if(time != tmpTime) {
                        option.xAxis.data.push(time);
                        tmpTime = time;
                    }
                }
                for(let i=0; i<priceAry.length; i++) {
                    let item = priceAry[i];
                    let time = item['deal_time'].trim();
                    let price = item['price_avg'];
                    let index = option.xAxis.data.indexOf(time);
                    option.series[0].data[index] = (price);
                }

                let peAry = dataObj['peRows'];
                for (let i=0; i<peAry.length; i++) {
                    let item = peAry[i];
                    let time = item['deal_time'].trim();
                    let earn = item['earn'];
                    let pe = item['pe'];
                    let index = option.xAxis.data.indexOf(time);
                    option.series[1].data[index] = (earn);
                    option.series[2].data[index] = (pe);
                }

                let percentAry = dataObj['percentRows'];
                let name = '';
                if(stockCode === '601998') {
                    name = 'zbpe'
                } else if(stockCode === '601169') {
                    name = 'bzpe';
                }
                for (let i=0; i<percentAry.length; i++) {
                    let item = percentAry[i];
                    let time = item['deal_time'].trim();
                    let percent = item[name];
                    let index = option.xAxis.data.indexOf(time);
                    option.series[3].data[index] = (percent);
                }

                if(stockCode === '601998') {
                    dealQuarter.drawChart(option, "deal-price-chart-zx");
                }else if(stockCode === '601169') {
                    dealQuarter.drawChart(option, "deal-price-chart-bj");
                }
            },
            error: function (data) {

            }
        });
    },
    drawChart(option, domId) {
        let _option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '',
            },
            legend: {
                data: ['中信/北京', '北京/中信']
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: [{
                type: 'value',
                boundaryGap: [0, '100%']
            },{
                type: 'value'
            }],
            dataZoom: [{
                type: 'slider',
                start: 0,
                end: 100
            }],
            series: [
                {
                    name:'中信/北京',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#f0f'
                    },
                    data: []
                },
                {
                    name:'每股收益',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    yAxisIndex: 1,
                    // sampling: 'average',
                    itemStyle: {
                        color: '#ff7c0a'
                    },
                    data: []
                },
                {
                    name:'北京/中信',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#00ff00'
                    },
                    data: []
                }, {
                    name:'比值',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    yAxisIndex: 1,
                    // sampling: 'average',
                    itemStyle: {
                        color: '#ff0937'
                    },
                    data: []
                }
            ]
        };

        _option = $.extend(true, _option, option);
        var chart = echarts.init(document.getElementById(domId));
        chart.setOption(_option);
    }
};


