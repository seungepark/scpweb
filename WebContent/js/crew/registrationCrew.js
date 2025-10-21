let _crewCnt = 0;
let _tbRowId = 0;
let listArr = [];
let listSort = "";
let listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;

$(function(){
    initI18n();
    init();

    initServerCheck();
    autocompleteOff();
	
	setSearchOption();
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
            namespaces: ['share', 'registrationCrew'],
            defaultNs: 'registrationCrew'
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
	
	$('#ship').keypress(function(e) {
		if(e.keyCode === 13) {
			getCrewList(1);
		}
	});
}

function saveSearchOption() {
    setSearchCookie('SK_PAGE', crewPageNo);

    setSearchCookie('SK_SORTNM', listSort);
    setSearchCookie('SK_SORTOD', listOrder);

    setSearchCookie('SK_SHIP', $("#ship option:selected").val());
}

function setCheckBox(input) {
    if (input.checked) {
        input.value = "Y";
    } else {
        input.value = "N";
    }
}

//검색 옵션
function setSearchOption() {
	let page = getSearchCookie('SK_PAGE');	
  	let ship = getSearchCookie('SK_SHIP');
	
	let sortNm = getSearchCookie('SK_SORTNM');
	let sortOd = getSearchCookie('SK_SORTOD');
  	
  	if(ship != '') {
  		$('#ship').val(ship).prop('selected', true);
  	}
	
	today = new Date();
	today = today.toISOString().slice(0, 10);

	if(page != '') {
		_isSetPage = true;
		crewPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

// 승선자 목록 해더 세팅.
function initTableHeader() {
	_crewCnt = 0;

	let text = '<th class="th-w-40"><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>' +
				'<th class="th-w-60"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.no') + '</span></div></th>' +				
				'<th style="display: none"><div class="tb-th-col"><span class="tb-th-content">' + "UID" + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.trialKey') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.pjt') + '</span></div></th>' +				
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.kind') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.company') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.department') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.name') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.rank') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.idNo') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.workType1') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.workType2') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.work') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.mainSub') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.foodStyle') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.personNo') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.gender') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.phone') + '</span></div></th>' + 
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.in') + '</span></div></th>' + 
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.out') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.terminal') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.laptop') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.modelNm') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.serialNo') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.foreigner') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.passportNo') + '</span></div></th>' + 
				'<th><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.orderStatus') + '</span></div></th>' + 
				//'<th><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.deleteYn') + '</span></div></th>';
				
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
		//alert("_crewList[z].orderStatus : "+_crewList[z].orderStatus);
		_crewCnt++;
		let uid = _crewList[z].uid;
		let rowId = _tbRowId++;
		let kind = _crewList[z].kind;
		let trialKey = _crewList[z].trialKey;
		let pjt = _crewList[z].pjt;
		let company = _crewList[z].company;
		let department = _crewList[z].department;
		let name = _crewList[z].name;
		let rank = _crewList[z].rank;
		let idNo = _crewList[z].idNo;
		let workType1 = _crewList[z].workType1;
		let workType2 = _crewList[z].workType2;
		let work = _crewList[z].work;
		let mainSub = _crewList[z].mainSub;
		let foodStyle = _crewList[z].foodStyle;
		let personNo = _crewList[z].personNo;
		let gender = _crewList[z].gender;
		let phone = _crewList[z].phone;
		let inOutList = _crewList[z].inOutList;
		let inDate = "";
		let outDate = "";
		let terminal = _crewList[z].terminal;
		let laptop = _crewList[z].laptop;
		let modelNm = _crewList[z].modelNm;
		let serialNo = _crewList[z].serialNo;
		let foreigner = _crewList[z].foreigner;
		let passportNo = _crewList[z].passportNo;
		let orderStatus = _crewList[z].orderStatus;
		//let deleteYn = _crewList[z].deleteYn;
	
		//승선일,하선일 지정
		for(let x = 0; x < inOutList.length; x++) {
			let code = inOutList[x].schedulerInOut;
			let inOutDate = inOutList[x].inOutDate;
			
			if(code == 'B') {
				inDate = inOutDate;
			}else if(code == 'U') {
				outDate = inOutDate;
			}
		}
		let text = "";
		//alert(gender);
		if(orderStatus == 'Y'){
			text += '<tr id="tbRow_' + rowId + '">' + 
									'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()" disabled></td>' +
									'<td class="text-center th-w-60"><div name="no">' + _crewCnt + '</div></td>' +
									'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
									'<td class="text-center">' + '<input name="trialKey" type="text" value="' + trialKey + '" disabled>' + '</td>' + 
									'<td class="text-center">' + '<input name="pjt" type="text" value="' + pjt + '" disabled>' + '</td>' + 												
									'<td class="text-center">' + 
										'<select name="kind" disabled>';
										
									text += '<option value="SHI-A"' + (kind == 'SHI-A' ? ' selected' : '') + '>SHI-기술지원직</option>' + 
											'<option value="SHI-B"' + (kind == 'SHI-B' ? ' selected' : '') + '>SHI-생산직</option>' + 
											'<option value="SHI-C"' + (kind == 'SHI-C' ? ' selected' : '') + '>SHI-협력사</option>' + 
											'<option value="OUTSIDE"' + (kind == 'OUTSIDE' ? ' selected' : '') + '>외부</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + '<input name="company" type="text" disabled value="' + company + '">' + '</td>' + 
									'<td class="text-center">' + '<input name="department" type="text" disabled value="' + department + '">' + '</td>' + 
									'<td class="text-center">' + '<input name="name" type="text" disabled value="' + name + '">' + '</td>' + 
									'<td class="text-center">' + '<input name="rank" type="text" disabled value="' + rank + '">' + '</td>' + 
									
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="idNo" type="text" disabled value="' + idNo + '">' +
									  '</div>' + 
									'</td>' + 
									
									'<td class="text-center">' + 
										'<select name="workType1" disabled onchange="setWorkType2(' + rowId + ', this.value)">';
										
									text += '<option value="A"' + (workType1 == 'A' ? ' selected' : '') + '>시운전</option>' + 
											'<option value="B"' + (workType1 == 'B' ? ' selected' : '') + '>생산</option>' + 
											'<option value="C"' + (workType1 == 'C' ? ' selected' : '') + '>설계연구소</option>' + 
											'<option value="D"' + (workType1 == 'D' ? ' selected' : '') + '>지원</option>' + 
											'<option value="E"' + (workType1 == 'E' ? ' selected' : '') + '>외부</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + 
										'<select id="workType2_' + rowId + '" disabled name="workType2">';
										
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
											'<option value="E8"' + (workType2 == 'E8' ? ' selected' : '') + '>기타</option>'};
										
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + '<input name="work" type="text" disabled value="' + work + '">' + '</td>' + 
									'<td class="text-center">' + 
										'<select name="mainSub" disabled>';
										
									text += '<option value="N"' + (mainSub == 'N' ? ' selected' : '') + '>-</option>' + 
											'<option value="M"' + (mainSub == 'M' ? ' selected' : '') + '>정</option>' + 
											'<option value="S"' + (mainSub == 'S' ? ' selected' : '') + '>부</option>' ;
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + 
										'<select name="foodStyle" disabled>';
										
									text += '<option value="K"' + (foodStyle == 'K' ? ' selected' : '') + '>한식</option>' + 
											'<option value="W"' + (foodStyle == 'W' ? ' selected' : '') + '>양식(Normal Western)</option>' + 	
											'<option value="H"' + (foodStyle == 'H' ? ' selected' : '') + '>양식(Halal)</option>' + 	
											'<option value="V1"' + (foodStyle == 'V1' ? ' selected' : '') + '>양식(Veg. fruitarian)</option>' + 	
											'<option value="V2"' + (foodStyle == 'V2' ? ' selected' : '') + '>양식(Veg. vegan)</option>' + 	
											'<option value="V3"' + (foodStyle == 'V3' ? ' selected' : '') + '>양식(Veg. lacto-veg.)</option>' + 	
											'<option value="V4"' + (foodStyle == 'V4' ? ' selected' : '') + '>양식(Veg. ovo-veg.)</option>' + 	
											'<option value="V5"' + (foodStyle == 'V5' ? ' selected' : '') + '>양식(Veg. lacto-ovo-veg.)</option>' + 	
											'<option value="V6"' + (foodStyle == 'V6' ? ' selected' : '') + '>양식(Veg. pesco-veg.)</option>' + 	
											'<option value="V7"' + (foodStyle == 'V7' ? ' selected' : '') + '>양식(Veg. pollo-veg.)</option>' + 	
											'<option value="V8"' + (foodStyle == 'V8' ? ' selected' : '') + '>양식(Veg. flexitarian)</option>';
											
								text += '</select>' +
									'</td>' + 
				
									
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="personNo" type="text" disabled value="' + personNo + '" >' +
									  '</div>' + 
									'</td>' + 

									'<td class="text-center">' + 
											'<select name="gender" disabled>';
											
										text += '<option value="M"' + (gender == 'M' ? ' selected' : '') + '>남</option>' + 
												'<option value="F"' + (gender == 'F' ? ' selected' : '') + '>여</option>' ;
												
									text += '</select>' +
									'</td>' + 
									
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="phone" type="text" disabled value="' + phone + '" >' +
									  '</div>' + 
									'</td>';
									
								text += '<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="date" disabled value="' + inDate + '" >' + '</td>' + 
										'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="date" disabled value="' + outDate + '" >' + '</td>';
						
								text += '<td class="text-center">' + '<input name="terminal" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (terminal === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="laptop" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (laptop === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="modelNm" type="text" disabled value="'+ modelNm +'">' + '</td>' +
										'<td class="text-center">' + '<input name="serialNo" type="text" disabled value="'+ serialNo +'">' + '</td>' +
										'<td class="text-center">' + '<input name="foreigner" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (foreigner === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="passportNo" type="text" disabled value="'+ passportNo +'">' + '</td>' +
										'<td class="text-center">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>';
										//'<td class="text-center">' + '<input name="deleteYn" type="checkbox" onclick="setRowSelected()" value="'+ deleteYn +'">' + '</td>';
					
						text += '</tr>';	
		}
		else{
			text += '<tr id="tbRow_' + rowId + '">' + 
							'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
							'<td class="text-center th-w-60"><div name="no">' + _crewCnt + '</div></td>' +
							'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '">' + '</td>' +
							'<td class="text-center">' + '<input name="trialKey" type="text" value="' + trialKey + '" disabled>' + '</td>' + 
							'<td class="text-center">' + '<input name="pjt" type="text" value="' + pjt + '" disabled>' + '</td>' + 												
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
							
							'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
							    '<span class="mask">*****</span>' + '<input name="idNo" type="text" value="' + idNo + '">' +
							  '</div>' + 
							'</td>' + 
							
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
									'<option value="E8"' + (workType2 == 'E8' ? ' selected' : '') + '>기타</option>'};
								
						text += '</select>' +
							'</td>' + 
							'<td class="text-center">' + '<input name="work" type="text" value="' + work + '">' + '</td>' + 
							'<td class="text-center">' + 
								'<select name="mainSub">';
								
							text += '<option value="N"' + (mainSub == 'N' ? ' selected' : '') + '>-</option>' + 
									'<option value="M"' + (mainSub == 'M' ? ' selected' : '') + '>정</option>' + 
									'<option value="S"' + (mainSub == 'S' ? ' selected' : '') + '>부</option>' ;
									
						text += '</select>' +
							'</td>' + 
							'<td class="text-center">' + 
								'<select name="foodStyle">';
								
							text += '<option value="K"' + (foodStyle == 'K' ? ' selected' : '') + '>한식</option>' + 
									'<option value="W"' + (foodStyle == 'W' ? ' selected' : '') + '>양식(Normal Western)</option>' + 	
									'<option value="H"' + (foodStyle == 'H' ? ' selected' : '') + '>양식(Halal)</option>' + 	
									'<option value="V1"' + (foodStyle == 'V1' ? ' selected' : '') + '>양식(Veg. fruitarian)</option>' + 	
									'<option value="V2"' + (foodStyle == 'V2' ? ' selected' : '') + '>양식(Veg. vegan)</option>' + 	
									'<option value="V3"' + (foodStyle == 'V3' ? ' selected' : '') + '>양식(Veg. lacto-veg.)</option>' + 	
									'<option value="V4"' + (foodStyle == 'V4' ? ' selected' : '') + '>양식(Veg. ovo-veg.)</option>' + 	
									'<option value="V5"' + (foodStyle == 'V5' ? ' selected' : '') + '>양식(Veg. lacto-ovo-veg.)</option>' + 	
									'<option value="V6"' + (foodStyle == 'V6' ? ' selected' : '') + '>양식(Veg. pesco-veg.)</option>' + 	
									'<option value="V7"' + (foodStyle == 'V7' ? ' selected' : '') + '>양식(Veg. pollo-veg.)</option>' + 	
									'<option value="V8"' + (foodStyle == 'V8' ? ' selected' : '') + '>양식(Veg. flexitarian)</option>';
									
						text += '</select>' +
							'</td>' + 
		
							
							'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
							    '<span class="mask">*****</span>' + '<input name="personNo" type="text" value="' + personNo + '" >' +
							  '</div>' + 
							'</td>' + 
	
							'<td class="text-center">' + 
									'<select name="gender">';
									
								text += '<option value="M"' + (gender == 'M' ? ' selected' : '') + '>남</option>' + 
										'<option value="F"' + (gender == 'F' ? ' selected' : '') + '>여</option>' ;
										
							text += '</select>' +
							'</td>' + 
							
							'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
							    '<span class="mask">*****</span>' + '<input name="phone" type="text" value="' + phone + '" >' +
							  '</div>' + 
							'</td>';
							
						text += '<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="date" value="' + inDate + '" >' + '</td>' + 
								'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="date" value="' + outDate + '" >' + '</td>';
				
						text += '<td class="text-center">' + '<input name="terminal" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (terminal === 'Y' ? 'checked' : '') + '>' + '</td>' +
								'<td class="text-center">' + '<input name="laptop" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (laptop === 'Y' ? 'checked' : '') + '>' + '</td>' +
								'<td class="text-center">' + '<input name="modelNm" type="text" value="'+ modelNm +'">' + '</td>' +
								'<td class="text-center">' + '<input name="serialNo" type="text" value="'+ serialNo +'">' + '</td>' +
								'<td class="text-center">' + '<input name="foreigner" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (foreigner === 'Y' ? 'checked' : '') + '>' + '</td>' +
								'<td class="text-center">' + '<input name="passportNo" type="text" value="'+ passportNo +'">' + '</td>' +
								'<td class="text-center">' + '<input name="orderStatus" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>';
								//'<td class="text-center">' + '<input name="deleteYn" type="checkbox" onclick="setRowSelected()" value="'+ deleteYn +'">' + '</td>';
			
				text += '</tr>';
		}
		$('#tbRowList').append(text);
	}	
	//paging(_crewList.length, 1);
	setListEmpty();
	
}

