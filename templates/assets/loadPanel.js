(function leetcodeCalendar() {
    var leetCanvas = document.getElementById('leetcode-sub-calendar');
    var leetCtx = leetCanvas.getContext('2d');
    var width = leetCanvas.width = getComputedStyle(leetCanvas).width.match(/[0-9]+/)[0];
    const dayMillSeconds = 24 * 60 * 60 * 1000;
    const maxRowSize = 7
    const maxColSize = 52
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const weeks = ['日', '二', '四', '六']
    const subColors = []
    const submitGap = document.getElementsByClassName('color-array')[0].getAttribute('submit-gap')
    for (let str of document.getElementsByClassName('color-array')[0].getAttribute('sub-colors').split(",")) {
        subColors.push(str)
    }
    const curDate = new Date();
    const curDateConvert = new Date(curDate.getFullYear(), curDate.getMonth(), +curDate.getDate(), 8, 0, 0);
    const curWeekDay = curDate.getDay() == 0 ? 7 : curDate.getDay() + 1
    const initDate = new Date(curDateConvert.getTime() - (maxRowSize * (maxColSize - 1) + curWeekDay - 1) * dayMillSeconds)
    const userName = document.getElementsByClassName('datasource')[0].getElementsByTagName('a')[0].innerHTML.substring(1)
    const objectMap = JSON.parse(document.getElementById('leetcode-sub-calendar').getAttribute("stamp-param"))
    const map = new Map()
    for (key of Object.keys(objectMap)) {
        map.set(key * 1000, objectMap[key])
    }
    handle(map);

    function handle(data) {
        leetCtx.fillStyle = '#ebedf0'

        var divMargin = 3
        var monthFontSize = 10
        var calendarTopMargin = 20
        var calendarBottomMargin = 10
        var calendarLeftMargin = Math.floor(0.05 * width)
        var divSize = (width - 2 * calendarLeftMargin) / maxColSize - divMargin
        var isInSmallClient = false;

        var height = leetCanvas.height = calendarTopMargin + monthFontSize + 7 * (divSize + divMargin) + calendarBottomMargin

        // 更新height高度
        judgeClientWidth()

        var getPixelRatio = function(context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        };
        var ratio = getPixelRatio(leetCtx);
        // deal problems in showing in  high-dpi screen
        if (ratio != 1) {
            leetCanvas.style.width = leetCanvas.width + "px";
            leetCanvas.style.height = leetCanvas.height + "px";
            width = leetCanvas.width = leetCanvas.width * ratio;
            height = leetCanvas.height = leetCanvas.height * ratio;
            monthFontSize *= ratio
            divMargin *= ratio
            calendarTopMargin *= ratio
            calendarBottomMargin *= ratio
            calendarLeftMargin = Math.floor(0.05 * width)
            divSize = (width - 2 * calendarLeftMargin) / maxColSize - divMargin
        }

        // Draw main days block with canvas
        for (col = 0; col < maxColSize; col++) {
            tempRow = maxRowSize;
            if (col == maxColSize - 1) {
                tempRow = curWeekDay;
            }

            for (row = 0; row < tempRow; row++) {
                let curX = calendarLeftMargin + col * (divSize + divMargin)
                let curY = calendarTopMargin + monthFontSize + row * (divSize + divMargin)
                curStamp = initDate.getTime() + (col * 7 + row) * dayMillSeconds
                if (data.get(curStamp) != null) {
                    leetCtx.fillStyle = subColors[Math.min(Math.floor(data.get(curStamp) / submitGap), subColors.length - 1)]
                } else {
                    leetCtx.fillStyle = subColors[0]
                }
                leetCtx.fillRect(curX, curY, divSize, divSize)
            }

        }


        if (!isInSmallClient) {
            drawMonth()
            drawWeekDay()
        }

        setMouseListener()

        fillColorArr()

        calcAnnualSubCount(data)

        changeYearGapText()

        // 根据当前鼠标在页面的绝对坐标和相对canvas的坐标来判断是否在box上
        function judgeAndGenTooltips(x, y, pageX, pageY) {
            if (x < calendarLeftMargin || x > calendarLeftMargin + maxColSize * (divSize + divMargin) - divMargin) {
                return false;
            }
            if (y < calendarTopMargin + monthFontSize || y > calendarTopMargin + monthFontSize +
                7 * (divMargin + divSize) - divMargin) {
                return false;
            }
            toolTipsContainer = document.getElementsByClassName("leetcode-tips-container")[0];
            curCol = Math.floor((x - calendarLeftMargin) / (divMargin + divSize))
            curRow = Math.floor((y - calendarTopMargin - monthFontSize) / (divMargin + divSize))
            selectDate = new Date(initDate.getTime() + (curCol * 7 + curRow) * dayMillSeconds)
            toolTips = document.getElementById("leetcode-tips")
                // 没必要动态加载, 后期直接在页面内预装好模块
            if (toolTips == null) {
                toolTips = document.createElement("p")
                toolTips.style = "color: #fff;line-height: 40px;margin: 0px;"

                toolTipsContainer.appendChild(toolTips)
                toolTips.id = "leetcode-tips"
            }
            let subCount = 0;
            if (data.get(selectDate.getTime()) != null) {
                subCount = data.get(selectDate.getTime());
            }
            const content = selectDate.getFullYear() + "-" + (selectDate.getMonth() + 1) + "-" + selectDate.getDate() + "  " + subCount + "次提交"
            const containerHeight = window.getComputedStyle(toolTipsContainer).height.match(/[0-9]+/)[0];
            const containerWidth = window.getComputedStyle(toolTipsContainer).width.match(/[0-9]+/)[0];
            toolTips.innerHTML = content
            toolTipsContainer.style.display = "block"
            toolTipsContainer.style.left = pageX - containerWidth / 2 + "px";
            toolTipsContainer.style.top = pageY - containerHeight - 20 + "px"
        }

        function drawWeekDay() {
            const weekDayVerticalMargin = (divMargin + divSize) * 2
            const weekDayLeftMargin = 0.03 * width
            for (i in weeks) {
                curX = weekDayLeftMargin
                curY = calendarTopMargin + monthFontSize + 10 * ratio + i * weekDayVerticalMargin
                leetCtx.fillText(weeks[i], curX, curY)
            }
        }

        function drawMonth() {
            leetCtx.fillStyle = '#999a9c'
            const monthsHorizonMargin = Math.floor(0.05 * width)
            const monthMargin = (width - months.length * monthFontSize - 2.5 * monthsHorizonMargin) / (months.length - 1)
            leetCtx.font = monthFontSize + "px Arial"
            startMonth = initDate.getMonth()

            for (i = 0; i < months.length + 1; i++) {
                curX = 1.5 * monthsHorizonMargin + i * (monthMargin + monthFontSize)
                curY = calendarTopMargin
                leetCtx.fillText(months[(i + startMonth + 1) % 12], curX, curY)
            }
        }

        function changeYearGapText() {
            dom = document.getElementsByClassName("leetcode-bottom-text")[1]
            dom.innerHTML = initDate.getFullYear() + "-" + (initDate.getMonth() + 1) + "-" + initDate.getDate() +
                " - " + curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getDate()
        }

        function calcAnnualSubCount(data) {
            sum = 0
            for (let [key, value] of data.entries()) {
                if (parseInt(key) > initDate.getTime()) {
                    sum += value
                }
            }
            dom = document.getElementsByClassName("leetcode-annul-sub-text")[0]
            dom.innerHTML = sum
        }

        function fillColorArr() {
            li_list = document.getElementsByClassName("color-array")[0];
            for (i in li_list.children) {
                li_list.children[i].style = 'background: ' + subColors[i] + ';'
            }
        }

        function setMouseListener() {
            leetCanvas.onmousemove = function(event) {
                judgeAndGenTooltips(event.offsetX, event.offsetY, event.x, event.y)
            }
            leetCanvas.onmouseout = function(event) {
                toolTipsContainer = document.getElementsByClassName("leetcode-tips-container")[0];
                toolTipsContainer.style.display = "none"
            }
        }

        // 客户端窗口过小不显示下方数据栏
        function judgeClientWidth() {
            if (document.body.clientWidth < 700) {
                isInSmallClient = true;
                document.getElementsByClassName("leetcode-bottom-part")[0].style.display = "none"
                divMargin = 1
                divSize = (width - 2 * calendarLeftMargin) / maxColSize - divMargin
            } else {
                document.getElementsByClassName("leetcode-bottom-part")[0].style.display = "flex"
            }
        }
    }
})()