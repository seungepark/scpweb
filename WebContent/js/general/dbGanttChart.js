
class DashBoardScheduleManager {
	constructor(target, option) {
		this.targetId = target;
		this.target = document.querySelector(`#${this.targetId}`);
		this.option = option;
		this.ganttBox = null;
		this.tooltipErrorMessage = [];
		this.initClass = true;
		this.beforeDtMargin = 10;
		this.afterDtMargin = 30;
	}

	init() {
		if(this.target && this.option.datas.length != 0) {
			const min = new Date();
			const max = new Date();
			
			min.setDate(min.getDate() - this.beforeDtMargin);
			max.setDate(max.getDate() + this.afterDtMargin);
			
			Object.defineProperties(this.option, {
				'min': { get: function () { return convertDateToStr(min, 'D');} },
				'max': { get: function () { return convertDateToStr(max, 'D');} }
			});

			// 랜덤 아이디 함수
			const randomID = (length = 8) => {
				return Math.random().toString(16).substr(2, length);
			}

			// 랜덤 아이디 부여, 각 객체를 찾기 쉽게 연결
			this.option.datas.forEach(d => {
				d.rowID = randomID(10);
			})
		}

		if(this.option.min && this.option.max) {
			this._drawElement();
		}
	}

	_getColor(actv) { // 간트 차트 라인 색
		const color = ["FFC700", "1AC4C4", "C242CD", "52C41A", "F77700"];
		let idx = 0;
		
		switch(actv) {
			case 'A/C': idx = 0; break;
			case 'S/T': idx = 1; break;
			case 'COLD/T': idx = 2; break;
			case 'LNG Bunk': idx = 3; break;
			case 'GAS/T': idx = 4; break;
		}
		
		return color[idx];
	}

	_drawElement() {
		if(this.target) while (this.target.firstChild) { this.target.removeChild(this.target.firstChild); }

		if(this.option.isGanttChart) this._settingGanttBox();
	}

	_settingGanttBox() {
		this.ganttBox = "ganttBox";
		const ganttHtml = this._makeGanttBoxHtml(); // 하단 gantt
		this.target.insertAdjacentHTML("afterbegin", ganttHtml);
		this._drawGanttBox();
	}

