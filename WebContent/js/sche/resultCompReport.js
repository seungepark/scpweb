let _mailId = 0;
let _mailList = [];

$(function(){
    initI18n();
    init();

    initServerCheck();
    autocompleteOff();
});

function initI18n() {
    let lang = initLang();

    $.i18n.init({
        lng: lang,
        fallbackLng: FALLBACK_LNG,
        fallbackOnNull: false,
        fallbackOnEmpty: false,
        useLocalStorage: false,
        ns: {
            namespaces: ['share', 'resultCompReport'],
            defaultNs: 'resultCompReport'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	initData();
	
	$('#submitPopNewEmail').keypress(function(e) {
		if(e.keyCode === 13) {
			addNewEmail();
		}
	});
	
	$('#submitPopSearchDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchEmail();
		}
	});
	
	$('#checkComp').click(function() {
		if(!$('#checkComp').is(':checked')) {
			location.href = contextPath + '/sche/resultDailyReport.html?uid=' + _scheUid;
		}
	});
}

function viewReport() {
	let url = contextPath + '/sche/resultDailyReport.html?uid=' + _scheUid;
	
	if($('input[id=checkComp]').is(':checked')) {
		url = contextPath + '/sche/resultCompReport.html?uid=' + _scheUid;
	}
	
	location.href = url;
}

// 데이터 세팅.
function initData() {
	/// 제목.
	let scheTypeLabel = _schedType;
	let trialTitle = _schedType;
	let logoBgClass = '';
	let logoTitle = '';
	let logoSubtitle = $.i18n.t('share:reportType.comp');
	
	switch(_schedType) {
		case 'SEA': scheTypeLabel = $.i18n.t('share:schedType.sea'); 
			trialTitle = 'Sea'; 
			logoBgClass = 'report-type-logo-sea'; 
			logoTitle = $.i18n.t('share:reportType.sea'); break;
		case 'GAS': scheTypeLabel = $.i18n.t('share:schedType.gas'); 
			trialTitle = 'Gas'; 
			logoBgClass = 'report-type-logo-gas';
			logoTitle = $.i18n.t('share:reportType.gas'); break;
		case 'TOTAL': scheTypeLabel = $.i18n.t('share:schedType.total'); 
			trialTitle = 'Total'; 
			logoBgClass = 'report-type-logo-total';
			logoTitle = $.i18n.t('share:reportType.total'); break;
	}
	
	$('#titleSchedType').text(scheTypeLabel);
	$('#titleSchedType2').text(scheTypeLabel);
	
	document.getElementById('typeLogo').classList.add(logoBgClass);
	document.getElementById('typeLogo2').classList.add(logoBgClass);
	$('#typeTitle').text(logoTitle);
	$('#typeSubtitle').text(logoSubtitle);
	$('#typeTitle2').text(logoTitle);
	$('#typeSubtitle2').text(logoSubtitle);
	
	$('#trialTitle').text($.i18n.t('trialList.title', {type: trialTitle}));
	
	// 스케쥴.
	if(_schedule.length > 0) {
		let hour = isNanEmpty(_schedule[0].hour) ? 0 : parseInt(_schedule[0].hour) % 24; 
		$('#schePlan').html(_schedule[0].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[0].hour + $.i18n.t('scheHour'));
		$('#schePlanDate').html(_schedule[0].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[0].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
		$('#schePlan2').html(_schedule[0].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[0].hour + $.i18n.t('scheHour'));
		$('#schePlanDate2').html(_schedule[0].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[0].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
					
		if(_schedule.length > 1 && !isEmpty(_schedule[1].sDate) && !isEmpty(_schedule[1].eDate)) {
			hour = isNanEmpty(_schedule[1].hour) ? 0 : parseInt(_schedule[1].hour) % 24; 
			$('#schePer').html(_schedule[1].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[1].hour + $.i18n.t('scheHour'));
			$('#schePerDate').html(_schedule[1].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[1].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
			$('#schePer2').html(_schedule[1].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[1].hour + $.i18n.t('scheHour'));
			$('#schePerDate2').html(_schedule[1].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[1].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
			
			let diff = parseInt(_schedule[0].hour) - parseInt(_schedule[1].hour);
			let diffSymbol = '';
			
			if(diff > 0) {
				diffSymbol = '▼';
			}else if(diff < 0) {
				diffSymbol = '▲';
				diff = Math.abs(diff);
			}else if(isNanEmpty(diff)) {
				diff = '';
			}
			
			if(isEmpty(diff)) {
				$('#scheDiffSymbol').text('');
				$('#scheDiffHr').text('-');
				$('#scheDiffUnit').text('');
				$('#scheDiffSymbol2').text('');
				$('#scheDiffHr2').text('-');
				$('#scheDiffUnit2').text('');
			}else {
				$('#scheDiffSymbol').text(diffSymbol);
				$('#scheDiffHr').text(diff);
				$('#scheDiffUnit').text('hr');
				$('#scheDiffSymbol2').text(diffSymbol);
				$('#scheDiffHr2').text(diff);
				$('#scheDiffUnit2').text('hr');
			}
		}else {
			$('#schePer').text('-');
			$('#schePerDate').text('-');
			$('#scheDiffSymbol').text('');
			$('#scheDiffHr').text('-');
			$('#scheDiffUnit').text('');
			$('#schePer2').text('-');
			$('#schePerDate2').text('-');
			$('#scheDiffSymbol2').text('');
			$('#scheDiffHr2').text('-');
			$('#scheDiffUnit2').text('');
		}
	}
	
	// Commander
	for(let i = 0; i < _commanderList.length; i++) {
		if(_commanderList[i].mainSub == 'M') {
			$('#commName1').text(_commanderList[i].name);
			$('#commPhone1').text(_commanderList[i].phone);
			$('#commName12').text(_commanderList[i].name);
			$('#commPhone12').text(_commanderList[i].phone);
		}else {
			$('#commName2').text(_commanderList[i].name);
			$('#commPhone2').text(_commanderList[i].phone);
			$('#commName22').text(_commanderList[i].name);
			$('#commPhone22').text(_commanderList[i].phone);
		}
	}
	
	// 시운전 실적.
	if(!isEmpty(_trialList)) {
		let chartLabelTrialFuel = [];
		let chartLabelTrialFuelTotal = [];
		let chartBarColorTrialFuelCurr = [];
		let chartBarColorTrialFuel1 = [];
		let chartBarColorTrialFuel2 = [];
		let chartBarColorTrialFuelAvg = [];
		let chartDataTrialFuelCurr = [];
		let chartDataTrialFuel1 = [];
		let chartDataTrialFuel2 = [];
		let chartDataTrialFuelAvg = [];
		let chartLabelTrialTime = [];
		let chartBarColorTrialTime = [];
		let chartDataTrialTime = [];
		let chartDataTrialTimeSeriesAvg = 0;
		let isTrialFuelHfoCurr = false;
		let isTrialFuelMgoCurr = false;
		let isTrialFuelLngCurr = false;
		let isTrialFuelMdoCurr = false;
		let isTrialFuelHfo1 = false;
		let isTrialFuelMgo1 = false;
		let isTrialFuelLng1 = false;
		let isTrialFuelMdo1 = false;
		let isTrialFuelHfo2 = false;
		let isTrialFuelMgo2 = false;
		let isTrialFuelLng2 = false;
		let isTrialFuelMdo2 = false;
		let isTrialFuelHfoAvg = false;
		let isTrialFuelMgoAvg = false;
		let isTrialFuelLngAvg = false;
		let isTrialFuelMdoAvg = false;
		let tempTotalFuel = 0;
		
		let fuelAvgHfo = 0;
		let fuelAvgMgo = 0;
		let fuelAvgMdo = 0;
		let fuelAvgLng = 0;
		let fuelAvgHfoDivide = 0;
		let fuelAvgMgoDivide = 0;
		let fuelAvgMdoDivide = 0;
		let fuelAvgLngDivide = 0;
		
		if(!isEmpty(_trialListCurr)) {
			if(!isEmpty(_trialListCurr.hfo)) {
				let vl = isNanEmpty(_trialListCurr.hfoDown) ? (isNanEmpty(_trialListCurr.hfo) ? '' : parseFloat(_trialListCurr.hfo)) : parseFloat(_trialListCurr.hfoDown);
				fuelAvgHfo = vl;
				fuelAvgHfoDivide++;
				chartBarColorTrialFuelCurr.push('#7EC5FF');
				chartDataTrialFuelCurr.push(vl);
				isTrialFuelHfoCurr = true;
				
				if(!isNanEmpty(_trialListCurr.hfoDown) || !isNanEmpty(_trialListCurr.hfo)) {
					tempTotalFuel += vl;
				}
			}
			
			if(!isEmpty(_trialListCurr.mgo)) {
				let vl = isNanEmpty(_trialListCurr.mgoDown) ? (isNanEmpty(_trialListCurr.mgo) ? '' : parseFloat(_trialListCurr.mgo)) : parseFloat(_trialListCurr.mgoDown);
				fuelAvgMgo = vl;
				fuelAvgMgoDivide++;
				chartBarColorTrialFuelCurr.push('#0671E0');
				chartDataTrialFuelCurr.push(vl);
				isTrialFuelMgoCurr = true;
				
				if(!isNanEmpty(_trialListCurr.mgoDown) || !isNanEmpty(_trialListCurr.mgo)) {
					tempTotalFuel += vl;
				}
			}
			
			if(!isEmpty(_trialListCurr.lng)) {
				let vl = isNanEmpty(_trialListCurr.lngDown) ? (isNanEmpty(_trialListCurr.lng) ? '' : parseFloat(_trialListCurr.lng)) : parseFloat(_trialListCurr.lngDown);
				fuelAvgLng = vl;
				fuelAvgLngDivide++;
				chartBarColorTrialFuelCurr.push('#071972');
				chartDataTrialFuelCurr.push(vl);
				isTrialFuelLngCurr = true;
				
				if(!isNanEmpty(_trialListCurr.lngDown) || !isNanEmpty(_trialListCurr.lng)) {
					tempTotalFuel += vl;
				}
			}
			
			if(!isEmpty(_trialListCurr.mdo)) {
				let vl = isNanEmpty(_trialListCurr.mdoDown) ? (isNanEmpty(_trialListCurr.mdo) ? '' : parseFloat(_trialListCurr.mdo)) : parseFloat(_trialListCurr.mdoDown);
				fuelAvgMdo = vl;
				fuelAvgMdoDivide++;
				chartBarColorTrialFuelCurr.push('#CFCFDC');
				chartDataTrialFuelCurr.push(vl);
				isTrialFuelMdoCurr = true;
				
				if(!isNanEmpty(_trialListCurr.mdoDown) || !isNanEmpty(_trialListCurr.mdo)) {
					tempTotalFuel += vl;
				}
			}
		}else {
			chartBarColorTrialFuelCurr = ['#7EC5FF', '#0671E0', '#071972', '#CFCFDC'];
			chartDataTrialFuelCurr = ['', '', '', ''];
		}
		
		chartLabelTrialFuel.push(_hullNum + ' ' + $.i18n.t('trialList.pred'));
		chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
		chartDataTrialTime.push(isNanEmpty(_trialList.trialTime) ? 0 : parseFloat(_trialList.trialTime));
		chartDataTrialTimeSeriesAvg += isNanEmpty(_trialList.trialTime) ? 0 : parseFloat(_trialList.trialTime);
		chartBarColorTrialTime.push('#FFFFFF');
		chartLabelTrialTime.push(_hullNum + ' ' + $.i18n.t('trialList.pred'));
		
		let isTrial1 = _trialList.trial1Uid > 0;
		let isTrial2 = _trialList.trial2Uid > 0;
		
		if(isTrial1) {
			tempTotalFuel = 0;
			
			if(!isEmpty(_trialList1)) {
				if(!isEmpty(_trialList1.hfo)) {
					let vl = isNanEmpty(_trialList1.hfo) ? '' : parseFloat(_trialList1.hfo);
					fuelAvgHfo += vl;
					fuelAvgHfoDivide++;
					chartBarColorTrialFuel1.push('#7EC5FF');
					chartDataTrialFuel1.push(vl);
					isTrialFuelHfo1 = true;
					
					if(!isNanEmpty(_trialList1.hfo)) {
						tempTotalFuel += parseFloat(_trialList1.hfo);
					}
				}
				
				if(!isEmpty(_trialList1.mgo)) {
					let vl = isNanEmpty(_trialList1.mgo) ? '' : parseFloat(_trialList1.mgo);
					fuelAvgMgo += vl;
					fuelAvgMgoDivide++;
					chartBarColorTrialFuel1.push('#0671E0');
					chartDataTrialFuel1.push(vl);
					isTrialFuelMgo1 = true;
					
					if(!isNanEmpty(_trialList1.mgo)) {
						tempTotalFuel += parseFloat(_trialList1.mgo);
					}
				}
				
				if(!isEmpty(_trialList1.lng)) {
					let vl = isNanEmpty(_trialList1.lng) ? '' : parseFloat(_trialList1.lng);
					fuelAvgLng += vl;
					fuelAvgLngDivide++;
					chartBarColorTrialFuel1.push('#071972');
					chartDataTrialFuel1.push(vl);
					isTrialFuelLng1 = true;
					
					if(!isNanEmpty(_trialList1.lng)) {
						tempTotalFuel += parseFloat(_trialList1.lng);
					}
				}
				
				if(!isEmpty(_trialList1.mdo)) {
					let vl = isNanEmpty(_trialList1.mdo) ? '' : parseFloat(_trialList1.mdo);
					fuelAvgMdo += vl;
					fuelAvgMdoDivide++;
					chartBarColorTrialFuel1.push('#CFCFDC');
					chartDataTrialFuel1.push(vl);
					isTrialFuelMdo1 = true;
					
					if(!isNanEmpty(_trialList1.mdo)) {
						tempTotalFuel += parseFloat(_trialList1.mdo);
					}
				}
			}else {
				chartBarColorTrialFuel1.push('#FFFFFF');
				chartDataTrialFuel1.push('');
			}
			
			chartLabelTrialFuel.push(_trialList.trial1Num);
			chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
			chartDataTrialTime.push(isNanEmpty(_trialList.trial1Time) ? 0 : parseFloat(_trialList.trial1Time));
			chartDataTrialTimeSeriesAvg += isNanEmpty(_trialList.trial1Time) ? 0 : parseFloat(_trialList.trial1Time);
			chartBarColorTrialTime.push('#FFFFFF');
			chartLabelTrialTime.push(_trialList.trial1Num);
		}
		
		if(isTrial2) {
			tempTotalFuel = 0;
			
			if(!isEmpty(_trialList2)) {
				if(!isEmpty(_trialList2.hfo)) {
					let vl = isNanEmpty(_trialList2.hfo) ? '' : parseFloat(_trialList2.hfo);
					fuelAvgHfo += vl;
					fuelAvgHfoDivide++;
					chartBarColorTrialFuel2.push('#7EC5FF');
					chartDataTrialFuel2.push(vl);
					isTrialFuelHfo2 = true;
					
					if(!isNanEmpty(_trialList2.hfo)) {
						tempTotalFuel += parseFloat(_trialList2.hfo);
					}
				}
				
				if(!isEmpty(_trialList2.mgo)) {
					let vl = isNanEmpty(_trialList2.mgo) ? '' : parseFloat(_trialList2.mgo);
					fuelAvgMgo += vl;
					fuelAvgMgoDivide++;
					chartBarColorTrialFuel2.push('#0671E0');
					chartDataTrialFuel2.push(vl);
					isTrialFuelMgo2 = true;
					
					if(!isNanEmpty(_trialList2.mgo)) {
						tempTotalFuel += parseFloat(_trialList2.mgo);
					}
				}
				
				if(!isEmpty(_trialList2.lng)) {
					let vl = isNanEmpty(_trialList2.lng) ? '' : parseFloat(_trialList2.lng);
					fuelAvgLng += vl;
					fuelAvgLngDivide++;
					chartBarColorTrialFuel2.push('#071972');
					chartDataTrialFuel2.push(vl);
					isTrialFuelLng2 = true;
					
					if(!isNanEmpty(_trialList2.lng)) {
						tempTotalFuel += parseFloat(_trialList2.lng);
					}
				}
				
				if(!isEmpty(_trialList2.mdo)) {
					let vl = isNanEmpty(_trialList2.mdo) ? '' : parseFloat(_trialList2.mdo);
					fuelAvgMdo += vl;
					fuelAvgMdoDivide++;
					chartBarColorTrialFuel2.push('#CFCFDC');
					chartDataTrialFuel2.push(vl);
					isTrialFuelMdo2 = true;
					
					if(!isNanEmpty(_trialList2.mdo)) {
						tempTotalFuel += parseFloat(_trialList2.mdo);
					}
				}
			}else {
				chartBarColorTrialFuel2.push('#FFFFFF');
				chartDataTrialFuel2.push('');
			}
			
			chartLabelTrialFuel.push(_trialList.trial2Num);
			chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
			chartDataTrialTime.push(isNanEmpty(_trialList.trial2Time) ? 0 : parseFloat(_trialList.trial2Time));
			chartDataTrialTimeSeriesAvg += isNanEmpty(_trialList.trial2Time) ? 0 : parseFloat(_trialList.trial2Time);
			chartBarColorTrialTime.push('#FFFFFF');
			chartLabelTrialTime.push(_trialList.trial2Num);
		}
		
		tempTotalFuel = 0;

		if(fuelAvgHfoDivide > 0) {
			chartBarColorTrialFuelAvg.push('#7EC5FF');
			chartDataTrialFuelAvg.push(Math.floor(parseFloat(fuelAvgHfo / fuelAvgHfoDivide) * 100) / 100);
			isTrialFuelHfoAvg = true;
			
			if(!isNanEmpty(fuelAvgHfo / fuelAvgHfoDivide)) {
				tempTotalFuel += parseFloat(fuelAvgHfo / fuelAvgHfoDivide);
			}
		}
		
		if(fuelAvgMgoDivide > 0) {
			chartBarColorTrialFuelAvg.push('#0671E0');
			chartDataTrialFuelAvg.push(Math.floor(parseFloat(fuelAvgMgo / fuelAvgMgoDivide) * 100) / 100);
			isTrialFuelMgoAvg = true;
			
			if(!isNanEmpty(fuelAvgMgo / fuelAvgMgoDivide)) {
				tempTotalFuel += parseFloat(fuelAvgMgo / fuelAvgMgoDivide);
			}
		}
		
		if(fuelAvgLngDivide > 0) {
			chartBarColorTrialFuelAvg.push('#071972');
			chartDataTrialFuelAvg.push(Math.floor(parseFloat(fuelAvgLng / fuelAvgLngDivide) * 100) / 100);
			isTrialFuelLngAvg = true;
			
			if(!isNanEmpty(fuelAvgLng / fuelAvgLngDivide)) {
				tempTotalFuel += parseFloat(fuelAvgLng / fuelAvgLngDivide);
			}
		}
		
		if(fuelAvgMdoDivide > 0) {
			chartBarColorTrialFuelAvg.push('#CFCFDC');
			chartDataTrialFuelAvg.push(Math.floor(parseFloat(fuelAvgMdo / fuelAvgMdoDivide) * 100) / 100);
			isTrialFuelMdoAvg = true;
			
			if(!isNanEmpty(fuelAvgMdo / fuelAvgMdoDivide)) {
				tempTotalFuel += parseFloat(fuelAvgMdo / fuelAvgMdoDivide);
			}
		}
		
		if(fuelAvgHfoDivide <= 0 & fuelAvgMgoDivide <= 0 & fuelAvgLngDivide <= 0 & fuelAvgMdoDivide <= 0) {
			chartBarColorTrialFuelAvg.push('#FFFFFF');
			chartDataTrialFuelAvg.push('');
		}
		
		let divide = isTrial1 ? 2 : 1;
		divide += isTrial2 ? 1 : 0;
		chartDataTrialTimeSeriesAvg = chartDataTrialTimeSeriesAvg / divide;
		chartDataTrialTime.push(isNanEmpty(chartDataTrialTimeSeriesAvg) ? '' : Math.floor(parseFloat(chartDataTrialTimeSeriesAvg) * 10) / 10);
		chartLabelTrialFuel.push($.i18n.t('trialList.avg'));
		chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
		chartBarColorTrialTime.push('#FFFFFF');
		chartLabelTrialTime.push($.i18n.t('trialList.avg'));
		
		let chartDatasetsItemTrialFuel = [];
		let tempDataHfo = [];
		let tempDataMgo = [];
		let tempDataLng = [];
		let tempDataMdo = [];
		let chartDataTrialFuelCurrIdx = 0;
		let chartDataTrialFuel1Idx = 0;
		let chartDataTrialFuel2Idx = 0;
		let chartDataTrialFuelAvgIdx = 0;
		
		if(isTrialFuelHfoCurr || isTrialFuelHfo1 || isTrialFuelHfo2 || isTrialFuelHfoAvg) {
			tempDataHfo.push(isTrialFuelHfoCurr ? chartDataTrialFuelCurr[chartDataTrialFuelCurrIdx++] : '');
			
			if(isTrial1) {
				tempDataHfo.push(isTrialFuelHfo1 ? chartDataTrialFuel1[chartDataTrialFuel1Idx++] : '');
			}
			
			if(isTrial2) {
				tempDataHfo.push(isTrialFuelHfo2 ? chartDataTrialFuel2[chartDataTrialFuel2Idx++] : '');
			}
			
			tempDataHfo.push(isTrialFuelHfoAvg ? chartDataTrialFuelAvg[chartDataTrialFuelAvgIdx++] : '');
		}
		
		if(isTrialFuelMgoCurr || isTrialFuelMgo1 || isTrialFuelMgo2 || isTrialFuelMgoAvg) {
			tempDataMgo.push(isTrialFuelMgoCurr ? chartDataTrialFuelCurr[chartDataTrialFuelCurrIdx++] : '');
			
			if(isTrial1) {
				tempDataMgo.push(isTrialFuelMgo1 ? chartDataTrialFuel1[chartDataTrialFuel1Idx++] : '');
			}
			
			if(isTrial2) {
				tempDataMgo.push(isTrialFuelMgo2 ? chartDataTrialFuel2[chartDataTrialFuel2Idx++] : '');
			}
			
			tempDataMgo.push(isTrialFuelMgoAvg ? chartDataTrialFuelAvg[chartDataTrialFuelAvgIdx++] : '');
		}
		
		if(isTrialFuelLngCurr || isTrialFuelLng1 || isTrialFuelLng2 || isTrialFuelLngAvg) {
			tempDataLng.push(isTrialFuelLngCurr ? chartDataTrialFuelCurr[chartDataTrialFuelCurrIdx++] : '');
			
			if(isTrial1) {
				tempDataLng.push(isTrialFuelLng1 ? chartDataTrialFuel1[chartDataTrialFuel1Idx++] : '');
			}
			
			if(isTrial2) {
				tempDataLng.push(isTrialFuelLng2 ? chartDataTrialFuel2[chartDataTrialFuel2Idx++] : '');
			}
			
			tempDataLng.push(isTrialFuelLngAvg ? chartDataTrialFuelAvg[chartDataTrialFuelAvgIdx++] : '');
		}
		
		if(isTrialFuelMdoCurr || isTrialFuelMdo1 || isTrialFuelMdo2 || isTrialFuelMdoAvg) {
			tempDataMdo.push(isTrialFuelMdoCurr ? chartDataTrialFuelCurr[chartDataTrialFuelCurrIdx++] : '');
			
			if(isTrial1) {
				tempDataMdo.push(isTrialFuelMdo1 ? chartDataTrialFuel1[chartDataTrialFuel1Idx++] : '');
			}
			
			if(isTrial2) {
				tempDataMdo.push(isTrialFuelMdo2 ? chartDataTrialFuel2[chartDataTrialFuel2Idx++] : '');
			}
			
			tempDataMdo.push(isTrialFuelMdoAvg ? chartDataTrialFuelAvg[chartDataTrialFuelAvgIdx++] : '');
		}
	
		if(tempDataHfo.length > 0) {
			chartDatasetsItemTrialFuel.push({
				label: $.i18n.t('trialList.hfo'),
				backgroundColor: '#7EC5FF',
				data: tempDataHfo,
				barThickness: 40
			});
		}
		
		if(tempDataMgo.length > 0) {
			chartDatasetsItemTrialFuel.push({
				label: $.i18n.t('trialList.mgo'),
				backgroundColor: '#0671E0',
				data: tempDataMgo,
				barThickness: 40
			});
		}
		
		if(tempDataLng.length > 0) {
			chartDatasetsItemTrialFuel.push({
				label: $.i18n.t('trialList.lng'),
				backgroundColor: '#071972',
				data: tempDataLng,
				barThickness: 40
			});
		}
		
		if(tempDataMdo.length > 0) {
			chartDatasetsItemTrialFuel.push({
				label: $.i18n.t('trialList.mdo'),
				backgroundColor: '#CFCFDC',
				data: tempDataMdo,
				barThickness: 40
			});
		}
		
		const chartConfigTrialFuel = {
	  		type: 'bar',
	  		data: {
		  		labels: chartLabelTrialFuel,
		  		datasets: chartDatasetsItemTrialFuel
			},
			plugins: [ChartDataLabels],
	  		options: {
				responsive: false,
				plugins: {
				    legend: {
				      	display: false,
						align: 'end',
						labels: {
							usePointStyle: true,
							pointStyle: 'rect',
							pointStyleWidth: 12
						}
				    },
					datalabels: {
	        			color: '#FFFFFF',
						anchor: 'center',
						align: 'center',
						font: {
						size: 9,
						weight: 600
					}
	      			}
//					annotation: {
//			        	clip: false,
//			        	annotations: {
//				          	scaleTitle: {
//					            type: 'label',
//					            xValue: 0,
//					            yValue(ctx) {
//					              	const yScale = ctx.chart.scales.y;
//					              	return yScale.end;
//					            },
//					            font:{ 
//					              	size: 14, 
//					              	weight: 'bold'
//					            },
//					            position: {
//					              	x: 'start',
//					              	y: 'end'
//					            },
//								padding: {
//									bottom: 6
//								},
//					            xAdjust(ctx) {
//					              	const yScale = ctx.chart.scales.y;
//					              	return yScale.left - 117;
//
//					            },
//					            content: $.i18n.t('trialList.subtitle2')
//				          	}
//			        	}
//			      	}
				},
	    		scales: {
	      			y: {
						stacked: true,
						ticks: {
	                        color: '#000000',
							align: 'start',
							font: {
								size: 9,
								weight: 400
							}
	                    },
	        			beginAtZero: true
	      			},
					x: {
						stacked: true,
	                    ticks: {
	                        color: '#000000',
							font: {
								size: 10,
								weight: 600
							}
	                    },
						grid: {
							offset: false
						}
	                }
	    		}
	  		},
		};
		
		new Chart(document.getElementById('trialFuelGraph'), chartConfigTrialFuel);
		
		let trialFuelGraphTotalHtml = '<div></div>';
		let trialFuelGraphTotalStyle = 'display: grid; grid-template-columns: 30px';
		
		for(let i = 0; i < chartLabelTrialFuelTotal.length; i++) {
			trialFuelGraphTotalHtml += '<div class="text-center"><span class="report-graph-total-info">' + chartLabelTrialFuelTotal[i] + '</span></div>';
			trialFuelGraphTotalStyle += ' 1fr';
		}
		
		trialFuelGraphTotalStyle += ';';
		
		document.getElementById('trialFuelGraphTotal').style.cssText = trialFuelGraphTotalStyle;
		$('#trialFuelGraphTotal').html(trialFuelGraphTotalHtml);

		const chartConfigTrialTime = {
	  		type: 'bar',
	  		data: {
		  		labels: chartLabelTrialTime,
		  		datasets: [{
					type: 'line',
					label: '',
					backgroundColor: chartBarColorTrialTime,
					borderColor: '#237804',
					data: chartDataTrialTime,
					barThickness: 40
				}]
			},
			plugins: [ChartDataLabels],
	  		options: {
				responsive: false,
				plugins: {
				    legend: {
				      	display: false,
						align: 'end',
						labels: {
							generateLabels: (chart) => {
				            	const datasets = chart.data.datasets;
	
				            	return datasets[0].data.map((data, i) => ({
				              		text: '',
				              		fillStyle: '#FFFFFF00',
				              		strokeStyle: '#FFFFFF00',
				              		index: i
				            	})
							)
				          }
						}
				    },
					datalabels: {
	        			color: '#FFFFFF',
						backgroundColor: '#237804',
						borderRadius: 20,
						anchor: 'center',
						align: 'center',
						font: {
							size: 9,
							weight: 600
						},
						padding: {
							left: 6,
							right: 6,
							bottom: 2
						},
						formatter: function(value, context) {
						  	return value + 'hr';
						}
	      			}
//					annotation: {
//			        	clip: false,
//			        	annotations: {
//				          	scaleTitle: {
//					            type: 'label',
//					            xValue: 0,
//					            yValue(ctx) {
//					              	const yScale = ctx.chart.scales.y;
//					              	return yScale.end;
//					            },
//					            font:{ 
//					              	size: 14, 
//					              	weight: 'bold'
//					            },
//					            position: {
//					              	x: 'start',
//					              	y: 'end'
//					            },
//								padding: {
//									bottom: 6
//								},
//					            xAdjust(ctx) {
//					              	const yScale = ctx.chart.scales.y;
//					              	return yScale.left - 117;
//					            },
//					            content: $.i18n.t('trialList.subtitle1')
//				          	}
//			        	}
//			      	}
				},
	    		scales: {
	      			y: {
						ticks: {
	                        color: '#000000',
							align: 'start',
							font: {
								size: 9,
								weight: 400
							}
	                    },
	        			beginAtZero: true
	      			},
					x: {
	                    ticks: {
	                        color: '#000000',
							font: {
								size: 10,
								weight: 600
							}
	                    },
						grid: {
							offset: false
						}
	                }
	    		}
	  		},
		};
		
		new Chart(document.getElementById('trialTimeGraph'), chartConfigTrialTime);
	}
	
	/// Fuel 차트.
	let chartLabelFuel = [];
	let chartBarColorFuel = [];
	let chartDataFuel = [];
	
	if(!isEmpty(_infoBean)) {
		if(!isEmpty(_infoBean.fuelHfo)) {
			let vl = 0;
			
			if(!isNanEmpty(_infoBean.fuelHfoTemp)) {
				vl = parseFloat(_infoBean.fuelHfoTemp);
			}else if(!isNanEmpty(_infoBean.fuelHfoPerformance)) {
				vl = parseFloat(_infoBean.fuelHfoPerformance);
			}else if(!isNanEmpty(_infoBean.fuelHfo)) {
				vl = parseFloat(_infoBean.fuelHfo)
			}
			
			chartLabelFuel.push($.i18n.t('fuel.hfo'));
			chartBarColorFuel.push('#7EC5FF');
			chartDataFuel.push(parseFloat(vl));
		}
		
		if(!isEmpty(_infoBean.fuelMgo)) {
			let vl = 0;
			
			if(!isNanEmpty(_infoBean.fuelMgoTemp)) {
				vl = parseFloat(_infoBean.fuelMgoTemp);
			}else if(!isNanEmpty(_infoBean.fuelMgoPerformance)) {
				vl = parseFloat(_infoBean.fuelMgoPerformance);
			}else if(!isNanEmpty(_infoBean.fuelMgo)) {
				vl = parseFloat(_infoBean.fuelMgo)
			}
			
			chartLabelFuel.push($.i18n.t('fuel.mgo'));
			chartBarColorFuel.push('#0671E0');
			chartDataFuel.push(parseFloat(vl));
		}
		
		if(!isEmpty(_infoBean.fuelLng)) {
			let vl = 0;
			
			if(!isNanEmpty(_infoBean.fuelLngTemp)) {
				vl = parseFloat(_infoBean.fuelLngTemp);
			}else if(!isNanEmpty(_infoBean.fuelLngPerformance)) {
				vl = parseFloat(_infoBean.fuelLngPerformance);
			}else if(!isNanEmpty(_infoBean.fuelLng)) {
				vl = parseFloat(_infoBean.fuelLng)
			}
			
			chartLabelFuel.push($.i18n.t('fuel.lng'));
			chartBarColorFuel.push('#071972');
			chartDataFuel.push(parseFloat(vl));
		}
		
		if(!isEmpty(_infoBean.fuelMdo)) {
			let vl = 0;
			
			if(!isNanEmpty(_infoBean.fuelMdoTemp)) {
				vl = parseFloat(_infoBean.fuelMdoTemp);
			}else if(!isNanEmpty(_infoBean.fuelMdoPerformance)) {
				vl = parseFloat(_infoBean.fuelMdoPerformance);
			}else if(!isNanEmpty(_infoBean.fuelMdo)) {
				vl = parseFloat(_infoBean.fuelMdo)
			}
			
			chartLabelFuel.push($.i18n.t('fuel.mdo'));
			chartBarColorFuel.push('#CFCFDC');
			chartDataFuel.push(parseFloat(vl));
		}
	}else {
		chartLabelFuel = [$.i18n.t('fuel.hfo'), $.i18n.t('fuel.mgo'), $.i18n.t('fuel.lng'), $.i18n.t('fuel.mdo')];
		chartBarColorFuel = ['#7EC5FF', '#0671E0', '#071972', '#CFCFDC'];
		chartDataFuel = [0, 0, 0, 0];
	}
	
	const chartConfigFuel = {
  		type: 'bar',
  		data: {
	  		labels: chartLabelFuel,
	  		datasets: [{
	    		backgroundColor: chartBarColorFuel,
	    		data: chartDataFuel,
				barThickness: 40
	  		}]
		},
		plugins: [ChartDataLabels],
  		options: {
			plugins: {
			    legend: {
			      	display: false
			    },
				datalabels: {
        			color: '#FFFFFF',
					anchor: 'start',
					align: 'start',
					offset: -20,
					font: {
						size: 9,
						weight: 600
					}
      			}
			},
    		scales: {
      			y: {
					ticks: {
                        color: '#000000',
						font: {
							size: 9,
							weight: 400
						}
                    },
        			beginAtZero: true
      			},
				x: {
                    ticks: {
                        color: '#000000',
						font: {
							size: 10,
							weight: 600
						}
                    },
					grid: {
						offset: false
					}
                }
    		}
  		}
	};
	
	new Chart(document.getElementById('fuelGraph'), chartConfigFuel);
	
	/// 시운전 진행 현황.
	const chartPluginTextCenter = {
		id: 'textCenter',
		beforeDatasetsDraw(chart, args, pluginOptions) {
			const {ctx, data} = chart;
			ctx.save();
			ctx.font = 'bolder 12px roboto';
			ctx.fillStyle = '#000000';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(data.datasets[0].data[0], chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
		}
	};
		
	let tcCntTotal = 0;
	
	for(let i = 0; i < _tcCntList.length; i++) {
		let chartConfig;
		
		if(i == 0) {
			tcCntTotal = isNanEmpty(_tcCntList[i]) ? 0 : parseInt(_tcCntList[i]);
			
			chartConfig = {
		  		type: 'doughnut',
		  		data: {
			  		datasets: [{
			    		backgroundColor: ['#4196F0'],
			    		data: [tcCntTotal],
						radius: 30,
						borderRadius: [6, 0],
						borderWidth: 0,
						cutout: '80%'
			  		}]
				},
				plugins: [chartPluginTextCenter],
		  		options: {
					plugins: {
					    legend: {
					      	display: false
					    }
					}
		  		}
			};
		}else {
			let cnt = isNanEmpty(_tcCntList[i]) ? 0 : parseInt(_tcCntList[i]);
			let total = tcCntTotal - cnt;
			
			chartConfig = {
		  		type: 'doughnut',
		  		data: {
			  		datasets: [{
			    		backgroundColor: ['#4196F0', '#E7E7E7'],
			    		data: [cnt, total],
						radius: 30,
						borderRadius: [6, 0],
						borderWidth: 0,
						cutout: '80%'
			  		}]
				},
				plugins: [chartPluginTextCenter],
		  		options: {
					plugins: {
					    legend: {
					      	display: false
					    }
					}
		  		}
			};
		}
		
		new Chart(document.getElementById('progressCnt' + (i + 1) + 'Graph'), chartConfig);
	}
	
	/// 승선 현황 추세.
	let todayDate = new Date(_dateToday);
	let sDate = new Date(_dateSdate);	
	let eDate = new Date(_dateEdate);
	let stepDate = new Date(_dateSdate);	
	
	let chartLabelCrewDateList = [];
	let chartBarColorCrewDateList = [];
	let chartDataCrewDateList = [];
	let disabledTickStartIdx = 0;
	
	let todayDateStr = todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate();
	let isExistToday = false;
	let prevCrewCntObj;
	let todayCrewCntObj;
	
	for(let i = 0; i < _crewDateCntList.length; i++) {
		let dt = (stepDate.getMonth() + 1).toString().padStart(2,'0') + '.' + stepDate.getDate().toString().padStart(2,'0');
		chartLabelCrewDateList.push(dt);
		chartBarColorCrewDateList.push('#FFFFFF');
			
		if(isDueDateValid(stepDate, todayDate)) {
			chartDataCrewDateList.push(parseInt(_crewDateCntList[i].total));
			disabledTickStartIdx++;
		}else {
			chartDataCrewDateList.push(null);
		}
		
		let stepDateStr = stepDate.getFullYear() + '-' + stepDate.getMonth() + '-' + stepDate.getDate();
		
		if(i == 0) {
			todayCrewCntObj = _crewDateCntList[i];
		}else {
			if(stepDateStr == todayDateStr) {
				todayCrewCntObj = _crewDateCntList[i];
				isExistToday = true;
			}else {
				prevCrewCntObj = _crewDateCntList[i - 1];
				
				if(!isExistToday) {
					todayCrewCntObj = _crewDateCntList[i];
				}
			}
		}
		
		stepDate.setDate(stepDate.getDate() + 1);
		
		if(i >= 19) {
			break;
		}
	}

	const chartConfigCrewDateList = {
  		type: 'bar',
  		data: {
	  		labels: chartLabelCrewDateList,
	  		datasets: [{
				type: 'line',
				label: '',
				backgroundColor: chartBarColorCrewDateList,
				borderColor: '#FF9500',
				borderWidth: 2,
				data: chartDataCrewDateList,
				barThickness: 40
			}]
		},
		plugins: [ChartDataLabels],
  		options: {
			responsive: false,
			plugins: {
			    legend: {
			      	display: false
			    },
				datalabels: {
        			color: '#FFFFFF',
					backgroundColor: '#FF9500',
					borderRadius: 20,
					anchor: 'center',
					align: 'center',
					font: {
						size: 9,
						weight: 600
					},
					padding: {
						left: 6,
						right: 6,
						bottom: 2
					}
      			}
			},
    		scales: {
      			y: {
					ticks: {
                        color: '#000000',
						align: 'start',
						font: {
							size: 9,
							weight: 400
						}
                    },
        			beginAtZero: true
      			},
				x: {
                    ticks: {
                        color: (c) => {return c['tick']['value'] < disabledTickStartIdx ? '#000000' : '#CBCBCB'},
						font: {
							size: 10,
							weight: 600
						}
                    },
					grid: {
						offset: false
					}
                }
    		}
  		},
	};
	
	new Chart(document.getElementById('crewDateListGraph'), chartConfigCrewDateList);
	
	/// 승선 현황
	let cTotal = 0;
	let cShi = 0;
	let cOut = 0;
	let cOwner = 0;
	let cCls = 0;
	let cSe = 0;
	let cCaptain = 0;
	let cMate = 0;
	let cEng = 0;
	let cEtc = 0;

	if(!isEmpty(todayCrewCntObj)) {
		cTotal = isNanEmpty(todayCrewCntObj.total) ? 0 : parseInt(todayCrewCntObj.total);
		cShi = isNanEmpty(todayCrewCntObj.shi) ? 0 : parseInt(todayCrewCntObj.shi);
		cOut = isNanEmpty(todayCrewCntObj.out) ? 0 : parseInt(todayCrewCntObj.out);
		cOwner = isNanEmpty(todayCrewCntObj.owner) ? 0 : parseInt(todayCrewCntObj.owner);
		cCls = isNanEmpty(todayCrewCntObj.class) ? 0 : parseInt(todayCrewCntObj.class);
		cSe = isNanEmpty(todayCrewCntObj.se) ? 0 : parseInt(todayCrewCntObj.se);
		cCaptain = isNanEmpty(todayCrewCntObj.captain) ? 0 : parseInt(todayCrewCntObj.captain);
		cMate = isNanEmpty(todayCrewCntObj.mate) ? 0 : parseInt(todayCrewCntObj.mate);
		cEng = isNanEmpty(todayCrewCntObj.eng) ? 0 : parseInt(todayCrewCntObj.eng);
		cEtc = isNanEmpty(todayCrewCntObj.etc) ? 0 : parseInt(todayCrewCntObj.etc);
	}
	
	$('#crewCntTotal').text(cTotal);
	$('#crewCnt01').text(cShi);
	$('#crewCnt02').text(cOut);
	$('#crewCnt03').text(cOwner + ' / ' + cCls);
	$('#crewCnt04').text(cSe);
	$('#crewCnt05').text(cCaptain + ' / ' + cMate);
	$('#crewCnt06').text(cEng);
	$('#crewCnt07').text(cEtc);
	
	// 연료 잔량 추이.
	stepDate = new Date(_dateSdate);
	disabledTickStartIdx = 0;
	
	let chartDatasetsItemFuelDate = [];
	let chartLabelFuelDate = [];
	let chartLabelFuelDateTotal = [];
	let tempTotalFuel = 0;
	let tempDataHfo = [];
	let tempDataMgo = [];
	let tempDataLng = [];
	let tempDataMdo = [];
	let tempHfo = 0;
	let tempMgo = 0;
	let tempLng = 0;
	let tempMdo = 0;
	let isExistHfo = false;
	let isExistMgo = false;
	let isExistLng = false;
	let isExistMdo = false;
	
	if(!isEmpty(_fuelDateList)) {
		let eDateStr = eDate.getFullYear() + '-' + (eDate.getMonth() + 1).toString().padStart(2,'0') + '-' + eDate.getDate().toString().padStart(2,'0');
		isExistHfo = !isNanEmpty(_fuelDateList[0].hfo);
		isExistMgo = !isNanEmpty(_fuelDateList[0].mgo);
		isExistLng = !isNanEmpty(_fuelDateList[0].lng);
		isExistMdo = !isNanEmpty(_fuelDateList[0].mdo);
		
		if(isExistHfo) {
			tempHfo = parseFloat(_fuelDateList[0].hfo);
		}
		
		if(isExistMgo) {
			tempMgo = parseFloat(_fuelDateList[0].mgo);
		}
		
		if(isExistLng) {
			tempLng = parseFloat(_fuelDateList[0].lng);
		}
		
		if(isExistMdo) {
			tempMdo = parseFloat(_fuelDateList[0].mdo);
		}
		
		for(let i = 0; i < 20; i++) {
			let stepDateStr = stepDate.getFullYear() + '-' + (stepDate.getMonth() + 1).toString().padStart(2,'0') + '-' + stepDate.getDate().toString().padStart(2,'0');
			let dt = (stepDate.getMonth() + 1).toString().padStart(2,'0') + '.' + stepDate.getDate().toString().padStart(2,'0');
			tempTotalFuel = 0;
			
			if(isDueDateValid(stepDate, todayDate)) {
				let isExistDate = false;
				let existDateIdx = 0;
				
				for(let x = 0; x < _fuelDateList.length; x++) {
					let fuelDate = _fuelDateList[x].date;
					
					if(stepDateStr == fuelDate) {
						isExistDate = true;
						existDateIdx = x;
						break;
					}
				}
				
				if(isExistDate) {
					if(isExistHfo) {
						tempHfo = parseFloat(_fuelDateList[existDateIdx].hfo);
						tempDataHfo.push(tempHfo);
						tempTotalFuel += tempHfo;
					}
					
					if(isExistMgo) {
						tempMgo = parseFloat(_fuelDateList[existDateIdx].mgo);
						tempDataMgo.push(tempMgo);
						tempTotalFuel += tempMgo;
					}
					
					if(isExistLng) {
						tempLng = parseFloat(_fuelDateList[existDateIdx].lng);
						tempDataLng.push(tempLng);
						tempTotalFuel += tempLng;
					}
					
					if(isExistMdo) {
						tempMdo = parseFloat(_fuelDateList[existDateIdx].mdo);
						tempDataMdo.push(tempMdo);
						tempTotalFuel += tempMdo;
					}
				}else {
					if(isExistHfo) {
						tempDataHfo.push(tempHfo);
						tempTotalFuel += tempHfo;
					}
					
					if(isExistMgo) {
						tempDataMgo.push(tempMgo);
						tempTotalFuel += tempMgo;
					}
					
					if(isExistLng) {
						tempDataLng.push(tempLng);
						tempTotalFuel += tempLng;
					}
					
					if(isExistMdo) {
						tempDataMdo.push(tempMdo);
						tempTotalFuel += tempMdo;
					}
				}
			
				disabledTickStartIdx++;
			}else {
				if(isExistHfo) {
					tempDataHfo.push(null);
				}
				
				if(isExistMgo) {
					tempDataMgo.push(null);
				}
				
				if(isExistLng) {
					tempDataLng.push(null);
				}
				
				if(isExistMdo) {
					tempDataMdo.push(null);
				}
			}
			
			chartLabelFuelDate.push(dt);
			chartLabelFuelDateTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
			
			if(stepDateStr == eDateStr) {
				break;
			}
			
			stepDate.setDate(stepDate.getDate() + 1);
		}
	}
	
	if(tempDataHfo.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('trialList.hfo'),
			backgroundColor: '#7EC5FF',
			data: tempDataHfo,
			barThickness: 40
		});
	}
	
	if(tempDataMgo.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('trialList.mgo'),
			backgroundColor: '#0671E0',
			data: tempDataMgo,
			barThickness: 40
		});
	}
	
	if(tempDataLng.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('trialList.lng'),
			backgroundColor: '#071972',
			data: tempDataLng,
			barThickness: 40
		});
	}
	
	if(tempDataMdo.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('trialList.mdo'),
			backgroundColor: '#CFCFDC',
			data: tempDataMdo,
			barThickness: 40
		});
	}
	
	const chartConfigFuelDate = {
  		type: 'bar',
  		data: {
	  		labels: chartLabelFuelDate,
	  		datasets: chartDatasetsItemFuelDate
		},
		plugins: [ChartDataLabels],
  		options: {
			responsive: false,
			plugins: {
			    legend: {
			      	display: false,
					align: 'end',
					labels: {
						usePointStyle: true,
						pointStyle: 'rect',
						pointStyleWidth: 12
					}
			    },
				datalabels: {
        			color: '#FFFFFF',
					anchor: 'center',
					align: 'center',
					font: {
						size: 9,
						weight: 600
					}
      			}
			},
    		scales: {
      			y: {
					stacked: true,
					ticks: {
                        color: '#000000',
						align: 'start',
						font: {
							size: 9,
							weight: 400
						}
                    },
        			beginAtZero: true
      			},
				x: {
					stacked: true,
                    ticks: {
                        color: (c) => {return c['tick']['value'] < disabledTickStartIdx ? '#000000' : '#CBCBCB'},
						font: {
							size: 10,
							weight: 600
						}
                    },
					grid: {
						offset: false
					}
                }
    		}
  		},
	};
	
	new Chart(document.getElementById('fuelDateGraph'), chartConfigFuelDate);
	
	let fuelDateGraphTotalHtml = '<div></div>';
	let fuelDateGraphTotalStyle = 'display: grid; grid-template-columns: 30px';
	
	for(let i = 0; i < chartLabelFuelDateTotal.length; i++) {
		fuelDateGraphTotalHtml += '<div class="text-center"><div class="report-graph-total-info">' + chartLabelFuelDateTotal[i] + '</div></div>';
		fuelDateGraphTotalStyle += ' 1fr';
	}
	
	fuelDateGraphTotalStyle += ';';
	
	document.getElementById('fuelDateGraphTotal').style.cssText = fuelDateGraphTotalStyle;
	$('#fuelDateGraphTotal').html(fuelDateGraphTotalHtml);
	
	/// 완료 데이터.
	let measureSpeedTotal = 0;
	let theadHtml = '<thead><tr>';
	let tbodyHtml = '<tbody><tr>';
	let isTrial1 = false;
	let isTrial2 = false;
	
	theadHtml += '<th>' + _hullNum + '</th>';
	tbodyHtml += '<td>' + (isEmpty(_infoBean) ? '-' : _infoBean.measureSpeed + ' Knots') + '</td>';
	measureSpeedTotal = !isEmpty(_infoBean) && !isNanEmpty(_infoBean.measureSpeed) ? parseFloat(_infoBean.measureSpeed) : 0;
	
	if(!isEmpty(_trialList)) {
		isTrial1 = _trialList.trial1Uid > 0;
		isTrial2 = _trialList.trial2Uid > 0;
		
		if(isTrial1) {
			theadHtml += '<th>' + _trialList.trial1Num + '</th>';
			tbodyHtml += '<td>' + (isEmpty(_trialList1Comp) || isNanEmpty(_trialList1Comp.measureSpeed) ? '-' : (_trialList1Comp.measureSpeed + ' Knots')) + '</td>';
			measureSpeedTotal += !isEmpty(_trialList1Comp) && !isNanEmpty(_trialList1Comp.measureSpeed) ? parseFloat(_trialList1Comp.measureSpeed) : 0;
		}	
		
		if(isTrial2) {
			theadHtml += '<th>' + _trialList.trial2Num + '</th>';
			tbodyHtml += '<td>' + (isEmpty(_trialList2Comp) || isNanEmpty(_trialList2Comp.measureSpeed) ? '-' : (_trialList2Comp.measureSpeed + ' Knots')) + '</td>';
			measureSpeedTotal += !isEmpty(_trialList2Comp) && !isNanEmpty(_trialList2Comp.measureSpeed) ? parseFloat(_trialList2Comp.measureSpeed) : 0;
		}	
	}
	
	let speedDivide = 1;
	speedDivide += isTrial1 && !isEmpty(_trialList1Comp) && !isNanEmpty(_trialList1Comp.measureSpeed) ? 1 : 0;
	speedDivide += isTrial2 && !isEmpty(_trialList2Comp) && !isNanEmpty(_trialList2Comp.measureSpeed) ? 1 : 0;
	measureSpeedTotal = Math.floor(parseFloat(measureSpeedTotal / speedDivide) * 100) / 100;
	
	theadHtml += '<th>' + $.i18n.t('trialList.avg') + '</th>';
	tbodyHtml += '<td>' + (measureSpeedTotal > 0 ? measureSpeedTotal + ' Knots' : '-') + '</td>';
	
	theadHtml += '</tr></thead>';
	tbodyHtml += '</tr></tbody>';
	
	$('#speedData').html(theadHtml + tbodyHtml);
}

