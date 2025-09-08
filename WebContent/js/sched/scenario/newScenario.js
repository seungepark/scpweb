let _listUid = 1;
let _list = [];
let _workStdPopList = [];
let _workStdSelIdxList = [];
let _copyPopList = [];
let _copyPopPageNo = 1;


$(function(){
	initI18n();
	init();
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
	      	namespaces: ['share', 'newScenario'],
	      	defaultNs: 'newScenario'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	$('#dParentDataHide').off().on('click', function() {
		if($('#dParentData').is(':visible')) {
			$('#dParentData').hide();
			$('#dParentDataHide').text($.i18n.t('hideParent'));
			document.getElementById('tbWrap').classList.remove('scroll-area-scenario-head');
			document.getElementById('tbWrap').classList.add('scroll-area-scenario-head-hide');
		}else {
			$('#dParentData').show();
			$('#dParentDataHide').text($.i18n.t('showParent'));
			document.getElementById('tbWrap').classList.remove('scroll-area-scenario-head-hide');
			document.getElementById('tbWrap').classList.add('scroll-area-scenario-head');
		}
	});
	
	$('#workStdPopListAllChk').click(function(){
		if($('#workStdPopListAllChk').is(':checked')) {
			$('input[name=workStdPopListChk]').prop('checked', true);
		}else {
			$('input[name=workStdPopListChk]').prop('checked', false);
		}
		
		workStdPopRefreshSelectList();
	});
	
	$('#workStdPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			getWorkStdSearchList();
		}
	});
	
	$('#copyPopTitle').keypress(function(e) {
		if(e.keyCode === 13) {
			getCopyPopScenarioList(1);
		}
	});
	
	$('#copyPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			getCopyPopScenarioList(1);
		}
	});
	
	$('#list').sortable({
		axis: 'y',
		start: function(event, ui) {},
		update: function(event, ui) {},
		stop: function(event, ui){
//			1. 리스트에서 id에 해당하는 tr이 몇 번째에 위치하는지 확인 (idx)
//			2. 배열에서 id에 해당하는 값이 몇 번째에 위하하는지 확인 (idx)
//			3. 리스트와 배열의 idx가 다르면 변경 작업
//			4. 배열의 idx 값을 빼서 리스트의 idx 위치에 넣음

			let id = ui.item.attr('id');

			if(!isEmpty(id)) {
				let list = $('#list > tr');
				let listIdx = 0;
				let arrayIdx = 0;
				
				for(let i = 0; i < list.length; i++) {
					if(id == list[i].id) {
						listIdx = i;
						break;
					}
				}
				
				for(let i = 0; i < _list.length; i++) {
					if(id == 'scenarioDetailTr' + _list[i].uid) {
						arrayIdx = i;
						break;
					}
				}

				if(listIdx != arrayIdx) {
					let item = _list.splice(arrayIdx, 1);
					
					if(item.length == 1) {
						_list.splice(listIdx, 0, item[0]);
					}
					
					setSeqNo();
				}
			}
		}
	});
}

// 시나리오 상세 항목 체크.
function listChkOne(obj) {
	let listChkList = document.getElementsByName('scenarioDetailChk');
	
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i] != obj) {
			listChkList[i].checked = false;
		}
	}
}

// 순서 재설정.
function setSeqNo() {
	let seqs = document.getElementsByName('scenarioDetailSeq');

	for(let i = 0; i < seqs.length; i++) {
		seqs[i].value = i + 1;
	}
}

// 불러오기 팝업.
function showCopyPop() {
	_copyPopPageNo = 1;
	getCopyPopScenarioList(1);
	$('#copyPop').modal();
}

