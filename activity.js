var axios = require('axios');

let mobile = "84982535185";
let timestamp = "2021-09-08T10:31:24.757Z";

let data = JSON.stringify({
  "activityid":"103",
  "uniqueid":"MOBILE",
  "identity": mobile,
  "activity_params":[{}],
  "timestamp": timestamp
});

var config = {
  method: 'post',
  url: 'https://api.netcoresmartech.com/v1/activity/singleactivity/ADGMOT35CHFLVDHBJNIG50K96BG9MQQALRQNNS79KODULCNC8TSG',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer 8adf223f5fe1c3b2c590d7f48da6b916'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
