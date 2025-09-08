let scheHierList = [];

// 선택용 각 lv 별 리스트 
let lv1HireList = [];
let lv2HireList = [];
let lv3HireList = [];

let curSearchCodeLv = 0;
let curSearchParentTr = null;
let scheEditTrIdx = 0;

let scheParentSearchList = [];

$(function() {
	initI18n();
	initTree();
	init();
	
	initServerCheck();
});

function initI18n() {
	let lang = initLang();

	$.i18n.init({
		lng : lang,
		fallbackLng : FALLBACK_LNG,
		fallbackOnNull : false,
		fallbackOnEmpty : false,
		useLocalStorage : false,
		ns : {
			namespaces : [ 'share', 'mngScheHier' ],
			defaultNs : 'mngScheHier'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init(){
	initDesign();
	
	$('#btnTreeViewShow').hide();
	
	// 팝업 버튼 엔터키 이벤트 설정
	$('#searchParentPopCode, #searchParentPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchParentCodeSearch(1);
		}
	});
}

function initTree() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/scheBasic/getScheduleHierarchyList.html',
		data: {},
		success: function(data) {
			let json = JSON.parse(data);
			let hireList = json.list;
			
			if(hireList.length > 0) {
				scheHierList = json.list;
				
				let html = new Array();
				
				let lv1item = new Object();
				let lv2item = new Object();
				let lv3item = new Object();
				
//				console.log(hireList);
				
				for(let i = 0; i < hireList.length; i++) {
					
					if(hireList[i].codelevel == '1') {
						if(i > 0) {
							html.push(lv1item);
						}
						
						isFirstlv2 = true;
						lv1item = new Object();
						lv1item.text = `${hireList[i].displaycode} ${hireList[i].description}`; 
						lv1item.uid = hireList[i].uid;
						lv1item.parentuid = hireList[i].parentuid;
						lv1item.displaycode = hireList[i].displaycode;
						lv1item.codelevel = hireList[i].codelevel;
						lv1item.code = hireList[i].code;
						lv1item.description = hireList[i].description;
						lv1item.color = '#212134';
						lv1item.state = new Object();
						lv1item.state.expanded = true;
						
						lv1HireList.push(hireList[i]);
					} else if(hireList[i].codelevel == '2'){
						if(!lv1item.nodes) {
							lv1item.nodes = new Array();
						}
						
						lv2item = new Object();
						lv2item.text = `${hireList[i].displaycode} ${hireList[i].description}`;
						lv2item.uid = hireList[i].uid;
						lv2item.parentuid = hireList[i].parentuid;
						lv2item.displaycode = hireList[i].displaycode;
						lv2item.codelevel = hireList[i].codelevel;
						lv2item.code = hireList[i].code;
						lv2item.description = hireList[i].description;
						lv2item.color = '#212134';
						lv2item.backColor = '#FFFFFF';
						
						lv1item.nodes.push(lv2item);
						
						lv2HireList.push(hireList[i]);
					} else if(hireList[i].codelevel == '3'){
						if(!lv2item.nodes) {
							lv2item.nodes = new Array();
						}
						
						lv3item = new Object();
						lv3item.text = `${hireList[i].displaycode} ${hireList[i].description}`;
						lv3item.uid = hireList[i].uid;
						lv3item.parentuid = hireList[i].parentuid;
						lv3item.displaycode = hireList[i].displaycode;
						lv3item.codelevel = hireList[i].codelevel;
						lv3item.code = hireList[i].code;
						lv3item.description = hireList[i].description;
						lv3item.color = '#212134';
						lv3item.backColor = '#FFFFFF';
						
						lv2item.nodes.push(lv3item);
						
						lv3HireList.push(hireList[i]);
					} else{
						if(!lv3item.nodes) {
							lv3item.nodes = new Array();
						}
						
						let lv4item = new Object();
						lv4item.text = `${hireList[i].displaycode} ${hireList[i].description}`;
						lv4item.uid = hireList[i].uid;
						lv4item.parentuid = hireList[i].parentuid;
						lv4item.displaycode = hireList[i].displaycode;
						lv4item.codelevel = hireList[i].codelevel;
						lv4item.code = hireList[i].code;
						lv4item.description = hireList[i].description;
						lv4item.color = '#212134';
						lv4item.backColor = '#FFFFFF';
						
						lv3item.nodes.push(lv4item);
					}
				}
				html.push(lv1item);
				
				
				$('#treeView').treeview({
					data: html,
					levels: 4,
					multiSelect: true,
					showCheckbox: true,
					onNodeChecked: function(event, data) {
						 $('#treeView').treeview('selectNode', [data.nodeId, { silent: true }]);
						 
					},
					onNodeUnchecked: function(event, data) {
						 $('#treeView').treeview('unselectNode', [data.nodeId, { silent: true }]);
					},
					onNodeSelected: function(event, data) {
						$('#treeView').treeview('checkNode', [data.nodeId, { silent: true }]);
					},
					onNodeUnselected: function(event, data) {
						$('#treeView').treeview('uncheckNode', [data.nodeId, { silent: true }]);
					}
				});
			}
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}

// Edit 버튼 클릭 시 Table에 데이터 추가
function editHierarchy(){
	const selList = $('#treeView').treeview('getSelected');
	if(selList.length < 1){
		alertPop($.i18n.t('selectMsg'));
	} else{
		let text = '';
		
		for(let i = 0; i < selList.length; i++){
			text += `
				<tr id="scheHireEditTr${i}">
					<td class="" > ${getCodeLevelSel(selList[i])}</td>
					<td class="" >
						<div class="inputSearchDiv">
							<input type="text" name="editParent" class="inputSearch inputSeachReadOnlyBackColor" data-parentuid="${selList[i].parentuid}" value="${getLevelCode(selList[i], (getFloatVal(selList[i].codelevel) - 1), true)}" readonly>
							<button type="button" class="btn btn-primary inputSearchBtn" onClick="popScheHierSearch(this)">
								<i class="fa fa-search"></i>
							</button
						</div>
					</td>
					<td class="text-center" ><input type="text" name="editCode" class="" data-flag="R" data-uid="${selList[i].uid}" value="${selList[i].code}"></td>
					<td class="text-center" ><input type="text" name="editDisplaycode" class="" value="${selList[i].displaycode}"></td>
					<td class=""><input type="text" name="editDesc" class="" value="${selList[i].description}"></td>
					<td class="text-center pointer" onClick="delScheduleHire(this)"><i class="fa-solid fa-trash-can"></i></td>
				</tr>`;
			
			scheEditTrIdx = i;
		}
		
		$('#scheduleHierlist').empty();
		$('#scheduleHierlist').append(text);
	
		setCodeChangeEvent('ALL');
	}
}

// Tree에서 체크된 내용 모두 제외
function uncheckAll(){
	$('#treeView').treeview('uncheckAll');
}

// Code Level Select 반환
function getCodeLevelSel(curSche){
	let selbox = '<select class="" name="editCodeLv">';
	
	for(let i = 1; i <= 4; i++){
		selbox += `<option value="${i}" ${getFloatVal(curSche.codelevel) == i ? 'Selected' : ''}>${i}</option> `;
	}
	
	selbox += '</select>';
	return selbox;
}

// 해당 코드의 각 레벨 별 코드 반환
function getLevelCode(curSche, targCodelv, isCode){
	let rtnStr = '';
	
	const curCodeLv = getFloatVal(curSche.codelevel);
	if(curCodeLv ==  targCodelv){
		rtnStr = isCode ? curSche.code : curSche.uid;
		
	} else if(curCodeLv > targCodelv){
		let curParent = getFloatVal(curSche.parentuid);
		let curUid = getFloatVal(curSche.uid);
		
		const lvCnt = curCodeLv - targCodelv;
		
		for(let i = 0; i < lvCnt; i++){
			for(let j = 0; j < scheHierList.length; j++){
				if(scheHierList[j].uid == curParent){
					rtnStr = isCode ? scheHierList[j].code : scheHierList[j].uid;
					curParent = getFloatVal(scheHierList[j].parentuid);
					break;
				}
			}
		}
	}
	
	return rtnStr;
}

// 각 라벨별 Select Box 생성
function getLevelSelect(lv, curSche, name){
	let selbox = '<select class="" name="' + name + '">';
	const code = getLevelCode(curSche, lv, true);
	const uid = getLevelCode(curSche, lv, false);
	const codeLv = getFloatVal(curSche.codelevel);
	
	if(lv == 1 && lv <= codeLv){
		for(let i = 0; i < lv1HireList.length; i++){
			selbox += '<option value="' + lv1HireList[i].code +  '">' + lv1HireList[i].code + '</option>';
		}
	} else if(lv == 2 && lv <= codeLv){
		for(let i = 0; i < lv2HireList.length; i++){
			selbox += '<option value="' + lv2HireList[i].code +  '">' + lv2HireList[i].code + '</option>';
		}
	} else if(lv == 3 && lv <= codeLv){
		for(let i = 0; i < lv3HireList.length; i++){
			selbox += '<option value="' + lv3HireList[i].code +  '">' + lv3HireList[i].code + '</option>';
		}
	}
	
	selbox  += '</select>';
	return selbox;
}

// Parent 조회 팝업 호출
function popScheHierSearch(elm){
	const codeLv = getFloatVal($(elm).closest('tr').children().find('select[name="editCodeLv"] option:selected').val());
	const code = $(elm).closest('tr').children().find('input[name="editCode"]');
	
	if(codeLv == 1){
		alertPop($.i18n.t('checkLv'));
	} else if(code.attr('data-flag') == 'D'){
		alertPop($.i18n.t('delChk'));
	} else{
		curSearchParentTr = $(elm).closest('tr');
		
		curSearchCodeLv = codeLv - 1;
		$('#search_parent_modal').modal();
		searchParentCodeSearch(1);
	}
}

// Parent 조회 팝업 검색 버튼 이벤트
function searchParentCodeSearch(page){
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/scheBasic/getScheParentSearchList.html",
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
			codelevel: curSearchCodeLv,
			displaycode: $('#searchParentPopCode').val(),
			description: $('#searchParentPopDesc').val()
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			
			scheParentSearchList = [];
			scheParentSearchList = result.list; // scheTcSearchList 배열 담기
			
			for(let i in jsonResult) {
				
				text +=`
					<tr class="cursor-pointer">
						<td class="text-center" onClick="selectParentCode(${i})">${jsonResult[i].codelevel}</td>
						<td class="text-center" onClick="selectParentCode(${i})">${jsonResult[i].code}</td>
						<td class="text-center" onClick="selectParentCode(${i})">${jsonResult[i].displaycode}</td>
						<td class="" onClick="selectParentCode(${i})">${jsonResult[i].description}</td>
					</tr>`;
			}

			$("#searchParentPopList").empty();
      
			if(jsonResult.length > 0) {
				$("#searchParentPopList").append(text);
			} else{
				$("#searchParentPopList").append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
			}
			
			paging(result.listCnt, page);

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

// Tc Num 조회 팝업 페이징 처리 
function paging(cnt, page){
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
		text += '<div onclick="searchParentCodeSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(var k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="searchParentCodeSearch(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="searchParentCodeSearch(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="searchParentCodeSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

// 상위 Code 선택
function selectParentCode(idx){
	const selParent = scheParentSearchList[idx];
	const codeLv = getFloatVal(curSearchParentTr.children().find('select[name="editCodeLv"] option:selected').val());
	
	const editParent = curSearchParentTr.children().find('input[name="editParent"]');
	const editDisplaycode = curSearchParentTr.children().find('input[name="editDisplaycode"]');
	const code = curSearchParentTr.children().find('input[name="editCode"]');
	const flag = code.attr('data-flag');
	
	editParent.val(selParent.code);
	editParent.attr('data-parentuid', selParent.uid);
	
	if(flag == 'R'){
		code.attr('data-flag', 'U');
	}
	
	if(codeLv == 2){
		if(isEmpty(code.val()) && selParent.code != 'P'){
			editDisplaycode.val(selParent.code + '-');
		} else{
			if(selParent.code == 'P'){
				editDisplaycode.val(code.val());
			} else{
				editDisplaycode.val(selParent.code + '-' + code.val());
			}
		}
	} else if(codeLv == 3){
		if(isEmpty(code.val()) && selParent.code != 'P'){
			editDisplaycode.val(selParent.displaycode + '-');
		} else{
			if(selParent.code == 'P'){
				editDisplaycode.val(displaycode.val());
			} else{
				editDisplaycode.val(selParent.displaycode + '-' + code.val());
			}
		}
	} else if(codeLv == 4){
		if(isEmpty(code.val())){
			editDisplaycode.val(selParent.displaycode + '-');
		} else{
			editDisplaycode.val(selParent.displaycode + '-' + code.val());
		}
	}
	
	$('#searchParentPopCode').val('');
	$('#searchParentPopDesc').val('');
	$('#search_parent_modal').modal('hide');
}

// 스케줄 계층 정보 수정 테이블 입력칸 이벤트 설정
function setCodeChangeEvent(selStr){
	
	if(selStr == 'ALL'){
		$('select[name="editCodeLv"], input[name="editDisplaycode"], input[name="editDesc"]').on('change', function(e){
			setFlag($(this));
		});
		
		$('input[name="editCode"]').on('change', function(e){
			setDisPlayCode($(this));
			setFlag($(this));
		});
	} else{
		$(selStr).children().find('select[name="editCodeLv"], input[name="editDisplaycode"], input[name="editDesc"]').on('change', function(e){
			setFlag($(this));
		});
		
		$(selStr + ' input[name="editCode"]').on('change', function(e){
			setDisPlayCode($(this));
			setFlag($(this));
		});
	}
}

// Flag 처리 함수 
function setFlag(elm){
	const curCode = elm.closest('tr').children().find('input[name="editCode"]');
	
	if(curCode.length > 0){
		// check box의 uid가 있는 지 확인 후 flag 처리
		if(curCode.attr('data-uid') == -1 && curCode.attr('data-flag') != 'C'){
			curCode.attr('data-flag', 'C');
		} else if(curCode.attr('data-uid') != -1 && curCode.attr('data-flag') == 'R'){
			curCode.attr('data-flag', 'U');
		}
	}
}

// DisPlayCode 변경 함수
function setDisPlayCode(elm){
	const codeLv = getFloatVal(elm.closest('tr').children().find('select[name="editCodeLv"] option:selected').val());
	const editDis = elm.closest('tr').children().find('input[name="editDisplaycode"]');
	const editPCode = elm.closest('tr').children().find('input[name="editParent"]');
	const curVal = elm.val();
	
	if(codeLv == 1 || (codeLv == 3 && editPCode.val() == 'P')){
		editDis.val(curVal);
	} else {
		if(codeLv == 2){
			editDis.val(editPCode.val() + '-' + curVal);
		} else if(codeLv == 3){
			for(let i = 0; i < lv2HireList.length; i++){
				if(lv2HireList[i].uid == editPCode.attr('data-parentuid')){
					editDis.val(lv2HireList[i].displaycode + '-' + curVal);
					break;
				}
			}
		} else if(codeLv == 4){
			for(let i = 0; i < lv3HireList.length; i++){
				if(lv3HireList[i].uid == editPCode.attr('data-parentuid')){
					editDis.val(lv3HireList[i].displaycode + '-' + curVal);
					break;
				}
			}
		}
	}
}


// 스케줄 계층 정보 수정 내용 저장
function saveSchehier(){
	let isEmpHier = false;
	const editCodeLv = $('select[name="editCodeLv"]');
	const editParent = $('input[name="editParent"]');
	const editCode = $('input[name="editCode"]');
	const editDis = $('input[name="editDisplaycode"]');
	const editDesc = $('input[name="editDesc"]');
	
	const uidList = [];
	const codeLvList = [];
	const parentuidList = [];
	const codeList = [];
	const disCodeList = [];
	
	const descList = [];
	const flagList = [];
	
	for(let i = 0; i < editCodeLv.length; i++) {
		if((isEmpty(editCodeLv.eq(i).val()) || isEmpty(editCode.eq(i).val()) || isEmpty(editDis.eq(i).val())) && editCode.eq(i).attr('data-flag') != 'D'){
			isEmpHier = true;
			break;
		} else{
			uidList.push(editCode.eq(i).attr('data-uid'));
			codeLvList.push(editCodeLv.eq(i).val());
			parentuidList.push(editParent.eq(i).attr('data-parentuid'));
			codeList.push(editCode.eq(i).val());
			disCodeList.push(editDis.eq(i).val());
			descList.push(editDesc.eq(i).val());
			flagList.push(editCode.eq(i).attr('data-flag'));
		}
	}
	
	if(isEmpHier){
		alertPop($.i18n.t('required'));
	} else{
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/scheBasic/updateScheHier.html',
			traditional: true,
			data: {
				uidList,
				codeLvList,
				parentuidList,
				codeList,
				disCodeList,
				descList,
				flagList
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/mng/scheBasic/scheHierarchy.html';
					});
				}else{
					alertPop($.i18n.t('share:tryAgain'));
				}
			},
			error: function(req, status, err) {
				alertPop($.i18n.t('share:tryAgain'));
			},
			beforeSend: function() {
				$('#loading').css("display","block");
			},
			complete: function() {
				$('#loading').css('display',"none");
			}
		});
	}
}

