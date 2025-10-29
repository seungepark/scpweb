let _anchCnt = 0;
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
            namespaces: ['share', 'anchorageMeal'],
            defaultNs: 'anchorageMeal'
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
			getAnchMealList();
		}
	});
}

function saveSearchOption() {
    setSearchCookie('SK_PAGE', crewPageNo);

    setSearchCookie('SK_SORTNM', listSort);
    setSearchCookie('SK_SORTOD', listOrder);

    setSearchCookie('SK_SHIP', $("#ship option:selected").val());
}

//체크박스 전환
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
		anchPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
}

// 앵카링 식사신청 목록 해더 세팅.
function initTableHeader() {
	_anchCnt = 0;

	let text = '<th class="th-w-40"><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>' +
				'<th class="th-w-60"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.no') + '</span></div></th>' +				
				/*추후 숨길 항목*/
				/*'<th style="display: none"><div class="tb-th-col"><span class="tb-th-content">' + "UID" + '</span></div></th>' +*/
				'<th><div class="tb-th-col"><span class="tb-th-content">' + "UID" + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.projNo') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.kind') + '</span></div></th>' +				
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.domesticYn') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.department') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.mealDate') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.foodStyle') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + ' ' +'</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.breakfast') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lunch') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.dinner') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lateNight') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderStatus') + '</span></div></th>' +
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderDate') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderUid') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.deleteYn') + '</span></div></th>' + 
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.comment') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.inputUid') + '</span></div></th>' + 
				'<th><div class="tb-th-col-last"><span class="tb-th-content">' + $.i18n.t('list.inputDate') + '</span></div></th>';				
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

	for(let z = 0; z < _anchList.length; z++) {
		_anchCnt++;
		let uid = _anchList[z].uid;
		let rowId = _tbRowId++;
		let projNo = _anchList[z].projNo;
		let kind = _anchList[z].kind;
		let domesticYn = _anchList[z].domesticYn;
		let department = _anchList[z].department;
		let mealDate = _anchList[z].mealDate;
		//let foodStyle = _anchList[z].planList[0].planMealGubun == null ? '' : _anchList[z].planList[0].planMealGubun;
		let foodStyle = "";
		let breakfastP = "";
		let lunchP = "";
		let dinnerP = "";
		let lateNightP = "";
		let breakfastR = "";
		let lunchR = "";
		let dinnerR = "";
		let lateNightR = "";
		let planList = _anchList[z].planList;
		let resultList = _anchList[z].resultList;
		let orderStatus = _anchList[z].orderStatus;
		let orderDate = _anchList[z].orderDate;
		let orderUid = _anchList[z].orderUid;
		let deleteYn = _anchList[z].deleteYn;
		let comment = _anchList[z].comment;
		let inputUid = _anchList[z].inputUid;
		let inputDate = _anchList[z].inputDate;
		
		//alert(planList.length);
		
		//날짜
		if(!(mealDate == null || mealDate == "")){
			mealDate = mealDate.match(/\d{4}-\d{2}-\d{2}/);
		}
		
		//식사신청 수량(계획)
		for(let x = 0; x < planList.length; x++) {
			let code = planList[x].planMealTime;
			let qty = planList[x].planMealQty;
			foodStyle = planList[0].planMealGubun;
			
			//alert(code);
			if(code == '조식') {
				breakfastP = qty;
			}else if(code == '중식') {
				lunchP = qty;
			}else if(code == '석식') {
				dinnerP = qty;
			}else if(code == '야식') {
				lateNightP = qty;
			}
			
		}
		
		//식사신청 수량(실적)
		for(let x = 0; x < resultList.length; x++) {
			let code = resultList[x].resultMealTime;
			let qty = resultList[x].resultMealQty;
			foodStyle = resultList[0].resultMealGubun;
			
			//alert(code);
			if(code == '조식') {
				breakfastR = qty;
			}else if(code == '중식') {
				lunchR = qty;
			}else if(code == '석식') {
				dinnerR = qty;
			}else if(code == '야식') {
				lateNightR = qty;
			}
		}
			
		let text = "";
		text += '<tr id="tbRow_' + rowId + '">' + 
					'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center th-w-60"><div name="no">' + _anchCnt + '</div></td>' +
					'<td class="text-center">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
					'<td class="text-center">' + '<input name="projNo" type="text" value="' + projNo + '" disabled>' + '</td>' + 
					
					'<td class="text-center">' + 
						'<select name="kind">';
					text += '<option value="S"' + (kind == 'S' ? ' selected' : '') + '>직영</option>' + 
							'<option value="H"' + (kind == 'H' ? ' selected' : '') + '>협력사</option>'+
							'<option value="V"' + (kind == 'V' ? ' selected' : '') + '>방문객</option>'+
							'<option value="O"' + (kind == 'O' ? ' selected' : '') + '>Owner/Class</option>';
				text += '</select>' +
				
					'<td class="text-center">' + 
						'<select name="domesticYn">';
					text += '<option value="Y"' + (domesticYn == 'Y' ? ' selected' : '') + '>내국</option>' + 
							'<option value="N"' + (domesticYn == 'N' ? ' selected' : '') + '>외국</option>';
				text += '</select>' +
					
					'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 												
					'<td class="text-center th-w-200">' + '<input name="mealDate" class="text-center" type="date" value="' + mealDate + '" >' + '</td>'+							
					'<td class="text-center">' + 
						'<select name="foodStyle" >';
						
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
					
					'<td style = "border: 1px soild red" class="text-center  align-middle crew-inout-label p-0">' + 
						'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
						'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
					'</td>'
					 
					text += '<td class="text-center align-middle p-0" >' + 
								'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
								'<input style="width: 100px;" name="breakfastP" class="text-center" type="text" value="' + breakfastP + '" >' +
								'</div>' + 
								'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
									'<input style="width: 100px;" name="breakfastR" disabled class="text-center" type="text" value="' + breakfastR + '" >' +
								'</div>' + 
							'</td>';
					text += '<td class="text-center align-middle p-0">' + 
								'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
								'<input style="width: 100px;" name="lunchP" class="text-center" type="text" value="' + lunchP + '" >' +
								'</div>' + 
								'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
									'<input style="width: 100px;" name="lunchR" disabled class="text-center" type="text" value="' + lunchR + '" >' +
								'</div>' + 
							'</td>';

					text += '<td class="text-center align-middle p-0">' + 
								'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
								'<input style="width: 100px;" name="dinnerP" class="text-center" type="text" value="' + dinnerP + '" >' +
								'</div>' + 
								'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
									'<input style="width: 100px;" name="dinnerR" disabled class="text-center" type="text" value="' + dinnerR + '" >' +
								'</div>' + 
							'</td>';							

					text += '<td  class="text-center align-middle p-0">' + 
								'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
								'<input style="width: 100px;" name="lateNightP" class="text-center" type="text" value="' + lateNightP + '" >' +
								'</div>' + 
								'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
									'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text" value="' + lateNightR + '" >' +
								'</div>' + 
							'</td>'+						
														
					'<td class="text-center">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
					'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
					'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' ;
		text += '</tr>';	
		
		$('#tbRowList').append(text);
	}	
	//paging(_crewList.length, 1);
	setListEmpty();
}

