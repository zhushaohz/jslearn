let obj = JSON.parse($response.body || '{}');

if (obj.subscriber) {
        obj.subscriber.subscriptions = {
                "com.lishaohui.cashflow.yearlysubscription" : {
                        "is_sandbox" : false,
                        "ownership_type" : "PURCHASED",
                        "billing_issues_detected_at" : null,
                        "period_type" : "normal",
                        "expires_date" : "2025-03-06T00:04:32Z",
                        "grace_period_expires_date" : null,
                        "unsubscribe_detected_at" : null,
                        "original_purchase_date" : "2022-03-06T00:04:33Z",
                        "purchase_date" : "2022-03-06T00:04:32Z",
                        "store" : "app_store"
                }
        };
        obj.subscriber.entitlements = {
		            "Premium" : {
                        "grace_period_expires_date" : null,
                        "purchase_date" : "2022-03-06T00:04:32Z",
                        "product_identifier" : "com.lishaohui.cashflow.yearlysubscription",
                        "expires_date" : "2023-03-06T00:04:32Z"
                }
	      };
}

$done({
        body: JSON.stringify(obj)
});
