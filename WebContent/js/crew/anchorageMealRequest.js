let _anchCnt = 0;
let _tbRowId = 0;
let listArr = [];
let listSort = "";
let listOrder = "desc";
let _isSetSort = false;
let _isSetPage = false;
let anchPageNo = '';
const SHIP_AUTOCOMPLETE_MIN_LENGTH = 4;

$(function(){
    initI18n();
	
	// URL 파라미터에서 schedulerInfoUid 확인
    let urlParams = new URLSearchParams(window.location.search);
    let schedulerInfoUid = urlParams.get('schedulerInfoUid');
	
    init();

    initServerCheck();
    autocompleteOff();
	buildShipAutoSourceBaseFromDOM();
	initShipAutocomplete();
	updateShipAutocompleteSource();
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
	
	$('#shipInput').keypress(function(e) {
		if(e.keyCode === 13) {
			e.preventDefault();
			deriveShipValueFromInput();
			getAnchMealList();
		}
	});
}

function saveSearchOption() {
    setSearchCookie('SK_PAGE', anchPageNo);

    setSearchCookie('SK_SORTNM', listSort);
    setSearchCookie('SK_SORTOD', listOrder);

	const shipValue = deriveShipValueFromInput();
    setSearchCookie('SK_SHIP', shipValue);
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

	// URL 파라미터에서 검색조건 가져오기
	let urlParams = new URLSearchParams(window.location.search);
	let paramInDate = urlParams.get('inDate');
	let paramOutDate = urlParams.get('outDate');
	let paramSchedulerInfoUid = urlParams.get('schedulerInfoUid');
	let paramFilterKind = urlParams.get('filterKind');
	let paramFilterDomesticYN = urlParams.get('filterDomesticYN');
	let paramFilterFoodStyle = urlParams.get('filterFoodStyle');
	let paramFilterWord = urlParams.get('filterWord');	

	if(paramSchedulerInfoUid && paramSchedulerInfoUid !== '') {
		const label = getShipDescription(paramSchedulerInfoUid) || paramSchedulerInfoUid;
		setShipValue(paramSchedulerInfoUid, label);
	} else if(ship && ship !== '' && ship !== 'ALL') {
		const label = getShipDescription(ship) || ship;
		setShipValue(ship, label);
	} else if(ship === 'ALL') {
		setShipValue('', '');
	} else {
		setShipValue('', '');
	}
	
	// URL 파라미터로 기간 설정
	if(paramInDate) {
		$('#inDate').val(paramInDate);
	}
	if(paramOutDate) {
		$('#outDate').val(paramOutDate);
	}
	
	// 날짜 값이 없으면 오늘 날짜로 설정
	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);
	
	if(!$('#inDate').val() || $('#inDate').val() === '') {
		$('#inDate').val(todayStr);
	}
	if(!$('#outDate').val() || $('#outDate').val() === '') {
		$('#outDate').val(todayStr);
	}
	
	// 필터 조건들 설정
	if(paramFilterKind) {
		$('#filterKind').val(paramFilterKind);
	}
	if(paramFilterDomesticYN) {
		$('#filterDomesticYN').val(paramFilterDomesticYN);
	}
	if(paramFilterFoodStyle) {
		$('#filterFoodStyle').val(paramFilterFoodStyle);
	}
	if(paramFilterWord) {
		$('#filterWord').val(paramFilterWord);
	}
	
	if(page != '') {
		_isSetPage = true;
		anchPageNo = page;
	}
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		initTbAlign(sortNm, sortOd);
	}
	updateShipAutocompleteSource();
}

