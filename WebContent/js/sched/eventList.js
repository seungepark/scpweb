let _list = [];							// 이벤트 목록.
let _isShowColumn = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];		// 컬럼 표시 여부.
let _optionYearPickerShow = false;		// 인도년수 피커 표시 여부.
let _opYearList = [];					// 연도년수 목록.
let _newShipList = [];					// 신규 추가 목록.
let _newTempUid = -1;					// 신규 추가 임시 UID.
let _changeUidList = [];				// 전망 달력 변경 이력이 있는 기존 이벤트 UID의 목록.
let _currBbsPjt = '';					// 현재 게시판 pjt.
let _bbsFileList = [];					// 게시판 파일 목록.
let _isAddingBbsFile = false;			// 게시판 파일 첨부중.
let _bbsFileId = 0;						// 게시판 파일 임시 ID.
let _currBbsDelUid = 0;					// 게시판 삭제 글 UID.

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
            namespaces: ['share', 'eventList'],
            defaultNs: 'eventList'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	
	$('#opYear').datetimepicker({
		useCurrent: false,
		format: 'YYYY',
    	viewMode: 'years'
	});
	
	$('#opYear').on('dp.change', function(e) {
		_optionYearPickerShow = false;
		
		if(e.date) {
			addOptionYear(e.date.format('YYYY'));
		}
	});
	
	setColumn();
	getEventList();
}

// 연도년수 피커 토글.
function toggleOptionYearPicker() {
	if(_optionYearPickerShow) {
		$('#opYear').data('DateTimePicker').hide();
	}else {
		$('#opYear').data('DateTimePicker').show();
	}
	
	_optionYearPickerShow = !_optionYearPickerShow;
}

// 연도년수 추가.
function addOptionYear(year) {
	if(!_opYearList.includes(year)) {
		let chip = '<div id="opYearList_' + year + '" class="chip-obj">' + 
						year + 
						'<span class="chip-divide"></span>' + 
						'<span onclick="deleteOptionYear(' + year + ')" class="chip-btn-delete"><i class="fa-solid fa-xmark fa-sm"></i></span>' + 
					'</div>';
					
		$('#opYearList').append(chip);
		_opYearList.push(year);
	}
}

// 연도년수 전체 삭제.
function deleteOptionYearAll() {
	$('#opYearList').empty();
	$('#opYear').data('DateTimePicker').clear();
	_opYearList = [];
}

// 연도년수 삭제.
function deleteOptionYear(year) {
	for(let i = 0; i < _opYearList.length; i++) {
		if(_opYearList[i] == year) {
			_opYearList.splice(i, 1);
			break;
		}
	}
		
	$('#opYearList_' + year).remove();
}

// 이벤트 목록 컬럼 설정.
function setColumn() {
	let col = '<col class="event-list-col-info">' + 
        		'<col class="event-list-col-kind">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">' + 
        		'<col class="event-list-col-default">';
	
    let tr = '<th class="event-list-th-info" colspan="2"><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.info') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lc') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.sp') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.bt') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.gt') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.cmr') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.mt') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.ie') + '</span></div></th>' + 
              	'<th colspan="2"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.ac') + '</span></div></th>' + 
              	'<th colspan="2"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.st') + '</span></div></th>' + 
              	'<th colspan="2"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.cold') + '</span></div></th>' + 
              	'<th colspan="2"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lng') + '</span></div></th>' + 
              	'<th colspan="2"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.gas') + '</span></div></th>' + 
              	'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.wf') + '</span></div></th>' + 
              	'<th><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.dl') + '</span></div></th>';

	if(isEmpty(_colList)) {
		_isShowColumn = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
	}else {
		_isShowColumn = [
			_colList.isLc == '1',
			_colList.isSp == '1',
			_colList.isBt == '1',
			_colList.isGt == '1',
			_colList.isCmr == '1',
			_colList.isMt == '1',
			_colList.isIe == '1',
			_colList.isAc == '1',
			_colList.isSt == '1',
			_colList.isCold == '1',
			_colList.isLng == '1',
			_colList.isGas == '1',
			_colList.isWf == '1',
			_colList.isDl == '1'
		];
		
		let idx = 0;
		let lastIdx = 0;
		
		for(let i = _isShowColumn.length - 1; i >= 0; i--) {
			if(_isShowColumn[i]) {
				lastIdx = i;
				break;
			}
		}
		
		col = '<col class="event-list-col-info"><col class="event-list-col-kind">';
		tr = '<th class="event-list-th-info" colspan="2"><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.info') + '</span></div></th>';

		let colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';
		
		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.lc') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.sp') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.bt') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.gt') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.cmr') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.mt') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.ie') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default"><col class="event-list-col-default">';
			tr += '<th colspan="2"><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.ac') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default"><col class="event-list-col-default">';
			tr += '<th colspan="2"><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.st') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default"><col class="event-list-col-default">';
			tr += '<th colspan="2"><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.cold') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default"><col class="event-list-col-default">';
			tr += '<th colspan="2"><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.lng') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default"><col class="event-list-col-default">';
			tr += '<th colspan="2"><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.gas') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';
		
		if(_isShowColumn[idx++]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.wf') + '</span></div></th>';
		}
		
		colClass = lastIdx == idx ? 'tb-th-col-last' : 'tb-th-col';

		if(_isShowColumn[idx]) {
			col += '<col class="event-list-col-default">';
			tr += '<th><div class="' + colClass + '"><span class="tb-th-content">' + $.i18n.t('list.dl') + '</span></div></th>';
		}
	}

	$('#listTheadCol').empty();
	$('#listTheadTr').empty();
	$('#listTheadCol').append(col);
	$('#listTheadTr').append(tr);
}

