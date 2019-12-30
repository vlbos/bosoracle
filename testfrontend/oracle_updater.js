const Eos = require('eosjs');
const dotenv = require('dotenv');
//const axios = require('axios');
const request = require('request');
//Helpers
const CoinGecko = require('./lib/CoinGecko');
let sleep = require('sleep');
// var request = require('request'); // https://www.npmjs.com/package/request
let async = require('async'); // https://www.npmjs.com/package/async
// https://api.coincap.io/v2/rates/bitcoin
const eosUrl = "https://api.coincap.io/v2/rates/eos";
const bitcoinUrl = "https://api.coincap.io/v2/rates/bitcoin";
const ethereumUrl = "https://api.coincap.io/v2/rates/ethereum";
//"https://min-api.cryptocompare.com/data/price?fsym=EOS&tsyms=BTC,USD";
const btcUrl = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,CAD";
const btccnyUrl = "https://blockchain.info/ticker";

const oilUrl = "https://www.quandl.com/api/v3/datasets/CHRIS/CME_RB1/data.json?rows=1&api_key=BZsFDXt-xXb3WFNgLQ97";
const goldUrl = "https://www.quandl.com/api/v3/datasets/LBMA/GOLD/data.json?rows=1&api_key=BZsFDXt-xXb3WFNgLQ97";
// const rmbUrl = "https://www.mycurrency.net/CN.json";
const rmbUrl = "https://api.exchangeratesapi.io/latest?symbols=USD,CNY";

dotenv.load();

const interval = process.env.FREQ;
const owner = process.env.ORACLE;
const oracleContract = process.env.CONTRACT;

const oraclize = "oraclebosbos";
const consumer = "consumer1234";
const oracle = "oracleoracle";

const eos = Eos({
	httpEndpoint: process.env.EOS_PROTOCOL + "://" + process.env.EOS_HOST + ":" + process.env.EOS_PORT,
	keyProvider: [process.env.EOS_KEY, '5JhNVeWb8DnMwczC54PSeGBYeQgjvW4SJhVWXMXW7o4f3xh7sYk', '5JBqSZmzhvf3wopwyAwXH5g2DuNw9xdwgnTtuWLpkWP7YLtDdhp', '5JCtWxuqPzcPUfFukj58q8TqyRJ7asGnhSYvvxi16yq3c5p6JRG', '5K79wAY8rgPwWQSRmyQa2BR8vPicieJdLCXL3cM5Db77QnsJess', "5K2L2my3qUKqj67KU61cSACoxgREkqGFi5nKaLGjbAbbRBYRq1m", "5JN8chYis1d8EYsCdDEKXyjLT3QmpW7HYoVB13dFKenK2uwyR65", "5Kju7hDTh3uCZqpzb5VWAdCp7cA1fAiEd94zdNhU59WNaQMQQmE", "5K6ZCUpk2jn1munFdiADgKgfAqcpGMHKCoJUue65p99xKX9WWCW", "5KAyefwicvJyxDaQ1riCztiSgVKiH37VV9JdSRcrqi88qQkV2gJ"],
	chainId: process.env.EOS_CHAIN,
	verbose: false,
	logger: {
		log: null,
		error: null
	}
});


const require_permissions = ({ account, key, actor, parent }) => {
	return {
		account: `${account}`,
		permission: "active",
		parent: `${parent}`,
		auth: {
			threshold: 1,
			keys: [
				{
					key: `${key}`,
					weight: 1
				}
			],
			accounts: [
				{
					permission: {
						actor: `${actor}`,
						permission: "eosio.code"
					},
					weight: 1
				}
			],
			waits: []
		}
	};
};

const allowContract = (auth, key, contract, parent) => {
	let [account, permission] = auth.split("@");
	permission = permission || "active";
	parent = parent || "owner";

	const tx_data = {
		actions: [
			{
				account: "eosio",
				name: "updateauth",
				authorization: [
					{
						actor: account,
						permission: permission
					}
				],
				data: require_permissions({
					account: account,
					key: key,
					actor: contract,
					parent: parent
				})
			}
		]
	};

	return tx_data;
};

