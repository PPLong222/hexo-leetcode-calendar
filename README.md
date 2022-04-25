# Hexo-LeetCode-Calendar

A Hexo plugin for quickly overviewing your leetcode submission data with customizable option to be imporved.(Only support [leetcode-cn.com](https://leetcode-cn.com))
<div style="display: inline;">
<img height="20" src="https://img.shields.io/badge/Build-Hexo-blue?logo=Hexo&style=flat&logoColor=3686F0&color=3686F0">
<img height="20" src="https://img.shields.io/badge/Build-JavaScript-blue?logo=javascript&style=flat&logoColor=e1ea3d&color=f0a835">
<img height="20" src="https://img.shields.io/badge/Publish-npm-blue?logo=npm&style=flat&logoColor=e1ea3d&color=f01822">
</div>
中文介绍页面[PPLong--为你的Hexo博客添加LeetCode日历](http://www.pplong.top/2022/04/25/%E4%B8%BA%E4%BD%A0%E7%9A%84Hexo%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0LeetCode%E6%97%A5%E5%8E%86/)

## Introduce

Hexo-LeetCode-Calendar is a concise submission calendar for users registered on [LeetCode-CN](https://leetcode-cn.com), allowing you to generate any users submission data with several customizable options such as background, partial text color, submission color gap ...

**Example in PC**

![image-20220425194054775](https://s401177923-1302493622.cos.ap-nanjing.myqcloud.com/mdImages/image-20220425194054775.png)

<img src="https://s401177923-1302493622.cos.ap-nanjing.myqcloud.com/mdImages/demostration.gif">

## Install 

### Quick Start

To get a quick start ,you need to locate in your `Hexo` main directory. Then exec 

```sh
npm install hexo-leetcode-calendar --save
```

And next, you can assert the calendar just simply insert : 

```markdown
{% leetcode username %}
```

 in any location of your md file (username is your own name in leetcode-cn.com).

Then do : hexo clean && hexo g && hexo s , and you will see your own leetcode calendar in your own page.

### Customize

![image-20220425203816033](https://s401177923-1302493622.cos.ap-nanjing.myqcloud.com/mdImages/image-20220425203816033.png)

If you don't satisfy the default layout setting ,you can edit your site configuration file (which is _config.yaml) (**NOT your theme config file like _config.xxx.yaml**). Write your own config like below:

```yaml
leetcodecalendar: # ParentNode
  enable: true    
  submitGap: 5	  # every 5 submits will be divided into a level(to show in different color).
  showIcon: true  # show middle Leetcode icon
  color:
    submitColor: '#000' # submit count text color
    bgColor: '#fff'		# calendar background color
    subColors: ['#ebedf0', '#bef5cb', '#85e89d', '#34d058', '#1c992f']  # submit level color
```

| Param       | Explain                                                      |
| ----------- | ------------------------------------------------------------ |
| enable      | enable plugin (false will show nothing)                      |
| submitGap   | every 5 submits will be divided into a level(to show in different color). |
| showIcon    | show middle Leetcode icon                                    |
| submitColor | submit count text color                                      |
| bgColor     | calendar background color                                    |
| subColors   | submit level color                                           |

## Update

## Features

* Partly support calendar layout in mobile phones and pad.

## TODO

* Support mutiple calendars in same page
* Support English Language.
* Add other text customizable optiton to it.
* Reformat code

## Thanks

Especially thanks to [hexo-douban-card](https://github.com/TankNee/hexo-douban-card)  and [hexo-githubcalendar](https://github.com/Zfour/hexo-github-calendar) which provides fantastic ideas and feasible resolution. There would be no hexo-leetcode-calendar without them.

And thanks to any users who are using the plugins. Any of your advices would be much valuable to me
