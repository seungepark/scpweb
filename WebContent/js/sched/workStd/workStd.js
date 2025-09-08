let _addUid = 1;
let _addPageNo = 1;

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
	      	namespaces: ['share', 'workStd'],
	      	defaultNs: 'workStd'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	$('#addArea').hide();
	initData();
}

// 기존 데이터 세팅.
function initData() {
	let html = '';
	
	for(let i = 0; i < _list.length; i++) {
		let item = _list[i];
		let uid = item.uid;
		let toggleCls = 'tree-toggle-empty';
		let toggleShow = '';
		
		if(item.lv == 1) {
			toggleCls = 'tree-toggle';
			toggleShow = '<a href="#" onclick="toggleShow(' + uid + ')"><img id="row_toggle_img_' + uid + '" src="' + contextPath + '/img/new/tree_exp.png"></a>';
		}
		
		html += '<div id="row_' + uid + '" class="d-flex align-items-center tree-row">' +
					'<div class="' + toggleCls + '">' + toggleShow + '</div>' +
					'<div class="d-flex align-items-center tree-check">' + 
						'<div class="form-check form-check-inline"><input id="row_check_' + uid + '" onchange="changeRowCheck()" class="form-check-input" type="checkbox"></div>' + 
					'</div>' +
					'<div class="flex-grow-1">' + item.desc + '</div>' +
				'</div>' + 
				'<div id="row_modify_' + uid + '"></div>';
	}
	
	$('#list').html(html);
}

// 펼치기/접기.
function toggleShow(uid) {
	let isExp = true;
	let isFind = false;
	
	for(let i = 0; i < _list.length; i++) {
		if(isFind) {
			if(_list[i].lv == 2) {
				document.getElementById('row_' + _list[i].uid).className = isExp ? 'd-none' : 'd-flex align-items-center tree-row';
				_list[i].isExp = !isExp;
			}else {
				break;
			}
		}
		
		if(_list[i].uid == uid) {
			isExp = _list[i].isExp;
			_list[i].isExp = !isExp;
			isFind = true;
		}
	}
	
	document.getElementById('row_toggle_img_' + uid).src = contextPath + (isExp ? '/img/new/tree_col.png' : '/img/new/tree_exp.png');
}

// 체크 변경.
function changeRowCheck() {
	for(let i = 0; i < _list.length; i++) {
		 document.getElementById('row_' + _list[i].uid).style.backgroundColor = document.getElementById('row_check_' + _list[i].uid).checked ? '#EBEDFF' : '#FFFFFF';
	}
}

// 체크 해제.
function uncheck() {
	for(let i = 0; i < _list.length; i++) {
		document.getElementById('row_check_' + _list[i].uid).checked = false;
	}
	
	changeRowCheck();
}

// 취소.
function cancel() {
	uncheck();
	clearModify();
	clearAdd();
}

// 추가 영역 초기화.
function clearAdd() {
	$('#addList').empty();
	$('#pagination').empty();
	$('#addArea').hide();
	_addPageNo = 1;
	listScroll(0);
}