// const pub = "EOS89PeKPVQG3f48KCX2NEg6HDW7YcoSracQMRpy46da74yi3fTLP";
// eos.transaction(allowContract(consumer, pub, consumer));
//   await oraclizeContract.setup(oraclizeAccount, oracle, masterAccount, {
// 	authorization: [oraclizeAccount]
//   });

// function sleep(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms))
//   }

// function* sleep(ms) {
// 	yield new Promise(function (resolve, reject) {
// 		//console.log(new Date());
// 		setTimeout(resolve, ms);
// 	})
// }


// class Person(name){
// 	this.name=name;
// 	let f=function(){alert('My name is '+this.name)};


// 	 ff(){
// 		 //console.log("ff");
// 	 //console.log(new Date());
// 	 sleep.sleep(1);
// 	 //console.log(new Date());
// 	}
// 	// setTimeout(f,50); //错误

// 	let THIS=this;
// 	setTimeout(function(){ff.apply(THIS)},50); //正确，通用
// 	// setTimeout(function(){ff.call(THIS)},50); //正确，通用
// }
// new Person('Jack');



// function sleep(ms) {
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }
function test() {
	// let temple = await sleep(1000);
	// //console.log(new Date());
	// return temple
	//console.log(new Date());
	sleep.sleep(1);
	//console.log(new Date());
}
// test();


function find_from_array(arr) {
	let newArr = arr.filter(function (p) {
		return p.name === "United States";
	});

	return newArr;
}

function repeat(str, n) {
	return new Array(n + 1).join(str);
}

function current_time() {
	return Date.parse(new Date()) / 1000;
}

function to_timestamp(time) {
	return Date.parse(new Date(time)) / 1000;
}

const request_id = 0;

// const service_id = 1;
// const update_cycle = 120;
// const duration = 30;
// const update_start_time = "2019-09-16 09:09:09";
class OracleTimer {
	constructor(timer_type, service_id, update_cycle, duration, update_start_time) {
		this.timer_type = timer_type;
		this.service_id = service_id;
		this.update_cycle = update_cycle;
		this.duration = duration;
		this.update_start_time = update_start_time;
	}

	pushdatax(cycle_number, data, begin, end) {
		let timer_type = this.timer_type;
		let service_id = this.service_id;

		eos.contract(oracleContract)
			.then((contract) => {
				// sleep.sleep(2);
				for (let i = begin; i <= end; i++) {
					let provider = "provider" + repeat(i, 4);
					console.log("$$$$push===", i, "Date.parse(new Date()) =", (new Date()));
					contract.pushdata({
						service_id: this.service_id,
						provider: provider,
						cycle_number: cycle_number,
						request_id: request_id,
						data: "" + JSON.stringify(data)
					},
						{
							scope: oracleContract,
							authorization: [`${provider}@${process.env.ORACLE_PERMISSION || 'active'}`]
						})
						.then(results => {
							// //console.log("results:", results);
							console.log("$$$$push result===", i, "Date.parse(new Date()) =", (new Date()));
						})
						.catch(error => {
							console.log("error:", error);
						});
					console.log(new Date(), "provider=", provider, "cycle_number=", cycle_number);
					console.log("timer_type=", timer_type, "service_id=", service_id);
					// sleep.sleep(2);
					// console.log(new Date());
				}

			})
			.catch(error => {
				//console.log("error:", error);
			});
	}

	write(cycle_number, retrytimes = 1) {
		let THIS = this;
		console.log("####coin====", new Date());
		
		request.get(eosUrl, function (err, res, eosRes) {
			console.log("####eos====", new Date());
			request.get(ethereumUrl, function (err, res, ethereumRes) {
				console.log("####ethereum====", new Date());
				request.get(bitcoinUrl, function (err, res, bitcoinRes) {
					console.log("####bitcoin====", new Date());

					try {
						let eosprice = JSON.parse(eosRes).data.rateUsd;
						let newdata = {
							"eos": JSON.parse(eosRes).data.rateUsd,
							"ethereum": JSON.parse(ethereumRes).data.rateUsd,
							"bitcoin": JSON.parse(bitcoinRes).data.rateUsd,
							"boscore": 0
						}
						//console.log("EOSUSDeosprice:", newdata);

						THIS.pushdatax(cycle_number, newdata, 1, 2);
					}
					catch (err) {
						console.log("Error name: " + err.name + "");
						console.log("Error message: " + err.message);
						if (retrytimes < 3) {
							try {
								write(cycle_number, retrytimes + 1);
							} catch (err1) {
							}
						}
					}

				});
			});
		});

	}



