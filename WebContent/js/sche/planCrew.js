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
            namespaces: ['share', 'planCrew'],
            defaultNs: 'planCrew'
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
		let inDate = '';
		let outDate = '';
		
		for(let x = 0; x < inOutList.length; x++) {
			let code = inOutList[x].schedulerInOut;
			let inOutDate = inOutList[x].inOutDate;
			
			if(code == 'B') {
				inDate = inOutDate;
			}else if(code == 'U') {
				outDate = inOutDate;
			}
		}
		
		let text = '<tr id="tbRow_' + rowId + '">' + 
						'<td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
						'<td class="text-center"><div name="no">' + _crewCnt + '</div></td>' +
						'<td class="text-center">' + 
							'<select name="kind">';
							
						text += '<option value="SHI-A"' + (kind == 'SHI-A' ? ' selected' : '') + '>SHI-기술지원직</option>' + 
								'<option value="SHI-B"' + (kind == 'SHI-B' ? ' selected' : '') + '>SHI-생산직</option>' + 
								'<option value="SHI-C"' + (kind == 'SHI-C' ? ' selected' : '') + '>SHI-협력사</option>' + 
								'<option value="OUTSIDE"' + (kind == 'OUTSIDE' ? ' selected' : '') + '>외부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="company" type="text" value="' + company + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="name" type="text" value="' + name + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="rank" type="text" value="' + rank + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="idNo" type="text" value="' + idNo + '">' + '</td>' + 
						'<td class="text-center">' + 
							'<select name="workType1" onchange="setWorkType2(' + rowId + ', this.value)">';
							
						text += '<option value="A"' + (workType1 == 'A' ? ' selected' : '') + '>시운전</option>' + 
								'<option value="B"' + (workType1 == 'B' ? ' selected' : '') + '>생산</option>' + 
								'<option value="C"' + (workType1 == 'C' ? ' selected' : '') + '>설계연구소</option>' + 
								'<option value="D"' + (workType1 == 'D' ? ' selected' : '') + '>지원</option>' + 
								'<option value="E"' + (workType1 == 'E' ? ' selected' : '') + '>외부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select id="workType2_' + rowId + '" name="workType2">';
							
					if(workType1 == 'A') {
						text += '<option value="A0"' + (workType2 == 'A0' ? ' selected' : '') + '>-</option>' + 
								'<option value="A1"' + (workType2 == 'A1' ? ' selected' : '') + '>코맨더</option>' + 
								'<option value="A2"' + (workType2 == 'A2' ? ' selected' : '') + '>기장운전</option>' + 
								'<option value="A3"' + (workType2 == 'A3' ? ' selected' : '') + '>선장운전</option>' + 
								'<option value="A4"' + (workType2 == 'A4' ? ' selected' : '') + '>전장운전</option>' + 
								'<option value="A5"' + (workType2 == 'A5' ? ' selected' : '') + '>항통</option>' + 
								'<option value="A6"' + (workType2 == 'A6' ? ' selected' : '') + '>안벽의장</option>' + 
								'<option value="A7"' + (workType2 == 'A7' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'B') {
						text += '<option value="B0"' + (workType2 == 'B0' ? ' selected' : '') + '>-</option>' + 
								'<option value="B1"' + (workType2 == 'B1' ? ' selected' : '') + '>기관과</option>' + 
								'<option value="B2"' + (workType2 == 'B2' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'C') {
						text += '<option value="C0"' + (workType2 == 'C0' ? ' selected' : '') + '>-</option>' + 
								'<option value="C1"' + (workType2 == 'C1' ? ' selected' : '') + '>종합설계</option>' + 
								'<option value="C2"' + (workType2 == 'C2' ? ' selected' : '') + '>기장설계</option>' + 
								'<option value="C3"' + (workType2 == 'C3' ? ' selected' : '') + '>선장설계</option>' + 
								'<option value="C4"' + (workType2 == 'C4' ? ' selected' : '') + '>전장설계</option>' + 
								'<option value="C5"' + (workType2 == 'C5' ? ' selected' : '') + '>진동연구</option>' + 
								'<option value="C6"' + (workType2 == 'C6' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'D') {
						text += '<option value="D0"' + (workType2 == 'D0' ? ' selected' : '') + '>-</option>' + 
								'<option value="D1"' + (workType2 == 'D1' ? ' selected' : '') + '>안전</option>' + 
								'<option value="D2"' + (workType2 == 'D2' ? ' selected' : '') + '>캐터링</option>' + 
								'<option value="D3"' + (workType2 == 'D3' ? ' selected' : '') + '>QM</option>' + 
								'<option value="D4"' + (workType2 == 'D4' ? ' selected' : '') + '>PM</option>' + 
								'<option value="D5"' + (workType2 == 'D5' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'E') {
						text += '<option value="E0"' + (workType2 == 'E0' ? ' selected' : '') + '>-</option>' + 
								'<option value="E1"' + (workType2 == 'E1' ? ' selected' : '') + '>Owner</option>' + 
								'<option value="E2"' + (workType2 == 'E2' ? ' selected' : '') + '>Class</option>' + 
								'<option value="E3"' + (workType2 == 'E3' ? ' selected' : '') + '>S/E</option>' + 
								'<option value="E4"' + (workType2 == 'E4' ? ' selected' : '') + '>선장</option>' + 
								'<option value="E5"' + (workType2 == 'E5' ? ' selected' : '') + '>항해사</option>' + 
								'<option value="E6"' + (workType2 == 'E6' ? ' selected' : '') + '>기관장</option>' + 
								'<option value="E7"' + (workType2 == 'E7' ? ' selected' : '') + '>라인맨</option>' + 
								'<option value="E8"' + (workType2 == 'E8' ? ' selected' : '') + '>기타</option>';
					}
							
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select name="mainSub">';
							
						text += '<option value="N"' + (mainSub == 'N' ? ' selected' : '') + '>-</option>' + 
								'<option value="M"' + (mainSub == 'M' ? ' selected' : '') + '>정</option>' + 
								'<option value="S"' + (mainSub == 'S' ? ' selected' : '') + '>부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select name="foodStyle">';
							
						text += '<option value="K"' + (foodStyle == 'K' ? ' selected' : '') + '>한식</option>' + 
								'<option value="W"' + (foodStyle == 'W' ? ' selected' : '') + '>양식</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="personNo" type="text" placeholder="XXXXXX-X" value="' + personNo + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="phone" type="text" value="' + phone + '">' + '</td>';
						
					text += '<td class="text-center">' + '<input name="inDate" class="text-center" type="text" value="' + inDate + '" disabled>' + '</td>' + 
							'<td class="text-center">' + '<input name="outDate" class="text-center" type="text" value="' + outDate + '" disabled>' + '</td>';
			
		text += '</tr>';
	
		$('#tbRowList').append(text);
	}
	
	setListEmpty();
}

// 목록 없음 확인.
function setListEmpty() {
	if(_crewCnt <= 0) {
		$('#tbRowList').empty();
		$("#tbRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 승선자 추가.
function addCrew() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
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
					'<td class="text-center">' + '<input name="inDate" class="text-center" type="text" disabled>' + '</td>' + 
					'<td class="text-center">' + '<input name="outDate" class="text-center" type="text" disabled>' + '</td>';
					
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
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.del'));
		return;
	}
	
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

// 양식 다운로드.
function downCrewExcel() {
	window.location.href = contextPath + '/sche/downCrewExcel.html?uid=' + _scheUid;
}

// 양식 파일 열기.
function openFileInput() {
	document.getElementById('fileInput').click();
}

// 양식 업로드.
function excelUpload(event) {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.upload'));
		return;
	}
	
	$('#loading').css('display','block');
	
	let input = event.target;
	let reader = new FileReader();
	
	reader.onload = function() {
		try {
			let fileData = reader.result;
			let json = null;
			
			// DRM 걸린 파일 인지 확인
			if(fileData.indexOf('Fasoo DRM') > -1){
				
				const formData = new FormData();
				formData.append('file', input.files[0]);
								
				$.ajax({
					type: 'POST',
					url: contextPath + '/sche/planCrewDRM.html',
					data: formData,
					contentType: false,
					processData: false,
					dataType: "json",
					success: function(response, textStatus, xhr) {
						if ("success" === textStatus) {
							makeDataList(response.list);
						}
					},
					error: function(error) {
						console.error('Error DRM file:', error);
					},
					beforeSend: function() {
						$('#loading').css("display","block");
					},
					complete: function() {
						$('#loading').css('display',"none");
					}
				});
				
			} else{
				
				let fileBinary = XLSX.read(fileData, {type: 'binary', cellDates: true, cellText: true, cellNF: false, dateNF: 'yyyy-mm-dd'});
				let sheetNameList = fileBinary.SheetNames;
				let sheet = fileBinary.Sheets[sheetNameList[0]];
				json = XLSX.utils.sheet_to_json(sheet, {raw: false, dateNF: 'yyyy-mm-dd'});
				
				makeDataList(json);
			}
			
		}catch(e) {
			alertPop($.i18n.t('share:tryAgain'));
		}
		
		input.value = '';
		$('#loading').css('display','none');
	};
	
	reader.readAsBinaryString(input.files[0]);
}

// 데이터 리스트 생성 및 데이터 세팅 호출
function makeDataList(json){
	let isError = false;
	let errMsg = '';
	let kindList = [];
	let companyList = [];
	let departmentList = [];
	let nameList = [];
	let rankList = [];
	let idNoList = [];
	let workType1List = [];
	let workType2List = [];
	let mainSubList = [];
	let foodStyleList = [];
	let personNoList = [];
	let phoneList = [];
	let inDateList = [];
	let outDateList = [];
	
	if(json.length > 0) {
		for(let i = 0; i < json.length; i++) {
			let data = json[i];
			let kind = isNull(data['구분'], '');
			let company = isNull(data['회사'], '');
			let department = isNull(data['부서'], '');
			let name = isNull(data['성명'], '');
			let rank = isNull(data['직급'], '');
			let idNo = isNull(data['사번'], '');
			let workType1 = isNull(data['역할1'], '');
			let workType2 = isNull(data['역할2'], '-');
			let mainSub = isNull(data['정/부'], '-');
			let foodStyle = isNull(data['한식/양식'], '');
			let personNo = isNull(data['생년월일'], '');
			let phone = isNull(data['전화번호'], '');
			let inDate = isNull(data['승선일'], '');
			let outDate = isNull(data['하선일'], '');
			
			if(department == '' && name == '' && phone == '') {
				break;
			}
			
			kindList.push(kind);
			companyList.push(company);
			departmentList.push(department);
			nameList.push(name);
			rankList.push(rank);
			idNoList.push(idNo);
			workType1List.push(workType1);
			workType2List.push(workType2);
			mainSubList.push(mainSub);
			foodStyleList.push(foodStyle);
			personNoList.push(personNo);
			phoneList.push(phone);
			inDateList.push(inDate);
			outDateList.push(outDate);
		}
		
		if(isError) {
			alertPop(errMsg);
		}else {
			setExcelData(kindList, companyList, departmentList, nameList, rankList, idNoList, workType1List, workType2List, mainSubList, foodStyleList, personNoList, phoneList, inDateList, outDateList);
		}
	}else {
		alertPop($.i18n.t('excelUp.errorListMin'));
	}
	
	setListEmpty();
}

// 양식 업로드 데이터 세팅.
function setExcelData(kindList, companyList, departmentList, nameList, rankList, idNoList, workType1List, workType2List, mainSubList, foodStyleList, personNoList, phoneList, inDateList, outDateList) {
	$('#tbRowList').empty();
	_crewCnt = 0;
	
	for(let i = 0; i < kindList.length; i++) {
		_crewCnt++;
		let rowId = _tbRowId++;
		let kind = kindList[i];
		let company = companyList[i];
		let department = departmentList[i];
		let name = nameList[i];
		let rank = rankList[i];
		let idNo = idNoList[i];
		let workType1 = workType1List[i];
		let workType2 = workType2List[i];
		let mainSub = mainSubList[i];
		let foodStyle = foodStyleList[i];
		let personNo = personNoList[i];
		let phone = phoneList[i];
		let inDate = inDateList[i];
		let outDate = outDateList[i];
		
		let text = '<tr id="tbRow_' + rowId + '">' + 
						'<td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
						'<td class="text-center"><div name="no">' + _crewCnt + '</div></td>' +
						'<td class="text-center">' + 
							'<select name="kind">';
							
						text += '<option value="SHI-A"' + (kind == 'SHI-기술지원직' ? ' selected' : '') + '>SHI-기술지원직</option>' + 
								'<option value="SHI-B"' + (kind == 'SHI-생산직' ? ' selected' : '') + '>SHI-생산직</option>' + 
								'<option value="SHI-C"' + (kind == 'SHI-협력사' ? ' selected' : '') + '>SHI-협력사</option>' + 
								'<option value="OUTSIDE"' + (kind == '외부' ? ' selected' : '') + '>외부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="company" type="text" value="' + company + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="name" type="text" value="' + name + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="rank" type="text" value="' + rank + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="idNo" type="text" value="' + idNo + '">' + '</td>' + 
						'<td class="text-center">' + 
							'<select name="workType1" onchange="setWorkType2(' + rowId + ', this.value)">';
							
						text += '<option value="A"' + (workType1 == '시운전' ? ' selected' : '') + '>시운전</option>' + 
								'<option value="B"' + (workType1 == '생산' ? ' selected' : '') + '>생산</option>' + 
								'<option value="C"' + (workType1 == '설계연구소' ? ' selected' : '') + '>설계연구소</option>' + 
								'<option value="D"' + (workType1 == '지원' ? ' selected' : '') + '>지원</option>' + 
								'<option value="E"' + (workType1 == '외부' ? ' selected' : '') + '>외부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select id="workType2_' + rowId + '" name="workType2">';
							
					if(workType1 == '시운전') {
						text += '<option value="A0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="A1"' + (workType2 == '코맨더' ? ' selected' : '') + '>코맨더</option>' + 
								'<option value="A2"' + (workType2 == '기장운전' ? ' selected' : '') + '>기장운전</option>' + 
								'<option value="A3"' + (workType2 == '선장운전' ? ' selected' : '') + '>선장운전</option>' + 
								'<option value="A4"' + (workType2 == '전장운전' ? ' selected' : '') + '>전장운전</option>' + 
								'<option value="A5"' + (workType2 == '항통' ? ' selected' : '') + '>항통</option>' + 
								'<option value="A6"' + (workType2 == '안벽의장' ? ' selected' : '') + '>안벽의장</option>' + 
								'<option value="A7"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == '생산') {
						text += '<option value="B0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="B1"' + (workType2 == '기관과' ? ' selected' : '') + '>기관과</option>' + 
								'<option value="B2"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == '설계연구소') {
						text += '<option value="C0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="C1"' + (workType2 == '종합설계' ? ' selected' : '') + '>종합설계</option>' + 
								'<option value="C2"' + (workType2 == '기장설계' ? ' selected' : '') + '>기장설계</option>' + 
								'<option value="C3"' + (workType2 == '선장설계' ? ' selected' : '') + '>선장설계</option>' + 
								'<option value="C4"' + (workType2 == '전장설계' ? ' selected' : '') + '>전장설계</option>' + 
								'<option value="C5"' + (workType2 == '진동연구' ? ' selected' : '') + '>진동연구</option>' + 
								'<option value="C6"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == '지원') {
						text += '<option value="D0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="D1"' + (workType2 == '안전' ? ' selected' : '') + '>안전</option>' + 
								'<option value="D2"' + (workType2 == '캐터링' ? ' selected' : '') + '>캐터링</option>' + 
								'<option value="D3"' + (workType2 == 'QM' ? ' selected' : '') + '>QM</option>' + 
								'<option value="D4"' + (workType2 == 'PM' ? ' selected' : '') + '>PM</option>' + 
								'<option value="D5"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == '외부') {
						text += '<option value="E0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="E1"' + (workType2 == 'Owner' ? ' selected' : '') + '>Owner</option>' + 
								'<option value="E2"' + (workType2 == 'Class' ? ' selected' : '') + '>Class</option>' + 
								'<option value="E3"' + (workType2 == 'S/E' ? ' selected' : '') + '>S/E</option>' + 
								'<option value="E4"' + (workType2 == '선장' ? ' selected' : '') + '>선장</option>' + 
								'<option value="E5"' + (workType2 == '항해사' ? ' selected' : '') + '>항해사</option>' + 
								'<option value="E6"' + (workType2 == '기관장' ? ' selected' : '') + '>기관장</option>' + 
								'<option value="E7"' + (workType2 == '라인맨' ? ' selected' : '') + '>라인맨</option>' + 
								'<option value="E8"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}
							
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select name="mainSub">';
							
						text += '<option value="N"' + (mainSub == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="M"' + (mainSub == '정' ? ' selected' : '') + '>정</option>' + 
								'<option value="S"' + (mainSub == '부' ? ' selected' : '') + '>부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select name="foodStyle">';
							
						text += '<option value="K"' + (foodStyle == '한식' ? ' selected' : '') + '>한식</option>' + 
								'<option value="W"' + (foodStyle == '양식' ? ' selected' : '') + '>양식</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="personNo" placeholder="XXXXXX-X" type="text" value="' + personNo + '">' + '</td>' + 
						'<td class="text-center">' + '<input name="phone" type="text" value="' + phone + '">' + '</td>';
						
				text += '<td class="text-center">' + '<input name="inDate" class="text-center" type="text" value="' + inDate + '" disabled>' + '</td>' + 
						'<td class="text-center">' + '<input name="outDate" class="text-center" type="text" value="' + outDate + '" disabled>' + '</td>';
						
		text += '</tr>';
	
		$('#tbRowList').append(text);
	}
	
	setListEmpty();
}

// 저장.
function save() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
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
	
	if(kindVl.length < 1) {
		alertPop($.i18n.t('errorNoList'));
		isError = true;
	}
	
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
		inDate.push(inDateVl[i].value);
		outDate.push(outDateVl[i].value);
	}
	
	if(isError) {
		return;
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/planCrewSave.html',
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
			outDate: outDate
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					let code = json.code;
					
					if(code == 'ONGO' || code == 'ARRIVE') {
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