// 불러오기 팝업 시나리오 목록.
function getCopyPopScenarioList(page){
	let title = $('#copyPopTitle').val();
	let desc = $('#copyPopDesc').val();
	let shipType = $('#copyPopShipType option:selected').val();
	
	_copyPopPageNo = page;
	
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/sched/scenario/getScenarioList.html',
		data: {
			page: page,
			title: title,
			description: desc,
			shipType: shipType
		},
		success: function(data) {
			let json = JSON.parse(data);
			let html = '';
			_copyPopList = json.list;

			for(let i = 0; i < json.list.length; i++) {
				html += '<tr>' + 
							'<td><input type="radio" name="copyPopListRadio"></td>' + 
							'<td>' + json.list[i].title + '</td>' +
							'<td>' + json.list[i].desc + '</td>' +
							'<td class="text-center">' + json.list[i].shipType + '</td>' +
						 '</tr>';
			}
			
			$('#copyPopList').empty();
			
			if(json.list.length > 0) {
				$('#copyPopList').append(html);
			}else {
				$('#copyPopList').append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
			}
			
		    copyPopPaging(json.listCnt, page);
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

function copyPopPaging(cnt, page){
	let perPage = 10;
    let total = Math.ceil(parseInt(cnt) / perPage);
    let start = Math.floor((page - 1) / perPage) * perPage + 1;
    let end = start + perPage - 1;
    
    if(total <= end) {
    	end = total;
    }
    
	let pagingInitNum = parseInt(start);
	let pagingEndNum = parseInt(end);
	let totalPagingCnt = parseInt(total);
	let preNo = parseInt(page) - 1;
	let nextNo = parseInt(page) + 1;
	let html = '';
	
	if(totalPagingCnt != 0 && totalPagingCnt != 1 && preNo != 0) {
		html += '<div onclick="getCopyPopScenarioList(' + preNo + ');" class="pg-prev">&nbsp;</div>';
	}else {
		html += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(let k = pagingInitNum; k <= pagingEndNum; k++) {
	    if(parseInt(page) == k) {
			html += '<div onclick="getCopyPopScenarioList(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
	    	html += '<div onclick="getCopyPopScenarioList(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(totalPagingCnt != 0 && totalPagingCnt != 1 && nextNo <= totalPagingCnt) {
		html += '<div onclick="getCopyPopScenarioList(' + nextNo + ');" class="pg-next">&nbsp;</div>';
	}else {
		html += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(totalPagingCnt == 0) {
		html = '';
	}
	
	$('#copyPopPagination').empty();
	$('#copyPopPagination').append(html);
}

// 시나리오 복사 데이터 가져오기.
function copyScenario() {
	let rows = document.getElementsByName('copyPopListRadio');
	let isChecked = false;
	let checkIdx = 0;
	
	for(let i = 0; i < rows.length; i++) {
		if(rows[i].checked) {
			isChecked = true;
			checkIdx = i;
			break;
		}
	}
	
	if(!isChecked) {
		toastPop($.i18n.t('copyPop.errSelect'));
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/scenario/getCopyScenario.html',
		data: {
			uid: _copyPopList[checkIdx].uid
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				$('#workStdPop').modal('hide');
				
				copyData(json);
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

// 시나리오 복사.
function copyData(data) {
	let bean = data.bean;
	let list = data.list;
	
	$('#title').val(bean.title);
	$('#desc').val(bean.desc);
	$('#shipType').val(bean.shipType);
	$('#projEvent').val(bean.projEvent);
	$('#lngTotal').val(numberFormat(bean.lngTotal, true, true, true));
	$('#ln2Total').val(numberFormat(bean.ln2Total, true, true, true));
	$('#margin').val(numberFormat(bean.margin, true, false, true));
	$('#marginCur').val(bean.marginCur);
	$('#revenue').val(numberFormat(bean.revenue, false, false, true));
	$('#revenueCur').val(bean.revenueCur);
	$('#cost').val(numberFormat(bean.cost, false, false, true));
	$('#costCur').val(bean.costCur);
	$('#exRate').val(numberFormat(bean.exRate, false, true, true));
	
	if(!isNanEmpty(bean.workTime)) {
		let workTimeHour = 0;
		let workTimeMin = parseInt(bean.workTime);
		
		if(workTimeMin >= 60) {
			workTimeHour = Math.floor(workTimeMin / 60);
			workTimeMin = workTimeMin % 60;
		}
		
		$('#workTime').val(workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin);
	}else {
		$('#workTime').val('');
	}
	
	let html = '';
	
	for(let i = 0; i < list.length; i++) {
		let item = list[i];
		let uid = item.uid;
		let colors = '';
		let options = '';
		let workTime = '';
		
		for(let x = 0; x < _colorList.length; x++) {
			colors += '<option style="width: 90px; height: 20%; border: 1px solid #000000; border-radius: 4px; background-color: #' + _colorList[x] + ';" value="' + _colorList[x] + '" ' + (_colorList[x] == item.color ? 'selected' : '') + '></option>';	
		}
		
		if(item.isOption == 'Y') {
			for(let x = 0; x < _optionList.length; x++) {
				let id = 'scenarioDetailOption' + uid + '_' + x;
				
				options += '<div class="form-check form-check-inline">' + 
								'<input name="scenarioDetailOption' + uid + '" id="' + id + '" class="form-check-input" type="checkbox" value="' + _optionList[x] + '" ' + (item.option.includes(_optionList[x]) ? 'checked' : '') + '>' + 
								'<label class="form-check-label" for="' + id + '">' + _optionList[x] + '</label>' + 
							'</div>';
			}
		}
		
		if(!isNanEmpty(item.workTime)) {
			let workTimeHour = 0;
			let workTimeMin = parseInt(item.workTime);
			
			if(workTimeMin >= 60) {
				workTimeHour = Math.floor(workTimeMin / 60);
				workTimeMin = workTimeMin % 60;
			}
			
			workTime = workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin;
		}
		
		html += '<tr id="scenarioDetailTr' + uid + '">' +
					'<td><input name="scenarioDetailChk" type="checkbox" onclick="listChkOne(this)"></td>' +
					'<td class="th-w-120"><input name="scenarioDetailSeq" type="text" onkeyup="this.value=numberFormat(this.value, false, false, false);" class="text-center" value="' + numberFormat(item.seq, false, false, false) + '" disabled></td>' +
					'<td><input name="scenarioDetailDesc" type="text" value="' + item.desc + '"></td>' +
					'<td><select id="scenarioDetailColor' + uid + '" name="scenarioDetailColor" style="width: 90px; padding:8px; background-color: #' + item.color + ';">' + colors + '</select></td>' +
					'<td><div class="ws-nowrap">' + options + '</div></td>' +
					'<td><input name="scenarioDetailWorkTime" type="text" placeholder="HH:MM" onkeyup="setWorkTimeTotal(this)" class="text-right" value="' + workTime + '"></td>' +
					'<td><input name="scenarioDetailLng" type="text" onkeyup="setLngTotal(this)" class="text-right" value="' + numberFormat(item.lng, true, true, true) + '"></td>' +
					'<td><input name="scenarioDetailLn2" type="text" onkeyup="setLn2Total(this)" class="text-right" value="' + numberFormat(item.ln2, true, true, true) + '"></td>' +
					'<td><div class="pointer" onClick="delScenarioDetail(' + uid + ')"><i class="fa-solid fa-trash-can"></i></div></td>' +
				'</tr>';
	}
	
	$('#list').empty();
	_list = [];
	_list = list;
	
	if(html != '') {
		$('#list').append(html);
		
		for(let i = 0; i < list.length; i++) {
		  	document.getElementById('scenarioDetailColor' + list[i].uid).addEventListener('change', function() {
		    	const selectedOption = this.options[this.selectedIndex];
		    	this.style.backgroundColor = window.getComputedStyle(selectedOption).backgroundColor;
		  });
		}
	}
	
	setSeqNo();
	$('#copyPop').modal('hide');
	alertPop($.i18n.t('copyPop.compCopy'));
}

// 작업 추가 팝업.
function showWorkStdPop() {
	getWorkStdSearchList();
	$('#workStdPop').modal();
}

// 작업 표준 검색.
function getWorkStdSearchList() {
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/scenario/getWorkStdSearchList.html',
		data: {
			description: $('#workStdPopDesc').val()
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				let html = '';
				
				$('#workStdPopList').empty();
				$('#workStdPopSelectList').empty();
				_workStdSelIdxList = [];
				_workStdPopList = [];
				_workStdPopList = json.list;
				
				for(let i = 0; i < _workStdPopList.length; i++) {
					html += '<tr>' + 
								'<td class="text-center"><input type="checkbox" name="workStdPopListChk" onclick="workStdPopRefreshSelectList()"></td>' + 
								'<td class="text-left">' + _workStdPopList[i].desc + '</td>' + 
								'<td class="text-center"><div style="width: 100%; height: 100%; border: 1px solid #000000; border-radius: 4px; background-color: #' + _workStdPopList[i].color + ';"></div></td>' + 
								'<td class="text-center"><input type="checkbox" onclick="return false;" ' + (_workStdPopList[i].isOption == 'Y' ? 'checked' : '') + '></td>' + 
							'</tr>';
				}
				
				if(_workStdPopList.length > 0) {
					$('#workStdPopList').append(html);
				} else{
					$('#workStdPopList').append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
				}
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

// 작업 추가 팝업 체크 목록 새로고침.
function workStdPopRefreshSelectList() {
	let listChkList = document.getElementsByName('workStdPopListChk');
	_workStdSelIdxList = [];
	$('#workStdPopSelectList').empty();
	
	let html = '<table class="tb-style">' + 
					'<tbody>';
					
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i].checked) {
			if(_workStdSelIdxList.length % 2 == 0) {
				html += '<tr>' +
							'<td class="text-left border-bottom-0" style="width: 230px;">' + _workStdPopList[i].desc + '</td>' + 
							'<td class="th-w-90 text-center border-bottom-0"><div onclick="addWorkStdPopDelSelectList(' + i + ')" class="cursor-pointer"><i class="fa-solid fa-xmark"></i></div></td>';
			}else {
				
				html += 	'<td class="text-left border-bottom-0">' + _workStdPopList[i].desc + '</td>' + 
							'<td class="th-w-90 text-center border-bottom-0"><div onclick="addWorkStdPopDelSelectList(' + i + ')" class="cursor-pointer"><i class="fa-solid fa-xmark"></i></div></td>' + 
						'</tr>';
			}
			
			_workStdSelIdxList.push(i);
		}
	}
	
	if(_workStdSelIdxList.length % 2 == 1) {
		html += '<td class="text-left border-bottom-0"></td>' + 
				'<td class="th-w-90 text-center border-bottom-0"></td>' + 
			'</tr>';
	}

	
	 html += '</tbody>' +
		'</table>';
		
	$('#workStdPopSelectList').html(html);
	
	setRowSelectedSetName('workStdPopListChk');
}

// 작업 추가 팝업 삭제 버튼.
function addWorkStdPopDelSelectList(idx) {
	let listChkList = document.getElementsByName('workStdPopListChk');
	listChkList[idx].checked = false;
	
	workStdPopRefreshSelectList();
}

// 작업 추가 팝업 추가 버튼.
function workStdPopAddList() {
	let listChkList = document.getElementsByName('workStdPopListChk');
	let html = '';
	let addList = [];
	
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i].checked) {
			let uid = _listUid++;
			let colors = '';
			let options = '';
			
			for(let x = 0; x < _colorList.length; x++) {
				colors += '<option style="width: 90px; height: 20%; background-color: #' + _colorList[x] + ';" value="' + _colorList[x] + '" ' + (_colorList[x] == _workStdPopList[i].color ? 'selected' : '') + '></option>';	
			}
			
			if(_workStdPopList[i].isOption == 'Y') {
				for(let x = 0; x < _optionList.length; x++) {
					let id = 'scenarioDetailOption' + uid + '_' + x;
					
					options += '<div class="form-check form-check-inline">' + 
  									'<input name="scenarioDetailOption' + uid + '" id="' + id + '" class="form-check-input" type="checkbox" value="' + _optionList[x] + '">' + 
  									'<label class="form-check-label" for="' + id + '">' + _optionList[x] + '</label>' + 
								'</div>';
				}
			}
			
			html += '<tr id="scenarioDetailTr' + uid + '">' +
						'<td><input name="scenarioDetailChk" type="checkbox" onclick="listChkOne(this)"></td>' +
						'<td class="th-w-120"><input name="scenarioDetailSeq" type="text" onkeyup="this.value=numberFormat(this.value, false, false, false);" class="text-center" disabled></td>' +
						'<td><input name="scenarioDetailDesc" type="text" value="' + _workStdPopList[i].desc + '"></td>' +
						'<td><select id="scenarioDetailColor' + uid + '" name="scenarioDetailColor" style="width: 90px; background-color: #' + _workStdPopList[i].color + ';">' + colors + '</select></td>' +
						'<td><div class="ws-nowrap">' + options + '</div></td>' +
						'<td><input name="scenarioDetailWorkTime" type="text" placeholder="HH:MM" onkeyup="setWorkTimeTotal(this)" class="text-right"></td>' +
						'<td><input name="scenarioDetailLng" type="text" onkeyup="setLngTotal(this)" class="text-right"></td>' +
						'<td><input name="scenarioDetailLn2" type="text" onkeyup="setLn2Total(this)" class="text-right"></td>' +
						'<td><div class="pointer" onClick="delScenarioDetail(' + uid + ')"><i class="fa-solid fa-trash-can"></i></div></td>' +
					'</tr>';
			
			addList.push({uid: uid, isOption: _workStdPopList[i].isOption});
		}
	}
	
	if(addList.length > 0) {
		if(_list.length == 0) {
			$('#list').empty();
		}
		
		let listChkList = document.getElementsByName('scenarioDetailChk');
		let isChecked = false;
		let checkedIdx = 0;
	
		for(let i = 0; i < listChkList.length; i++) {
			if(listChkList[i].checked) {
				isChecked = true;
				checkedIdx = i;
				break;
			}
		}
		
		if(isChecked) {
			$('#list > tr').eq(checkedIdx).after(html);
			_list.splice(checkedIdx + 1, 0, ...addList);
		}else {
			$('#list').append(html);
			_list = _list.concat(addList);
		}
	
		for(let i = 0; i < addList.length; i++) {
		  	document.getElementById('scenarioDetailColor' + addList[i].uid).addEventListener('change', function() {
		    	const selectedOption = this.options[this.selectedIndex];
		    	this.style.backgroundColor = window.getComputedStyle(selectedOption).backgroundColor;
		  });
		}
	}
	
	setSeqNo();
	$('#workStdPop').modal('hide');
}

// 삭제 버튼.
function delScenarioDetail(uid) {
	for(let i = 0; i < _list.length; i++) {
		if(_list[i].uid == uid) {
			_list.splice(i, 1);
			$('#scenarioDetailTr' + uid).remove();
			break;
		}
	}
	
	setWorkTimeTotal(null);
	setLngTotal(null);
	setLn2Total(null);
	setSeqNo();
}

// 작업 시간 (합) 업데이트.
function setWorkTimeTotal(obj) {
	if(obj != null) {
		obj.value = isValidTimeForRealTime(obj.value) ? obj.value : '';
	}
	
	let inputList = document.getElementsByName('scenarioDetailWorkTime');
	let totalMin = '';
	let totalHour = '';
	
	for(let i = 0; i < inputList.length; i++) {
		let vl = inputList[i].value.split(':');
		
		if(vl.length == 1) {
			if(!isNanEmpty(vl[0])) {
				if(totalMin == '') {
					totalMin = 0;
				}
				
				totalMin += parseInt(vl[0]); 
			}
		}else if(vl.length == 2) {
			if(!isNanEmpty(vl[0])) {
				if(totalHour == '') {
					totalHour = 0;
				}
				
				totalHour += parseInt(vl[0]); 
			}
			
			if(!isNanEmpty(vl[1])) {
				if(totalMin == '') {
					totalMin = 0;
				}
				
				totalMin += parseInt(vl[1]); 
			}
		}
	}
	
	if(totalMin != '' && totalMin >= 60) {
		let tempHour = Math.floor(totalMin / 60);
		
		if(totalHour == '') {
			totalHour = 0;
		}
		
		totalHour += tempHour;
		totalMin = totalMin % 60;
	}
	
	let workTimeVl = totalHour + ':';
	
	if(totalMin.toString() != '') {
		if(totalHour.toString() == '') {
			workTimeVl = '0:';
		}
		
		workTimeVl += totalMin > 9 ? '' : '0';
	}else {
		if(totalHour.toString() != '') {
			workTimeVl += '00';
		}else {
			workTimeVl = '';
		}
	}

	workTimeVl += totalMin;

	$('#workTime').val(workTimeVl);
}

// LNG 사용량 (합) 업데이트.
function setLngTotal(obj) {
	if(obj != null) {
		obj.value = numberFormat(obj.value, true, true, true);
		
		let temp = obj.value.split('.');
				
		if(temp.length == 2) {
			obj.value = temp[0] + '.' + temp[1].slice(0, 3);
		}
	}
	
	let inputList = document.getElementsByName('scenarioDetailLng');
	let total = '';
	
	for(let i = 0; i < inputList.length; i++) {
		let vl = inputList[i].value.replaceAll(',', '');

		if(!isNanEmpty(vl)) {
			if(total == '') {
				total = 0;
			}
			
			total += parseFloat(vl);
		}
	}
	
	if(total != '') {
		let temp = total.toString().split('.');
				
		if(temp.length == 2) {
			total = temp[0] + '.' + temp[1].slice(0, 3);
		}
	}

	$('#lngTotal').val(numberFormat(total + '', true, true, true));
}

// LN2 사용량 (합) 업데이트.
function setLn2Total(obj) {
	if(obj != null) {
		obj.value = numberFormat(obj.value, true, true, true);
		
		let temp = obj.value.split('.');
				
		if(temp.length == 2) {
			obj.value = temp[0] + '.' + temp[1].slice(0, 3);
		}
	}
	
	let inputList = document.getElementsByName('scenarioDetailLn2');
	let total = '';
	
	for(let i = 0; i < inputList.length; i++) {
		let vl = inputList[i].value.replaceAll(',', '');

		if(!isNanEmpty(vl)) {
			if(total == '') {
				total = 0;
			}
			
			total += parseFloat(vl); 
		}
	}
	
	if(total != '') {
		let temp = total.toString().split('.');
				
		if(temp.length == 2) {
			total = temp[0] + '.' + temp[1].slice(0, 3);
		}
	}

	$('#ln2Total').val(numberFormat(total + '', true, true, true));
}

// 수익 업데이트.
function setMargin(obj, isFloat) {
	if(obj != null) {
		obj.value = numberFormat(obj.value, false, isFloat, true);
		
		if(isFloat) {
			let temp = obj.value.split('.');
				
			if(temp.length == 2) {
				obj.value = temp[0] + '.' + temp[1].slice(0, 2);
			}
		}
	}

	let margin = document.getElementById('margin');
	let marginCur = document.getElementById('marginCur').value;
	let revenue = document.getElementById('revenue').value.replaceAll(',', '');
	let revenueCur = document.getElementById('revenueCur').value;
	let cost = document.getElementById('cost').value.replaceAll(',', '');
	let costCur = document.getElementById('costCur').value;
	let exRate = document.getElementById('exRate').value.replaceAll(',', '');
	
	if(!isNanEmpty(revenue) || !isNanEmpty(cost)) {
		let total = '';
		let revenueVl = '';
		let costVl = '';
		let exRateVl = '';
		let isRevenue = false;
		let isCost = false;
		let isExRate = false;
		
		if(!isNanEmpty(revenue)) {
			revenueVl = parseInt(revenue);
			isRevenue = true;
		}
		
		if(!isNanEmpty(cost)) {
			costVl = parseInt(cost);
			isCost = true;
		}
		
		if(!isNanEmpty(exRate)) {
			exRateVl = parseFloat(exRate);
			isExRate = true;
		}
		
		if(marginCur == revenueCur && marginCur == costCur) {					// 모든 통화가 같을 때.
			total = 0;
			
			if(isRevenue) {
				total = revenueVl;
			}
			
			if(isCost) {
				total -= costVl;
			}
		}else if(revenueCur == costCur && marginCur != revenueCur) {			// 매출, 재료비 통화는 같고, 수익 통화만 다를 때.
			if(isExRate) {														// 환율 필요.
				total = 0;
			
				if(isRevenue) {
					total = revenueVl;
				}
				
				if(isCost) {
					total -= costVl;
				}
				
				if(marginCur == '￦') {
					total *= exRateVl;
				}else {
					total /= exRateVl;
				}
				
				let temp = total.toString().split('.');
				
				if(temp.length == 2) {
					total = temp[0] + '.' + temp[1].slice(0, 2);
				}
			}
		}else if(revenueCur != costCur) {										// 매출, 재료비 통화가 다를 때.
			if(isExRate) {														// 환율 필요.
				total = 0;
			
				if(isRevenue) {
					if(revenueCur == '￦') {
						total = revenueVl;
					}else {
						total = revenueVl * exRateVl;
					}
				}

				if(isCost) {
					if(costCur == '￦') {
						total -= costVl;
					}else {
						total -= costVl * exRateVl;
					}
				}

				if(marginCur != '￦') {
					total /= exRateVl;
				}

				let temp = total.toString().split('.');
				
				if(temp.length == 2) {
					total = temp[0] + '.' + temp[1].slice(0, 2);
				}
			}
		}
		
		if(total == '') {
			margin.value = '';
		}else {
			total = Math.round(total);
			margin.value = numberFormat(total + '', true, false, true);
		}
	}else {
		margin.value = '';
	}
}

// 저장.
function saveScenario() {
	let title = $('#title').val();
	let desc = $('#desc').val();
	let shipType = $('#shipType').val();
	let projEvent = $('#projEvent').val();
	let workTime = $('#workTime').val();
	let lngTotal = $('#lngTotal').val().replaceAll(',', '');
	let ln2Total = $('#ln2Total').val().replaceAll(',', '');
	let margin = $('#margin').val().replaceAll(',', '');
	let marginCur = $('#marginCur').val();
	let revenue = $('#revenue').val().replaceAll(',', '');
	let revenueCur = $('#revenueCur').val();
	let cost = $('#cost').val().replaceAll(',', '');
	let costCur = $('#costCur').val();
	let exRate = $('#exRate').val().replaceAll(',', '');
	
	let seqs = document.getElementsByName('scenarioDetailSeq');
	let descs = document.getElementsByName('scenarioDetailDesc');
	let colors = document.getElementsByName('scenarioDetailColor');
	let workTimes = document.getElementsByName('scenarioDetailWorkTime');
	let lngs = document.getElementsByName('scenarioDetailLng');
	let ln2s = document.getElementsByName('scenarioDetailLn2');
	
	let seqList = [];
	let descList = [];
	let colorList = [];
	let workTimeList = [];
	let lngList = [];
	let ln2List = [];
	let isOptionList = [];
	let optionList = [];
	
	if(isEmpty(title)) {
		alertPop($.i18n.t('errTitleEmpty'));
		return;
	}
	
	let temp = workTime.split(':');
	let tempHour = '';
	let tempMin = '';
		
	if(temp.length == 1) {
		if(!isNanEmpty(temp[0])) {
			if(tempMin == '') {
				tempMin = 0;
			}
			
			tempMin += parseInt(temp[0]); 
		}
	}else if(temp.length == 2) {
		if(!isNanEmpty(temp[0])) {
			if(tempHour == '') {
				tempHour = 0;
			}
			
			tempHour += parseInt(temp[0]); 
		}
		
		if(!isNanEmpty(temp[1])) {
			if(tempMin == '') {
				tempMin = 0;
			}
			
			tempMin += parseInt(temp[1]); 
		}
	}
	
	if(tempHour == '' && tempMin == '') {
		workTime = '';
	}else {
		if(!isNanEmpty(tempHour)) {
			if(tempMin == '') {
				tempMin = 0;
			}
			
			tempMin += tempHour * 60;
		}
		
		workTime = tempMin;
	}
	
	let isSeqEmpty = false;
	
	for(let i = 0; i < seqs.length; i++) {
		if(isEmpty(seqs[i].value)) {
			isSeqEmpty = true;
			break;
		}else {
			seqList.push(seqs[i].value);
		}
		
		descList.push(descs[i].value);
		colorList.push(colors[i].value);
		lngList.push(lngs[i].value.replaceAll(',', ''));
		ln2List.push(ln2s[i].value.replaceAll(',', ''));
		
		let optionTemp = '';
		
		if(_list[i].isOption == 'Y') {
			let options = document.getElementsByName('scenarioDetailOption' + _list[i].uid);
			
			for(let x = 0; x < options.length; x++) {
				if(options[x].checked) {
					if(optionTemp != '') {
						optionTemp += ',';
					}
					
					optionTemp += options[x].value;
				}
			}
		}
		
		isOptionList.push(_list[i].isOption);
		optionList.push(optionTemp);
		
		let workTimeVl = '';
		temp = workTimes[i].value.split(':');
		tempHour = '';
		tempMin = '';
			
		if(temp.length == 1) {
			if(!isNanEmpty(temp[0])) {
				if(tempMin == '') {
					tempMin = 0;
				}
				
				tempMin += parseInt(temp[0]); 
			}
		}else if(temp.length == 2) {
			if(!isNanEmpty(temp[0])) {
				if(tempHour == '') {
					tempHour = 0;
				}
				
				tempHour += parseInt(temp[0]); 
			}
			
			if(!isNanEmpty(temp[1])) {
				if(tempMin == '') {
					tempMin = 0;
				}
				
				tempMin += parseInt(temp[1]); 
			}
		}
		
		if(tempHour == '' && tempMin == '') {
			workTimeVl = '';
		}else {
			if(!isNanEmpty(tempHour)) {
				if(tempMin == '') {
					tempMin = 0;
				}
				
				tempMin += tempHour * 60;
			}
			
			workTimeVl = tempMin;
		}
		
		workTimeList.push(workTimeVl);
	}
	
	if(isSeqEmpty) {
		alertPop($.i18n.t('errSeqEmpty'));
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/scenario/scenario.html',
		traditional: true,
		data: {
			title: title,
			description: desc,
			shipType: shipType,
			projEvent: projEvent,
			workTime: workTime,
			lngTotal: lngTotal,
			ln2Total: ln2Total,
			margin: margin,
			marginCurrency: marginCur,
			revenue: revenue,
			revenueCurrency: revenueCur,
			cost: cost,
			costCurrency: costCur,
			exRate: exRate,
			seqList: seqList,
			descriptionList: descList,
			colorList: colorList,
			workTimeList: workTimeList,
			lngList: lngList,
			ln2List: ln2List,
			isOptionList: isOptionList,
			optionDataList: optionList
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(json.result) {
				alertPopBack($.i18n.t('compSave'), function() {
					location.href = contextPath + '/sched/scenario/scenarioList.html';
				});
			}else{
				let code = json.code;
					
				if(code == 'EESC') {
					alertPop($.i18n.t('errExist'));
				}else {
					alertPop($.i18n.t('share:tryAgain'));
				}
			}
		},
		error: function(req, status, err) {
			alertPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}