// 제출 팝업.
function showSubmitPop() {
	if(_status != 'ONGO') {
		alertPop($.i18n.t('error.save'));
		return;
	}
	
	if(_mailList.length == 0) {
		for(let i = 0; i < _mailingList.length; i++) {
			addMailList(_mailingList[i].email, _mailingList[i].name, 'TO');
		}
	}
	
	$('#submitPop').modal();
}

// 메일 검색.
function searchEmail() {
	let search = $('#submitPopSearchDesc').val();
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/searchEmail.html',
		data: {
			search: search
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				$('#submitPopMailList').empty();
			
				if(json.list.length > 0) {
					for(let i = 0; i < json.list.length; i++) {
						let bean = json.list[i];
						let name = bean.name;
						let company = bean.company;
						let department = bean.department;
						let rank = bean.rank;
						let email = bean.email;
						
						let text = '<tr>' + 
										'<td>' + name + '</td>' + 
										'<td>' + rank + '</td>' + 
										'<td>' + department + '</td>' + 
										'<td>' + company + '</td>' + 
										'<td>' + email + '</td>' + 
										'<td class="text-center"><span class="cursor-pointer" onClick="addMailList(\'' + email + '\', \'' + name + '\', \'TO\')"><i class="fa fa-plus-square"></i></span></td>' + 
										'<td class="text-center"><span class="cursor-pointer" onClick="addMailList(\'' + email + '\', \'' + name + '\', \'CC\')"><i class="fa fa-plus-square"></i></span></td>' + 
										'<td class="text-center"><span class="cursor-pointer" onClick="addMailList(\'' + email + '\', \'' + name + '\', \'BCC\')"><i class="fa fa-plus-square"></i></span></td>' + 
									'</tr>';
				
						$('#submitPopMailList').append(text);
					}
				}else{
					$('#submitPopMailList').append('<tr><td class="text-center" colspan="8">' + $.i18n.t('share:noList') + '</td></tr>');
				}
			}catch(ex) {
				alertPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			alertPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display','none');
		}
	});
}

