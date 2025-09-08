let scheAllChartData = []; //Scheduler Row Data
let scheLineChartList = [];
let scheGanttChartist = [];
let lineChartList = [];
let ganttChartList = [];

let lineChartW = 486;
let lineChartH = 270;
let lineChartLabelFont = 8;
const titleWid = 77;

let curSizeIdx = 0;
const sizeStep = [
	{w: 486, h:270}, {w: 540, h:300}, {w: 630, h:350}, {w: 720, h:400}, {w: 810, h:450}, {w: 900, h:500}  
];

// 실제 Chart 그리는 함수
function drawChartAll(chartData){
	scheAllChartData = chartData;
	const period = parseInt($('#parentPeriod').val());
	const sdate = $('#parentSdate').val();
	const edate = $('#parentEdate').val();
	let curDate = sdate;
	
	const totalWidth = (lineChartW * period) + titleWid;
	
	$('#scheChartCont, #scheChartContUpScr').css('overflow-x', 'scroll');
	
	$('#schedulerLineChart').width(totalWidth);
	$('#scheChartContUpScrEmpty').width(period < 4 ? totalWidth : (totalWidth +18));
	
	setScrollSync($('#scheChartCont, #scheChartContUpScr'));
	
	for(let i = 0; i < chartData.length; i++){
		if(chartData[i].ctype.toUpperCase() == 'LOAD' && (!isEmpty(chartData[i].loadrate) || chartData[i].loadrate === 0)){
			scheLineChartList.push(chartData[i]);
			scheGanttChartist.push(chartData[i]);
		} else{
			scheGanttChartist.push(chartData[i]);
		}
	}
	
	// 전체 Line Chart 갯수에 따른 canvas 생성
	for(let i = 0; i < period; i++){
		const curLineChartW = ( i == 0? (lineChartW + titleWid) : lineChartW );
		// Line Chat 생성
		drawLineChart(scheLineChartList, i, curLineChartW, lineChartH, curDate);
		curDate = getCalcDate(curDate, false);
	}
	
	// Gantt Chart 생성
	drawGanttChart(scheGanttChartist, totalWidth, period);
	
}

// Row 데이터 화면에서 Line Chart 생성
function drawChartLineOnly(chartData){
	
	// 기존 Chart가 있으면 초기화
	for(let i = 0; i < lineChartList.length; i++){
		lineChartList[i].destroy();
		$(`#chart_${i}`).remove();
	}
	scheLineChartList = [];
	lineChartList = [];
	
	// 차트 생성 
	scheAllChartData = chartData;
	const period = parseInt($('#parentPeriod').val());
	const sdate = $('#parentSdate').val();
	const edate = $('#parentEdate').val();
	let curDate = sdate;
	
	const totalWidth = (lineChartW * period) + titleWid;
	
	$('#scheChartCont').css('overflow-x', 'scroll');
	
	$('#schedulerLineChart').width(totalWidth);
	
	for(let i = 0; i < chartData.length; i++){
		if(chartData[i].ctype.toUpperCase() == 'LOAD' && (!isEmpty(chartData[i].loadrate) || chartData[i].loadrate === 0)){
			scheLineChartList.push(chartData[i]);
		}
	}
	
	// 전체 Line Chart 갯수에 따른 canvas 생성
	for(let i = 0; i < period; i++){
		const curLineChartW = ( i == 0? (lineChartW + titleWid) : lineChartW );
		// Line Chat 생성
		drawLineChart(scheLineChartList, i, curLineChartW, lineChartH, curDate);
		curDate = getCalcDate(curDate, false);
	}
}

// SubTitle 반환 함수
function getSubTitle(dateStr){
	const months = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
	const dayofWeek = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
	let rtnDate = null;
	
	if(dateStr != null && !(dateStr === '')){
		let curDate = new Date(dateStr);
		rtnDate = months[curDate.getMonth()] + curDate.getDate() + '(' + dayofWeek[curDate.getUTCDay()] + ')';
		
		return rtnDate;
	} 
}

