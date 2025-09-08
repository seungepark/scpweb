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
            namespaces: ['share', 'planDepartureReport'],
            defaultNs: 'planDepartureReport'
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
}

// 데이터 세팅.
function initData() {
	/// 제목.
	let scheTypeLabel = _schedType;
	let logoBgClass = '';
	let logoTitle = '';
	let logoSubtitle = $.i18n.t('share:reportType.depart');
	
	switch(_schedType) {
		case 'SEA': scheTypeLabel = $.i18n.t('share:schedType.sea'); 
			logoBgClass = 'report-type-logo-sea'; 
			logoTitle = $.i18n.t('share:reportType.sea'); break;
		case 'GAS': scheTypeLabel = $.i18n.t('share:schedType.gas'); 
			logoBgClass = 'report-type-logo-gas';
			logoTitle = $.i18n.t('share:reportType.gas'); break;
		case 'TOTAL': scheTypeLabel = $.i18n.t('share:schedType.total'); 
			logoBgClass = 'report-type-logo-total';
			logoTitle = $.i18n.t('share:reportType.total'); break;
	}
	
	$('#titleSchedType').text(scheTypeLabel);
	
	document.getElementById('typeLogo').classList.add(logoBgClass);
	$('#typeTitle').text(logoTitle);
	$('#typeSubtitle').text(logoSubtitle);
	
	/// 스케쥴.
	let day = isNanEmpty(_schedule.day) ? 0 : parseInt(_schedule.day);
	let dayNight = (day + 1) + $.i18n.t('scheDay');
	
	if(day > 0) {
		dayNight = day + $.i18n.t('scheNight') + ' ' + dayNight;
	}
	
	dayNight += ' ' + _schedule.hour + 'h';
	
	$('#scheTime').text(dayNight);
	$('#schePlan').text(_schedule.sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule.eDate.replaceAll('-', '.').replaceAll(' ', ' · '));	
	
	let dateDiff = parseInt(_schedule.day);
	let viewDate = new Date(_schedule.sDate);
	let isExistWf = isValidDate(_wf);
	let wfDate = '';
	let wfCnt = 0;
	let emptyCnt = 5;
	let periodEnd = 0;
	let monthMin = '';
	let monthMax = '';
	
	if(isExistWf) {
		wfDate = new Date(_wf);
	}
	
	if(dateDiff >= 26) {
		viewDate.setDate(viewDate.getDate() - 1);
		emptyCnt = 1;
		
	}else {
		viewDate.setDate(viewDate.getDate() - 5);
	}
	
	periodEnd = emptyCnt + dateDiff;
	
	let scheCalDateList = '';
	
	for(let i = 0; i < 31; i++) {
		let date = viewDate.getDate();
		let day = viewDate.getDay();
		let dayClass = '';
		let periodClass = '';
		let wfClass = '';
		
		if(day == 0) {
			dayClass = 'report-schedule-date-sun';
		}else if(day == 6) {
			dayClass = 'report-schedule-date-sat';
		}
		
		if(i >= emptyCnt && i <= periodEnd) {
			periodClass = 'report-schedule-date-period-bg';
		}
		
		if(isExistWf) {
			let tempWf = wfDate.getFullYear() + ' ' + wfDate.getMonth() + ' ' + wfDate.getDate();
			let tempView = viewDate.getFullYear() + ' ' + viewDate.getMonth() + ' ' + viewDate.getDate();
			
			if(tempWf == tempView) {
				wfClass = 'report-schedule-date-wf';
				wfCnt = i + 1;
			}
		}
		
		scheCalDateList += '<div class="report-schedule-date ' + dayClass + ' ' + periodClass + ' ' + wfClass + '">' + date + '</div>';
		
		let monthStr = getMonthStr(viewDate.getMonth());;
		
		if(monthMin == '' && monthMax == '') {
			monthMin = monthStr;
			monthMax = monthStr;
		}else {
			if(monthMax != monthStr) {
				monthMax = monthStr;
			}
		}
		
		viewDate.setDate(date + 1);
	}
	
	$('#scheCalDateList').html(scheCalDateList);
	$('#scheMonth').text(monthMin == monthMax ? '[' + monthMin + ']' : '[' + monthMin + ' - ' + monthMax + ']');
	
	let labelStyle = 'display: grid; grid-template-columns: ';
	let divList = '';
	let cntFirstEmpty = 0;
	let cntLabel = 0;
	let cntAfterEmpty = 0;
	let cntWf = 0;
	let cntLastEmpty = 0;
	let isCntFirstEmpty = false;
	let isCntAfterEmpty = false;
	let isCntWf = false;
	let isCntLastEmpty = false;
	
	if(dateDiff > 0) {
		if(emptyCnt == 1) {
			cntLabel = 1 + dateDiff + 1 + 1;
		}else {
			isCntFirstEmpty = true;
			
			if(dateDiff < 4) {
				cntFirstEmpty = 3;
				cntLabel = 2 + dateDiff + 1 + 2;
			}else {
				cntFirstEmpty = 5;
				cntLabel = dateDiff + 1;
			}
		}
		
		if(cntLabel < 5) {
			cntLabel = 5;
		}
		
		if(cntFirstEmpty + cntLabel == 31) {
			isCntAfterEmpty = false;
			isCntWf = false;
			isCntLastEmpty = false;
		}else {
			if(cntFirstEmpty + cntLabel < 29) {
				if(wfCnt > 0) {
					isCntWf = true;
					cntWf = 3;
					
					if(wfCnt < 30) {
						isCntLastEmpty = true;
						cntLastEmpty = 31 - wfCnt - 1
					}
				}
			}
			
			cntAfterEmpty = 31 - cntFirstEmpty - cntLabel - cntWf - cntLastEmpty;
			
			if(cntAfterEmpty > 0) {
				isCntAfterEmpty = true;
			}
		}
		
		let tempTrialLabel = _schedType;
		
		switch(_schedType) {
			case 'SEA': tempTrialLabel = 'Sea Trial'; break;
			case 'GAS': tempTrialLabel = 'Gas Trial'; break;
			case 'TOTAL': tempTrialLabel = 'Total Trial'; break;
		}

		if(isCntFirstEmpty) {
			labelStyle += cntFirstEmpty + 'fr ';
			divList += '<div></div>';
		}
		
		labelStyle += cntLabel + 'fr ';
		divList += '<div class="report-schedule-date-label">' + tempTrialLabel + '</div>';
		
		if(isCntAfterEmpty) {
			labelStyle += cntAfterEmpty + 'fr ';
			divList += '<div></div>';
		}
		
		if(isCntWf) {
			labelStyle += cntWf + 'fr ';
			divList += '<div class="report-schedule-date-label">W/F</div>';
		}
		
		if(isCntLastEmpty) {
			labelStyle += cntLastEmpty + 'fr ';
			divList += '<div></div>';
		}
	}else {
		labelStyle += '1fr';
		divList = '<div></div>';
	}
	
	document.getElementById('scheCalDateListLabel').style.cssText = labelStyle;
	$('#scheCalDateListLabel').html(divList);
	
	/// 시운전 전망 차트.
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
	
	if(!isEmpty(_trialListCurr)) {
		if(!isEmpty(_trialListCurr.hfo)) {
			chartBarColorTrialFuelCurr.push('#7EC5FF');
			chartDataTrialFuelCurr.push(isNanEmpty(_trialListCurr.hfo) ? '' : parseFloat(_trialListCurr.hfo));
			isTrialFuelHfoCurr = true;
			
			if(!isNanEmpty(_trialListCurr.hfo)) {
				tempTotalFuel += parseFloat(_trialListCurr.hfo);
			}
		}
		
		if(!isEmpty(_trialListCurr.mgo)) {
			chartBarColorTrialFuelCurr.push('#0671E0');
			chartDataTrialFuelCurr.push(isNanEmpty(_trialListCurr.mgo) ? '' : parseFloat(_trialListCurr.mgo));
			isTrialFuelMgoCurr = true;
			
			if(!isNanEmpty(_trialListCurr.mgo)) {
				tempTotalFuel += parseFloat(_trialListCurr.mgo);
			}
		}
		
		if(!isEmpty(_trialListCurr.lng)) {
			chartBarColorTrialFuelCurr.push('#071972');
			chartDataTrialFuelCurr.push(isNanEmpty(_trialListCurr.lng) ? '' : parseFloat(_trialListCurr.lng));
			isTrialFuelLngCurr = true;
			
			if(!isNanEmpty(_trialListCurr.lng)) {
				tempTotalFuel += parseFloat(_trialListCurr.lng);
			}
		}
		
		if(!isEmpty(_trialListCurr.mdo)) {
			chartBarColorTrialFuelCurr.push('#CFCFDC');
			chartDataTrialFuelCurr.push(isNanEmpty(_trialListCurr.mdo) ? '' : parseFloat(_trialListCurr.mdo));
			isTrialFuelMdoCurr = true;
			
			if(!isNanEmpty(_trialListCurr.mdo)) {
				tempTotalFuel += parseFloat(_trialListCurr.mdo);
			}
		}
	}else {
		chartBarColorTrialFuelCurr = ['#7EC5FF', '#0671E0', '#071972', '#CFCFDC'];
		chartDataTrialFuelCurr = ['', '', '', ''];
	}
	
	chartLabelTrialFuel.push(_hullNum + ' ' + $.i18n.t('trialList.pred'));
	chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
	chartDataTrialTime.push(isNanEmpty(_planTime) ? 0 : parseFloat(_planTime));
	chartBarColorTrialTime.push('#FFFFFF');
	chartLabelTrialTime.push(_hullNum + ' ' + $.i18n.t('trialList.pred'));
	
	let isTrial1 = false;
	let isTrial2 = false;
	
	if(!isEmpty(_trialList)) {
		isTrial1 = _trialList.trial1Uid > 0;
		isTrial2 = _trialList.trial2Uid > 0;
		
		let fuelAvgHfo = 0;
		let fuelAvgMgo = 0;
		let fuelAvgMdo = 0;
		let fuelAvgLng = 0;
		let fuelAvgHfoDivide = 0;
		let fuelAvgMgoDivide = 0;
		let fuelAvgMdoDivide = 0;
		let fuelAvgLngDivide = 0;
		
		if(isTrial1) {
			tempTotalFuel = 0;
			
			if(!isEmpty(_trialList1)) {
				if(!isEmpty(_trialList1.hfo)) {
					let vl = isNanEmpty(_trialList1.hfo) ? '' : parseFloat(_trialList1.hfo);
					fuelAvgHfo = vl;
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
					fuelAvgMgo = vl;
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
					fuelAvgLng = vl;
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
					fuelAvgMdo = vl;
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
			chartDataTrialTimeSeriesAvg = isNanEmpty(_trialList.trial1Time) ? 0 : parseFloat(_trialList.trial1Time);
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
			chartDataTrialTime.push(isNanEmpty(_trialList.trial2Time) ? '' : parseFloat(_trialList.trial2Time));
			chartDataTrialTimeSeriesAvg += isNanEmpty(_trialList.trial2Time) ? '' : parseFloat(_trialList.trial2Time);
			chartBarColorTrialTime.push('#FFFFFF');
			chartLabelTrialTime.push(_trialList.trial2Num);
		}

		if(isTrial1 || isTrial2) {
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
			
			let divide = isTrial1 ? 1 : 0;
			divide += isTrial2 ? 1 : 0;
			chartDataTrialTimeSeriesAvg = chartDataTrialTimeSeriesAvg / divide;
			chartDataTrialTime.push(isNanEmpty(chartDataTrialTimeSeriesAvg) ? '' : Math.floor(parseFloat(chartDataTrialTimeSeriesAvg) * 10) / 10);
			chartLabelTrialFuel.push($.i18n.t('trialList.avg'));
			chartLabelTrialFuelTotal.push(Math.floor(parseFloat(tempTotalFuel) * 100) / 100);
			chartBarColorTrialTime.push('#FFFFFF');
			chartLabelTrialTime.push($.i18n.t('trialList.avg'));
		}
	}
	
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
//				title: {
//					display: true,
//					text: 'Fuel',
//					color: '#212134',
//					position: 'left',
//					font: {
//						size: 14,
//						weight: '600'
//					}
//				},
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
//				annotation: {
//		        	clip: false,
//		        	annotations: {
//			          	scaleTitle: {
//				            type: 'label',
//				            xValue: 0,
//				            yValue(ctx) {
//				              	const yScale = ctx.chart.scales.y;
//				              	return yScale.end;
//				            },
//				            font:{ 
//				              	size: 14, 
//				              	weight: 'bold'
//				            },
//				            position: {
//				              	x: 'start',
//				              	y: 'end'
//				            },
//							padding: {
//								bottom: 6
//							},
//				            xAdjust(ctx) {
//				              	const yScale = ctx.chart.scales.y;
//				              	return yScale.left - 117;
//				            },
//				            content: $.i18n.t('trialList.subtitle2')
//			          	}
//		        	}
//		      	}
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
				borderWidth: 2,
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
//				annotation: {
//		        	clip: false,
//		        	annotations: {
//			          	scaleTitle: {
//				            type: 'label',
//				            xValue: 0,
//				            yValue(ctx) {
//				              	const yScale = ctx.chart.scales.y;
//				              	return yScale.end;
//				            },
//				            font:{ 
//				              	size: 14, 
//				              	weight: 'bold'
//				            },
//				            position: {
//				              	x: 'start',
//				              	y: 'end'
//				            },
//							padding: {
//								bottom: 6
//							},
//				            xAdjust(ctx) {
//				              	const yScale = ctx.chart.scales.y;
//				              	return yScale.left - 117;
//				            },
//				            content: $.i18n.t('trialList.subtitle1')
//			          	}
//		        	}
//		      	}
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
	
	/// Fuel 차트.
	let chartLabelFuel = [];
	let chartBarColorFuel = [];
	let chartDataFuel = [];
	
	if(!isEmpty(_trialListCurr)) {
		if(!isEmpty(_trialListCurr.hfo)) {
			chartLabelFuel.push($.i18n.t('fuel.hfo'));
			chartBarColorFuel.push('#7EC5FF');
			chartDataFuel.push(isNanEmpty(_trialListCurr.hfo) ? 0 : parseFloat(_trialListCurr.hfo));
		}
		
		if(!isEmpty(_trialListCurr.mgo)) {
			chartLabelFuel.push($.i18n.t('fuel.mgo'));
			chartBarColorFuel.push('#0671E0');
			chartDataFuel.push(isNanEmpty(_trialListCurr.mgo) ? 0 : parseFloat(_trialListCurr.mgo));
		}
		
		if(!isEmpty(_trialListCurr.lng)) {
			chartLabelFuel.push($.i18n.t('fuel.lng'));
			chartBarColorFuel.push('#071972');
			chartDataFuel.push(isNanEmpty(_trialListCurr.lng) ? 0 : parseFloat(_trialListCurr.lng));
		}
		
		if(!isEmpty(_trialListCurr.mdo)) {
			chartLabelFuel.push($.i18n.t('fuel.mdo'));
			chartBarColorFuel.push('#CFCFDC');
			chartDataFuel.push(isNanEmpty(_trialListCurr.mdo) ? 0 : parseFloat(_trialListCurr.mdo));
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

	/// ITP 차트.
	if(!isEmpty(_itpList)) {
		const chartPluginTextCenter = {
			id: 'textCenter',
			beforeDatasetsDraw(chart, args, pluginOptions) {
				const {ctx, data} = chart;
				ctx.save();
				ctx.font = 'bolder 12px roboto';
				ctx.fillStyle = '#000000';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(data.datasets[0].data[0] + '%', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
			}
		};
			
		if(!isEmpty(_itpList.totalRemain) && !isEmpty(_itpList.totalBase)) {
			/// ITP total 차트.
			let base = isNanEmpty(_itpList.totalBase) ? 0 : parseInt(_itpList.totalBase);
			let remain = isNanEmpty(_itpList.totalRemain) ? 0 : parseInt(_itpList.totalRemain);
			let per = Math.floor(parseFloat(remain / base * 100) * 100) / 100;
			let comp = 100 - per;
			
			const chartConfig = {
		  		type: 'doughnut',
		  		data: {
			  		datasets: [{
			    		backgroundColor: ['#4196F0', '#E7E7E7'],
			    		data: [comp, per],
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
			
			new Chart(document.getElementById('itpTotalGraph'), chartConfig);
		}
			
		if(!isEmpty(_itpList.trialRemain) && !isEmpty(_itpList.trialBase)) {
			/// ITP trial 차트.
			let base = isNanEmpty(_itpList.trialBase) ? 0 : parseInt(_itpList.trialBase);
			let remain = isNanEmpty(_itpList.trialRemain) ? 0 : parseInt(_itpList.trialRemain);
			let per = Math.floor(parseFloat(remain / base * 100) * 100) / 100;
			let comp = 100 - per;
			
			const chartConfig = {
		  		type: 'doughnut',
		  		data: {
			  		datasets: [{
			    		backgroundColor: ['#4196F0', '#E7E7E7'],
			    		data: [comp, per],
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
			
			new Chart(document.getElementById('itpTrialGraph'), chartConfig);
		}
			
		if(!isEmpty(_itpList.outfittingRemain) && !isEmpty(_itpList.outfittingBase)) {
			/// ITP outfitting 차트.
			let base = isNanEmpty(_itpList.outfittingBase) ? 0 : parseInt(_itpList.outfittingBase);
			let remain = isNanEmpty(_itpList.outfittingRemain) ? 0 : parseInt(_itpList.outfittingRemain);
			let per = Math.floor(parseFloat(remain / base * 100) * 100) / 100;
			let comp = 100 - per;
			
			const chartConfig = {
		  		type: 'doughnut',
		  		data: {
			  		datasets: [{
			    		backgroundColor: ['#4196F0', '#E7E7E7'],
			    		data: [comp, per],
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
			
			new Chart(document.getElementById('itpOutfittingGraph'), chartConfig);
		}
	}
	
	/// 프로젝트 담당자.
	for(let i = 0; i < _commanderList.length; i++) {
		if(_commanderList[i].mainSub == 'M') {
			$('#commander01').html(_commanderList[i].name + '<br>' + _commanderList[i].phone);
		}else {
			$('#commander02').html(_commanderList[i].name + '<br>' + _commanderList[i].phone);
		}
		
	}
	
	for(let i = 0; i < _mainCrewList.length; i++) {
		let name = _mainCrewList[i].name;
		let phone = _mainCrewList[i].phone;
		let type2 = _mainCrewList[i].workType2;
		
		if(type2 == 'A2') {
			$('#crew01').html(name + '<br>' + phone);
		}else if(type2 == 'A3') {
			$('#crew02').html(name + '<br>' + phone);
		}else if(type2 == 'A4') {
			$('#crew03').html(name + '<br>' + phone);
		}else if(type2 == 'C1') {
			$('#crew04').html(name + '<br>' + phone);
		}else if(type2 == 'D3') {
			$('#crew05').html(name + '<br>' + phone);
		}
		
	}
	
	/// 승선 현황.
	let owner = 0;
	let cls = 0;
	let captain = 0;
	let mate = 0;
	
	for(let i = 0; i < _crewCntList.length; i++) {
		let cnt = _crewCntList[i].cnt;
		let kind = _crewCntList[i].kind;
		
		if(kind == 'TOTAL') {
			$('#crewCntTotal').html(cnt);
		}else if(kind == 'SHI') {
			$('#crewCnt01').html(cnt);
		}else if(kind == 'OUT') {
			$('#crewCnt02').html(cnt);
		}else if(kind == 'OWNER') {
			owner = cnt;
		}else if(kind == 'CLASS') {
			cls = cnt;
		}else if(kind == 'SE') {
			$('#crewCnt04').html(cnt);
		}else if(kind == 'CAPTAIN') {
			captain = cnt;
		}else if(kind == 'MATE') {
			mate = cnt;
		}else if(kind == 'ENG') {
			$('#crewCnt06').html(cnt);
		}else if(kind == 'ETC') {
			$('#crewCnt07').html(cnt);
		}
	}
	
	$('#crewCnt03').html(owner + ' / ' + cls);
	$('#crewCnt05').html(captain + ' / ' + mate);
	
	for(let i = 0; i < _tcCntList.length; i++) {
		$('#trialCnt' + (i + 1)).html(_tcCntList[i]);
	}
}

// 제출 팝업.
function showSubmitPop() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
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
	if(_status == 'ONGO' || _status == 'ARRIVE') {
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

        formData.append('file', pdf.output('blob', {filename: 'scp_report.pdf'}));

		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/sche/planDepartureReportSubmit.html',
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
					
						if(code == 'ONGO' || code == 'ARRIVE') {
							_status = code;
							toastPop($.i18n.t('error.save'));
						}else if(code == 'EEI') {
							toastPop($.i18n.t('error.emptyInfo'));
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
}