// 스케줄 계층 정보 수정 취소
function editCan(){
	$('#scheduleHierlist').empty();
	$('#scheduleHierlist').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
	
	uncheckAll();
}

// 스케줄 계층 정보 추가 
function addSchehier(){
	scheEditTrIdx++;
	
	if($('#scheduleHierlist').find('td').text() == $.i18n.t('share:noList')){
		$('#scheduleHierlist').empty();
		scheEditTrIdx = 0;
	}  
	
	const text = `
		<tr id="scheHireEditTr${scheEditTrIdx}">
			<td class="" > ${getCodeLevelSel({codelevel: '2'})}</td>
			<td class="" >
				<div class="inputSearchDiv">
					<input type="text" name="editParent" class="inputSearch inputSeachReadOnlyBackColor" data-parentuid="" value="" readonly>
					<button type="button" class="btn btn-primary inputSearchBtn" onClick="popScheHierSearch(this)">
						<i class="fa fa-search"></i>
					</button
				</div>
			</td>
			<td class="text-center" ><input type="text" name="editCode" class="" data-flag="C" data-uid="-1" value=""></td>
			<td class="text-center" ><input type="text" name="editDisplaycode" class="" value=""></td>
			<td class=""><input type="text" name="editDesc" class="" value=""></td>
			<td class="text-center pointer" onClick="delScheduleHire(this)"><i class="fa-solid fa-trash-can"></i></td>
		</tr>`;

	$('#scheduleHierlist').append(text);
	
	setCodeChangeEvent('#scheHireEditTr' + scheEditTrIdx);
}