// 추가.
function add() {
	let checkCnt = 0;
	let isMultiCheck = false;
	let checkItem = '';
	
	for(let i = 0; i < _list.length; i++) {
		if(document.getElementById('row_check_' + _list[i].uid).checked) {
			checkCnt++;
			checkItem = _list[i];
		}
		
		if(checkCnt > 1) {
			isMultiCheck = true;
			break;
		}
	}
	
	if(isMultiCheck) {
		alertPop($.i18n.t('errMultiCheck'));
	}else {
		$('#addArea').show();
		
		let puid = '';
		
		if(checkItem != '') {
			puid = checkItem.lv == 1 ? checkItem.uid : checkItem.puid;
		}
		
		let colors = '';
		let color1st = '';
		let groups = '<option value="0">-</option>';

		for(let x = 0; x < _groupList.length; x++) {
			groups += '<option value="' + _groupList[x].uid + '" ' + (puid == _groupList[x].uid ? 'selected' : '') + '>' + _groupList[x].desc + '</option>';	
		}
		
		for(let x = 0; x < _colorList.length; x++) {
			let color = _colorList[x];
		
			if(x == 0) {
				color1st = color;
			}

			colors += '<option style="width: 90px; height: 20%; border: 1px solid #000000; border-radius: 4px; background-color: #' + color + ';" value="' + color + '"></option>';	
		}
		
		let uid = _addUid++;
		
		let html = '<tr id="addTr_' + uid + '"  name="addTr" class="text-center">' + 
						'<td>' + 
							'<select id="addCodeLv_' + uid + '" name="addCodeLv" onchange="addChangeCodeLv(' + uid + ')">' + 
								'<option value="1">' + $.i18n.t('codeLevel1') + '</option>' + 
								'<option value="2" selected>' + $.i18n.t('codeLevel2') + '</option>' +
							'</select>' + 
						'</td>' +
						'<td><select id="addGroup_' + uid + '" name="addGroup">' + groups + '</select></td>' +
						'<td><input name="addDesc" type="text"></td>' +
						'<td><div class="form-check form-check-inline"><input name="addIsOption" class="form-check-input" type="checkbox"></div></td>' + 
						'<td><select name="addColor" onchange="addChangeColor(this)" style="width: 90px; padding:8px; background-color: #' + color1st + ';">' + colors + '</select></td>' +
						'<td><div class="pointer" onClick="delAdd(' + uid + ')"><i class="fa-solid fa-trash-can"></i></div></td>' +
					 '</tr>';
			
		$('#addList').append(html);
		
		addPaging();
	}
}

// 추가 작업 유형 변경.
function addChangeCodeLv(uid) {
	let lv = $('#addCodeLv_' + uid).val();
	let groupId = 'addGroup_' + uid;
	
	if(lv == '1') {
		$('#' + groupId).val('0');
		document.getElementById(groupId).disabled = true;
	}else {
		document.getElementById(groupId).disabled = false;
	}
}

// 추가 색상 변경.
function addChangeColor(obj) {
	let selectedOption = obj.options[obj.selectedIndex];
	obj.style.backgroundColor = window.getComputedStyle(selectedOption).backgroundColor;
}

// 추가 항목 삭제.
function delAdd(uid) {
	$('#addTr_' + uid).remove();
	addPaging();
}

// 페이징 처리.
function addPaging() {
	let addTr = document.getElementsByName('addTr');
	
	if(isEmpty(addTr) || addTr.length == 0) {
		clearAdd();
	}else {
		if(addTr.length <= 5) {
			$('#pagination').empty();
			_addPageNo = 1;
			
			for(let i = 0; i < addTr.length; i++) {
				addTr[i].style.display = '';
			}
			
			listScroll(addTr.length);
		}else {
			let perPage = 5;
		    let total = Math.ceil(parseInt(addTr.length) / perPage);
		    let start = Math.floor((_addPageNo - 1) / perPage) * perPage + 1;
		    let end = start + perPage - 1;
		    
		    if(total <= end) {
		    	end = total;
		    }
		    
			let pagingInitNum = parseInt(start);
			let pagingEndNum = parseInt(end);
			let totalPagingCnt = parseInt(total);
			let preNo = parseInt(_addPageNo) - 1;
			let nextNo = parseInt(_addPageNo) + 1;
			let html = '';
			
			if(totalPagingCnt != 0 && totalPagingCnt != 1 && preNo != 0) {
				html += '<div onclick="showAddList(' + preNo + ');" class="pg-prev">&nbsp;</div>';
			}else {
				html += '<div class="pg-prev-inact">&nbsp;</div>';
			}
			  
			for(let k = pagingInitNum; k <= pagingEndNum; k++) {
			    if(parseInt(_addPageNo) == k) {
					html += '<div onclick="showAddList(' + k + ');" class="pg-num active">' + k + '</div>';
			    }else {
			    	html += '<div onclick="showAddList(' + k + ');" class="pg-num">' + k + '</div>';
			    }
			}
			
			if(totalPagingCnt != 0 && totalPagingCnt != 1 && nextNo <= totalPagingCnt) {
				html += '<div onclick="showAddList(' + nextNo + ');" class="pg-next">&nbsp;</div>';
			}else {
				html += '<div class="pg-next-inact">&nbsp;</div>';
			}
			
			if(totalPagingCnt == 0) {
				html = '';
			}
			
			$('#pagination').empty();
			$('#pagination').append(html);
			
			let showTrStart = perPage * (_addPageNo - 1);
			let showTrEnd = showTrStart + perPage;
			let showTrCnt = 0;

			for(let i = 0; i < addTr.length; i++) {
				if(i >= showTrStart && i < showTrEnd) {
					addTr[i].style.display = '';
					showTrCnt++;
				}else {
					addTr[i].style.display = 'none';
				}
			}
			
			listScroll(showTrCnt, true);
		}
	}
}