// 이벤트 목록 검색.
function getEventList() {
	let shipOption = $('input[name="shipOption"]:checked').val();
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/getEventList.html',
		traditional: true,
		data: {
			kind: shipOption,
			valArr: _opYearList
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				
				if(json.list != null && json.list.length >= 0) {
					_list = json.list;
					setEventList();
				}else{
					alertPop($.i18n.t('share:tryAgain'));
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

// 이벤트 목록 생성.
function setEventList() {
	$('#listTbody').empty();
	_changeUidList = [];

	if(_list.length > 0) {
		$('#totalCnt').text(_list.length);
		let kindLabelStyle = 'position: -webkit-sticky; position: sticky; left: 156px; z-index: 0; padding-left: 0px; padding-right: 0px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-300); box-shadow: inset -4px 0px 6px -4px #00000029; font-size: 16px; font-weight: 700; line-height: 24px;';
		let kindLabelLastStyle = 'position: -webkit-sticky; position: sticky; left: 156px; z-index: 0; padding-left: 0px; padding-right: 0px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-500); box-shadow: inset -4px 0px 6px -4px #00000029; font-size: 16px; font-weight: 700; line-height: 24px;';
		let lastBottomStyle = 'border-bottom: 1px solid var(--neutral-500);';
		
		for(let i = 0; i < _list.length; i++) {
			let bean = _list[i];
			let uid = bean.uid;
			let cardColor = 'event-list-info-card-color-' + (i % 3);
			let pjtColor = bean.isOutside == 'Y' ? 'event-list-info-card-pjt-color-outside' : 'event-list-info-card-pjt-color';
			
			let datepickerOp = {
				showOn: 'both', 
				buttonImage: contextPath + '/img/new/calendar.png', 
				buttonImageOnly: true, dateFormat: 'y-mm-dd',
				onSelect: function(dateText, inst) {
					if(!_changeUidList.includes(uid)) {
						_changeUidList.push(uid);
					}
				}
			};
			
			let plan = '<tr class="text-center">' + 
        					'<td style="position: -webkit-sticky; position: sticky; left: 0; z-index: 0; padding: 4px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-500);" rowspan="3">' + 
        						'<div class="d-flex event-list-info-card">' + 
        							'<div class="event-list-info-card-color ' + cardColor + '"></div>' + 
        							'<div class="d-flex flex-column event-list-info-card-content">' + 
            							'<div class="flex-grow-1 title-3 text-left pl-1 ' + pjtColor + '">' + bean.pjt + '</div>' + 
            							'<div class="body-5 text-left pt-1 event-list-info-card-ellipsis">' + bean.regOwner + '</div>' + 
            							'<div class="body-5 text-left pt-1 event-list-info-card-ellipsis">' + bean.typeModel + '</div>' + 
            							'<div class="body-5 text-left pt-1 d-flex">' + 
            								'<div class="flex-grow-1">' + bean.projSeq + '</div>' + 
            								'<div>' +
            									'<a href="#" onclick="showBbs(' + uid + ', false)">' + 
            										'<img src="' + contextPath + '/img/new/arrow_more.png">' + 
            									'</a>' + 
            								'</div>' + 
            							'</div>' + 
            						'</div>' + 
        						'</div>' + 
        					'</td>' + 
        					'<td style="' + kindLabelStyle + '">' + $.i18n.t('list.plan') + '</td>';
			
			let pros = '<tr class="text-center">' + 
        					'<td style="' + kindLabelStyle + '">' + $.i18n.t('list.pros') + '</td>';
			
			let perf = '<tr class="text-center' + (bean.isOutside == 'Y' ? '' : ' event-list-last-row') + '">' + 
        					'<td style="' + kindLabelLastStyle + '">' + $.i18n.t('list.perf') + '</td>';

			let idx = 0;
			
			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planLc) + '</td>';
				pros += '<td class="text-left"><input id="prosLc' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosLc) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfLc) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planSp) + '</td>';
				pros += '<td class="text-left"><input id="prosSp' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosSp) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfSp) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planBt) + '</td>';
				pros += '<td class="text-left"><input id="prosBt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosBt) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfBt) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planGt) + '</td>';
				pros += '<td class="text-left"><input id="prosGt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosGt) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfGt) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planCmr) + '</td>';
				pros += '<td class="text-left"><input id="prosCmr' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosCmr) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfCmr) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planMt) + '</td>';
				pros += '<td class="text-left"><input id="prosMt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosMt) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfMt) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planIe) + '</td>';
				pros += '<td class="text-left"><input id="prosIe' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosIe) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfIe) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planAcFrom) + '</td>' + '<td class="text-left">' + formatShortDate(bean.planAcTo) + '</td>';
				pros += '<td class="text-left"><input id="prosAcFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosAcFrom) + '"/></td>' + 
        				'<td class="text-left"><input id="prosAcTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosAcTo) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfAcFrom) + '</td>' + 
        				'<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfAcTo) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planStFrom) + '</td>' + '<td class="text-left">' + formatShortDate(bean.planStTo) + '</td>';
				pros += '<td class="text-left"><input id="prosStFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosStFrom) + '"/></td>' + 
        				'<td class="text-left"><input id="prosStTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosStTo) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfStFrom) + '</td>' + 
        				'<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfStTo) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planColdFrom) + '</td>' + '<td class="text-left">' + formatShortDate(bean.planColdTo) + '</td>';
				pros += '<td class="text-left"><input id="prosColdFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosColdFrom) + '"/></td>' + 
        				'<td class="text-left"><input id="prosColdTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosColdTo) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfColdFrom) + '</td>' + 
        				'<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfColdTo) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planLngFrom) + '</td>' + '<td class="text-left">' + formatShortDate(bean.planLngTo) + '</td>';
				pros += '<td class="text-left"><input id="prosLngFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosLngFrom) + '"/></td>' +
        				'<td class="text-left"><input id="prosLngTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosLngTo) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfLngFrom) + '</td>' + 
        				'<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfLngTo) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planGasFrom) + '</td>' +  '<td class="text-left">' + formatShortDate(bean.planGasTo) + '</td>';
				pros += '<td class="text-left"><input id="prosGasFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosGasFrom) + '"/></td>' + 
        				'<td class="text-left"><input id="prosGasTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosGasTo) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfGasFrom) + '</td>' + 
        				'<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfGasTo) + '</td>';
			}

			if(_isShowColumn[idx++]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planWf) + '</td>';
				pros += '<td class="text-left"><input id="prosWf' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosWf) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfWf) + '</td>';
			}

			if(_isShowColumn[idx]) {
				plan += '<td class="text-left">' + formatShortDate(bean.planDl) + '</td>';
				pros += '<td class="text-left"><input id="prosDl' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value="' + formatShortDate(bean.prosDl) + '"/></td>';
				perf += '<td class="text-left" style="' + lastBottomStyle + '">' + formatShortDate(bean.perfDl) + '</td>';
			}
        		
			plan +=	'</tr>';
			pros +=	'</tr>'; 
			perf +=	'</tr>'; 
			
			$('#listTbody').append(plan + pros + perf);
			
			idx = 0;
			
			if(_isShowColumn[idx++]) {
				$('#prosLc' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosSp' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosBt' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosGt' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosCmr' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosMt' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosIe' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosAcFrom' + uid).datepicker(datepickerOp);
				$('#prosAcTo' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosStFrom' + uid).datepicker(datepickerOp);
				$('#prosStTo' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosColdFrom' + uid).datepicker(datepickerOp);
				$('#prosColdTo' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosLngFrom' + uid).datepicker(datepickerOp);
				$('#prosLngTo' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosGasFrom' + uid).datepicker(datepickerOp);
				$('#prosGasTo' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx++]) {
				$('#prosWf' + uid).datepicker(datepickerOp);
			}
			
			if(_isShowColumn[idx]) {
				$('#prosDl' + uid).datepicker(datepickerOp);
			}
		}
	}else {
		let colCnt = 2;
		let idx = 0;
			
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx++]) colCnt += 2;
		if(_isShowColumn[idx++]) colCnt += 2;
		if(_isShowColumn[idx++]) colCnt += 2;
		if(_isShowColumn[idx++]) colCnt += 2;
		if(_isShowColumn[idx++]) colCnt += 2;
		if(_isShowColumn[idx++]) colCnt++;
		if(_isShowColumn[idx]) colCnt++;
			
		$('#listTbody').append('<tr><td class="text-center" colspan="' + colCnt + '">' + $.i18n.t('share:noList') + '</td></tr>');
		$('#totalCnt').text('0');
	}
}

