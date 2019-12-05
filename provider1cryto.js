const OracleProvider = require('./Provider');
const schedule = require("node-schedule");  
const CoinGecko = require('coingecko-api');

(async()=>{
    const service_id = Number(process.env.SERVICE_ID) || 0;
    const update_cycle = Number(process.env.UPDATE_CYCLE) || 0;
    const duration = Number(process.env.DURATION) ||0;
    const update_start_time = Number(process.env.UPDATE_START_TIME) || 0;
    const timer_sticker = process.env.TIMER_TICKER || '* * * * * *';
    
    schedule.scheduleJob(timer_sticker, async ()=>{
        let provider = new OracleProvider(service_id, update_cycle, duration, update_start_time);
        let start_time = new Date();
        let CoinGeckoClient = new CoinGecko();

        const sourceData = await CoinGeckoClient.simple.price({
            vs_currencies: 'usd',
            ids: ['bitcoin', 'ethereum', 'eos', 'boscore'],
        });
        
 
        // 组装数据
            const data = {
                "source":"CoinGecko",
                "eos": sourceData.data.eos.usd ,
                "ethereum": sourceData.data.ethereum.usd ,
                "bitcoin": sourceData.data.bitcoin.usd ,
                "boscore": sourceData.data.boscore.usd,
                "timestamp": new Date() 
            }
            console.log(data);
    
            let end_time = new Date();
        // 推送数据
            await provider.start(data);
            let end_end_time = new Date();
        console.log(`CoinGecko\n⏱️ 数据请求耗时:${(end_time - start_time) / 1000} s \n🚀 数据推送耗时:${(end_end_time - end_time) / 1000} s  \n🚩 总耗时:${(end_end_time - start_time)/1000} s`);
        
        });

})();