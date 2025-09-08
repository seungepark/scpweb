let scheTcSearchList = [];
var mng = null;
let _vLine;
let newTcSearchModalScheTcSearchList = [];
let _isTcAddDel = false;		// TC 추가/삭제 여부.

$(function(){
	initI18n();
	init();
	
	autocompleteOff();
});

function initI18n() {
	const lang = initLang();

	$.i18n.init({
	    lng: lang,
	    fallbackLng: FALLBACK_LNG,
	    fallbackOnNull: false,
	    fallbackOnEmpty: false,
	    useLocalStorage: false,
	    ns: {
	      namespaces: ['share', 'mngPopModifyScheChart'],
	      defaultNs: 'mngPopModifyScheChart'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init(){
	// Title 설정 
	$('#popChartTitle').text(opener.$('#hullnum').val() + ' / ' + opener.$('#shiptype').val() + ' / ' + opener.$('#desc').val());
	$("#hullnum").val(opener.$('#hullnum').val())
	
	// Parent 정보 입력
	$('#parentPeriod').val(opener.$('#period').val());
	$('#parentSdate').val(opener.$('#sdate').val());
	$('#parentEdate').val(opener.$('#edate').val());
	
	// 전체 Chart 그리기
	const jsonResult = opener.scheRowList[0]

	const schedule = {
		datas: jsonResult,
		isGanttChart: true,
		isLineChart: true,
		isEditable: true,
		isPopup: true,
		model: {
			init: (modal) => {
				// Date 변경 이벤트 설정
				modal.querySelector("input[name='sdateTime']").addEventListener(("change"), () => {
					const sdateTime = modal.querySelector("input[name='sdateTime']").value.split('T');
					modal.querySelector("input[name='sdate']").value = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[0] : '';
					modal.querySelector("input[name='stime']").value = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[1] : '';
					setDateTimeChgEvent(modal, 'start')
				})

				modal.querySelector("input[name='edateTime']").addEventListener(("change"), () => {
					const edateTime = modal.querySelector("input[name='edateTime']").value.split('T');
					modal.querySelector("input[name='edate']").value = !isEmpty(edateTime) && edateTime.length == 2 ? edateTime[0] : '';
					modal.querySelector("input[name='etime']").value = !isEmpty(edateTime) && edateTime.length == 2 ? edateTime[1] : '';
					setDateTimeChgEvent(modal, 'end')
				})
				
				modal.querySelector("input[name='performancesdateTime']").addEventListener(("change"), () => {
					const sdateTime = modal.querySelector("input[name='performancesdateTime']").value.split('T');
					modal.querySelector("input[name='performancesdate']").value = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[0] : '';
					modal.querySelector("input[name='performancestime']").value = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[1] : '';
				})

				modal.querySelector("input[name='performanceedateTime']").addEventListener(("change"), () => {
					const edateTime = modal.querySelector("input[name='performanceedateTime']").value.split('T');
					modal.querySelector("input[name='performanceedate']").value = !isEmpty(edateTime) && edateTime.length == 2 ? edateTime[0] : '';
					modal.querySelector("input[name='performanceetime']").value = !isEmpty(edateTime) && edateTime.length == 2 ? edateTime[1] : '';
				})

				modal.querySelector("input[name='seq']").addEventListener("change", (e) => {
					e.target.setAttribute("data-seq", "U")
				})
			}
		}
	}

	mng = new ScheduleManager("scheduleManager", schedule);
	mng.init();
	
	// Time Picker 설정
	setTimePicker('input[name="stime"]');
	setTimePicker('input[name="etime"]');

	setTimePicker('input[name="performancestime"]');
	setTimePicker('input[name="performanceetime"]');
}

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
const dateAdd = (date, interval, units) => {
	if(!(date instanceof Date))
		return undefined;
	let ret = new Date(date); //don't change original date
	const checkRollover = () => { if(ret.getDate() != date.getDate()) ret.setDate(0) }
	switch(String(interval).toLowerCase()) {
		case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
		case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
		case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
		case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
		case 'day'    :  ret.setDate(ret.getDate() + units);  break;
		case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
		case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
		case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
		default       :  ret = undefined;  break;
	}
	return ret;
}

const setDateTimeChgEvent = (modal, standard) => {

	const sdate = modal.querySelector("input[name='sdate']").value
	const stime = modal.querySelector("input[name='stime']").value
	const edate = modal.querySelector("input[name='edate']").value
	const etime = modal.querySelector("input[name='etime']").value
	const per = modal.querySelector("input[name='per']").value

	// if sdate change
	// (sdate stime) + period = (edate + etime)
	// if edate change
	// (edate etime) - period = (sdate + stime)
	if ("start" === standard && per) {

		const sday = new Date(`${sdate} ${stime}:00`)
		const eday = dateAdd(sday,'minute', parseInt(per))

		const yy = eday.getFullYear()
		const mm = eday.getMonth() + 1
		const dd = eday.getDate()

		const hh = eday.getHours()
		const mi = eday.getMinutes()

		modal.querySelector("input[name='edate']").value = `${ yy }-${ mm < 10 ? '0' + mm : mm }-${ dd < 10 ? '0' + dd : dd }`
		modal.querySelector("input[name='etime']").value = `${ hh < 10 ? '0' + hh : hh }:${mi < 10 ? '0' + mi : mi }`

	} else if ("end" === standard && per) {

		const sday = new Date(`${sdate} ${stime}:00`).getTime()
		const eday = new Date(`${edate} ${etime}:00`).getTime()

		const diff = (eday - sday) / (1000 * 60)
		modal.querySelector("input[name='per']").value = diff

	}
}

function setTimePicker(selStr){

	// Time 관련 컴포넌트 및 이벤트 추가
	$(selStr).timepicker({
		timeFormat: 'HH:mm',
		interval: 10,
		dropdown: true,
		dynamic: false,
		scrollbar: true,
		change: function(time) {
			const elm = $(this);
			if (0 !== elm.length) {
				const body = elm[0].closest("div.modal-body")
				const name = elm[0].getAttribute("name")

				if ("stime" === name) setDateTimeChgEvent(body, 'start')
				else if ("etime" === name) setDateTimeChgEvent(body, 'end')
			}
		}
	});
}

const applyChart = () => {
	const datas = mng.getData()
	datas.forEach(d => {
		if (d.loadrate === 0) {
			d.loadrate = "0.00"
		}
	})
	// console.log(datas)
	opener.refreshScheRowList(datas)
}

// 전체 Chart 재조회
function refreshChart(){
	// opener의 데이터 정리 로직
	opener.viewChart();
}

const viewReport = () => {
	window.open(contextPath + '/mng/sche/reportSchedule.html', 'reportSchedule', '');
}



function editValue(list, task, event, cell, column) {
	// console.log(list, task, event, cell, column);
	const found = list.find((item) => item.pID == task.getOriginalID());
	if (!found) {
		return;
	} else {
		found[column] = event ? event.target.value : '';
	}
}

const setPerformanceDate = () => {
	const modalRoot = document.querySelector("#scheduleDetailModal")
	const sdate = modalRoot.querySelector("input[name='sdate']").value
	const stime = modalRoot.querySelector("input[name='stime']").value
	const edate = modalRoot.querySelector("input[name='edate']").value
	const etime = modalRoot.querySelector("input[name='etime']").value

	modalRoot.querySelector("input[name='performancesdate']").value = sdate
	modalRoot.querySelector("input[name='performancestime']").value = stime
	modalRoot.querySelector("input[name='performanceedate']").value = edate
	modalRoot.querySelector("input[name='performanceetime']").value = etime
	
	modalRoot.querySelector("input[name='performancesdateTime']").value = sdate + 'T' + stime;
	modalRoot.querySelector("input[name='performanceedateTime']").value = edate + 'T' + etime;
}

const changePer = () => {
	const modalRoot = document.querySelector("#scheduleDetailModal")
	const sdate = modalRoot.querySelector("input[name='sdate']").value
	const stime = modalRoot.querySelector("input[name='stime']").value
	const per = modalRoot.querySelector("input[name='per']").value

	const sday = new Date(`${sdate} ${stime}:00`)
	const eday = dateAdd(sday,'minute', parseInt(per))

	const yy = eday.getFullYear()
	const mm = eday.getMonth() + 1
	const dd = eday.getDate()

	const hh = eday.getHours()
	const mi = eday.getMinutes()

	modalRoot.querySelector("input[name='edate']").value = `${ yy }-${ mm < 10 ? '0' + mm : mm }-${ dd < 10 ? '0' + dd : dd }`
	modalRoot.querySelector("input[name='etime']").value = `${ hh < 10 ? '0' + hh : hh }:${mi < 10 ? '0' + mi : mi }`
	
	modalRoot.querySelector("input[name='edateTime']").value = `${ yy }-${ mm < 10 ? '0' + mm : mm }-${ dd < 10 ? '0' + dd : dd }` + 'T' + `${ hh < 10 ? '0' + hh : hh }:${mi < 10 ? '0' + mi : mi }`;
}

const showShipCondModal = () => {
	const uid = opener.$('#uid').val()

	if (!uid || "0" == uid) {
		alert($.i18n.t('share:notFndSche'))
	} else {
		$.ajax({
			type: "GET",
			url: contextPath + "/mng/shipCond/getShipCondList.html",
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
				uid: uid
			}
		}).done(function(result, textStatus, xhr) {
			if(textStatus == "success") {
				$('#shipcondPopList').empty()
				result.list.forEach(d=> {
					shipcondPopAddChild(d)
				})
				$("#ship_cond_modal").modal("show")
			}else {
				alert($.i18n.t('share:tryAgain'));
			}
		}).fail(function(data, textStatus, errorThrown) {
			console.log(errorThrown)
		});
	}
}

// shipcond index
let shipcondPopTrNextIdx = 0;

// Ship cond add button event
const shipcondPopAddChild = (curRow) => {

	let sdate = ""
	let stime = ""
	if (!curRow) {
		const tr = document.querySelectorAll("#ship_cond_modal #shipcondPopList tr")
		if (0 === tr.length) {
			const jsonResult = opener.scheRowList[0]
			sdate = jsonResult[0].sdate
			stime = jsonResult[0].stime
		}
	}

	const text =`
			<tr id="shipcondPopTr${shipcondPopTrNextIdx}" data-uid="${curRow ? curRow.uid : 0}">
				
				<td class=""><select name="shipcondType" class=" shipcondType"><option value=""></option>${getTypeSelOption(curRow, 'shipcondtype')}</select></td>
				
				<td class=""><input type="date" name="shipcondSdate" class=" shipcondSdate" value="${curRow ? curRow.sdate : sdate}"></td>
				<td class=""><input type="time" name="shipcondStime" class=" shipcondStime" value="${curRow ? curRow.stime : stime}"></td>
				<td class=""><input type="date" name="shipcondEdate" class=" shipcondEdate" value="${curRow ? curRow.edate : ""}"></td>
				<td class=""><input type="time" name="shipcondEtime" class=" shipcondEtime" value="${curRow ? curRow.etime : ""}"></td>
				
				<td class=" text-center cursor-pointer" onClick="shipcondPopDelChild(${shipcondPopTrNextIdx})"><i class="fa-solid fa-trash-can"></i></td>
			</tr>`;

	$('#shipcondPopList').append(text);

	setTimePicker('input[name="shipcondStime"]');
	setTimePicker('input[name="shipcondEtime"]');

	shipcondPopTrNextIdx++;
}

// shipcond delete button event
const shipcondPopDelChild = (idx) => {
	$('#shipcondPopTr' + idx).remove();
}

function getTypeSelOption(curRow, type){
	let selbox = '';
	if(!isEmpty(type)){
		if(type == 'shipcondtype'){
			for(shipcondtype of shipcondtypeList){
				selbox += `<option value="${shipcondtype.value}" ${!isEmpty(curRow) && curRow.cond.toUpperCase() == shipcondtype.value ? 'Selected' : ''}>${shipcondtype.desc}</option> `;
			}
		}
	}
	return selbox;
}

const insertShipCond = () => {
	const trList = document.querySelectorAll("#shipcondPopList tr")
	const validate = isShipCondValidate(trList)

	const uid = opener.$('#uid').val()

	if (!uid || "0" == uid) {
		alert($.i18n.t('share:notFndSche'))
	}

	if (!validate.validate) {
		alert(validate.message)
	} else {
		const obj = {}
		$(`#shipcondPopList tr`).each((i, e) => {
			const shipcondType = $(e).find(`select[name="shipcondType"]`).val()
			const sdate = $(e).find(`input[name="shipcondSdate"]`).val()
			const stime = $(e).find(`input[name="shipcondStime"]`).val()
			const edate = $(e).find(`input[name="shipcondEdate"]`).val()
			const etime = $(e).find(`input[name="shipcondEtime"]`).val()

			obj[`shipconds[${i}].schedinfouid`] = uid
			obj[`shipconds[${i}].cond`] = shipcondType
			obj[`shipconds[${i}].sdate`] = sdate
			obj[`shipconds[${i}].stime`] = stime
			obj[`shipconds[${i}].edate`] = edate
			obj[`shipconds[${i}].etime`] = etime
		})

		obj['schedinfouid'] = uid

		$.ajax({
			type: "POST",
			url: contextPath + "/mng/shipCond/insertShipCond.html",
			traditional: true,
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=UTF-8;",
			beforeSend: function() {
				$('#loading').css("display","block");
			},
			complete: function() {
				$('#loading').css('display',"none");
			},
			data: obj
		}).done((result, textStatus, xhr) => {
			if(textStatus == "success") {
				$(`#shipcondPopList`).empty();
				$("#ship_cond_modal").modal("hide")
				alert($.i18n.t('compNew'));
			}else {
				alert($.i18n.t('share:tryAgain'));
			}
		}).fail((data, textStatus, errorThrown) => {
			// console.log(data, textStatus, errorThrown)
		});
	}
}

const isShipCondValidate = (trList) => {
	let rtn = {
		validate : true,
		message: ""
	}

	trList.forEach((tr, i) => {
		const row = i + 1
		let message = ""
		const shipcond = tr.querySelector("[name='shipcondType']").value
		const sdate = tr.querySelector("[name='shipcondSdate']").value
		const stime = tr.querySelector("[name='shipcondStime']").value
		const edate = tr.querySelector("[name='shipcondEdate']").value
		const etime = tr.querySelector("[name='shipcondEtime']").value

		if (!shipcond) {
			message += `${message == "" ? "" : ", "}${ $.i18n.t('msg.type') }`
		}

		if (!sdate) {
			message += `${message == "" ? "" : ", "}${ $.i18n.t('msg.sdate') }`
		}

		if (!stime) {
			message += `${message == "" ? "" : ", "}${ $.i18n.t('msg.stime') }`
		}

		if (!edate) {
			message += `${message == "" ? "" : ", "}${ $.i18n.t('msg.edate') }`
		}

		if (!etime) {
			message += `${message == "" ? "" : ", "}${ $.i18n.t('msg.etime') }`
		}

		if (sdate && edate && stime && etime) {
			const sdatetime = new Date(`${sdate} ${stime}:00`).getTime()
			const edatetime = new Date(`${edate} ${etime}:00`).getTime()

			if (edatetime < sdatetime) {
				rtn.message += `${ $.i18n.t('dateErrorMsg').replace("{0}", row) }행의 완료 시각은 시작 시각보다 빠를 수 없습니다. \n`
			}
		}

		if (message != "") {
			rtn.validate = false
			message = `${row}행의 ${message}를 확인해 주세요. \n`
			rtn.message += message
		}
	})

	return rtn
}

// 안내선.
function initVLine() {
	_vLine = document.querySelector('.v-line');
	_vLine.setAttribute('style', 'visibility: hidden;');
	
	document.getElementById('chartPanel').addEventListener('mousemove', e => {
		let posX = e.clientX - 20;
		
		for(let i = 0; i < _dateTimeList.length; i++) {
			document.getElementById(_dateTimeList[i]).classList.remove('v-line-head');
			document.getElementById(_dateTimeList[i]).classList.add('v-line-head-out');
		}

		if(posX > 60) {
			_vLine.setAttribute('style', 'visibility: visible;');
			_vLine.setAttribute('style', 'left: ' + posX + 'px;');
			
			let scrollX = document.getElementById('chartScrollArea').scrollLeft;
			let vLineHeadStart = posX + scrollX - 90;
			
			if(vLineHeadStart > 0) {
				let vLineHead = Math.round(vLineHeadStart / 30);
				
				if(vLineHead < _dateTimeList.length) {
					document.getElementById(_dateTimeList[vLineHead]).classList.remove('v-line-head-out');
					document.getElementById(_dateTimeList[vLineHead]).classList.add('v-line-head');
					_currDateTime = _dateTimeList[vLineHead];
				}else {
					_currDateTime = _dateTimeList[0];
				}
			}else {
				_currDateTime = _dateTimeList[0];
			}				
		}else {
			_vLine.setAttribute('style', 'visibility: hidden;');
			_currDateTime = _dateTimeList[0];
		}
	});

	document.querySelector('#chartPanel').addEventListener('mouseenter', e => {
		_vLine.setAttribute('style', 'visibility: visible;');
	});

	document.querySelector('#chartPanel').addEventListener('mouseleave', e => {
		_vLine.setAttribute('style', 'visibility: hidden;');
		
		for(let i = 0; i < _dateTimeList.length; i++) {
			document.getElementById(_dateTimeList[i]).classList.remove('v-line-head');
			document.getElementById(_dateTimeList[i]).classList.add('v-line-head-out');
		}
	});
}

// 시작/완료 변경 (추가 팝업).
function newTcModalChangeDateTime() {
	let start = new Date($('#newTcModalSdateTime').val());
	let end = new Date($('#newTcModalEdateTime').val());
	let diff = end.getTime() - start.getTime();
	let min = diff / (60 * 1000);
	
	if(isNanEmpty(min)) {
		$('#newTcModalPer').val(0);
	}else if(min < 0) {
		$('#newTcModalEdateTime').val($('#newTcModalSdateTime').val());
		$('#newTcModalPer').val(0);
	}else {
		$('#newTcModalPer').val(min);
	}
}

// 기간 변경 (추가 팝업).
function newTcModalChangePer() {
	let min = $('#newTcModalPer').val();
	let sdateTime = $('#newTcModalSdateTime').val().split('T');
	let sdate = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[0] : '';
	let stime = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[1] : '';
	
	if(!isNanEmpty(min)) {
		if(isValidDate(sdate) && isValidTime(stime)) {
			min = parseInt(min);
			let start = new Date(sdate + ' ' + stime);
			start.setMinutes(start.getMinutes() + min);
			
			let endYear = start.getFullYear();
			let endMonth = start.getMonth() + 1;
			let endDate = start.getDate();
			let endHour = start.getHours();
			let endMin = start.getMinutes();
			
			if(endMonth < 10) {
				endMonth = '0' + '' + endMonth;
			}
			
			if(endDate < 10) {
				endDate = '0' + '' + endDate;
			}
			
			if(endHour < 10) {
				endHour = '0' + '' + endHour;
			}
			
			if(endMin < 10) {
				endMin = '0' + '' + endMin;
			}
			
			$('#newTcModalEdateTime').val(endYear + '-' + endMonth + '-' + endDate + 'T' + endHour + ':' + endMin);
		}
		
	}
}

// TC 추가 (추가 팝업).
function addTc() {
	let sd = '';
	let st = '';
	let ed = '';
	let et = '';
	
	if(!isEmpty(_currDateTimeHold) && _currDateTimeHold.length == 13) {
		let arr = _currDateTimeHold.split('-');
		
		sd = arr[0] + '-' + arr[1] + '-' + arr[2];
		ed = arr[0] + '-' + arr[1] + '-' + arr[2];
		st = arr[3] + ':' + '00';
		et = arr[3] + ':' + '30';
	}
	
	$('#newTcModalScheTcnum').val('');
	$('#newTcModalDesc').val('');
	$('#newTcModalCtype').val('');
	$('#newTcModalDtype').val('');
	$('#newTcModalSeq').val(_currSeq);
	$('#newTcModalLoadrate').val('');
	
	$('#newTcModalSdateTime').val(sd + 'T' + st);
	$('#newTcModalEdateTime').val(ed + 'T' + et);
	
	$('#newTcModalPer').val('');
	$('#newTcModalReadytime').val('');
	$('#newTcModalSameTcNum').val('');
	
	newTcModalChangeDateTime();
	
	$('#newTcModal').modal();
}

// TC Num 검색 (추가 팝업).
function popSearchTcNum() {
	newTcSearchModalSearch(1);
	$('#newTcSearchModal').modal();
	$('#newTcModal').modal('hide');
}

//TCNUM 조회 팝업 검색 버튼 이벤트 (추가 팝업).
function newTcSearchModalSearch(page){
	$.ajax({
		type: "GET",
		url: contextPath + "/sche/getScheTcNumSearchList.html",
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
			page: page,
			shiptype: opener.$('#shiptype').val(),
			displaycode: $('#newTcSearchModalTcnum').val(),
			description: $('#newTcSearchModalDesc').val(),
			schedtype: opener.$('#schedtype').val(),
			status: 'ACT'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';

			newTcSearchModalScheTcSearchList = [];
			newTcSearchModalScheTcSearchList = result.list;

			for(let i in jsonResult) {
				text +=`
					<tr class="cursor-pointer">
						<td class="text-left" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].displaycode}</td>
						<td class="text-left" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].description}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].dtype}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].ctype}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].loadstr}</td>
						
						<td class="text-right" onClick="newTcSearchModalSelectTcNum(${i})">${getFloatVal(jsonResult[i].per)}</td>
						<td class="text-right" onClick="newTcSearchModalSelectTcNum(${i})">${getFloatVal(jsonResult[i].readytime)}</td>
					</tr>`;
			}

			$('#newTcSearchModalList').empty();

			if(jsonResult.length > 0) {
				$("#newTcSearchModalList").append(text);
			} else{
				$("#newTcSearchModalList").append('<tr><td class="text-center" colspan="7">' + $.i18n.t('share:noList') + '</td></tr>');
			}

			newTcSearchModalPaging(result.listCnt, page);

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

//Tc Num 조회 팝업 페이징 처리 (추가 팝업).
function newTcSearchModalPaging(cnt, page){
	var perPage = 10;
	var total = Math.ceil(parseInt(cnt) / perPage);
	var start = Math.floor((page - 1) / perPage) * perPage + 1;
	var end = start + perPage - 1;

	if(total <= end) {
		end = total;
	}

	var paging_init_num = parseInt(start);
	var paging_end_num = parseInt(end);
	var total_paging_cnt = parseInt(total);
	var pre_no = parseInt(page) - 1;
	var next_no = parseInt(page) + 1;
	var text = '';

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && pre_no != 0) {
		text += '<div onclick="newTcSearchModalSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}

	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(page) == k) {
			text += '<div onclick="newTcSearchModalSearch(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="newTcSearchModalSearch(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="newTcSearchModalSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}

	$('#newTcSearchModalPagination').empty();
	$('#newTcSearchModalPagination').append(text); 
}

// TC Num 조회 팝업 행 선택 시 이벤트 (추가 팝업).
function newTcSearchModalSelectTcNum(idx){
	$('#newTcModalCategory').val(newTcSearchModalScheTcSearchList[idx].lv1code).prop('selected', true);
	$('#newTcModalScheTcnum').val(newTcSearchModalScheTcSearchList[idx].displaycode);
	$('#newTcModalDesc').val(newTcSearchModalScheTcSearchList[idx].description);
	$('#newTcModalCtype').val(newTcSearchModalScheTcSearchList[idx].ctype);
	$('#newTcModalDtype').val(newTcSearchModalScheTcSearchList[idx].dtype);
	$('#newTcModalLoadrate').val(getLoadRate(newTcSearchModalScheTcSearchList[idx].loadrate, true));
	$('#newTcModalPer').val(getFloatVal(newTcSearchModalScheTcSearchList[idx].per));
	$('#newTcModalReadytime').val(getFloatVal(newTcSearchModalScheTcSearchList[idx].readytime));
	$('#newTcModalSameTcNum').val(newTcSearchModalScheTcSearchList[idx].sametcnum);
	
	newTcModalChangePer();
	newTcModalChangeDateTime();
	newTcSearchModalClose();
}

// TC Num 조회 팝업 닫기 (추가 팝업).
function newTcSearchModalClose() {
	$('#newTcModal').modal();
	$('#newTcSearchModal').modal('hide');
}

// TC 추가 반영 (추가 팝업).
function saveAddTc() {
	// 해당 순서에 신규 데이터 끼워넣기.
	// 이후 순서 TC부터 차례로 1만틈 증가 (seq).
	// bar 반영.
	// 표 반영.
	// 반영 된 상태 확인.
	
	// 서버 저장.
	// 저장 확인.
	
	if(isEmpty($('#newTcModalCategory').val())) {
		toastPop($.i18n.t('newTcModal.errCate'));
	}else if(isEmpty($('#newTcModalScheTcnum').val())) {
		toastPop($.i18n.t('newTcModal.errTcNum'));
	}else if(isEmpty($('#newTcModalSdateTime').val())) {
		toastPop($.i18n.t('newTcModal.errSdate'));
	}else if(isEmpty($('#newTcModalEdateTime').val())) {
		toastPop($.i18n.t('newTcModal.errEdate'));
	}else if(isEmpty($('#newTcModalPer').val())) {
		toastPop($.i18n.t('newTcModal.errPer'));
	}else {
		_isTcAddDel = true;
		mng.saveAddTc();
	}
}

// TC 삭제.
function delTc(isPop) {
	_isTcAddDel = true;
	mng.delTc(isPop);
}
