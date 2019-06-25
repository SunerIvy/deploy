function setActice(no) {
    let $obj = $("ul.sidebar-menu[data-widget='tree'] > li:nth-child("+no+")");
    $obj.addClass("active");
    $obj.siblings().removeClass("active");
}

var deal = {
    queryDealData(type, stockCode) {
        $.ajax({
            url: '/getDealData',
            type: 'post',
            data: {'stockCode': stockCode || '601169', 'type': type},
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let dataAry = dataObj["dealData"];
                let option = {xAxis: {data: []}, series: [{data: []}, {data:[]}, {data:[]}, {data:[]}, {data:[]}]};
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    option.xAxis.data.push(time);
                    option.series[0].data.push(item['price_start']);
                    option.series[1].data.push(item['price_end']);
                    option.series[2].data.push(item['price_high']);
                    option.series[3].data.push(item['price_low']);
                    option.series[4].data.push(item['avg_price']);
                }
                deal.drawChart(option, "deal-price-chart");
            },
            error: function (data) {

            }
        });
    },
    queryPercentData(type) {
        $.ajax({
            url: '/getPercentData',
            type: 'post',
            data: {'type': type},
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let dataAry = dataObj["percentData"];
                let option = {xAxis: {data: []}, series: [{data: []}, {data: []}]};
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    option.xAxis.data.push(time);
                    option.series[0].data.push(item['zb_per']);
                    option.series[1].data.push(item['bz_per']);
                }
                deal.drawPeChart(option, "deal-pe-chart");
            },
            error: function (data) {

            }
        });

    },
    queryPriceEarn(type) {
        $.ajax({
            url: '/getPriceEarn',
            type: 'post',
            data: {'type': type},
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let dataAry = dataObj["priceEarnData"];
                let option = {legend: {data: ['中信银行', '北京银行']},
                    xAxis: {data: []}, series: [{name: '中信银行', data: []}, {name: '北京银行', data: []}]};
                let tmpTime ='';
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    if(time != tmpTime) {
                        option.xAxis.data.push(time);
                        tmpTime = time;
                    }
                }
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    let code = item['stock_code'];
                    let pe = item['pe'];
                    let index = option.xAxis.data.indexOf(time);
                    if(code == '601998') {
                        option.series[0].data[index] = (pe);
                    } else if(code == '601169') {
                        option.series[1].data[index] = (pe);
                    }
                }
                deal.drawPeChart(option, "deal-pe-chart");
            },
            error: function (data) {

            }
        });
    },
    queryYearEarnData() {
        $.ajax({
            url: '/getYearEarn',
            type: 'post',
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let dataAry = dataObj["yearEarn"];
                let option = {legend: {data: ['中信银行', '北京银行']},
                    xAxis: {data: []}, series: [{name: '中信银行', data: []}, {name: '北京银行', data: []}]};
                let tmpTime = '';
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['year'];
                    if(time != tmpTime) {
                        option.xAxis.data.push(time);
                        tmpTime = time;
                    }
                }

                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['year'];
                    let earn = item['earn'];
                    let code = item['stock_code'];
                    let index = option.xAxis.data.indexOf(time);
                    if(code == '601998') {
                        option.series[0].data[index] = (earn);
                    } else if(code == '601169') {
                        option.series[1].data[index] = (earn);
                    }
                }
                deal.drawPeChart(option, "deal-year-earn-chart");
            },
            error: function (data) {

            }
        });
    },
    queryPricePeEarnTotal(stockCode, type) {
        $.ajax({
            url: '/getPriceEarn',
            type: 'post',
            data: {'type': type, 'stockCode': stockCode},
            dataType: 'text',
            success: function (data) {
                let dataObj = JSON.parse(data);
                let dataAry = dataObj["priceEarnData"];
                let option = {legend: {data: ['中信银行', '北京银行']},
                    xAxis: {data: []}, series: [{name: '中信银行', data: []}, {name: '北京银行', data: []}]};
                let tmpTime ='';
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    if(time != tmpTime) {
                        option.xAxis.data.push(time);
                        tmpTime = time;
                    }
                }
                for(let i=0; i<dataAry.length; i++) {
                    let item = dataAry[i];
                    let time = item['deal_time'];
                    let code = item['stock_code'];
                    let pe = item['pe'];
                    let index = option.xAxis.data.indexOf(time);
                    if(code == '601998') {
                        option.series[0].data[index] = (pe);
                    } else if(code == '601169') {
                        option.series[1].data[index] = (pe);
                    }
                }
                deal.drawPeChart(option, "deal-pe-chart");
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
                data: ['开盘价', '收盘价', '最高价', '最低价','平均价']
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
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'slider',
                start: 0,
                end: 70
            }],
            series: [
                {
                    name:'开盘价',
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
                    name:'收盘价',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#0ff'
                    },
                    data: []
                },
                {
                    name:'最高价',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#f00'
                    },
                    data: []
                },
                {
                    name:'最低价',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#0f0'
                    },
                    data: []
                },
                {
                    name:'平均价',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#ff7c07'
                    },
                    lineStyle: {
                        type: 'dotted'
                    },
                    data: []
                }
            ]
        };

        _option = $.extend(true, _option, option);
        var chart = echarts.init(document.getElementById(domId));
        chart.setOption(_option);
    },
    drawPeChart(option, domId) {
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
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'slider',
                start: 0,
                end: 70
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
                    name:'北京/中信',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    // sampling: 'average',
                    itemStyle: {
                        color: '#00ff00'
                    },
                    data: []
                }
            ]
        };

        _option = $.extend(true, _option, option);
        var chart = echarts.init(document.getElementById(domId));
        chart.setOption(_option);
    }
}
