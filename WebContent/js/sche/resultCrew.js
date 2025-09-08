let _crewCnt = 0;
let _tbRowId = 0;

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
            namespaces: ['share', 'resultCrew'],
            defaultNs: 'resultCrew'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	initTableHeader();
	initData();
	
	$('#filterWord').keypress(function(e) {
		if(e.keyCode === 13) {
			searchList();
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

// 승선자 목록 해더 세팅.
function initTableHeader() {
	_crewCnt = 0;
	
	let text = '<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.no') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.kind') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.company') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.department') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.name') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.rank') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.idNo') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.workType1') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.workType2') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.mainSub') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.foodStyle') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.personNo') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.phone') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.inOut') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.in') + '</span></div></th>' + 
				'<th><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.out') + '</span></div></th>';
	
	$('#tbHeader').empty();
	$('#tbHeader').append(text);
	setListEmpty();
	
	$('#tbRowAllChk').click(function() {
		if($('#tbRowAllChk').is(':checked')) {
			let listChkList = document.getElementsByName('listChk');
			
			for(let i = 0; i < listChkList.length; i++) {
				if(listChkList[i].parentElement.parentElement.style.display != 'none') {
					listChkList[i].checked = true;
				}
			}
		}else {
			$('input[name=listChk]').prop('checked', false);
		}
		
		setRowSelected();
	});
}

// 기존 데이터 세팅.
function initData() {
	$('#tbRowList').empty();
	
	for(let z = 0; z < _crewList.length; z++) {
		_crewCnt++;
		let rowId = _tbRowId++;
		let kind = _crewList[z].kind;
		let company = _crewList[z].company;
		let department = _crewList[z].department;
		let name = _crewList[z].name;
		let rank = _crewList[z].rank;
		let idNo = _crewList[z].idNo;
		let workType1 = _crewList[z].workType1;
		let workType2 = _crewList[z].workType2;
		let mainSub = _crewList[z].mainSub;
		let foodStyle = _crewList[z].foodStyle;
		let personNo = _crewList[z].personNo;
		let phone = _crewList[z].phone;
		let inOutList = _crewList[z].inOutList;
		let inDate1 = '';
		let outDate1 = '';
		let inDate2 = '';
		let outDate2 = '';
		
		for(let x = 0; x < inOutList.length; x++) {
			let code1 = inOutList[x].schedulerInOut;
			let code2 = inOutList[x].performanceInOut;
			let inOutDate = inOutList[x].inOutDate;
			
			if(code1 == 'B') {
				inDate1 = inOutDate;
			}else if(code1 == 'U') {
				outDate1 = inOutDate;
			}
			
			if(code2 == 'B') {
				inDate2 = inOutDate;
			}else if(code2 == 'U') {
				outDate2 = inOutDate;
			}
		}
		
		let text = '<tr id="tbRow_' + rowId + '">' + 
						'<td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
						'<td class="text-center"><div name="no">' + _crewCnt + '</div></td>' +
						'<td class="text-center" name="kindTd">' + 
							(kind == 'SHI-A' ? 'SHI-기술지원직' : kind == 'SHI-B' ? 'SHI-생산직' : kind == 'SHI-C' ? 'SHI-협력사' : '외부') + 
						'</td>' + 
						'<td class="text-center" name="companyTd">' + company + '</td>' + 
						'<td class="text-center" name="departmentTd">' + department + '</td>' + 
						'<td class="text-center" name="nameTd">' + name + '</td>' + 
						'<td class="text-center" name="rankTd">' + rank + '</td>' + 
						'<td class="text-center" name="idNoTd">' + idNo + '</td>' + 
						'<td class="text-center" name="workType1Td">';
							
						switch(workType1) {
							case 'A' : text += '시운전'; break;
							case 'B' : text += '생산'; break;
							case 'C' : text += '설계연구소'; break;
							case 'D' : text += '지원'; break;
							case 'E' : text += '외부'; break;
						}
								
				text +='</td>' + 
						'<td class="text-center" name="workType2Td">';
						
						if(workType2 == 'A0') text += '-';
						else if(workType2 == 'A1') text += '코맨더';
						else if(workType2 == 'A2') text += '기장운전';
						else if(workType2 == 'A3') text += '선장운전';
						else if(workType2 == 'A4') text += '전장운전';
						else if(workType2 == 'A5') text += '항통';
						else if(workType2 == 'A6') text += '안벽의장';
						else if(workType2 == 'A7') text += '기타';
						else if(workType2 == 'B0') text += '-';
						else if(workType2 == 'B1') text += '기관과';
						else if(workType2 == 'B2') text += '기타';
						else if(workType2 == 'C0') text += '-';
						else if(workType2 == 'C1') text += '종합설계';
						else if(workType2 == 'C2') text += '기장설계';
						else if(workType2 == 'C3') text += '선장설계';
						else if(workType2 == 'C4') text += '전장설계';
						else if(workType2 == 'C5') text += '진동연구';
						else if(workType2 == 'C6') text += '기타';
						else if(workType2 == 'D0') text += '-';
						else if(workType2 == 'D1') text += '안전';
						else if(workType2 == 'D2') text += '캐터링';
						else if(workType2 == 'D3') text += 'QM';
						else if(workType2 == 'D4') text += 'PM';
						else if(workType2 == 'D5') text += '기타';
						else if(workType2 == 'E0') text += '-';
						else if(workType2 == 'E1') text += 'Owner';
						else if(workType2 == 'E2') text += 'Class';
						else if(workType2 == 'E3') text += 'S/E';
						else if(workType2 == 'E4') text += '선장';
						else if(workType2 == 'E5') text += '항해사';
						else if(workType2 == 'E6') text += '기관장';
						else if(workType2 == 'E7') text += '라인맨';
						else if(workType2 == 'E8') text += '기타';
							
				text +='</td>' + 
						'<td class="text-center" name="mainSubTd">' + 
							(mainSub == 'M' ? '정' : mainSub == 'S' ? '부' : '-') + 
						'</td>' + 
						'<td class="text-center" name="foodStyleTd">' + 
							(foodStyle == 'W' ? '양식' : '한식') + 
						'</td>' + 
						'<td class="text-center" name="personNoTd">' + personNo + '</td>' + 
						'<td class="text-center" name="phoneTd">' + phone + '</td>' +
						'<td class="text-center align-middle crew-inout-label p-0">' + 
							'<div class="text-nowrap d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.scheduler') + '</div>' + 
							'<div class="text-nowrap d-flex align-items-center justify-content-center px-1 inout_performance_h">' + $.i18n.t('list.performance') + '</div>' + 
						'</td>';
						
				text += '<td class="text-center align-middle p-0">' + 
							'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + inDate1 + '</div>' + 
							'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
								'<input name="inDate" class="text-center" type="text" value="' + inDate2 + '" disabled>' +
							'</div>' + 
						'</td>';		
						
				text += '<td class="text-center align-middle p-0">' + 
							'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + outDate1 + '</div>' + 
							'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
								'<input name="outDate" class="text-center" type="text" value="' + outDate2 + '" disabled>' +
							'</div>' + 
						'</td>';		
						
		text += '</tr>';
	
		$('#tbRowList').append(text);
	}
	
	setListEmpty();
}

