let _dateTimeList = [];
let _currDateTime = '';			// TC 추가용 날짜시간 추적.
let _currDateTimeHold = '';		// TC 추가용 날짜시간 확정.
let _currSeq = 1;				// TC 추가용 순서.
let _nextUid = -1;				// TC 추가용 UID (_nextUid--).
let _detailPopTcUid = 0;		// TC 삭제용 현재 UID.
let _isMoveAndPop = false;		// Bar 이동해서 팝업 여부.
let _moveAndPopSdate = '';		// Bar 이동해서 팝업 시 sdate 임시 저장.
let _moveAndPopStime = '';		// Bar 이동해서 팝업 시 stime 임시 저장.
let _moveAndPopEdate = '';		// Bar 이동해서 팝업 시 edate 임시 저장.
let _moveAndPopEtime = '';		// Bar 이동해서 팝업 시 etime 임시 저장.

const moveScheduleBox = (id) => {

	document.querySelectorAll("div.focus-schedule-box").forEach(e => {
		e.classList.remove("focus-schedule-box")
	})

	const box = document.querySelector(`div.schedule-box[row-key="${id}"]`)
	if (box) {
		box.setAttribute("tabindex", "-1")
		box.focus()
		box.blur()
		box.classList.add("focus-schedule-box")
	}
}

class ScheduleManager {
	constructor(target, option) {
		this.targetId = target
		this.target = document.querySelector(`#${this.targetId}`)
		this.option = option
		this.labels = []
		this.lineBox = null
		this.ganttBox = null
		this.tooltipErrorMessage = []
		this.initClass = true
	}