	_drawGanttBox() {
		const min = this.option.min;
		const max = this.option.max;
		
		// 상단 헤더 로직 Start 
		const table = this.target.querySelector(`.${this.ganttBox} .ganttTable`);
		const thead = table.querySelector("thead");
		
		const tbody = table.querySelector("tbody")
		const tfoot = table.querySelector("tfoot")
		
		let headerhtmlformonth = '<th colspan="7" class=""></th>';
		let headerhtmlDate = '<th colspan="3"></th><th rowspan="2" class="bottom" style="border-left: 1px solid #FFFFFF; padding: 4px 2px;">진행률</th><th rowspan="2" class="bottom" style="padding: 4px 8px;">검사</th><th rowspan="2" class="bottom" style="padding: 4px 8px;">공수</th><th rowspan="2" class="bottom" style="padding: 4px 8px; border-right: 1px solid #FFFFFF;">능률</th>';
		let headerhtmlDay = '<th colspan="3"></th>';
		
		const months = this._getMonthsStartToLast(min, max);
		
		let bodyhtml = "";
		
		let dCnt = 0;

		// 상단 헤더 구성
		// 월 - 일 - 요일 순
		months.forEach((mon, i) => {
			const dd = this._getDatesStartToLast(min, max, mon);
			
			headerhtmlformonth += `<th colspan="${ dd.length }" style="text-align:left;font-weight:700;padding-left:8px;background: var(--neutral-150,);">${mon}월</th>`;
			
			dd.forEach((d, j) => {
				headerhtmlDate += this._drawDate("d", d, dCnt);
				headerhtmlDay += this._drawDate("w", d, dCnt);
				bodyhtml += this._drawDate("b", d, dCnt, j == 0);
				
				dCnt++;
			});
			
		});

		thead.insertAdjacentHTML('beforeend', `<tr class="ganttHead1">${headerhtmlformonth}</tr>`);
		thead.insertAdjacentHTML('beforeend', `<tr class="ganttHead2">${headerhtmlDate}</tr>`);
		thead.insertAdjacentHTML('beforeend', `<tr class="ganttHead3">${headerhtmlDay}</tr>`);
		
		let ll = JSON.parse(JSON.stringify(this.option.datas));

		ll.sort((a, b) => {
			if (parseInt(a.uid) > parseInt(b.uid)) return -1
			else if (parseInt(a.uid) < parseInt(b.uid)) return 1
			else return 0
		});
		
		ll.forEach((l, i) => {
			const tr = document.createElement("tr");
			tbody.appendChild(tr);
			let fndt = !isEmpty(l.fndt) && l.fndt.length == 8 ? l.fndt.substring(4, 6) + '/' + l.fndt.substring(6) : l.fndt;
			
			const curData = `<th class="hullnum">${l.projNo}<div class="own">${l.own}</div>${l.newSknd}</th><th class="actv">${this._getActv(l.actv)}<br>${fndt}</th><th class="quaynm">${l.quayNm}</th><th class="quaynm"></th><th class="quaynm"></th><th class="quaynm"></th><th class="quaynm"></th>`;
			tr.insertAdjacentHTML('beforeend', `${curData + bodyhtml}`);
			
			/// 진행중*
			let eventList = l.list;
			let lineStart = 0;
			let lineEnd = 0;
			
			for(let z = 0; z < eventList.length; z++) {
				try {
					let eventItem = eventList[z];
					let stDate = eventItem.stdt.substring(0, 4) + '-' + eventItem.stdt.substring(4, 6) + '-' + eventItem.stdt.substring(6);
					let fnDate = eventItem.fndt.substring(0, 4) + '-' + eventItem.fndt.substring(4, 6) + '-' + eventItem.fndt.substring(6);
					let actv = this._getActv(eventItem.actv);
					let tempMinDate = new Date(min);
					let tempMaxDate = new Date(max);
					let tempStDate = new Date(stDate);
					let tempFnDate = new Date(fnDate);
					let stDateVl = stDate;
					let fnDateVl = fnDate;
					
					if(actv == 'A/C' || actv == 'S/T' || actv == 'COLD/T' || actv == 'LNG Bunk' || actv == 'GAS/T') {
						if(tempMaxDate.getTime() - tempStDate.getTime() < 0) continue;
						
						if(tempStDate.getTime() - tempMinDate.getTime() < 0) {
							stDateVl = min;
						}
						
						if(tempMaxDate.getTime() - tempFnDate.getTime() < 0) {
							fnDateVl = max;
						}
						
						const tempDur1 = new Date(stDateVl);
					  	const tempDur2 = new Date(fnDateVl);
					  	const diffDurDate = tempDur2.getTime() - tempDur1.getTime();
					  	const duration = Math.abs(diffDurDate / (1000 * 60 * 60 * 24)) + 1;
								
						const td = tr.querySelector(`td[data-key="${stDateVl}"]`);
						const left = parseInt(td.getAttribute("data-position")) + 447;
						const top = (i + 1) * 60 + 20;
						let width = duration * 30;
						
						const div = `<div class="schedule-root" style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px;">
						                <div data-key="${l.rowID}" class="schedule-box" style="background-color: #${this._getColor(actv)}; border-radius: 4px; padding: 0px 8px;box-shadow: 0px 1px 3px 0px #00000014;box-shadow: 0px 1px 2px 0px #0000000A;">
						                	<div style="color:white;font-size: 12px;font-weight: 700;line-height: 18px;">&nbsp;</div>
						                </div>
						            </div>`;
	
						td.insertAdjacentHTML("afterbegin", div);
						
						if(lineStart == 0) {
							lineStart = tempDur1;
						}else {
							if(tempDur1.getTime() - lineStart.getTime() < 0) {
								lineStart = tempDur1;
							}
						}
						
						if(lineEnd == 0) {
							lineEnd = tempDur2;
						}else {
							if(lineEnd.getTime() - tempDur2.getTime() < 0) {
								lineEnd = tempDur2;
							}
						}
					}else {
						actv = this._getActvShort(eventItem.actv);
						
						if(tempFnDate.getTime() - tempMinDate.getTime() < 0) continue;
						if(tempMaxDate.getTime() - tempFnDate.getTime() < 0) continue;
						
						const td = tr.querySelector(`td[data-key="${fnDateVl}"]`);
						const left = parseInt(td.getAttribute("data-position")) + 447;
						const top = (i + 1) * 60 + 17;
						let width = 26;
						
						const div = `<div class="schedule-root" style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${width}px;">
						                <div data-key="${l.rowID}" class="schedule-box" style="width: 100%; height: 100%; background-color: #0671E0; border-radius: 30px; padding: 0px;box-shadow: 0px 1px 3px 0px #00000014;box-shadow: 0px 1px 2px 0px #0000000A;">
						                	<div class="d-flex justify-content-center align-items-center" style="width: 100%;height: 100%;color:white;font-size: 12px;font-weight: 400;line-height: 18px;">${actv}</div>
						                </div>
						            </div>`;
	
						td.insertAdjacentHTML("afterbegin", div);
						
						if(lineStart == 0) {
							lineStart = tempFnDate;
						}else {
							if(tempFnDate.getTime() - lineStart.getTime() < 0) {
								lineStart = tempFnDate;
							}
						}
						
						if(lineEnd == 0) {
							lineEnd = tempFnDate;
						}else {
							if(lineEnd.getTime() - tempFnDate.getTime() < 0) {
								lineEnd = tempFnDate;
							}
						}
					}
				}catch(e) {console.log(e)}
			}
			
			if(lineStart != lineEnd) {
				const diffDurDate = lineEnd.getTime() - lineStart.getTime();
			  	const duration = Math.abs(diffDurDate / (1000 * 60 * 60 * 24));
		
				if(duration > 0) {
					const dateVl = lineStart.getFullYear() + '-' + (lineStart.getMonth() + 1).toString().padStart(2,'0') + '-' + lineStart.getDate().toString().padStart(2,'0');
					const td = tr.querySelector(`td[data-key="${dateVl}"]`);
					const left = parseInt(td.getAttribute("data-position")) + 460;
					const top = (i + 1) * 60 + 29;
					let width = duration * 30;
					
					const div = `<div class="" style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: 1px;">
						                <div data-key="${l.rowID}" class="" style="background-color: #A5A5BA; height: 1px;"></div>
						            </div>`;
	
					td.insertAdjacentHTML("afterbegin", div);
				}
			}
			
			
			
			
			
//			// 임시 확인용 데이터  START
//			const addDay = Math.floor(Math.random() * 25) + 1;
//			const duration = Math.floor(Math.random() * 10) + 2;
//			// 임시 확인용 데이터 END
//			
//			
//
//			const sDate = new Date(min);
//			sDate.setDate(sDate.getDate() + addDay);
//			
//			const td = tr.querySelector(`td[data-key="${convertDateToStr(sDate, 'D')}"]`);
//			
//			if (td && duration !== 0) {
//				const left = parseInt(td.getAttribute("data-position")) + 350;
//				const top = (i + 1) * 60 + 15;
//				let width = duration * 30;
//				
//				if(width < 100) {
//					width = 100;
//				}
//				
//				const div = `<div class="schedule-root" style="position: absolute; left: ${left + 30}px; top: ${top}px; width: ${width}px;">
//	                <div data-key="${l.rowID}" class="schedule-box" style="background-color: #${this._getColor(i)}; border-radius: 4px; padding: 0px 8px;box-shadow: 0px 1px 3px 0px #00000014;box-shadow: 0px 1px 2px 0px #0000000A;">
//	                	<div style="color:white;font-size: 12px;font-weight: 700;line-height: 18px;">${l.desc}</div>
//	                </div>
//	            </div>`
//
//				td.insertAdjacentHTML("afterbegin", div)
//			}
		});
	}
	