// 신규 메일 추가.
function addNewEmail() {
	let isExist = false;
	let email = $('#submitPopNewEmail').val();
	let kind = $('#submitPopNewEmailKind').val();
	
	if(isEmpty(email)) {
		toastPop($.i18n.t('submitPop.errorEmptyNewEmail'));
		return;
	}
	
	for(let i = 0; i < _mailList.length; i++) {
		if(_mailList[i].email == email) {
			isExist = true;
			break;
		}
	}
	
	if(!isExist) {
		let id = _mailId++;
		let listId = '#submitPopToList';
		
		if(kind == 'CC') {
			listId = '#submitPopCcList';
		}else if(kind == 'BCC') {
			listId = '#submitPopBccList';
		}	
		
		let chip = '<div id="mailList_' + id + '" class="chip-obj">' + 
						email +  
						'<span class="chip-divide"></span>' + 
						'<span onclick="delMailList(' + id + ')" class="chip-btn-delete"><i class="fa-solid fa-xmark fa-sm"></i></span>' + 
					'</div>';
		
		$(listId).append(chip);
		_mailList.push({id: id, kind: kind, email: email});
	}
	
	$('#submitPopNewEmail').val('');
}
 
// 목록에서 메일 추가.
function addMailList(email, name, kind) {
	let isExist = false;
	
	for(let i = 0; i < _mailList.length; i++) {
		if(_mailList[i].email == email) {
			isExist = true;
			break;
		}
	}
	
	if(!isExist) {
		let id = _mailId++;
		let listId = '#submitPopToList';
		let nameVl = isEmpty(name) ? '' : '<span class="text-dark pl-1"> [' + name + ']</span>';
		
		if(kind == 'CC') {
			listId = '#submitPopCcList';
		}else if(kind == 'BCC') {
			listId = '#submitPopBccList';
		}	
		
		let chip = '<div id="mailList_' + id + '" class="chip-obj">' + 
						email + nameVl +   
						'<span class="chip-divide"></span>' + 
						'<span onclick="delMailList(' + id + ')" class="chip-btn-delete"><i class="fa-solid fa-xmark fa-sm"></i></span>' + 
					'</div>';
					
		$(listId).append(chip);
		_mailList.push({id: id, kind: kind, email: email});
	}
}