	writeusd(cycle_number, retrytimes = 1) {
		let THIS = this;
		console.log("****usd====", new Date());
	
		request.get(oilUrl, function (err, res, oilRes) {
			console.log("****oil====", new Date());
			request.get(goldUrl, function (err, res, goldRes) {
				console.log("****gold====", new Date());
				request.get(rmbUrl, function (err, res, rmbRes) {
					console.log("****rmb====", new Date());
					try {
						console.log("GOLDUSD:", goldRes);
						console.log("GOLDUSD:", JSON.parse(goldRes).dataset_data);
						let cny = JSON.parse(rmbRes).rates.CNY;
						let usd = JSON.parse(rmbRes).rates.USD;
						let newdata = {
							"oil": JSON.parse(oilRes).dataset_data.data[0][4],
							"gold": JSON.parse(goldRes).dataset_data.data[0][2],
							// "rmb": arr[0].rate,
							"rmb": Number(usd) / Number(cny),
						}
						//console.log("EOSUSDeosprice:", newdata);

						THIS.pushdatax(cycle_number, newdata, 1, 5);

					}
					catch (err) {
						console.log("Error name: " + err.name + "");
						console.log("Error message: " + err.message);
						if (retrytimes < 3) {
							try {
								writeusd(cycle_number, retrytimes + 1);
							}
							catch (err) {

							}
						}
					}

				});
			});
		});

	}

	test_bos(cycle_number, retrytimes = 1) {
		let CoinGeckoClient = new CoinGecko();

		CoinGeckoClient.simple.price({
			vs_currencies: 'usd',
			ids: ['bitcoin', 'ethereum', 'eos', 'boscore'],
		}).then((data) => {
			this.data = data;
			try {
				let newdata = {
					"eos": data.data.eos.usd,
					"ethereum": data.data.ethereum.usd,
					"bitcoin": data.data.bitcoin.usd,
					"boscore": data.data.boscore.usd
				}
				this.pushdatax(cycle_number, newdata, 3, 5);
				//console.log(newdata);
			}
			catch (err) {
				console.log("Error name: " + err.name + "");
				console.log("Error message: " + err.message);
				if (retrytimes < 3) {
					try {
						test_bos(cycle_number, retrytimes + 1);
					}
					catch (err) {

					}
				}
			}

		});
	}


	start_timer() {
		let update_start_timestamp = this.update_start_time;//1570758862;
		//to_timestamp(update_start_time) + 8 * 3600;
		//console.log(" update_start_timestamp", update_start_timestamp);
		let now_sec = current_time();
		let cycle_number = Math.floor((now_sec - update_start_timestamp) / this.update_cycle + 1);
		let begin_time = update_start_timestamp + (cycle_number - 1) * this.update_cycle;
		let end_time = begin_time + this.duration;
		let next_begin_time = update_start_timestamp + (cycle_number) * this.update_cycle;
		if (now_sec >= begin_time && now_sec < end_time) {
			if ("coin" == this.timer_type) {
				this.write(cycle_number);
				this.test_bos(cycle_number);
			}
			else {
				this.writeusd(cycle_number);
			}
			// console.log(update_start_timestamp," now_sec", now_sec);///1575541593
		}
		else {
			//console.log(" (next_begin_time-now_sec)*1000", (next_begin_time - now_sec) * 1000);
		}

		let THIS = this;
		let TIMER = function () { this.start_timer(); };
		setInterval(function () { TIMER.apply(THIS) }, (next_begin_time - now_sec) * 1000);
	}


}

