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
            namespaces: ['share', 'resultDailyReport'],
            defaultNs: 'resultDailyReport'
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
		if($('#checkComp').is(':checked')) {
			location.href = contextPath + '/sche/resultCompReport.html?uid=' + _scheUid;
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
	let logoBgClass = '';
	let logoTitle = '';
	let logoSubtitle = $.i18n.t('share:reportType.daily');
	
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
	$('#titleSchedType2').text(scheTypeLabel);
	
	document.getElementById('typeLogo').classList.add(logoBgClass);
	document.getElementById('typeLogo2').classList.add(logoBgClass);
	$('#typeTitle').text(logoTitle);
	$('#typeSubtitle').text(logoSubtitle);
	$('#typeTitle2').text(logoTitle);
	$('#typeSubtitle2').text(logoSubtitle);
	
	// 스케쥴 / 수행 시간.
	let totalTime = 0;
	let doneTime = 0;
	let donePer = 0;
	
	if(_schedule.length > 0) {
		let hour = isNanEmpty(_schedule[0].hour) ? 0 : parseInt(_schedule[0].hour) % 24; 
		$('#schePlan').text(_schedule[0].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[0].hour + $.i18n.t('scheHour'));
		$('#schePlanDate').text(_schedule[0].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[0].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
			
		if(_schedule.length > 1 && !isEmpty(_schedule[1].sDate) && !isEmpty(_schedule[1].eDate)) {
			hour = isNanEmpty(_schedule[1].hour) ? 0 : parseInt(_schedule[1].hour) % 24; 
			$('#schePred').text(_schedule[1].day + $.i18n.t('scheDay') + ' ' + hour + $.i18n.t('scheHour') + ', ' +  _schedule[1].hour + $.i18n.t('scheHour'));
			$('#schePredDate').text(_schedule[1].sDate.replaceAll('-', '.').replaceAll(' ', ' · ') + ' ~ ' + _schedule[1].eDate.replaceAll('-', '.').replaceAll(' ', ' · '));
			
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
			}else {
				$('#scheDiffSymbol').text(diffSymbol);
				$('#scheDiffHr').text(diff);
				$('#scheDiffUnit').text('hr');
			}
			
			doneTime = _schedule[1].hour;
		}else {
			$('#schePred').text('-');
			$('#schePredDate').text('-');
			$('#scheDiffSymbol').text('');
			$('#scheDiffHr').text('-');
			$('#scheDiffUnit').text('');
		}
		
		totalTime = _schedule[0].hour;
	}else {
		$('#schePlan').text('-');
		$('#schePlanDate').text('-');
		$('#schePred').text('-');
		$('#schePredDate').text('-');
		$('#scheDiffSymbol').text('');
		$('#scheDiffHr').text('-');
		$('#scheDiffUnit').text('');
	}
	
	if(totalTime > 0 && doneTime > 0) {
		donePer = Math.floor(doneTime / totalTime * 100 * 100) / 100;
	}
	
	$('#progressTime').text(doneTime);
	$('#progressTimeTotal').text(' / ' + totalTime);
	$('#progressTimePer').text(donePer + '%');
	$('#progressTimeBar').css('width', donePer + '%');
	
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
	let com1 = '';
	let com2 = '';
	let com = '';
	
	for(let i = 0; i < _commanderList.length; i++) {
		if(_commanderList[i].mainSub == 'M') {
			com1 = _commanderList[i].name + ' (' + _commanderList[i].phone + ')';
		}else {
			com2 = _commanderList[i].name + ' (' + _commanderList[i].phone + ')';
		}
	}
	
	if(!isEmpty(com1)) {
		com = com1;
		
		if(!isEmpty(com2)) {
			com += ', ' + com2;
		}
	}else if(!isEmpty(com2)) {
		com = com2;
	}
	
	$('#commander').text(com);
	
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
	let cTotalDiff = 0;
	let cShiDiff = 0;
	let cOutDiff = 0;
	let cOwnerDiff = 0;
	let cClsDiff = 0;
	let cSeDiff = 0;
	let cCaptainDiff = 0;
	let cMateDiff = 0;
	let cEngDiff = 0;
	let cEtcDiff = 0;

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
			
		if(!isEmpty(prevCrewCntObj)) {
			cTotalDiff = cTotal - (isNanEmpty(prevCrewCntObj.total) ? 0 : parseInt(prevCrewCntObj.total));
			cShiDiff = cShi - (isNanEmpty(prevCrewCntObj.shi) ? 0 : parseInt(prevCrewCntObj.shi));
			cOutDiff = cOut - (isNanEmpty(prevCrewCntObj.out) ? 0 : parseInt(prevCrewCntObj.out));
			cOwnerDiff = cOwner - (isNanEmpty(prevCrewCntObj.owner) ? 0 : parseInt(prevCrewCntObj.owner));
			cClsDiff = cCls - (isNanEmpty(prevCrewCntObj.class) ? 0 : parseInt(prevCrewCntObj.class));
			cSeDiff = cSe - (isNanEmpty(prevCrewCntObj.se) ? 0 : parseInt(prevCrewCntObj.se));
			cCaptainDiff = cCaptain - (isNanEmpty(prevCrewCntObj.captain) ? 0 : parseInt(prevCrewCntObj.captain));
			cMateDiff = cMate - (isNanEmpty(prevCrewCntObj.mate) ? 0 : parseInt(prevCrewCntObj.mate));
			cEngDiff = cEng - (isNanEmpty(prevCrewCntObj.eng) ? 0 : parseInt(prevCrewCntObj.eng));
			cEtcDiff = cEtc - (isNanEmpty(prevCrewCntObj.etc) ? 0 : parseInt(prevCrewCntObj.etc));
		}
	}
	
	$('#crewCntTotal').text(cTotal);
	$('#crewCnt01').text(cShi);
	$('#crewCnt02').text(cOut);
	$('#crewCnt03').text(cOwner + ' / ' + cCls);
	$('#crewCnt04').text(cSe);
	$('#crewCnt05').text(cCaptain + ' / ' + cMate);
	$('#crewCnt06').text(cEng);
	$('#crewCnt07').text(cEtc);
	
	if(cTotalDiff != 0) {
		let vl = (cTotalDiff > 0 ? '▲ ' : '▼') + cTotalDiff;
		$('#crewUpDownTotal').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
	if(cShiDiff != 0) {
		let vl = (cShiDiff > 0 ? '▲ ' : '▼') + cShiDiff;
		$('#crewUpDown01').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
	if(cOutDiff != 0) {
		let vl = (cOutDiff > 0 ? '▲ ' : '▼') + cOutDiff;
		$('#crewUpDown02').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
	if(cOwnerDiff != 0 || cClsDiff != 0) {
		let div = '';
		
		if(cOwnerDiff != 0) {
			let vl = (cOwnerDiff > 0 ? '▲ ' : '▼') + cOwnerDiff;
			div = '<div class="report-daily-updown-chip">' + vl + '</div>';
		}
		
		if(cClsDiff != 0) {
			let vl = (cClsDiff > 0 ? '▲ ' : '▼') + cClsDiff;
			
			if(div != '') {
				div += ' / ';
			}
			
			div += '<div class="report-daily-updown-chip">' + vl + '</div>';
		}
		
		$('#crewUpDown03').html(div);
	}
	
	if(cSeDiff != 0) {
		let vl = (cSeDiff > 0 ? '▲ ' : '▼') + cSeDiff;
		$('#crewUpDown04').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
	if(cCaptainDiff != 0 || cMateDiff != 0) {
		let div = '';
		
		if(cCaptainDiff != 0) {
			let vl = (cCaptainDiff > 0 ? '▲ ' : '▼') + cCaptainDiff;
			div = '<div class="report-daily-updown-chip">' + vl + '</div>';
		}
		
		if(cMateDiff != 0) {
			let vl = (cMateDiff > 0 ? '▲ ' : '▼') + cMateDiff;
			
			if(div != '') {
				div += ' / ';
			}
			
			div += '<div class="report-daily-updown-chip">' + vl + '</div>';
		}
		
		$('#crewUpDown05').html(div);
	}
	
	if(cEngDiff != 0) {
		let vl = (cEngDiff > 0 ? '▲ ' : '▼') + cEngDiff;
		$('#crewUpDown06').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
	if(cEtcDiff != 0) {
		let vl = (cEtcDiff > 0 ? '▲ ' : '▼') + cEtcDiff;
		$('#crewUpDown07').html('<div class="report-daily-updown-chip">' + vl + '</div>');
	}
	
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
			label: $.i18n.t('fuel.hfo'),
			backgroundColor: '#7EC5FF',
			data: tempDataHfo,
			barThickness: 40
		});
	}
	
	if(tempDataMgo.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('fuel.mgo'),
			backgroundColor: '#0671E0',
			data: tempDataMgo,
			barThickness: 40
		});
	}
	
	if(tempDataLng.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('fuel.lng'),
			backgroundColor: '#071972',
			data: tempDataLng,
			barThickness: 40
		});
	}
	
	if(tempDataMdo.length > 0) {
		chartDatasetsItemFuelDate.push({
			label: $.i18n.t('fuel.mdo'),
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
	
	// Tc 목록.
	if(_tcList.length > 0) {
		for(let i = 0; i < _tcList.length; i++) {
			let tc = _tcList[i];
			let trBg = i % 2 == 0 ? '' : 'td-bg-dark';
			let state = '<td class="' + trBg + '"><div class="report-tc-state-box">' + $.i18n.t('tcList.plan') + '</div></td>';
			let gap = isNanEmpty(tc.gap) ? 0 : parseInt(tc.gap);
			let gapH = gap >= 60 ? Math.floor(gap / 60) : 0;
			let gapM = gap % 60;
			let gapStr = gapH > 0 ? gapH + 'h' : '';
			gapStr += gapH > 0 && gapM > 0 ? ' ' : '';
			gapStr += gapM > 0 ? gapM + 'm' : '';
			
			if(tc.state == 'DONE') {
				state = '<td class="' + trBg + '"><div class="report-tc-state-box report-tc-state-box-done">' + $.i18n.t('tcList.done') + '</div></td>';
			}else if(tc.state == 'ONGO') {
				state = '<td class="' + trBg + '"><div class="report-tc-state-box report-tc-state-box-ongo">' + $.i18n.t('tcList.ongo') + '</div></td>';
			}
			
			let row = '<tr>' + 
						state + 
						'<td class="' + trBg + '">' + tc.tcnum + '</td>' +
						'<td class="' + trBg + '">' + tc.desc + '</td>' +
						'<td class="' + trBg + '">' + gapStr + '</td>' +
						'<td class="' + trBg + '">' + tc.sdate + ' · ' + tc.stime + '</td>' +
						'<td class="' + trBg + '">' + tc.edate + ' · ' + tc.etime + '</td>' +
					'</tr>';
			
			$('#tcList').append(row);
		}
	}else {
		$('#tcList').append('<tr><td class="text-center" colspan="6">-</td></tr>');
	}
}

// 제출 팝업.
function showSubmitPop() {
	if(isEmpty(_status) || _status == 'DEPART') {
		alertPop($.i18n.t('error.statusDepart'));
		return;
	}else if(_status == 'ARRIVE') {
		alertPop($.i18n.t('error.statusArrive'));
		return;
	}
	
	if(_isExistReport) {
		alertPop($.i18n.t('error.existReport'));
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
	if(isEmpty(_status) || _status == 'DEPART') {
		toastPop($.i18n.t('error.statusDepart'));
		return;
	}else if(_status == 'ARRIVE') {
		toastPop($.i18n.t('error.statusArrive'));
		return;
	}
	
	if(_isExistReport) {
		toastPop($.i18n.t('error.existReport'));
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
				url: contextPath + '/sche/resultDailyReportSubmit.html',
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
						
							if(isEmpty(code) || code == 'DEPART') {
								_status = code;
								toastPop($.i18n.t('error.statusDepart'));
							}else if(code == 'ARRIVE') {
								_status = code;
								toastPop($.i18n.t('error.statusArrive'));
							}else if(code == 'EER') {
								_isExistReport = true;
								toastPop($.i18n.t('error.existReport'));
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