// 목록 없음 확인.
function setListEmpty() {
	if(_crewCnt <= 0) {
		$('#tbRowList').empty();
		$("#tbRowList").append('<tr><td class="text-center" colspan="17">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 승선자 추가.
function addCrew() {
	if(isEmpty(_status) || _status == 'DEPART') {
		alertPop($.i18n.t('error.depart'));
		return;
	}
	
	if(_status == 'ARRIVE') {
		alertPop($.i18n.t('error.add'));
		return;
	}
	
	if(_crewCnt == 0) {
		$('#tbRowList').empty();
	}
	
	_crewCnt++;
	let rowId = _tbRowId++;
	
	let text = '<tr id="tbRow_' + rowId + '">' + 
					'<td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center"><div name="no">' + _crewCnt + '</div></td>' +
					'<td class="text-center">' + 
						'<select name="kind">' +
							'<option value="SHI-A">SHI-기술지원직</option>' + 
							'<option value="SHI-B">SHI-생산직</option>' + 
							'<option value="SHI-C">SHI-협력사</option>' + 
							'<option value="OUTSIDE">외부</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + '<input name="company" type="text">' + '</td>' + 
					'<td class="text-center">' + '<input name="department" type="text">' + '</td>' + 
					'<td class="text-center">' + '<input name="name" type="text">' + '</td>' + 
					'<td class="text-center">' + '<input name="rank" type="text">' + '</td>' + 
					'<td class="text-center">' + '<input name="idNo" type="text">' + '</td>' + 
					'<td class="text-center">' + 
						'<select name="workType1" onchange="setWorkType2(' + rowId + ', this.value)">' +
							'<option value="A">시운전</option>' + 
							'<option value="B">생산</option>' + 
							'<option value="C">설계연구소</option>' + 
							'<option value="D">지원</option>' + 
							'<option value="E">외부</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + 
						'<select id="workType2_' + rowId + '" name="workType2"></select>' +
					'</td>' + 
					'<td class="text-center">' + 
						'<select name="mainSub">' +
							'<option value="N">-</option>' + 
							'<option value="M">정</option>' + 
							'<option value="S">부</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + 
						'<select name="foodStyle">' +
							'<option value="K">한식</option>' + 
							'<option value="W">양식</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + '<input name="personNo" placeholder="XXXXXX-X" type="text">' + '</td>' + 
					'<td class="text-center">' + '<input name="phone" type="text">' + '</td>' +
					'<td class="text-center align-middle crew-inout-label p-0">' + 
						'<div class="text-nowrap d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.scheduler') + '</div>' + 
						'<div class="text-nowrap d-flex align-items-center justify-content-center px-1 inout_performance_h">' + $.i18n.t('list.performance') + '</div>' + 
					'</td>';
					
			text += '<td class="text-center align-middle p-0">' + 
						'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h"></div>' + 
						'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
							'<input name="inDate" class="text-center" type="text" disabled>' +
						'</div>' + 
					'</td>';		
						
			text += '<td class="text-center align-middle p-0">' + 
						'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h"></div>' + 
						'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
							'<input name="outDate" class="text-center" type="text" disabled>' +
						'</div>' + 
					'</td>';
					
	text += '</tr>';

	$('#tbRowList').append(text);
	setWorkType2(rowId, 'A');
}

// 역할2 세팅.
function setWorkType2(id, workType1) {
	let workType2Id = '#workType2_' + id;
	$(workType2Id).empty();
	
	if(workType1 == 'A') {
		$(workType2Id).append('<option value="A0">-</option>');
		$(workType2Id).append('<option value="A1">코맨더</option>');
		$(workType2Id).append('<option value="A2">기장운전</option>');
		$(workType2Id).append('<option value="A3">선장운전</option>');
		$(workType2Id).append('<option value="A4">전장운전</option>');
		$(workType2Id).append('<option value="A5">항통</option>');
		$(workType2Id).append('<option value="A6">안벽의장</option>');
		$(workType2Id).append('<option value="A7">기타</option>');
	}else if(workType1 == 'B') {
		$(workType2Id).append('<option value="B0">-</option>');
		$(workType2Id).append('<option value="B1">기관과</option>');
		$(workType2Id).append('<option value="B2">기타</option>');
	}else if(workType1 == 'C') {
		$(workType2Id).append('<option value="C0">-</option>');
		$(workType2Id).append('<option value="C1">종합설계</option>');
		$(workType2Id).append('<option value="C2">기장설계</option>');
		$(workType2Id).append('<option value="C3">선장설계</option>');
		$(workType2Id).append('<option value="C4">전장설계</option>');
		$(workType2Id).append('<option value="C5">진동연구</option>');
		$(workType2Id).append('<option value="C6">기타</option>');
	}else if(workType1 == 'D') {
		$(workType2Id).append('<option value="D0">-</option>');
		$(workType2Id).append('<option value="D1">안전</option>');
		$(workType2Id).append('<option value="D2">캐터링</option>');
		$(workType2Id).append('<option value="D3">QM</option>');
		$(workType2Id).append('<option value="D4">PM</option>');
		$(workType2Id).append('<option value="D5">기타</option>');
	}else if(workType1 == 'E') {
		$(workType2Id).append('<option value="E0">-</option>');
		$(workType2Id).append('<option value="E1">Owner</option>');
		$(workType2Id).append('<option value="E2">Class</option>');
		$(workType2Id).append('<option value="E3">S/E</option>');
		$(workType2Id).append('<option value="E4">선장</option>');
		$(workType2Id).append('<option value="E5">항해사</option>');
		$(workType2Id).append('<option value="E6">기관장</option>');
		$(workType2Id).append('<option value="E7">라인맨</option>');
		$(workType2Id).append('<option value="E8">기타</option>');
	}
}

// 승선자 삭제 팝업.
function popDeleteCrewModal() {
	if(isEmpty(_status) || _status == 'DEPART') {
		alertPop($.i18n.t('error.depart'));
		return;
	}
	
	if(_status == 'ARRIVE') {
		alertPop($.i18n.t('error.del'));
		return;
	}
	
	for(let i = 0; i < _crewList.length; i++) {
		$('input[name=listChk]').eq(i).prop('checked', false);
	}
	
	setRowSelected();
		
	if($('input[name=listChk]:checked').length > 0) {
		$('#delModal').modal();
	}else {
		alertPop($.i18n.t('delPop.selectMsg'));
	}
}

// 승선자 삭제.
function deleteCrew() {
	$('input[name=listChk]:checked').each(function(k, kVal) {
		let tr = kVal.parentElement.parentElement;
		$(tr).remove();
		_crewCnt--;
	});
	
	$('#delModal').modal('hide');
	resetRowNo();
	setListEmpty();
}

// 목록 No. 리셋.
function resetRowNo() {
	let noList = document.getElementsByName('no');
	
	for(let i = 0; i < noList.length; i++) {
		noList[i].innerText = i + 1;
	}
}

// 저장.
function save() {
	if(isEmpty(_status) || _status == 'DEPART') {
		alertPop($.i18n.t('error.depart'));
		return;
	}
	
	if(_status == 'ARRIVE') {
		alertPop($.i18n.t('error.save'));
		return;
	}
	
	let kind = [];
	let company = [];
	let department = [];
	let name = [];
	let rank = [];
	let idNo = [];
	let workType1 = [];
	let workType2 = [];
	let mainSub = [];
	let foodStyle = [];
	let personNo = [];
	let phone = [];
	let inDate = [];
	let outDate = [];
	let oldInDate = [];
	let oldOutDate = [];
	let uidArr = [];
	
	let kindVl = document.getElementsByName('kind');
	let companyVl = document.getElementsByName('company');
	let departmentVl = document.getElementsByName('department');
	let nameVl = document.getElementsByName('name');
	let rankVl = document.getElementsByName('rank');
	let idNoVl = document.getElementsByName('idNo');
	let workType1Vl = document.getElementsByName('workType1');
	let workType2Vl = document.getElementsByName('workType2');
	let mainSubVl = document.getElementsByName('mainSub');
	let foodStyleVl = document.getElementsByName('foodStyle');
	let personNoVl = document.getElementsByName('personNo');
	let phoneVl = document.getElementsByName('phone');
	let inDateVl = document.getElementsByName('inDate');
	let outDateVl = document.getElementsByName('outDate');
	
	let isError = false;
	
	for(let i = 0; i < kindVl.length; i++) {
		if(isEmpty(companyVl[i].value)) {
			alertPop($.i18n.t('errorRequired'));
			companyVl[i].focus();
			
			isError = true;
			break;
		}
		
		if(isEmpty(nameVl[i].value)) {
			nameVl[i].focus();
			alertPop($.i18n.t('errorRequired'));
			isError = true;
			break;
		}
		
		if(isEmpty(rankVl[i].value)) {
			rankVl[i].focus();
			alertPop($.i18n.t('errorRequired'));
			isError = true;
			break;
		}
		
		if(isEmpty(personNoVl[i].value)) {
			personNoVl[i].focus();
			alertPop($.i18n.t('errorRequired'));
			isError = true;
			break;
		}
		
		if(isEmpty(phoneVl[i].value)) {
			phoneVl[i].focus();
			alertPop($.i18n.t('errorRequired'));
			isError = true;
			break;
		}
		
		kind.push(kindVl[i].value);
		company.push(companyVl[i].value);
		department.push(departmentVl[i].value);
		name.push(nameVl[i].value);
		rank.push(rankVl[i].value);
		idNo.push(idNoVl[i].value);
		workType1.push(workType1Vl[i].value);
		workType2.push(workType2Vl[i].value);
		mainSub.push(mainSubVl[i].value);
		foodStyle.push(foodStyleVl[i].value);
		personNo.push(personNoVl[i].value);
		phone.push(phoneVl[i].value);
		inDate.push(inDateVl[i + _crewList.length].value);
		outDate.push(outDateVl[i + _crewList.length].value);
	}
	
	for(let i = 0; i < _crewList.length; i++) {
		uidArr.push(_crewList[i].uid);
		oldInDate.push(inDateVl[i].value);
		oldOutDate.push(outDateVl[i].value);
	}

	if(isError) {
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/resultCrewSave.html',
		traditional: true,
		data: {
			schedulerInfoUid: _scheUid,
			kind: kind,
			company: company,
			department: department,
			name: name,
			rank: rank,
			idNo: idNo,
			workType1: workType1,
			workType2: workType2,
			mainSub: mainSub,
			foodStyle: foodStyle,
			personNo: personNo,
			phone: phone,
			inDate: inDate,
			outDate: outDate,
			oldInDate: oldInDate,
			oldOutDate: oldOutDate,
			uidArr: uidArr
			
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					let code = json.code;
					
					if(isEmpty(code) || code == 'DEPART') {
						_status = code;
						alertPop($.i18n.t('error.depart'));
					}else if(code == 'ARRIVE') {
						_status = code;
						alertPop($.i18n.t('error.save'));
					}else if(code == 'EIO') {
						alertPop($.i18n.t('share:isOffline'));
					}else {
						alertPop($.i18n.t('share:tryAgain'));
					}
				}
			}catch(ex) {
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

// 승하선일 입력.
function setInOutDate() {
	let date = $('#ioDate').val();
	let inOut = $('#ioCheckIn').is(':checked') ? 'inDate' : 'outDate';
	
	if(isValidDate(date)) {
		$('input[name=listChk]').each(function(idx, obj) {
			if(obj.checked) {
				$('input[name=' + inOut + ']').eq(idx).val(date);
			}
		});
	}else {
		alertPop($.i18n.t('list.errInOutDate'));
	}
}

// 필터 검색.
function searchList() {
	let kind = $('#filterKind').val();
	let workType1 = $('#filterWorkType1').val();
	let workType2 = $('#filterWorkType2').val();
	let mainSub = $('#filterMainSub').val();
	let foodStyle = $('#filterFoodStyle').val();
	let word = $('#filterWord').val();
	
	let kindTxt = $('#filterKind option:checked').text();
	let workType1Txt = $('#filterWorkType1 option:checked').text();
	let workType2Txt = $('#filterWorkType2 option:checked').text();
	let mainSubTxt = $('#filterMainSub option:checked').text();
	let foodStyleTxt = $('#filterFoodStyle option:checked').text();
	
	let kindVlTd = document.getElementsByName('kindTd');
	let workType1VlTd = document.getElementsByName('workType1Td');
	let workType2VlTd = document.getElementsByName('workType2Td');
	let mainSubVlTd = document.getElementsByName('mainSubTd');
	let foodStyleVlTd = document.getElementsByName('foodStyleTd');
	
	let companyVlTd = document.getElementsByName('companyTd');
	let departmentVlTd = document.getElementsByName('departmentTd');
	let nameVlTd = document.getElementsByName('nameTd');
	let rankVlTd = document.getElementsByName('rankTd');
	let idNoVlTd = document.getElementsByName('idNoTd');
	let personNoVlTd = document.getElementsByName('personNoTd');
	let phoneVlTd = document.getElementsByName('phoneTd');
	
	let kindVl = document.getElementsByName('kind');
	let workType1Vl = document.getElementsByName('workType1');
	let workType2Vl = document.getElementsByName('workType2');
	let mainSubVl = document.getElementsByName('mainSub');
	let foodStyleVl = document.getElementsByName('foodStyle');
	
	let companyVl = document.getElementsByName('company');
	let departmentVl = document.getElementsByName('department');
	let nameVl = document.getElementsByName('name');
	let rankVl = document.getElementsByName('rank');
	let idNoVl = document.getElementsByName('idNo');
	let personNoVl = document.getElementsByName('personNo');
	let phoneVl = document.getElementsByName('phone');
	
	for(let i = 0; i < kindVlTd.length; i++) {
		let isHide = false;
		
		if(kind != 'ALL' && kindTxt != kindVlTd[i].innerText) {
			isHide = true;
		}
		
		if(workType1 != 'ALL' && workType1Txt != workType1VlTd[i].innerText) {
			isHide = true;
		}
		
		if(workType2 != 'ALL' && workType2Txt != workType2VlTd[i].innerText) {
			isHide = true;
		}
		
		if(mainSub != 'ALL' && mainSubTxt != mainSubVlTd[i].innerText) {
			isHide = true;
		}
		
		if(foodStyle != 'ALL' && foodStyleTxt != foodStyleVlTd[i].innerText) {
			isHide = true;
		}
		
		if(word.length > 0 
			&& !companyVlTd[i].innerText.includes(word) && !departmentVlTd[i].innerText.includes(word) && !nameVlTd[i].innerText.includes(word) 
			&& !rankVlTd[i].innerText.includes(word) && !idNoVlTd[i].innerText.includes(word) && !personNoVlTd[i].innerText.includes(word) && !phoneVlTd[i].innerText.includes(word)
		) {
			isHide = true;
		}
		
		if(isHide) {
			kindVlTd[i].parentElement.style.display = 'none';
		}else {
			kindVlTd[i].parentElement.style.display = '';
		}
	}
	
	for(let i = 0; i < kindVl.length; i++) {
		let isHide = false;
		
		if(kind != 'ALL' && kind != kindVl[i].value) {
			isHide = true;
		}
		
		if(workType1 != 'ALL' && workType1 != workType1Vl[i].value) {
			isHide = true;
		}
		
		if(workType2 != 'ALL' && workType2 != workType2Vl[i].value) {
			isHide = true;
		}
		
		if(mainSub != 'ALL' && mainSub != mainSubVl[i].value) {
			isHide = true;
		}
		
		if(foodStyle != 'ALL' && foodStyle != foodStyleVl[i].value) {
			isHide = true;
		}
		
		if(word.length > 0 
			&& !companyVl[i].value.includes(word) && !departmentVl[i].value.includes(word) && !nameVl[i].value.includes(word) 
			&& !rankVl[i].value.includes(word) && !idNoVl[i].value.includes(word) && !personNoVl[i].value.includes(word) && !phoneVl[i].value.includes(word)
		) {
			isHide = true;
		}
		
		if(isHide) {
			kindVl[i].parentElement.parentElement.style.display = 'none';
		}else {
			kindVl[i].parentElement.parentElement.style.display = '';
		}
	}
}

// 필터 역할2 세팅 후 필터 검색.
function setFilterWorkType2(workType1) {
	let workType2 = $('#filterWorkType2');
	workType2.empty();
	
	workType2.append('<option value="ALL">[역할 2] All</option>');
	
	if(workType1 == 'A') {
		workType2.append('<option value="A0">-</option>');
		workType2.append('<option value="A1">코맨더</option>');
		workType2.append('<option value="A2">기장운전</option>');
		workType2.append('<option value="A3">선장운전</option>');
		workType2.append('<option value="A4">전장운전</option>');
		workType2.append('<option value="A5">항통</option>');
		workType2.append('<option value="A6">안벽의장</option>');
		workType2.append('<option value="A7">기타</option>');
	}else if(workType1 == 'B') {
		workType2.append('<option value="B0">-</option>');
		workType2.append('<option value="B1">기관과</option>');
		workType2.append('<option value="B2">기타</option>');
	}else if(workType1 == 'C') {
		workType2.append('<option value="C0">-</option>');
		workType2.append('<option value="C1">종합설계</option>');
		workType2.append('<option value="C2">기장설계</option>');
		workType2.append('<option value="C3">선장설계</option>');
		workType2.append('<option value="C4">전장설계</option>');
		workType2.append('<option value="C5">진동연구</option>');
		workType2.append('<option value="C6">기타</option>');
	}else if(workType1 == 'D') {
		workType2.append('<option value="D0">-</option>');
		workType2.append('<option value="D1">안전</option>');
		workType2.append('<option value="D2">캐터링</option>');
		workType2.append('<option value="D3">QM</option>');
		workType2.append('<option value="D4">PM</option>');
		workType2.append('<option value="D5">기타</option>');
	}else if(workType1 == 'E') {
		workType2.append('<option value="E0">-</option>');
		workType2.append('<option value="E1">Owner</option>');
		workType2.append('<option value="E2">Class</option>');
		workType2.append('<option value="E3">S/E</option>');
		workType2.append('<option value="E4">선장</option>');
		workType2.append('<option value="E5">항해사</option>');
		workType2.append('<option value="E6">기관장</option>');
		workType2.append('<option value="E7">라인맨</option>');
		workType2.append('<option value="E8">기타</option>');
	}
	
	searchList();
}