// 이벤트 목록 검색 버튼 클릭.
function searchEventList() {
	if(_newShipList.length > 0) {
		alertPop($.i18n.t('newShipListMsg'));
	}else {
		getEventList()
	}
}

// 컬럼 설정 팝업.
function showColPop() {
	if(_newShipList.length > 0) {
		alertPop($.i18n.t('newShipListMsg'));
	}else {
		let idx = 0;
	
		$('#colPopLc').prop('checked', _isShowColumn[idx++]);
		$('#colPopSp').prop('checked', _isShowColumn[idx++]);
		$('#colPopBt').prop('checked', _isShowColumn[idx++]);
		$('#colPopGt').prop('checked', _isShowColumn[idx++]);
		$('#colPopCmr').prop('checked', _isShowColumn[idx++]);
		$('#colPopMt').prop('checked', _isShowColumn[idx++]);
		$('#colPopIe').prop('checked', _isShowColumn[idx++]);
		$('#colPopAc').prop('checked', _isShowColumn[idx++]);
		$('#colPopSt').prop('checked', _isShowColumn[idx++]);
		$('#colPopCold').prop('checked', _isShowColumn[idx++]);
		$('#colPopLng').prop('checked', _isShowColumn[idx++]);
		$('#colPopGas').prop('checked', _isShowColumn[idx++]);
		$('#colPopWf').prop('checked', _isShowColumn[idx++]);
		$('#colPopDl').prop('checked', _isShowColumn[idx++]);
	
		$('#colPop').modal();
	}
}

