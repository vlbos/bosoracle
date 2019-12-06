const OracleProvider = require('./Provider');
const axios = require('axios');
const schedule = require("node-schedule");  

(async()=>{
    const service_id = Number(process.env.SERVICE_ID) || 0;
    const update_cycle = Number(process.env.UPDATE_CYCLE) || 0;
    const duration = Number(process.env.DURATION) ||0;
    const update_start_time = Number(process.env.UPDATE_START_TIME) || 0;
    const timer_sticker = process.env.TIMER_TICKER || '* * * * * *';
    let cache = {};

    schedule.scheduleJob(timer_sticker, async ()=>{
        let provider = new OracleProvider(service_id, update_cycle, duration, update_start_time);
        let start_time = new Date();
        let apikey = ['BZsFDXt-xXb3WFNgLQ97','TA7zFqyvXM2VYxAPGoHX'];
        const api1 = `https://www.quandl.com/api/v3/datasets/CHRIS/CME_RB1/data.json?rows=1&api_key=${apikey[0]}`;
        const api2 = `https://www.quandl.com/api/v3/datasets/LBMA/GOLD/data.json?rows=1&api_key=${apikey[0]}`;
        const api3 = "https://api.exchangeratesapi.io/latest?symbols=USD,CNY";
        // 获取数据
            const result1 = await axios.get(api1).catch(e => console.error(e));
            const result2 = await axios.get(api2).catch(e => console.error(e));
            const result3 = await axios.get(api3).catch(e => console.error(e));
            const cny = result3.data.rates.CNY;
            const usd = result3.data.rates.USD;
        // 组装数据
            const data = {
                "source":"www.quandl.com",
                "oil": result1.data.dataset_data.data[0][4] || cache.oil,
                "gold": result2.data.dataset_data.data[0][2] || cache.gold,
                "rmb": Number(usd) / Number(cny) || cache.rmb,
                "timestamp": result1.data ? new Date() : cache.timestamp
            }
            console.log(data);
        // 缓存处理
        if (!result1.data || !result3.data) {
            console.log('QUANDL Api 出问题了')
        } else {
            cache = data;
        }
            let end_time = new Date();
        // 推送数据
            await provider.start(data);
            let end_end_time = new Date();
        console.log(`QUANDL\n⏱️ 数据请求耗时:${(end_time - start_time) / 1000} s \n🚀 数据推送耗时:${(end_end_time - end_time) / 1000} s  \n🚩 总耗时:${(end_end_time - start_time)/1000} s`);
        
        });

})();