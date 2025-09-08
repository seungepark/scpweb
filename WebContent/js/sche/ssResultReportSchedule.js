let _pageTcNumList = [];			// 페이지에 그려질 TcNum 목록.

class ReportScheduleManager {
    constructor(option) {
        this.target = document.querySelector("article")
        this.option = option
        this.labels = ['100%', '75%', '50%', '25%', 'STOP', 'ASTERN', '', '']
        this.weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        this.gantt = {
            ylen: 16
        }
        this.divide = {
            isdivide : true,
            max: 5,
        }

        this.shipcondlist = []
    }

    init() {
        if (0 != this.option.datas.length) {
            this._defineProperties()
            if (!this.option.uid || "0" == this.option.uid) {
                this._makeRoot()
            } else {
                const _this = this
                $.ajax({
                    type: "GET",
                    url: contextPath + "/sche/getShipCondList.html",
                    dataType: "json",
                    headers: {
                        "content-type": "application/json"
                    },
                    beforeSend: function() {
                        $('#loading').css("display","block");
                    },
                    complete: function() {
                        $('#loading').css('display',"none");
                    },
                    data: {
                        uid: this.option.uid
                    }
                }).done(function(result, textStatus, xhr) {
                    if(textStatus == "success") {
                        let mindatetime = new Date(`${_this.option.min.sdate} ${_this.option.min.stime}:00`).getTime()
                        let maxdatetime = new Date(`${_this.option.max.edate} ${_this.option.max.etime}:00`).getTime()
                        result.list.forEach(l => {
                            const shipcondtype = shipcondtypeList.find(tl => tl.value == l.cond)
                            if (shipcondtype) l.desc = shipcondtype.desc

                            const sdatetime = new Date(`${l.sdate} ${l.stime}:00`).getTime()
                            const edatetime = new Date(`${l.edate} ${l.etime}:00`).getTime()

                            // 나누어서 그릴때 적용 될 수 있도록 시작 시각과 종료 시각을 미리 구한다.
                            l.sdatetime = sdatetime
                            l.edatetime = edatetime

                            if (sdatetime < mindatetime) {
                                _this.option.min.sdate = l.sdate
                                _this.option.min.stime = l.stime
                            }

                            if (edatetime > maxdatetime) {
                                _this.option.max.edate = l.edate
                                _this.option.max.etime = l.etime
                            }
                        })

                        _this.shipcondlist = result.list

                        _this._makeRoot()
                    }else {
                        alert($.i18n.t('share:tryAgain'));
                    }
                }).fail(function(data, textStatus, errorThrown) {
//                    console.log(errorThrown)
                });
            }
        }
    }

    _makeRoot() {
        if (this.target) while (this.target.firstChild) { this.target.removeChild(this.target.firstChild) }

        if (this.option.min && this.option.max && this.option.min.sdate && this.option.max.edate) {
            this._makeTitleArea()
            this._makeBodyArea()
        }
    }