// 컬럼 설정 저장.
function saveColumn() {
	let lc = $('#colPopLc').is(':checked') ? '1' : '0';
	let sp = $('#colPopSp').is(':checked') ? '1' : '0';
	let bt = $('#colPopBt').is(':checked') ? '1' : '0';
	let gt = $('#colPopGt').is(':checked') ? '1' : '0';
	let cmr = $('#colPopCmr').is(':checked') ? '1' : '0';
	let mt = $('#colPopMt').is(':checked') ? '1' : '0';
	let ie = $('#colPopIe').is(':checked') ? '1' : '0';
	let ac = $('#colPopAc').is(':checked') ? '1' : '0';
	let st = $('#colPopSt').is(':checked') ? '1' : '0';
	let cold = $('#colPopCold').is(':checked') ? '1' : '0';
	let lng = $('#colPopLng').is(':checked') ? '1' : '0';
	let gas = $('#colPopGas').is(':checked') ? '1' : '0';
	let wf = $('#colPopWf').is(':checked') ? '1' : '0';
	let dl = $('#colPopDl').is(':checked') ? '1' : '0';
	
	_colList = {
		'uid': '1',
		'isLc': lc,
		'isSp': sp,
		'isBt': bt,
		'isGt': gt,
		'isCmr': cmr,
		'isMt': mt,
		'isIe': ie,
		'isAc': ac,
		'isSt': st,
		'isCold': cold,
		'isLng': lng,
		'isGas': gas,
		'isWf': wf,
		'isDl': dl
    };

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/updateEventColumnInfo.html',
		data: {
			isLc: lc,
			isSp: sp,
			isBt: bt,
			isGt: gt,
			isCmr: cmr,
			isMt: mt,
			isIe: ie,
			isAc: ac,
			isSt: st,
			isCold: cold,
			isLng: lng,
			isGas: gas,
			isWf: wf,
			isDl: dl
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				
				if(json.result) {
					$('#colPop').modal('hide');
					setColumn();
					getEventList();
					alertPop($.i18n.t('colPop.compSave'));
				}else{
					toastPop($.i18n.t('share:tryAgain'));
				}
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display','none');
		}
	});
}

// 신규 추가 팝업.
function showNewPop() {
	$('#newPopPjt').val('');
	$('#newPopRegOwner').val('');
	$('#newPopTypeModel').val('');
	
	$('#newPop').modal();
}