// 목록 없음 확인.
function setListEmpty() {
	if(_crewCnt <= 0) {
		$('#tbRowList').empty();
		$("#tbRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

//전체리스트 엑셀 다운로드
function crewListDownloadAll() {
	var search = $("#search").val();
	var _cnt = 0;

	$.ajax({
		type : "GET",
		url : contextPath + "/crew/getRegistrationCrewList.html",
		dataType : "json",
		headers : {
			"content-type" : "application/json"
		},
		beforeSend : function() {
			$('#loading').css("display", "block");
		},
		complete : function() {
			$('#loading').css('display', "none");
		},
		data : {
			isAll: 'Y',
            sort: listSort,
            order: listOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '<thead>' +
							'<tr class="headings">' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.no') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.trialKey') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.pjt') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.kind') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.company') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.department') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.name') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.rank') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.idNo') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.workType1') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.workType2') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.work') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.mainSub') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.foodStyle') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.personNo') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.gender') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.phone') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.in') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.out') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.terminal') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.laptop') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.modelNm') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.serialNo') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.foreigner') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.passportNo') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.orderStatus') + '</span></div><div class="fht-cell"></div></th>' +
								'</tr>' +
						'</thead>' +
						'<tbody id="getUserList">';

			for(var i in jsonResult) {
				text += '<tr class="even pointer">';
				text += '  <td>' + _cnt++ + '</td>';
				text += '  <td>' + jsonResult[i].trialKey + '</td>';
				text += '  <td>' + jsonResult[i].pjt + '</td>';
				text += '  <td>' + jsonResult[i].kind + '</td>';
				text += '  <td>' + jsonResult[i].company + '</td>';
				text += '  <td>' + jsonResult[i].department + '</td>';
				text += '  <td>' + jsonResult[i].name + '</td>';
				text += '  <td>' + jsonResult[i].rank + '</td>';
				text += '  <td>' + jsonResult[i].idNo + '</td>';
				text += '  <td>' + jsonResult[i].workType1 + '</td>';
				text += '  <td>' + jsonResult[i].workType2 + '</td>';
				text += '  <td>' + jsonResult[i].work + '</td>';
				text += '  <td>' + jsonResult[i].mainSub + '</td>';
				text += '  <td>' + jsonResult[i].foodStyle + '</td>';
				text += '  <td>' + jsonResult[i].personNo + '</td>';
				text += '  <td>' + jsonResult[i].gender + '</td>';
				text += '  <td>' + jsonResult[i].phone + '</td>';
				text += '  <td>' + jsonResult[i].inDate + '</td>';
				text += '  <td>' + jsonResult[i].outDate + '</td>';
				text += '  <td>' + jsonResult[i].terminal + '</td>';
				text += '  <td>' + jsonResult[i].laptop + '</td>';
				text += '  <td>' + jsonResult[i].modelNm + '</td>';
				text += '  <td>' + jsonResult[i].serialNo + '</td>';
				text += '  <td>' + jsonResult[i].foreigner + '</td>';
				text += '  <td>' + jsonResult[i].passportNo + '</td>';
				text += '  <td>' + jsonResult[i].orderStatus+ '</td>';
				//text += '  <td>' + jsonResult[i].deleteYn+ '</td>';
				text += '</tr>';
			}

			text += '</tbody>';
			
			excelDownloadAll(text, 'crew_list');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}