// 목록 없음 확인.
function setListEmpty() {
	if(_anchCnt <= 0) {
		$('#tbRowList').empty();
		$("#tbRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 식사신청 리스트 조회
function getAnchMealList() {
	let projNo = $('#ship').val();
	let inDate = $('#inDate').val();
	let outDate = $('#outDate').val();
	
	if(isValidDate(inDate) && isValidDate(outDate)) {
		$('input[name=listChk]').each(function(idx, obj) {
			$('input[name=' + projNo + ']').eq(idx).val(projNo);
			$('input[name=' + inDate + ']').eq(idx).val(inDate);
			$('input[name=' + outDate + ']').eq(idx).val(outDate);
		});
		//alert(inDate +'~'+outDate); //테스트
		//alert('어디1');
		getAnchorageMealList(1);
		//alert('어디2');
	}
	else {
		//alert(inDate +'~'+outDate); //테스트
		getAnchorageMealList(1);
		//alertPop($.i18n.t('list.errInOutDate'));
	}
}

function getAnchorageMealList(page) {
    var ship = $("#ship option:selected").val();
    var inDate = $('#inDate').val();
    var outDate = $('#outDate').val();
	
	//in/out Date 하나만 입력시 메시지	
	if((outDate != '' && inDate =='')){
		alertPop($.i18n.t('종료일을 입력해주세요.'));
		return;
	}
	if((inDate != '' && outDate =='')){
		alertPop($.i18n.t('시작일을 입력해주세요.'));
		return;
	}	
		
	//페이지 셋팅(현재페이지 저장X)
	_isSetPage = false;
	page = 1;

    jQuery.ajax({
        type: 'GET',
        url: contextPath + '/crew/getAnchorageMealList.html',
		
        data: {
            page: page,
            ship: ship,
            inDate: inDate,
            outDate: outDate,
            sort: listSort,
            order: listOrder
        },
		//dataType: 'json',
        success: function(data) {
			//alert(json.list.length);
            var json = JSON.parse(data);
            var text = '';
			//alert(88);
            listArr = json.list;
			//alert(json.list.length);
			for(var i = 0; i < json.list.length; i++) {					
					let rowId = i+1;
					let uid = json.list[i].uid;
					let projNo = json.list[i].projNo;
					let kind = json.list[i].kind;
					let domesticYn = json.list[i].domesticYn;
					let department = json.list[i].department;
					let mealDate = json.list[i].mealDate;
					let foodStyle = json.list[i].foodStyle;
					let orderStatus = json.list[i].orderStatus;
					let orderDate = json.list[i].orderDate;
					let orderUid = json.list[i].orderUid;
					let deleteYn = json.list[i].deleteYn;
					let comment = json.list[i].comment;
					let planList = json.list[i].planList;
					let resultList = json.list[i].resultList;
					let inputUid = json.list[i].inputUid;
					let inputDate = json.list[i].inputDate;
					let breakfastP = "";
					let lunchP = "";
					let dinnerP = "";
					let lateNightP = "";
					let breakfastR = "";
					let lunchR = "";
					let dinnerR = "";
					let lateNightR = "";
					
					//날짜
					if(!(mealDate == null || mealDate == "")){
						mealDate = json.list[i].mealDate.match(/\d{4}-\d{2}-\d{2}/);
					}
				
					
					//식사신청 수량(계획)
					for(let x = 0; x < planList.length; x++) {
						let code = planList[x].planMealTime;
						let qty = planList[x].planMealQty;
						if(code == '조식') {
							breakfastP = qty;
						}else if(code == '중식') {
							lunchP = qty;
						}else if(code == '석식') {
							dinnerP = qty;
						}else if(code == '야식') {
							lateNightP = qty;
						}
					}		
					
					//식사신청 수량(실적)
					for(let x = 0; x < resultList.length; x++) {
						let code = resultList[x].resultMealTime;
						let qty = resultList[x].resultMealQty;
						//alert(code);
						if(code == '조식') {
							breakfastR = qty;
						}else if(code == '중식') {
							lunchR = qty;
						}else if(code == '석식') {
							dinnerR = qty;
						}else if(code == '야식') {
							lateNightR = qty;
						}
					}		
					
					//alert(mealDate);
					//alert($('#inDate').val());
					//승선일,하선일 필터링	
					if(($('#inDate').val() != null && $('#outDate').val() != null) && ($('#inDate').val() != '' && $('#outDate').val() != '')){
						alert(($('#inDate').val() <= mealDate && mealDate <= $('#outDate').val()));
						
						if(!($('#inDate').val() <= mealDate && mealDate <= $('#outDate').val())) {
							alert(1);
							continue;
						}
					}
					
					//승선일,하선일 필터링	
					/*if(($('#inDate').val() != null && $('#outDate').val() != null) && ($('#inDate').val() != '' && $('#outDate').val() != '')){
						
						if(!($('#inDate').val() <= inDate && inDate <= $('#outDate').val()) &&
						   !($('#inDate').val() <= outDate && outDate <= $('#outDate').val())) {
							continue;
						}
					}*/
					
					text += '<tr id="tbRow_' + rowId + '">' + 
								'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
								'<td class="text-center th-w-60"><div name="no">' + rowId + '</div></td>' +
								'<td class="text-center">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
								'<td class="text-center">' + '<input name="projNo" type="text" value="' + projNo + '" disabled>' + '</td>' + 
								
								'<td class="text-center">' + 
									'<select name="kind">';
								text += '<option value="S"' + (kind == 'S' ? ' selected' : '') + '>직영</option>' + 
										'<option value="H"' + (kind == 'H' ? ' selected' : '') + '>협력사</option>'+
										'<option value="V"' + (kind == 'V' ? ' selected' : '') + '>방문객</option>'+
										'<option value="O"' + (kind == 'O' ? ' selected' : '') + '>Owner/Class</option>';
							text += '</select>' +
							
								'<td class="text-center">' + 
									'<select name="domesticYn">';
								text += '<option value="Y"' + (domesticYn == 'Y' ? ' selected' : '') + '>내국</option>' + 
										'<option value="N"' + (domesticYn == 'N' ? ' selected' : '') + '>외국</option>';
							text += '</select>' +
								
								'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 												
								'<td class="text-center th-w-200">' + '<input name="mealDate" class="text-center" type="date" value="' + mealDate + '" >' + '</td>'+							
								'<td class="text-center">' + 
									'<select name="foodStyle" >';
									
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
								
								'<td style = "border: 1px soild red" class="text-center  align-middle crew-inout-label p-0">' + 
									'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
									'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
								'</td>'
								 
								text += '<td class="text-center align-middle p-0" >' + 
											'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
											'<input style="width: 100px;" name="breakfastP" class="text-center" type="text" value="' + breakfastP + '" >' +
											'</div>' + 
											'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
												'<input style="width: 100px;" name="breakfastR" disabled class="text-center" type="text" value="' + breakfastR + '" >' +
											'</div>' + 
										'</td>';
								text += '<td class="text-center align-middle p-0">' + 
											'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
											'<input style="width: 100px;" name="lunchP" class="text-center" type="text" value="' + lunchP + '" >' +
											'</div>' + 
											'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
												'<input style="width: 100px;" name="lunchR" disabled class="text-center" type="text" value="' + lunchR + '" >' +
											'</div>' + 
										'</td>';

								text += '<td class="text-center align-middle p-0">' + 
											'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
											'<input style="width: 100px;" name="dinnerP" class="text-center" type="text" value="' + dinnerP + '" >' +
											'</div>' + 
											'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
												'<input style="width: 100px;" name="dinnerR" disabled class="text-center" type="text" value="' + dinnerR + '" >' +
											'</div>' + 
										'</td>';							

								text += '<td  class="text-center align-middle p-0">' + 
											'<divclass="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
											'<input style="width: 100px;" name="lateNightP" class="text-center" type="text" value="' + lateNightP + '" >' +
											'</div>' + 
											'<div  class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
												'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text" value="' + lateNightR + '" >' +
											'</div>' + 
										'</td>'+						
																	
								'<td class="text-center">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
								'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
								'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' ;
					text += '</tr>';	
				}

            $('#tbRowList').empty();
//alert(json.list.length);
//alert(text);
            if(json.list.length > 0) {
                $('#tbRowList').append(text);
            }else {
                $('#tbRowList').append('<tr><td class="text-center" colspan="13">' + $.i18n.t('share:noList') + '</td></tr>');
            }

			$('[data-toggle="tooltip"]').tooltip();
        },
        error: function(req, status, err) {
			//alert(1);
            alertPop($.i18n.t('share:tryAgain'));
        },
        beforeSend: function() {
			//alert(2);
            $('#loading').css('display', 'block');
        },
        complete: function() {
			//alert(3);
            $('#loading').css('display', 'none');
        }
    });
}

//전체리스트 엑셀 다운로드
function anchListDownloadAll() {
	var search = $("#search").val();
	var _cnt = 0;

	$.ajax({
		type : "GET",
		url : contextPath + "/crew/getAnchorageMealList.html",
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
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.projNo') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.kind') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.domesticYn') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.department') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.mealDate') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.foodStyle') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + ' '+ '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.breakfast') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.lunch') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.dinner') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.lateNight') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.orderStatus') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.orderDate') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.orderUid') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.deleteYn') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.comment') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.inputUid') + '</span></div><div class="fht-cell"></div></th>' +
								'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.inputDate') + '</span></div><div class="fht-cell"></div></th>' +
								'</tr>' +
						'</thead>' +
						'<tbody id="getUserList">';

			for(var i in jsonResult) {
				let planList = jsonResult[i].planList;
				let resultList = jsonResult[i].resultList;
				
				let breakfastP = "";
				let lunchP = "";
				let dinnerP = "";
				let lateNightP = "";
				
				let breakfastR = "";
				let lunchR = "";
				let dinnerR = "";
				let lateNightR = "";
				
				//식사신청 수량(계획)
				for(let x = 0; x < planList.length; x++) {
					let code = planList[x].planMealTime;
					let qty = planList[x].planMealQty;
					//alert(code);
					if(code == '조식') {
						breakfastP = qty;
					}else if(code == '중식') {
						lunchP = qty;
					}else if(code == '석식') {
						dinnerP = qty;
					}else if(code == '야식') {
						lateNightP = qty;
					}
				}
				//식사신청 수량(실적)
				for(let x = 0; x < resultList.length; x++) {
					let code = resultList[x].resultMealTime;
					let qty = resultList[x].resultMealQty;
					//alert(code);
					if(code == '조식') {
						breakfastR = qty;
					}else if(code == '중식') {
						lunchR = qty;
					}else if(code == '석식') {
						dinnerR = qty;
					}else if(code == '야식') {
						lateNightR = qty;
					}
				}
				
				//계획
				text += '<tr class="even pointer">';
				text += '  <td>' + _cnt++ + '</td>';
				text += '  <td>' + jsonResult[i].projNo + '</td>';
				text += '  <td>' + jsonResult[i].kind + '</td>';
				text += '  <td>' + jsonResult[i].domesticYn + '</td>';
				text += '  <td>' + jsonResult[i].department + '</td>';
				text += '  <td>' + jsonResult[i].mealDate + '</td>';
				text += '  <td>' + jsonResult[i].foodStyle + '</td>';
				text += '  <td>' + '계획' + '</td>';
				text += '  <td>' + breakfastP + '</td>';
				text += '  <td>' + lunchP + '</td>';
				text += '  <td>' + dinnerP + '</td>';
				text += '  <td>' + lateNightP + '</td>';
				text += '  <td>' + jsonResult[i].orderStatus + '</td>';
				text += '  <td>' + jsonResult[i].orderDate + '</td>';
				text += '  <td>' + jsonResult[i].orderUid + '</td>';
				text += '  <td>' + jsonResult[i].deleteYn + '</td>';
				text += '  <td>' + jsonResult[i].comment + '</td>';
				text += '  <td>' + jsonResult[i].inputUid + '</td>';
				text += '  <td>' + jsonResult[i].inputDate + '</td>';
				text += '</tr>';
				
				//실적
				text += '</tr>';
				text += '<tr class="even pointer">';
				text += '  <td>' + _cnt++ + '</td>';
				text += '  <td>' + jsonResult[i].projNo + '</td>';
				text += '  <td>' + jsonResult[i].kind + '</td>';
				text += '  <td>' + jsonResult[i].domesticYn + '</td>';
				text += '  <td>' + jsonResult[i].department + '</td>';
				text += '  <td>' + jsonResult[i].mealDate + '</td>';
				text += '  <td>' + jsonResult[i].foodStyle + '</td>';
				text += '  <td>' + '실적' + '</td>';
				text += '  <td>' + breakfastR + '</td>';
				text += '  <td>' + lunchR + '</td>';
				text += '  <td>' + dinnerR + '</td>';
				text += '  <td>' + lateNightR + '</td>';
				text += '  <td>' + jsonResult[i].orderStatus + '</td>';
				text += '  <td>' + jsonResult[i].orderDate + '</td>';
				text += '  <td>' + jsonResult[i].orderUid + '</td>';
				text += '  <td>' + jsonResult[i].deleteYn + '</td>';
				text += '  <td>' + jsonResult[i].comment + '</td>';
				text += '  <td>' + jsonResult[i].inputUid + '</td>';
				text += '  <td>' + jsonResult[i].inputDate + '</td>';
				text += '</tr>';
			}

			text += '</tbody>';
			
			excelDownloadAll(text, 'anch_list');
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
	let sessionUserID = _anchUid;
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
		            url: contextPath + "/crew/anchOrderUpdate.html",
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
								getAnchMealList();
								alertPop('선택한 리스트 발주 완료되었습니다.');
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

