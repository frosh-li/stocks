const moment = require('moment');
let data = {"data":{"symbol":"SZ000609","column":["timestamp","volume","open","high","low","close","chg","percent","turnoverrate","amount","volume_post","amount_post","pe","pb","ps","pcf","market_capital","balance","hold_volume_cn","hold_ratio_cn","net_volume_cn","hold_volume_hk","hold_ratio_hk","net_volume_hk"],"item":[[1198771200000,41967606,20.3922,35.4765,18.9225,34.5083,13.7079,65.9,61.18,2.2829259560099998E9,null,null,76.4536,16.0117,21.2403,39.189,1.03588193895E10,null,null,null,null,null,null,null],[1201708800000,51641791,35.2531,38.0038,25.2233,25.7199,-8.7863,-25.46,72.19,3.45052359608E9,null,null,54.3156,11.5381,16.241,19.0626,7.7206740198E9,null,null,null,null,null,null,null],[1204214400000,40943043,25.7596,30.8787,23.838,28.3465,2.6281,10.22,41.57,2.23565937737E9,null,null,59.8626,12.7164,17.8996,21.0094,8.50913667549E9,null,null,null,null,null,null,null],[1206892800000,46092445,29.0962,31.0823,20.9582,22.9046,-5.4386,-19.19,46.83,2.41394140388E9,null,null,15.6626,6.8078,4.9792,16.7352,6.87557321493E9,null,null,null,null,null,null,null],[1209484800000,90862493,22.84,30.2663,19.2651,29.8688,6.966,30.42,65.4,3.1625927627999997E9,null,null,20.4127,8.9052,6.4893,21.8105,8.96075139132E9,null,null,null,null,null,null,null],[1212076800000,225963944,30.4054,34.0123,25.1292,25.5664,-4.295,-14.38,114.77,6.718847698549999E9,null,null,17.4723,7.6225,5.5545,18.6688,7.66999778106E9,null,null,null,null,null,null,null],[1214755200000,181971238,25.5664,26.4706,13.1161,16.6534,-8.9144,-34.87,92.44,3.27606826403E9,null,null,11.9909,5.0451,3.6175,17.7717,4.99608094872E9,null,null,null,null,null,null,null],[1217433600000,262970571,16.7925,21.6117,15.8983,18.2432,1.5918,9.56,133.55,5.032217554620001E9,null,null,13.1357,5.5267,3.9629,19.4683,5.47303378392E9,null,null,null,null,null,null,null],[1219939200000,105369061,17.7762,19.2568,11.9237,12.7385,-5.5036,-30.17,53.53,1.54405989225E9,null,null,9.1721,3.859,2.7671,13.5939,3.82158459204E9,null,null,null,null,null,null,null],[1222358400000,108649929,12.5497,12.6192,7.5517,9.8669,-2.8713,-22.54,55.2,1.0575388527499999E9,null,null,7.1044,2.9891,2.1433,10.5294,2.96008853346E9,null,null,null,null,null,null,null],[1225382400000,118840945,9.5688,9.5688,5.6638,5.6836,-4.1838,-42.4,60.36,9.883093750500001E8,null,null,6.1106,1.8338,1.5486,15.0232,1.70510638584E9,null,null,null,null,null,null,null],[1227801600000,210284804,5.6936,8.4459,4.998,7.0747,1.3917,24.49,106.78,1.4721817069099998E9,null,null,7.6063,2.2826,1.9276,18.7003,2.12244011664E9,null,null,null,null,null,null,null],[1230652800000,263282096,7.0548,10.0855,6.9356,7.5616,0.4871,6.89,133.69,2.3260546246899996E9,null,null,16.3581,2.8188,3.4612,-52.3914,2.26850692242E9,null,null,null,null,null,null,null],[1232640000000,98162890,7.7007,9.0421,7.7007,8.6049,1.0416,13.77,49.84,8.390788914899999E8,null,null,18.6151,3.2078,3.9387,-59.6201,2.58150722052E9,null,null,null,null,null,null,null],[1235664000000,319356740,8.6049,12.6987,8.4459,9.4098,0.805,9.36,150.52,3.48262572322E9,null,null,20.3563,3.5078,4.3071,-65.1966,2.82296459334E9,null,null,null,null,null,null,null],[1238428800000,234065159,9.3402,12.6689,9.2707,12.0429,2.6319,27.97,107.92,2.66456327206E9,null,null,-18.4544,4.4542,3724.6575,377.6841,3.61291772664E9,null,null,null,null,null,null,null],[1241020800000,247855227,12.1224,13.1955,9.9364,10.6021,-1.441,-11.97,114.27,3.0239160556900005E9,null,null,-16.2465,3.9213,3279.0507,332.4991,3.18067921974E9,null,null,null,null,null,null,null],[1243353600000,153280394,10.7015,12.2814,10.5326,11.0791,0.4788,4.52,70.68,1.75685990871E9,null,null,-16.9774,4.0977,3426.5619,347.4569,3.3237650703E9,null,null,null,null,null,null,null],[1246204800000,249547441,11.3275,12.9173,11.1586,12.3211,1.242,11.21,115.03,3.03999425271E9,null,null,-18.8807,4.5571,3810.7056,386.4094,3.6963844728E9,null,null,null,null,null,null,null],[1248969600000,388519118,12.1324,15.1033,12.1224,13.3744,1.0531,8.55,179.09,5.453096520089999E9,null,null,-22.5984,4.9368,380.4014,388.2188,4.01236572612E9,null,null,null,null,null,null,null],[1251648000000,155766595,13.4042,13.8712,9.211,9.2607,-4.1144,-30.76,71.81,1.85407223742E9,null,null,-15.6476,3.4184,263.3983,268.8113,2.77825026504E9,null,null,null,null,null,null,null],[1254240000000,133220141,9.2409,11.2381,9.1812,9.5588,0.2981,3.22,61.42,1.3854425380199997E9,null,null,-25.5105,3.5083,246.8367,-610.046,2.86767892164E9,null,null,null,null,null,null,null],[1256832000000,171373338,9.7675,12.6789,9.6284,11.9138,2.3568,24.66,78.99,1.9374915333100004E9,null,null,-31.7953,4.3726,307.6479,-760.338,3.57416530878E9,null,null,null,null,null,null,null],[1259510400000,254991031,11.5759,15.1033,11.3374,13.1757,1.2636,10.61,117.55,3.47573832288E9,null,null,-35.1631,4.8357,340.2344,-840.8742,3.95274662172E9,null,null,null,null,null,null,null],[1262188800000,127777708,13.0862,14.2091,11.248,11.9336,-1.2471,-9.46,58.93,1.67038294542E9,null,null,241.036,4.368,244.8184,-795.5615,3.58012721922E9,null,null,null,null,null,null,null],[1264694400000,85746534,11.9336,12.1721,10.2941,10.7611,-1.1715,-9.82,39.25,9.942970696199999E8,null,null,217.3539,3.9389,220.7647,-717.3964,3.22837450326E9,null,null,null,null,null,null,null],[1267113600000,38338898,10.632,11.4269,9.9364,11.248,0.4876,4.53,13.19,4.2278097358000004E8,null,null,227.188,4.1171,230.7531,-749.8548,3.37444130904E9,null,null,null,null,null,null,null],[1269964800000,72626248,11.2381,11.7051,10.6816,11.5163,0.2679,2.38,24.95,8.280695639199998E8,null,null,455.5799,4.2199,194.6139,-257.388,3.45492709998E9,null,null,null,null,null,null,null],[1272556800000,71065954,11.5262,12.1224,9.2409,9.4396,-2.0776,-18.04,24.42,7.810485010899999E8,null,null,373.4261,3.459,159.5196,-210.9738,2.831907459E9,null,null,null,null,null,null,null],[1275235200000,42277603,9.3402,9.539,7.4523,7.82,-1.6202,-17.16,14.51,3.575852544699999E8,null,null,309.3541,2.8655,132.1494,-174.7751,2.34601175814E9,null,null,null,null,null,null,null],[1277827200000,53388690,7.81,9.0322,7.5318,7.661,-0.1589,-2.03,18.36,4.4868119241999996E8,null,null,55.0888,2.6898,203.5329,-104.9342,2.29831647462E9,null,null,null,null,null,null,null],[1280419200000,62646680,7.651,9.1415,7.5318,9.0223,1.3608,17.76,21.53,5.2660553254999995E8,null,null,64.8777,3.1677,239.6989,-123.5801,2.70670733976E9,null,null,null,null,null,null,null],[1283184000000,105331384,9.0123,9.9364,8.5652,8.9825,-0.0413,-0.46,36.22,9.796507865200001E8,null,null,64.5919,3.1538,238.643,-123.0357,2.69478351888E9,null,null,null,null,null,null,null],[1285776000000,63855006,8.9726,9.1415,8.0087,8.3466,-0.636,-7.08,21.97,5.6106906135E8,null,null,63.8844,3.1804,170.6953,120.7369,2.5040023848E9,null,null,null,null,null,null,null],[1288281600000,75263795,8.3863,9.062,8.1578,8.8533,0.5082,6.09,25.87,6.603521954200001E8,null,null,67.7631,3.3735,181.059,128.0674,2.65603110102E9,null,null,null,null,null,null,null],[1291046400000,233438634,8.8235,11.6653,8.6745,10.2643,1.413,15.96,80.25,2.3805094900800004E9,null,null,78.5626,3.9111,209.9146,148.4777,3.07932674226E9,null,null,null,null,null,null,null],[1293724800000,127799403,10.3339,11.407,8.6049,8.903,-1.3558,-13.22,43.95,1.31726424948E9,null,null,36.2781,3.2416,28.1375,-10.8688,2.67093587712E9,null,null,null,null,null,null,null],[1296403200000,70541007,8.9428,9.5787,8.4062,9.539,0.6357,7.14,24.25,6.398126403000001E8,null,null,38.8694,3.4731,30.1473,-11.6452,2.8617170112E9,null,null,null,null,null,null,null],[1298822400000,47276719,9.539,9.7576,8.903,9.1912,-0.3471,-3.64,16.26,4.4293971756E8,null,null,37.4523,3.3465,29.0482,-11.2206,2.7573835785E9,null,null,null,null,null,null,null],[1301500800000,91994818,9.2011,10.1153,9.062,9.8072,0.617,6.71,31.62,8.8514876654E8,null,null,44.0787,3.6048,30.6688,279.9193,2.94220280214E9,null,null,null,null,null,null,null],[1304006400000,156264124,9.8967,12.3907,9.5787,11.5064,1.6987,17.32,53.73,1.7476419376899998E9,null,null,51.7154,4.2294,35.9822,328.416,3.45194614476E9,null,null,null,null,null,null,null],[1306771200000,136744167,11.4865,13.4141,10.5823,11.3176,-0.1869,-1.62,46.99,1.6654966514499998E9,null,null,50.8669,4.16,35.3918,323.0274,3.39530799558E9,null,null,null,null,null,null,null],[1309276800000,63640715,11.1288,11.4865,9.9066,10.6618,-0.6538,-5.78,21.86,6.916398555400001E8,null,null,47.9193,3.9189,33.341,304.3094,3.19856495106E9,null,null,null,null,null,null,null],[1314720000000,64058686,11.7051,11.7051,9.8569,10.006,-0.6552,-6.15,22.0,6.901592489E8,null,null,14.7377,3.0356,31.7944,1028.0985,3.00182190654E9,null,null,null,null,null,null,null],[1317312000000,38126702,10.0358,10.1649,8.2075,8.4261,-1.5804,-15.79,13.1,3.5626008884000003E8,null,null,13.2249,2.5835,28.158,-56.6658,2.52785002656E9,null,null,null,null,null,null,null],[1319990400000,57309513,8.4956,9.5588,8.3565,9.0719,0.6454,7.66,19.67,5.239632539899999E8,null,null,14.2386,2.7815,30.3163,-61.0093,2.72161211586E9,null,null,null,null,null,null,null],[1322582400000,106896327,9.0322,9.7973,8.5552,8.6844,-0.3883,-4.28,36.74,9.814811294199998E8,null,null,13.6304,2.6627,29.0213,-58.4032,2.60535486228E9,null,null,null,null,null,null,null],[1325174400000,71805503,8.9825,9.4793,6.25,6.5382,-2.1458,-24.71,24.66,5.8943615882E8,null,null,10.2618,2.0046,21.849,-43.9694,1.96146853476E9,null,null,null,null,null,null,null],[1327939200000,35959870,6.6375,7.1741,5.9618,6.7965,0.2586,3.96,12.37,2.4062008559E8,null,null,12.3415,2.0613,257.8495,5.184,2.03897337048E9,null,null,null,null,null,null,null],[1330444800000,110285794,6.7568,8.5751,6.7568,7.7901,0.9918,14.59,37.91,8.522332555000001E8,null,null,14.1458,2.3626,295.5468,5.9419,2.33706889248E9,null,null,null,null,null,null,null],[1333036800000,105154566,7.7504,8.128,6.8661,7.1244,-0.6676,-8.57,36.13,8.123419213600001E8,null,null,12.9369,2.1607,270.2896,5.4341,2.13734489274E9,null,null,null,null,null,null,null],[1335456000000,101576460,7.1045,8.7242,6.9356,8.0286,0.9047,12.7,34.93,8.134979200699999E8,null,null,12.8353,2.426,370.4694,12.4713,2.40861181776E9,null,null,null,null,null,null,null],[1338393600000,69176649,8.1379,8.3466,7.1542,8.0286,0.0015,0.02,23.78,5.466837318E8,null,null,12.8353,2.426,370.4694,12.4713,2.40861181776E9,null,null,null,null,null,null,null],[1340899200000,119378702,8.0684,8.4459,7.0052,7.1741,-0.8548,-10.65,41.03,9.642046798600001E8,null,null,11.4692,2.1678,331.0383,11.1439,2.15224966884E9,null,null,null,null,null,null,null],[1343664000000,33008836,7.194,7.3828,6.0215,6.0215,-1.1523,-16.06,11.33,2.1958106149E8,null,null,66.1373,1.8004,234.4195,7.138,1.80645886332E9,null,null,null,null,null,null,null],[1346342400000,27167862,6.0215,6.568,5.5147,5.5843,-0.4365,-7.25,9.34,1.6616403455999997E8,null,null,61.3353,1.6697,217.399,6.6198,1.67529683364E9,null,null,null,null,null,null,null],[1348761600000,34338697,5.5942,5.9022,5.4054,5.6836,0.0991,1.77,11.79,1.9608651923999998E8,null,null,62.4266,1.6994,221.2673,6.7376,1.70510638584E9,null,null,null,null,null,null,null],[1351612800000,30083729,5.6836,6.1506,5.5147,5.6141,-0.068,-1.2,10.34,1.743579626E8,null,null,45.1601,1.6824,156.9078,4.8603,1.6842396993E9,null,null,null,null,null,null,null],[1354204800000,93824494,5.6041,6.5282,5.0477,5.2365,-0.3767,-6.71,32.27,5.6093310321E8,null,null,42.1228,1.5693,146.3547,4.5335,1.57096340094E9,null,null,null,null,null,null,null],[1356883200000,125045820,5.2365,6.6475,5.0079,6.4388,1.2032,22.98,42.98,7.755189562399999E8,null,null,22.8415,1.8151,11.5698,10.886,1.93165898256E9,null,null,null,null,null,null,null],[1359561600000,93725631,6.4984,6.8362,6.0612,6.2997,-0.1393,-2.16,32.23,6.0593158762E8,null,null,22.348,1.7759,11.3198,10.6508,1.88992560948E9,null,null,null,null,null,null,null],[1361980800000,38342583,6.3096,6.8462,6.2401,6.5083,0.2087,3.31,13.17,2.5041332191E8,null,null,23.0883,1.8347,11.6947,11.0036,1.9525256691E9,null,null,null,null,null,null,null],[1364486400000,45089822,6.5382,6.558,5.6141,5.7134,-0.795,-12.21,15.5,2.6830492345000005E8,null,null,20.2683,1.6106,10.2664,9.6597,1.7140492515E9,null,null,null,null,null,null,null],[1366905600000,23031450,5.7134,6.0115,5.4948,5.5246,-0.1884,-3.3,7.93,1.3483443384E8,null,null,25.2091,1.5659,9.9285,12.2553,1.65741110232E9,null,null,null,null,null,null,null],[1369929600000,46366409,5.5147,6.7568,5.4948,6.409,0.8841,16.0,15.94,2.8807624553000003E8,null,null,29.2444,1.8166,11.5177,14.217,1.9227161169E9,null,null,null,null,null,null,null],[1372348800000,25285453,6.4487,6.6176,5.0179,5.3855,-1.0236,-15.97,8.69,1.5271236776E8,null,null,24.5744,1.5265,9.6785,11.9467,1.61567772924E9,null,null,null,null,null,null,null],[1375200000000,22226638,5.465,5.7432,5.1769,5.465,0.0803,1.49,7.63,1.2343634113E8,null,null,37.9249,1.5665,9.9166,9.7014,1.639525371E9,null,null,null,null,null,null,null],[1377792000000,71223338,5.4352,7.502,5.4352,7.0847,1.6179,29.6,24.48,4.621307255999999E8,null,null,49.1645,2.0308,12.8555,12.5766,2.12542107186E9,null,null,null,null,null,null,null],[1380470400000,66936744,7.3033,8.3863,6.8859,8.3366,1.2533,17.69,23.0,5.1046419904E8,null,null,66.0515,2.4073,15.3134,20.0465,2.50102142958E9,null,null,null,null,null,null,null],[1383148800000,50247110,8.3764,8.7937,6.8959,7.4523,-0.8845,-10.61,17.27,4.0127331442E8,null,null,59.0448,2.1519,13.6889,17.92,2.235716415E9,null,null,null,null,null,null,null],[1385654400000,41735990,7.4523,8.0485,7.2834,7.4821,0.0282,0.38,14.36,3.237708160899999E8,null,null,59.281,2.1605,13.7437,17.9916,2.24465928066E9,null,null,null,null,null,null,null],[1388419200000,32666603,7.3529,7.502,6.4587,6.9952,-0.4881,-6.52,11.22,2.3130554922E8,null,null,20.1719,1.8085,6.6844,24.6317,2.09859247488E9,null,null,null,null,null,null,null],[1391011200000,38043803,6.9654,8.4559,6.5382,8.0485,1.0524,15.04,13.08,2.8100160634E8,null,null,23.2091,2.0808,7.6909,28.3405,2.4145737282E9,null,null,null,null,null,null,null],[1393516800000,56916383,7.9889,9.2707,7.8001,8.2075,0.158,1.96,19.56,4.8859503690999997E8,null,null,23.6676,2.1219,7.8428,28.9003,2.46226901172E9,null,null,null,null,null,null,null],[1396195200000,50861374,8.2174,9.5191,8.0584,8.3764,0.1681,2.05,17.49,4.5784790762999994E8,null,null,23.5982,2.1718,7.8527,27.0636,2.51294525046E9,null,null,null,null,null,null,null],[1398787200000,32565608,8.3764,8.8235,7.3033,7.4722,-0.9036,-10.79,11.2,2.7099480983000004E8,null,null,21.0508,1.9374,7.005,24.1421,2.24167832544E9,null,null,null,null,null,null,null],[1401379200000,17645766,7.4722,8.0286,7.3331,7.6411,0.1686,2.26,6.06,1.3655546263E8,null,null,21.5267,1.9812,7.1634,24.6879,2.29235456418E9,null,null,null,null,null,null,null],[1404057600000,56680664,7.6014,9.3899,7.4523,8.8037,1.1612,15.19,19.5,4.7601262262000006E8,null,null,23.0452,2.29,8.1557,36.7546,2.64112632492E9,null,null,null,null,null,null,null],[1406736000000,56042569,8.7937,9.1216,8.3168,8.7937,-0.0087,-0.1,19.28,4.873966668E8,null,null,23.0192,2.2874,8.1465,36.7131,2.6381453697E9,null,null,null,null,null,null,null],[1409241600000,113725993,8.6944,11.2778,8.5453,9.8172,1.0233,11.64,39.09,1.1075496204499998E9,null,null,25.6983,2.5536,9.0946,40.9859,2.94518375736E9,null,null,null,null,null,null,null],[1412006400000,492115601,9.837,16.3851,9.6979,14.1296,4.3125,43.93,169.15,6.83241947391E9,null,null,31.5806,3.6372,12.6271,1311.7152,4.23891832284E9,null,null,null,null,null,null,null],[1414684800000,201628074,14.1892,15.1133,12.9273,13.3744,-0.7552,-5.34,69.31,2.8291705207800007E9,null,null,29.8928,3.4428,11.9522,1241.6094,4.01236572612E9,null,null,null,null,null,null,null],[1417104000000,164238628,13.3744,14.2886,11.8442,13.752,0.3769,2.82,56.46,2.1694559023500004E9,null,null,30.7367,3.54,12.2896,1276.6623,4.12564202448E9,null,null,null,null,null,null,null],[1417363200000,17978845,13.6427,14.4972,13.5135,13.7818,0.0303,0.22,6.18,2.5300465737E8,null,null,30.8033,3.5477,12.3163,1279.4296,4.13458489014E9,null,null,null,null,null,null,null],[1422547200000,33110811,14.9046,16.1169,14.0203,14.0302,0.2483,1.8,11.39,5.0260425063E8,null,null,34.9552,3.286,6.8034,168.2054,4.20910877064E9,null,null,null,null,null,null,null],[1424966400000,151326088,13.3446,15.4114,12.5994,13.8514,-0.1772,-1.26,52.02,2.1071865647000003E9,null,null,34.5096,3.2441,6.7167,166.0611,4.15545157668E9,null,null,null,null,null,null,null],[1427731200000,414462344,13.9209,19.8629,13.7122,18.0147,4.1656,30.08,142.46,7.34853451195E9,null,null,45.2597,4.2336,8.7,-120.8008,5.40447181386E9,null,null,null,null,null,null,null],[1430323200000,297925965,17.9054,22.039,17.3887,18.6208,0.6118,3.4,102.41,5.831901232690001E9,null,null,46.7825,4.376,8.9928,-124.8652,5.58631008228E9,null,null,null,null,null,null,null],[1432828800000,327422370,18.3824,22.8537,16.0771,19.5946,0.9736,5.23,112.51,6.462107003800001E9,null,null,49.2289,4.6049,9.463,-131.395,5.87844369384E9,null,null,null,null,null,null,null],[1435593600000,355839653,19.5946,24.9503,12.7186,14.7953,-4.8015,-24.5,122.31,7.56226478488E9,null,null,35.9267,3.4759,7.0519,-106.8811,4.43864232258E9,null,null,null,null,null,null,null],[1438272000000,384814703,14.3482,14.8748,7.0847,10.0258,-4.7688,-32.23,132.26,4.23919419439E9,null,null,24.3452,2.3554,4.7786,-72.4265,3.00778381698E9,null,null,null,null,null,null,null],[1440950400000,378139552,9.9463,12.7683,8.6745,12.5099,2.4848,24.79,129.98,4.2072320311899996E9,null,null,30.3772,2.939,5.9626,-90.3716,3.75302262198E9,null,null,null,null,null,null,null],[1443542400000,638585502,11.715,15.2921,9.9463,12.5099,0.0026,0.02,219.51,8.399007268330001E9,null,null,32.152,2.9273,5.9607,323.0197,3.75302262198E9,null,null,null,null,null,null,null],[1446134400000,445940309,13.0068,16.5242,12.7683,14.4674,1.9552,15.63,153.29,6.670576316140001E9,null,null,37.183,3.3853,6.8933,373.5637,4.34027080032E9,null,null,null,null,null,null,null],[1448812800000,380834042,13.9209,16.9913,12.5199,13.6924,-0.779,-5.38,130.92,5.872628434839999E9,null,null,35.191,3.204,6.5241,353.5514,4.10775629316E9,null,null,null,null,null,null,null],[1451491200000,212778704,13.5135,16.564,13.0465,15.1133,1.4255,10.41,73.14,3.1650179255800004E9,null,null,198.8438,3.4847,9.972,141.3162,4.53403288962E9,null,null,null,null,null,null,null],[1453996800000,111323759,15.0537,15.0735,8.9428,9.3502,-5.7633,-38.13,38.25,1.23837657261E9,null,null,123.0191,2.1559,6.1694,87.4283,2.80507886202E9,null,null,null,null,null,null,null],[1456675200000,91914811,9.3601,11.4269,9.1514,9.37,0.021,0.22,31.6,9.814215868700001E8,null,null,123.2805,2.1605,6.1825,87.6142,2.81104077246E9,null,null,null,null,null,null,null],[1459353600000,146688066,9.4197,11.3871,9.37,11.1387,1.7695,18.89,50.41,1.5564107722400002E9,null,null,101.1047,2.5567,7.5263,317.7598,3.34165080162E9,null,null,null,null,null,null,null],[1461859200000,173809729,11.0592,13.6824,10.7512,13.0664,1.9272,17.3,59.74,2.18610596994E9,null,null,118.6019,2.919,8.8288,372.7513,3.9199561143E9,null,null,null,null,null,null,null],[1464624000000,85966575,13.0664,13.752,9.9463,11.4269,-1.637,-12.53,29.56,1.0157141858600001E9,null,null,103.7203,2.5528,7.721,325.9802,3.428098503E9,null,null,null,null,null,null,null],[1467216000000,131849230,11.4269,13.4638,11.3573,12.7484,1.3193,11.54,45.36,1.6605028939600003E9,null,null,23.1054,2.7469,8.8752,-204.4938,3.82456554726E9,null,null,null,null,null,null,null],[1469721600000,109236245,12.7882,15.163,12.4603,13.3148,0.5655,4.44,38.26,1.5385559473100002E9,null,null,24.1319,2.8689,9.2695,-213.5789,3.9944799948E9,null,null,null,null,null,null,null],[1472572800000,107345282,13.4141,14.3084,12.6689,14.1991,0.8855,6.65,37.83,1.4744877135100005E9,null,null,25.7347,3.0594,9.8852,-227.7643,4.25978500938E9,null,null,null,null,null,null,null],[1474560000000,67626084,14.2091,14.8947,13.1161,14.219,0.0175,0.12,23.84,9.5411720498E8,null,null,25.7707,3.0637,9.899,-228.0831,4.26574691982E9,null,null,null,null,null,null,null],[1480435200000,266799625,15.6399,19.6045,15.6399,16.4944,2.2735,15.99,94.03,4.73270261095E9,null,null,33.69,3.5379,11.8733,-150.8132,4.9483856652E9,null,null,null,null,null,null,null],[1483027200000,395878568,16.405,18.5711,14.9145,15.8486,-0.6429,-3.9,139.69,6.66320707827E9,null,null,32.3708,3.3994,11.4084,-144.9079,4.7546235759E9,null,null,null,null,null,null,null],[1485360000000,201936518,15.9082,18.3724,15.6995,16.9118,1.0662,6.73,71.17,3.4809618642699995E9,null,null,38.1148,3.5264,38.5828,-156.6417,5.07358578444E9,null,null,null,null,null,null,null],[1488211200000,163235010,16.9118,19.6443,16.3951,18.7997,1.8886,11.17,57.53,2.9812602283699994E9,null,null,42.3696,3.92,42.8899,-174.1282,5.63996727624E9,null,null,null,null,null,null,null],[1490889600000,136194760,18.7003,20.7472,17.2496,17.3986,-1.3986,-7.44,48.07,2.6614623356999993E9,null,null,30.7923,3.5083,15.9432,-1050.8228,5.21965259022E9,null,null,null,null,null,null,null],[1493308800000,59081173,17.9849,18.0843,14.5866,16.1268,-1.2747,-7.33,20.86,9.826079352999998E8,null,null,28.5413,3.2518,14.7778,-974.0065,4.83809032206E9,null,null,null,null,null,null,null],[1496160000000,43312595,16.1268,16.4845,13.2949,13.5433,-2.5848,-16.03,15.3,6.631769912099998E8,null,null,23.9691,2.7309,12.4104,-817.9734,4.06304196486E9,null,null,null,null,null,null,null],[1498752000000,42546087,13.7122,15.3517,13.2651,14.7854,1.2421,9.17,14.9,6.2800869324E8,null,null,37.705,2.8122,13.063,-63.1695,4.45247576736E9,null,null,null,null,null,null,null],[1501430400000,52263178,14.7953,15.7492,13.8613,15.153,0.367,2.48,18.13,7.8286737555E8,null,null,38.6426,2.8821,13.3878,-64.7402,4.5631892105E9,null,null,null,null,null,null,null],[1503244800000,19519755,15.153,15.1828,14.2091,14.9344,-0.2205,-1.45,6.75,2.8910307158E8,null,null,38.0851,2.8405,13.1947,-63.8063,4.49735959566E9,null,null,null,null,null,null,null],[1506614400000,112192960,16.4249,16.4249,14.05,14.16,-0.7773,-5.2,38.89,1.7497199494399998E9,null,null,35.8866,2.7281,12.433,-60.1229,4.23774139152E9,null,null,null,null,null,null,null],[1509379200000,45376196,14.4,14.62,13.0,13.24,-0.92,-6.5,15.73,6.314309746200001E8,null,null,30.3717,2.5409,10.8221,-46.5313,3.96240791128E9,null,null,null,null,null,null,null],[1511971200000,53677367,13.24,13.33,10.51,11.09,-2.15,-16.24,18.67,6.355767107099999E8,null,null,25.4397,2.1283,9.0648,-38.9753,3.31896553898E9,null,null,null,null,null,null,null],[1514476800000,36835171,11.04,11.36,10.16,10.78,-0.31,-2.8,12.7,3.9341268582E8,null,null,24.7286,2.0688,8.8114,-37.8858,3.22619012716E9,null,null,null,null,null,null,null],[1517328000000,67538823,10.81,12.09,10.5,10.5,-0.28,-2.6,24.71,7.599578081000001E8,null,null,23.3812,1.9932,11.5861,-7.2994,3.142392981E9,null,null,null,null,null,null,null],[1519747200000,38399305,10.48,10.63,8.1,8.9,-1.6,-15.24,14.02,3.4038586881E8,null,null,19.8183,1.6895,9.8206,-6.1871,2.6635521458E9,null,null,null,null,null,null,null],[1522339200000,52077520,8.87,9.76,8.34,9.17,0.27,3.03,18.93,4.8048131788E8,null,null,20.4195,1.7407,10.1185,-6.3748,2.74435653674E9,null,null,null,null,null,null,null],[1524758400000,62315030,9.18,9.86,8.71,8.92,-0.25,-2.73,22.77,5.736326627600001E8,null,null,32.9228,1.7052,33.62,-3.4613,2.66953765624E9,null,null,null,null,null,null,null],[1527696000000,54259458,8.9,9.25,8.4,8.7,-0.22,-2.47,19.81,4.8336978808E8,null,null,32.1108,1.6631,32.7908,-3.3759,2.6036970414E9,null,null,null,null,null,null,null],[1530201600000,74488314,8.69,8.75,5.86,6.19,-2.51,-28.85,27.48,5.2143983085E8,null,null,22.8467,1.1833,23.3304,-2.402,1.85251548118E9,null,null,null,null,null,null,null],[1532966400000,83896121,6.17,6.82,5.65,5.89,-0.3,-4.85,28.52,5.1836023962E8,null,null,376.1591,1.1223,24.4959,-1.6322,1.76273282458E9,null,null,null,null,null,null,null],[1535644800000,62659247,5.91,5.95,5.39,5.63,-0.26,-4.41,20.71,3.5067705302000004E8,null,null,359.5544,1.0728,23.4146,-1.5602,1.68492118886E9,null,null,null,null,null,null,null],[1538064000000,58722064,5.55,5.69,5.1,5.2,-0.43,-7.64,19.73,3.149825573E8,null,null,332.0929,0.9908,21.6263,-1.441,1.5562327144E9,null,null,null,null,null,null,null],[1540915200000,91840804,5.11,5.12,3.94,4.8,-0.4,-7.69,30.91,4.1174350918E8,null,null,265.1743,0.9149,28.7295,-1.064,1.4365225056E9,null,null,null,null,null,null,null],[1543507200000,407817418,5.28,7.03,5.1,5.62,0.82,17.08,137.77,2.4349134717999997E9,null,null,310.4749,1.0711,33.6375,-1.2457,1.68192843364E9,null,null,null,null,null,null,null],[1545926400000,197571540,5.76,6.5,5.19,5.25,-0.37,-6.58,66.42,1.12594428245E9,null,null,290.0344,1.0006,31.4229,-1.1637,1.5711964905E9,null,null,null,null,null,null,null],[1548864000000,127447420,5.26,5.59,4.48,4.54,-0.71,-13.52,42.96,6.59999937E8,null,null,-22.3473,0.8964,46.0679,-1.0254,1.35866546988E9,null,null,null,null,null,null,null],[1551283200000,183974499,4.56,6.29,4.54,6.15,1.61,35.46,62.18,1.035670387E9,null,null,-30.2722,1.2142,62.4048,-1.389,1.8404829603E9,null,null,null,null,null,null,null],[1553788800000,347316547,6.15,7.32,5.8,6.34,0.19,3.09,116.95,2.270118425E9,null,null,-31.2074,1.2518,64.3327,-1.4319,1.89734340948E9,null,null,null,null,null,null,null],[1556553600000,241596591,6.36,7.78,5.5,5.61,-0.73,-11.51,81.43,1.644805203E9,null,null,-21.7574,1.128,45.8501,-1.8391,1.67887957842E9,null,null,null,null,null,null,null],[1559232000000,75222273,5.5,5.68,5.13,5.3,-0.31,-5.53,25.49,4.05222589E8,null,null,-20.5551,1.0657,43.3165,-1.7375,1.5861072666E9,null,null,null,null,null,null,null],[1561651200000,142654234,5.32,5.94,4.8,5.35,0.05,0.94,48.16,7.70000036E8,0,0.0,-20.749,1.0504,43.7252,-1.7538,1.6010705427E9,null,null,null,null,null,null,null],[1564502400000,62687610,5.41,5.6,4.86,4.93,-0.42,-7.85,21.46,3.2407769E8,0,0.0,-12.8857,1.0132,42.3637,-2.5421,1.47537902346E9,null,null,null,null,null,null,null],[1567094400000,70843688,4.93,5.27,4.31,4.68,-0.25,-5.07,24.27,3.2819131E8,0,0.0,-12.2323,0.9619,40.2154,-2.4132,1.40056264296E9,null,null,null,null,null,null,null],[1569772800000,163419224,4.7,5.82,4.5,4.55,-0.13,-2.78,55.97,8.49540029E8,0,0.0,-11.8925,0.9351,39.0983,-2.3461,1.3616581251E9,null,null,null,null,null,null,null],[1572451200000,81459274,4.58,5.26,4.49,4.51,-0.04,-0.88,27.88,3.93540094E8,0,0.0,-10.129,0.94,41.76902088448624,-3.7842862094927026,1.349687504E9,null,null,null,null,null,null,null],[1574784000000,183894172,4.5,6.88,4.02,6.63,2.12,47.01,62.95,1.047342464E9,null,null,-14.463,1.381,61.40323914164598,-5.563152455609004,1.984130411E9,null,null,null,null,null,null,null]]},"error_code":0,"error_description":""}

data.data.item.forEach(item => {
    console.log('时间',moment(item[0]).format("YYYY-MM-DD"), item[13]);
})