// 스케줄 계층 하위 값이 있는 지 확인
function checkHasChild(editCode){
	let hasChild = false;
	const curUid = editCode.attr('data-uid');
	
	for(let i = 0; i < scheHierList.length; i++){
		if(curUid == scheHierList[i].parentuid){
			hasChild = true;
			break;
		}
	}
	
	return hasChild;
}

// 스케줄 계층 정보 삭제
function delScheduleHire(elm){
	const delTr = $(elm).parent();
	const editCode = delTr.children().find('input[name="editCode"]');
	
	if(editCode.attr('data-flag') != 'D'){
		
		if(checkHasChild(editCode)){
			alertPop($.i18n.t('errDel'));
		} else{
			editCode.attr('data-flag', 'D');
			delTr.find('input[name="editParent"]').removeClass('inputSeachReadOnlyBackColor');
			delTr.find('input[type="text"], select[name="editCodeLv"]').css('text-decoration', 'line-through');
			delTr.find('input[type="text"], input[type="date"], select[name="editCodeLv"], .inputSearchBtn').prop('disabled', true);
		}
		
	} else{
		if(getFloatVal(editCode.attr('data-uid')) > 0){
			editCode.attr('data-flag', 'R');
		} else{
			editCode.attr('data-flag', 'C');
		}
		delTr.find('input[name="editParent"]').addClass('inputSeachReadOnlyBackColor');
		delTr.find('input[type="text"], select[name="editCodeLv"]').css('text-decoration', 'none');
		delTr.find('input[type="text"], input[type="date"], select[name="editCodeLv"], .inputSearchBtn').prop('disabled', false);
	}
}

// 트리 접기/펴기.
function toggleTreeView(code) {
	if(code == 'H') {
		$('#treeViewArea').hide();
		$('#areaGap').hide();
		$('#btnTreeViewShow').show();
	}else {
		$('#btnTreeViewShow').hide();
		$('#areaGap').show();
		$('#treeViewArea').show();
	}
}