    _defineProperties() {
        if(this.target) {
            const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${l.sdate} ${l.stime}:00`)) && this.isValidDate(new Date(`${l.edate} ${l.etime}:00`)) && (l.sdate != "" && l.stime != "" && l.edate != "" && l.etime != ""));
			
			if(0 != tests.length) {
                // 첫시각과 마지막 시각을 구함
                Object.defineProperties(this.option, {
                    'min': { get: function () { return JSON.parse(JSON.stringify(tests.reduce((a, b) => { 
						let minObj = new Date(`${a.sdate} ${a.stime}:00`).getTime() < new Date(`${b.sdate} ${b.stime}`).getTime() ? a : b;

						if(isValidDateTime(a.performancesdate + ' ' + a.performancestime)) {
							if(new Date(`${a.performancesdate} ${a.performancestime}:00`).getTime() < new Date(`${minObj.sdate} ${minObj.stime}:00`).getTime()) {
								minObj.sdate = a.performancesdate;
								minObj.stime = a.performancestime;
							}
						}
						
						if(isValidDateTime(b.performancesdate + ' ' + b.performancestime)) {
							if(new Date(`${b.performancesdate} ${b.performancestime}:00`).getTime() < new Date(`${minObj.sdate} ${minObj.stime}:00`).getTime()) {
								minObj.sdate = b.performancesdate;
								minObj.stime = b.performancestime;
							}
						}

						return minObj; 
					}))) } },
                    'max': { get: function () { return JSON.parse(JSON.stringify(tests.reduce((a, b) => { 
						let maxObj = new Date(`${a.edate} ${a.etime}:00`).getTime() > new Date(`${b.edate} ${b.etime}`).getTime() ? a : b;

						if(isValidDateTime(a.performanceedate + ' ' + a.performanceetime)) {
							if(new Date(`${a.performanceedate} ${a.performanceetime}:00`).getTime() > new Date(`${maxObj.edate} ${maxObj.etime}:00`).getTime()) {
								maxObj.edate = a.performanceedate;
								maxObj.etime = a.performanceetime;
							}
						}
						
						if(isValidDateTime(b.performanceedate + ' ' + b.performanceetime)) {
							if(new Date(`${b.performanceedate} ${b.performanceetime}:00`).getTime() > new Date(`${maxObj.edate} ${maxObj.etime}:00`).getTime()) {
								maxObj.edate = b.performanceedate;
								maxObj.etime = b.performanceetime;
							}
						}

						return maxObj;
					}))) } }
                });

                this.option.max.etime = '23:59'
            }
        }

//        if (this.target) {
//            const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${l.sdate} ${l.stime}:00`)) && this.isValidDate(new Date(`${l.edate} ${l.etime}:00`)) && (l.sdate != "" && l.stime != "" && l.edate != "" && l.etime != ""))
//
//			if (0 != tests.length) {
//                // 첫시각과 마지막 시각을 구함
//                Object.defineProperties(this.option, {
//                    'min': { get: function () { return JSON.parse(JSON.stringify(tests.reduce((a, b) => { return new Date(`${a.sdate} ${a.stime}:00`).getTime() < new Date(`${b.sdate} ${b.stime}`).getTime() ? a : b; }))) } },
//                    'max': { get: function () { return JSON.parse(JSON.stringify(tests.reduce((a, b) => { return new Date(`${a.edate} ${a.etime}:00`).getTime() > new Date(`${b.edate} ${b.etime}`).getTime() ? a : b; }))) } }
//                });
//
//                this.option.max.etime = '23:59'
//            }
//        }
    }

    _makeBodyArea() {
        const randomID = (length = 8) => {
            return Math.random().toString(16).substr(2, length);
        }

        // 랜덤 아이디 부여, 각 객체를 찾기 쉽게 연결
        this.option.datas.forEach(d => {
            d.rowID = randomID(10)
        })

        // 첫시각, 마지막시각에 시간을 더해 앞뒤로 붙인다.
        const prevDate = new Date(`${this.option.min.sdate} ${this.option.min.stime}:00`)
        const nextDate = new Date(`${this.option.max.edate} ${this.option.max.etime}:00`)

        // 첫시각, 마지막시각과의 차이를 구함
        let timeDiff = Math.abs(nextDate.getTime() - prevDate.getTime());
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const dayHours = []

        const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

        for (let i = 0; i < dayDiff + 1; i ++) { // -1 === 시작 시간 변경, diff + 1 끝시간 변경
            let date = null

            if (i == 0) date = new Date(prevDate.setDate(prevDate.getDate()))
            else date = new Date(prevDate.setDate(prevDate.getDate() + 1))

            const day = `${date.getFullYear()}-${this._padTime(date.getMonth() + 1)}-${this._padTime(date.getDate())}`

            let week = this.weekday[date.getDay()];
            let uptitle = null
            let len = dayHours.length
            if (len === 0) {
                uptitle = "1st Day"
            } else if (len === 1 || len === 2) {
                uptitle = `${len + 1}nd Day`
            } else if (len > 2) {
                uptitle = `${len + 1}th Day`
            }

            dayHours.push({"day" : day, "uptitle": uptitle, "bottomtitle": `${date.getMonth() + 1}/${date.getDate()} (${week})`, hours: hours})

        }

        if (dayHours.length < 6) {
            this.divide.isdivide = false
        }

        if (this.divide.isdivide) {
            if (dayHours.length % this.divide.max !== 0) { // 마지막 빈 날짜
                const max = this.divide.max - (dayHours.length % this.divide.max)

                for (let i = 0; i < max; i ++) {
                    const lastDay = new Date(dayHours.at(-1).day)
                    const addOneDay = new Date(lastDay.setDate(lastDay.getDate() + 1))
                    dayHours.push({"day" : `${addOneDay.getFullYear()}-${this._padTime(addOneDay.getMonth() + 1)}-${this._padTime(addOneDay.getDate())}`, "uptitle": "", "bottomtitle": "", hours})
                }
            }

            const totalPages = dayHours.length / this.divide.max

            let datas = []

            dayHours.forEach((dh, i) => {
                if (dh.hours.length > 1) datas.push(dh)

                if ((datas.length == this.divide.max || i === dayHours.length -1) && datas.length != 0) {
                    this._drawBodyArea(totalPages, i, JSON.parse(JSON.stringify(datas)))
                    datas = []
                }
            })
        } else {
            this._drawBodyArea(0, 0, dayHours)
        }
    }

    _drawBodyArea(totalPages, idx, dayHours) {

        // 첫날의 시간이 1개일 경우 타이틀 표시 안함
        if (dayHours[0].hours.length === 1) {
            dayHours[0].uptitle = ""
            dayHours[0].bottomtitle = ""
        }

        // 마지막날의 시간이 1개일 경우 타이틀 표시 안함
        if (dayHours[dayHours.length -1].hours.length === 1) {
            dayHours[dayHours.length -1].uptitle = ""
            dayHours[dayHours.length -1].bottomtitle = ""
        }

        // 전체 카테고리 구하기
        const categorys = this.option.datas.filter((arr, index, callback) => index === callback.findIndex(t => t.category === arr.category));
        categorys.sort((a, b) => {
            if (a.category > b.category) return 1;
            else if (a.category < b.category) return -1;
            else return 0;
        })

        this.option.categorys = categorys

        // 한 시간의 pixel을 구하기 위해 모든 시간을 합친다.
        let totalHours = 0
        for (let i = 0; i < dayHours.length; i ++) {
            totalHours += dayHours[i].hours.length
        }
        // 소수점 구하기 위함 함수
        const floor = (number) => {
            return parseFloat((Math.floor(number * 10) / 10).toFixed(1))
        }

        this.option.minpixel = floor((2202/totalHours)/60)

        // 보고서 root
        const id = `report_table_${idx}`
        let tableHtml = this._drawTableRoot(id)

        const title1 = this._getTitle1Html(totalPages, idx)
        const title2 = this._getTitle2Html()
        const title3 = this._getTitle3Html()

        if (idx !== 0) {
            this.target.querySelector("div").insertAdjacentHTML("beforeend", "<div style='padding: 10px; page-break-before: always;'></div>")
        }

        this.target.querySelector("div").insertAdjacentHTML("beforeend", title1)
        this.target.querySelector("div").insertAdjacentHTML("beforeend", title2)
        this.target.querySelector("div").insertAdjacentHTML("beforeend", title3)

        this.target.querySelector("div").insertAdjacentHTML("beforeend", tableHtml)

        const tableel = this.target.querySelector("div").querySelector(`#${id}`) // 보고서 root 구하기

        // 보고서 최 상단 제목 그리기
        let row1ofthead = `<td style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black; width: 50px;">DATE</td>`
        row1ofthead += `<td style="background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black; width: 50px;"></td>`

        let row2ofthead = `<td rowspan="2" style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 2px solid black;">TIME</td>`
        row2ofthead += `<td style="text-align: center;font-size: 13px; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">ACT</td>`

        let row3ofthead = `<td style="text-align: center; font-size: 13px; background: aquamarine; border-right: 1px solid black; border-bottom: 2px solid black;">SCH</td>`

        // M/E LOAD TITLE
        let row1oftbody = `<td colspan="2" rowspan="8" style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;"><div><div style="float:left; margin: 110px 0 0 5px;">M/E<br />LOAD</div>
                        <div style="float: right;">
                            <div style="height: 30px;"></div>
                            <div style="height: 30px;position: relative;top: -11px; text-align: right; margin-right: 1px;">100%</div>
                            <div style="height: 30px;position: relative;top: -11px; text-align: right; margin-right: 1px;">75%</div>
                            <div style="height: 30px;position: relative;top: -11px; text-align: right; margin-right: 1px;">50%</div>
                            <div style="height: 30px;position: relative;top: -11px; text-align: right; margin-right: 1px;">25%</div>
                            <div style="height: 30px;position: relative;top: -11px; text-align: right; margin-right: 1px;">STOP</div>
                            <div style="height: 30px;"></div>
                            <div style="height: 30px;position: relative;top: -8px; text-align: right; margin-right: 1px;">ASTERN</div>
                        </div>  
                    </div>
                </td>`
        let rowoftbody = ""

        // TIME SCHEDULE TITLE
        let row2oftbody = `<td colspan="2" rowspan="${this.gantt.ylen}" style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">TIME<br />SCHEDULE</td>`

        // 상단 제목절 그리기 1st day 등~
        for (let i = 0; i < dayHours.length; i ++) {
            row1ofthead += `<td colspan="${dayHours[i].hours.length}" style="text-align: center;font-size: 13px; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">${dayHours[i].uptitle}</td>`
            row2ofthead += `<td colspan="${dayHours[i].hours.length}" style="text-align: center;font-size: 13px; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">${dayHours[i].bottomtitle}</td>`

            for (let j = 0; j < dayHours[i].hours.length; j ++) {
                let hourText = dayHours[i].hours[j] < 10 ? `0${dayHours[i].hours[j]}` : dayHours[i].hours[j] + ""

                row3ofthead += `<td style="width: ${this.option.minpixel * 60}px; background: aquamarine; font-size: 12px; border-bottom: 2px solid black;">`
                if ("" == dayHours[i].uptitle || (i === 0 && j === 0)) row3ofthead += `<div style="margin-left: -8px; visibility: hidden;">00</div></td>`
                else row3ofthead += `<div style="margin-left: -8px;">${ hourText }</div></td>`
                rowoftbody += `<td style="width: ${this.option.minpixel * 60}px; font-size: 12px; border-bottom: 1px dotted black; border-right: 1px dotted black; position: relative;"></td>`
            }
        }

        const thead = `<thead><tr style="height: 30px;">${row1ofthead}</tr><tr style="height: 30px;">${row2ofthead}</tr><tr style="height: 30px;">${row3ofthead}</tr></thead>`
        tableel.insertAdjacentHTML("beforeend", thead)

        const tbodyofmeload = `<tbody><tr style="height: 30px;">${row1oftbody + rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr></tbody>`
        let tbodyoftimeschedule = `<tbody><tr style="height: 30px;">${row2oftbody + rowoftbody}</tr><tr style="height: 30px;">${rowoftbody}</tr>`

        for (let i = 0; i < this.gantt.ylen -2 ; i ++) {
            tbodyoftimeschedule += `<tr style="height: 30px;">${rowoftbody}</tr>`
        }
        tbodyoftimeschedule += `</tbody>`

        tableel.insertAdjacentHTML("beforeend", tbodyofmeload)
        tableel.insertAdjacentHTML("beforeend", tbodyoftimeschedule)

        const now = new Date()
        const tfoot = `
        <tfoot><tr style="height: 30px;"><td colspan="2" style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">SHIP'S COND.</td><td id="shipcondroot" style="border-top:1px solid black; border-bottom: 3px double black; position: relative;" colspan="${totalHours}"></td></tr>
            <tr>
                <td colspan="2" style="text-align: center;font-size: 13px;font-weight: bold; background: aquamarine; border-right: 1px solid black; border-bottom: 1px solid black;">TEST<br />ITEMS</td>
                <td colspan="${totalHours}" style="height: 0;">
                    <div style="float:left; width: 79%; font-size: 13px;" class="test_items_all_schedule"></div>
                    <div style="float:right; width: 20%; height: 100%; font-size: 13px; border-left: 2px solid black; display: flex; flex-direction: column;" class="schedule_info">
                        <div style="padding: 0 5px; flex-grow: 1;">
                            <div style="text-decoration: underline;">Degine History</div>
                            <div>- Prepared By Basic & General Design</div>
                        </div>
                        <div style="height: 300px;">
                            <table style="width: 100%; height: 100%; text-align: center; border-collapse: collapse; background-color: #FFFFCC;">
                                <tbody>
                                    <tr style="border-top: 2px solid black;  border-bottom: 1px solid black;">
                                        <td style="border-right: 1px solid black;">DEPARTMENT</td>
                                        <td colspan="2">Basic & General Design</td>
                                    </tr>
                                    <tr style="border-bottom: 2px solid black;">
                                        <td style="border-right: 1px solid black;">DATE</td>
                                        <td colspan="2">${now.getFullYear()}-${ this._padTime(now.getMonth() + 1) }-${this._padTime(now.getDate())}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-size: 20px; font-weight: bold; height: 80px; border-bottom: 1px solid black;">SCHEDULE OF SEA TRIAL</td>
                                    </tr>
                                    <tr style="height: 80px; border-bottom: 1px solid black;">
                                        <td style="border-right: 1px solid black; height: 0; text-align: left;"><div style="height: 40%; font-size: 12px;">DRAWN</div><div style="height: 60%; text-align: center;">${this.option.bean.drawn}</div></td>
                                        <td style="border-right: 1px solid black; height: 0; text-align: left;"><div style="height: 40%; font-size: 12px;">CHEDCKED</div><div style="height: 60%; text-align: center;">${this.option.bean.checked}</div></td>
                                        <td style=" height: 0; text-align: left;"><div style="height: 40%; font-size: 12px;">MANAGER</div><div style="height: 60%; text-align: center;">${this.option.bean.manager}</div></td>
                                    </tr>
                                    <tr style="height: 80px; ">
                                        <td style="border-right: 1px solid black;"><div>Project No. : ${this.option.hullNum}</div></td>
                                        <td style="border-right: 1px solid black;"><div>DWG No. : PF60142</div></td>
                                        <td><div>Rev. </div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        </tfoot>`
        tableel.insertAdjacentHTML("beforeend", tfoot)

        // 오름차순 문자 + 숫자 조합
        const getSingleValueAsc = (arr) => {
            return arr.sort(function (a, b) {
                return a.tcnum.localeCompare(b.tcnum, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
        };
        // 내림차순 문자 + 숫자 조합
        const getSingleValueDesc = (arr) => {
            return arr.sort(function (a, b) {
                return b.tcnum.localeCompare(a.tcnum, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
        };

        this._drawLineChart(tableel, dayHours) // line chart 아이템 그리기
        this._drawGanttChart(tableel, dayHours) // gantt chart 아이템 그리기
        this._drawShipCond(tableel, dayHours) // Ship Cond 아이템 그리기
		
		// 스케쥴의 각 아이템을 카테고리별로 그리기 시작
        const testItemScheduleBox = tableel.querySelector('tfoot').querySelector('.test_items_all_schedule');
        let scheduleBoxHtml = ``;

        const categoryOfgeneral = categorys.filter(c => c.category === 'G');

        categoryOfgeneral.forEach(cat => {
            const list = getSingleValueAsc(JSON.parse(JSON.stringify(this.option.datas.filter(d => d.category === cat.category))));
			let scheduleBoxHtmlTemp = '';
			let isExist = false;
            scheduleBoxHtmlTemp += `<div style="float: left; padding: 10px; height: 100%;">`;
            scheduleBoxHtmlTemp += `<div style="font-weight: bold; text-decoration: underline;">G. GENERAL PART</div>`;

            for(let j = 0; j < list.length; j++) {
                const item = list[j];

				if(_pageTcNumList.includes(item.tcnum)) {
					const txt = `${item.tcnum} ${item.desc}`;
                	scheduleBoxHtmlTemp += `<div style="color: black;">${ txt }</div>`;
					isExist = true;
				}
            }

            scheduleBoxHtmlTemp += `<div style="float: left; padding: 10px;">
                        <div style="font-weight: bold; text-decoration: underline;">REMARKS</div>
                            <div>
                                <ol style="display: block; list-style-type: decimal; padding-left: 15px;">
                                    <li>
                                        "CHECK" MEANS YARD'S SELF CHECK, I.E. BUILDER'S TRIAL.
                                        <br/>"TEST, DEMO, ADJUSTMENT" MEANS OFFICIAL TEST WITH
                                        <br/>THE BUYER AND/OR THE CLASS.
                                    </li>
                                    <li>
                                        ALL NAVIGATION/COMMUNICATION EQUIPMENT WILL BE
                                        <br/>DEMONSTRATED AT CONVENIENT TIME DURING SEA TRIAL.
                                    </li>
                                </ol>
                            </div>
                        </div>`;

            scheduleBoxHtmlTemp += `</div>`;

			if(isExist) {
				scheduleBoxHtml += scheduleBoxHtmlTemp;
			}
        });

		for(let i = 0; i < _code1LvList.length; i++) {
			const categoryOf1Lv = categorys.filter(c => c.category === _code1LvList[i].code);

	        categoryOf1Lv.forEach(cat => {
	            const list = getSingleValueAsc(JSON.parse(JSON.stringify(this.option.datas.filter(d => d.category === cat.category))));
				let scheduleBoxHtmlTemp = '';
				let isExist = false;
	            scheduleBoxHtmlTemp += `<div style="float: left; padding: 10px; height: 100%;">`;
	            scheduleBoxHtmlTemp += `<div style="font-weight: bold; text-decoration: underline;">${_code1LvList[i].code}. ${_code1LvList[i].desc.toUpperCase()}</div>`;
	
	            for(let j = 0; j < list.length; j++) {
	                const item = list[j];
	
					if(_pageTcNumList.includes(item.tcnum)) {
						const txt = `${item.tcnum} ${item.desc}`;
	                	scheduleBoxHtmlTemp += `<div style="color: black;">${ txt }</div>`;
						isExist = true;
					}
	            }
	
	            scheduleBoxHtmlTemp += `</div>`;
	
				if(isExist) {
					scheduleBoxHtml += scheduleBoxHtmlTemp;
				}
	        });
		}

        scheduleBoxHtml += '</div>';
        testItemScheduleBox.insertAdjacentHTML('beforeend', scheduleBoxHtml);
        // 스케쥴의 각 아이템을 카테고리별로 그리기 완료
    }

    _drawShipCond(tableel, dayHours) {
        const minT = new Date(`${dayHours[0].day} ${dayHours[0].hours[0]}:00:00`).getTime()
        const maxT = new Date(`${dayHours.at(-1).day} ${dayHours.at(-1).hours.at(-1)}:59:59`).getTime() + 10000


        const tdRoot = tableel.querySelector("#shipcondroot")
        const size = tdRoot.getBoundingClientRect()

        const shipCondSvg = `<svg width="${ size.width }" height="${ size.height }" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0;">
            <style>
                circle {
                    cursor:pointer;
                }
            </style>
            <defs>
                <marker id="Triangle" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
                <marker id=""
            </defs>
        </svg>`

        const copyShipconds = JSON.parse(JSON.stringify(this.shipcondlist))
        const ll = []

        const getTextWidth = (text, fontSize, fontWeight = 'normal') => {
            // 캔버스 요소를 생성하고 2D 컨텍스트를 가져옵니다.
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // 글꼴 크기를 설정합니다.
            context.font = `${fontWeight} ${fontSize}px Arial`;

            // 텍스트의 메트릭을 측정하고 너비를 반환합니다.
            const metrics = context.measureText(text);
            return metrics.width;
        }

        // 시작과 끝에 대한 점 위치 찾기
        const getLine = (sd, st, ed, et) => {
            const s = new Date(`${sd} ${st}:00`)
            const e = new Date(`${ed} ${et}:00`)

            const x1 = (s.getTime() - minT) * (size.width) / (maxT - minT)
            const x2 = (e.getTime() - minT) * (size.width) / (maxT - minT)

            return {x1, x2}
        }
        let lineHtml = ""

        copyShipconds.forEach(d => {
            if (dayHours.filter(dh => dh.day === d.sdate).length !== 0 && dayHours.filter(dh => dh.day === d.edate).length !== 0) { // 시작과 완료가 다 포함 되어 있는 경우

                const line = getLine(d.sdate, d.stime, d.edate, d.etime)
                const lineW = line.x2 - line.x1

                let textW = (Math.ceil(getTextWidth(d.desc, 14, "bold") / 10)) * 10
                if (lineW - textW <= 50) textW = 0

                if (textW !== 0) {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ (line.x1 + lineW / 2) - (textW / 2) }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px" marker-end="url(#Triangle)"></line>`
                    lineHtml += `<text x="${ (line.x1 + lineW / 2) - (textW / 2) + 15 }" y="${ (size.height / 2) + 5 }" style="font-size:14px; color:darkblue; font-weight: bold;">${ d.desc }</text>`
                    lineHtml += `<line x1="${ (line.x1 + lineW / 2) + (textW / 2) + 15 }" y1="${ size.height / 2 }" x2="${line.x2-12}" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px" marker-end="url(#Triangle)"></line>`
                    lineHtml += `<line x1="${line.x2 - 1}" y1="0" x2="${line.x2 - 1}" y2="${ size.height}" stroke="#000000" stroke-width="3px"></line>`
                } else {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ line.x2 }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                    lineHtml += `<line x1="${line.x2 - 1}" y1="0" x2="${line.x2 - 1}" y2="${ size.height}" stroke="#000000" stroke-width="3px"></line>`
                }
            } else if (dayHours.filter(dh => dh.day === d.sdate).length !== 0 && dayHours.filter(dh => dh.day === d.edate).length === 0) {// 시작은 포함 되지만 완료가 포함 안된 경우
                const line = getLine(d.sdate, d.stime, `${dayHours.at(-1).day}`, `${dayHours.at(-1).hours.at(-1)}:59:59`)
                const lineW = line.x2 - line.x1

                let textW = (Math.ceil(getTextWidth(d.desc, 14, "bold") / 10)) * 10
                if (lineW - textW <= 50) textW = 0

                if (textW !== 0) {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ (line.x1 + lineW / 2) - (textW / 2) }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px" marker-end="url(#Triangle)"></line>`
                    lineHtml += `<text x="${ (line.x1 + lineW / 2) - (textW / 2) + 15 }" y="${ (size.height / 2) + 5 }" style="font-size:14px; color:darkblue; font-weight: bold;">${ d.desc }</text>`
                    lineHtml += `<line x1="${ (line.x1 + lineW / 2) + (textW / 2) + 15 }" y1="${ size.height / 2 }" x2="${line.x2-12}" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                } else {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ line.x2 }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                }
            } else if (!dayHours.find(dh => dh.day === d.sdate) && dayHours.find(dh => dh.day === d.edate)) { // 시작은 포함 안되고 완료만 포함
                const line = getLine(`${dayHours.at(0).day}`, `${dayHours.at(0).hours.at(0)}:00:00`, d.edate, d.etime)
                const lineW = line.x2 - line.x1

                let textW = (Math.ceil(getTextWidth(d.desc, 14, "bold") / 10)) * 10
                if (lineW - textW <= 50) textW = 0

                if (textW !== 0) {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ (line.x1 + lineW / 2) - (textW / 2) }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px" marker-end="url(#Triangle)"></line>`
                    lineHtml += `<text x="${ (line.x1 + lineW / 2) - (textW / 2) + 15 }" y="${ (size.height / 2) + 5 }" style="font-size:14px; color:darkblue; font-weight: bold;">${ d.desc }</text>`
                    lineHtml += `<line x1="${ (line.x1 + lineW / 2) + (textW / 2) + 15 }" y1="${ size.height / 2 }" x2="${line.x2-12}" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px" marker-end="url(#Triangle)"></line>`
                    lineHtml += `<line x1="${line.x2 - 1}" y1="0" x2="${line.x2 - 1}" y2="${ size.height}" stroke="#000000" stroke-width="3px"></line>`
                } else {
                    lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ line.x2 }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                    lineHtml += `<line x1="${line.x2 - 1}" y1="0" x2="${line.x2 - 1}" y2="${ size.height}" stroke="#000000" stroke-width="3px"></line>`
                }


            } else { // 시작과 완료가 포함 되지 않지만 이벤트의 중간
                const dsdate = new Date(`${d.sdate} ${d.stime}`)
                const dedate = new Date(`${d.edate} ${d.etime}`)

                const dhsdate = new Date(`${dayHours.at(0).day}`)
                const dhedate = new Date(`${dayHours.at(-1).day}`)

                if (dsdate <= dhedate && dedate >= dhsdate) {
                    const line = getLine(`${dayHours.at(0).day}`, `${dayHours.at(0).hours.at(0)}:00:00`, `${dayHours.at(-1).day}`, `${dayHours.at(-1).hours.at(-1)}:59:59`)
                    const lineW = line.x2 - line.x1

                    let textW = (Math.ceil(getTextWidth(d.desc, 14, "bold") / 10)) * 10
                    if (lineW - textW <= 50) textW = 0

                    if (textW !== 0) {
                        lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ (line.x1 + lineW / 2) - (textW / 2) }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                        lineHtml += `<text x="${ (line.x1 + lineW / 2) - (textW / 2) + 15 }" y="${ (size.height / 2) + 5 }" style="font-size:14px; color:darkblue; font-weight: bold;">${ d.desc }</text>`
                        lineHtml += `<line x1="${ (line.x1 + lineW / 2) + (textW / 2) + 15 }" y1="${ size.height / 2 }" x2="${line.x2}" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                    } else {
                        lineHtml += `<line x1="${line.x1}" y1="${ size.height / 2 }" x2="${ line.x2 }" y2="${ size.height / 2 }" stroke="#000000" stroke-width="3px"></line>`
                    }
                }
            }
        })

        tdRoot.insertAdjacentHTML("beforeend", shipCondSvg)
        if (lineHtml) tdRoot.querySelector("svg").insertAdjacentHTML('beforeend', lineHtml) // 라인(path) svg 입력
    }

    _drawGanttChart(tableel, dayHours) {

        const minT = new Date(`${dayHours[0].day} ${dayHours[0].hours[0]}:00:00`).getTime()
        const maxT = new Date(`${dayHours.at(-1).day} ${dayHours.at(-1).hours.at(-1)}:59:59`).getTime() + 10000

        const copyDatas = JSON.parse(JSON.stringify(this.option.datas))
        const ll = []
        copyDatas.forEach((d, i) => {
			const isPerStart = !isEmpty(d.performancesdate) && !isEmpty(d.performancestime);
			const isPerEnd = !isEmpty(d.performanceedate) && !isEmpty(d.performanceetime);
	
            const startTime = isPerStart ? new Date(`${d.performancesdate} ${d.performancestime}:00`).getTime() : new Date(`${d.sdate} ${d.stime}:00`).getTime();
            const endTime = isPerEnd ? new Date(`${d.performanceedate} ${d.performanceetime}:00`).getTime() : new Date(`${d.edate} ${d.etime}:00`).getTime();

            if(startTime >= minT && endTime <= maxT) {
                ll.push(d);
            }else if(startTime < maxT && endTime > maxT) { // 차트 마지막
				if(isPerEnd) {
					d.performanceedate = dayHours.at(-1).day;
                	d.performanceetime = '23:59:59';
				}else {
					d.edate = dayHours.at(-1).day;
                	d.etime = '23:59:59';
				}
                
                ll.push(d);
            }else if(startTime < minT && endTime > minT) { // 차트 처음
				if(isPerStart) {
					d.performancesdate = dayHours[0].day;
                	d.performancestime = '00:00:00';
				}else {
					d.sdate = dayHours[0].day;
                	d.stime = '00:00:00';
				}
                
                ll.push(d);
            }
        })

        const ganttChartTable = tableel.querySelectorAll("tbody")[1]

        const tr = ganttChartTable.childNodes[0].getBoundingClientRect()
        const td0 = ganttChartTable.childNodes[0].childNodes[0].getBoundingClientRect()
        const td1 = ganttChartTable.childNodes[0].childNodes[1].getBoundingClientRect()

        const ganttChart = `<svg width="${ tr.width - td0.width }" height="${ td0.height }" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0;">
            <style>
            circle {
                cursor:pointer;
            }
            </style>
        </svg>`

        ganttChartTable.querySelectorAll("tr")[0].querySelectorAll("td")[1].insertAdjacentHTML('beforeend', ganttChart)

        ll.sort((a, b) => {
			const isPerStartA = !isEmpty(a.performancesdate) && !isEmpty(a.performancestime);
			const isPerStartB = !isEmpty(b.performancesdate) && !isEmpty(b.performancestime);

            const atime = isPerStartA ? new Date(`${a.performancesdate} ${a.performancestime}`).getTime() : new Date(`${a.sdate} ${a.stime}`).getTime();
            const btime = isPerStartB ? new Date(`${b.performancesdate} ${b.performancestime}`).getTime() : new Date(`${b.sdate} ${b.stime}`).getTime();

            if (atime > btime) return 1
            else return -1
        })

//        console.log(tr.width - td0.width, (2196.97 - 97.66))
        //
        // 시작과 끝에 대한 점 위치 찾기
        const getLine = (sd, st, ed, et) => {
            const s = new Date(`${sd} ${st}:00`)
            const e = new Date(`${ed} ${et}:00`)

            const x1 = (s.getTime() - minT) * (tr.width - td0.width) / (maxT - minT)
            const x2 = (e.getTime() - minT) * (tr.width - td0.width) / (maxT - minT)

            return {x1, x2}
        }

        // A -> HULL
        // B -> MACHINERY
        // C -> ELECTRIC
        // G -> GENERAL
        // P -> PREPARATION
        // O -> OTM

        const points = []
        const condPoints = []

        ll.forEach(l => {
			const isPerStart = !isEmpty(l.performancesdate) && !isEmpty(l.performancestime);
			const isPerEnd = !isEmpty(l.performanceedate) && !isEmpty(l.performanceetime);

            if (this.isValidDate(isPerStart ? new Date(`${l.performancesdate} ${l.performancestime}:00`) : new Date(`${l.sdate} ${l.stime}:00`)) && this.isValidDate(isPerEnd ? new Date(`${l.performanceedate} ${l.performanceetime}:00`) : new Date(`${l.edate} ${l.etime}:00`)) && (isPerStart ? l.performancesdate : l.sdate != "" && isPerStart ? l.performancestime : l.stime != "" && isPerEnd ? l.performanceedate : l.edate != "" && isPerEnd ? l.performanceetime : l.etime != "")) {
                if ("CONV" === l.ctype) {
                    const lp = getLine(isPerStart ? l.performancesdate : l.sdate, isPerStart ? l.performancestime : l.stime, isPerEnd ? l.performanceedate : l.edate, isPerEnd ? l.performanceetime : l.etime); // 시간을 라인으로 변환
                    const finddupl = condPoints.find(p => p.x1 <= lp.x1 && p.x2 >= lp.x1)

                    if (finddupl) {
                        const min = lp.x1 > finddupl.x1 ? finddupl.x1 : lp.x1
                        const max = lp.x2 > finddupl.x2 ? lp.x2 : finddupl.x2

                        finddupl.x1 = min
                        finddupl.x2 = max

                        finddupl.ids.push(l.rowID)
                    } else {
                        condPoints.push({x1: lp.x1, x2: lp.x2, y: this.gantt.ylen - 1, ids: [l.rowID], isPer: isPerStart || isPerEnd})
                    }
                } else {
                    const lp = getLine(isPerStart ? l.performancesdate : l.sdate, isPerStart ? l.performancestime : l.stime, isPerEnd ? l.performanceedate : l.edate, isPerEnd ? l.performanceetime : l.etime); // 시간을 라인으로 변환
                    const finddupl = points.find(p => p.x1 === lp.x1 && p.x2 === lp.x2)

                    if (finddupl) {
                        finddupl.ids.push(l.rowID)
                    } else {
                        points.push({x1: lp.x1, x2: lp.x2, y: 0, ids: [l.rowID], isPer: isPerStart || isPerEnd});
                    }
                }
            }
        })

        let txtHtml = ""
        let lineHtml = ""

        const lineYaxios = () => {
            const l = []
            for (let i = this.gantt.ylen - 2; i > 0; i --) {
                l.push(i)
            }
            return l
        }

        const getTextWidth = (text, fontSize, fontWeight = 'normal') => {
            // 캔버스 요소를 생성하고 2D 컨텍스트를 가져옵니다.
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // 글꼴 크기를 설정합니다.
            context.font = `${fontWeight} ${fontSize}px Arial`;

            // 텍스트의 메트릭을 측정하고 너비를 반환합니다.
            const metrics = context.measureText(text);
            return metrics.width;
        }

		_pageTcNumList = [];
        let lineY = []
        points.forEach(p => {
            if (p.ids.length != 0) {
                if (lineY.length === 0) lineY = lineYaxios()
                const yi = lineY.pop()
                const y = yi * td1.height;
				const lineColor = p.isPer ? '#F57C00' : '#000099';
                lineHtml += `<line x1="${p.x1}" y1="${y}" x2="${p.x2}" y2="${y}" stroke="${lineColor}" stroke-width="3px"></line>`
                let tcnum = ""
                const ts = [...new Set(p.ids)]
                ts.forEach((b, i) => {
                    const a = ll.find(d=> d.rowID === b)
                    if ("O" !== a.category && "P" !== a.category) {
                        tcnum += i != 0 ? "," + a.tcnum : a.tcnum;
						_pageTcNumList.push(a.tcnum);
                    } else {
                        tcnum += i != 0 ? "," + a.desc : a.desc;
						_pageTcNumList.push(a.desc);
                    }

                })

                if (p.x1 > 2000) { // 글자가 넘어가서 보이지 않게 될 수 있으니
                    const textW = (Math.ceil(getTextWidth(tcnum, 12, "bold") / 10)) * 10
                    if (p.x1 + textW > tr.width - td0.width) {
                        p.x1 = tr.width - td0.width - textW
                    }
                }

                txtHtml += `<text x="${p.x1}" y="${y - 10}" style="font-size:12px; color:red; font-weight: bold;">${tcnum}</text>`
            }
        })

        condPoints.forEach(p => {
            if (p.ids.length != 0) {
                const y = p.y * td1.height;
				const lineColor = p.isPer ? '#F57C00' : '#000099';
                lineHtml += `<line x1="${p.x1}" y1="${y}" x2="${p.x2}" y2="${y}" stroke="${lineColor}" stroke-width="3px"></line>`
                let tcnum = ""
                const ts = [...new Set(p.ids)]
                ts.forEach((b, i) => {
                    const a = ll.find(d=> d.rowID === b)
                    if ("O" !== a.category && "P" !== a.category) {
                        tcnum += i != 0 ? "," + a.tcnum : a.tcnum;
						_pageTcNumList.push(a.tcnum);
                    } else {
                        tcnum += i != 0 ? "," + a.desc : a.desc;
						_pageTcNumList.push(a.desc);
                    }

                })

                if (p.x1 > 2000) { // 글자가 넘어가서 보이지 않게 될 수 있으니
                    const textW = (Math.ceil(getTextWidth(tcnum, 12, "bold") / 10)) * 10
                    if (p.x1 + textW > tr.width - td0.width) {
                        p.x1 = tr.width - td0.width - textW
                    }
                }

                txtHtml += `<text x="${p.x1}" y="${y - 10}" style="font-size:12px; color:red; font-weight: bold;">${tcnum}</text>`
            }
        })

        // VER. 1
        // const checkPoints = []
        // 연결 되는 스케쥴을 하나로 연결 함수
        // const betWeenPoints = (p) => {
        //     const aa = points.find(ps => p.id !== ps.id && p.y === ps.y && (!checkPoints.find(cp=> cp === ps.id)) && (p.x1 <= ps.x1 && p.x2 >= ps.x1))
        //
        //     if (aa) {
        //         checkPoints.push(p.id)
        //
        //         if(p.ids) {
        //             p.ids.push(p.id)
        //             p.ids.push(aa.id)
        //         } else {
        //             p.ids = []
        //             p.ids.push(p.id)
        //         }
        //
        //         const x1 = p.x1 > aa.x1 ? aa.x1 : p.x1
        //         const x2 = p.x2 > aa.x2 ? p.x2 : aa.x2
        //
        //         return betWeenPoints({x1: x1, x2: x2, y: p.y, id: aa.id, ids: p.ids})
        //     }
        //
        //     checkPoints.push(p.id)
        //     return p
        // }
        //
        // let bwplines = []
        // const findDupl = (target) => {
        //     if (lineRows.length == 0) lineRows = Array.from(new Array(n), (x, i) => i + 1);
        //     let lineRow = lineRows.shift()
        //
        //     if (bwplines.find(b => b.y === lineRow && (b.x1 <= target.x1 && b.x2 >= target.x1))) {
        //         return findDupl(target)
        //     } else {
        //         return lineRow
        //     }
        // }
        //
        // let n = this.option.categorys.length + 3;
        // let lineRows = Array.from(new Array(n), (x, i) => i + 1);

        // points.forEach(p => {
        //     if (!checkPoints.find(cp => cp === p.id)) {
        //         const bwp = betWeenPoints(p)
        //         if (bwp) {
        //             if (lineRows.length === 0) {
        //                 lineRows = Array.from(new Array(n), (x, i) => i + 1);
        //             }
        //
        //             const checkRow = findDupl(bwp)
        //
        //             bwp.y = checkRow
        //             bwplines.push(bwp)
        //             const y = bwp.y * td1.height
        //             lineHtml += `<line x1="${bwp.x1}" y1="${y}" x2="${bwp.x2}" y2="${y}" stroke="red" stroke-width="2px"></line>`
        //
        //             if (!bwp.ids || bwp.ids.length === 0) {
        //                 const a = ll.find(d=> d.rowID === bwp.id)
        //                 if ("O" !== a.category && "P" !== a.category) {
        //                     txtHtml += `<text x="${bwp.x1}" y="${y - 10}" style="font-size:11px; color:red; font-weight: bold;">${a.tcnum}</text>`
        //                 } else {
        //                     txtHtml += `<text x="${bwp.x1}" y="${y - 10}" style="font-size:11px; color:red; font-weight: bold;">${a.desc}</text>`
        //                 }
        //
        //             } else {
        //                 let tcnum = ""
        //                 const ts = [...new Set(bwp.ids)]
        //                 ts.forEach((b, i) => {
        //                     const a = ll.find(d=> d.rowID === b)
        //                     tcnum += i != 0 ? ", " + a.tcnum : a.tcnum
        //                 })
        //                 txtHtml += `<text x="${bwp.x1}" y="${y - 10}" style="font-size:10px; color:red; font-weight: bold;">${tcnum}</text>`
        //             }
        //         }
        //     }
        // })

        if (lineHtml) ganttChartTable.querySelector("svg").insertAdjacentHTML('beforeend', lineHtml) // 라인(path) svg 입력
        if (txtHtml) ganttChartTable.querySelector("svg").insertAdjacentHTML('beforeend', txtHtml) // 라인(path) svg 입력
    }

    _drawLineChart(tableel, dayHours) {

        const minT = new Date(`${dayHours[0].day} ${dayHours[0].hours[0]}:00:00`).getTime()
        const maxT = new Date(`${dayHours.at(-1).day} ${dayHours.at(-1).hours.at(-1)}:59:59`).getTime() + 10000

        const copyDatas = JSON.parse(JSON.stringify(this.option.datas))
        const ll = []

        copyDatas.forEach((d, i) => {
			const isPerStart = !isEmpty(d.performancesdate) && !isEmpty(d.performancestime);
			const isPerEnd = !isEmpty(d.performanceedate) && !isEmpty(d.performanceetime);
				
			const startTime = isPerStart ? new Date(`${d.performancesdate} ${d.performancestime}:00`).getTime() : new Date(`${d.sdate} ${d.stime}:00`).getTime();
			const endTime = isPerEnd ? new Date(`${d.performanceedate} ${d.performanceetime}:00`).getTime() : new Date(`${d.edate} ${d.etime}:00`).getTime();

            if(startTime >= minT && endTime <= maxT) {
                ll.push(d);
            }else if(startTime < maxT && endTime > maxT) { // 차트 마지막
				if(isPerEnd) {
					d.performanceedate = dayHours.at(-1).day;
                	d.performanceetime = '23:59:59';
				}else {
					d.edate = dayHours.at(-1).day;
                	d.etime = '23:59:59';
				}
                
                ll.push(d);
            }else if(startTime < minT && endTime > minT) { // 차트 처음
				if(isPerStart) {
					d.performancesdate = dayHours[0].day;
                	d.performancestime = '00:00:00';
				}else {
					d.sdate = dayHours[0].day;
                	d.stime = '00:00:00';
				}
                
                ll.push(d);
            }
        })

        const lineChartTable = tableel.querySelectorAll("tbody")[0]

        const tr = lineChartTable.childNodes[0].getBoundingClientRect()
        const td0 = lineChartTable.childNodes[0].childNodes[0].getBoundingClientRect()
        const td1 = lineChartTable.childNodes[0].childNodes[1].getBoundingClientRect()

        const lineChart = `<svg width="${ tr.width - td0.width }" height="${ td0.height }" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0;">
                    <style>
                    circle {
                        cursor:pointer;
                    }
                    </style>
                    <line x1="0" y1="${5 * td1.height}" x2="100%" y2="${5 * td1.height}" stroke="red" stroke-width="2px"></line>
                    <line x1="0" y1="${7 * td1.height - 1}" x2="100%" y2="${7 * td1.height -1}" stroke="black" stroke-width="2px"></line>
                    <line x1="0" y1="${8 * td1.height - 1}" x2="100%" y2="${8 * td1.height -1}" stroke="black" stroke-width="1px"></line>
                </svg>`

        lineChartTable.querySelectorAll("tr")[0].querySelectorAll("td")[1].insertAdjacentHTML('beforeend', lineChart)



        const points = [];
        ll.sort((a, b) => {
			const isPerStartA = !isEmpty(a.performancesdate) && !isEmpty(a.performancestime);
			const isPerStartB = !isEmpty(b.performancesdate) && !isEmpty(b.performancestime);

            const atime = isPerStartA ? new Date(`${a.performancesdate} ${a.performancestime}`).getTime() : new Date(`${a.sdate} ${a.stime}`).getTime();
            const btime = isPerStartB ? new Date(`${b.performancesdate} ${b.performancestime}`).getTime() : new Date(`${b.sdate} ${b.stime}`).getTime();

            if (atime > btime) return 1
            else return -1
        })

        // 시작과 끝에 대한 점 위치 찾기
        const getPoint = (dd, tt, val, dt, id, c) => {

            const s = new Date(`${dd} ${tt}:00`)
            const x = (s.getTime() - minT) * (tr.width - td0.width) / (maxT - minT)
            const y = (5 + ((-1 * val) / 25)) * td1.height

            return {x: x, y: y, t: dt, id: id, c: c}
        }

        const getControlPoints = (x0,y0,x1,y1,x2,y2,t) => {
            const d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
            const d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
            const fa=t*d01/(d01+d12);   // scaling factor for triangle Ta
            const fb=t*d12/(d01+d12);   // ditto for Tb, simplifies to fb=t-fa
            const p1x=x1-fa*(x2-x0);    // x2-x0 is the width of triangle T
            const p1y=y1-fa*(y2-y0);    // y2-y0 is the height of T
            const p2x=x1+fb*(x2-x0);
            const p2y=y1+fb*(y2-y0);
            return [p1x,p1y,p2x,p2y];
        }

        const drawSpline = (pts, t, closed) => { // 곡선 함수
            let cp = []
            const n = pts.length

            if (closed) {
                pts.push(pts[0],pts[1],pts[2],pts[3]);
                pts.unshift(pts[n-1]);
                pts.unshift(pts[n - 1]);

                for(let i=0;i<n;i+=2){
                    cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t));
                }

                cp = cp.concat(cp[0], cp[1]);
                let html = "";
                for (let i = 2; i < n + 2; i += 2) {

                    const path = `M ${pts[i]},${pts[i + 1]} C ${cp[2 * i - 2]},${cp[2 * i - 1]} ${cp[2 * i]},${cp[2 * i + 1]} ${pts[i + 2]},${pts[i + 3]}`
                    html += `<path d="${path}" fill="none" stroke="#000" stroke-width="2px" />`
                }

                return html
            } else {
                for(let i=0;i<n-4;i+=2){
                    cp=cp.concat(getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
                }
                let html = "";
                for(let i=2;i<pts.length-5;i+=2){
                    const path = `M ${pts[i]},${pts[i + 1]} C ${cp[2 * i - 2]},${cp[2 * i - 1]} ${cp[2 * i]},${cp[2 * i + 1]} ${pts[i + 2]},${pts[i + 3]}`
                    html += `<path d="${path}" fill="none" stroke="#000" stroke-width="2px" />`
                }

                html += `<path d="M ${pts[0]},${pts[1]} Q ${cp[0]},${cp[1]} ${pts[2]},${pts[3]}" fill="none" stroke="#000" stroke-width="2px" />`
                //html += `<path d="M ${pts[n-2]},${pts[n-1]} Q ${cp[2*n-10]},${cp[2*n-9]} ${pts[n-4]},${pts[n-3]}" fill="none" stroke="#444cf7" stroke-width="2px" />`
                return html
            }
        }

        ll.forEach((l, i) => {
			const isPerStart = !isEmpty(l.performancesdate) && !isEmpty(l.performancestime);
			const isPerEnd = !isEmpty(l.performanceedate) && !isEmpty(l.performanceetime);

            if (this.isValidDate(isPerStart ? new Date(`${l.performancesdate} ${l.performancestime}:00`) : new Date(`${l.sdate} ${l.stime}:00`)) && this.isValidDate(isPerEnd ? new Date(`${l.performanceedate} ${l.performanceetime}:00`) : new Date(`${l.edate} ${l.etime}:00`))) {
                // ready time 입력
                if ('LOAD' === l.ctype.toUpperCase() && "" !== l.loadrate && "" !== l.readytime) {
                    const readyY = 5 * td1.height

                    let startDateTime = isPerStart ? new Date(`${l.performancesdate} ${l.performancestime}`) : new Date(`${l.sdate} ${l.stime}`);
                    startDateTime.setMinutes(startDateTime.getMinutes() - Number(l.readytime))
                    const readydate = `${startDateTime.getFullYear()}-${this._padTime(startDateTime.getMonth() + 1)}-${this._padTime(startDateTime.getDate())}`
                    const readytime = `${this._padTime(startDateTime.getHours())}:${this._padTime(startDateTime.getMinutes())}`

                    const sp = isPerStart ? getPoint(l.performancesdate, l.performancestime, l.loadrate, l.dtype, l.rowID, 'S') : getPoint(l.sdate, l.stime, l.loadrate, l.dtype, l.rowID, 'S');
                    const rp = getPoint(readydate, readytime, l.loadrate, l.dtype, l.rowID, 'R')

                    const ff = points.filter(p => p.x > rp.x|| p.x == rp.x)
                    if (ff.length === 0 && points.length !== 0 && readyY === points.at(-1).y) {
                        points.push({ x: rp.x, y: readyY, t: "STEP", id: l.rowID, c: 'R' })
                        points.push({ x: sp.x - td1.width, y: readyY, t: "STEP", id: l.rowID, c: 'R' })
                    }
                }

                if ("LOAD" === l.ctype.toUpperCase()) {
                    if (("STEP" === l.dtype.toUpperCase() || "VARIABLE" === l.dtype.toUpperCase()) && "" !== l.loadrate) {
                        const sp = isPerStart ? getPoint(l.performancesdate, l.performancestime, l.loadrate, l.dtype, l.rowID, 'S') : getPoint(l.sdate, l.stime, l.loadrate, l.dtype, l.rowID, 'S');
                        const ep = isPerEnd ? getPoint(l.performanceedate, l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E') : getPoint(l.edate, l.etime, l.loadrate, l.dtype, l.rowID, 'E');

                        points.push(sp)
                        points.push(ep)
                    } else if ("REMOTE" === l.dtype.toUpperCase()) {
                        const sp = isPerStart ? getPoint(l.performancesdate, l.performancestime, l.loadrate, l.dtype, l.rowID, 'S') : getPoint(l.sdate, l.stime, l.loadrate, l.dtype, l.rowID, 'S');
                        const ep = isPerEnd ? getPoint(l.performanceedate, l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E') : getPoint(l.edate, l.etime, l.loadrate, l.dtype, l.rowID, 'E');

                        const addX = (ep.x - sp.x) / 3
                        const centerY = (5 + ((-1 * 30) / 25)) * td1.height
                        const asternY = 7 * td1.height

                        points.push({ x: sp.x, y: asternY, t: "STEP", id: l.rowID, c: 'S' })
                        points.push({ x: sp.x + addX, y: centerY, t: "STEP", id: l.rowID, c: 'C' })
                        points.push({ x: ep.x - addX, y: asternY, t: "STEP", id: l.rowID, c: 'C' })
                        // points.push({ x: ep.x, y: centerY, t: "STEP", id: l.rowID, c: 'C' })

                    } else if ("CRASH" === l.dtype.toUpperCase()) {
                        const sp = isPerStart ? getPoint(l.performancesdate, l.performancestime, l.loadrate, l.dtype, l.rowID, 'S') : getPoint(l.sdate, l.stime, l.loadrate, l.dtype, l.rowID, 'S');
                        const ep = isPerEnd ? getPoint(l.performanceedate, l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E') : getPoint(l.edate, l.etime, l.loadrate, l.dtype, l.rowID, 'E');

                        // 65 is top of max 65~165 is 100 ~ 0 point
                        points.push({ x: sp.x, y: 1 * td1.height, t: "STEP", id: l.rowID, c: 'S' })
                        points.push({ x: ep.x, y: 7 * td1.height, t: "STEP", id: l.rowID, c: 'E' })
                    }
                }
            }
        })

        points.sort((a, b) => a.x - b.x)

        let pathHtml = ''
        let circleHtml = ''
        // 실제 포인트의 위치를 만든다
        points.forEach((p, i) => {
            circleHtml += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#000" data-key="${p.id}" pointer-events="all"></circle>`
            if (i !== points.length - 1) {
                const np = points[i + 1]
                if ("VARIABLE" === p.t && i !== points.length - 2 ) { // 곡선
                    pathHtml += drawSpline([p.x, p.y, np.x, np.y, points[i + 2].x, points[i + 2].y], 0.6, false);

                } else { // 직선
                    const linepath = `M ${p.x},${p.y} C ${p.x},${p.y} ${np.x},${np.y} ${np.x},${np.y}`
                    pathHtml += `<path d="${linepath}" fill="none" stroke="#000" stroke-width="2px" />`
                }
            }
        })

        lineChartTable.querySelector("svg").insertAdjacentHTML('beforeend', pathHtml) // 라인(path) svg 입력
        lineChartTable.querySelector("svg").insertAdjacentHTML('beforeend', circleHtml) // 포인트(circle) svg 입력
    }
    _drawTableRoot(id) {
        return `<div style="width: 98.3%; margin: 0 12px; clear: both; height: auto;"><table id="${id}" class="report_table" style="width: 100%;border: 2px solid black; border-collapse: collapse;"></table></div>`
    }

    _padTime(i) {
        return i < 10 ? "0" + i : "" + i
    }

    _makeTitleArea() {
        const divHtml = `<div style="width: 2237px;" id="report_chart"></div>`
        this.target.insertAdjacentHTML("beforeend", divHtml)
    }

    _getTitle1Html(totalPages, idx) {
        if (totalPages == 0)
            return `<div style="float:left; width: 680px; font-size: 28px; font-weight: bold; border: 1px solid black; margin: 10px 15px; padding: 10px 20px; text-align: center;">SCHEDULE OF SEA TRIAL (${this.option.hullNum})</div>`
        else
            return `<div style="float:left; width: 680px; font-size: 28px; font-weight: bold; border: 1px solid black; margin: 10px 15px; padding: 10px 20px; text-align: center;">SCHEDULE OF SEA TRIAL (${this.option.hullNum}) (${(Math.floor(idx/this.divide.max)) + 1}/${totalPages})</div>`
    }

    _getTitle2Html() {
        return `<div style="float:left; width: 350px; font-weight: bold; margin: 7px 15px; padding: 20px 20px; font-size: 18px;">BUILDER'S TRIAL & OFFICIAL TRIAL</div>`
    }

    _getTitle3Html() {

        const rpmss = this.option.vsslReqInfos.filter(o => o.reqinfotitle === "RPMSS") // RPM for Ship's Service box1
        const drftbt = this.option.vsslReqInfos.filter(o => o.reqinfotitle === "DRFTBT") // draft:ballast box2
        const rpmst = this.option.vsslReqInfos.filter(o => o.reqinfotitle === "RPMST") // RPM for Speed Trial box3

        let html = `<div style="float:right; width: 680px; font-size: 10px; padding: 10px 0;">`
        html += this._getTitle3Box1Html(rpmss)
        html += this._getTitle3Box2Html(drftbt)
        html += this._getTitle3Box3Html(rpmst)
        html += "</div>"

        return html
    }

    _getTitle3Box1Html(l) {
        let html = `<div style="width: 30%; float: left; margin-right: 10px; padding: 0 5px; border: 1px dashed black; height: 75px;">`
        html += '<div style="text-align: center; margin-bottom: 5px;">&#9670; RPM for Ship\'s Service</div>'
        for (let i = 0; i < l.length; i ++) {
            if (l[i].name && l[i].name != "" && l[i].rpm) {
                html += `
                    <div style="clear:both;">
                        <div style="float:left;">${l[i].name}</div>
                        <div style="float:right;">${this._strToFixed(l[i].rpm, 1)} ${ l[i].unit }</div>
                    </div>
                `
            }
        }
        html += "</div>"
        return html
    }

    _getTitle3Box2Html(l) {
        let html = `<div style="width: 28%; float: left; margin-right: 10px; padding: 0 5px; border: 1px dashed black; height: 75px;">`
        html += `<div style="text-align: center; margin-bottom: 5px;">&#9670; DRAFT : BALLAST</div>`
        for (let i = 0; i < l.length; i ++) {
            if (l[i].name && l[i].name != "" && l[i].rpm) {
                html += `
                    <div style="clear:both; padding: 0 32%;">
                        <div style="float:left;">${l[i].name} :</div>
                        <div style="float:right;">${this._strToFixed(l[i].rpm, 1)} ${ l[i].unit }</div>
                    </div>
                `
            }

        }
        html += `<div style="clear: both; text-align: center;">- Refer to "Scheme of S/T"</div></div>`

        return html
    }

    _getTitle3Box3Html(l) {
        let html = `<div style="width: 30%; float: left; padding: 0 5px; border: 1px dashed black; height: 75px;">`
        html += `<div style="text-align: center; margin-bottom: 5px;">&#9670; RPM FOR SPEED TRIAL</div>`
        for (let i = 0; i < l.length; i ++) {
            if (l[i].name && l[i].name != "" && l[i].rpm) {
                html += `
                    <div style="clear:both;">
                        <div style="float:right;">${l[i].name} : ABT.${this._strToFixed(l[i].rpm, 1)}</div>
                    </div>
                `
            }

        }
        html += `</div>`
        return html
    }

    _strToFixed(t, i) {
        const pointw = t.indexOf(".")
        if (pointw > 0) return t.substring(0, pointw + i + 1)
        else return t
    }

    isValidDate = (value) => {
        return value instanceof Date && !isNaN(value);
    }
}