// 신규 추가.
function addShip() {
	let pjt = $('#newPopPjt').val();
	let regOwner = $('#newPopRegOwner').val();
	let shipType = $('#newPopShipType').val();
	let typeModel = $('#newPopTypeModel').val();
	
	if(isEmpty(pjt) || isEmpty(regOwner) || isEmpty(typeModel)) {
		toastPop($.i18n.t('newPop.errEmpty'));
	}else {
		let uid = _newTempUid--;
		
		$('#totalCnt').text(_list.length + 1);
		
		_newShipList.push({'uid': uid, 'pjt': pjt, 'regOwner': regOwner, 'shipType': shipType, 'typeModel': typeModel});
		
		if(_list.length == 0) {
			$('#listTbody').empty();
		}

		let kindLabelStyle = 'position: -webkit-sticky; position: sticky; left: 156px; z-index: 0; padding-left: 0px; padding-right: 0px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-300); box-shadow: inset -4px 0px 6px -4px #00000029; font-size: 16px; font-weight: 700; line-height: 24px;';
		let kindLabelLastStyle = 'position: -webkit-sticky; position: sticky; left: 156px; z-index: 0; padding-left: 0px; padding-right: 0px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-500); box-shadow: inset -4px 0px 6px -4px #00000029; font-size: 16px; font-weight: 700; line-height: 24px;';
		let lastBottomStyle = 'border-bottom: 1px solid var(--neutral-500);';
		let datepickerOp = {showOn: 'both', buttonImage: contextPath + '/img/new/calendar.png', buttonImageOnly: true, dateFormat: 'y-mm-dd'};
		
		let cardColor = 'event-list-info-card-color-' + (_list.length % 3);
		let pjtColor = 'event-list-info-card-pjt-color-outside';
		
		let plan = '<tr class="text-center">' + 
    					'<td style="position: -webkit-sticky; position: sticky; left: 0; z-index: 0; padding: 4px; background: var(--secondary-50); border-bottom: 1px solid var(--neutral-500);" rowspan="3">' + 
    						'<div class="d-flex event-list-info-card">' + 
    							'<div class="event-list-info-card-color ' + cardColor + '"></div>' + 
    							'<div class="d-flex flex-column event-list-info-card-content">' + 
        							'<div class="flex-grow-1 title-3 text-left pl-1 ' + pjtColor + '">' + pjt + '</div>' + 
        							'<div class="body-5 text-left pt-1 event-list-info-card-ellipsis">' + regOwner + '</div>' + 
        							'<div class="body-5 text-left pt-1 event-list-info-card-ellipsis">' + typeModel + '</div>' + 
        							'<div class="body-5 text-left pt-1 d-flex">' + 
        								'<div class="flex-grow-1"></div>' + 
        								'<div>' +
        									'<a href="#" onclick="showBbs(' + uid + ', true)">' + 
        										'<img src="' + contextPath + '/img/new/arrow_more.png">' + 
        									'</a>' + 
        								'</div>' + 
        							'</div>' + 
        						'</div>' + 
    						'</div>' + 
    					'</td>' + 
    					'<td style="' + kindLabelStyle + '">' + $.i18n.t('list.plan') + '</td>';
		
		let pros = '<tr class="text-center">' + 
    					'<td style="' + kindLabelStyle + '">' + $.i18n.t('list.pros') + '</td>';
		
		let perf = '<tr class="text-center">' + 
    					'<td style="' + kindLabelLastStyle + '">' + $.i18n.t('list.perf') + '</td>';

		let idx = 0;
		
		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosLc' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosSp' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosBt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosGt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosCmr' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosMt' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosIe' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>' + '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosAcFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>' + 
    				'<td class="text-left"><input id="prosAcTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>' + 
    				'<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>' + '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosStFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>' + 
    				'<td class="text-left"><input id="prosStTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>' + 
    				'<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>' + '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosColdFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>' + 
    				'<td class="text-left"><input id="prosColdTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>' + 
    				'<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>' + '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosLngFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>' +
    				'<td class="text-left"><input id="prosLngTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>' + 
    				'<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>' +  '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosGasFrom' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>' + 
    				'<td class="text-left"><input id="prosGasTo' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>' + 
    				'<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx++]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosWf' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}

		if(_isShowColumn[idx]) {
			plan += '<td class="text-left"></td>';
			pros += '<td class="text-left"><input id="prosDl' + uid + '" type="text" class="event-list-datepicker" readonly="readonly" value=""/></td>';
			perf += '<td class="text-left" style="' + lastBottomStyle + '"></td>';
		}
    		
		plan +=	'</tr>';
		pros +=	'</tr>'; 
		perf +=	'</tr>'; 
		
		$('#listTbody').append(plan + pros + perf);
		
		idx = 0;
		
		if(_isShowColumn[idx++]) {
			$('#prosLc' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosSp' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosBt' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosGt' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosCmr' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosMt' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosIe' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosAcFrom' + uid).datepicker(datepickerOp);
			$('#prosAcTo' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosStFrom' + uid).datepicker(datepickerOp);
			$('#prosStTo' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosColdFrom' + uid).datepicker(datepickerOp);
			$('#prosColdTo' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosLngFrom' + uid).datepicker(datepickerOp);
			$('#prosLngTo' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosGasFrom' + uid).datepicker(datepickerOp);
			$('#prosGasTo' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx++]) {
			$('#prosWf' + uid).datepicker(datepickerOp);
		}
		
		if(_isShowColumn[idx]) {
			$('#prosDl' + uid).datepicker(datepickerOp);
		}
		
		$('#newPop').modal('hide');
		alertPop($.i18n.t('newPop.compMsg'));
	}
}

// 게시판 팝업.
function showBbs(uid, isNew) {
	if(isNew) {
		alertPop($.i18n.t('newShipListMsg'));
	}else {
		for(let i = 0; i < _list.length ; i++) {
			if(_list[i].uid == uid) {
				$('#bbsPopPjt').text(_list[i].pjt);
				$('#bbsPopCrew1').html(_list[i].crew1Pro + ' &nbsp;&nbsp;' + _list[i].crew1Lead);
				$('#bbsPopCrew2').html(_list[i].crew2Pro + '  &nbsp;&nbsp;' + _list[i].crew2Lead);
				$('#bbsPopCrew3').html(_list[i].crew3Pro + '  &nbsp;&nbsp;' + _list[i].crew3Lead);
				$('#bbsPopCom').html(_list[i].comMain + '  &nbsp;&nbsp;' + _list[i].comSub);
				$('#bbsPopOperate').text(_list[i].operate);
				
				initBbsFile()
				$('#bbsPopRemark').val('');
				
				getBbsList(_list[i].pjt);
				$('#bbsPop').modal();
				
				break;
			}
		}
	}
}

// 게시판 글 조회.
function getBbsList(pjt) {
	$('#bbsPopListTbody').empty();
	_currBbsPjt = pjt;
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/getBbsList.html',
		data: {
			pjt: pjt
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				
				if(json.list != null && json.list.length >= 0) {
					for(let i = 0; i < json.list.length; i++) {
						let item = json.list[i];
						let fileList = '';
						
						for(let x = 0; x < json.list[i].fileList.length; x++) {
							fileList += '<a href="' + contextPath + '/sched/downBbsFile.html?uid=' + json.list[i].fileList[x].uid + '">' + 
											'<div class="chip-obj">' + '<img src="' + getFileIcon(json.list[i].fileList[x].fileName) + '" height="24px" class="mr-2">' + json.list[i].fileList[x].fileName + '</div>' + 
										'</a>';
						}
						
						let row = '<tr>' +
										'<td class="event-list-bbs-row-kind">' + item.kind + '</td>' +
										'<td class="pr-0"><div class="border rounded p-2" style="min-height: 80px;">' + item.remark + '</div>' + fileList + '</td>' +
										'<td class="text-center align-top">' + 
											'<div class="event-list-bbs-row-name">' + item.name + '</div>' + 
											'<div class="event-list-bbs-row-date">' + item.insertDate + '<p/></div>' + 
											'<div onclick="showDelBbs(' + item.uid + ')" class="pointer"><i class="fa-solid fa-trash-can"></i></div>' + 
										'</td>' +
									'</tr>';
						
						$('#bbsPopListTbody').append(row);
					}
				}else{
					toastPop($.i18n.t('share:tryAgain'));
				}
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display','none');
		}
	});
}

// 게시판 파일 첨부.
function bbsFileAdded(input) {
	if(_isAddingBbsFile) {
		toastPop($.i18n.t('share:wait'));
		return;
	}
	
	_isAddingBbsFile = true;
	
	for(let i = 0; i < input.files.length; i++) {
		let name = input.files[i].name;
		let id = _bbsFileId++;
		
		let chip = '<div id="bbsPopFileList_' + id + '" class="chip-obj">' + 
						'<img src="' + getFileIcon(name) + '" height="24px" class="mr-2">' + name +  
						'<span class="chip-divide"></span>' + 
						'<span onclick="delBbsFile(' + id + ')" class="chip-btn-delete"><i class="fa-solid fa-xmark fa-sm"></i></span>' + 
					'</div>';
		
		$('#bbsPopFileList').append(chip);
		_bbsFileList.push({id: id, file: input.files[i]});
	}
	
	_isAddingBbsFile = false;
}

// 게시판 파일 삭제.
function delBbsFile(id) {
	for(let i = 0; i < _bbsFileList.length; i++) {
		if(_bbsFileList[i].id == id) {
			_bbsFileList.splice(i, 1);
			break;
		}
	}
		
	$('#bbsPopFileList_' + id).remove();
	
	if(_bbsFileList.length == 0) {
		$('#bbsPopFileInput').val('');
	}
}

// 게시판 파일 초기화.
function initBbsFile() {
	_bbsFileList = [];
	$('#bbsPopFileList').empty();
	$('#bbsPopFileInput').val('');
}

// 게시판 글 저장.
function saveBbs() {
	let kind = $('#bbsPopCrewKind').val();
	let remark = $('#bbsPopRemark').val();
	
	if(isEmpty(remark)) {
		toastPop($.i18n.t('bbsPop.errEmpty'));
	}else {
		const formData = new FormData();
		formData.append('pjt', _currBbsPjt);
		formData.append('kind', kind);
		formData.append('remark', remark);
		
		for(let i = 0; i < _bbsFileList.length; i++) {
			formData.append('files', _bbsFileList[i].file);
		}
		
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/sched/bbs.html',
			enctype: 'multipart/form-data',
			processData: false,
	        contentType: false,
			data: formData,
			success: function(data) {
				try {
					let json = JSON.parse(data);
				
					if(json.result) {
						initBbsFile();
						$('#bbsPopRemark').val('');
						
						getBbsList(_currBbsPjt);
						
						toastPop($.i18n.t('bbsPop.compSave'));
					}else{
						toastPop($.i18n.t('share:tryAgain'));
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
	}
}

// 게시판 글 삭제 팝업.
function showDelBbs(uid) {
	_currBbsDelUid = uid;
	$('#bbsDelPop').modal();
}

// 게시판 글 삭제.
function delBbs() {
	$('#bbsDelPop').modal('hide');
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/deleteBbs.html',
		data: {
			uid: _currBbsDelUid
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				
				if(json.result) {
					getBbsList(_currBbsPjt);
					
					toastPop($.i18n.t('bbsDelPop.compDel'));
				}else{
					toastPop($.i18n.t('share:tryAgain'));
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
}

// 이벤트 저장.
function saveEvent() {
	let idx = 0;
		
	let isLc = _isShowColumn[idx++] ? 1 : 0;
	let isSp = _isShowColumn[idx++] ? 1 : 0;
	let isBt = _isShowColumn[idx++] ? 1 : 0;
	let isGt = _isShowColumn[idx++] ? 1 : 0;
	let isCmr = _isShowColumn[idx++] ? 1 : 0;
	let isMt = _isShowColumn[idx++] ? 1 : 0;
	let isIe = _isShowColumn[idx++] ? 1 : 0;
	let isAc = _isShowColumn[idx++] ? 1 : 0;
	let isSt = _isShowColumn[idx++] ? 1 : 0;
	let isCold = _isShowColumn[idx++] ? 1 : 0;
	let isLng = _isShowColumn[idx++] ? 1 : 0;
	let isGas = _isShowColumn[idx++] ? 1 : 0;
	let isWf = _isShowColumn[idx++] ? 1 : 0;
	let isDl = _isShowColumn[idx] ? 1 : 0;
	
	let uidArr = []; 
	let prosLcArr = [];  
	let prosSpArr = [];  
	let prosBtArr = [];  
	let prosGtArr = [];  
	let prosCmrArr = [];  
	let prosMtArr = [];  
	let prosIeArr = [];  
	let prosAcFromArr = [];  
	let prosAcToArr = [];  
	let prosStFromArr = [];  
	let prosStToArr = []; 
	let prosColdFromArr = [];  
	let prosColdToArr = [];  
	let prosLngFromArr = [];  
	let prosLngToArr = [];  
	let prosGasFromArr = [];  
	let prosGasToArr = [];  
	let prosWfArr = [];  
	let prosDlArr = []; 
	
	let pjtArr = []; 
	let regOwnerArr = []; 
	let shipTypeArr = []; 
	let typeModelArr = []; 
	let newLcArr = [];  
	let newSpArr = [];  
	let newBtArr = [];  
	let newGtArr = [];  
	let newCmrArr = [];  
	let newMtArr = [];  
	let newIeArr = [];  
	let newAcFromArr = [];  
	let newAcToArr = [];  
	let newStFromArr = [];  
	let newStToArr = []; 
	let newColdFromArr = [];  
	let newColdToArr = [];  
	let newLngFromArr = [];  
	let newLngToArr = [];  
	let newGasFromArr = [];  
	let newGasToArr = [];  
	let newWfArr = [];  
	let newDlArr = []; 
	
	for(let i = 0; i < _list.length; i++) {
		if(_changeUidList.includes(_list[i].uid)) {
			let uid = _list[i].uid;
			idx = 0;
			
			uidArr.push(uid);
		
			if(_isShowColumn[idx++]) {
				prosLcArr.push(formatFullDate($('#prosLc' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosSpArr.push(formatFullDate($('#prosSp' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosBtArr.push(formatFullDate($('#prosBt' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosGtArr.push(formatFullDate($('#prosGt' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosCmrArr.push(formatFullDate($('#prosCmr' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosMtArr.push(formatFullDate($('#prosMt' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosIeArr.push(formatFullDate($('#prosIe' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosAcFromArr.push(formatFullDate($('#prosAcFrom' + uid).datepicker('getDate')));
				prosAcToArr.push(formatFullDate($('#prosAcTo' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosStFromArr.push(formatFullDate($('#prosStFrom' + uid).datepicker('getDate')));
				prosStToArr.push(formatFullDate($('#prosStTo' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosColdFromArr.push(formatFullDate($('#prosColdFrom' + uid).datepicker('getDate')));
				prosColdToArr.push(formatFullDate($('#prosColdTo' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosLngFromArr.push(formatFullDate($('#prosLngFrom' + uid).datepicker('getDate')));
				prosLngToArr.push(formatFullDate($('#prosLngTo' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosGasFromArr.push(formatFullDate($('#prosGasFrom' + uid).datepicker('getDate')));
				prosGasToArr.push(formatFullDate($('#prosGasTo' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx++]) {
				prosWfArr.push(formatFullDate($('#prosWf' + uid).datepicker('getDate')));
			}
			
			if(_isShowColumn[idx]) {
				prosDlArr.push(formatFullDate($('#prosDl' + uid).datepicker('getDate')));
			}
		}
	}
	
	for(let i = 0; i < _newShipList.length; i++) {
		let uid = _newShipList[i].uid;
		idx = 0;
		
		pjtArr.push(_newShipList[i].pjt); 
		regOwnerArr.push(_newShipList[i].regOwner); 
		shipTypeArr.push(_newShipList[i].shipType); 
		typeModelArr.push(_newShipList[i].typeModel); 
		
		if(_isShowColumn[idx++]) {
			newLcArr.push(formatFullDate($('#prosLc' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newSpArr.push(formatFullDate($('#prosSp' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newBtArr.push(formatFullDate($('#prosBt' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newGtArr.push(formatFullDate($('#prosGt' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newCmrArr.push(formatFullDate($('#prosCmr' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newMtArr.push(formatFullDate($('#prosMt' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newIeArr.push(formatFullDate($('#prosIe' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newAcFromArr.push(formatFullDate($('#prosAcFrom' + uid).datepicker('getDate')));
			newAcToArr.push(formatFullDate($('#prosAcTo' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newStFromArr.push(formatFullDate($('#prosStFrom' + uid).datepicker('getDate')));
			newStToArr.push(formatFullDate($('#prosStTo' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newColdFromArr.push(formatFullDate($('#prosColdFrom' + uid).datepicker('getDate')));
			newColdToArr.push(formatFullDate($('#prosColdTo' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newLngFromArr.push(formatFullDate($('#prosLngFrom' + uid).datepicker('getDate')));
			newLngToArr.push(formatFullDate($('#prosLngTo' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newGasFromArr.push(formatFullDate($('#prosGasFrom' + uid).datepicker('getDate')));
			newGasToArr.push(formatFullDate($('#prosGasTo' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx++]) {
			newWfArr.push(formatFullDate($('#prosWf' + uid).datepicker('getDate')));
		}
		
		if(_isShowColumn[idx]) {
			newDlArr.push(formatFullDate($('#prosDl' + uid).datepicker('getDate')));
		}
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/updateEventList.html',
		traditional: true,
		data: {
			isLc: isLc,
			isSp: isSp,
			isBt: isBt,
			isGt: isGt,
			isCmr: isCmr,
			isMt: isMt,
			isIe: isIe,
			isAc: isAc,
			isSt: isSt,
			isCold: isCold,
			isLng: isLng,
			isGas: isGas,
			isWf: isWf,
			isDl: isDl,
			uidArr: uidArr, 
			prosLcArr: prosLcArr, 
			prosSpArr: prosSpArr, 
			prosBtArr: prosBtArr, 
			prosGtArr: prosGtArr, 
			prosCmrArr: prosCmrArr, 
			prosMtArr: prosMtArr, 
			prosIeArr: prosIeArr, 
			prosAcFromArr: prosAcFromArr, 
			prosAcToArr: prosAcToArr, 
			prosStFromArr: prosStFromArr, 
			prosStToArr: prosStToArr,
			prosColdFromArr: prosColdFromArr, 
			prosColdToArr: prosColdToArr, 
			prosLngFromArr: prosLngFromArr, 
			prosLngToArr: prosLngToArr, 
			prosGasFromArr: prosGasFromArr, 
			prosGasToArr: prosGasToArr, 
			prosWfArr: prosWfArr, 
			prosDlArr: prosDlArr,
			pjtArr: pjtArr,
			regOwnerArr: regOwnerArr,
			shipTypeArr: shipTypeArr,
			typeModelArr: typeModelArr,
			newLcArr: newLcArr, 
			newSpArr: newSpArr, 
			newBtArr: newBtArr, 
			newGtArr: newGtArr, 
			newCmrArr: newCmrArr, 
			newMtArr: newMtArr, 
			newIeArr: newIeArr, 
			newAcFromArr: newAcFromArr, 
			newAcToArr: newAcToArr, 
			newStFromArr: newStFromArr, 
			newStToArr: newStToArr,
			newColdFromArr: newColdFromArr, 
			newColdToArr: newColdToArr, 
			newLngFromArr: newLngFromArr, 
			newLngToArr: newLngToArr, 
			newGasFromArr: newGasFromArr, 
			newGasToArr: newGasToArr, 
			newWfArr: newWfArr, 
			newDlArr: newDlArr
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				
				if(json.result) {
					getEventList();
					alertPop($.i18n.t('compSave'));
				}else{
					alertPop($.i18n.t('share:tryAgain'));
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