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
    where()
    
}

function where() {
    $location.fetch({
        handler: function(resp){
            var loc = resp.lat+','+resp.lng
            config.lat_lon = loc
            getlocation()
        }
    })
}
function getlocation() {
    console.log('0')
    $http.get(`http://api.map.baidu.com/reverse_geocoding/v3/?ak=vsVQld8ey3jKUkvGXOOVaUlrCgkznG2H&output=json&coordtype=wgs84ll&location=${config.lat_lon}`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.result.addressComponent.street)
        weatherInfo.city = response.data.result.addressComponent.street
        getdata()
    }, function errorCallback(response) {
        // 请求失败执行代码
        $push.schedule({
            title: 'baidumap api请求失败',
            body: response.error
        })
    });
}
function getdata() {
    console.log('1')
    $http.get(`https://api.darksky.net/forecast/${config.darksky_api}/${config.lat_lon}?lang=${config.lang}&units=si`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.hourly.summary)
        weatherInfo.summary = response.data.hourly.summary
        weatherInfo.icon = response.data.hourly.icon;
        weatherInfo.dailyInfo = response.data.daily.data[0];
        aqi()
    }, function errorCallback(response) {
        // 请求失败执行代码
        $push.schedule({
            title: 'darksky api请求失败',
            body: response.error
        })
    });
}

function info() {
    console.log('4')
    var message = {
        title: `${weatherInfo.city}  ${weatherInfo.summary}`,
        body: `${getWeatherDesc(weatherInfo.icon)} ${Math.round(weatherInfo.dailyInfo.temperatureMin)} ~ ${Math.round(weatherInfo.dailyInfo.temperatureMax)}℃  ${config.show.icon?'☔️':''}下雨概率 ${(Number(weatherInfo.dailyInfo.precipProbability) * 100).toFixed(1)}%`
    }
    var lineBreak = `
`
    if (config.show.aqi) {
        message.body += `${message.body==""?"":lineBreak}${config.show.icon?'😷':''}空气质量 ${weatherInfo.aqiInfo.aqi}(${weatherInfo.aqiInfo.aqiDesc}) ${config.show.icon?'💨':''}风速${weatherInfo.dailyInfo.windSpeed}km/h`;
    }
    if (config.show.uv) {
        message.body += `${message.body==""?"":lineBreak}${config.show.icon?'🌚':''}紫外线指数${weatherInfo.dailyInfo.uvIndex}(${getUVDesc(weatherInfo.dailyInfo.uvIndex)})`;
    }
    if (config.show.apparent) {
        message.body += `${message.body==""?"":lineBreak}${config.show.icon?'🌡':''}体感温度${Math.round(weatherInfo.dailyInfo.apparentTemperatureLow)} ~ ${Math.round(weatherInfo.dailyInfo.apparentTemperatureHigh)}℃`;
    }
    if (weatherInfo.lifestyle && weatherInfo.lifestyle.length > 0) {
        for (var item in config.show.lifestyle) {
            if (config.show.lifestyle[item]) {
                var youAreTheOne = weatherInfo.lifestyle.filter(it => it.type == item);
                if (youAreTheOne && youAreTheOne.length > 0) {
                    message.body += `${message.body==""?"":lineBreak}${config.show.icon?'💡':''}[${youAreTheOne[0].brf}]${youAreTheOne[0].txt}`
                }

            }
        }
    }
    $push.schedule(message)
}
function aqi() {
    console.log('2')
    $http.get(`https://api.waqi.info/feed/geo:${config.lat_lon.replace(/,/, ";")}/?token=${config.aqicn_api}`).then(function successCallback(response) {
        // 请求成功执行代码
        console.log(response.data.data.aqi)
        var aqi = getAqiInfo(response.data.data.aqi);
        weatherInfo.aqiInfo = {
            ...aqi
        }
        heweatherLifestyle()
    }, function errorCallback(response) {
        // 请求失败执行代码
        $push.schedule({
            title: 'aqi api请求失败',
            body: response.error
        })
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
        $push.schedule({
            title: 'heweather api请求失败',
            body: response.error
        })
    });
}


function getWeatherDesc(icon_text) {
    let icon = "❓"
    if (icon_text == "clear-day") icon = `${config.show.icon?'☀️':''}晴`;
    if (icon_text == "partly-cloudy-day") icon = `${config.show.icon?'🌤':''}晴转多云`;
    if (icon_text == "cloudy") icon = `${config.show.icon?'☁️':''}多云`;
    if (icon_text == "rain") icon = `${config.show.icon?'🌧':''}雨`;
    if (icon_text == "snow") icon = `${config.show.icon?'☃️':''}雪`;
    if (icon_text == "sleet") icon = `${config.show.icon?'🌨':''}雨夹雪`;
    if (icon_text == "wind") icon = `${config.show.icon?'🌬':''}大风`;
    if (icon_text == "fog") icon = `${config.show.icon?'🌫':''}大雾`;
    if (icon_text == "partly-cloudy-night") icon = `${config.show.icon?'🌑':''}多云`;
    if (icon_text == "clear-night") icon = `${config.show.icon?'🌑':''}晴`;
    return icon;
}

function getAqiInfo(aqi) {
    var aqiDesc = "";
    var aqiWarning = "";
    if (aqi > 300) {
        aqiDesc = `${config.show.icon?'🟤':''}严重污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止户外活动";
    } else if (aqi > 200) {
        aqiDesc = `${config.show.icon?'🟣':''}重度污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止或减少户外运动";
    } else if (aqi > 150) {
        aqiDesc = `${config.show.icon?'🔴':''}中度污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群减少户外活动";
    } else if (aqi > 100) {
        aqiDesc = `${config.show.icon?'🟠':''}轻度污染`;
        aqiWarning = "老人、儿童、呼吸系统等疾病患者减少长时间、高强度的户外活动";
    } else if (aqi > 50) {
        aqiDesc = `${config.show.icon?'🟡':''}良好`;
        aqiWarning = "极少数敏感人群应减少户外活动";
    } else {
        aqiDesc = `${config.show.icon?'🟢':''}优`;
    }
    return {
        aqi,
        aqiDesc,
        aqiWarning
    };
}

function getUVDesc(daily_uvIndex) {
    var uvDesc = "";
    if (daily_uvIndex >= 10) {
        uvDesc = "五级-特别强";
    } else if (daily_uvIndex >= 7) {
        uvDesc = "四级-很强";
    } else if (daily_uvIndex >= 5) {
        uvDesc = "三级-较强";
    } else if (daily_uvIndex >= 3) {
        uvDesc = "二级-较弱";
    } else {
        uvDesc = "一级-最弱";
    }
    return uvDesc;
}
