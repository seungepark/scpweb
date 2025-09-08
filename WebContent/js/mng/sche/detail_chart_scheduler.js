var scheChartList = []; //Scheduler Row Data
let scheChartSort = '';
let scheChartOrder = 'asc';
var mng = null;
let _vLine;

$(function(){
	initI18n();
	init();
	
	getScheChartList(); // scheChartList ajax function
	initServerCheck();
	autocompleteOff();
});

function initI18n() {
	var lang = initLang();

    $.i18n.init({
    	lng: lang,
    	fallbackLng: FALLBACK_LNG,
    	fallbackOnNull: false,
    	fallbackOnEmpty: false,
    	useLocalStorage: false,
    	ns: {
    		namespaces: ['share', 'mngDetChartSche'],
    		defaultNs: 'mngDetChartSche'
    	},
    	resStore: RES_LANG
	}, function () {
		$('body').i18n();
    });
}

function init() {
	initDesign();
}

function getScheChartList(){
	let parentUid = $("#parentUid").val();

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheChartList.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display',"none");
		},
		data: {
			search2: 'chart',
			uid: parentUid,
			sort: scheChartSort,
			order: scheChartOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			scheChartList = [];
			scheChartList.push(result.list); // scheChartList 배열 담기

			const option = {
				datas: result.list,
				isGanttChart: true,
				isLineChart: true,
				isEditable: false,
				isPopup: false,
			}

			mng = new ScheduleManager("scheduleManager", option);
			mng.init();

			// drawChartAll(jsonResult);
			
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}

//approval remark 아이콘 클릭했을대 실행
function apprRemark(uid){
	var targetArr = scheChartList[0].filter(function(arr){
		return arr.uid == uid;
	});
	$("#remarkText").text(targetArr[0].remark);
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

const viewReport = () => {
	window.open(contextPath + '/mng/sche/reportSchedule.html', 'reportSchedule', '');
}

function reVisionSchedule(uid) {
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/updateDepartureReport.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display',"none");
		},
		data: {
			uid: uid,
			stage: 'PLAN'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus === "success") {
			window.location.href = `${contextPath}/sche/planDepartureReport.html?uid=${uid}`
//			window.location.href = `${contextPath}/mng/sche/departureReportScheduleChart.html?uid=${uid}`
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});

}

// 안내선.
function initVLine() {
	_vLine = document.querySelector('.v-line');
	_vLine.setAttribute('style', 'visibility: hidden;');
	
	document.getElementById('chartPanel').addEventListener('mousemove', e => {
		let posX = e.clientX - 126;
		
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
				}
			}			
		}else {
			_vLine.setAttribute('style', 'visibility: hidden;');
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