let obj = JSON.parse($response.body || '{}');

if (obj.schema) {
        obj.schema = {
                "status" : "Superseded",
                "docType" : "Standard",
                "title" : "Safety in laboratories, Part 2: Chemical aspects",
                "designation" : "AS/NZS 2243.2:2006",
                "isPreview" : true
                }
        };
}

$done({
        body: JSON.stringify(obj)
});
