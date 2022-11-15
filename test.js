var axios = require('axios');
var qs = require('qs');
var data = qs.stringify({
 'data': '{"FIRST_NAME":"Cuong", "LAST_NAME": "Tran", "EMAIL":"cuong.tran@akadigital.net","MOBILE": "84982535185", "ZALO_OA_NAME": "CUONG TRAN", "ZALO_FOLLOWED_AT": "2021-09-02"}' 
});
var config = {
  method: 'post',
  url: 'http://api.netcoresmartech.com/apiv2?type=contact&activity=add&apikey=8adf223f5fe1c3b2c590d7f48da6b916',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
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
