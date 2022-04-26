const superagent = require('superagent');

class TypeCountRequest {

    url = 'https://leetcode-cn.com/graphql/'
    request(userName) {
        return new Promise((resolve, reject) => {
            superagent
                .post(this.url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(this.reloadData(userName)))
                .then((res) => {
                    var info = this.handleData(res.body, userName)
                    resolve({...info })
                })
                .catch((err) => {
                    console.log(err)
                    if (err.state == 404) {

                    }
                    reject(err);
                })
        })
    }

    reloadData(userName) {
        let convertData = { "operationName": "userQuestionProgress", "variables": { "userSlug": userName }, "query": "query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n      __typename\n    }\n    numFailedQuestions {\n      difficulty\n      count\n      __typename\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n      __typename\n    }\n    __typename\n  }\n}\n" };
        return convertData
    }

    handleData(data, userName) {
        let finSimple = data['data']['userProfileUserQuestionProgress']['numAcceptedQuestions'][0]['count']
        let finMedium = data['data']['userProfileUserQuestionProgress']['numAcceptedQuestions'][1]['count']
        let finHard = data['data']['userProfileUserQuestionProgress']['numAcceptedQuestions'][2]['count']
            // 先用还未做的来代替总和
        let allSimple = 0
        let allMedium = 0
        let allHard = 0
        let subDate = ""

        let keyList = Object.keys(data['data']['userProfileUserQuestionProgress'])
        for (let i = 0; i < keyList.length - 1; i++) {
            allSimple += data['data']['userProfileUserQuestionProgress'][keyList[i]][0]['count']
            allMedium += data['data']['userProfileUserQuestionProgress'][keyList[i]][1]['count']
            allHard += data['data']['userProfileUserQuestionProgress'][keyList[i]][2]['count']
        }
        let userUrl = "https://leetcode-cn.com/u/" + userName
        let info = {
            userName,
            finSimple,
            finMedium,
            finHard,
            allSimple,
            allMedium,
            allHard,
            userUrl,
            subDate
        }
        return info
    }



}
module.exports.TypeCountRequest = TypeCountRequest