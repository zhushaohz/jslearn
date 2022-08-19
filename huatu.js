let obj = JSON.parse($response.body || '{}');

if (obj.data) {
        obj.data = {
                "checkMember" : false,
                "isFree" : 0,
                "restDuration" : 999,
                "unit" : "天",
                "duration" : 999,
        };
}

$done({
        body: JSON.stringify(obj)
});