// 앵카링 식사신청 목록 해더 세팅.
function initTableHeader() {
	_anchCnt = 0;

	let text = '<th class="th-w-40"><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>' +
				'<th class="th-w-60"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.no') + '</span></div></th>' +				
				/*추후 숨길 항목*/
				/*'<th style="display: none"><div class="tb-th-col"><span class="tb-th-content">' + "UID" + '</span></div></th>' +*/
				'<th style="display: none"><div class="tb-th-col"><span class="tb-th-content">' + "UID" + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.projNo') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.kind') + '</span></div></th>' +				
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.domesticYn') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.department') + '</span></div></th>' +
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.mealDate') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.foodStyle') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + ' ' +'</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.breakfast') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lunch') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.dinner') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.lateNight') + '</span></div></th>' +
				'<th class="th-w-90"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderStatus') + '</span></div></th>' +
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderDate') + '</span></div></th>' +
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.orderUid') + '</span></div></th>' +
				'<th class="th-w-60"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.deleteYn') + '</span></div></th>' + 
				'<th class="th-w-200"><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.comment') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.inputUid') + '</span></div></th>' + 
				'<th><div class="tb-th-col"><span class="tb-th-content">' + $.i18n.t('list.inputDate') + '</span></div></th>' +
				'<th><div class="tb-th-col-last"><span class="tb-th-content">SMS수신자</span></div></th>';				
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
		let smsReceiver = (_anchList[z].smsReceiver != null && _anchList[z].smsReceiver !== undefined) ? _anchList[z].smsReceiver : '';
		
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
		
		//식사신청 수량(실적) - 부서, 날짜, 식사구분별 필터링
		for(let x = 0; x < resultList.length; x++) {
			let resultItem = resultList[x];
			// 부서가 일치하는 실적만 사용
			if(resultItem.department && department && resultItem.department !== department) {
				continue;
			}
			// 날짜가 일치하는 실적만 사용
			let resultMealDate = resultItem.resultMealDate ? resultItem.resultMealDate.match(/\d{4}-\d{2}-\d{2}/) : null;
			if(resultMealDate && mealDate && resultMealDate[0] !== mealDate) {
				continue;
			}
			let code = resultItem.resultMealTime;
			let qty = resultItem.resultMealQty;
			let resultMealGubun = resultItem.resultMealGubun;
			
			// 식사구분이 없으면 첫번째 값 사용
			if(!foodStyle && resultMealGubun) {
				foodStyle = resultMealGubun;
			}
			
			// 같은 시간대의 경우 식사구분도 일치하는 것만 사용
			if(foodStyle && resultMealGubun && foodStyle !== resultMealGubun) {
				continue;
			}
			
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
					'<td class="text-center" style="display: none" >'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
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
														
					'<td class="text-center th-w-90">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
					'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
					'<td class="text-center th-w-60">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
					'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
					'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' +
					'<td class="text-center"><textarea name="smsReceiver" rows="2" style="width: 100%; min-width: 200px;" placeholder="010-0000-0000,&#10;010-0000-0001,">' + (smsReceiver ? smsReceiver.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '') + '</textarea></td>';
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
		$("#tbRowList").append('<tr><td class="text-center" colspan="21">' + $.i18n.t('share:noList') + '</td></tr>');
	}
}