// 추가 영역 페이징 전환.
function showAddList(page) {
	_addPageNo = page;
	addPaging();
}

// 목록 스크롤 보정.
function listScroll(addCnt, isPage = false) {
	document.getElementById('list').classList.remove(
		'scroll-area-workStd-1', 
		'scroll-area-workStd-2', 
		'scroll-area-workStd-3', 
		'scroll-area-workStd-4', 
		'scroll-area-workStd-1-page', 
		'scroll-area-workStd-2-page', 
		'scroll-area-workStd-3-page', 
		'scroll-area-workStd-4-page', 
		'scroll-area-workStd-5', 
		'scroll-area-workStd-page', 
		'scroll-area-workStd'
	);
	
	if(isPage) {
		if(addCnt >= 5) {
			document.getElementById('list').classList.add('scroll-area-workStd-page');
		}else if(addCnt > 0) {
			document.getElementById('list').classList.add('scroll-area-workStd-' + addCnt + '-page');
		}else {
			document.getElementById('list').classList.add('scroll-area-workStd');
		}
	}else {
		if(addCnt > 5) {
			document.getElementById('list').classList.add('scroll-area-workStd-page');
		}else if(addCnt > 0) {
			document.getElementById('list').classList.add('scroll-area-workStd-' + addCnt);
		}else {
			document.getElementById('list').classList.add('scroll-area-workStd');
		}
	}
}