// 신청자 row 추가
function addAnch() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.add'));
		return;
	}
	
	if(_anchCnt == 0) {
		$('#tbRowList').empty();
	}
	
	_anchCnt++;
	let rowId = _tbRowId++;
		
	let text = '<tr id="tbRow_' + rowId + '">' + 
					'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center th-w-60"><div name="no">' + _anchCnt + '</div></td>' +
					/*'<td class="text-center" style="display: none">' + '<input name="uid" type="text" disabled>' + '</td>' + */
					'<td class="text-center">' + '<input name="uid" type="text" disabled>' + '</td>' + 
										
					'<td class="text-center">' + '<input name="projNo" type="text" disabled>' + '</td>' + 
					
					'<td class="text-center">' + 
						'<select name="kind">' +
							'<option value="S">직영</option>' + 
							'<option value="H">협력사</option>' + 
							'<option value="V">방문객</option>' + 
							'<option value="O">Owner/Class</option>' + 
						'</select>' +
					'</td>' + 
					
					'<td class="text-center">' + 
						'<select name="domesticYn">' +
							'<option value="Y">내국</option>' + 
							'<option value="N">외국</option>' +
						'</select>' +
					'</td>' + 
					
					'<td class="text-center">' + '<input name="department" type="text">' + '</td>' + 
					'<td class="text-center th-w-200">' + '<input name="mealDate" class="text-center" type="date">' + '</td>' +
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
					'<td style = "border: 1px soild red" class="text-center  align-middle crew-inout-label p-0">' + 
						'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
						'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
					'</td>'

					text += '<td class="text-center align-middle p-0" >' + 
													'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
													'<input style="width: 100px;" name="breakfastP" class="text-center" type="text">' +
													'</div>' + 
													'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
														'<input style="width: 100px;" name="breakfastR" disabled class="text-center" type="text">' +
													'</div>' + 
												'</td>';
										text += '<td class="text-center align-middle p-0">' + 
													'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
													'<input style="width: 100px;" name="lunchP" class="text-center" type="text">' +
													'</div>' + 
													'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
														'<input style="width: 100px;" name="lunchR" disabled class="text-center" type="text">' +
													'</div>' + 
												'</td>';

										text += '<td class="text-center align-middle p-0">' + 
													'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
													'<input style="width: 100px;" name="dinnerP" class="text-center" type="text">' +
													'</div>' + 
													'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
														'<input style="width: 100px;" name="dinnerR" disabled class="text-center" type="text">' +
													'</div>' + 
												'</td>';							

										text += '<td  class="text-center align-middle p-0">' + 
													'<divclass="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
													'<input style="width: 100px;" name="lateNightP" class="text-center" type="text">' +
													'</div>' + 
													'<div  class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
														'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text">' +
													'</div>' + 
												'</td>'+
					
					'<td class="text-center">' + '<input name="orderStatus" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="orderDate" type="text" disabled>' + '</td>' +
					'<td class="text-center">' + '<input name="orderUid" type="text" disabled>' + '</td>'+
					'<td class="text-center">' + '<input name="deleteYn" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="comment" type="text">' + '</td>' +
					'<td class="text-center">' + '<input name="inputUid" type="text" disabled>' + '</td>' +
					'<td class="text-center">' + '<input name="inputDate" type="text" disabled>' + '</td>';
	text += '</tr>';

	$('#tbRowList').append(text);
}