// start_timer();
function start_coin_timer() {
	const service_id = 1;
	const update_cycle = 120;
	const duration = 30;
	const update_start_time = 1575860670;
	let timer = new OracleTimer("coin", service_id, update_cycle, duration, update_start_time);
	timer.start_timer();
	// timer.write(1);
}

// start_coin_timer();
function start_usd_timer() {
	const service_id = 2;
	const update_cycle = 120;
	const duration = 30;
	const update_start_time = 1575860677;
	let timer = new OracleTimer("usd", service_id, update_cycle, duration, update_start_time);
	timer.start_timer();
	// timer.writeusd(1);

}
// start_usd_timer();



let myLoaderQueue = []; // passed to async.parallel
		// let myUrls = [oilUrl, goldUrl, rmbUrl]; // 1000+ urls here
		var myUrls = [eosUrl, bitcoinUrl, ethereumUrl]; // 1000+ urls here
		var myTags = ["eos", "ethereum", "bitcoin"]; // 1000+ urls here

		for (let i = 0; i < myUrls.length; i++) {
			myLoaderQueue.push(function (callback) {

				// Async http request
				// request(myUrls[i], function (error, response, html) {

				// 	// Some processing is happening here before the callback is invoked
				// 	callback(error, html);
				// });
				request.get(myUrls[i], function (err, res, jsonRes) {
					console.log(myUrls[i],"####====", new Date());

					try {
						let price = JSON.parse(jsonRes).data.rateUsd;
						let tag = myTags[i];
						let newData={};
						newData[tag] = price;
						// let newdata = {
						// 	"eos": JSON.parse(eosRes).data.rateUsd,
						// 	"ethereum": JSON.parse(ethereumRes).data.rateUsd,
						// 	"bitcoin": JSON.parse(bitcoinRes).data.rateUsd,
						// 	"boscore": 0
						// }
						// //console.log("EOSUSDeosprice:", newdata);

						// THIS.pushdatax(cycle_number, newdata, 1, 2);
						callback(err,newData)
					}
					catch (err) {
						console.log("Error name: " + err.name + "");
						console.log("Error message: " + err.message);
						let price = "0";
						let tag = myTags[i];
						let newData={};
						newData[tag] = price;
						callback(err,newData)
					}

				});
			});
		}

		// The loader queue has been made, now start to process the queue
		async.parallel(myLoaderQueue, function (err, results) {
			// Done
			console.log(results);
		});


			// an example using an object instead of an array
			async.parallel({
				oil: function (callback) {
					// setTimeout(function () {
					// 	callback(null, 1);
					// }, 200);
					let url = oilUrl;
					request.get(url, function (err, res, jsonRes) {
						console.log("****====", new Date());
						try {
							let price = JSON.parse(jsonRes).dataset_data.data[0][4];
							callback(err,price);
						}
						catch (err) {
							console.log("Error name: " + err.name + "");
							console.log("Error message: " + err.message);
							callback(err,"0");
						}
	
					});
				},
				gold: function (callback) {
					let url = goldUrl;
					request.get(url, function (err, res, jsonRes) {
						console.log("****====", new Date());
						try {
						let price = JSON.parse(jsonRes).dataset_data.data[0][2];
							callback(err,price);
						}
						catch (err) {
							console.log("Error name: " + err.name + "");
							console.log("Error message: " + err.message);
							callback(err,"0");
						}
	
					});
				},
				rmb: function (callback) {
					let url = rmbUrl;
					request.get(url, function (err, res, jsonRes) {
						console.log("****====", new Date());
						try {
							let cny = JSON.parse(jsonRes).rates.CNY;
							let usd = JSON.parse(jsonRes).rates.USD;
							let price = Number(usd) / Number(cny);
							callback(err,price);
						}
						catch (err) {
							console.log("Error name: " + err.name + "");
							console.log("Error message: " + err.message);
							callback(err,"0");
						}
						});
				}
			}, function (err, results) {
				// results is now equals to: {one: 1, two: 2}
				console.log(results);
			});