// 수정.
function modify() {
	clearModify();
	
	let colors = '';
	let color1st = '';
	
	for(let i = 0; i < _colorList.length; i++) {
		let color = _colorList[i];
		
		if(i == 0) {
			color1st = color;
		}
		
		colors += '<option style="width: 90px; height: 20%; border: 1px solid #000000; border-radius: 4px; background-color: #' + color + ';" value="' + color + '"></option>';	
	}
	
	let isCheck = false;
	let lastUid = 0;
	let html = '<table class="tb-style">' + 
					'<tbody>' + 
						'<tr class="text-center">' + 
							'<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.codeLevel') + '</span></div></td>' + 
							'<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.group') + '</span></div></td>' + 
							'<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.desc') + '</span></div></td>' + 
	                        '<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.isOption') + '</span></div></td>' + 
	                        '<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.color') + '</span></div></td>' + 
	                        '<td style="background-color: var(--neutral-150); border: 0px;"><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.delete') + '</span></div></td>' + 
						'</tr>';
		
	for(let i = 0; i < _list.length; i++) {
		let item = _list[i];
		let uid = item.uid;
		let lv = item.lv;
		let color = item.color;
		
		if(document.getElementById('row_check_' + uid).checked) {
			isCheck = true;
			lastUid = uid;
			let colors = '';
			let groups = '<option value="0" ' + (lv == 1 ? 'selected' : '') + '>-</option>';
	
			for(let x = 0; x < _groupList.length; x++) {
				if(lv == 1 && uid == _groupList[x].uid) {
					continue;
				}
				
				groups += '<option value="' + _groupList[x].uid + '" ' + (lv == 2 && item.puid == _groupList[x].uid ? 'selected' : '') + '>' + _groupList[x].desc + '</option>';	
			}
			
			for(let x = 0; x < _colorList.length; x++) {
				colors += '<option style="width: 90px; height: 20%; border: 1px solid #000000; border-radius: 4px; background-color: #' + _colorList[x] + ';" value="' + _colorList[x] + '" ' + (_colorList[x] == color ? 'selected' : '') + '></option>';	
			}
			
			html += '<tr id="modifyTr_' + uid + '" class="text-center" style="background-color: var(--neutral-150)">' + 
						'<td>' + 
							'<select id="modifyCodeLv_' + uid + '" name="modifyCodeLv" onchange="modifyChangeCodeLv(' + uid + ')">' + 
								'<option value="1" ' + (lv == 1 ? 'selected' : '') + '>' + $.i18n.t('codeLevel1') + '</option>' + 
								'<option value="2" ' + (lv == 2 ? 'selected' : '') + '>' + $.i18n.t('codeLevel2') + '</option>' +
							'</select>' + 
						'</td>' +
						'<td><select id="modifyGroup_' + uid + '" name="modifyGroup" ' + (lv == 1 ? 'disabled' : '') + '>' + groups + '</select></td>' +
						'<td><input id="modifyDesc_' + uid + '" name="modifyDesc" type="text" value="' + _list[i].desc + '"><input name="modifyUid" type="hidden" value="' + uid + '"></td>' +
						'<td><div class="form-check form-check-inline"><input id="modifyIsOption_' + uid + '" name="modifyIsOption" class="form-check-input" type="checkbox" ' + (item.isOption == 'Y' ? 'checked' : '') + '></div></td>' + 
						'<td><select id="modifyColor_' + uid + '" name="modifyColor" onchange="modifyChangeColor(this)" style="width: 90px; padding:8px; background-color: #' + color + ';">' + colors + '</select></td>' +
						'<td><div class="pointer" onClick="delModify(' + uid + ')"><i class="fa-solid fa-trash-can"></i></div></td>' +
					 '</tr>';
		}
	}
	
	if(isCheck) {
		html += '</tbody>' + 
			'</table>';
			
		$('#row_modify_' + lastUid).html(html);
	}else {
		alertPop($.i18n.t('errUncheck'));
	}
}

// 수정 항목 영역 초기화.
function clearModify() {
	for(let i = 0; i < _list.length; i++) {
		$('#row_modify_' +  _list[i].uid).text('');
	}
}

// 수정 작업 유형 변경.
function modifyChangeCodeLv(uid) {
	let lv = $('#modifyCodeLv_' + uid).val();
	let groupId = 'modifyGroup_' + uid;
	
	if(lv == '1') {
		$('#' + groupId).val('0');
		document.getElementById(groupId).disabled = true;
	}else {
		document.getElementById(groupId).disabled = false;
	}
}

// 수정 색상 변경.
function modifyChangeColor(obj) {
	let selectedOption = obj.options[obj.selectedIndex];
	obj.style.backgroundColor = window.getComputedStyle(selectedOption).backgroundColor;
}

// 수정 항목 삭제.
function delModify(uid) {
	let desc = document.getElementById('modifyDesc_' + uid);
	let codeLv = document.getElementById('modifyCodeLv_' + uid);
	let textDecoration = 'line-through';
	let disabledVl = true;
	let groupDisabledVl = true;
	
	if(desc.disabled) {
		textDecoration = '';
		disabledVl = false;
		
		if(codeLv.value == 2) {
			groupDisabledVl = false;
		}
	}
	
	codeLv.disabled = disabledVl;
	document.getElementById('modifyGroup_' + uid).disabled = groupDisabledVl;
	desc.style.textDecoration = textDecoration;
	desc.disabled = disabledVl;
	document.getElementById('modifyIsOption_' + uid).disabled = disabledVl;
	document.getElementById('modifyColor_' + uid).disabled = disabledVl;

//	let isCheck = false;
//	$('#modifyTr_' + uid).remove();
//	document.getElementById('row_check_' + uid).checked = false;
//	document.getElementById('row_' + uid).style.backgroundColor = '#FFFFFF';
//	
//	for(let i = 0; i < _list.length; i++) {
//		if(document.getElementById('row_check_' + _list[i].uid).checked) {
//			isCheck = true;
//		}
//	}
//	
//	if(!isCheck) {
//		clearModify();
//	}
}

