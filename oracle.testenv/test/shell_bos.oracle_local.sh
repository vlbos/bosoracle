# Private key: 5JNzcBuxPGmF3Saw3cedYzE6jL7VksFayxqpjokMTRpARkCwmHa
# Public key: EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq

PUBKEY=EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq

###=============================================== 创建账号

ACCOUNTS=(
    "eosio.token" "bos.oracle" "complain1" "complain2" "complain3"  "arbitrator11" "arbitrator12" "arbitrator13" "arbitrator14" "arbitrator15"
    "provider1111"
)
for account in ${ACCOUNTS[*]}
do
    echo -e "\n creating $account \n"; 
    cleos create account eosio ${account} ${PUBKEY}; 
    sleep 1; 
done

EOS_TOKEN=eosio.token
################################################################## 发币
cleos set contract $EOS_TOKEN /bos.contracts/build/contracts/eosio.token -p $EOS_TOKEN@active
cleos push action $EOS_TOKEN create '[ "eosio.token", "10000000000.0000 EOS", 0, 0, 0]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN issue '["eosio.token", "1000000000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "complain1", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "complain2", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "complain3", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "arbitrator11", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "arbitrator12", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "arbitrator13", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "arbitrator14", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "arbitrator15", "1000.0000 EOS", ""]' -p $EOS_TOKEN
cleos push action $EOS_TOKEN transfer '["eosio.token", "bos.oracle", "1000.0000 EOS", ""]' -p $EOS_TOKEN

###=============================================== 部署合约
EOS_ORACLE=bos.oracle
cleos set contract $EOS_ORACLE /bos.contracts/contracts/bos.oracle -p $EOS_ORACLE
###=============================================== set permission
cleos set account permission $EOS_ORACLE active '{"threshold": 1,"keys": [{"key": "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq","weight": 1}],"accounts": [{"permission":{"actor":"bos.oracle","permission":"eosio.code"},"weight":1}]}' -p $EOS_ORACLE@active

###=============================================== regarbitrat, ok
cleos push action $EOS_ORACLE regarbitrat '["arbitrator11", "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq", 1, "1.0000 EOS", "hello world"]' -p arbitrator11@active
cleos push action $EOS_ORACLE regarbitrat '["arbitrator12", "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq", 1, "1.0000 EOS", "hello world"]' -p arbitrator12@active
cleos push action $EOS_ORACLE regarbitrat '["arbitrator13", "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq", 1, "1.0000 EOS", "hello world"]' -p arbitrator13@active
cleos push action $EOS_ORACLE regarbitrat '["arbitrator14", "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq", 1, "1.0000 EOS", "hello world"]' -p arbitrator14@active
cleos push action $EOS_ORACLE regarbitrat '["arbitrator15", "EOS7UCx8GSeEHC4XE8jQ1R5WJqw5Vp2vZqWgQx94obFVbebnYg6eq", 1, "1.0000 EOS", "hello world"]' -p arbitrator15@active
cleos get table $EOS_ORACLE $EOS_ORACLE arbitrators

###=============================================== regservice, ok
cleos push action $EOS_ORACLE regservice '{"service_id":0,  "account":"provider1111", "stake_amount":"10.0000 EOS", "service_price":"1.0000 EOS",
                          "fee_type":1, "data_format":"", "data_type":0, "criteria":"",
                          "acceptance":0, "declaration":"", "injection_method":0, "duration":1,
                          "provider_limit":3, "update_cycle":1, "update_start_time":"2019-07-29T15:27:33.216857+00:00"}' -p provider1111@active
cleos get table $EOS_ORACLE $EOS_ORACLE dataservices
cleos get table $EOS_ORACLE $EOS_ORACLE providers
cleos get table $EOS_ORACLE provider1111 provservices
cleos get table $EOS_ORACLE $EOS_ORACLE servicestake
cleos get table $EOS_ORACLE 0 svcprovision