	_getActv(code) {
		let actv = '';
		
		switch(code) {
			case 'H00000050000': actv = 'L/C'; break;
			case 'H00000510000': actv = 'S/P On'; break;
			case 'H00000531000': actv = 'G/T'; break;
			case 'H00000540000': actv = 'M/T'; break;
			case 'H00000710000': actv = 'I/E'; break;
			case 'H00000712000': actv = 'A/C'; break;
			case 'H00000730000': actv = 'S/T'; break;
			case 'H00000730001': actv = 'S/T'; break;	// S/T&GasT
			case 'H00000750000': actv = 'COLD/T'; break;
			case 'H00000223000': actv = 'LNG Bunk'; break;
			case 'H00000780000': actv = 'GAS/T'; break;
			case 'H00000070000': actv = 'W/F'; break;
		}
		
		return actv;
	}
	
	_getActvShort(code) {
		let actv = '';
		
		switch(code) {
			case 'H00000050000': actv = 'LC'; break;
			case 'H00000510000': actv = 'SP'; break;
			case 'H00000531000': actv = 'GT'; break;
			case 'H00000540000': actv = 'MT'; break;
			case 'H00000710000': actv = 'IE'; break;
			case 'H00000070000': actv = 'WF'; break;
		}
		
		return actv;
	}