// Line Chart 생성 
function drawLineChart( chartData, i, curLineChartW, lineChartH, curDate ){
	// canvas 추가
	$('#schedulerLineChart').append(`<canvas id="chart_${i}" width="${curLineChartW}" height="${lineChartH}" style="float: left"></canvas>`);
	
	// 날짜 별로 색상 변경 
	if(i%2 == 0){
		$('#chart_' + i).css('background-color', '#FFFFFF');
	} else{
		$('#chart_' + i).css('background-color', '#F0FFFF');
	}
	
	// Chart 데이터 
	let scheduleData = [];
	let scheduleLabelData = [];
	
	let scheduleListStepData = [];
	let scheduleListCurvData = [];
	
	let scheduleListZeroData = [];
	
	// 어제 마지막 데이터
	let lastPastData = null;
	// 내일 첫 데이터
	let firstFutureData = null;
	
	// 데이터 로직 시작 
	const title =  i == 0 ? '1st Day' : i == 1 ? '2nd Day' : i ==2 ? '3rd Day' : (i+1)+'th Day';
	const subTitle =  getSubTitle(curDate);
	const context = $('#chart_' + i)[0].getContext('2d');
	
	// Chart 데이터 생성
	for(let k = 0; k < chartData.length; k++){
		if(chartData[k].sdate == curDate || chartData[k].edate == curDate){
			scheduleData.push({
					x: new Date(`${chartData[k].sdate} ${chartData[k].stime}`),
					y: chartData[k].loadrate,
					type: chartData[k].dtype,
					tcnum: chartData[k].tcnum
			});
			if(chartData[k].dtype.toUpperCase() =='STEP'){
				scheduleLabelData.push(chartData[k].loadrate);
			}
			if(chartData[k].edate != null && !(chartData[k].edate === '') && chartData[k].dtype.toUpperCase() =='STEP' && (chartData[k].stime != chartData[k].etime)){
				const eData = {
						x: new Date(chartData[k].edate + ' ' + chartData[k].etime),
						y: chartData[k].loadrate,
						type: chartData[k].dtype,
						tcnum: chartData[k].tcnum
				}
				scheduleData.push(eData);
				scheduleLabelData.push(eData.y);
			}
		}
	}
	
	if(scheduleData.length > 0){
		// 생성한 데이터 0시 데이터 보정
		if(i != 0 && new Date(`${curDate} 00:00:00`).getTime() < scheduleData[0].x.getTime()){
			let preData =  null;
			for(let k = chartData.length -1; k > 0; k--){
				const yesterDay = getCalcDate(curDate, true);
				if(chartData[k].sdate == yesterDay){
					preData = {
//							x: (chartData[k].edate == yesterDay ? new Date(chartData[k].edate + ' ' + chartData[k].etime) : new Date(chartData[k].sdate + ' ' + chartData[k].stime)),
							x: new Date(chartData[k].edate + ' ' + chartData[k].etime),
							y: chartData[k].loadrate,
							type: chartData[k].dtype,
							tcnum: chartData[k].tcnum
					};
					break;
				}
			}
			// 시작일 기준으로 없는 경우 완료일 기준으로 재 검색
			if(preData == null){
				for(let k = chartData.length -1; k > 0; k--){
					const yesterDay = getCalcDate(curDate, true);
					if(chartData[k].edate == yesterDay){
						preData = {
//								x: (chartData[k].edate == yesterDay ? new Date(chartData[k].edate + ' ' + chartData[k].etime) : new Date(chartData[k].sdate + ' ' + chartData[k].stime)),
								x: new Date(chartData[k].edate + ' ' + chartData[k].etime),
								y: chartData[k].loadrate,
								type: chartData[k].dtype,
								tcnum: chartData[k].tcnum
						};
						break;
					}
				}
			}
			if(preData != null && preData.x != null && !(preData.x === undefined)&& preData.y != null && !(preData.y === undefined)){
				if(!isEmpty(scheduleData[0].x) && !isEmpty(preData.x) && scheduleData[0].x.getTime() > preData.x.getTime()){
					scheduleData.unshift(preData);
					scheduleLabelData.unshift(preData.y);
				}
			}
		}
		// 생성한 데이터 24시 데이터 보정
		if(new Date(`${curDate} 24:00:00`).getTime() != scheduleData[scheduleData.length -1].x.getTime()){
			let nextData = null;
			for(let k = 0; k < chartData.length; k++){
				const tomorrow = getCalcDate(curDate, false);
				if(chartData[k].sdate == tomorrow){
					nextData = {
//							x: calcTomorrowDate(scheduleData[scheduleData.length -1].x, new Date(chartData[k].edate + ' ' + chartData[k].etime)),
							x: new Date(chartData[k].edate + ' ' + chartData[k].etime),
							y: chartData[k].loadrate,
							type: chartData[k].dtype,
							tcnum: chartData[k].tcnum
					};
					break;
				}
			}
			if(nextData != null && nextData.x != null  && !(nextData.x === undefined) && nextData.y != null && !(nextData.y === undefined)){
				scheduleData.push(nextData);
				scheduleLabelData.push(nextData.y);
			}
		}
	}
	
	// Line 유형별 차트 생성 데이터 만들기
	for(let k = 0; k < scheduleData.length; k++){
		const scheData = {
				x: scheduleData[k].x,
				y: scheduleData[k].y
		}
		
//		scheduleLabelData.push(scheduleData[k].y);
		
		if(scheduleData[k].type.toUpperCase() == 'STEP'){
//			scheduleListStepData.push(scheData);
			scheduleListStepData.push(scheduleData[k]);
			
			
			// CURV 데이터와 보정
			if((k < scheduleData.length-2) && scheduleData[k + 1].type.toUpperCase() == 'VARIABLE'){
				scheduleListStepData.push({
					x: scheduleData[k + 1].x,
					y: scheduleData[k + 1].y,
					type: 'STEP',
					tcnum: scheduleData[k + 1].tcnum
				});
//				scheduleLabelData.push(scheduleData[k + 1].y);
			} else if( k > 0 && scheduleData[k - 1].type.toUpperCase() == 'VARIABLE'){
				scheduleListStepData.unshift({
					x: scheduleData[k - 1].x,
					y: scheduleData[k - 1].y,
					type: 'STEP',
					tcnum: scheduleData[k - 1].tcnum
				});
			}
		} else if(scheduleData[k].type.toUpperCase() == 'VARIABLE'){
//			scheduleListCurvData.push(scheData);
			scheduleListCurvData.push(scheduleData[k]);
		}
	}
	
	// 0 번 라인에 두껍게 설정
	scheduleListZeroData.push({
		x: new Date(`${curDate} 00:00:00`),
		y: 0,
	});
	scheduleListZeroData.push({
		x: new Date(`${curDate} 24:00:00`),
		y: 0,
	});
	
	// Line Chart 설정 및 그리는 부분
	const lineChart = new Chart(context, {
		type: 'line',
//		plugins: [ChartDataLabels], // 로드율 라벨 제거 - 220628 BMK
		data: {
			datasets: [{
				label: 'Load',
				data: scheduleListStepData,
//				labels: scheduleLabelData,  // 로드율 라벨 제거 - 220628 BMK
//				data: scheduleData,
				// Line 너비 및 색상 설정
				borderWidth: 3,
				backgroundColor: 'rgba(0, 0, 0, 1)',
				borderColor: 'rgba(0, 0, 0, 1)',
				order: 1
			},
			{
				label: 'Load2',
				data: scheduleListCurvData,
				// Line 너비 및 색상 설정
				borderWidth: 3,
				backgroundColor: 'rgba(0, 0, 0, 1)',
				borderColor: 'rgba(0, 0, 0, 1)',
				type: 'line',
				tension: 0.4,
				order: 0
			},
			{
				label: 'zero',
				data: scheduleListZeroData,
				borderWidth: 2,
				backgroundColor: 'red',
				borderColor: 'red',
				order: 2,
				pointRadius: 0
			}]
		},
		options: {
			// 위에 설정한 Canvas 크기대로 출력하기 위한 설정
			responsive: false,
			// Line의 Point 크기 설정
			elements: {
				point: {
					radius: 2,
					hoverRadius: 3 
				}
			},
			layout: {
				autoPadding: false,
				padding: {
					left: 0,
					right: 0,
					top: 0
				}
			},
			scales: {
				x:{
					position: 'top',
					title: {
						display: true,
						text: 'TIME',
						align : 'start'
					},
					min: (new Date(`${curDate} 00:00:00`)),
					max: (new Date(`${getCalcDate(curDate, false)} 00:00:00`)),
					type: 'time',
					time: {
						unit: 'hour',
						displayFormats: {
							hour: 'HH'
						}
					},
					ticks:{
						autoPadding: false,
						padding: 0,
						callback: function(val, index, ticks){
							let rtnValue = val;
							
							if(val == '00'){
								rtnValue = '';
							}
							return rtnValue
						}
					}
				},
				y: {
					title: {
						display: true,
						text: 'Load',
						color: '#000000',
						font: {
							weight: 'bold'
						}
					},
					min: -50,
					max: 120,
					// 1번째 Line Chart의 Y 축 설정
					ticks: {
						display: true,
						stepSize: 25,
						callback: function(val, index, ticks){
							let rtnValue = `${this.getLabelForValue(val)}%`;
							
							if(val === 0){
								rtnValue = 'STOP';
							} else if(val == -25){
								rtnValue = 'ASTERN';
							} else if(val == -50 || val == 120){
								rtnValue = '';
							}
							return rtnValue
						}
					},
					grid: {
						tickLength: 0
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: title
				},
				subtitle: {
					display: true,
					text: subTitle
				},
				legend: {
					display: false
				},
				// tooltip 출력 수정 
				tooltip: {
					intersect : false, // 근처 가까운 포인트 tooltip을 보여줌
					displayColors: false, // tooltip에 사각형 색상 제거 
					callbacks: {
						afterFooter: function(tooltipItems){
							const tcnum = tooltipItems[0].raw.tcnum;
							const date = convertDateToStr(tooltipItems[0].raw.x, 'D');
							const time = convertDateToStr(tooltipItems[0].raw.x, 'T');
							
							for(let i = 0; i < scheAllChartData.length; i++){
							}
						},
						title: function (tooltipItem){
							let title = '';
							
							// 0 라인은 제거
							if(tooltipItem[0].dataset.order == 2){
								return false;
							}
							
							for(let i = 0; i < tooltipItem.length; i++){
								// 실제 데이터가 있는 건만 추가
								if(i > 0 && !isEmpty(tooltipItem[i].raw.tcnum)){
									title += '\n';
								}
								if(!isEmpty(tooltipItem[i].raw.tcnum)){
									title += (convertDateToStr(tooltipItem[i].raw.x, 'DT') + ' (' + tooltipItem[i].raw.tcnum + ')');
								}
							}
							return title;
						},
						label: function (tooltipItem){
							// 0 라인은 제거
							if(tooltipItem.dataset.order == 2){
								return false;
							} else{
								return 'Load : ' +  tooltipItem.formattedValue + '%';
							}
						},
						footer: function (tooltipItems){
							return '';
						}
					}
				}
				/*, // 로드율 라벨 제거 - 220628 BMK
				datalabels: {
					display: true,
					backgroundColor: 'black',
					align: function(context){
						// 그래프의 각 포인트 값 라벨 출력 위치 로직 
						const idx = context.dataIndex;
						const hour = context.chart.data.datasets[0].data[idx].x.getHours();						
						let rtnAlign = 'top';
						
						if(context.chart.data.datasets[0].labels[idx] == '0.0'){
							rtnAlign = 'bottom';
						} else if(hour < 2){
							rtnAlign = 'right';
						} else if(hour > 22){
							rtnAlign = 'left';
						}
						return rtnAlign;
					},
					anchor: 'center',
					color: 'white',
					font: {
						size: (lineChartLabelFont + curSizeIdx) 
//						weight: 'bold'
					},
					formatter: function(value, context){
						// 그래프의 각 포인트 값 라벨 출력 로직
						const idx = context.dataIndex;
						let rtnValue = null;
						
						if(value.type == 'STEP'){
							if(parseInt(value.y) < 0 
									|| (idx > 0 && (context.chart.data.datasets[0].data[idx -1].y == context.chart.data.datasets[0].data[idx].y)) 
									|| (idx == 0 && new Date(value.x).getHours() == 0)){
								rtnValue = '';
							} else if(value.y == '0.0'){
								rtnValue = 'STOP';
							} else{
								rtnValue = `${value.y.endsWith('.0') ? value.y.replace('.0', '') : value.y}%`;
							}
						} else if(value.type.toUpperCase() == 'VARIABLE'){
							rtnValue = null;
						}
						
						return rtnValue;
					}
				}*/
			}
		}
	});
	
	// 첫 번째 그래프가 아닌 경우 출력 내용 수정
	if(i > 0){
		lineChart.options.scales.y.ticks.display= false;
		lineChart.options.scales.y.title.display= false;
		lineChart.options.scales.x.title.text = '';
		lineChart.options.layout.padding.bottom =11;
		lineChart.update();
	}
	
	lineChartList.push(lineChart);
}

// Gantt Chart 생성

// GanttJs-Improved
function drawGanttChart(chartData, totalWidth, period){
	let scheduleData = [];
	const ganttChart = new JSGantt.GanttChart($('#schedulerGanttChart')[0], 'hour');
	
	$('#scheGanttTitle').text('TEST Schedule');
	$('#scheGanttTitle').width(titleWid - 3);
	
	if(period <= 3){
		$('#schedulerGanttChart').width((totalWidth - titleWid - 3));
	} else{
		$('#schedulerGanttChart').width((totalWidth - titleWid + 15));
	}
	
	$("#schedulerGanttChart").css('overflow-y', 'auto');
	$("#schedulerGanttChart").css('max-height', `${(screen.height * 0.39)}px`);
	
	const minDate = new Date(`${$('#parentSdate').val()} 00:00:00`);
	const maxDate = new Date(`${$('#parentEdate').val()} 23:00:00`);
	
	for(let i = 0; i < chartData.length; i++){
		let barText = null;
		let barName = null;
		
		// Bar의 Text 값 설정
		if(chartData[i].tcnum == '-1'){
			barText = chartData[i].desc;
			barName = chartData[i].desc;
		} else{
			barText = chartData[i].tcnum + ' ' + chartData[i].desc;
			barName = chartData[i].tcnum + ' ' + chartData[i].desc;
		}
		
		const scheData = {
				pID: `${getFloatVal(chartData[i].seq)}-${chartData[i].uid}`,
				pName: barName,
				pStart: new Date(`${chartData[i].sdate} ${chartData[i].stime}`),
				pEnd: new Date(`${chartData[i].edate} ${chartData[i].etime}`),
				pPlanStart: null,
				pPlanEnd: null,
				pClass: getGanttClass(chartData[i].tcnum),
				pMile: 0,
				pRes: '',
				pComp: 0,
				pParent: 0,
				pOpen: 1,
				pDepend: '',
				pCaption: '',
				pCost: chartData[i].loadrate,
				pNotes: chartData[i].note,
				pBarText: barText
		};
		
		ganttChart.AddTaskItemObject(scheData);
	}
	
	ganttChart.setOptions({
		vHourColWidth: (((totalWidth - titleWid) / period / 24) - 3),
		vCaptionType: 'None', // Set to Show Caption : None,Caption,Resource,Duration,Complete,
		vDateTaskDisplayFormat: "month dd (day)", // Shown in tool tip box
		vDayMajorDateDisplayFormat: "month dd (day)", // Set format to display dates in the "Major" header of the "Day" view
		vWeekMinorDateDisplayFormat: "dd month", // Set format to display dates in the "Minor" header of the "Week" view
		vLang: initLang(),
		vUseSingleCell : 0, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
		vShowRes : 0,
		vShowCost : 0,
		vShowAddEntries : 0,
		vShowComp : 0,
		vShowDur : 0,
		vShowStartDate : 0,
		vShowEndDate : 0,
		vShowPlanStartDate : 0,
		vShowPlanEndDate : 0,
		vMinDate : minDate,
		vMaxDate : maxDate,
		// EVENTs
		vEvents: {
			taskname: console.log,
			res: console.log,
			dur: console.log,
			comp: console.log,
			start: console.log,
			end: console.log,
			planstart: console.log,
			planend: console.log,
			cost: console.log,
			additional_category: console.log,
			beforeDraw: () => console.log("before draw listener"),
			afterDraw: () => {
				console.log("after draw listener");
				if (document.querySelector("#customElements:checked")) {
					drawCustomElements(g);
				}
				// 불필요한 요소 제외 - 220616 BMK
				$('.gmainleft').hide();
				$('.gmajorheading').parent().hide();
				$('#schedulerGanttChartgchartbody').css('overflow', 'hidden');
				
				// DIV 이벤트 추가
//				$('div[id*="schedulerGanttChartbardiv"]').on('click', ganttDivClick);
				$('div[id*="schedulerGanttChartbardiv"]').on('dblclick', ganttDivDbClick);
				$('div[id*="schedulerGanttChartbardiv"]').on('contextmenu', ganttDivRClick);
				
				// Gantt DIV에서 우클릭 제거
				$('#schedulerGanttChart').on('contextmenu', function(e){
					return false;
				});;
			},
		},
		vEventsChange: {
			taskname: editValue, // if you need to use the this scope, do: editValue.bind(this)
			res: editValue,
			dur: editValue,
			comp: editValue,
			start: editValue,
			end: editValue,
			planstart: editValue,
			planend: editValue,
			cost: editValue,
		},
		vEventClickRow: function(e) {
			console.log('@@@ vEvenrClickRow : ' + e);
		},
		vEventClickCollapse: function(e) {
			console.log('@@@ vEventClickCollapse : ' + e);
		},
		vShowTaskInfoLink : 0, // Show link in tool tip (0/1)
		vShowEndWeekDate: 0, // Show/Hide the date for the last day of the week in header for daily view (1/0)
		vShowWeekends : 0, // Show weekends days in the vFormat day
		vTooltipDelay: 150, // Delay for tooltip to hide (in ms)
		vTooltipTemplate: genGanttTooltip, // document.querySelector("#dynamicTooltip:checked") ? generateTooltip : newtooltiptemplate,
		vDebug : 0,
		vEditable : 0,
		vColumnOrder : 0,
		vFormatArr: ["Hour"], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
	});
	
	ganttChart.Draw();
	ganttChartList.push(ganttChart);
}

// Gantt Task의 툴팁 표시 변경 
function genGanttTooltip(task){
	const sDate = task.getStart();
	const eDate = task.getEnd();
	
	const dur = ((eDate - sDate) / (1000 * 60)).toFixed(0);
	const note = task.getNotes();
	const load = task.getCost();
	
	let toolTip = null;
	
	toolTip = `
	<dl>
		<dt></dt><dd>{{pName}}</dd>
		<dt>${$.i18n.t('mngDetChartSche:chart.plan')}:</dt><dd>${getDateStrToGanttTooltip(sDate)} ~ ${getDateStrToGanttTooltip(eDate)}</dd>`;
	if(note.textContent != null && !(note.textContent === '')){
		toolTip += `<dt>Note</dt><dd>${note.textContent}</dd>`;
	}
	if(load != null && !isNaN(load)){
		toolTip += `<dt></dt><dd>Load: ${load} %</dd>`;
	}
	toolTip += `<input type="hidden" value="${task.getOriginalID()}">
	</dl>
	`;

	
	return toolTip;
}

// 화면 확대 함수
function zoomInCharts(){
	curSizeIdx++;
	
	if(curSizeIdx < sizeStep.length){
		lineChartW = sizeStep[curSizeIdx].w;
		lineChartH = sizeStep[curSizeIdx].h;
		
		refreshCharts();
	} else{
		curSizeIdx--;
		alertPop($.i18n.t('mngDetChartSche:chart.errZoomIn'));
	}
	
}
// 화면 축소 함수
function zoomOutCharts(){
	curSizeIdx--;
	
	if(curSizeIdx >= 0){
		lineChartW = sizeStep[curSizeIdx].w;
		lineChartH = sizeStep[curSizeIdx].h;
		
		refreshCharts();
	} else{
		curSizeIdx++;
		alertPop($.i18n.t('mngDetChartSche:chart.errZoomOut'));
	}
}

// 전체 Chat 초기화
function refreshCharts(){
	const ganttParent = $(`#${ganttChartList[0].getDivId()}`).parent();
	for(let i = 0; i < lineChartList.length; i++){
		lineChartList[i].destroy();
		$(`#chart_${i}`).remove();
	}
	scheLineChartList = [];
	lineChartList = [];
	
	ganttParent.children().remove();
	ganttParent.append('<div class="gantt" id="schedulerGanttChart"></div>');
	scheGanttChartist = [];
	ganttChartList = [];
	
	drawChartAll(scheAllChartData);
			
}

// Gantt Div 클릭 시 실행
function ganttDivClick(e){
	console.log(e);
	console.log($(this).parent());
	
	console.log('uid : ' + $(this).children().find('input[type="hidden"]').val() + '\n' + $(this).children().find('.gTtTemplate').children().find('dd').eq(0).text());
	
	// $(this).prop('nodeName') == 'DIV'
	// $.nodeName($(this)[0], 'div')
}

//Gantt Div 더블클릭 시 실행
function ganttDivDbClick(e){
	console.log(e);
	console.log($(this).parent());
	
	console.log('uid : ' + $(this).children().find('input[type="hidden"]').val() + '\n' + $(this).children().find('.gTtTemplate').children().find('dd').eq(0).text());
	
	// $(this).prop('nodeName') == 'DIV'
	// $.nodeName($(this)[0], 'div')
}

// Gantt Div 우클릭 시 실행
function ganttDivRClick(e){
	e.preventDefault();
	
	console.log(e);
	console.log($(this).parent());
	
	console.log('uid-r : ' + $(this).children().find('input[type="hidden"]').val() + '\n' + $(this).children().find('.gTtTemplate').children().find('dd').eq(0).text());
}

// Line Chart의 2 데이터를 비교하여 같은지 확인
function isNotSameLineData(data1, data2){
	let isSame = false;
	if(!isEmpty(data1) && !isEmpty(data2)
			&& !isEmpty(data1.x) && !isEmpty(data2.x) 
			&& !isEmpty(data1.y) && !isEmpty(data2.y) 
			&& !isEmpty(data1.tcnum) && !isEmpty(data2.tcnum))
	{
		if((data1.x.getTime() == data2.x.getTime()) && (data1.y == data2.y) && (data1.tcnum == data2.tcnum)){
			isSame = true;
		}
	}
	
	return isSame;
}

//현재 날짜 문자열을 받아 이전 혹은 다음 날짜 문자열 반환
function getCalcDate(dateStr, isPast){
	if(dateStr != null && !(dateStr === '')){
		let curDate = new Date(dateStr);
		
		if(isPast){
			curDate.setDate(curDate.getDate() - 1);
		} else{
			curDate.setDate(curDate.getDate() + 1);
		}
		const monthStr = (curDate.getMonth() + 1) < 10 ? '0' + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);  
		const dayStr = (curDate.getDate() < 10 ? ('0'+curDate.getDate()) : curDate.getDate());
		
		rtnDate = `${curDate.getFullYear()}-${monthStr}-${dayStr}`;
		
		return rtnDate;
	} 
}

