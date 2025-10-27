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
			getAnchMealList(1);
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
				'<th><div class="tb-th-col"><span class="tb-th-content">' + '</span></div></th>' +
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
		let foodStyle = _anchList[z].foodStyle;
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
			alert(code);
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
	//alert($("#ship option:selected").val());
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
					
					//alert(uid + '/'+projNo);
					//승선일,하선일 필터링	
					/*if(($('#inDate').val() != null && $('#outDate').val() != null) && ($('#inDate').val() != '' && $('#outDate').val() != '')){
						
						if(!($('#inDate').val() <= mealDate && mealDate <= $('#outDate').val())) {
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
function crewListDownloadAll() {
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
function downCrewExcel() {
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
	_anchCnt = 0;
	
	for(let i = 0; i < kindList.length; i++) {
		_anchCnt++;
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
						'<td class="text-center"><div name="no">' + _anchCnt + '</div></td>' +
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
	
	alert(projNoVl.length);
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
		alert(projNoVl[i].value);
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
		
		alert(projNoVl[i].value);
		
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
	
	alert(kind);
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

	