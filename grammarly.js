let obj = JSON.parse($response.body)
obj.isPremium = true;
obj.institutionEduPlans = [
    {
      "id" : 10201059,
      "description" : "A plan for EDU with flat pricing per seat.",
      "regularPriceMoney" : {
        "currency" : "USD",
        "value" : 50
      },
      "firstThreeMonthsPromo" : 0,
      "priceMoney" : {
        "currency" : "USD",
        "value" : 50
      },
      "regularPlanId" : 10201059,
      "baseInstitutionCampaign" : false,
      "title" : "flat_edu_plan",
      "price" : 50,
      "hasTrial" : true,
      "trialDays" : 999,
      "regularPrice" : 50,
      "periodMonths" : 12
    }
  ]
$done({body:JSON.stringify(obj)})
