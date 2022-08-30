let obj = JSON.parse($response.body || '{}');

if (obj.data) {
        if(obj.data.userInfo) {
            obj.data.userInfo.vipGrade = 2;
            obj.data.userInfo.vipGradeList = [
                {
                    "vipExpire" : 0,
                    "vipGradeName" : "黄金VIP",
                    "vipGrade" : 1,
                    "remainDays" : 0,
                    "isVip" : 0
                },
                {
                    "vipExpire" : 0,
                    "vipGradeName" : "星钻VIP",
                    "vipGrade" : 2,
                    "remainDays" : 300,
                    "isVip" : 1
                }
            ];
            obj.data.userInfo.isVip = 1;
            obj.data.userInfo.vipExpire = 0;
        };
        
}

$done({
        body: JSON.stringify(obj)
});
