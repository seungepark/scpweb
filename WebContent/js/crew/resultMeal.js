let _anchCnt = 0;
let _inDate = "";
let _outDate = "";
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
	
	// 오늘 날짜 기본값 세팅
	let today = new Date();
	today.setDate(today.getDate());
	let todayStr = today.toISOString().slice(0, 10);
	
	let endDate = new Date();
	endDate.setDate(endDate.getDate());
	let endDateStr = endDate.toISOString().slice(0, 10);

	if (!$('#inDate').val() || $('#inDate').val() === '') {
		$('#inDate').val(todayStr);
	}
	if (!$('#outDate').val() || $('#outDate').val() === '') {
		$('#outDate').val(endDateStr);
	}

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

	// 오늘 날짜 기본값 세팅
	let today = new Date();
	today.setDate(today.getDate());
	let todayStr = today.toISOString().slice(0, 10);
	
	let endDate = new Date();
	endDate.setDate(endDate.getDate());
	let endDateStr = endDate.toISOString().slice(0, 10);

	if (!$('#inDate').val() || $('#inDate').val() === '') {
		$('#inDate').val(todayStr);
	}
	if (!$('#outDate').val() || $('#outDate').val() === '') {
		$('#outDate').val(endDateStr);
	}

	// 날짜값 기준 (입출항일)
	let start = new Date($('#inDate').val());
	let end = new Date($('#outDate').val());

	let text = '';

	// 기본 고정 컬럼
	text += `
		<th><div class="tb-th-col th-w-40"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>
		<th><div class="tb-th-col th-w-60"><span class="tb-th-content">${$.i18n.t('list.no')}</span></div></th>
		<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.projNo')}</span></div></th>
		<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.department')}</span></div></th>
		<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.kind')}</span></div></th>
		<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.foodStyle')}</span></div></th>
		`;
	
	//Total
	/*text += `
		<th colspan="4" class="date-header">
			<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
				<span class="tb-th-content fw-bold">Total</span>
			</div>
			<div class="d-flex align-items-center just	ify-content-center px-1 inout_performance_h">
				<table class="text-center borderless" style="width:300px;">
					<tr>
						<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
						<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
						<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
						<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
					</tr>
				</table>
			</div>
		</th>
		`;*/

	// 날짜 컬럼 (조식/중식/석식/야식)
	while (start <= end) {
		let dateStr = start.toISOString().slice(0, 10);
		text += `
			<th colspan="4" class="date-header">
				<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
					<span class="tb-th-content fw-bold">${dateStr}</span>
				</div>
				<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">
					<table class="text-center borderless" style="width: 300px;">
						<tr>
							<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
							<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
							<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
							<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
						</tr>
					</table>
				</div>
			</th>
		`;
		start.setDate(start.getDate() + 1);
	}

	// 테이블 헤더 세팅
	$('#tbHeader').empty();
	$('#tbHeader').append(`<tr>${text}</tr>`);

	setListEmpty();

	// 전체 선택 체크박스 이벤트
	$('#tbRowAllChk').click(function() {
		if ($('#tbRowAllChk').is(':checked')) {
			let listChkList = document.getElementsByName('listChk');
			for (let i = 0; i < listChkList.length; i++) {
				if (listChkList[i].parentElement.parentElement.style.displcay !== 'none') {
					listChkList[i].checked = true;
				}
			}
		} else {
			$('input[name=listChk]').prop('checked', false);
		}
		setRowSelected();
	});
}
// 기존 데이터 세팅.
function initData() {
	$('#tbRowList').empty();
	
	//조회날짜
	let inDate = $('#inDate').val();
	let outDate = $('#outDate').val();
	
	if (!inDate || !outDate) return;

	let startDate = new Date(inDate);
	let endDate = new Date(outDate);
	
	let meals = ['조식', '중식', '석식', '야식'];

	let _anchCnt = 0;
	let _tbRowId = 0;

	for(let z = 0; z < _anchList.length; z++) {
		_anchCnt++;
		//let uid = _anchList[z].uid;
		let rowId = _tbRowId++;
		let projNo = _anchList[z].projNo;
		let department = _anchList[z].department;
		let mealDate = _anchList[z].mealDate;
		let planList = _anchList[z].planList;
		let resultList = _anchList[z].resultList;
		
		//planMap/resultMap 구성
		//발주(한식)
		let planMap_K = {};
		//발주(양식)
		let planMap_W = {};
		
		//실적(한식)
		let resultMap_K = {};
		//실적(양식)
		let resultMap_W = {};
		
		let total_K = 0;
		let total_W = 0;

	    planList.forEach(function(p) {
			if(p.planMealGubun === 'K' || p.planMealGubun === '한식'){
				//alert("한식 : " + p.planMealGubun);
				let dateKey = p.planMealDate ? p.planMealDate.substring(0, 10) : null;
			    if (!dateKey) return;
			    if (!planMap_K[dateKey]) planMap_K[dateKey] = {};
			    planMap_K[dateKey][p.planMealTime] = p.planMealQty || '';
				total_K = total_K + p.planMealQty;
			}
			else{
				//alert("양식 : " + p.planMealGubun);
				let dateKey = p.planMealDate ? p.planMealDate.substring(0, 10) : null;
			    if (!dateKey) return;
			    if (!planMap_W[dateKey]) planMap_W[dateKey] = {};
			    planMap_W[dateKey][p.planMealTime] = p.planMealQty || '';
				total_W = total_W + p.planMealQty;
			}
	    });
		
	    resultList.forEach(function(r) {
			if(r.resultMealGubun === 'K' || r.resultMealGubun === '한식'){
				//alert("한식(r) : " +r.planMealGubun);
				let dateKey = r.resultMealDate ? r.resultMealDate.substring(0, 10) : null;
		        if (!dateKey) return;
		        if (!resultMap_K[dateKey]) resultMap_K[dateKey] = {};
		        resultMap_K[dateKey][r.resultMealTime] = r.resultMealQty || '';	
			}
			else{
				//alert("양식(r) : " + r.resultMealDate);
				let dateKey = r.resultMealDate ? r.resultMealDate.substring(0, 10) : null;
		        if (!dateKey) return;
		        if (!resultMap_W[dateKey]) resultMap_W[dateKey] = {};
		        resultMap_W[dateKey][r.resultMealTime] = r.resultMealQty || '';	
			}
	    });


		let text = "";
		text += '<tr id="tbRow_' + rowId + '">' + 
					'<td class="text-center th-w-40"><input  type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
					'<td class="text-center th-w-60"><div class="text-center" name="no">' + _anchCnt + '</div></td>' +
					'<td class="text-center th-w-90">' + '<div  name="projNo">' + projNo + '</div></td>' + 
					'<td class="text-center th-w-90">' + '<div name="department">' + department + '</div></td>';
					
		    text += '<td class="text-center th-w-90 align-middle crew-inout-label p-0">' + 
						'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
						'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
					'</td>';
				
			text += '<td style = "width: 300px;" class="text-center th-w-200 align-middle crew-inout-label p-0">' + 
						'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + "한식" + '</div>' + 
						'<div class="align-items-center border-bottom px-1 inout_performance_h">' + "양식" + '</div>' + 
						'<div class="align-items-center border-bottom px-1 inout_performance_h">' + "한식" + '</div>' + 
						'<div class="align-items-center inout_performance_h">' + "양식" + '</div>' + 
					'</td>';			
			
			// 날짜 루프
		    let cur = new Date(startDate);
		    while (cur <= endDate) {
		      let dateKey = cur.toISOString().slice(0, 10);
		      for (let i = 0; i < meals.length; i++) {
				let meal = meals[i];
	            let planQty_K = planMap_K[dateKey] && planMap_K[dateKey][meal] ? planMap_K[dateKey][meal] : '';
	            let planQty_W = planMap_W[dateKey] && planMap_W[dateKey][meal] ? planMap_W[dateKey][meal] : '';
			    let resultQty_K = resultMap_K[dateKey] && resultMap_K[dateKey][meal] ? resultMap_K[dateKey][meal] : '';
			    let resultQty_W = resultMap_W[dateKey] && resultMap_W[dateKey][meal] ? resultMap_W[dateKey][meal] : '';
				text += '<td  class="text-center  align-middle crew-inout-label p-0">' + 
	            	    '<div class="text-center"><input style="width: 60px;"  name="planK_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + planQty_K + '"></div>' +
			            '<div class="text-center"><input style="width: 60px;"  name="planW_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + planQty_W + '"></div>' +
						'<div class="text-center"><input style="width: 60px;"  name="resultK_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + resultQty_K + '"></div>' +
						'<div class="text-center"><input style="width: 60px;"  name="resultW_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + resultQty_W + '"></div>' +
						'</td>';	
		      }
		      cur.setDate(cur.getDate() + 1);
		    }		
					
		text += '</tr>';	
		//alert(text);
		$('#tbRowList').append(text);
	}	
	//paging(_crewList.length, 1);
	//setListEmpty();
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

		getMealResultList(1);
	}
	else {
		getMealResultList(1);
	}
}

