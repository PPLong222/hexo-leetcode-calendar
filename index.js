const { TypeCountRequest,StampCountRequest } = require("./request")
const path = require("path");
const fs = require("hexo-fs");
const  renderer  = require('./render');

const MAIN_PANEL_TEMPLATE = path.resolve(__dirname, "./templates/main_panel.html");
const style = fs.readFileSync(path.resolve(__dirname, "./templates/assets/style.css"), { encoding: "utf8" });
const script = fs.readFileSync(path.resolve(__dirname, "./templates/assets/loadPanel.js"), { encoding: "utf8" });
const { config } = hexo;
const { leetcodecalendar } = config;
// 站点配置默认变量
var subColors = ['#ebedf0', '#bef5cb', '#85e89d', '#34d058', '#1c992f'];
var submitGap = 5
var bgColor = '#fff'
var submitColor = '#000'
var isIconShowed = "none"

var typeCountRequest = new TypeCountRequest();
var stampCountRequest = new StampCountRequest();

var beforeGenParama = {}

// 加载自定义配置
function loadConfig() {
    if(leetcodecalendar != null) {
        if(leetcodecalendar.color != null) {
            bgColor = leetcodecalendar.color.bgColor ? leetcodecalendar.color.bgColor : bgColor
            subColors = leetcodecalendar.color.subColors ? leetcodecalendar.color.subColors : subColors
            submitColor = leetcodecalendar.color.submitColor ? leetcodecalendar.color.submitColor : submitColor
        }
        isIconShowed = leetcodecalendar.showIcon ? "block" : isIconShowed
        submitGap = leetcodecalendar.submitGap ? leetcodecalendar.submitGap : submitGap;
    }
    beforeGenParama = {bgColor, subColors, submitColor,isIconShowed, submitGap }
}

hexo.extend.tag.register(
    "leetcode",
    (args) => {
        loadConfig()
        return new Promise((resolve, reject) => {
            if(!args[0]) {
                return reject(args)
            }
            if(!leetcodecalendar.enable) {
                // 直接跳过
                return resolve(args)
            }
            if(leetcodecalendar.subColors != null) {
                subColors = leetcodecalendar.subColors
            }
            if(leetcodecalendar.submitGap != null) {
                submitGap = leetcodecalendar.submitGap
            }
            if(leetcodecalendar.bgColor != null) {
                bgColor = leetcodecalendar.bgColor
            }
            userName = args[0]

            typeCountRequest.request(userName).then((userInfo)=>{
                stampCountRequest.request(userName).then((stampCount)=>{
                    stampCount = JSON.stringify(stampCount)
                    renderer.render(MAIN_PANEL_TEMPLATE, {style,script, stampCount,  ...beforeGenParama, ...userInfo},(err,res)=>{
                        if(err) {
                            return reject(err)
                        }
                        resolve(res)
                    })
                })
            })
            
            

        })
    },
    {
        async: true,
    })