// 저장.
function save() {
	let addCodeLv = document.getElementsByName('addCodeLv');
	let addGroup = document.getElementsByName('addGroup');
	let addDesc = document.getElementsByName('addDesc');
	let addIsOption = document.getElementsByName('addIsOption');
	let addColor = document.getElementsByName('addColor');
	
	let modifyUid = document.getElementsByName('modifyUid');
	let modifyCodeLv = document.getElementsByName('modifyCodeLv');
	let modifyGroup = document.getElementsByName('modifyGroup');
	let modifyDesc = document.getElementsByName('modifyDesc');
	let modifyIsOption = document.getElementsByName('modifyIsOption');
	let modifyColor = document.getElementsByName('modifyColor');
	
	let addCodeLvList = [];
	let addGroupList = [];
	let addDescList = [];
	let addIsOptionList = [];
	let addColorList = [];
	
	let modifyUidList = [];
	let modifyCodeLvList = [];
	let modifyGroupList = [];
	let modifyDescList = [];
	let modifyIsOptionList = [];
	let modifyColorList = [];
	
	let deleteUidList = [];
	
	let isErrGroup = false;

	for(let i = 0; i < addCodeLv.length; i++) {
		addCodeLvList.push(addCodeLv[i].value);
		addGroupList.push(addGroup[i].value);
		addDescList.push(addDesc[i].value);
		addIsOptionList.push(addIsOption[i].checked ? 'Y' : 'N');
		addColorList.push(addColor[i].value);
		
		if(addCodeLv[i].value == 2 && addGroup[i].value == 0) {
			isErrGroup = true;
			break;
		}
	}
	
	for(let i = 0; i < modifyUid.length; i++) {
		if(modifyDesc[i].disabled) {
			deleteUidList.push(modifyUid[i].value);
		}else {
			modifyUidList.push(modifyUid[i].value);
			modifyCodeLvList.push(modifyCodeLv[i].value);
			modifyGroupList.push(modifyGroup[i].value);
			modifyDescList.push(modifyDesc[i].value);
			modifyIsOptionList.push(modifyIsOption[i].checked ? 'Y' : 'N');
			modifyColorList.push(modifyColor[i].value);
			
			if(modifyCodeLv[i].value == 2 && modifyGroup[i].value == 0) {
				isErrGroup = true;
				break;
			}
		}
	}
	
	if(isErrGroup) {
		alertPop($.i18n.t('errSelectGroup'));
		return;
	}
	
	if(addCodeLvList.length == 0 && modifyUidList.length == 0) {
		alertPop($.i18n.t('errNothing'));
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sched/workStd/updateWorkStd.html',
		traditional: true,
		data: {
			addCodeLevelList: addCodeLvList,
			addParentUidList: addGroupList,
			addDescriptionList: addDescList,
			addIsOptionList: addIsOptionList,
			addColorList: addColorList,
			modifyUidList: modifyUidList,
			modifyCodeLevelList: modifyCodeLvList,
			modifyParentUidList: modifyGroupList,
			modifyDescriptionList: modifyDescList,
			modifyIsOptionList: modifyIsOptionList,
			modifyColorList: modifyColorList,
			deleteUidList: deleteUidList
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(json.result) {
				alertPopBack($.i18n.t('compSave'), function() {
					location.reload();
				});
			}else{
				alertPop($.i18n.t('share:tryAgain'));
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