	_makeGanttBoxHtml() {
		return `<div style=" display:flex; width: 100%;" class="${this.ganttBox}">
                <div class="data scroll-area chart-inner-scroll-container">
                    <table class="ganttTable">
                    	<thead></thead>
                        <tbody></tbody>
                        <tfoot><tr><td><div class="over_tr_row" style="display: none;" data-isclick="F"></div></td></tr></tfoot>
                    </table>
                </div>
            </div>`;
	}

	_drawDate = (type, dd, j, is1st = false) => {
		let html = "";
		const cellPosition = j + 1;
		const left = 30 * cellPosition - 5 + 350;
		const top = 21;
		const isMax = this.option.max == dd;

		if(type == "d") {
			html += `<th style="border-left: 0px;" data-key="${dd}"><span style="">${dd.split('-')[2]}</span></th>`;
		}else if(type == "w") {
			const weeks = ['일', '월', '화', '수', '목', '금', '토'];
			const curDt = new Date(dd);
			const dayOfWeek = weeks[curDt.getDay()];
			const isWeekend = (curDt.getDay() == 0 || curDt.getDay() == 6);
			
			html += `<th style="border-left: 0px;" data-key="${dd}"><span style=" ${isWeekend ? "color: #F77700;" : ""}">${dayOfWeek}</span></th>`;
		}else {
			if(is1st) {
				html += `<td data-key="${dd}" data-position="${30 * cellPosition - 30}" class="td-1st"></td>`;
			}else {
				html += `<td data-key="${dd}" data-position="${30 * cellPosition - 30}"></td>`;
			}
		}
		
		return html;
	}

	_padTime(i) {
		return i < 10 ? "0" + i : "" + i;
	}

	_getDatesStartToLast = (sdate, lastDate, month) => {
		const regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
		if (!(regex.test(sdate) && regex.test(lastDate))) return "Not Date Format";
		
		const result = [];
		const curDate = new Date(sdate);
		
		while (curDate <= new Date(lastDate)) {
			if((Number(month) - 1) == curDate.getMonth()){
				result.push(curDate.toISOString().split("T")[0])
			}
			curDate.setDate(curDate.getDate() + 1);
		}
		return result;
	}
	
	_getMonthsStartToLast = (min, max) => {
		const regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
		
		if(!(regex.test(min) && regex.test(max))) return "Not Date Format";
		
		const result = [];
		const minDt = new Date(min);
		const maxDt = new Date(max);

		const getMonthDiff = (date1, date2) => {
			const d1 = new Date(date1);
			const d2 = new Date(date2);

			const monthsDiff = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + 1;

			return monthsDiff;
		}

		const monthDiff = getMonthDiff(min, max); 
		
		for(let i = 0; i < monthDiff; i++) {
			result.push(minDt.getMonth() + i + 1);
		}
		
		return result;
	}

	getData = () => {
		return this.option.datas;
	}

	setData = (ll) => {
		this.option.datas = ll;
	}

	isValidDate = (value) => {
		return value instanceof Date && !isNaN(value);
	}
}