	init() {
		if (this.target && this.option.datas.length != 0) {
			// 첫 날짜와 마지막 날짜 검색을 위한 함수
			const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)) && this.isValidDate(new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`)) && ((isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) != "" && (isEmpty(l.performancestime) ? l.stime : l.performancestime) != "" && (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) != "" && (isEmpty(l.performanceetime) ? l.etime : l.performanceetime) != ""))

			if(0 !== tests.length) {
				Object.defineProperties(this.option, {
					'min': { get: function () { return tests.reduce((a, b) => { 
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
					}) } },
					'max': { get: function () { return tests.reduce((a, b) => { 
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
					}) } }
				});
			}

//			if (0 !== tests.length) {
//				Object.defineProperties(this.option, {
//					'min': { get: function () { return tests.reduce((a, b) => { return new Date(`${isEmpty(a.performancesdate) ? a.sdate : a.performancesdate} ${isEmpty(a.performancestime) ? a.stime : a.performancestime}:00`).getTime() < new Date(`${isEmpty(b.performancesdate) ? b.sdate : b.performancesdate} ${isEmpty(b.performancestime) ? b.stime : b.performancestime}`).getTime() ? a : b; }) } },
//					'max': { get: function () { return tests.reduce((a, b) => { return new Date(`${isEmpty(a.performanceedate) ? a.edate : a.performanceedate} ${isEmpty(a.performanceetime) ? a.etime : a.performanceetime}:00`).getTime() > new Date(`${isEmpty(b.performanceedate) ? b.edate : b.performanceedate} ${isEmpty(b.performanceetime) ? b.etime : b.performanceetime}`).getTime() ? a : b; }) } }
//				});
//			}

			// 랜덤 아이디 함수
			const randomID = (length = 8) => {
				return Math.random().toString(16).substr(2, length);
			}

			// 랜덤 아이디 부여, 각 객체를 찾기 쉽게 연결
			this.option.datas.forEach(d => {
				d.rowID = randomID(10)
			})
		}

		if (this.option.min && this.option.max && this.option.min.sdate && this.option.max.edate) {
			this._drawElement()

			window.addEventListener("mouseover", (e) => { // 툴팁 이벤트 구현
				const showTooltip = (t, l, ew, eh, mw, mh, pw) => {
					const iconPos = t.getBoundingClientRect();
					const tooltip = document.querySelector("#chartTooltip")

					while (tooltip.firstChild) { tooltip.removeChild(tooltip.firstChild) }

					if ("" !== l.loadrate) tooltip.insertAdjacentHTML("afterbegin", `<p>Load: ${l.loadrate}%</p>`)
					tooltip.insertAdjacentHTML("afterbegin", `<p>${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime} ~ ${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}</p>`)
					tooltip.insertAdjacentHTML("afterbegin", `<p>계획/전망:</p>`)
					tooltip.insertAdjacentHTML("afterbegin", `<p>${l.tcnum} ${l.desc}</p>`)
					if (pw && "" !== pw) {
						if (pw === "S") tooltip.insertAdjacentHTML("afterbegin", `<p>Schedule Start!!</p>`)
						else if (pw === "E") tooltip.insertAdjacentHTML("afterbegin", `<p>Schedule End</p>`)
						else if (pw === "R") tooltip.insertAdjacentHTML("afterbegin", `<p>Ready Time</p>`)
						else if (pw === "C") tooltip.insertAdjacentHTML("afterbegin", `<p>Schedule Running</p>`)
					}
					tooltip.style.opacity = "1"
					tooltip.style.zIndex = "30"

					const compStyles = window.getComputedStyle(tooltip)

					if (e.pageX + 330 > mw) {
						tooltip.style.left = (e.pageX - 320) + "px";
					} else {
						tooltip.style.left = (e.pageX + 30) + "px";
					}

					if (window.scrollY + iconPos.top + 30 > mh) {
						tooltip.style.top = window.scrollY + iconPos.top + 60 - parseInt(compStyles.height.replace("px", "")) + "px"
					} else {
						tooltip.style.top = (window.scrollY + iconPos.top + 60 - (parseInt(compStyles.height.replace("px", ""))/ 2)) + "px";
					}
				}

				if (e.target && e.target.tagName === "circle") {
					const ll = JSON.parse(JSON.stringify(this.option.datas))
					const key = e.target.getAttribute("data-key")

					const l = ll.find(l => l.rowID === key)
					const x = e.target.getAttribute("cx")
					const y = e.target.getAttribute("cy")

					const c = e.target.getAttribute("c")

					const div = this.target.querySelector(`.${this.lineBox} .data`)
					const rect = div.getBoundingClientRect()

					showTooltip(e.target, l, parseInt(x) + 5, parseInt(y) + 5, rect.width, rect.height, c)
				} else if (e.target && e.target.classList.contains("schedule-box")) {
					const ll = JSON.parse(JSON.stringify(this.option.datas))
					const key = e.target.getAttribute("row-key")
					const l = ll.find(l => l.rowID === key)
					if (e.target.closest("div.schedule-root")) {
						const div = this.target.querySelector(`.${this.ganttBox} .data`)
						const rect = div.getBoundingClientRect()

						const root = e.target.closest("div.schedule-root")
						showTooltip(e.target, l, parseInt(root.style.left.replace("px", "")) + root.getBoundingClientRect().width, parseInt(root.style.top.replace("px", "")) + root.getBoundingClientRect().height, rect.width, rect.height, null)
					}
				} else if (e.target && e.target.tagName === "rect") {

					const x = e.target.getAttribute("x")
					const width = e.target.getAttribute("width")

					if (x && width) {
						const error = this.tooltipErrorMessage.find(err => err.x == x && err.width == width)

						if (error && error.msg.length != 0) {
							const msg = error.msg.join("<br/>")

							const iconPos = e.target.getBoundingClientRect();
							const tooltip = document.querySelector("#chartTooltip")

							while (tooltip.firstChild) { tooltip.removeChild(tooltip.firstChild) }

							tooltip.insertAdjacentHTML("afterbegin", `<p>${msg}</p>`)
							tooltip.style.opacity = "1"
							tooltip.style.zIndex = "30"

							const compStyles = window.getComputedStyle(tooltip)

							if (e.pageX + 330 > error.width) {
								tooltip.style.left = (e.pageX - 320) + "px";
							} else {
								tooltip.style.left = (e.pageX + 30) + "px";
							}

							if (window.scrollY + iconPos.top + 30 > 240) {
								tooltip.style.top = window.scrollY + iconPos.top + 10 - parseInt(compStyles.height.replace("px", "")) + "px"
							} else {
								tooltip.style.top = (e.clientY - 40) + "px";
							}
						}
					}
				} else {
					this._hideTooltip()
				}
			});
		}
		
		this._nowScroll();
	}
	
	_nowScroll() {
		let isNowExist = false;
		let nowStr = '-';
		let nowDateHour = new Date();
		let nowMonthStr = (nowDateHour.getMonth() + 1).toString().padStart(2, '0');  
		let nowDayStr = nowDateHour.getDate().toString().padStart(2, '0');
		let nowHourStr = nowDateHour.getHours().toString().padStart(2, '0');
		nowStr = nowDateHour.getFullYear() + '-' + nowMonthStr + '-' + nowDayStr + '-' + nowHourStr;
		let vLineNow = document.querySelector('.v-line-now');
		
		for(let i = 0; i < _dateTimeList.length; i++) {
			if(nowStr == _dateTimeList[i]) {
				let scrollX = document.getElementById('chartScrollArea');
				let viewArea = document.querySelector('.sec-card');
				document.getElementById(_dateTimeList[i]).classList.add('v-line-now-head');
				vLineNow.setAttribute('style', 'visibility: visible;');
				vLineNow.setAttribute('style', 'left: ' + (i * 30 + 90) + 'px;');
				
				scrollX.addEventListener("scroll", (event) => {
					let leftPos = i * 30 + 90 - scrollX.scrollLeft;
					
					if(leftPos < viewArea.offsetWidth - 30 && leftPos > 60) {
						vLineNow.setAttribute('style', 'visibility: visible;');
						vLineNow.setAttribute('style', 'left: ' + leftPos + 'px;');
					}else {
						vLineNow.setAttribute('style', 'visibility: hidden;');
					}
				});
				
				isNowExist = true;
				break;
			}
		}
		
		if(!isNowExist) {
			vLineNow.setAttribute('style', 'visibility: hidden;');
		}
	}

	_hideTooltip() { // 툴팁 숨기기
		const tooltip = document.querySelector("#chartTooltip")
		if (tooltip) {
			tooltip.style.opacity = "0"
			tooltip.style.zIndex = "-1"
		}
	}

	_getColor(i) { // 간트 차트 라인 색
		const color = ["e9d8a6", "9b2226", "0a9396", "94d2bd", "005f73", "ee9b00", "ca6702", "bb3e03", "ae2012"]
		return color[i]
	}

	_drawElement() {
		this.labels = ['100%', '75%', '50%', '25%', 'STOP', '', 'ASTERN', '']
		if (this.target) while (this.target.firstChild) { this.target.removeChild(this.target.firstChild) }

		if(this.option.isGanttChart || this.option.isLineChart) {
			_dateTimeList = [];
			this._minMaxRefresh();
		}
		
		if (this.option.isGanttChart) this._settingGanttBox()
		if (this.option.isLineChart) this._settingLineBox()

		if (this.option.isGanttChart && this.option.isLineChart) this._scrollSync()
	}

	_settingLineBox() {
		this.lineBox = "lineBox"
		const lineHtml = this._makeLineBoxHtml() // 상단 chart
		this.target.insertAdjacentHTML("afterbegin", lineHtml)
		this._drawLineBox()
	}

	_settingGanttBox() {
		this.ganttBox = "ganttBox"
		const ganttHtml = this._makeGanttBoxHtml() // 하단 gantt
		this.target.insertAdjacentHTML("afterbegin", ganttHtml)
		this._drawGanttBox()
	}

	_ganttBoxSearchSetting() {
		const searchInput = document.getElementById('chartSearchInput');
		const searchBtn = document.getElementById('chartSearchBtn');
		const prevBtn = document.getElementById('chartSearchBtnPrev');
		const nextBtn = document.getElementById('chartSearchBtnNext');
		const searchSpan = document.getElementById('chartSearchMsg');

		let moveIndex = 0
		let finds = []
		searchBtn.addEventListener("click", () => {
			const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)) && this.isValidDate(new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`)) && ((isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) != "" && (isEmpty(l.performancestime) ? l.stime : l.performancestime) != "" && (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) != "" && (isEmpty(l.performanceetime) ? l.etime : l.performanceetime) != ""))
			finds = tests.filter(d => `${d.tcnum} ${d.desc}`.toLowerCase().includes(searchInput.value) || `${d.tcnum} ${d.desc}`.toUpperCase().includes(searchInput.value))
			moveIndex = 0
			if (finds.length != 0) {
				moveScheduleBox(finds[moveIndex].rowID)
				searchSpan.innerText = ` ${moveIndex + 1}/${finds.length}`
			} else {
				searchSpan.innerText = $.i18n.t('chartSearchNoList');
			}

		})

		prevBtn.addEventListener("click", () => {

			moveIndex--
			if (moveIndex < 0) moveIndex = finds.length - 1
			moveScheduleBox(finds[moveIndex].rowID)
			searchSpan.innerText = ` ${moveIndex + 1}/${finds.length}`
		})

		nextBtn.addEventListener("click", () => {
			moveIndex++
			if (moveIndex > (finds.length - 1)) moveIndex = 0
			moveScheduleBox(finds[moveIndex].rowID)
			searchSpan.innerText = ` ${moveIndex + 1}/${finds.length}`
		})
	}

	_drawLineBox() {
		const min = this.option.min.sdate
		const max = this.option.max.edate

		const table = this.target.querySelector(`.${this.lineBox} .lineTable`)
		const thead = table.querySelector("thead")
		const tbody = table.querySelector("tbody")
		const label = this.target.querySelector(`.${this.lineBox}`)

		const dd = this._getDatesStartToLast(min, max)

		let headerhtmlforgroup = ""
		let headerhtml = "<th></th>"
		let bodyhtml = "<td></td>"

		dd.forEach((d, i) => {
			headerhtmlforgroup += `<th colspan="${ i === 0 ? 25 : 24 }">${d}</th>`
			headerhtml += this._drawDate("h", d, i)
			bodyhtml += this._drawDate("b", d, i)
		})

		thead.insertAdjacentHTML('beforeend', `<tr class="ganttHead1">${headerhtmlforgroup}</tr>`)
		thead.insertAdjacentHTML('beforeend', `<tr class="ganttHead2">${headerhtml}</tr>`)
		
		let colspan = dd.length > 0 ? (((dd.length - 1) * 24) + 25) : 1;
		thead.insertAdjacentHTML('beforeend', '<tr><th colspan="' + colspan + '" class="sp-4" style="background:#FFFFFF;"></th></tr>');

		for (let i = 0; i < this.labels.length; i++) {
			tbody.insertAdjacentHTML('beforeend', `<tr data-key="${i}">${bodyhtml}</tr>`)
			if ("" !== this.labels[i]) {
				label.insertAdjacentHTML('beforeend', `<div class="line_chart_label" style="top: ${i * 25 + 55}px">${this.labels[i]}</div>`)
			}
		}

		if (this.option.isGanttChart) {
			this._ganttBoxSearchSetting()
		}

		this._drawLineBoxData();
	}

	_drawLineBoxData() {
		const ll = JSON.parse(JSON.stringify(this.option.datas))

		const table = this.target.querySelector(`.${this.lineBox} .lineTable`)

		// const scheLineChartList = []

		// 시작과 끝에 대한 점 위치 찾기
		const getPoint = (dd, tt, val, dt, id, c) => {

			const s = new Date(`${dd} ${tt}:00`)
			const dataKey = `${dd}-${this._padTime(s.getHours())}`

			const tr = table.querySelector(`tr[data-key="0"]`)
			const td = tr.querySelector(`td[data-key="${dataKey}"]`)

			const left = td.getAttribute("data-position")
			const top = 65

			return {x: parseInt(left) + 30 + ((s.getMinutes() / 60) * 30), y: 100 - val + top, t: dt, id: id, c: c}
		}

		// 일단 모든 포인트에 대해 입력이 필요
		const points = [];

		ll.sort((a, b) => {
			const atime = new Date(`${isEmpty(a.performancesdate) ? a.sdate : a.performancesdate} ${isEmpty(a.performancestime) ? a.stime : a.performancestime}`).getTime()
			const btime = new Date(`${isEmpty(b.performancesdate) ? b.sdate : b.performancesdate} ${isEmpty(b.performancestime) ? b.stime : b.performancestime}`).getTime()

			if (atime > btime) return 1
			else return -1
		})

		function ensureNumber(value) {
			const parsedValue = parseFloat(value);

			// 값이 숫자이면 그대로 반환하고, 그렇지 않으면 0을 반환합니다.
			return !isNaN(parsedValue) ? parsedValue : 0;
		}

		function getStart(item) {
			let date = new Date((isEmpty(item.performancesdate) ? item.sdate : item.performancesdate) + ' ' + (isEmpty(item.performancestime) ? item.stime : item.performancestime))

			date.setMinutes(date.getMinutes() - ensureNumber(item.readytime))
			return date;
		}

		const _this = this
		function findGaps(data) {
			// 시작 시간과 종료 시간을 Date 객체로 변환합니다.
			data = data.map(item => ({
				...item,
				start: getStart(item),
				end: new Date((isEmpty(item.performanceedate) ? item.edate : item.performanceedate) + ' ' + (isEmpty(item.performanceetime) ? item.etime : item.performanceetime)),
			}));

			// 시작 시간을 기준으로 객체들을 정렬합니다.
			data.sort((a, b) => a.start - b.start);

			// 최소 시간과 최대 시간을 찾습니다.
			const minTime = data[0].start;
			const maxTime = data.reduce((max, item) => (item.end > max ? item.end : max), data[0].end);

			// 비어있는 시간을 찾습니다.
			const gaps = [];
			let start = minTime;

			for (const item of data) {
				if (start < item.start && "CRASH" !== item.dtype.toUpperCase()) {
					gaps.push({
						sdate: `${start.getFullYear()}-${_this._padTime(start.getMonth() + 1)}-${_this._padTime(start.getDate())}`,
						stime: `${_this._padTime(start.getHours())}:${_this._padTime(start.getMinutes())}`,
						edate: `${item.start.getFullYear()}-${_this._padTime(item.start.getMonth() + 1)}-${_this._padTime(item.start.getDate())}`,
						etime: `${_this._padTime(item.start.getHours())}:${_this._padTime(item.start.getMinutes())}`,
					});
				}
				if (start < item.end) start = item.end
			}

			// 마지막 예약 후 최대 시간까지의 간격을 확인합니다.
			// if (start < maxTime) {
			// 	gaps.push({
			// 		sdate: `${start.getFullYear()}-${_this._padTime(start.getMonth() + 1)}-${_this._padTime(start.getDate())}`,
			// 		stime: `${_this._padTime(start.getHours())}:${_this._padTime(start.getMinutes())}`,
			// 		edate: `${maxTime.getFullYear()}-${_this._padTime(maxTime.getMonth() + 1)}-${_this._padTime(maxTime.getDate())}`,
			// 		etime: `${_this._padTime(maxTime.getHours())}:${_this._padTime(maxTime.getMinutes())}`,
			// 	});
			// }

			return gaps;
		}

		function findGapsByDate(data) {
			// 날짜별로 데이터를 그룹화합니다.
			const groupedData = data.reduce((grouped, item) => {
				const key = isEmpty(item.performancesdate) ? item.sdate : item.performancesdate;
				if (!grouped[key]) {
					grouped[key] = [];
				}
				grouped[key].push(item);
				return grouped;
			}, {});

			// 각 날짜별 그룹에 대해 비어있는 시간을 찾습니다.
			const gaps = {};
			for (const date in groupedData) {
				gaps[date] = findGaps(groupedData[date]);
			}

			return gaps;
		}

		function hasOverlappingLoadRate(items) {
			const overlaps = {
				rtn : false,
				list: []
			}
			for (let i = 0; i < items.length; i++) {
				for (let j = i + 1; j < items.length; j++) {
					const itemA = items[i];
					const itemB = items[j];

					const startA = new Date((isEmpty(itemA.performancesdate) ? itemA.sdate : itemA.performancesdate) + 'T' + (isEmpty(itemA.performancestime) ? itemA.stime : itemA.performancestime));
					const endA = new Date((isEmpty(itemA.performanceedate) ? itemA.edate : itemA.performanceedate) + 'T' + (isEmpty(itemA.performanceetime) ? itemA.etime : itemA.performanceetime));
					const startB = new Date((isEmpty(itemB.performancesdate) ? itemB.sdate : itemB.performancesdate) + 'T' + (isEmpty(itemB.performancestime) ? itemB.stime : itemB.performancestime));
					const endB = new Date((isEmpty(itemB.performanceedate) ? itemB.edate : itemB.performanceedate) + 'T' + (isEmpty(itemB.performanceetime) ? itemB.etime : itemB.performanceetime));

					const overlapping =
						(startA <= startB && endA > startB) ||
						(startA < endB && endA >= endB) ||
						(startB <= startA && endB > startA) ||
						(startB < endA && endB >= endA);

					if (overlapping && itemA.loadrate !== itemB.loadrate) {
						overlaps.rtn = true

						const min = startA < startB ? startA : startB
						const max = endA < endB ? endB : endA

						overlaps.list.push({
							sdate: `${min.getFullYear()}-${_this._padTime(min.getMonth() + 1)}-${_this._padTime(min.getDate())}`,
							stime: `${_this._padTime(min.getHours())}:${_this._padTime(min.getMinutes())}`,
							edate: `${max.getFullYear()}-${_this._padTime(max.getMonth() + 1)}-${_this._padTime(max.getDate())}`,
							etime: `${_this._padTime(max.getHours())}:${_this._padTime(max.getMinutes())}`,
							desc1: itemA.tcnum,
							desc2: itemB.tcnum
						})
					}
				}
			}
			return overlaps;
		}

		const data = ll.filter(l => "" != (isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) && "" != (isEmpty(l.performancestime) ? l.stime : l.performancestime) && "" != (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) && "" != (isEmpty(l.performanceetime) ? l.etime : l.performanceetime))

		const gaps = findGapsByDate(data);
		let validateMessage = ""
		let emptyBoxRect = ""
		let countitem = 0
		for (const gkey of Object.keys(gaps)) {
			if (gaps[gkey].length != 0) {
				countitem += gaps[gkey].length
				for (const obj of gaps[gkey]) {
					const sp = getPoint(isEmpty(obj.performancesdate) ? obj.sdate : obj.performancesdate, isEmpty(obj.performancestime) ? obj.stime : obj.performancestime, '', '', '', 'T')
					const ep = getPoint(isEmpty(obj.performanceedate) ? obj.edate : obj.performanceedate, isEmpty(obj.performanceetime) ? obj.etime : obj.performanceetime, '', '', '', 'T')

					const msg = $.i18n.t('reportSchedule:noScheMsg').replace("{0}", `${isEmpty(obj.performancesdate) ? obj.sdate : obj.performancesdate} ${isEmpty(obj.performancestime) ? obj.stime : obj.performancestime}`).replace("{1}", `${isEmpty(obj.performanceedate) ? obj.edate : obj.performanceedate} ${isEmpty(obj.performanceetime) ? obj.etime : obj.performanceetime}`)
					validateMessage += (validateMessage == "" ? "" : "<br/>") + msg

					if (!emptyBoxRect.includes(`x="${sp.x}" y="0" width="${ep.x - sp.x}" height="240"`)) {
						emptyBoxRect += `<rect x="${sp.x}" y="0" width="${ep.x - sp.x}" height="240" fill="red" fill-opacity="0.1" />`
						this.tooltipErrorMessage.push({x: sp.x, width: ep.x - sp.x, msg: [msg]})
					} else {
						const err = this.tooltipErrorMessage.find(err => err.x === sp.x && err.width === (ep.x - sp.x))
						err.msg.push(msg)
					}
				}
			}
		}

		const duplCheckdata = ll.filter(l => "" != (isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) && "" != (isEmpty(l.performancestime) ? l.stime : l.performancestime) && "" != (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) && "" != (isEmpty(l.performanceetime) ? l.etime : l.performanceetime)
			&& "LOAD" === l.ctype.toUpperCase() && "" !== l.loadrate)

		const dupl = hasOverlappingLoadRate(duplCheckdata)

		if (dupl.rtn) {
			for (const obj of dupl.list) {
				const sp = getPoint(isEmpty(obj.performancesdate) ? obj.sdate : obj.performancesdate, isEmpty(obj.performancestime) ? obj.stime : obj.performancestime, '', '', '', 'T')
				const ep = getPoint(isEmpty(obj.performanceedate) ? obj.edate : obj.performanceedate, isEmpty(obj.performanceetime) ? obj.etime : obj.performanceetime, '', '', '', 'T')

				const msg = $.i18n.t('reportSchedule:loadCheckMsg').replace("{0}", `${obj.desc1}`).replace("{1}", `${obj.desc2}`)
				validateMessage += (validateMessage == "" ? "" : "<br/>") + msg

				if (!emptyBoxRect.includes(`x="${sp.x}" y="0" width="${ep.x - sp.x}" height="240"`)) {
					emptyBoxRect += `<rect x="${sp.x}" y="0" width="${ep.x - sp.x}" height="240" fill="yellow" fill-opacity="0.1" />`
					this.tooltipErrorMessage.push({x: sp.x, width: ep.x - sp.x, msg: [msg]})
				} else {
					const err = this.tooltipErrorMessage.find(err => err.x === sp.x && err.width === (ep.x - sp.x))
					err.msg.push(msg)
				}
			}
		}

		ll.forEach((l, i) => {

			if (this.isValidDate(new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)) && this.isValidDate(new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`))) {
				// ready time 입력
				if ('LOAD' === l.ctype.toUpperCase() && "" !== l.loadrate && "" !== l.readytime) {
					const raedyX = (30 / 60) * parseInt(l.readytime)
					const pointY = parseInt(l.loadrate)
					if (0 !== raedyX && 0 !== pointY) {
						const raedyY = 100 + 65

						const sp = getPoint(isEmpty(l.performancesdate) ? l.sdate : l.performancesdate, isEmpty(l.performancestime) ? l.stime : l.performancestime, l.loadrate, l.dtype, l.rowID, 'S')

						const ff = points.filter(p => p.x > sp.x - raedyX || p.x == sp.x - raedyX)

						if (ff.length == 0 && points.length != 0 && 165 === points.at(-1).y) {
							points.push({ x: sp.x - raedyX, y: raedyY, t: "STEP", id: l.rowID, c: 'R' })
							points.push({ x: sp.x - 30, y: raedyY, t: "STEP", id: l.rowID, c: 'R' })
						}
					}
				}

				if ("LOAD" === l.ctype.toUpperCase()) {
					if (("STEP" === l.dtype.toUpperCase() || "VARIABLE" === l.dtype.toUpperCase()) && "" !== l.loadrate) {
						const sp = getPoint(isEmpty(l.performancesdate) ? l.sdate : l.performancesdate, isEmpty(l.performancestime) ? l.stime : l.performancestime, l.loadrate, l.dtype, l.rowID, 'S')
						const ep = getPoint(isEmpty(l.performanceedate) ? l.edate : l.performanceedate, isEmpty(l.performanceetime) ? l.etime : l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E')

						points.push(sp)
						points.push(ep)
					} else if ("REMOTE" === l.dtype.toUpperCase()) {
						const sp = getPoint(isEmpty(l.performancesdate) ? l.sdate : l.performancesdate, isEmpty(l.performancestime) ? l.stime : l.performancestime, l.loadrate, l.dtype, l.rowID, 'S')
						const ep = getPoint(isEmpty(l.performanceedate) ? l.edate : l.performanceedate, isEmpty(l.performanceetime) ? l.etime : l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E')

						const addX = (ep.x - sp.x) / 3
						const centerY = 100 + 65 - 30
						const asternY = 100 + 25 + 65

						points.push({ x: sp.x, y: asternY, t: "STEP", id: l.rowID, c: 'S' })
						points.push({ x: sp.x + addX, y: centerY, t: "STEP", id: l.rowID, c: 'C' })
						points.push({ x: ep.x - addX, y: asternY, t: "STEP", id: l.rowID, c: 'C' })
						// points.push({ x: ep.x, y: next.y, t: "STEP", id: l.rowID, c: 'C' })

					} else if ("CRASH" === l.dtype.toUpperCase()) {
						const sp = getPoint(isEmpty(l.performancesdate) ? l.sdate : l.performancesdate, isEmpty(l.performancestime) ? l.stime : l.performancestime, l.loadrate, l.dtype, l.rowID, 'S')
						const ep = getPoint(isEmpty(l.performanceedate) ? l.edate : l.performanceedate, isEmpty(l.performanceetime) ? l.etime : l.performanceetime, l.loadrate, l.dtype, l.rowID, 'E')

						// 65 is top of max 65~165 is 100 ~ 0 point
						points.push({ x: sp.x, y: 65, t: "STEP", id: l.rowID, c: 'S' })
						points.push({ x: ep.x, y: 100 + 25 + 65, t: "STEP", id: l.rowID, c: 'E' })
					}
				}
			}
		})

		points.sort((a, b) => a.x - b.x)

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
					html += `<path d="${path}" fill="none" stroke="#0671E0" stroke-width="2px" />`
				}

				return html
			} else {
				for(let i=0;i<n-4;i+=2){
					cp=cp.concat(getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
				}
				let html = "";
				for(let i=2;i<pts.length-5;i+=2){
					const path = `M ${pts[i]},${pts[i + 1]} C ${cp[2 * i - 2]},${cp[2 * i - 1]} ${cp[2 * i]},${cp[2 * i + 1]} ${pts[i + 2]},${pts[i + 3]}`
					html += `<path d="${path}" fill="none" stroke="#0671E0" stroke-width="2px" />`
				}

				html += `<path d="M ${pts[0]},${pts[1]} Q ${cp[0]},${cp[1]} ${pts[2]},${pts[3]}" fill="none" stroke="#0671E0" stroke-width="2px" />`
				//html += `<path d="M ${pts[n-2]},${pts[n-1]} Q ${cp[2*n-10]},${cp[2*n-9]} ${pts[n-4]},${pts[n-3]}" fill="none" stroke="#444cf7" stroke-width="2px" />`
				return html
			}
		}

		if (table.querySelector("svg")) table.removeChild(table.querySelector("svg"))

		const svgroot = `<svg width="100%" height="${this.labels.length * 25 + 40}" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0; background: linear-gradient(180deg, #C2D1E1 -22.28%, rgba(241, 247, 252, 0.876106) -1.04%, rgba(238, 245, 252, 0) 41.46%);">
            <style>
            circle {
                cursor:pointer;
            }
            </style>
            ${emptyBoxRect}
            ${emptyBoxRect}
			<line x1="0" y1="${5 * 25 + 25 / 2 + 65}" x2="100%" y2="${5 * 25 + 25 / 2 + 65}" stroke="#FFF8F5" stroke-width="75px" stroke-opacity="30%"></line>
            <line x1="0" y1="${4 * 25 + 65}" x2="100%" y2="${4 * 25 + 65}" stroke="#F35625" stroke-width="2px"></line>
            
        </svg>`

		table.insertAdjacentHTML('beforeend', svgroot)
		const svg = table.querySelector("svg")
		let pathHtml = ''
		let circleHtml = ''
		// 실제 포인트의 위치를 만든다
		points.forEach((p, i) => {

			circleHtml += `<circle cx="${p.x}" cy="${p.y}" r="5.5" fill="#0671E0" data-key="${p.id}" pointer-events="all" onclick="moveScheduleBox('${p.id}')" ${p.c ? 'c="' + p.c + '"': '' }></circle>`

			if (i !== points.length - 1) {
				const np = points[i + 1]
				if ("VARIABLE" === p.t && i !== points.length - 2 ) { // 곡선
					pathHtml += drawSpline([p.x, p.y, np.x, np.y, points[i + 2].x, points[i + 2].y], 0.6, false);

				} else { // 직선
					const linepath = `M ${p.x},${p.y} C ${p.x},${p.y} ${np.x},${np.y} ${np.x},${np.y}`
					pathHtml += `<path d="${linepath}" fill="none" stroke="#0671E0" stroke-width="2px" />`
				}
			}
		})

		svg.insertAdjacentHTML('beforeend', pathHtml) // 라인(path) svg 입력
		svg.insertAdjacentHTML('beforeend', circleHtml) // 포인트(circle) svg 입력

		if ("" !== validateMessage && this.initClass) {
//			alertPopHtml(validateMessage)		// 25.02.26 : 주석 처리.
			this.initClass = false
		}
	}

	_drawGanttBox() {
		const min = this.option.min.sdate
		const max = this.option.max.edate;

		const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)) && this.isValidDate(new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`)) && ((isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) != "" && (isEmpty(l.performancestime) ? l.stime : l.performancestime) != "" && (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) != "" && (isEmpty(l.performanceetime) ? l.etime : l.performanceetime) != ""))

		let ll = JSON.parse(JSON.stringify(tests))

		ll.sort((a, b) => {
			if (parseInt(a.seq) > parseInt(b.seq)) return 1
			else if (parseInt(a.seq) < parseInt(b.seq)) return -1
			else return 0
		})

		const categorys = ll.filter((arr, index, callback) => index === callback.findIndex(t => t.category === arr.category));
		categorys.sort((a, b) => {
			if (a.category > b.category) return 1;
			else if (a.category < b.category) return -1;
			else return 0;
		})

		const table = this.target.querySelector(`.${this.ganttBox} .ganttTable`)
		const tbody = table.querySelector("tbody")
		const tfoot = table.querySelector("tfoot")
		
		const chartContextMenu = document.getElementById('chartContextMenu');
		
		document.addEventListener('click', function () {
			chartContextMenu.style.display = 'none';
		});
		
		table.addEventListener('contextmenu', function (e) {
			e.preventDefault();

			_currDateTimeHold = _currDateTime;	
			let currSeqPosY = e.clientY - 460 + document.getElementById('chartScrollArea').scrollTop;
//			_currSeq = (currSeqPosY / 25) + (currSeqPosY % 25 > 0 ? 1 : 0); // 값 / 25 = 몫, 값 % 25 = 나머지 있으면 +1 : 몫 + 나머지결과
			_currSeq = currSeqPosY / 25; // 값 / 25 = 몫
			
			if(isNanEmpty(_currSeq)) {
				_currSeq = 1;
			}
			
			_currSeq = _currSeq.toFixed();
			
		    chartContextMenu.style.left = (e.clientX - 126) + 'px';
		    chartContextMenu.style.top = (e.clientY - 220) + 'px';
		    chartContextMenu.style.display = 'block';
			    
		    chartContextMenu.innerHTML = '';
		    chartContextMenu.insertAdjacentHTML('beforeend', '<button type="button" class="bt-obj bt-tertiary" onClick="addTc()">' + 'TC 추가' + '</button>');
		});

		const dd = this._getDatesStartToLast(min, max)

		let bodyhtml = "<td></td>"

		dd.forEach((d, i) => {
			bodyhtml += this._drawDate("b", d, i)
		})
		
		ll.forEach((l, i) => {
			const isEmptyPerf = isEmpty(l.performancesdate);
			const s = new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)
			const e = new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`)

			if (this.isValidDate(s) && this.isValidDate(e)) {
				const tr = document.createElement("tr");
				tr.id = 'tr_' + i;
				tbody.appendChild(tr);
				tr.insertAdjacentHTML('beforeend', `${bodyhtml}`);

				const duration = e.getTime() - s.getTime();
				const width = (duration / 1000 / 60 / 60) * 30;

				const dataKey = `${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate}-${ this._padTime(s.getHours()) }`;
				const highlight = isEmpty(l.performancesdate) ? '' : 'background: #FFFF00;';
				const td = tr.querySelector(`td[data-key="${dataKey}"]`);
				
				if (td && width !== 0) {
					const color = categorys.findIndex(c => c.category === l.category)
					const left = td.getAttribute("data-position")
					const top = (i) * 25 + 15

					const tcnumX = (l.tcnum.length * -8) - 6;
					const descX = width + 6;
					
					let div = `<div data-uid="${l.uid}" class="schedule-root" style="z-index: 20; position: absolute; left: ${parseInt(left) + 30 + ((s.getMinutes() / 60) * 30)}px; top: ${top}px; width: ${width}px;">
				                    <div style="position: absolute; left: ${tcnumX}px; top: -8px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--neutral-700); white-space: nowrap; height: 0px;">${l.tcnum}<span class="time"></span></div>
				                    <div style="position: absolute; left: ${descX}px; top: -9px; font-size: 11px; font-weight: 400; line-height: 16px; color: var(--neutral-600); white-space: nowrap; height: 0px;"><span style="${highlight}">${l.desc}</span><span class="time"></span></div>
				                    <div row-key="${l.rowID}" class="schedule-box" style="height: 12px; background-color: #${this._getColor(color)}; border-radius: 2px; ${this.option.isEditable ? 'cursor:pointer;' : ''}"></div>
				                </div>`;

					if(l.flag == 'D') {
						div = `<div data-uid="${l.uid}" class="schedule-root" style="z-index: 20; position: absolute; left: ${parseInt(left) + 30 + ((s.getMinutes() / 60) * 30)}px; top: ${top}px; width: ${width}px;">
				                    <div style="position: absolute; left: ${tcnumX}px; top: -8px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--neutral-700); white-space: nowrap; height: 0px; text-decoration:line-through;">${l.tcnum}<span class="time"></span></div>
				                    <div style="position: absolute; left: ${descX}px; top: -9px; font-size: 11px; font-weight: 400; line-height: 16px; color: var(--neutral-600); white-space: nowrap; height: 0px; text-decoration:line-through;"><span style="${highlight}">${l.desc}</span><span class="time"></span></div>
				                    <div row-key="${l.rowID}" class="schedule-box" style="height: 12px; background-color: #${this._getColor(color)}; border-radius: 2px; ${this.option.isEditable ? 'cursor:pointer;' : ''}"></div>
				                </div>`;
					}

					td.insertAdjacentHTML("afterbegin", div)

					if (this.option.isEditable) {

						let prevx = 0
						let prevy = 0
						let last = 0
						const _this = this
						const target = td.querySelector("div")
						target.addEventListener("mousedown", (e) => {
							e.preventDefault();
							_this._hideTooltip();
							const originDiv = e.target.closest("div.schedule-root");
							let originIndex = (parseInt(originDiv.style.top.replace("px", "")) - 15) / 25;

							let isRightButton;
							e = e || window.event;

							if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
								isRightButton = e.which == 3;
							else if ("button" in e)  // IE, Opera
								isRightButton = e.button == 2;
							let moveTox = false
							let moveToy = false
							if (!isRightButton) { // left click event
								prevx = e.pageX - target.offsetLeft
								prevy = e.pageY - target.offsetTop
								const mouseMoveHandler = function (e) {
									e.preventDefault()
									_this._hideTooltip()

									const x = e.pageX - target.offsetLeft
									const y = e.pageY - target.offsetTop
									const range = x - prevx * 1
									const range2 = y - prevy * 1

									if (range !== 0) moveTox = true
									else if (range2 !== 0) moveToy = true

									if (moveTox) {
										const style = window.getComputedStyle(target);
										const left = parseInt(style.left, 10)
										const width = parseInt(style.width, 10);
										const max = parseInt(target.closest("tr").lastChild.getAttribute("data-position")) + 30

										if ((left + range) % 5 === 0) {
											if (((left + width + range - 30)) < max + 4) {
												target.style.left = `${left + range}px`
											} else {
												target.style.left = `${max - width + 30}px`
											}
											target.querySelector("span.time").innerText = ` (${calLefttoTime(left + range)})`
											last = left + range
										}
									}

									if (moveTox || moveToy) {
										if (_this.option.isEditable && e.target.closest("tr") && e.target.closest("tbody")) {
											const target = e.target.closest("tr")
											if (target) {
												if(target.querySelector(".last-row")) {
													const overEle = tfoot.querySelector(".over_tr_row")
													overEle.style.display = 'none'
													overEle.setAttribute("data-isclick", "F")
												} else {
													const overEle = tfoot.querySelector(".over_tr_row")
													overEle.style.display = ''
													overEle.style.top = (target.rowIndex * 25) + 'px'
													overEle.setAttribute("data-isclick", "T")

												}
											}
										}
									}
								};

								const calLefttoTime = (l) => {
									let hour = ((l - 30) / 30)
									let min = ((l - 30) % 30) * 2

									hour = Math.floor(hour) < 0 ? 0 : Math.floor(hour)
									hour = hour > 23 ? hour - ((hour / 24) * 24) + (hour % 24) : hour

									min = min < 0 ? 0 : min
									return `${ _this._padTime(hour) }:${ _this._padTime(min) }`
								}

								const mouseUpHandler = function (e) {
									e.preventDefault()
									e.stopPropagation()
									_this._hideTooltip()

									let copyObj = JSON.parse(JSON.stringify(_this.option.datas));
									
									/// 25.02.26 : 추가.
									_isMoveAndPop = false;
									const uidTemp = originDiv.getAttribute("data-uid");
									const tlTemp = copyObj.find(o => o.uid == uidTemp);
									_moveAndPopSdate = tlTemp["sdate"];
									_moveAndPopStime = tlTemp["stime"];
									_moveAndPopEdate = tlTemp["edate"];
									_moveAndPopEtime = tlTemp["etime"];
									///-- 25.02.26 : 추가.

									const overEle = tfoot.querySelector(".over_tr_row")

									if (moveTox) {
										_isMoveAndPop = true;	// 25.02.26 : 추가.

										const left = parseInt(target.style.left.replace("px", ""));
										const width = parseInt(target.style.width.replace("px", ""));
										const min = 30;
										const max = parseInt(target.closest("tr").lastChild.getAttribute("data-position")) + 30
										let position = 0;
										let endLeft = 0;

										if (left < min) { // min 보다 작으면
											endLeft = min
											position = 0
										} else if (left + width - 30 > max) { // max 보다 크면
											endLeft = max - width + 30
											position = ((max - width) / 30) * 30
										} else { // 아닐 경우

											endLeft = last
											position = Math.floor(((last) / 30)) * 30 - 30
										}

										if (last != 0) {
											target.style.left = `${endLeft}px`;
											const td = target.closest("tr").querySelector(`td[data-position="${position}"]`);
											
											if(td) {
												td.appendChild(target);
												
												let tempIdx = i;
												let tempEmptyCnt = 0;
												
												for(let x = 0; x < copyObj.length; x++) {
													const tempS = new Date(`${isEmpty(copyObj[x].performancesdate) ? copyObj[x].sdate : copyObj[x].performancesdate} ${isEmpty(copyObj[x].performancestime) ? copyObj[x].stime : copyObj[x].performancestime}:00`);
													const tempE = new Date(`${isEmpty(copyObj[x].performanceedate) ? copyObj[x].edate : copyObj[x].performanceedate} ${isEmpty(copyObj[x].performanceetime) ? copyObj[x].etime : copyObj[x].performanceetime}:00`);

													if(_this.isValidDate(tempS) && _this.isValidDate(tempE)) {
														if(i == x - tempEmptyCnt) {
															tempIdx = x;
															break;
														}
													}else {
														tempEmptyCnt++;
													}
												}
												

												const kk = td.getAttribute("data-key");
												copyObj[tempIdx].sdate = `${kk.split("-")[0]}-${kk.split("-")[1]}-${kk.split("-")[2]}`;
												copyObj[tempIdx].stime = calLefttoTime(endLeft);

												let sdate = new Date(`${copyObj[tempIdx].sdate} ${copyObj[tempIdx].stime}`);
												sdate.setMinutes(sdate.getMinutes() + parseInt(copyObj[tempIdx].per));

												copyObj[tempIdx].edate = `${sdate.getFullYear()}-${_this._padTime(sdate.getMonth() + 1)}-${_this._padTime(sdate.getDate())}`;
												copyObj[tempIdx].etime = `${_this._padTime(sdate.getHours())}:${_this._padTime(sdate.getMinutes())}`;

												if("R" == copyObj[tempIdx].flag) copyObj[tempIdx].flag = "U";

												// obj.tcnum != tcnum 
												// && isEmpty(obj.performancesdate) 
													// tcnum == obj.sametcnum
													// || (!isEmptyStn && (obj.tcnum == sametcnum || obj.sametcnum == sametcnum))
														// left 이동
														// 시작/완료 변경
												let sametcnum = copyObj[tempIdx].sametcnum;
												let tcnum = copyObj[tempIdx].tcnum;
												let isEmptyStn = isEmpty(sametcnum);
												let emptyDateObjCnt = 0;
												
												for(let x = 0; x < copyObj.length; x++) {
													const tempS = new Date(`${isEmpty(copyObj[x].performancesdate) ? copyObj[x].sdate : copyObj[x].performancesdate} ${isEmpty(copyObj[x].performancestime) ? copyObj[x].stime : copyObj[x].performancestime}:00`);
													const tempE = new Date(`${isEmpty(copyObj[x].performanceedate) ? copyObj[x].edate : copyObj[x].performanceedate} ${isEmpty(copyObj[x].performanceetime) ? copyObj[x].etime : copyObj[x].performanceetime}:00`);

													if(_this.isValidDate(tempS) && _this.isValidDate(tempE)) {
														let stn = copyObj[x].sametcnum;
														let tn = copyObj[x].tcnum;
														
														if(tn != tcnum && isEmpty(copyObj[x].performancesdate)) {
															if(tcnum == stn || (!isEmptyStn && (tn == sametcnum || stn == sametcnum))) {
																const s = new Date(`${copyObj[x].sdate} ${copyObj[x].stime}:00`);
																const dataKey = `${copyObj[x].sdate}-${_this._padTime(s.getHours()) }`;
																const tr = document.getElementById('tr_' + (x - emptyDateObjCnt));
																const target = tr.querySelector(`td[data-key="${dataKey}"]`).querySelector("div");
																target.style.left = `${endLeft}px`;
																const td = target.closest("tr").querySelector(`td[data-position="${position}"]`);
																
																if(td) {
																	td.appendChild(target);
															
																	copyObj[x].sdate = copyObj[tempIdx].sdate;
																	copyObj[x].stime = copyObj[tempIdx].stime;
																	copyObj[x].edate = copyObj[tempIdx].edate;
																	copyObj[x].etime = copyObj[tempIdx].etime;
					
																	if('R' == copyObj[x].flag) {
																		copyObj[x].flag = 'U';
																	}
																}
															}
														}
													}else {
														emptyDateObjCnt++;
													}
												}
											}
										}

										moveTox = false;
										setTimeout(function () {
											table.querySelectorAll(".time").forEach(n => {
												n.innerText = ""
											})
										}, 100);
										
										_this.setData(copyObj);
										applyChart();
									}

									if (moveToy) {
										_isMoveAndPop = true;	// 25.02.26 : 추가.

										if ("T" === overEle.getAttribute("data-isclick")) {

											const rowIndex = parseInt(overEle.style.top.replace("px", "")) / 25

											if (originIndex != rowIndex) {
												const moveObj = (originIndex, rowIndex) => {

													const originDiv = document.querySelector(".ganttTable").querySelectorAll("tr")[originIndex].querySelector("div.schedule-root")
													const targetDiv = document.querySelector(".ganttTable").querySelectorAll("tr")[rowIndex].querySelector("div.schedule-root")

													const originKey = originDiv.getAttribute("data-uid")
													const targetKey = targetDiv.getAttribute("data-uid")

													const oIndex = copyObj.findIndex(o => o.uid == originKey)
													const rIndex = copyObj.findIndex(o => o.uid == targetKey)

													const originTd = originDiv.closest("td")
													const targetTd = targetDiv.closest("td")

													const tempTop = originDiv.style.top
													originDiv.style.top = targetDiv.style.top
													targetDiv.style.top = tempTop

													originTd.removeChild(originDiv)
													targetTd.removeChild(targetDiv)

													originTd.appendChild(targetDiv)
													targetTd.appendChild(originDiv)

													const temObj1 = JSON.parse(JSON.stringify(copyObj[oIndex]))
													const temObj2 = JSON.parse(JSON.stringify(copyObj[rIndex]))
													const tem1Seq = temObj1.seq
													const tem2Seq = temObj2.seq

													temObj1.seq = tem2Seq
													temObj2.seq = tem1Seq

													copyObj[oIndex] = temObj2
													copyObj[rIndex] = temObj1

													copyObj[oIndex].flag = "U"
													copyObj[rIndex].flag = "U"
												}

												if (originIndex < rowIndex) {
													for (let i = originIndex; i < rowIndex; i ++) {
														moveObj(i, i+1)
													}
												} else {
													for (let i = originIndex; i > rowIndex; i --) {
														moveObj(i, i-1)
													}
												}
											}
										}
									}

									copyObj.sort((a, b) => {
										if (parseInt(a.seq) > parseInt(b.seq)) return 1
										else if (parseInt(a.seq) < parseInt(b.seq)) return -1
										else 0
									})

									_this.setData(copyObj)
									_this._drawLineBoxData()
									if (moveToy) applyChart()

									moveToy = false

									overEle.style.display = 'none'
									overEle.setAttribute("data-isclick", "F")

									if(isEmptyPerf) {
										document.removeEventListener('mousemove', mouseMoveHandler);
									}
									
									document.removeEventListener('mouseup', mouseUpHandler);
									
									/// 25.02.26 : 이동.
									copyObj = JSON.parse(JSON.stringify(_this.option.datas));

									{
										const modal = document.querySelector("#scheduleDetailModal")
										const body = modal.querySelector(".modal-body")
	
										const uid = originDiv.getAttribute("data-uid")
										const tl = copyObj.find(o => o.uid == uid)
	
										// const tl = copyObj[originIndex]
										
										let isPerSdate = false;
										let isPerEdate = false;

										// DATA SETTING
										Object.keys(tl).forEach(k => {
											if ("codedetuid" === k) {
												// data-codeuid
												body.querySelector(`[name="scheTcnum"]`).setAttribute("data-codeuid", tl[k]);
											} else if ("seq" === k || "per" === k || "readytime" === k) {
												body.querySelector(`[name="${k}"]`).value = getFloatVal(tl[k])
											} else if ("loadrate" === k) {
												body.querySelector(`[name="${k}"]`).value = getLoadRate(tl[k] + "", true)
											} else if (body.querySelector(`[name="${k}"]`)) {
												body.querySelector(`[name="${k}"]`).value = tl[k]
											}
											
											if('performancesdate' == k && !isEmpty(tl[k])) {
												isPerSdate = true;
											}
											
											if('performanceedate' == k && !isEmpty(tl[k])) {
												isPerEdate = true;
											}
											
											if('uid' === k) {
												_detailPopTcUid = tl[k];
											}
										}) 
												
										body.querySelector(`[name="scheTcnum"]`).value = tl["tcnum"];
										
										// 25.02.26 : 추가.
										document.getElementById('detailPopSubTitle').innerText = tl["tcnum"] + ' ' + body.querySelector(`[name="desc"]`).value;
										document.getElementById('detailPopCtypeLoadrate').innerText = body.querySelector(`[name="ctype"]`).value + ' / ' + body.querySelector(`[name="loadrate"]`).value;
										document.getElementById('detailPopReadTm').innerText = ' / ' + body.querySelector(`[name="readytime"]`).value;
										
										document.getElementById('detailPopBtnPlan').classList.remove('bt-primary');
										document.getElementById('detailPopBtnPlan').classList.remove('bt-secondary');
										document.getElementById('detailPopBtnResult').classList.remove('bt-primary');
										document.getElementById('detailPopBtnResult').classList.remove('bt-secondary');
											
										if(isPerSdate && isPerEdate) {
											// 250418 : 수정 //
											body.querySelector(`[name="sdateTimeTemp"]`).value = tl["performancesdate"] + 'T' + tl["performancestime"];
											body.querySelector(`[name="edateTimeTemp"]`).value = tl["performanceedate"] + 'T' + tl["performanceetime"];
											//-- 250418 --//
											
											document.getElementById('detailPopBtnPlan').classList.add('bt-secondary');
											document.getElementById('detailPopBtnResult').classList.add('bt-primary');
											
											// 25.04.08 : 추가.
											body.querySelector(`[name="performancesdate"]`).value = tl["performancesdate"];
											body.querySelector(`[name="performancestime"]`).value = tl["performancestime"];
											body.querySelector(`[name="performanceedate"]`).value = tl["performanceedate"];
											body.querySelector(`[name="performanceetime"]`).value = tl["performanceetime"];
											//-- 25.04.08
										}else {
											// 250418 : 수정 //
											body.querySelector(`[name="sdateTimeTemp"]`).value = tl["sdate"] + 'T' + tl["stime"];
											body.querySelector(`[name="edateTimeTemp"]`).value = tl["edate"] + 'T' + tl["etime"];
											//-- 250418 --//
											
											document.getElementById('detailPopBtnPlan').classList.add('bt-primary');
											document.getElementById('detailPopBtnResult').classList.add('bt-secondary');
											
											// 25.04.08 : 추가.
											body.querySelector(`[name="performancesdate"]`).value = '';
											body.querySelector(`[name="performancestime"]`).value = '';
											body.querySelector(`[name="performanceedate"]`).value = '';
											body.querySelector(`[name="performanceetime"]`).value = '';
											//-- 25.04.08
										}
										//-- 25.02.26
										
										// 25.04.08 : 추가.
										body.querySelector(`[name="sdate"]`).value = tl["sdate"];
										body.querySelector(`[name="stime"]`).value = tl["stime"];
										body.querySelector(`[name="edate"]`).value = tl["edate"];
										body.querySelector(`[name="etime"]`).value = tl["etime"];
										//-- 25.04.08
									
										// 25.02.26 : 주석 처리.
//										if(_status == 'ONGO' && !isPerSdate && !isPerEdate) {
//											body.querySelector(`[name="sdate"]`).disabled = false;
//											body.querySelector(`[name="stime"]`).disabled = false;
//											body.querySelector(`[name="edate"]`).disabled = false;
//											body.querySelector(`[name="etime"]`).disabled = false;
//											body.querySelector(`[name="per"]`).disabled = false;
//										}else {
//											body.querySelector(`[name="sdate"]`).disabled = true;
//											body.querySelector(`[name="stime"]`).disabled = true;
//											body.querySelector(`[name="edate"]`).disabled = true;
//											body.querySelector(`[name="etime"]`).disabled = true;
//											body.querySelector(`[name="per"]`).disabled = true;
//										}
										//-- 25.02.26 : 주석 처리.
										
										setNote(uid);
	
										// MODAL SHOW
										$('#scheduleDetailModal').modal();
										// CLOSE EVENT
										modal.querySelector(".close").onclick = () => {
											$('#scheduleDetailModal').hide();
										}
										// SAVE EVENT
										modal.querySelector(".save").onclick = () => {
											let isDel = false;
											let isNew = false;
											
											for(let x = 0; x < copyObj.length; x++) {
												if(copyObj[x].uid == _detailPopTcUid) {
													if(copyObj[x].flag == 'D') {
														isDel = true;
													}else if(copyObj[x].flag == 'C') {
														isNew = true;
													}
													
													// 25.04.08 : 추가
													copyObj[x].sdate = body.querySelector(`[name="sdate"]`).value;
													copyObj[x].stime = body.querySelector(`[name="stime"]`).value;
													copyObj[x].edate = body.querySelector(`[name="edate"]`).value;
													copyObj[x].etime = body.querySelector(`[name="etime"]`).value;
													copyObj[x].performancesdate = body.querySelector(`[name="performancesdate"]`).value;
													copyObj[x].performancestime = body.querySelector(`[name="performancestime"]`).value;
													copyObj[x].performanceedate = body.querySelector(`[name="performanceedate"]`).value;
													copyObj[x].performanceetime = body.querySelector(`[name="performanceetime"]`).value;
													//-- 25.04.08
													
													break;
												}
											}
											
											if(isDel) {
												toastPop($.i18n.t('modal.errDel'));
												return;
											}else if(isNew) {
												toastPop($.i18n.t('modal.errNew'));
												return;
											}
												
											saveNote();
											const isSeqChange = body.querySelector("input[name='seq']").getAttribute("data-seq")
	
											if ("U" === isSeqChange) {
												let seq = parseInt(body.querySelector("input[name='seq']").value)
												seq = parseInt(seq)
												if (tl.seq != seq) { // 이전과 동일한 seq면 이동하지 않는다.
													if (0 > seq) { // seq 값이 0 이하 일 시 1로 고정
														seq = 1
														body.querySelector("input[name='seq']").value = 1
													} else if (seq > copyObj.length - 1) { // seq 값이 마지막 index 값보다 크면 마지막 index 로 보정
														body.querySelector("input[name='seq']").value = copyObj.length - 1
														seq = copyObj.length - 1
													}
	
													let step = 0
													let first = 0
													let last = 0
	
													if (tl.seq - seq < 0) {
														first = parseInt(tl.seq)
														last = seq
														step = -1
													} else if (tl.seq - seq > 0) {
														first = seq
														last = parseInt(tl.seq)
														step = 1
													}
	
													copyObj.forEach(o => {
														let tartgetSeq = parseInt(o.seq)
	
														if ((first <= tartgetSeq) && (last >= tartgetSeq)) {
															o.seq = parseInt(o.seq) + step
														}
													})
	
													tl.seq = seq
													body.querySelector("input[name='seq']").value = parseInt(tl.seq)
	
													// copyObj.sort((a, b) => a.seq - b.seq) // 순서 정렬
												}
	
											} else {
												body.querySelector("input[name='seq']").removeAttribute("data-seq")
											}
												
											if(_status == 'ONGO' && !isPerSdate && !isPerEdate) {
												let sametcnum = tl['sametcnum'];
												let tcnum = tl['tcnum'];
												let isEmptyStn = isEmpty(sametcnum);
												
												for(let x = 0; x < copyObj.length; x++) {
													let stn = copyObj[x].sametcnum;
													let tn = copyObj[x].tcnum;
													
													if(tn != tcnum && isEmpty(copyObj[x].performancesdate)) {
														if(tcnum == stn || (!isEmptyStn && (tn == sametcnum || stn == sametcnum))) {
															copyObj[x].sdate = body.querySelector(`[name="sdate"]`).value;
															copyObj[x].stime = body.querySelector(`[name="stime"]`).value;
															copyObj[x].edate = body.querySelector(`[name="edate"]`).value;
															copyObj[x].etime = body.querySelector(`[name="etime"]`).value;
															copyObj[x].per = body.querySelector(`[name="per"]`).value;
															
															if('R' == copyObj[x].flag) {
																copyObj[x].flag = 'U';
															}
														}
													}
												}
											}
											
											Object.keys(tl).forEach(k => {
												if ("codedetuid" === k) {
													tl[k] = body.querySelector(`[name="scheTcnum"]`).getAttribute("data-codeuid") ?? ""
												} else if ("loadrate" === k) {
													const loadrate = body.querySelector(`[name="${k}"]`).value
													tl[k] = getLoadRate(loadrate, false)
												} else if ("tcnum" === k) {
													tl["tcnum"] = body.querySelector(`[name="scheTcnum"]`).value ?? ""
												} else if (body.querySelector(`[name="${k}"]`)) {
													tl[k] = body.querySelector(`[name="${k}"]`).value ?? ""
												} else if ("flag" === k) {
													tl[k] = "U"
												}
											})

//											modal.querySelector(".close").click();
											copyObj.sort((a, b) => {
												if (parseInt(a.seq) > parseInt(b.seq)) return 1
												else if (parseInt(a.seq) < parseInt(b.seq)) return -1
												else 0
											});
											
											// if (applyChart) applyChart(); 	// 25.04.08 삭제.
											
											_this.setData(copyObj);
											applyChart();						// 25.04.08 추가.
											_this._drawElement();
											
											saveSchedule(true);
										}
	
										if (_this.option.model.init) {
											_this.option.model.init(modal)
										}
									}
									///-- 25.02.26 : 이동.
								};
								
								if(isEmptyPerf) {
									document.addEventListener('mousemove', mouseMoveHandler);
								}
								
								document.addEventListener('mouseup', mouseUpHandler);
							}
						})
					}
				}
			}
		});
		
		initVLine();
	}



	_scrollSync() {
		const splitBox1 = this.target.querySelector(`.${this.lineBox} div.data`)
		const splitBox2 = this.target.querySelector(`.${this.ganttBox} div.data`)

		splitBox2.addEventListener("scroll", (e) => {
			splitBox1.scrollLeft = e.target.scrollLeft
		})
	}


	_makeLineBoxHtml() {
		return `<div style="height: auto; display:flex; width: 100%;" class="${this.lineBox}">
                <div style="height: 100%; min-width: 68px;"></div>
                <div style="overflow-x: ${this.option.isGanttChart ? 'hidden' : 'scroll'}; overflow-y: ${this.option.isGanttChart ? 'scroll' : 'hidden'};" class="data chart-inner-scroll-container">
                    <table class="lineTable">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>`
	}

	_makeGanttBoxHtml() {
		// Popup에서 남는 공간이 많아 추가 -  230713 BMK
		let heightGnt = this.option.isPopup ? "500px" : "300px";

		return `<div style="height: ${this.option.style?.height ? this.option.style.height : heightGnt}; display:flex; width: 100%;" class="${this.ganttBox}">
                <div style="height: 100%; min-width: 68px;"></div>
                <div id="chartScrollArea" style="overflow-x: scroll; overflow-y: scroll;" class="data chart-inner-scroll-container gantt-table-bottom-line">
                    <table class="ganttTable">
                        <tbody></tbody>
                        <tfoot><tr><td><div class="over_tr_row" style="display: none;" data-isclick="F"></div></td></tr></tfoot>
                    </table>
					<div class="v-line"></div>
					<div class="v-line-now"></div>
					<div id="chartContextMenu" class="chartContextMenu"></div>
                </div>
            </div>`
	}

	_drawDate = (type, dd, i) => {
		return `${ this._drawTime(type, dd, i) }`
	}

	_drawTime = (type, dd, j) => {
		let html = "";
		
		for (let i = 0; i < 24; i ++) {
			const pad = this._padTime(i)
			const cellPosition = i + (j * 24) + 1
			const left = 30 * cellPosition - 5
			const top = 21
			let spanId = dd + '-' + pad;

			if (type == "h") {
				_dateTimeList.push(spanId);
				html += `<th style="border-left: 0px;" data-key="${spanId}"><span id="${spanId}" style="position: absolute; left: ${left}px; top: ${top}px; border-radius: 4px; padding: 0px 4px;">${pad}</span></th>`
			} else {
				html += `<td data-key="${spanId}" data-position="${30 * cellPosition - 30}"></td>`
			}
		}
		return html
	}

	_padTime(i) {
		return i < 10 ? "0" + i : "" + i
	}

	_getDatesStartToLast = (sdate, lastDate) => {
		const regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
		if (!(regex.test(sdate) && regex.test(lastDate))) return "Not Date Format";
		const result = [];
		const curDate = new Date(sdate);
		while (curDate <= new Date(lastDate)) {
			result.push(curDate.toISOString().split("T")[0])
			curDate.setDate(curDate.getDate() + 1);
		}
		return result;
	}

	getData = () => {
		return this.option.datas
	}

	setData = (ll) => {
		this.option.datas = ll
	}

	isValidDate = (value) => {
		return value instanceof Date && !isNaN(value);
	}
	
	saveAddTc() {
		const newTc = {
 			uid: _nextUid,
			category: $('#newTcModalCategory').val().trim(),
			tcnum: $('#newTcModalScheTcnum').val().trim(),
			ctype: $('#newTcModalCtype').val(),
			desc: $('#newTcModalDesc').val(),
			dtype: $('#newTcModalDtype').val(),
			edate: $('#newTcModalEdateTime').val().split('T')[0],
			etime: $('#newTcModalEdateTime').val().split('T')[1],
			loadrate: getLoadRate($('#newTcModalLoadrate').val(), false),
			per: getFloatVal($('#newTcModalPer').val()),
			readytime: $('#newTcModalReadytime').val(),
			sametcnum: $('#newTcModalSameTcNum').val().trim(),
			sdate: $('#newTcModalSdateTime').val().split('T')[0],
			stime: $('#newTcModalSdateTime').val().split('T')[1],
			codedetuid: '' + _nextUid--,
			codedettcnum: '',
			codedetdesc: '',
			seq: getFloatVal($('#newTcModalSeq').val()),
			flag: 'C',
			performancesdate: '',
			performancestime: '',
			performanceedate: '',
			performanceetime: '',
			rowID: Math.random().toString(16).substr(2, 10)
		};
		
		let dataTemp = this.getData();
		
		if(!isNanEmpty(newTc.seq)) {
			let lastSeq = 1;
		
			for(let i = 0; i < dataTemp.length; i++) {
				if(dataTemp[i].seq >= newTc.seq) {
					dataTemp[i].seq++;
					
					if(dataTemp[i].flag != 'D' && dataTemp[i].flag != 'C') {
						dataTemp[i].flag = 'U';
					}
				}
				
				if(dataTemp[i].seq > lastSeq) {
					lastSeq = dataTemp[i].seq;
				}
			}
			
			if(newTc.seq > lastSeq) {
				newTc.seq = lastSeq + 1;
			}
		}else {
			newTc.seq = 1;
		}
		
		dataTemp.push(newTc);
			
		dataTemp.sort((a, b) => {
			if(parseInt(a.seq) > parseInt(b.seq)) return 1;
			else if(parseInt(a.seq) < parseInt(b.seq)) return -1;
			else 0;
		});
		
		$('#newTcModal').modal('hide');
		applyChart();
		this._drawElement();
	}
	
	delTc(isPop) {
		let dataTemp = this.getData();
		
		for(let i = 0; i < dataTemp.length; i++) {
			if(dataTemp[i].uid == _detailPopTcUid) {
				let flag = dataTemp[i].flag;
				
				if(flag == 'D') {
					if(dataTemp[i].uid > 0) {
						dataTemp[i].flag = 'U';
					}else {
						dataTemp[i].flag = 'C';
					}
				}else {
					dataTemp[i].flag = 'D';
				}
				
				break;
			}
		}
		
		if(isPop) {
			$('#scheduleDetailModal').modal('hide');
		}
		
		applyChart();
		this._drawElement();
	}
	
	_minMaxRefresh() {
		const tests = this.option.datas.filter(l => this.isValidDate(new Date(`${isEmpty(l.performancesdate) ? l.sdate : l.performancesdate} ${isEmpty(l.performancestime) ? l.stime : l.performancestime}:00`)) && this.isValidDate(new Date(`${isEmpty(l.performanceedate) ? l.edate : l.performanceedate} ${isEmpty(l.performanceetime) ? l.etime : l.performanceetime}:00`)) && ((isEmpty(l.performancesdate) ? l.sdate : l.performancesdate) != "" && (isEmpty(l.performancestime) ? l.stime : l.performancestime) != "" && (isEmpty(l.performanceedate) ? l.edate : l.performanceedate) != "" && (isEmpty(l.performanceetime) ? l.etime : l.performanceetime) != ""))

		if (0 !== tests.length) {
			let minVl = tests.reduce((a, b) => { 
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
			});
			
			this.option.min.sdate = minVl.sdate;
			this.option.min.stime = minVl.stime;
			
			let maxVl = tests.reduce((a, b) => { 
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
			});
			
			this.option.max.edate = maxVl.edate;
			this.option.max.etime = maxVl.etime;
		}
	}
}

