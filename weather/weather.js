//jsbox darksky天气脚本
let config = {
    darksky_api: "88b1e25e39f0b0155973e73856e01bee", //从https://darksky.net/dev/ 上申请key填入即可
    aqicn_api: "9e04f99acf26822a4618a3b47f7de9cec62c4547", //从http://aqicn.org/data-platform/token/#/ 上申请key填入即可
    huweather_apiKey: "7a9e765d13294463a238655e3e48d29b", //和风天气APIkey,可自行前往 https://dev.heweather.com/ 进行获取(注意key类型选WebApi)
    lat_lon: "39.9591182,116.3158478", //请填写经纬度,直接从谷歌地图中获取即可
    lang: "zh", //语言,请不要修改
    show: {
        log: 0, //调试日志,0为不开启,1为开启,2为开启精简日志
        icon: true, //是否显示图标信息,不显示会比较精简
        aqi: true, //空气质量以及风速显示,false则不显示
        uv: true, //紫外线显示,false则不显示
        apparent: true, //体感温度显示,false则不显示
        lifestyle: { //此处用于显示各项生活指数，可自行调整顺序，顺序越在前面则显示也会靠前，如果您不想查看某一指数，置为false即可，想看置为true即可
            comf: false, //舒适度指数,
            cw: false, //洗车指数,
            drsg: true, //穿衣指数,
            flu: false, //感冒指数,
            sport: false, //运动指数,
            trav: false, //旅游指数,
            uv: false, //紫外线指数,
            air: false, //空气污染扩散条件指数,
            ac: false, //空调开启指数,
            ag: false, //过敏指数,
            gl: false, //太阳镜指数,
            mu: false, //化妆指数,
            airc: false, //晾晒指数,
            ptfc: false, //交通指数,
            fsh: false, //钓鱼指数,
            spi: false, //防晒指数
        }
    }
}
var weatherInfo = {};
weather()

function weather() {
    getdata()
}
function getdata() {
    console.log('1')
    $http.get(`https://api.darksky.net/forecast/${config.darksky_api}/${config.lat_lon}?lang=${config.lang}&units=si`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.hourly.summary)
        weatherInfo.summary = response.data.hourly.summary
        aqi()
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
}

function info() {
    console.log('4')
    $push.schedule({
        title: `${weatherInfo.city}${weatherInfo.summary}`,
        body: weatherInfo.summary
    })
}
function aqi() {
    console.log('2')
    $http.get(`https://api.waqi.info/feed/geo:${config.lat_lon.replace(/,/, ";")}/?token=${config.aqicn_api}`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.data.city.name)
        weatherInfo.city = response.data.data.city.name
        heweatherLifestyle()
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
}
function heweatherLifestyle() {
    console.log('3')
    $http.get(`https://free-api.heweather.net/s6/weather/lifestyle?location=${config.lat_lon}&key=${config.huweather_apiKey}`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.HeWeather6[0].lifestyle)
        weatherInfo.lifestyle = response.data.HeWeather6[0].lifestyle;
        info()
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
}