const superagent = require('superagent');

class StampCountRequest {

    url = 'https://leetcode-cn.com/api/user_submission_calendar/'
    request(userName) {
        return new Promise((resolve, reject) => {
            superagent
                .get(this.url + userName + '/')
                .send()
                .then((res) => {
                    var info = this.handleData(res.body)
                    resolve(info)
                })
                .catch((err) => {
                    console.log(err)
                    if (err.state == 404) {

                    }
                    reject(err);
                })
        })
    }

    handleData(data) {
        return JSON.parse(data)
    }



}
module.exports.StampCountRequest = StampCountRequest