// 식사신청 리스트 조회
function getAnchMealList() {
	const shipValue = deriveShipValueFromInput();
	let projNo = shipValue;
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
    deriveShipValueFromInput();
    var ship = $('#ship').val();
    var inDate = $('#inDate').val();
    var outDate = $('#outDate').val();
	
	// 스케줄번호 필수 선택 체크
	if(!ship) {
		alertPop('스케줄번호를 선택해주세요.');
		return;
	}

	//in/out Date 하나만 입력시 메시지	
	if((outDate != '' && inDate =='')){
		alertPop($.i18n.t('시작일을 입력해주세요.'));
		return;
	}
	if((inDate != '' && outDate =='')){
		alertPop($.i18n.t('종료일을 입력해주세요.'));
		return;
	}	
		
	//페이지 셋팅(검색시에는 1페이지로, 페이지 이동시에는 전달받은 페이지 사용)
	if(!_isSetPage) {
		page = 1;
	} else if(page == null || page == undefined || page === '') {
		page = anchPageNo || 1;
	}
	_isSetPage = false;

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
			//console.log('data:', json);
			
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
					// SMS수신자 값 가져오기 (null 체크 및 기본값 처리)
					let smsReceiver = '';
					// JSON에서 smsReceiver 값 가져오기
					if(json.list[i].smsReceiver != null && json.list[i].smsReceiver !== undefined && json.list[i].smsReceiver !== '') {
						let receiverValue = json.list[i].smsReceiver;
						// 문자열로 변환하고 trim 처리
						let trimmedValue = String(receiverValue).trim();
						// 빈 문자열이 아닌 경우에만 처리
						if(trimmedValue !== '') {
							smsReceiver = trimmedValue;
						}
					}
					
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
						// foodStyle이 없으면 계획에서 가져오기
						if(!foodStyle && planList[x].planMealGubun) {
							foodStyle = planList[x].planMealGubun;
						}
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
					
					//식사신청 수량(실적) - 부서, 날짜, 식사구분별 필터링
					for(let x = 0; x < resultList.length; x++) {
						let resultItem = resultList[x];
						// 부서가 일치하는 실적만 사용
						if(resultItem.department && department && resultItem.department !== department) {
							continue;
						}
						// 날짜가 일치하는 실적만 사용
						let resultMealDate = resultItem.resultMealDate ? resultItem.resultMealDate.match(/\d{4}-\d{2}-\d{2}/) : null;
						if(resultMealDate && mealDate && resultMealDate[0] !== mealDate) {
							continue;
						}
						let code = resultItem.resultMealTime;
						let qty = resultItem.resultMealQty;
						let resultMealGubun = resultItem.resultMealGubun;
						
						// 식사구분이 없으면 첫번째 값 사용
						if(!foodStyle && resultMealGubun) {
							foodStyle = resultMealGubun;
						}
						
						// 같은 시간대의 경우 식사구분도 일치하는 것만 사용
						if(foodStyle && resultMealGubun && foodStyle !== resultMealGubun) {
							continue;
						}
						
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
						//alert(($('#inDate').val() <= mealDate && mealDate <= $('#outDate').val()));
						
						if(!($('#inDate').val() <= mealDate && mealDate <= $('#outDate').val())) {
							//alert(1);
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
								'<td class="text-center" style="display: none">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
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

								text += '<td class="text-center align-middle p-0">' + 
											'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
											'<input style="width: 100px;" name="lateNightP" class="text-center" type="text" value="' + lateNightP + '" >' +
											'</div>' + 
											'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
												'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text" value="' + lateNightR + '" >' +
											'</div>' + 
										'</td>';						
																	
								text += '<td class="text-center th-w-90">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
								'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
								'<td class="text-center th-w-60">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
								'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
								'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' +
								'<td class="text-center"><textarea name="smsReceiver" rows="2" style="width: 100%; min-width: 200px;" placeholder="010-0000-0000,&#10;010-0000-0001,">' + (smsReceiver ? smsReceiver.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '') + '</textarea></td>';
					text += '</tr>';	
				}

            $('#tbRowList').empty();
//alert(json.list.length);
//alert(text);
            if(json.list.length > 0) {
                $('#tbRowList').append(text);
                // 검색 결과 로드 후 행 개수 업데이트
                _anchCnt = json.list.length;
            }else {
                $('#tbRowList').append('<tr><td class="text-center" colspan="18">' + $.i18n.t('share:noList') + '</td></tr>');
                _anchCnt = 0;
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
	// 호선 입력 여부 확인
	const shipValue = deriveShipValueFromInput();
	if(!shipValue || shipValue === '' || shipValue === 'ALL') {
		alertPop('호선을 선택해주세요.');
		return;
	}
	
	var search = $("#search").val();
	var _cnt = 0;
	
	// 조회 기간 가져오기
	var inDate = $('#inDate').val() || '';
	var outDate = $('#outDate').val() || '';

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
			ship: shipValue,
			inDate: inDate,
			outDate: outDate,
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
				let foodStyleCode = '';
				for(let x = 0; x < planList.length; x++) {
					let code = planList[x].planMealTime;
					let qty = planList[x].planMealQty;
					// foodStyle은 planMealGubun에서 가져오기
					if(!foodStyleCode && planList[x].planMealGubun) {
						foodStyleCode = planList[x].planMealGubun;
					}
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
				
				// 변환된 값 준비
				let kindLabel = getKindLabelForExcel(jsonResult[i].kind || '');
				let foodStyleLabel = getFoodStyleLabelForExcel(foodStyleCode || '');
				let mealDateFormatted = formatDateForExcel(jsonResult[i].mealDate);
				let orderDateFormatted = formatDateTimeForExcel(jsonResult[i].orderDate);
				let inputDateFormatted = formatDateTimeForExcel(jsonResult[i].inputDate);
				let inputUidDisplay = jsonResult[i].inputUid || '';
				let orderUidDisplay = jsonResult[i].orderUid || '';
				
				//계획
				text += '<tr class="even pointer">';
				text += '  <td>' + _cnt++ + '</td>';
				text += '  <td>' + (jsonResult[i].projNo || '') + '</td>';
				text += '  <td>' + kindLabel + '</td>';
				text += '  <td>' + (jsonResult[i].domesticYn || '') + '</td>';
				text += '  <td>' + (jsonResult[i].department || '') + '</td>';
				text += '  <td>' + mealDateFormatted + '</td>';
				text += '  <td>' + foodStyleLabel + '</td>';
				text += '  <td>' + '계획' + '</td>';
				text += '  <td>' + (breakfastP || '') + '</td>';
				text += '  <td>' + (lunchP || '') + '</td>';
				text += '  <td>' + (dinnerP || '') + '</td>';
				text += '  <td>' + (lateNightP || '') + '</td>';
				text += '  <td>' + (jsonResult[i].orderStatus || '') + '</td>';
				text += '  <td>' + orderDateFormatted + '</td>';
				text += '  <td>' + orderUidDisplay + '</td>';
				text += '  <td>' + (jsonResult[i].deleteYn || '') + '</td>';
				text += '  <td>' + (jsonResult[i].comment || '') + '</td>';
				text += '  <td>' + inputUidDisplay + '</td>';
				text += '  <td>' + inputDateFormatted + '</td>';
				text += '</tr>';
				
				//실적
				text += '<tr class="even pointer">';
				text += '  <td>' + _cnt++ + '</td>';
				text += '  <td>' + (jsonResult[i].projNo || '') + '</td>';
				text += '  <td>' + kindLabel + '</td>';
				text += '  <td>' + (jsonResult[i].domesticYn || '') + '</td>';
				text += '  <td>' + (jsonResult[i].department || '') + '</td>';
				text += '  <td>' + mealDateFormatted + '</td>';
				text += '  <td>' + foodStyleLabel + '</td>';
				text += '  <td>' + '실적' + '</td>';
				text += '  <td>' + (breakfastR || '') + '</td>';
				text += '  <td>' + (lunchR || '') + '</td>';
				text += '  <td>' + (dinnerR || '') + '</td>';
				text += '  <td>' + (lateNightR || '') + '</td>';
				text += '  <td>' + (jsonResult[i].orderStatus || '') + '</td>';
				text += '  <td>' + orderDateFormatted + '</td>';
				text += '  <td>' + orderUidDisplay + '</td>';
				text += '  <td>' + (jsonResult[i].deleteYn || '') + '</td>';
				text += '  <td>' + (jsonResult[i].comment || '') + '</td>';
				text += '  <td>' + inputUidDisplay + '</td>';
				text += '  <td>' + inputDateFormatted + '</td>';
				text += '</tr>';
			}

			text += '</tbody>';
			
			// 호선명 가져오기
			var shipName = getShipDescription(shipValue) || shipValue || '';
			if(shipName) {
				shipName = shipName.replace(/[\/\\?%*:|"<>]/g, '_'); // 파일명에 사용할 수 없는 문자 제거
			}
			
			// 조회기간 가져오기
			var inDate = $('#inDate').val() || '';
			var outDate = $('#outDate').val() || '';
			var dateRange = '';
			if(inDate && outDate) {
				dateRange = inDate.replace(/-/g, '') + '-' + outDate.replace(/-/g, '');
			}
			
			// 파일명: 앵카링식사신청_호선_조회기간(현재시간).xls
			var fileNameParts = ['앵카링식사신청'];
			if(shipName) {
				fileNameParts.push(shipName);
			}
			if(dateRange) {
				fileNameParts.push(dateRange);
			}
			fileNameParts.push('(' + getCurrentDateTimeForFileName() + ')');
			var fileName = fileNameParts.join('_') + '.xls';
			
			excelDownloadAllWithCustomFileName(text, fileName);
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

//QR발송 - 앵카링 식사신청
function sendQRSMS() {
	// 공통 함수 사용 (앵카링용)
	sendQRSMSCommon({
		qrType: 'AC',  // AC : 앵카링, SCH : 시운전
		getTrialKey: function() {
			// shipInput에서 trialKey 가져오기 (호선번호)
			let shipValue = deriveShipValueFromInput();
			if(!shipValue || shipValue === '' || shipValue === 'ALL') {
				return '';
			}
			// shipInput의 텍스트 값(호선번호) 가져오기
			return $('#shipInput').val() || getShipDescription(shipValue) || shipValue;
		},
		getReceiver: function(tr) {
			// SMS수신자 필드에서 가져오기 (textarea)
			let smsReceiver = tr.find('textarea[name=smsReceiver]').val() || '';
			// 쉼표로 구분된 번호를 배열로 변환하고, 첫 번째 번호 반환 (또는 여러 번호 처리)
			if(smsReceiver && smsReceiver.trim()) {
				// 쉼표로 분리하여 각 번호를 배열로 반환
				let phones = smsReceiver.split(',').map(function(phone) {
					return phone.trim();
				}).filter(function(phone) {
					return phone && phone.length > 0;
				});
				// 첫 번째 번호만 반환 (또는 여러 번호를 모두 사용하도록 수정 가능)
				return phones.length > 0 ? phones[0] : '';
			}
			return '';
		},
		getContent: function(itemData) {
			// 앵카링: 호선%26부서명 (trialKey%26department)
			let department = itemData.department || '';
			return itemData.trialKey + '%26' + department;
		},
		getItemName: function(tr) {
			let department = tr.find('input[name=department]').val() || '부서없음';
			return department;
		},
		checkPhoneRequired: false  // 앵카링의 경우 receiver 검증 방식이 다를 수 있음
	});
}

// 신청자 row 추가
function addAnch() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.add'));
		return;
	}
	
	// 실제 테이블에 있는 행 개수 확인 (빈 행, "There is no data to display" 행 제외)
	let existingRows = $('#tbRowList tr').filter(function() {
		let tr = $(this);
		// colspan이 있는 행이나 uid input이 없는 행은 데이터 행이 아님
		return tr.find('td[colspan]').length === 0 && tr.find('input[name="uid"]').length > 0;
	}).length;
	
	_anchCnt = existingRows + 1;
	let rowId = _tbRowId++;
		
	let text = '<tr id="tbRow_' + rowId + '">' + 
					'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center th-w-60"><div name="no">' + _anchCnt + '</div></td>' +
					/*'<td class="text-center" style="display: none">' + '<input name="uid" type="text" disabled>' + '</td>' + */
					'<td class="text-center" style="display: none">' + '<input name="uid" type="text" disabled>' + '</td>' + 
										
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

										text += '<td class="text-center align-middle p-0">' + 
													'<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">' + 
													'<input style="width: 100px;" name="lateNightP" class="text-center" type="text">' +
													'</div>' + 
													'<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">' + 
														'<input style="width: 100px;" name="lateNightR" disabled class="text-center" type="text">' +
													'</div>' + 
												'</td>';
					
					text += '<td class="text-center th-w-90">' + '<input name="orderStatus" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="orderDate" type="text" disabled>' + '</td>' +
					'<td class="text-center">' + '<input name="orderUid" type="text" disabled>' + '</td>'+
					'<td class="text-center th-w-60">' + '<input name="deleteYn" type="checkbox" value="N" onclick="setCheckBox(this)">' + '</td>' +
					'<td class="text-center">' + '<input name="comment" type="text">' + '</td>' +
					'<td class="text-center">' + '<input name="inputUid" type="text" disabled>' + '</td>' +
					'<td class="text-center">' + '<input name="inputDate" type="text" disabled>' + '</td>' +
					'<td class="text-center"><textarea name="smsReceiver" rows="2" style="width: 100%; min-width: 200px;" placeholder="010-0000-0000,&#10;010-0000-0001,"></textarea></td>';
	text += '</tr>';

	$('#tbRowList').append(text);
	
	// 행 번호 재설정
	resetRowNo();
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
	const shipValueForUpload = deriveShipValueFromInput();
	if(!shipValueForUpload) {
		alertPop($.i18n.t('errorShip'));
		return;
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
	let smsReceiverList = [];
	
	let breakfastPList = [];
	let lunchPList = [];
	let dinnerPList = [];
	let lateNightPList = [];
	const shipValueForExcel = deriveShipValueFromInput();
	const shipLabelForExcel = getShipDescription(shipValueForExcel) || shipValueForExcel;
	if(json.length > 0) {
		for(let i = 0; i < json.length; i++) {
			let data = json[i];		

			let projNo = shipLabelForExcel;
		
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
			let smsReceiver = isNull(data['SMS수신자'], '');
			
			if(department == '') {
				break;
			}
			projNoList.push(projNo);
			kindList.push(kind);
			domesticYnList.push(domesticYn);
			departmentList.push(department);
			mealDateList.push(mealDate);
			orderStatusList.push(orderStatus);
			commentList.push(comment);
			foodStyleList.push(foodStyle);
			breakfastPList.push(breakfastP);
			lunchPList.push(lunchP);
			dinnerPList.push(dinnerP);
			lateNightPList.push(lateNightP);
			smsReceiverList.push(smsReceiver);
		}
		
		if(isError) {
			alertPop(errMsg);
			
		}else {
			setExcelData(projNoList, kindList, domesticYnList, departmentList, mealDateList, orderStatusList, commentList, foodStyleList, breakfastPList,
				 lunchPList, dinnerPList, lateNightPList, smsReceiverList);
		}
	}else {
		alertPop($.i18n.t('excelUp.errorListMin'));
	}
	
	setListEmpty();
}

function buildShipAutoSourceBaseFromDOM() {
	const options = document.querySelectorAll('#shipSource option');
	const base = [];
	options.forEach(option => {
		if (!option) return;
		const value = (option.value || '').trim();
		const label = (option.textContent || '').trim();
		if (!value && !label) {
			return;
		}
		base.push({ value, label: label || value });
	});
	window.shipAutoSourceBase = base;
	window.shipAutoSource = base.slice();
}

function initShipAutocomplete() {
	const $input = $('#shipInput');
	if (!$input.length || typeof $input.autocomplete !== 'function') return;

	$input.autocomplete({
		minLength: SHIP_AUTOCOMPLETE_MIN_LENGTH,
		delay: 200,
		source: shipAutocompleteSource,
		focus: function(event, ui) {
			event.preventDefault();
			if (ui && ui.item) {
				$input.val(ui.item.label);
			}
		},
		select: function(event, ui) {
			event.preventDefault();
			if (ui && ui.item) {
				setShipValue(ui.item.value, ui.item.label);
				// getAnchMealList(); // shipSource select 선택시 조회 웹서비스 바로 실행 방지
			}
		}
	});

	$input.on('input', function() {
		$('#ship').val('');
	});

	$input.on('blur', function() {
		deriveShipValueFromInput();
	});
}

function shipAutocompleteSource(request, response) {
	const term = (request.term || '').trim().toUpperCase();
	const source = getShipSourceArray();
	if (!term) {
		response(source.slice(0, 20));
		return;
	}
	const matches = source.filter(item => {
		if (!item) return false;
		const value = (item.value || '').toString().toUpperCase();
		const label = (item.label || '').toString().toUpperCase();
		return value.includes(term) || label.includes(term);
	});
	response(matches.slice(0, 20));
}

function updateShipAutocompleteSource() {
	if (!window.shipAutoSourceBase) {
		buildShipAutoSourceBaseFromDOM();
	}
	window.shipAutoSource = (window.shipAutoSourceBase || []).slice();
	const $input = $('#shipInput');
	if ($input.length && $input.data('ui-autocomplete')) {
		$input.autocomplete('option', 'source', shipAutocompleteSource);
	}
}

function setShipValue(value, label) {
	const sanitizedValue = value || '';
	$('#ship').val(sanitizedValue);
	if (label !== undefined) {
		$('#shipInput').val(label);
	} else if (!sanitizedValue) {
		$('#shipInput').val('');
	} else {
		const desc = getShipDescription(sanitizedValue);
		$('#shipInput').val(desc || sanitizedValue);
	}
}

function getShipDescription(value) {
	const match = findShipOption(value, false);
	return match ? match.label : '';
}

function findShipOption(term, allowPartial) {
	const source = getShipSourceArray();
	const raw = (term || '').toString().trim();
	if (!raw) return null;
	const upper = raw.toUpperCase();
	let partialMatch = null;
	for (const item of source) {
		if (!item) continue;
		const val = (item.value || '').toString();
		const label = (item.label || '').toString();
		if (val.toUpperCase() === upper || label.toUpperCase() === upper) {
			return item;
		}
		if (allowPartial && !partialMatch && (val.toUpperCase().includes(upper) || label.toUpperCase().includes(upper))) {
			partialMatch = item;
		}
	}
	return allowPartial ? partialMatch : null;
}

function deriveShipValueFromInput() {
	const $input = $('#shipInput');
	if (!$input.length) {
		return $('#ship').val() || '';
	}
	const raw = ($input.val() || '').trim();
	if (!raw) {
		setShipValue('', '');
		return '';
	}
	const match = findShipOption(raw, true);
	if (match) {
		setShipValue(match.value, match.label);
		return match.value;
	}
	setShipValue(raw, raw);
	return raw;
}

function getShipSourceArray() {
	if (window.shipAutoSource && window.shipAutoSource.length) {
		return window.shipAutoSource;
	}
	return window.shipAutoSourceBase || [];
}

// 양식 업로드 데이터 세팅.
function setExcelData(projNoList, kindList, domesticYnList, departmentList, mealDateList, orderStatusList, commentList, foodStyleList, breakfastPList,
				 lunchPList, dinnerPList, lateNightPList, smsReceiverList) {
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
		
		let mealDate = mealDateList[i];
		let foodStyle = foodStyleList[i];
		let breakfastP = breakfastPList[i];
		let lunchP = lunchPList[i];
		let dinnerP = dinnerPList[i];
		let lateNightP = lateNightPList[i];
		let orderStatus = orderStatusList[i];
		let comment = commentList[i];
		let smsReceiver = smsReceiverList && smsReceiverList[i] ? smsReceiverList[i] : '';
		
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
							'<td class="text-center"  style="display: none">'+ '<input name="uid" type="text" value="' + uid + '" disabled>' + '</td>' +
							'<td class="text-center">' + '<input name="projNo" type="text" value="' + projNo + '" disabled>' + '</td>' + 
							
							'<td class="text-center">' + 
								'<select name="kind">';
							text += '<option value="S"' + (kind == '직영' ? ' selected' : '') + '>직영</option>' + 
									'<option value="H"' + (kind == '협력사' ? ' selected' : '') + '>협력사</option>'+
									'<option value="V"' + (kind == '방문객' ? ' selected' : '') + '>방문객</option>'+
									'<option value="O"' + (kind == 'Owner/Class' ? ' selected' : '') + '>Owner/Class</option>';
						text += '</select>' +
						
							'<td class="text-center">' + 
								'<select name="domesticYn">';
							text += '<option value="Y"' + (domesticYn == '내국' ? ' selected' : '') + '>내국</option>' + 
									'<option value="N"' + (domesticYn == '외국' ? ' selected' : '') + '>외국</option>';
						text += '</select>' +
							
							'<td class="text-center">' + '<input name="department" type="text" value="' + department + '">' + '</td>' + 												
							'<td class="text-center th-w-200">' + '<input name="mealDate" class="text-center" type="date" value="' + mealDate + '" >' + '</td>'+							
							'<td class="text-center">' + 
								'<select name="foodStyle" >';
								
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
																
							'<td class="text-center th-w-90">' + '<input name="orderStatus" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (orderStatus === 'Y' ? 'checked' : '') + '>' + '</td>'+
							'<td class="text-center">' + '<input name="orderDate" type="text" disabled value="' + orderDate + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="orderUid" type="text" disabled value="' + orderUid + '">' + '</td>' + 												
							'<td class="text-center th-w-60">' + '<input name="deleteYn" type="checkbox" disabled value="Y" onclick="setCheckBox(this)"' + (deleteYn === 'Y' ? 'checked' : '') + '>' + '</td>'+
							'<td class="text-center">' + '<input name="comment" type="text" value="' + comment + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="inputUid" type="text" disabled value="' + inputUid + '">' + '</td>' + 												
							'<td class="text-center">' + '<input name="inputDate" type="text" disabled value="' + inputDate + '">' + '</td>' +
							'<td class="text-center"><textarea name="smsReceiver" rows="2" style="width: 100%; min-width: 200px;" placeholder="010-0000-0000,&#10;010-0000-0001,">' + (smsReceiver ? smsReceiver.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '') + '</textarea></td>';
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
	let smsReceiver = [];
	
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
	let smsReceiverVl = document.getElementsByName('smsReceiver');
	
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
	const currentShipValue = deriveShipValueFromInput();
	const currentShipLabel = getShipDescription(currentShipValue) || currentShipValue;
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
			if(!currentShipValue) {
					alertPop($.i18n.t('errorShip'));
					isError = true;
			}
		}
	}
	//alert(sessionUserID);
	/*alert($("#ship option:selected").val());
	alert($("#ship option:selected").text());
	alert(trialKeyVl[1].value);*/
	
	// 구분, 부서명, 날짜, 한식/양식 중복 체크용 맵
	let duplicateCheckMap = new Map();
	
	// 구분 표시명 가져오기 함수
	function getKindLabel(value) {
		const kindMap = {
			'S': '직영',
			'H': '협력사',
			'V': '방문객',
			'O': 'Owner/Class'
		};
		return kindMap[value] || value;
	}
	
	// 한식/양식 표시명 가져오기 함수
	function getFoodStyleLabel(value) {
		const foodStyleMap = {
			'K': '한식',
			'W': '양식(Normal Western)',
			'H': '양식(Halal)',
			'V1': '양식(Veg. fruitarian)',
			'V2': '양식(Veg. vegan)',
			'V3': '양식(Veg. lacto-veg.)',
			'V4': '양식(Veg. ovo-veg.)',
			'V5': '양식(Veg. lacto-ovo-veg.)',
			'V6': '양식(Veg. pesco-veg.)',
			'V7': '양식(Veg. pollo-veg.)',
			'V8': '양식(Veg. flexitarian)'
		};
		return foodStyleMap[value] || value;
	}
	
	// 날짜시간 포맷 함수
	function formatDateTime(dateStr) {
		if(!dateStr || dateStr === '' || dateStr === 'null') {
			return '';
		}
		// 날짜 문자열이 이미 시간 포함인 경우
		if(dateStr.length > 10) {
			// YYYY-MM-DD HH:MM:SS 형식으로 변환
			return dateStr.replace('T', ' ').substring(0, 19);
		}
		// 날짜만 있는 경우 시간 추가
		return dateStr + ' 00:00:00';
	}
	
	for(let i = 0; i < kindVl.length; i++) {
		//alert(3);
		uidVl[i].value = uidVl[i] && uidVl[i].value !== "" ? uidVl[i].value : -1;
		
		if(isEmpty(projNoVl[i].value)) {
			projNoVl[i].value = currentShipLabel;
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
		
		if(isEmpty(mealDateVl[i].value)) {
			alertPop('날짜를 선택해 주세요.');
			mealDateVl[i].focus();
			isError = true;
			break;
		}
		
		// 구분, 부서명, 날짜, 한식/양식 중복 체크
		let kindValue = (kindVl[i].value || '').trim();
		let deptValue = (departmentVl[i].value || '').trim();
		let mealDateValue = (mealDateVl[i].value || '').trim();
		let foodStyleValue = (foodStyleVl[i].value || '').trim();
		
		if(kindValue && deptValue && mealDateValue && foodStyleValue) {
			let key = kindValue + '|' + deptValue + '|' + mealDateValue + '|' + foodStyleValue;
			
			if(duplicateCheckMap.has(key)) {
				// 중복 발견
				let kindLabel = getKindLabel(kindValue);
				let foodStyleLabel = foodStyleVl[i].options[foodStyleVl[i].selectedIndex].text || foodStyleValue;
				
				let duplicateMsg = ' 저장실패 데이터 중복 :' +
								   kindLabel + ','+ deptValue + ','+ mealDateValue + ','+ foodStyleLabel 
				// 중복되는 마지막 row 인덱스 저장
				let duplicateRowIndex = i;
				
				// 알람 팝업이 닫힌 후 포커스 설정
				let $modal = $('#alertPop, #alertPopLg');
				$modal.one('hidden.bs.modal', function() {
					setTimeout(function() {
						if(departmentVl[duplicateRowIndex]) {
							departmentVl[duplicateRowIndex].focus();
							departmentVl[duplicateRowIndex].select();
						}
					}, 100);
				});
				
				alertPopHtml(duplicateMsg);
				isError = true;
				break;
			} else {
				duplicateCheckMap.set(key, i);
			}
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
		
		// SMS수신자 파싱 (쉼표 또는 줄바꿈으로 구분)
		let smsReceiverText = smsReceiverVl[i] ? (smsReceiverVl[i].value || '') : '';
		let smsReceiverParsed = '';
		if(smsReceiverText && smsReceiverText.trim() !== '') {
			// 쉼표 또는 줄바꿈으로 구분하여 전화번호 추출
			let phoneNumbers = smsReceiverText.split(/[,\n\r]+/).map(function(phone) {
				return phone.trim();
			}).filter(function(phone) {
				return phone && phone.length > 0;
			});
			// 쉼표로 다시 연결하여 전송 (서버에서 다시 파싱)
			smsReceiverParsed = phoneNumbers.join(',');
		}
		// SMS수신자는 서버에서 개별 저장하므로 전체 문자열로 전송
		smsReceiver.push(smsReceiverParsed);
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
			lateNightR: lateNightR,
			smsReceiver: smsReceiver
			
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
	//getAnchMealList();
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

	