// 받은 Date 객체를 String으로 변환 후 반환
function getDateStrToGanttTooltip(curDate){
	let rtnStr = '';
	if(curDate != null){
		const monthStr = (curDate.getMonth() + 1).toString().padStart(2,'0');  
		const dayStr = curDate.getDate().toString().padStart(2,'0');
		const hourStr = curDate.getHours().toString().padStart(2,'0');
		const minStr = curDate.getMinutes().toString().padStart(2,'0');
		
		rtnStr = `${curDate.getFullYear()}-${monthStr}-${dayStr} ${hourStr}:${minStr}`;
	}
	
	return rtnStr;
}

// 상단 추가된 스크롤과 기본 스크롤 싱크
function setScrollSync(syncDivs){
	var sync = function(e){
		syncDivs.not(this).scrollLeft($(this).scrollLeft())
	}
	
	syncDivs.on('scroll', sync);
}

// GanttClass의 색상 Class를 TCNUM 시작 문자 별 반환
function getGanttClass(tcnum) {
	let rtnClass = 'ggroupblack';
	const gntClass = ['gtaskred', 'gtaskblue','gtaskgreen','gtaskyellow','gtaskpurple','gtaskpink'];
	const tcList = ['T', 'A', 'B', 'O', 'C'];
	
	if(!isEmpty(tcnum)){
		for(let i = 0; i < tcList.length; i++){
			if(tcnum.startsWith(tcList[i])){
				rtnClass = gntClass[i];
			}
		}
	}
	
	return rtnClass;
}

// 24시간 데이터 보정 시 그래프 끊김 보정 
function calcTomorrowDate(prevDate, curDate){
//	const offset = new Date(curDate.getTime() - prevDate.getTime()).getHours() * 900000; 
	const offset = 2700000; 
	return new Date(curDate.getTime() - offset);
}