// 신청자 삭제 팝업.
function popDeleteAnchModal() {
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
// 신청자 삭제
function deleteAnch() {
    let uidArr = [];
	
    // 체크된 항목 수집
    $('input[name=listChk]:checked').each(function(index, checkbox) {
        let tr = $(checkbox).closest('tr');
        let uid = tr.find('input[name=uid]').val();

        if (uid && uid != "-1") {
            uidArr.push(uid)
        }

        tr.remove(); 
        _anchCnt--;
    });

    if (uidArr.length > 0) {
        $.ajax({
            url: contextPath + "/crew/anchorageMealRemove.html",
            type: "POST",
            traditional: true, 
            data: { uidArr: uidArr },
			success: function(data) {
				try {
					let json = JSON.parse(data);
				
					if(json.result) {
						
						alertPop($.i18n.t('선택한 신청 정보가 삭제되었습니다.'));
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
function downAnchExcel() {
	//alert("오나요");
	window.location.href = contextPath + '/crew/downAnchExcel.html';
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
	//alert(1);
	
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
			//alert(fileData.indexOf('Fasoo DRM'));
			// DRM 걸린 파일 인지 확인
			if(fileData.indexOf('Fasoo DRM') > -1){
			//if(true){
				//lert(3);
				const formData = new FormData();
				formData.append('file', input.files[0]);
								
				$.ajax({
					type: 'POST',
					url: contextPath + '/crew/anchorageMealDRM.html',
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
	//let sessionUserID = _anchUid;
		
	let projNoList = [];
	//let trialKey = [];
	let kindList = [];
	let domesticYnList = [];
	let departmentList = [];
	let mealDateList = [];
	let orderStatusList = [];
	let commentList = [];
	let foodStyleList = [];
	
	let breakfastPList = [];
	let lunchPList = [];
	let dinnerPList = [];
	let lateNightPList = [];
	
	if(json.length > 0) {
		for(let i = 0; i < json.length; i++) {
			let data = json[i];		

			let projNo = $("#ship option:selected").text();
		
			let kind = isNull(data['구분'], '');
			let domesticYn = isNull(data['내국/외국'], 'Y');
			let department = isNull(data['부서'], '');
			let mealDate = isNull(data['날짜'], '');
			let foodStyle = isNull(data['한식/양식'], 'H');
			let breakfastP = isNull(data['조식(계획)'], 0);
			let lunchP = isNull(data['중식(계획)'], 0);
			let dinnerP = isNull(data['석식(계획)'], 0);
			let lateNightP = isNull(data['야식(계획)'], 0);
			let orderStatus = isNull(data['발주'], 'N');
			let comment = isNull(data['특이사항'], '');
			
			if(department == '' && name == '' && phone == '') {
				break;
			}

			projNoList.push(projNo);
			kindList.push(kind);
			domesticYnList.push(domesticYn);
			departmentList.push(department);
			mealDateList.push(mealDate);
			orderStatusList.push(foodStyle);
			commentList.push(breakfastP);
			foodStyleList.push(lunchP);
			breakfastPList.push(dinnerP);
			lunchPList.push(lateNightP);
			dinnerPList.push(orderStatus);
			lateNightPList.push(comment);
		}
		
		if(isError) {
			alertPop(errMsg);
		}else {
			setExcelData(projNoList, kindList, domesticYnList, departmentList, mealDateList, orderStatusList, commentList, foodStyleList, breakfastPList,
				 lunchPList, dinnerPList, lateNightPList);
		}
	}else {
		alertPop($.i18n.t('excelUp.errorListMin'));
	}
	
	setListEmpty();
}

// 양식 업로드 데이터 세팅.
function setExcelData(projNoList, kindList, domesticYnList, departmentList, mealDateList, orderStatusList, commentList, foodStyleList, breakfastPList,
				 lunchPList, dinnerPList, lateNightPList) {
	$('#tbRowList').empty();
	_anchCnt = 0;
	
	for(let i = 0; i < kindList.length; i++) {
		_anchCnt++;

		let rowId = _tbRowId++;
		let uid = -1;
		let projNo = projNoList[i];
		let kind = kindList[i];		
		let domesticYn = domesticYnList[i];
		let department = departmentList[i];
		
		let mealDate = departmentList[i];
		let foodStyle = mealDateList[i];
		let breakfastP = breakfastPList[i];
		let lunchP = lunchPList[i];
		let dinnerP = dinnerPList[i];
		let lateNightP = lateNightPList[i];
		let orderStatus = orderStatusList[i];
		let comment = commentList[i];
		
		let breakfastR = 0;
		let lunchR = 0;
		let dinnerR = 0;
		let lateNightR = 0;
		
		let orderDate = "";
		let orderUid = "";
		let deleteYn = "N";

		let inputUid = "";
		let inputDate = "";
		
		let text = "";
		text += '<tr id="tbRow_' + rowId + '">' + 
							'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
							'<td class="text-center th-w-60"><div name="no">' + _anchCnt + '</div></td>' +
							'<td class="text-center">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
							'<td class="text-center">' + '<input name="projNo" type="text" value="' + projNo + '" disabled>' + '</td>' + 
							
							'<td class="text-center">' + 
								'<select name="kind">';
							text += '<option value="S"' + (kind == 'S' ? ' selected' : '') + '>직영</option>' + 
									'<option value="H"' + (kind == 'H' ? ' selected' : '') + '>협력사</option>'+
									'<option value="V"' + (kind == 'V' ? ' selected' : '') + '>방문객</option>'+
									'<option value="O"' + (kind == 'O' ? ' selected' : '') + '>Owner/Class</option>';
						text += '</select>' +
						
							'<td class="text-center">' + 
								'<select name="domesticYn">';
							text += '<option value="Y"' + (domesticYn == 'Y' ? ' selected' : '') + '>내국</option>' + 
									'<option value="N"' + (domesticYn == 'N' ? ' selected' : '') + '>외국</option>';
						text += '</select>' +
							
							'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 												
							'<td class="text-center th-w-200">' + '<input name="mealDate" class="text-center" type="date" value="' + mealDate + '" >' + '</td>'+							
							'<td class="text-center">' + 
								'<select name="foodStyle" >';
								
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
							
							'<td style = "border: 1px soild red" class="text-center  align-middle crew-inout-label p-0">' + 
								'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
								'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
							'</td>'
							 
							text += '<td class="text-center align-middle p-0" >' + 
										'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
										'<input style="width: 100px;" name="breakfastP" class="text-center" type="text" value="' + breakfastP + '" >' +
										'</div>' + 
										'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
											'<input style="width: 100px;" name="breakfastR" disabled class="text-center" type="text" value="' + breakfastR + '" >' +
										'</div>' + 
									'</td>';
							text += '<td class="text-center align-middle p-0">' + 
										'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
										'<input style="width: 100px;" name="lunchP" class="text-center" type="text" value="' + lunchP + '" >' +
										'</div>' + 
										'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
											'<input style="width: 100px;" name="lunchR" disabled class="text-center" type="text" value="' + lunchR + '" >' +
										'</div>' + 
									'</td>';

							text += '<td class="text-center align-middle p-0">' + 
										'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
										'<input style="width: 100px;" name="dinnerP" class="text-center" type="text" value="' + dinnerP + '" >' +
										'</div>' + 
										'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
											'<input style="width: 100px;" name="dinnerR" disabled class="text-center" type="text" value="' + dinnerR + '" >' +
										'</div>' + 
									'</td>';							

							text += '<td  class="text-center align-middle p-0">' + 
										'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
										'<input style="width: 100px;" name="lateNightP" class="text-center" type="text" value="' + lateNightP + '" >' +
										'</div>' + 
										'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
											'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text" value="' + lateNightR + '" >' +
										'</div>' + 
									'</td>'+						
																
							'<td class="text-center">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
							'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
							'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' ;
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
	let sessionUserID = _anchUid;
	
	let uid = [];
	let projNo = [];
	//let trialKey = [];
	let kind = [];
	let domesticYn = [];
	let department = [];
	let mealDate = [];
	let orderStatus = [];
	let orderDate = [];
	let orderUid = [];
	let deleteYn = [];
	let comment = [];
	let foodStyle = [];
	
	let breakfastP = [];
	let lunchP = [];
	let dinnerP = [];
	let lateNightP = [];
	
	let breakfastR = [];
	let lunchR = [];
	let dinnerR = [];
	let lateNightR = [];

	/*let planMealDate = [];
	let planMealTime = [];
	let planMealGubun = [];
	let planMealQty = [];
	
	let resultMealDate = [];
	let resultMealTime = [];
	let resultMealGubun = [];
	let resultMealQty = [];*/

	//alert($('#ship').val());
	//alert(document.getElementById('ship').value);
	
	let uidVl = document.getElementsByName('uid');
	//alert(uidVl.values);
	let projNoVl = document.getElementsByName('projNo');
	//alert(kindVl.values);
	//let trialKeyVl = document.getElementsByName('trialKey');
	let kindVl = document.getElementsByName('kind');
	let domesticYnVl = document.getElementsByName('domesticYn');
	let departmentVl = document.getElementsByName('department');
	let mealDateVl = document.getElementsByName('mealDate');
	let orderStatusVl = document.getElementsByName('orderStatus');
	let orderDateVl = document.getElementsByName('orderDate');
	let orderUidVl = document.getElementsByName('orderUid');
	let deleteYnVl = document.getElementsByName('deleteYn');
	let commentVl = document.getElementsByName('comment');
	let foodStyleVl = document.getElementsByName('foodStyle');
	
	let breakfastPVl = document.getElementsByName('breakfastP');
	let lunchPVl = document.getElementsByName('lunchP');
	let dinnerPVl = document.getElementsByName('dinnerP');
	let lateNightPVl = document.getElementsByName('lateNightP');
	
	let breakfastRVl = document.getElementsByName('breakfastR');
	let lunchRVl = document.getElementsByName('lunchR');
	let dinnerRVl = document.getElementsByName('dinnerR');
	let lateNightRVl = document.getElementsByName('lateNightR');
	
	//alert(projNoVl.length);
	//alert(lateNightPVl.length);
	/*let planMealDateVl = document.getElementsByName('planMealDate');
	let planMealTimeVl = document.getElementsByName('planMealTime');
	let planMealGubunVl = document.getElementsByName('planMealGubun');
	let planMealQtyVl = document.getElementsByName('planMealQty');
	
	let resultMealDateVl = document.getElementsByName('resultMealDate');
	let resultMealTimeVl = document.getElementsByName('resultMealTime');
	let resultMealGubunVl = document.getElementsByName('resultMealGubun');
	let resultMealQtyVl = document.getElementsByName('resultMealQty');*/
	
	let uidValue = "";	
	let isError = false;
	//alert(1);
	for(let i = 0; i < kindVl.length; i++) {
		breakfastPVl[i].value = breakfastPVl[i] && breakfastPVl[i].value !== "" ? breakfastPVl[i].value : 0;
		lunchPVl[i].value = lunchPVl[i] && lunchPVl[i].value !== "" ? lunchPVl[i].value : 0;
		dinnerPVl[i].value = dinnerPVl[i] && dinnerPVl[i].value !== "" ? dinnerPVl[i].value : 0;
		lateNightPVl[i].value = lateNightPVl[i] && lateNightPVl[i].value !== "" ? lateNightPVl[i].value : 0;
		
		breakfastRVl[i].value = breakfastRVl[i] && breakfastRVl[i].value !== "" ? breakfastRVl[i].value : 0;
		lunchRVl[i].value = lunchRVl[i] && lunchRVl[i].value !== "" ? lunchRVl[i].value : 0;
		dinnerRVl[i].value = dinnerRVl[i] && dinnerRVl[i].value !== "" ? dinnerRVl[i].value : 0;
		lateNightRVl[i].value = lateNightRVl[i] && lateNightRVl[i].value !== "" ? lateNightRVl[i].value : 0;
		//alert(projNoVl[i].value);
	}

	if(kindVl.length < 1) {
		alertPop($.i18n.t('errorNoList'));
		isError = true;
	}

	//신규추가된 ROW가 있을경우 호선 번호 필수 선택
	for(let i = 0; i < kindVl.length; i++){
		//alert(projNoVl[i].value);
		if(isEmpty(projNoVl[i].value)) {
			if($('#ship').val() == "ALL") {
					alertPop($.i18n.t('errorShip'));
					isError = true;
			}
		}
	}
	//alert(sessionUserID);
	/*alert($("#ship option:selected").val());
	alert($("#ship option:selected").text());
	alert(trialKeyVl[1].value);*/
	
	for(let i = 0; i < kindVl.length; i++) {
		//alert(3);
		uidVl[i].value = uidVl[i] && uidVl[i].value !== "" ? uidVl[i].value : -1;
		
		if(isEmpty(projNoVl[i].value)) {
			projNoVl[i].value = $("#ship option:selected").text();
		}
		
		//alert(projNoVl[i].value);
		
		// alert(terminalVl[i].checked);
		
		if(deleteYnVl[i].checked == true) 
			deleteYnVl[i].value = 'Y';
		else 
			deleteYnVl[i].value = 'N';
			//alert(deleteYnVl[i].checked);
		if(orderStatusVl[i].checked == true) 
			orderStatusVl[i].value = 'Y'
		else 
			orderStatusVl[i].value = 'N';
			//alert(5);
			//alert(trialKeyVl[i].value);
			
		//alert("terminalVl[i].value"+terminalVl[i].value);
		//alert("foreignerVl[i].value"+foreignerVl[i].value);
		
		/*if(isEmpty(trialKeyVl[i].value)) {
			trialKeyVl[i].value = $("#ship option:selected").val();
		}
		
		if(isEmpty(projNoVl[i].value)) {
			projNoVl[i].value = $("#ship option:selected").text();
		}*/
		
		//alert(trialKeyVl[i].value);
		
		//alert(trialKeyVl[i].value);
		//alert(pjtVl[i].value);
				
		if(isEmpty(departmentVl[i].value)) {
			alertPop($.i18n.t('errorRequired'));
			departmentVl[i].focus();
			isError = true;
			break;
		}
		//alert(3);
		//alert("dhsdfsdf");
		//alert(uidVl[i].value);
		uid.push(uidVl[i].value);
		projNo.push(projNoVl[i].value);
		//trialKey.push(projNoVl[i].value);
		kind.push(kindVl[i].value);
		domesticYn.push(domesticYnVl[i].value);
		department.push(departmentVl[i].value);
		mealDate.push(mealDateVl[i].value);
		orderStatus.push(orderStatusVl[i].value);
		orderDate.push(orderDateVl[i].value);
		orderUid.push(orderUidVl[i].value);
		deleteYn.push(deleteYnVl[i].value);
		comment.push(commentVl[i].value);
		foodStyle.push(foodStyleVl[i].value);

		breakfastP.push(breakfastPVl[i].value);
		lunchP.push(lunchPVl[i].value);
		dinnerP.push(dinnerPVl[i].value);
		lateNightP.push(lateNightPVl[i].value);
		
		breakfastR.push(breakfastRVl[i].value);
		lunchR.push(lunchRVl[i].value);
		dinnerR.push(dinnerRVl[i].value);
		lateNightR.push(lateNightRVl[i].value);
		/*planMealDate.push(planMealDateVl[i].value);
		planMealTime.push(planMealTimeVl[i].value);
		planMealGubun.push(planMealGubunVl[i].value);
		planMealQty.push(planMealQtyVl[i].value);*/ 
	}
	//alert(terminal.length);
	if(isError) {
		return;
	}

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/crew/anchorageMealSave.html',
		traditional: true,
		data: {
			uuid:sessionUserID,
			uid: uid,
			schedulerInfoUid: -1,
			projNo: projNo,
			//trialKey: projNo,
			kind: kind,
			domesticYn: domesticYn,
			department: department,
			mealDate: mealDate,
			orderStatus: orderStatus,
			orderDate: orderDate,
			orderUid: orderUid,
			deleteYn: deleteYn,
			comment: comment,
			foodStyle: foodStyle,

			breakfastP: breakfastP,
			lunchP: lunchP,
			dinnerP: dinnerP,
			lateNightP: lateNightP,

			breakfastR: breakfastR,
			lunchR: lunchR,
			dinnerR: dinnerR,
			lateNightR: lateNightR
			
			/*planMealDate: planMealDate,
			planMealTime: planMealTime,
			planMealGubun: planMealGubun,
			planMealQty: planMealQty*/
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
				//재조회
				getAnchMealList();
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



// 필터 검색.(추가컬럼 수정필요)
function searchList() {
	
	let kind = $('#filterKind').val();
	let domesticYn = $('#filterDomesticYN').val();
	let foodStyle = $('#filterFoodStyle').val();
	let word = $('#filterWord').val();
	
	let kindVl = document.getElementsByName('kind');
	let domesticYnVl = document.getElementsByName('domesticYn');
	let foodStyleVl = document.getElementsByName('foodStyle');
	
	let departmentVl = document.getElementsByName('department');
	let commentVl = document.getElementsByName('comment');
	
	//alert(kind);
	for(let i = 0; i < kindVl.length; i++) {
		let isHide = false;
		
		if(kind != 'ALL' && kind != kindVl[i].value) {
			isHide = true;
		}
		
		if(domesticYn != 'ALL' && domesticYn != domesticYnVl[i].value) {
			isHide = true;
		}
		
		if(foodStyle != 'ALL' && foodStyle != foodStyleVl[i].value) {
			isHide = true;
		}
		
		if(word.length > 0 
			&& !departmentVl[i].value.includes(word) && !commentVl[i].value.includes(word) 
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

	