function getMealResultList(page) {
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
	
	let startDate = new Date(inDate);
	let endDate = new Date(outDate);
	
	//페이지 셋팅(현재페이지 저장X)
	_isSetPage = false;
	page = 1;
	
    jQuery.ajax({
        type: 'GET',
        url: contextPath + '/crew/getMealResultList.html',		
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
			var dataText = '';
            listArr = json.list;
			let meals = ['조식', '중식', '석식', '야식'];
			
			//헤더 셋팅
			//기본 고정 컬럼
			text += `
				<th><div class="tb-th-col th-w-40"><span class="tb-th-content"><input type="checkbox" id="tbRowAllChk"></span></div></th>
				<th><div class="tb-th-col th-w-60"><span class="tb-th-content">${$.i18n.t('list.no')}</span></div></th>
				<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.projNo')}</span></div></th>
				<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.department')}</span></div></th>
				<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.kind')}</span></div></th>
				<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.foodStyle')}</span></div></th>
				`;

			//Total
			/*text += `
				<th colspan="4" class="date-header">
					<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
						<span class="tb-th-content fw-bold">Total</span>
					</div>
					<div class="d-flex align-items-center just	ify-content-center px-1 inout_performance_h">
						<table class="text-center borderless" style="width: 300px;">
							<tr>
								<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
								<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
								<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
								<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
							</tr>
						</table>
					</div>
				</th>
				`;*/

			// 날짜 컬럼 (조식/중식/석식/야식)
			while (startDate <= endDate) {
				let dateStr = startDate.toISOString().slice(0, 10);
				text += `
					<th colspan="4" class="date-header">
						<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
							<span class="tb-th-content fw-bold">${dateStr}</span>
						</div>
						<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">
							<table class="text-center borderless" style="width: 300px;>
								<tr>
									<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
									<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
									<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
									<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
								</tr>
							</table>
						</div>
					</th>
				`;
				startDate.setDate(startDate.getDate() + 1);
			};
			// 테이블 헤더 세팅
			$('#tbHeader').empty();
			$('#tbHeader').append(`<tr>${text}</tr>`);
			
			startDate = new Date(inDate);
			
			for(var i = 0; i < json.list.length; i++) {					
					let rowId = i+1;
					let uid = json.list[i].uid;
					let projNo = json.list[i].projNo;
					let department = json.list[i].department;
					let mealDate = json.list[i].mealDate;
					let planList = json.list[i].planList;
					let resultList = json.list[i].resultList;
					
					//planMap/resultMap 구성
					//발주(한식)
					let planMap_K = {};
					//발주(양식)
					let planMap_W = {};

					//실적(한식)
					let resultMap_K = {};
					//실적(양식)
					let resultMap_W = {};

					planList.forEach(function(p) {
						if(p.planMealGubun === 'K' || p.planMealGubun === '한식' ){
							//alert("한식 : " + p.planMealGubun);
							let dateKey = p.planMealDate ? p.planMealDate.substring(0, 10) : null;
						    if (!dateKey) return;
						    if (!planMap_K[dateKey]) planMap_K[dateKey] = {};
						    planMap_K[dateKey][p.planMealTime] = p.planMealQty || '';
						}
						else{
							//alert("양식 : " + p.planMealGubun);
							let dateKey = p.planMealDate ? p.planMealDate.substring(0, 10) : null;
						    if (!dateKey) return;
						    if (!planMap_W[dateKey]) planMap_W[dateKey] = {};
						    planMap_W[dateKey][p.planMealTime] = p.planMealQty || '';
						}
					});

					resultList.forEach(function(r) {
						if(r.resultMealGubun === 'K' || r.resultMealGubun === '한식' ){
							//alert("한식(r) : " +r.planMealGubun);
							let dateKey = r.resultMealDate ? r.resultMealDate.substring(0, 10) : null;
					        if (!dateKey) return;
					        if (!resultMap_K[dateKey]) resultMap_K[dateKey] = {};
					        resultMap_K[dateKey][r.resultMealTime] = r.resultMealQty || '';	
						}
						else{
							//alert("양식(r) : " + r.resultMealDate);
							let dateKey = r.resultMealDate ? r.resultMealDate.substring(0, 10) : null;
					        if (!dateKey) return;
					        if (!resultMap_W[dateKey]) resultMap_W[dateKey] = {};
					        resultMap_W[dateKey][r.resultMealTime] = r.resultMealQty || '';	
						}
					});
					
				dataText += '<tr id="tbRow_' + rowId + '">' + 
							'<td class="text-center th-w-40"><input type="checkbox" name="listChk" onclick="setRowSelected()"></td>' +
							'<td class="text-center th-w-60"><div class="text-center" name="no">' + _anchCnt + '</div></td>' +
							'<td class="text-center th-w-90">' + '<div  name="projNo">' + projNo + '</div></td>' + 
							'<td class="text-center th-w-90">' + '<div name="department">' + department + '</div></td>';
							
			    dataText += '<td class="text-center th-w-90 align-middle crew-inout-label p-0">' + 
							'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + $.i18n.t('list.plan') + '</div>' + 
							'<div class="align-items-center inout_performance_h">' + $.i18n.t('list.result') + '</div>' + 
						'</td>';
					
				dataText += '<td class="text-center th-w-90 align-middle crew-inout-label p-0">' + 
							'<div class="align-items-center border-bottom px-1 inout_scheduler_h">' + "한식" + '</div>' + 
							'<div class="align-items-center border-bottom px-1 inout_performance_h">' + "양식" + '</div>' + 
							'<div class="align-items-center border-bottom px-1 inout_performance_h">' + "한식" + '</div>' + 
							'<div class="align-items-center inout_performance_h">' + "양식" + '</div>' + 
						'</td>';			
				
				//Total		
						
				// 날짜 루프
			    let cur = new Date(startDate);
				
			    while (cur <= endDate) {
			      let dateKey = cur.toISOString().slice(0, 10);
			      for (let i = 0; i < meals.length; i++) {
					let meal = meals[i];
			        let planQty_K = planMap_K[dateKey] && planMap_K[dateKey][meal] ? planMap_K[dateKey][meal] : '';
			        let planQty_W = planMap_W[dateKey] && planMap_W[dateKey][meal] ? planMap_W[dateKey][meal] : '';
				    let resultQty_K = resultMap_K[dateKey] && resultMap_K[dateKey][meal] ? resultMap_K[dateKey][meal] : '';
				    let resultQty_W = resultMap_W[dateKey] && resultMap_W[dateKey][meal] ? resultMap_W[dateKey][meal] : '';
					dataText += '<td  class="text-center  align-middle crew-inout-label p-0">' + 
			        	    '<div class="text-center"><input style="width: 60px;" disabled name="planK_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + planQty_K + '"></div>' +
				            '<div class="text-center"><input style="width: 60px;" disabled name="planW_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + planQty_W + '"></div>' +
							'<div class="text-center"><input style="width: 60px;" disabled name="resultK_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + resultQty_K + '"></div>' +
							'<div class="text-center"><input style="width: 60px;" disabled name="resultW_' + dateKey + '_' + meal + '" class="text-center" type="text" value="' + resultQty_W + '"></div>' +
							'</td>';	
			      }
			      cur.setDate(cur.getDate() + 1);
			    }		
						
			dataText += '</tr>';	
			//alert(dataText);
			}
			
			// 테이블 데이터 세팅
            $('#tbRowList').empty();

            if(json.list.length > 0) {
                $('#tbRowList').append(dataText);
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

//엑셀 다운로드
function anchListDownloadAll() {
	var search = $("#search").val();
	var _cnt = 0;
	
	var ship = $("#ship option:selected").val();
	var inDate = $('#inDate').val();
	var outDate = $('#outDate').val();

	let start = new Date(inDate);
	let end = new Date(outDate);

	$.ajax({
		type : "GET",
		url : contextPath + "/crew/getMealResultList.html",
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
	        ship: ship,
	        inDate: inDate,
	        outDate: outDate,
	        sort: listSort,
	        order: listOrder,
            sort: listSort,
            order: listOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			
			var text = '<thead>' +
							'<tr class="headings">';
							// 기본 고정 컬럼
							text += `
								<th><div class="tb-th-col th-w-60"><span class="tb-th-content">${$.i18n.t('list.no')}</span></div></th>
								<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.projNo')}</span></div></th>
								<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.department')}</span></div></th>
								<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.kind')}</span></div></th>
								<th><div class="tb-th-col th-w-90"><span class="tb-th-content">${$.i18n.t('list.foodStyle')}</span></div></th>
								`;

							//Total
								/*text += `
									<th colspan="4" class="date-header">
										<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
											<span class="tb-th-content fw-bold">Total</span>
										</div>
										<div class="d-flex align-items-center just	ify-content-center px-1 inout_performance_h">
											<table class="text-center borderless" style="width:300px;">
												<tr>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
												</tr>
											</table>
										</div>
									</th>
									`;*/

							// 날짜 컬럼 (조식/중식/석식/야식)
							while (start <= end) {
								let dateStr = start.toISOString().slice(0, 10);
								text += `
									<th colspan="4" class="date-header">
										<div class="d-flex align-items-center justify-content-center border-bottom px-1 inout_scheduler_h">
											<span class="tb-th-content fw-bold">${dateStr}</span>
										</div>
										<div class="d-flex align-items-center justify-content-center px-1 inout_performance_h">
											<table class="text-center borderless" style="width: 300px;">
												<tr>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.breakfast')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lunch')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.dinner')}</th>
													<th class="small-th tb-th-content th-w-90">${$.i18n.t('list.lateNight')}</th>
												</tr>
											</table>
										</div>
									</th>
									`;
								start.setDate(start.getDate() + 1);
							}
							text += '</tr>' +
						'</thead>' +
						'<tbody id="getUserList">';
						
						//row데이터 확인
						
			text += '</tbody>';
			
			excelDownloadAll(text, 'anch_Result_list');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}
	