//발주-발주, 발주자, 발주일자
function orderSave() {
	//alert(1);
	let uidArr = [];
	let sessionUserID = _crewUid;
	/*<script>
	sessionUserID = ${sessionScope.userInfo.userId};
	</script>*/
	//alert(sessionUserID);
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.del'));
		return;
	}
	if($('input[name=listChk]:checked').length > 0) {
		    // 체크된 항목 수집
		    $('input[name=listChk]:checked').each(function(index, checkbox) {
		        let tr = $(checkbox).closest('tr');
		        let uid = tr.find('input[name=uid]').val();

		        if (uid && uid != "-1") {
		            uidArr.push(uid)
		        }
		    });

		    if (uidArr.length > 0) {
		        $.ajax({
		            url: contextPath + "/crew/crewOrderUpdate.html",
		            type: "POST",
		            traditional: true, 
		            data: { 
						uidArr: uidArr,
						uuid : sessionUserID
					},
					success: function(data) {
						try {
							let json = JSON.parse(data);
						
							if(json.result) {
								getRegistrationCrewList(1);
								alertPop('선택한 승선자 발주 완료되었습니다.');
							}else{
								let code = json.code;
								//alert(code);
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
	}
	else {
		alertPop('발주할 항목을 선택해주세요.');
	}
}

//SCP 전송
function scpSave() {
	//alert(1);
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.del'));
		return;
	}
	
	if($('input[name=listChk]:checked').length > 0) {
		alertPop('전송 완료되었습니다.');
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
					'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center th-w-60"><div name="no">' + _crewCnt + '</div></td>' +
					'<td class="text-center" style="display: none">' + '<input name="uid" type="text" disabled>' + '</td>' + 
					
					'<td class="text-center">' + '<input name="trialKey" type="text" disabled>' + '</td>' + 
					'<td class="text-center">' + '<input name="pjt" type="text" disabled>' + '</td>' + 
					
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
					'<td class="text-center">' + '<input name="work" type="text">' + '</td>' + 
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
							'<option value="W">양식(Normal Western)</option>' + 
							'<option value="H">양식(Halal)</option>' + 
							'<option value="V1">양식(Veg. fruitarian)</option>' + 
							'<option value="V2">양식(Veg. vegan)</option>' + 
							'<option value="V3">양식(Veg. lacto-veg.)</option>' + 
							'<option value="V4">양식(Veg. ovo-veg.)</option>' + 
							'<option value="V5">양식(Veg. lacto-ovo-veg.)</option>' + 
							'<option value="V6">양식(Veg. pesco-veg.)</option>' + 
							'<option value="V7">양식(Veg. pollo-veg.)</option>' + 
							'<option value="V8">양식(Veg. flexitarian)</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + '<input name="personNo" placeholder="XXXXXX-X" type="text">' + '</td>' + 
					'<td class="text-center">' + 
						'<select name="gender">' +
							'<option value="M">남</option>' + 
							'<option value="F">여</option>' + 
						'</select>' +
					'</td>' + 
					'<td class="text-center">' + '<input name="phone" type="text">' + '</td>' + 
					'<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="date">' + '</td>' + 
					'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="date">' + '</td>' +
					'<td class="text-center">' + '<input name="terminal" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="laptop" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="modelNm" class="text-center" type="text">' + '</td>' +
					'<td class="text-center">' + '<input name="serialNo" class="text-center" type="text">' + '</td>' +
					'<td class="text-center">' + '<input name="foreigner" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="passportNo" class="text-center" type="text">' + '</td>' +
					'<td class="text-center">' + '<input name="orderStatus" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>';
					//'<td class="text-center">' + '<input name="deleteYn" class="text-center" type="checkbox" onclick="setRowSelected()">' + '</td>' 
					
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
// 승선자 삭제
function deleteCrew() {
    let uidArr = [];
	
    // 체크된 항목 수집
    $('input[name=listChk]:checked').each(function(index, checkbox) {
        let tr = $(checkbox).closest('tr');
        let uid = tr.find('input[name=uid]').val();

        if (uid && uid != "-1") {
            uidArr.push(uid)
        }

        tr.remove(); 
        _crewCnt--;
    });

    if (uidArr.length > 0) {
        $.ajax({
            url: contextPath + "/crew/registrationCrewRemove.html",
            type: "POST",
            traditional: true, 
            data: { uidArr: uidArr },
			success: function(data) {
				try {
					let json = JSON.parse(data);
				
					if(json.result) {
						
						alertPop($.i18n.t('선택한 승선자 정보가 삭제되었습니다.'));
					}else{
						let code = json.code;
						//alert(code);
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
	//alert("오나요");
	window.location.href = contextPath + '/crew/downCrewExcel.html';
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
	
	//업로드시 호선 번호 필수 선택
	if($('#ship').val() == "ALL") {
			alertPop($.i18n.t('errorShip'));
			isError = true;
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
	let trialKeyList = [];
	let pjtList = [];
	let kindList = [];
	let companyList = [];
	let departmentList = [];
	let nameList = [];
	let rankList = [];
	let idNoList = [];
	let workType1List = [];
	let workType2List = [];
	let workList = [];
	let mainSubList = [];
	let foodStyleList = [];
	let personNoList = [];
	let genderList = [];
	let phoneList = [];
	let inDateList = [];
	let outDateList = [];
	let terminalList = [];
	let laptopList = [];
	let modelNmList = [];
	let serialNoList = [];
	let foreignerList = [];
	let passportNoList = [];
	let orderStatusList = [];
	//let deleteYnList = [];
	
	if(json.length > 0) {
		for(let i = 0; i < json.length; i++) {
			let data = json[i];		

			let trialKey = $("#ship option:selected").val();
			let pjt = $("#ship option:selected").text();
			
			//alert(trialKey + "/" + pjt);
			
			let kind = isNull(data['구분'], '');
			let company = isNull(data['회사'], '');
			let department = isNull(data['부서'], '');
			let name = isNull(data['성명'], '');
			let rank = isNull(data['직급'], '');
			let idNo = isNull(data['사번'], '');
			let workType1 = isNull(data['역할1'], '');
			let workType2 = isNull(data['역할2'], '-');
			let work = isNull(data['업무'], '');
			let mainSub = isNull(data['정/부'], '-');
			let foodStyle = isNull(data['한식/양식'], '');
			let personNo = isNull(data['생년월일'], '');
			let gender = isNull(data['성별'], '');
			let phone = isNull(data['전화번호'], '');
			let inDate = isNull(data['승선일'], '');
			let outDate = isNull(data['하선일'], '');
			let terminal = isNull(data['터미널'], '');
			let laptop = isNull(data['노트북'], '');
			let modelNm = isNull(data['모델명'], '');
			let serialNo = isNull(data['시리얼번호'], '');
			let foreigner = isNull(data['외국인여부'], '');
			let passportNo = isNull(data['여권번호'], '');
			let orderStatus = isNull(data['발주'], '');
			//let deleteYn = isNull(data['삭제'], '');
			
			if(department == '' && name == '' && phone == '') {
				break;
			}
			
			trialKeyList.push(trialKey);
			pjtList.push(pjt);
			kindList.push(kind);
			companyList.push(company);
			departmentList.push(department);
			nameList.push(name);
			rankList.push(rank);
			idNoList.push(idNo);
			workType1List.push(workType1);
			workType2List.push(workType2);
			workList.push(work);
			mainSubList.push(mainSub);
			foodStyleList.push(foodStyle);
			personNoList.push(personNo);
			genderList.push(gender);
			phoneList.push(phone);
			inDateList.push(inDate);
			outDateList.push(outDate);
			terminalList.push(terminal);
			laptopList.push(laptop);
			modelNmList.push(modelNm);
			serialNoList.push(serialNo);
			foreignerList.push(foreigner);
			passportNoList.push(passportNo);
			orderStatusList.push(orderStatus);
			//deleteYnList.push(deleteYn);
		}
		
		if(isError) {
			alertPop(errMsg);
		}else {
			setExcelData(trialKeyList, pjtList, kindList, companyList, departmentList, nameList, rankList, idNoList, workType1List,
				 workType2List, workList, mainSubList, foodStyleList, personNoList, genderList, phoneList, inDateList, outDateList, 
				 terminalList, laptopList, modelNmList, serialNoList, foreignerList, passportNoList, orderStatusList);
		}
	}else {
		alertPop($.i18n.t('excelUp.errorListMin'));
	}
	
	setListEmpty();
}

// 양식 업로드 데이터 세팅.
function setExcelData(trialKeyList, pjtList,kindList, companyList, departmentList, nameList, rankList, idNoList, workType1List,
				 workType2List, workList, mainSubList, foodStyleList, personNoList, genderList, phoneList, inDateList, outDateList, 
				 terminalList, laptopList, modelNmList, serialNoList, foreignerList, passportNoList, orderStatusList) {
	$('#tbRowList').empty();
	_crewCnt = 0;
	
	for(let i = 0; i < kindList.length; i++) {
		_crewCnt++;
		let rowId = _tbRowId++;
		let uid = -1;
		let trialKey = trialKeyList[i];
		let project = pjtList[i];		
		let kind = kindList[i];
		let company = companyList[i];
		
		let department = departmentList[i];
		let name = nameList[i];
		let rank = rankList[i];
		let idNo = idNoList[i];
		let workType1 = workType1List[i];
		let workType2 = workType2List[i];
		//alert(workType1 + "/" + workType2);
		let work = workList[i];
		let mainSub = mainSubList[i];
		let foodStyle = foodStyleList[i];
		let personNo = personNoList[i];
		let gender = genderList[i];
		let phone = phoneList[i];
		let inDate = inDateList[i];
		let outDate = outDateList[i];		
		let terminal = terminalList[i];
		let laptop = laptopList[i];
		let modelNm = modelNmList[i];
		let serialNo = serialNoList[i];
		let foreigner = foreignerList[i];
		let passportNo = passportNoList[i];
		let orderStatus = orderStatusList[i];

		let text = '<tr id="tbRow_' + rowId + '">' + 
						'<td class="text-center"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
						'<td class="text-center"><div name="no">' + _crewCnt + '</div></td>' +
						'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '">' + '</td>' +
						'<td class="text-center">' + '<input name="trialKey" type="text" value="' + trialKey + '" disabled>' + '</td>' + 
						'<td class="text-center">' + '<input name="pjt" type="text" value="' + project + '" disabled>' + '</td>' + 
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
							
						text += '<option value="A"' + (workType1 == '시운전' ? ' selected' : '') + '>시운전</option>' + 
								'<option value="B"' + (workType1 == '생산' ? ' selected' : '') + '>생산</option>' + 
								'<option value="C"' + (workType1 == '설계연구소' ? ' selected' : '') + '>설계연구소</option>' + 
								'<option value="D"' + (workType1 == '지원' ? ' selected' : '') + '>지원</option>' + 
								'<option value="E"' + (workType1 == '외부' ? ' selected' : '') + '>외부</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + 
							'<select id="workType2_' + rowId + '" name="workType2">';
							
					if(workType1 == 'A') {
						text += '<option value="A0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="A1"' + (workType2 == '코맨더' ? ' selected' : '') + '>코맨더</option>' + 
								'<option value="A2"' + (workType2 == '기장운전' ? ' selected' : '') + '>기장운전</option>' + 
								'<option value="A3"' + (workType2 == '선장운전' ? ' selected' : '') + '>선장운전</option>' + 
								'<option value="A4"' + (workType2 == '전장운전' ? ' selected' : '') + '>전장운전</option>' + 
								'<option value="A5"' + (workType2 == '항통' ? ' selected' : '') + '>항통</option>' + 
								'<option value="A6"' + (workType2 == '안벽의장' ? ' selected' : '') + '>안벽의장</option>' + 
								'<option value="A7"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'B') {
						text += '<option value="B0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="B1"' + (workType2 == '기관과' ? ' selected' : '') + '>기관과</option>' + 
								'<option value="B2"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'C') {
						text += '<option value="C0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="C1"' + (workType2 == '종합설계' ? ' selected' : '') + '>종합설계</option>' + 
								'<option value="C2"' + (workType2 == '기장설계' ? ' selected' : '') + '>기장설계</option>' + 
								'<option value="C3"' + (workType2 == '선장설계' ? ' selected' : '') + '>선장설계</option>' + 
								'<option value="C4"' + (workType2 == '전장설계' ? ' selected' : '') + '>전장설계</option>' + 
								'<option value="C5"' + (workType2 == '진동연구' ? ' selected' : '') + '>진동연구</option>' + 
								'<option value="C6"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'D') {
						text += '<option value="D0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="D1"' + (workType2 == '안전' ? ' selected' : '') + '>안전</option>' + 
								'<option value="D2"' + (workType2 == '캐터링' ? ' selected' : '') + '>캐터링</option>' + 
								'<option value="D3"' + (workType2 == 'QM' ? ' selected' : '') + '>QM</option>' + 
								'<option value="D4"' + (workType2 == 'PM' ? ' selected' : '') + '>PM</option>' + 
								'<option value="D5"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
					}else if(workType1 == 'E') {
						text += '<option value="E0"' + (workType2 == '-' ? ' selected' : '') + '>-</option>' + 
								'<option value="E1"' + (workType2 == 'Owner' ? ' selected' : '') + '>Owner</option>' + 
								'<option value="E2"' + (workType2 == 'Class' ? ' selected' : '') + '>Class</option>' + 
								'<option value="E3"' + (workType2 == 'S/E' ? ' selected' : '') + '>S/E</option>' + 
								'<option value="E4"' + (workType2 == '선장' ? ' selected' : '') + '>선장</option>' + 
								'<option value="E5"' + (workType2 == '항해사' ? ' selected' : '') + '>항해사</option>' + 
								'<option value="E6"' + (workType2 == '기관장' ? ' selected' : '') + '>기관장</option>' + 
								'<option value="E7"' + (workType2 == '라인맨' ? ' selected' : '') + '>라인맨</option>' + 
								'<option value="E8"' + (workType2 == '기타' ? ' selected' : '') + '>기타</option>';
							};
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="work" type="text" value="' + work + '">' + '</td>' + 
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
								'<option value="W"' + (foodStyle == '양식(Normal Western)' ? ' selected' : '') + '>양식(Normal Western)</option>' + 	
								'<option value="H"' + (foodStyle == '양식(Halal)' ? ' selected' : '') + '>양식(Halal)</option>' + 	
								'<option value="V1"' + (foodStyle == '양식(Veg. fruitarian)' ? ' selected' : '') + '>양식(Veg. fruitarian)</option>' + 	
								'<option value="V2"' + (foodStyle == '양식(Veg. vegan)' ? ' selected' : '') + '>양식(Veg. vegan)</option>' + 	
								'<option value="V3"' + (foodStyle == '양식(Veg. lacto-veg.)' ? ' selected' : '') + '>양식(Veg. lacto-veg.)</option>' + 	
								'<option value="V4"' + (foodStyle == '양식(Veg. ovo-veg.)' ? ' selected' : '') + '>양식(Veg. ovo-veg.)</option>' + 	
								'<option value="V5"' + (foodStyle == '양식(Veg. lacto-ovo-veg.)' ? ' selected' : '') + '>양식(Veg. lacto-ovo-veg.)</option>' + 	
								'<option value="V6"' + (foodStyle == '양식(Veg. pesco-veg.)' ? ' selected' : '') + '>양식(Veg. pesco-veg.)</option>' + 	
								'<option value="V7"' + (foodStyle == '양식(Veg. pollo-veg.)' ? ' selected' : '') + '>양식(Veg. pollo-veg.)</option>' + 	
								'<option value="V8"' + (foodStyle == '양식(Veg. flexitarian)' ? ' selected' : '') + '>양식(Veg. flexitarian)</option>';
								
					text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="personNo" type="text" placeholder="XXXXXX-X" value="' + personNo + '">' + '</td>' + 
						'<td class="text-center">' + 
								'<select name="gender">';
								
							text += '<option value="M"' + (gender == '남' ? ' selected' : '') + '>남</option>' + 
									'<option value="F"' + (gender == '여' ? ' selected' : '') + '>여</option>' ;
									
						text += '</select>' +
						'</td>' + 
						'<td class="text-center">' + '<input name="phone" type="text" value="' + phone + '">' + '</td>';
						
					text += '<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="text" value="' + inDate + '" >' + '</td>' + 
							'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="text" value="' + outDate + '" >' + '</td>';
							
					text += '<td class="text-center">' + '<input name="terminal" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (terminal === 'Y' ? 'checked' : '') + '>' + '</td>' +
							'<td class="text-center">' + '<input name="laptop" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (laptop === 'Y' ? 'checked' : '') + '>' + '</td>' +
							'<td class="text-center">' + '<input name="modelNm" type="text" value="'+ modelNm +'">' + '</td>' +
							'<td class="text-center">' + '<input name="serialNo" type="text" value="'+ serialNo +'">' + '</td>' +
							'<td class="text-center">' + '<input name="foreigner" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (foreigner === 'Y' ? 'checked' : '') + '>' + '</td>' +
							'<td class="text-center">' + '<input name="passportNo" type="text" value="'+ passportNo +'">' + '</td>' +
							'<td class="text-center">' + '<input name="orderStatus" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>';
							//'<td class="text-center">' + '<input name="deleteYn" type="checkbox" onclick="setRowSelected()">' + '</td>';
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
	
	let uid = [];
	let kind = [];
	let trialKey = [];
	let pjt = [];
	let company = [];
	let department = [];
	let name = [];
	let rank = [];
	let idNo = [];
	let workType1 = [];
	let workType2 = [];
	let work = [];
	let mainSub = [];
	let foodStyle = [];
	let personNo = [];
	let gender = [];
	let phone = [];
	let inDate = [];
	let outDate = [];
	let terminal = [];
	let laptop = [];
	let modelNm = [];
	let serialNo = [];
	let foreigner = [];
	let passportNo = [];
	let orderStatus = [];
	//let deleteYn = [];

	//alert($('#ship').val());
	//alert(document.getElementById('ship').value);
	
	let uidVl = document.getElementsByName('uid');
	//alert(uidVl.values);
	let kindVl = document.getElementsByName('kind');
	//alert(kindVl.values);
	let trialKeyVl = document.getElementsByName('trialKey');
	let pjtVl = document.getElementsByName('pjt');
	let companyVl = document.getElementsByName('company');
	let departmentVl = document.getElementsByName('department');
	let nameVl = document.getElementsByName('name');
	let rankVl = document.getElementsByName('rank');
	let idNoVl = document.getElementsByName('idNo');
	let workType1Vl = document.getElementsByName('workType1');
	let workType2Vl = document.getElementsByName('workType2');
	let workVl = document.getElementsByName('work');
	let mainSubVl = document.getElementsByName('mainSub');
	let foodStyleVl = document.getElementsByName('foodStyle');
	let personNoVl = document.getElementsByName('personNo');
	let genderVl = document.getElementsByName('gender');
	let phoneVl = document.getElementsByName('phone');
	let inDateVl = document.getElementsByName('inDate');
	let outDateVl = document.getElementsByName('outDate');
	let terminalVl = document.getElementsByName('terminal');
	let laptopVl = document.getElementsByName('laptop');
	let modelNmVl = document.getElementsByName('modelNm');
	let serialNoVl = document.getElementsByName('serialNo');
	let foreignerVl = document.getElementsByName('foreigner');
	let passportNoVl = document.getElementsByName('passportNo');
	let orderStatusVl = document.getElementsByName('orderStatus');
	//let deleteYnVl = document.getElementsByName('deleteYn');
	
	let uidValue = "";
	
	let isError = false;
		
	if(kindVl.length < 1) {
		alertPop($.i18n.t('errorNoList'));
		isError = true;
	}

	//신규추가된 ROW가 있을경우 호선 번호 필수 선택
	for(let i = 0; i < kindVl.length; i++){
		if(isEmpty(trialKeyVl[i].value)) {
			if($('#ship').val() == "ALL") {
					alertPop($.i18n.t('errorShip'));
					isError = true;
			}
		}
	}
	
	/*alert($("#ship option:selected").val());
	alert($("#ship option:selected").text());
	alert(trialKeyVl[1].value);*/
	
	for(let i = 0; i < kindVl.length; i++) {
		uidVl[i].value = uidVl[i] && uidVl[i].value !== "" ? uidVl[i].value : -1;
			
		//
		// alert(terminalVl[i].checked);
		
		if(terminalVl[i].checked == true) 
			terminalVl[i].value = 'Y';
		else 
			terminalVl[i].value = 'N';
		
		if(laptopVl[i].checked == true) 
			laptopVl[i].value = 'Y'
		else 
			laptopVl[i].value = 'N';		
		
		if(foreignerVl[i].checked == true)
			foreignerVl[i].value = 'Y'
		else 
			foreignerVl[i].value = 'N';		
		
		if(orderStatusVl[i].checked == true) 
			orderStatusVl[i].value = 'Y'
		else 
			orderStatusVl[i].value = 'N';
		
		//alert("terminalVl[i].value"+terminalVl[i].value);
		//alert("foreignerVl[i].value"+foreignerVl[i].value);
		
		if(isEmpty(trialKeyVl[i].value)) {
			trialKeyVl[i].value = $("#ship option:selected").val();
		}
		
		if(isEmpty(pjtVl[i].value)) {
			pjtVl[i].value = $("#ship option:selected").text();
		}
		
		//alert(trialKeyVl[i].value);
		//alert(pjtVl[i].value);
				
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
		};

		//터미널
		if(terminalVl[i].value == "Y") {
			terminalVl[i].focus();
			//alert(11);
			if(laptopVl[i].value == "N") {
				alertPop("터미널 선택시 추가정보 입력 바랍니다.");	
				isError = true;
				break;
			}
			if(isEmpty(modelNmVl[i].value)) {
				alertPop("터미널 선택시 추가정보 입력 바랍니다.");	
				//alert(3);
				isError = true;
				break;
			}
			if(isEmpty(serialNoVl[i].value)) {
				alertPop("터미널 선택시 추가정보 입력 바랍니다.");	
				//alert(2);
				isError = true;
				break;
			}
		};
		
		//외국인
		if(foreignerVl[i].value == "Y") {
			foreignerVl[i].focus();
			//alert(13);
			if(isEmpty(passportNoVl[i].value)) {
				alertPop("외국인 선택시 추가정보 입력 바랍니다.");	
				//alert(1);
				isError = true;
				break;
			}
		};
		
		//alert("dhsdfsdf");
		//alert(uidVl[i].value);
		uid.push(uidVl[i].value);
		kind.push(kindVl[i].value);
		trialKey.push(trialKeyVl[i].value);
		pjt.push(pjtVl[i].value);
		company.push(companyVl[i].value);
		department.push(departmentVl[i].value);
		name.push(nameVl[i].value);
		rank.push(rankVl[i].value);
		idNo.push(idNoVl[i].value);
		workType1.push(workType1Vl[i].value);
		workType2.push(workType2Vl[i].value);
		work.push(workVl[i].value);
		mainSub.push(mainSubVl[i].value);
		foodStyle.push(foodStyleVl[i].value);
		personNo.push(personNoVl[i].value);
		gender.push(genderVl[i].value);
		phone.push(phoneVl[i].value);
		inDate.push(inDateVl[i].value);
		outDate.push(outDateVl[i].value);
		terminal.push(terminalVl[i].value);
		laptop.push(laptopVl[i].value);
		modelNm.push(modelNmVl[i].value);
		serialNo.push(serialNoVl[i].value);
		foreigner.push(foreignerVl[i].value);
		passportNo.push(passportNoVl[i].value);
		orderStatus.push(orderStatusVl[i].value);
		//deleteYn.push(deleteYnVl[i].value);
	}
	//alert(terminal.length);
	if(isError) {
		return;
	}

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/crew/registrationCrewSave.html',
		traditional: true,
		data: {
			uid: uid,
			schedulerInfoUid: -1,
			kind: kind,
			trialKey: trialKey,
			project: pjt,
			company: company,
			department: department,
			name: name,
			rank: rank,
			idNo: idNo,
			workType1: workType1,
			workType2: workType2,
			work: work,
			mainSub: mainSub,
			foodStyle: foodStyle,
			personNo: personNo,
			gender: gender,
			phone: phone,
			inDate: inDate,
			outDate: outDate,
			terminal: terminal,
			laptop: laptop,
			modelNm: modelNm,
			serialNo: serialNo,
			foreigner: foreigner,
			passportNo: passportNo,
			orderStatus: orderStatus
			//,deleteYn : deleteYn
		},
		success: function(data) {
			//alert(8);
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					alertPop($.i18n.t('compSave'));
				}else{
					let code = json.code;
					//alert(code);
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
	getRegistrationCrewList(1);
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

// 승선자 리스트 조회
function getCrewList() {
	let inDate = $('#inDate').val();
	let outDate = $('#outDate').val();
	
	if(isValidDate(inDate) && isValidDate(outDate)) {
		$('input[name=listChk]').each(function(idx, obj) {
			$('input[name=' + inDate + ']').eq(idx).val(inDate);
			$('input[name=' + outDate + ']').eq(idx).val(outDate);
		});
		//alert(inDate +'~'+outDate); //테스트
		//alert('어디1');
		getRegistrationCrewList(1);
		//alert('어디2');
	}
	else {
		//alert(inDate +'~'+outDate); //테스트
		getRegistrationCrewList(1);
		//alertPop($.i18n.t('list.errInOutDate'));
	}
}

function getRegistrationCrewList(page) {
	//alert(1);
    var ship = $("#ship option:selected").val();
    var inDate = $('#inDate').val();
    var outDate = $('#outDate').val();
	
	//alert($("#ship option:selected").val());
	
	//alert(contextPath);

	//페이지 셋팅(현재페이지 저장X)
	_isSetPage = false;
	page = 1;

    jQuery.ajax({
        type: 'GET',
        url: contextPath + '/crew/getRegistrationCrewList.html',
		
        data: {
            page: page,
            ship: ship,
            inDate: inDate,
            outDate: outDate,
            sort: listSort,
            order: listOrder
        },
        success: function(data) {
            var json = JSON.parse(data);
            var text = '';

            listArr = json.list;
			
			for(var i = 0; i < json.list.length; i++) {					
					let rowId = i+1;
					let uid = json.list[i].uid;
					let kind = json.list[i].kind;
					let trialKey = json.list[i].trialKey;
					let pjt = json.list[i].pjt;
					let company = json.list[i].company;
					let department = json.list[i].department;
					let name = json.list[i].name;
					let rank = json.list[i].rank;
					let idNo = json.list[i].idNo;
					let workType1 = json.list[i].workType1;
					let workType2 = json.list[i].workType2;
					let work = json.list[i].work;
					let mainSub = json.list[i].mainSub;
					let foodStyle = json.list[i].foodStyle;
					let personNo = json.list[i].personNo;
					let gender = json.list[i].gender;
					let phone = json.list[i].phone;
					let inOutList = json.list[i].inOutList;
					let inDate = "";
					let outDate = "";
					let terminal = json.list[i].terminal;
					let laptop = json.list[i].laptop;
					let modelNm = json.list[i].modelNm;
					let serialNo = json.list[i].serialNo;
					let foreigner = json.list[i].foreigner;
					let passportNo = json.list[i].passportNo;
					let orderStatus = json.list[i].orderStatus;
					//let deleteYn = json.list[i].deleteYn;
					
					//승선일,하선일 지정
					for(let x = 0; x < inOutList.length; x++) {
						let code = inOutList[x].schedulerInOut;
						let inOutDate = inOutList[x].inOutDate;
						
						if(code == 'B') {
							inDate = inOutDate;
						}else if(code == 'U') {
							outDate = inOutDate;
						}
					}
					//alert(terminal);
					//승선일,하선일 필터링	
					if(($('#inDate').val() != null && $('#outDate').val() != null) && ($('#inDate').val() != '' && $('#outDate').val() != '')){
						
						if(!($('#inDate').val() <= inDate && inDate <= $('#outDate').val()) &&
						   !($('#inDate').val() <= outDate && outDate <= $('#outDate').val())) {
							continue;
						}
					}
					
					if(orderStatus == 'Y'){
						text += '<tr id="tbRow_' + rowId + '">' + 
									'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
									'<td class="text-center th-w-60"><div name="no">' + rowId + '</div></td>' +
									'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '">' + '</td>' +
									'<td class="text-center">' + '<input name="trialKey" type="text" value="' + trialKey + '" disabled>' + '</td>' + 
									'<td class="text-center">' + '<input name="pjt" type="text" value="' + pjt + '" disabled>' + '</td>' + 
									'<td class="text-center">' + 
										'<select name="kind" disabled>';
										
									text += '<option value="SHI-A"' + (kind == 'SHI-A' ? ' selected' : '') + '>SHI-기술지원직</option>' + 
											'<option value="SHI-B"' + (kind == 'SHI-B' ? ' selected' : '') + '>SHI-생산직</option>' + 
											'<option value="SHI-C"' + (kind == 'SHI-C' ? ' selected' : '') + '>SHI-협력사</option>' + 
											'<option value="OUTSIDE"' + (kind == 'OUTSIDE' ? ' selected' : '') + '>외부</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + '<input name="company" type="text" value="' + company + '" disabled>' + '</td>' + 
									'<td class="text-center">' + '<input name="department" type="text" value="' + department + '" disabled>' + '</td>' + 
									'<td class="text-center">' + '<input name="name" type="text" value="' + name + '" disabled>' + '</td>' + 
									'<td class="text-center">' + '<input name="rank" type="text" value="' + rank + '" disabled>' + '</td>' + 
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="idNo" type="text" disabled value="' + idNo + '">' +
									  '</div>' + 
									'</td>' +  
									'<td class="text-center">' + 
										'<select name="workType1" disabled onchange="setWorkType2(' + rowId + ', this.value)">';
										
									text += '<option value="A"' + (workType1 == 'A' ? ' selected' : '') + '>시운전</option>' + 
											'<option value="B"' + (workType1 == 'B' ? ' selected' : '') + '>생산</option>' + 
											'<option value="C"' + (workType1 == 'C' ? ' selected' : '') + '>설계연구소</option>' + 
											'<option value="D"' + (workType1 == 'D' ? ' selected' : '') + '>지원</option>' + 
											'<option value="E"' + (workType1 == 'E' ? ' selected' : '') + '>외부</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + 
										'<select id="workType2_' + rowId + '" disabled name="workType2">';
										
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
								};
										
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + '<input name="work" type="text" value="' + work + '" disabled>' + '</td>' + 
									'<td class="text-center">' + 
										'<select name="mainSub" disabled>';
										
									text += '<option value="N"' + (mainSub == 'N' ? ' selected' : '') + '>-</option>' + 
											'<option value="M"' + (mainSub == 'M' ? ' selected' : '') + '>정</option>' + 
											'<option value="S"' + (mainSub == 'S' ? ' selected' : '') + '>부</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center">' + 
										'<select name="foodStyle" disabled>';
										
									text += '<option value="K"' + (foodStyle == 'K' ? ' selected' : '') + '>한식</option>' + 
											'<option value="W"' + (foodStyle == 'W' ? ' selected' : '') + '>양식(Normal Western)</option>' + 	
											'<option value="H"' + (foodStyle == 'H' ? ' selected' : '') + '>양식(Halal)</option>' + 	
											'<option value="V1"' + (foodStyle == 'V1' ? ' selected' : '') + '>양식(Veg. fruitarian)</option>' + 	
											'<option value="V2"' + (foodStyle == 'V2' ? ' selected' : '') + '>양식(Veg. vegan)</option>' + 	
											'<option value="V3"' + (foodStyle == 'V3' ? ' selected' : '') + '>양식(Veg. lacto-veg.)</option>' + 	
											'<option value="V4"' + (foodStyle == 'V4' ? ' selected' : '') + '>양식(Veg. ovo-veg.)</option>' + 	
											'<option value="V5"' + (foodStyle == 'V5' ? ' selected' : '') + '>양식(Veg. lacto-ovo-veg.)</option>' + 	
											'<option value="V6"' + (foodStyle == 'V6' ? ' selected' : '') + '>양식(Veg. pesco-veg.)</option>' + 	
											'<option value="V7"' + (foodStyle == 'V7' ? ' selected' : '') + '>양식(Veg. pollo-veg.)</option>' + 	
											'<option value="V8"' + (foodStyle == 'V8' ? ' selected' : '') + '>양식(Veg. flexitarian)</option>';
											
								text += '</select>' +
									'</td>' + 
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="personNo" type="text" disabled value="' + personNo + '" >' +
									  '</div>' + 
									'</td>' +  
									'<td class="text-center">' + 
											'<select name="gender" disabled>';
											
										text += '<option value="M"' + (gender == 'M' ? ' selected' : '') + '>남</option>' + 
												'<option value="F"' + (gender == 'F' ? ' selected' : '') + '>여</option>' ;
												
									text += '</select>' +
									'</td>' + 
									'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
									    '<span class="mask">*****</span>' + '<input name="phone" type="text" disabled value="' + phone + '" >' +
									  '</div>' + 
									'</td>';
									
								text += '<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="text" value="' + inDate + '"  disabled>' + '</td>' + 
										'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="text" value="' + outDate + '"  disabled>' + '</td>';
										
								text += '<td class="text-center">' + '<input name="terminal" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (terminal === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="laptop" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (laptop === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="modelNm" type="text" disabled value="'+ modelNm +'">' + '</td>' +
										'<td class="text-center">' + '<input name="serialNo" type="text" disabled value="'+ serialNo +'">' + '</td>' +
										'<td class="text-center">' + '<input name="foreigner" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (foreigner === 'Y' ? 'checked' : '') + '>' + '</td>' +
										'<td class="text-center">' + '<input name="passportNo" type="text" disabled value="'+ passportNo +'"' + '</td>' +
										'<td class="text-center">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>';
										//'<td class="text-center">' + '<input name="deleteYn" type="checkbox" onclick="setRowSelected()">' + '</td>';
						text += '</tr>';
					}
					else{
						text += '<tr id="tbRow_' + rowId + '">' + 
										'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
										'<td class="text-center th-w-60"><div name="no">' + rowId + '</div></td>' +
										'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '">' + '</td>' +
										'<td class="text-center">' + '<input name="trialKey" type="text" value="' + trialKey + '" disabled>' + '</td>' + 
										'<td class="text-center">' + '<input name="pjt" type="text" value="' + pjt + '" disabled>' + '</td>' + 
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
										'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
										    '<span class="mask">*****</span>' + '<input name="idNo" type="text" disabled value="' + idNo + '">' +
										  '</div>' + 
										'</td>' + 
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
									};
											
									text += '</select>' +
										'</td>' + 
										'<td class="text-center">' + '<input name="work" type="text" value="' + work + '">' + '</td>' + 
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
												'<option value="W"' + (foodStyle == 'W' ? ' selected' : '') + '>양식(Normal Western)</option>' + 	
												'<option value="H"' + (foodStyle == 'H' ? ' selected' : '') + '>양식(Halal)</option>' + 	
												'<option value="V1"' + (foodStyle == 'V1' ? ' selected' : '') + '>양식(Veg. fruitarian)</option>' + 	
												'<option value="V2"' + (foodStyle == 'V2' ? ' selected' : '') + '>양식(Veg. vegan)</option>' + 	
												'<option value="V3"' + (foodStyle == 'V3' ? ' selected' : '') + '>양식(Veg. lacto-veg.)</option>' + 	
												'<option value="V4"' + (foodStyle == 'V4' ? ' selected' : '') + '>양식(Veg. ovo-veg.)</option>' + 	
												'<option value="V5"' + (foodStyle == 'V5' ? ' selected' : '') + '>양식(Veg. lacto-ovo-veg.)</option>' + 	
												'<option value="V6"' + (foodStyle == 'V6' ? ' selected' : '') + '>양식(Veg. pesco-veg.)</option>' + 	
												'<option value="V7"' + (foodStyle == 'V7' ? ' selected' : '') + '>양식(Veg. pollo-veg.)</option>' + 	
												'<option value="V8"' + (foodStyle == 'V8' ? ' selected' : '') + '>양식(Veg. flexitarian)</option>';
												
									text += '</select>' +
										'</td>' + 
										'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
										    '<span class="mask">*****</span>' + '<input name="personNo" type="text" disabled value="' + personNo + '" >' +
										  '</div>' + 
										'</td>' + 
										'<td class="text-center">' + 
												'<select name="gender">';
												
											text += '<option value="M"' + (gender == 'M' ? ' selected' : '') + '>남</option>' + 
													'<option value="F"' + (gender == 'F' ? ' selected' : '') + '>여</option>' ;
													
										text += '</select>' +
										'</td>' + 
										'<td class="text-center position-relative">'+'<div class="secret-box" onmouseover="this.classList.add(\'show\')" onmouseout="this.classList.remove(\'show\')">' +
										    '<span class="mask">*****</span>' + '<input name="phone" type="text" disabled value="' + phone + '" >' +
										  '</div>' + 
										'</td>';
									text += '<td class="text-center th-w-200">' + '<input name="inDate" class="text-center" type="text" value="' + inDate + '" >' + '</td>' + 
											'<td class="text-center th-w-200">' + '<input name="outDate" class="text-center" type="text" value="' + outDate + '" >' + '</td>';
											
									text += '<td class="text-center">' + '<input name="terminal" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (terminal === 'Y' ? 'checked' : '') + '>' + '</td>' +
											'<td class="text-center">' + '<input name="laptop" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (laptop === 'Y' ? 'checked' : '') + '>' + '</td>' +
											'<td class="text-center">' + '<input name="modelNm" type="text" value="'+ modelNm +'">' + '</td>' +
											'<td class="text-center">' + '<input name="serialNo" type="text" value="'+ serialNo +'">' + '</td>' +
											'<td class="text-center">' + '<input name="foreigner" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (foreigner === 'Y' ? 'checked' : '') + '>' + '</td>' +
											'<td class="text-center">' + '<input name="passportNo" type="text" value="'+ passportNo +'"' + '</td>' +
											'<td class="text-center">' + '<input name="orderStatus" type="checkbox" value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>';
											//'<td class="text-center">' + '<input name="deleteYn" type="checkbox" onclick="setRowSelected()">' + '</td>';
						text += '</tr>';
					}
				}

            $('#tbRowList').empty();

            if(json.list.length > 0) {
                $('#tbRowList').append(text);
            }else {
                $('#tbRowList').append('<tr><td class="text-center" colspan="13">' + $.i18n.t('share:noList') + '</td></tr>');
            }

			$('[data-toggle="tooltip"]').tooltip();
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

// 필터 검색.(추가컬럼 수정필요)
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

	