// 메일 삭제.
function delMailList(id) {
	for(let i = 0; i < _mailList.length; i++) {
		if(_mailList[i].id == id) {
			_mailList.splice(i, 1);
			break;
		}
	}
		
	$('#mailList_' + id).remove();
}

// 제출.
function submitReport() {
	if(_status != 'ONGO') {
		toastPop($.i18n.t('error.save'));
		return;
	}
	
	if(_mailList.length < 1) {
		toastPop($.i18n.t('submitPop.errorNoEmailList'));
		return;
	}
	
	const formData = new FormData();
	formData.append('schedulerInfoUid', _scheUid);
	
	for(let i = 0; i < _mailList.length; i++) {
		let kind = _mailList[i].kind;
		let email = _mailList[i].email;
		
		if(kind == 'CC') {
			formData.append('ccList', email);
		}else if(kind == 'BCC') {
			formData.append('bccList', email);
		}else {
			formData.append('toList', email);
		}
	}
	
	html2canvas(document.getElementById('printArea'), {}).then(canvas => {
		window.jsPDF = window.jspdf.jsPDF;
		
        const pdf = new jsPDF({
		  	orientation: 'p',
		  	unit: 'px',
		  	format: [canvas.width, canvas.height]
		});
		
        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height);

		html2canvas(document.getElementById('printArea2'), {}).then(canvas => {
			pdf.addPage();
	        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height); 
			
			formData.append('file', pdf.output('blob', {filename: 'scp_report.pdf'}));

			jQuery.ajax({
				type: 'POST',
				url: contextPath + '/sche/resultCompReportSubmit.html',
				enctype: 'multipart/form-data',
				processData: false,
		        contentType: false,
				data: formData,
				success: function(data) {
					try {
						let json = JSON.parse(data);
					
						if(json.result) {
							$('#submitPop').modal('hide');
							alertPopBack($.i18n.t('submitPop.compSubmit'), function() {
								location.href = contextPath + '/sche/scheChart.html?uid=' + _scheUid;
							});
						}else{
							let code = json.code;
						
							if(code == 'DEPART' || code == 'ARRIVE') {
								_status = code;
								toastPop($.i18n.t('error.save'));
							}else if(code == 'EEI') {
								toastPop($.i18n.t('error.emptyInfo'));
							}else if(code == 'EIO') {
								toastPop($.i18n.t('share:isOffline'));
							}else {
								toastPop($.i18n.t('share:tryAgain'));
							}
						}
					}catch(ex) {
						toastPop($.i18n.t('share:tryAgain'));
					}
				},
				error: function(req, status, err) {
					toastPop($.i18n.t('share:tryAgain'));
				},
				beforeSend: function() {
					loadingOverlay.activate();
				},
				complete: function() {
					loadingOverlay.cancelAll();
				}
			});
	    });
    });
}