###=============================================== complain 申诉, ok
cleos push action $EOS_ORACLE complain '["complain1", 0, "1.0000 EOS", "complain1", 1]' -p complain1@active
cleos get table $EOS_ORACLE $EOS_ORACLE complainants
cleos get table $EOS_ORACLE $EOS_ORACLE arbicaseapp
cleos get table $EOS_ORACLE $EOS_ORACLE arbiprocess

###=============================================== respcase 数据提供者应诉, ok
cleos push action $EOS_ORACLE respcase '["provider1111", 0, 0]' -p provider1111@active

###=============================================== resparbitrat 仲裁员应诉, ok
cleos push action $EOS_ORACLE resparbitrat '["arbitrator14", "1.0000 EOS", 0, 0]' -p arbitrator14@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator12", "1.0000 EOS", 0, 0]' -p arbitrator12@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator13", "1.0000 EOS", 0, 0]' -p arbitrator13@active

###=============================================== uploadeviden, 申诉者上传证据, ok
cleos push action $EOS_ORACLE uploadeviden '["complain1", 0, "evidence"]' -p complain1@active

###=============================================== uploadresult 仲裁员上传仲裁结果, ok
# 数据使用者赢
cleos push action $EOS_ORACLE uploadresult '["arbitrator12", 0, 1, 0]' -p arbitrator12@active
cleos push action $EOS_ORACLE uploadresult '["arbitrator13", 0, 1, 0]' -p arbitrator13@active

###=============================================== reappeal, 数据提供者再次申诉, ok
cleos push action $EOS_ORACLE reappeal '["provider1111", 0, 0, 1, 0, true, "1.0000 EOS", 1, "再次申诉"]' -p provider1111@active

###=============================================== rerespcase, 数据使用者再次应诉, ok
cleos push action $EOS_ORACLE rerespcase '["complain1", 0, 0, 0, false]' -p complain1@active

###=============================================== resparbitrat 仲裁员应诉, ok
cleos push action $EOS_ORACLE resparbitrat '["arbitrator11", "1.0000 EOS", 0, 1]' -p arbitrator11@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator12", "1.0000 EOS", 0, 1]' -p arbitrator12@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator13", "1.0000 EOS", 0, 1]' -p arbitrator13@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator14", "1.0000 EOS", 0, 1]' -p arbitrator14@active
cleos push action $EOS_ORACLE resparbitrat '["arbitrator15", "1.0000 EOS", 0, 1]' -p arbitrator15@active
###=============================================== uploadeviden, 申诉者上传证据, ok
cleos push action $EOS_ORACLE uploadeviden '["provider1111", 1, "provider1111 evidence"]' -p provider1111@active
###=============================================== uploadresult 仲裁员上传仲裁结果, ok
# 数据提供者赢
cleos push action $EOS_ORACLE uploadresult '["arbitrator11", 0, 0, 1]' -p arbitrator11@active
cleos push action $EOS_ORACLE uploadresult '["arbitrator12", 0, 0, 1]' -p arbitrator12@active
cleos push action $EOS_ORACLE uploadresult '["arbitrator13", 0, 0, 1]' -p arbitrator13@active
###=============================================== reappeal, 数据使用者再次申诉, ok
cleos push action $EOS_ORACLE reappeal '["complain1", 0, 0, 1, 1, false, "1.0000 EOS", 1, "数据使用者不服, 再次申诉"]' -p complain1@active
###=============================================== rerespcase, 数据提供者再次应诉, ok
cleos push action $EOS_ORACLE rerespcase '["provider1111", 0, 0, 1, true]' -p complain1@active
# TODO: 测试大众仲裁人数不够

cleos get table $EOS_ORACLE $EOS_ORACLE arbicaseapp
cleos get table $EOS_ORACLE $EOS_ORACLE arbiprocess
cleos get table $EOS_ORACLE $EOS_ORACLE arbiresults

###=============================================== Tables
cleos get table $EOS_ORACLE $EOS_ORACLE arbitrators
cleos get table $EOS_ORACLE $EOS_ORACLE complainants
cleos get table $EOS_ORACLE $EOS_ORACLE arbicaseapp

cleos get table $EOS_ORACLE $EOS_ORACLE dataservices
cleos get table $EOS_ORACLE 0 svcprovision
