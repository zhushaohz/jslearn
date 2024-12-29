let obj = JSON.parse($response.body || '{}');

if (obj.data) {
        obj.data = {
          "id": 7110,
          "createTime": "2024-12-29 13:51:04",
          "updateTime": "2024-12-29 16:01:35",
          "unionid": "e47141e0-c5a8-11ef-9561-81e5aaf7e91a",
          "avatarUrl": null,
          "nickName": "188****9313",
          "phone": "18811019313",
          "email": null,
          "gender": 0,
          "status": 1,
          "loginType": 2,
          "website": "han",
          "permissions": [
            "han:word"
          ]
    }
}

$done({
        body: JSON.stringify(obj)
});
