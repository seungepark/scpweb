let scheCodeTrIdx = 0;			/// 스케줄 코드 다음 인덱스 (추가 후 ++)
let scheCodeDetList = [];
let scheTcSearchList = [];
let curTcSearchTr = null;
let addMultiScheTcSearchList = [];				// TC 멀티 추가용 전체 TC 검색 목록.
let addMultiScheTcSearchListSelectIdx = [];		// TC 멀티 추가용 추가 대상 TC 데이터 인덱스 목록.

$(function(){
	initI18n();
	init();
	
	getScheCodeDetList();
	
	initServerCheck();
	autocompleteOff();
});

function initI18n() {
	var lang = initLang();

	$.i18n.init({
	    lng: lang,
	    fallbackLng: FALLBACK_LNG,
	    fallbackOnNull: false,
	    fallbackOnEmpty: false,
	    useLocalStorage: false,
	    ns: {
	      namespaces: ['share', 'mngModScheCode'],
	      defaultNs: 'mngModScheCode'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init(){
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	$('#scheRowAllChk').click(function(){
		if($(this).is(':checked')) {
			$('input[name=scheCDetChk]').prop('checked', true);
		}else {
			$('input[name=scheCDetChk]').prop('checked', false);
		}
		
		setRowSelectedSetName('scheCDetChk');
	});
	
	// Tcnum Search 팝업 조회 이벤트 설정
	$('#searchTcPopTcnum, #searchTcPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchTcPopSearch(1);
		}
	});
	
	$('#addMultiSearchTcPopListAllChk').click(function(){
        if($('#addMultiSearchTcPopListAllChk').is(':checked')) {
            $('input[name=addMultiSearchTcPopListChk]').prop('checked', true);
        }else {
            $('input[name=addMultiSearchTcPopListChk]').prop('checked', false);
        }

		addMultiSearchTcPopRefreshSelectList();
    });
}

function getScheCodeDetList(){
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/scheBasic/getScheCodeDetList.html",
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
			isAll: 'Y',
			uid: scheCodeUid,
			search2: 'chart'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			scheCodeDetList = [];
			scheCodeDetList.push(result.list); // scheCodeDetList 배열 담기
			
			// Schedule Detail 스크롤 및 기본 크기 설정
			$("#dDataPanel").css('overflow-y', 'auto');
			$("#dDataPanel").css('max-height', (screen.height * 0.45) + 'px');
			
			for(let i in jsonResult) {
				
				text +=`
					<tr id="scheCodeDetModTr${i}">
						<td class="text-center"><input type="checkbox" data-uid="${jsonResult[i].uid}" data-flag="R" name="scheCDetChk" onclick="setRowSelectedSetName('scheCDetChk')"></td>
						<td class=""><select class="" name="scheCDetCodeLv">${getCodeLevelSel(jsonResult[i])}</select></td>
						<td class="">
							<div class="d-flex align-items-center">
								<div>
									<input name="scheCDetTc" type="text" class="inputSearch inputSeachReadOnlyBackColor" data-schehieruid="${jsonResult[i].schehierarchyuid}" data-lv1code="${jsonResult[i].lv1code}" data-lv2code="${jsonResult[i].lv2code}" data-lv3code="${jsonResult[i].lv3code}" data-lv4code ="${jsonResult[i].lv4code}" value="${jsonResult[i].displaycode}" readonly>
								</div>
								<div class="flex-grow-1">
									<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
								</div>
							</div>
						</td>
						<td class=""><input type="text" name="scheCDetDesc" class="" value="${jsonResult[i].description}"></td>
						<td class=""><select name="scheCDetCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'ctype')}</select></td>
						<td class=""><input type="text" name="scheCDetLoadStr" class=" scheLoad" value="${jsonResult[i].loadstr}"></td>
						<td class=""><input type="text" name="scheCDetLoadRate" class=" scheLoad" value="${getFloatVal(jsonResult[i].loadrate)}" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
						<td class=""><select name="scheCDetDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'dtype')}</select></td>
						<td class=""><input type="text" name="scheCDetPer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheCDetReadTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
					</tr>`;
				
				scheCodeTrIdx = i;
			}

			$("#getScheCodeDetList").empty();
      
			if(text == '') {
				$("#getScheCodeDetList").append('<tr><td class="text-center" colspan="13">' + $.i18n.t('share:noList') + '</td></tr>');
			} else{
				$("#getScheCodeDetList").append(text);
				
				// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
				setCompEvent();
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
	
}

// 스케줄 추가 - 250205 사용안함 : 멀티 추가로 변경.
function addScheduleCodeDet() {
	const chkList = $('input[name=scheCDetChk]:checked');
	if(chkList.length > 1 ) {
		alertPop($.i18n.t('selectOneMsg'));
	} else{
		scheCodeTrIdx++; 
		
		const text =`
			<tr id="scheCodeDetModTr${scheCodeTrIdx}">
				<td class="text-center"><input type="checkbox" data-uid="-1" data-flag="C" name="scheCDetChk" onclick="setRowSelectedSetName('scheCDetChk')"></td>
				<td class=""><select class="" name="scheCDetCodeLv">${getCodeLevelSel(0)}</select></td>
				<td class="">
					<div class="d-flex align-items-center">
						<div>
							<input name="scheCDetTc" type="text" class="inputSearch inputSeachReadOnlyBackColor" data-schehieruid="" data-lv1code="" data-lv2code="" data-lv3code="" data-lv4code ="" value="" readonly>
						</div>
						<div class="flex-grow-1">
							<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${scheCodeTrIdx})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
						</div>
					</div>
				</td>
				<td class=""><input type="text" name="scheCDetDesc" class="" value=""></td>
				<td class=""><select name="scheCDetCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(null, 'ctype')}</select></td>
				<td class=""><input type="text" name="scheCDetLoadStr" class=" scheLoad" value=""></td>
				<td class=""><input type="text" name="scheCDetLoadRate" class=" scheLoad" value="" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
				<td class=""><select name="scheCDetDtype"class=" scheDtype"><option value=""></option>${getTypeSelOption(null, 'dtype')}</select></td>
				<td class=""><input type="text" name="scheCDetPer" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetReadTm" class=" schePer" value="0" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="${getNextSeq()}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value=""></td>
				<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
			</tr>`;
		
		if(chkList.length == 1){
			chkList.eq(0).closest('tr').after(text)
			chkList.eq(0).prop('checked', false);
		} else{
			$('#getScheCodeDetList').append(text);
		}
		
		// ADD 한 행으로 Focus 이동 
		$('#scheCodeDetModTr' + scheCodeTrIdx).children().find('select[name="scheCDetCodeLv"]').focus();
		
	}
}

// 컴포넌트 및 이벤트 추가
function setCompEvent(){
	// checkbox 이벤트 변경
	$('#getScheCodeDetList').on('click', 'input[name=scheCDetChk]', function() {
		if($(this).is(':checked')){
			$(this).closest('tr').children().find('input[type="checkbox"]').not($(this)).prop('checked', true);
		} else{
			$(this).closest('tr').children().find('input[type="checkbox"]').not($(this)).prop('checked', false);
		}
	});
	
	// 입력 컴포넌트 변경 이벤트
	const inputAll = 'select[name="scheCDetCodeLv"], input[name="scheCDetTc"], input[name="scheCDetDesc"], select[name="scheCDetDtype"], select[name="scheCDetCtype"], input[name="scheCDetLoadStr"], input[name="scheCDetLoadRate"], input[name="scheCDetPer"], input[name="scheCDetReadTm"]';
	$('#getScheCodeDetList').on('change', inputAll, function(e){
		// Flag 처리 
		setFlag($(this));
	});
	
	// 동일TC 변경 컴포넌트 이벤트 설정
	setSameTcEvent('input[name="scheCDetSameTC"]');
	
	// 순서 변경 컴포넌트 이벤트 설정
	setSeqEvent('input[name="scheCDetSeq"]');
	
	// Table 행 Drag & Drop 설정
	$('#getScheCodeDetList').sortable({
		axis: "y",
		start: function(event, ui){
		},
		update: function(event, ui){
			console.log('getScheCodeDetList.sortable.update START');
			
			const tcList = $(this).children().find('input[name="scheCDetTc"]');
			
			for(let i = 0; i < tcList.length; i++){
				if(isEmpty(tcList.eq(i).val())){
					alertPop($.i18n.t('required'));
					$(this).sortable('cancel');
				}
			}
			
			console.log('getScheCodeDetList.sortable.update END');
		},
		stop: function(event, ui){
			console.log('getScheCodeDetList.sortable.stop START');
			
			// 전체 Seq 재설정
			refreshSeq(scheCodeDetList);
			console.log('getScheCodeDetList.sortable.stop END');
		}
	});
}

// 스케줄 삭제
function delScheduleCodeDet(elm) {
	
	const delTr = $(elm).parent();
	const chk = delTr.children().find('input[name=scheCDetChk]');
	
	if(chk.attr('data-flag') != 'D'){
		chk.attr('data-flag', 'D');
		delTr.find('input[name="scheCDetTc"]').removeClass('inputSeachReadOnlyBackColor');
		delTr.find('input[type="text"], select').css('text-decoration', 'line-through');
		delTr.find('input[type="text"], select, .inputSearchBtnTemp').prop('disabled', true);
	} else{
		if(getFloatVal(chk.attr('data-uid')) > 0){
			chk.attr('data-flag', 'R');
		} else{
			chk.attr('data-flag', 'C');
		}
		delTr.find('input[name="scheCDetTc"]').addClass('inputSeachReadOnlyBackColor');
		delTr.find('input[type="text"], select').css('text-decoration', 'none');
		delTr.find('input[type="text"], select, .inputSearchBtnTemp').prop('disabled', false);
	}
	
	refreshSeq(scheCodeDetList);
}

//Code Level Select 반환
function getCodeLevelSel(curSche){
	let selbox = '';
	
	for(let i = 1; i <= 3; i++){
		selbox += `<option value="${i}" ${getFloatVal(curSche.codelevel) == i ? 'Selected' : ''}>${i}</option> `;
	}
	
	return selbox;
}

// Flag 처리 함수 
function setFlag(elm){
	const curChk = elm.closest('tr').children().find('[name="scheCDetChk"]');
	
	if(curChk.length > 0){
		// check box의 uid가 있는 지 확인 후 flag 처리
		if(curChk.attr('data-uid') == -1 && curChk.attr('data-flag') != 'C'){
			curChk.attr('data-flag', 'C');
		} else if(curChk.attr('data-uid') != -1 && curChk.attr('data-flag') == 'R'){
			curChk.attr('data-flag', 'U');
		}
	}
}

//Sequence 컴포넌트 이벤트 추가 
function setSeqEvent(selStr){
	$('#getScheCodeDetList').on('change', selStr, function(e){
		const elm = $(this);
		const defVal = getFloatVal(elm.prop('defaultValue'));
		const curVal = getFloatVal(elm.val());
		
		const isAscMov = getFloatVal(curVal) > getFloatVal(defVal);
		
		const curElmDataList = getCurElmData();
		const seqElmList = $(selStr);
		
		const curRowData = getSeqChgCurRowData(defVal, elm);
		const maxSeq = getMaxSeq();
		const scheMoveRowList = [];
		
		for(let i = 0; i < curElmDataList.length; i++){
//			let iSeq = getFloatVal(scheCodeDetList[0][i].seq);
			let iSeq = getFloatVal(seqElmList.eq(i).prop('defaultValue'));
			if(isAscMov){
				if(defVal > iSeq || curVal < iSeq){
					scheMoveRowList.push(curElmDataList[i]);
				} else{
					if(defVal <= iSeq && curVal != iSeq && (i+1) < curElmDataList.length){
						scheMoveRowList.push(getCurSeqInputData(curElmDataList[i+1], iSeq));
					} else if(curVal == iSeq){
						scheMoveRowList.push(getCurSeqInputData(curRowData, iSeq));
					}
				}
			} else{
				if(defVal < iSeq || curVal > iSeq){
					scheMoveRowList.push(curElmDataList[i]);
				} else{
					if(curVal == iSeq){
						scheMoveRowList.push(getCurSeqInputData(curRowData, iSeq));
					} else if(defVal >= iSeq && curVal != iSeq && (i-1) > -1){
						scheMoveRowList.push(getCurSeqInputData(curElmDataList[i-1], iSeq));
					}
				}
			}
		}
		
		// 이동 한 데이터로 테이블 재 생성
		refreshScheRowList(scheMoveRowList);
		
		// 전체 목록 데이터 초기화
		scheCodeDetList = [];
		scheCodeDetList.push(scheMoveRowList);
	});
}

//동일TC 컴포넌트 이벤트 추가
function setSameTcEvent(selStr){
	$('#getScheCodeDetList').on('change', selStr, function(e){
		const elm = $(this);
		const curTr = elm.closest('tr'); 
		const curVal = !isEmpty(elm.val()) ? elm.val().trim() : elm.val();
		
		const curTcnum = curTr.find('input[name="scheCDetTc"]').val();
		const scheTcnum = $('input[name="scheCDetTc"]');
		
		let tcIdx = -1;
		const curIdx = parseInt(curTr.attr('id').replace('scheCodeDetModTr',''));
		
		// 현재 tcnum과 동일 하면 오류 
		if(!isEmpty(curVal) && curTcnum == curVal){
			alertPop($.i18n.t('sameTcErr'));
			elm.val(elm.prop('defaultValue'));
			
		} else if(!isEmpty(curVal)){
			// 정상 값인지 확인
			for(let i = 0; i < scheTcnum.length; i++){
				let tcnum = scheTcnum.eq(i).val();
				tcnum = !isEmpty(tcnum) ? tcnum.trim() : tcnum;
				  
				if(!isEmpty(tcnum) && curVal == tcnum){
					tcIdx = i;
					break;
				}
			}
			
			// 정상 값이면 순서변경 진행
			if(tcIdx > -1){
				// 0. scheRowList 에서 scheMoveRowList 생성 하여 refreshScheRowList() 실행
				// 1. idx 기준 으로
				// 2. ASC, DESC 확인
				// 3. idx 범위에 해당 하지 않는 건은 그대로
				// 4. idx 범위에 해당하면 SEQ 변경
				// 4-1. seq는 무조건 SameTC 다음으로 변경
				// 5. SEQ 변경된 건 flag U 처리
				
				// 현재 컴포넌트 데이터
				const curElmDataList = getCurElmData();
				
				const scheMoveRowList = [];
				let isDescMov = tcIdx < curIdx;
				
				for(let i = 0; i < curElmDataList.length; i++){
					let rowData = null;
						
					if(isDescMov){
						if((tcIdx + 1) == i){
							rowData = getCurSameTcInputData(curElmDataList[curIdx], curVal, (i+1));
						} else if(i <= tcIdx || curIdx < i){
							rowData = curElmDataList[i];
						} else{
							rowData = getCurSameTcInputData(curElmDataList[i-1], curElmDataList[i-1].sametcnum, (i+1));
						}
					} else{
						if(tcIdx == i){
							rowData = getCurSameTcInputData(curElmDataList[curIdx], curVal, (i+1));
						} else if(i > tcIdx || curIdx > i){
							rowData = curElmDataList[i];
						} else{
							rowData = getCurSameTcInputData(curElmDataList[i+1], curElmDataList[i+1].sametcnum, (i+1));
						}
					}
					
					if(!isEmpty(rowData)){
						scheMoveRowList.push(rowData);
					} else{
						alertPop('Empty rowData Err');
						elm.val(elm.prop('defaultValue'));
					}
				}
				
				// 이동 한 데이터로 테이블 재 생성
				refreshScheRowList(scheMoveRowList);
				
				// 전체 목록 데이터 초기화
				scheCodeDetList = [];
				scheCodeDetList.push(scheMoveRowList);
			}
			// 오류 값이면 메시지 출력 후 원래 값 입력
			else{
				alertPop($.i18n.t('sameTcErr'));
				elm.val(elm.prop('defaultValue'));
			}
		} else{
			setFlag(elm);
		}
	});
}

//Row Data를 다시 그리는 함수
function refreshScheRowList(scheMoveRowList){
	scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));
	let text = '';
	scheCodeTrIdx = 1;
	
	for(let i in scheMoveRowList) {
		text +=`
			<tr id="scheCodeDetModTr${i}">
				<td class="text-center"><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheCDetChk" onclick="setRowSelectedSetName('scheCDetChk')"></td>
				<td class=""><select class="" name="scheCDetCodeLv">${getCodeLevelSel(scheMoveRowList[i])}</select></td>
				<td class="">
					<div class="d-flex align-items-center">
						<div>
							<input name="scheCDetTc" type="text" class="inputSearch inputSeachReadOnlyBackColor" data-schehieruid="${scheMoveRowList[i].schehierarchyuid}" data-lv1code="${scheMoveRowList[i].lv1code}" data-lv2code="${scheMoveRowList[i].lv2code}" data-lv3code="${scheMoveRowList[i].lv3code}" data-lv4code ="${scheMoveRowList[i].lv4code}" value="${scheMoveRowList[i].displaycode}" readonly>
						</div>
						<div class="flex-grow-1">
							<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
						</div>
					</div>
				</td>
				<td class=""><input type="text" name="scheCDetDesc" class="" value="${scheMoveRowList[i].description}"></td>
				<td class=""><select name="scheCDetCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'ctype')}</select></td>
				<td class=""><input type="text" name="scheCDetLoadStr" class=" scheLoad" value="${scheMoveRowList[i].loadstr}"></td>
				<td class=""><input type="text" name="scheCDetLoadRate" class=" scheLoad" value="${getFloatVal(scheMoveRowList[i].loadrate)}" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
				<td class=""><select name="scheCDetDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'dtype')}</select></td>
				<td class=""><input type="text" name="scheCDetPer" class=" schePer" value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetReadTm" class=" schePer" value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value="${scheMoveRowList[i].sametcnum}"></td>
				<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
			</tr>`;
			
			scheCodeTrIdx++;
	}
	
	$("#getScheCodeDetList").empty();
	
	if(text == '') {
		$("#getScheCodeDetList").append('<tr><td class="text-center" colspan="13">' + $.i18n.t('share:noList') + '</td></tr>');
	} else{
		$("#getScheCodeDetList").append(text);
		
	}
}

//Same Tc 입력용 데이터 생성 
function getCurSameTcInputData(rowData, sameTc, iSeq){
	const curInputData = {
			schehierarchyuid: rowData.schehierarchyuid,
			uid: rowData.uid,
			codelevel: rowData.codelevel,
			displaycode: rowData.displaycode,
			description: rowData.description,
			
			ctype: rowData.ctype,
			dtype: rowData.dtype,
			loadrate: rowData.loadrate,
			loadstr: rowData.loadstr,
			per: rowData.per,
			
			readytime: rowData.readytime,
			sametcnum: sameTc,
			seq: iSeq,
			lv1code: rowData.lv1code,
			lv2code: rowData.lv2code,
			
			lv3code: rowData.lv3code,
			lv4code: rowData.lv4code,
			flag: (rowData.flag != 'D' && rowData.flag != 'C') ? 'U' : rowData.flag
		};
	
	return curInputData;
}

//현재 이동 하려는 Seq의 행 데이터 반환 
function getSeqChgCurRowData(seq, elm){
	let curRow = null;
	
	for(let i = 0; i < scheCodeDetList[0].length; i++){
		if(getFloatVal(scheCodeDetList[0][i].seq) == seq){
			curRow = scheCodeDetList[0][i];
			break;
		}
	}
	
	if(isEmpty(curRow) && !isEmpty(elm)){
		let prtTr = elm.closest('tr');
		
		curRow = {
			schehierarchyuid: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-schehieruid'),
			uid: prtTr.children().find('input[name="scheCDetChk"]').eq(0).attr('data-uid'),
			codelevel: prtTr.children().find('select[name="scheCDetCodeLv"]').eq(0).val(),
			displaycode: prtTr.children().find('input[name="scheCDetTc"]').eq(0).val(),
			description: prtTr.children().find('input[name="scheCDetDesc"]').eq(0).val(),
			
			ctype: prtTr.children().find('select[name="scheCDetCtype"]').eq(0).val(),
			dtype: prtTr.children().find('select[name="scheCDetDtype"]').eq(0).val(),
			loadrate: prtTr.children().find('input[name="scheCDetLoadRate"]').eq(0).val(),
			loadstr: prtTr.children().find('input[name="scheCDetLoadStr"]').eq(0).val(),
			per: prtTr.children().find('input[name="scheCDetPer"]').eq(0).val(),
			
			readytime: prtTr.children().find('input[name="scheCDetReadTm"]').eq(0).val(),
			sametcnum: prtTr.children().find('input[name="scheCDetSameTC"]').eq(0).val(),
			seq: seq,
			lv1code: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-lv1code'),
			lv2code: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-lv2code'),
			
			lv3code: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-lv3code'),
			lv4code: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-lv4code'),
			flag: prtTr.children().find('input[name="scheCDetChk"]').eq(0).attr('data-flag'),
		};
	}
	
	return curRow;
}

//Seq 입력용 데이터 생성 
function getCurSeqInputData(rowData, iSeq){
	const curInputData = {
			schehierarchyuid: rowData.schehierarchyuid,
			uid: rowData.uid,
			codelevel: rowData.codelevel,
			displaycode: rowData.displaycode,
			description: rowData.description,
			
			ctype: rowData.ctype,
			dtype: rowData.dtype,
			loadrate: rowData.loadrate,
			loadstr: rowData.loadstr,
			per: rowData.per,
			
			readytime: rowData.readytime,
			sametcnum: rowData.sametcnum,
			seq: iSeq,
			lv1code: rowData.lv1code,
			lv2code: rowData.lv2code,
			
			lv3code: rowData.lv3code,
			lv4code: rowData.lv4code,
			flag: (rowData.flag != 'D' && rowData.flag != 'C') ? 'U' : rowData.flag
		};
	
	return curInputData;
}

//Sequence 최대 값
function getMaxSeq(){
	let maxSeq = 0;
	
	for(let i = 0; i < scheCodeDetList[0].length; i++){
		let seq = getFloatVal(scheCodeDetList[0][i].seq);
		if(maxSeq < seq){
			maxSeq = seq;
		}
	}
	
	return maxSeq;
}

//Sequence 전체 재 설정
function refreshSeq(scheChgRowList){
	const scheSeqList = $('input[name="scheCDetSeq"]');
	let seq = 0;
	for(let i = 0; i < scheSeqList.length; i++){
		const scheSeq = scheSeqList.eq(i);
		const scheChk = scheSeq.closest('tr').children().find('[name="scheCDetChk"]').eq(0);
		if(scheChk.attr('data-flag') != 'D'){
			if(getFloatVal(scheSeq.val()) != (++seq)){
				scheSeq.val(seq);
				
				// 신규 행이 아닌 경우만 업데이트
				if(scheChk.attr('data-flag') != 'C'){
					scheChk.attr('data-flag', 'U');
					
					for(let j = 0; j < scheChgRowList.length; j++){
						if(scheChk.attr('data-uid') == getFloatVal(scheChgRowList[j].uid)){
							scheChgRowList[j].seq = seq;
							scheChgRowList[j].flag = 'U';
						}
					}
				}
			}
		}
	}
}

// TCNUM 검색 버튼 클릭 이벤트
function setTcnumBtn(idx){
	curTcSearchTr = $('#scheCodeDetModTr'+idx);
	
	if(curTcSearchTr.children().find('input[name="scheCDetChk"]').attr('data-flag') == 'D'){
		curTcSearchTr = null
	} else{
		// 조회 값 초기화
		$('#searchTcPopTcnum').val('');
		$('#searchTcPopDesc').val('');
		
		$('#search_tcnum_modal').modal();
		searchTcPopSearch(1);
	}
}

// TCNUM 조회 팝업 검색 버튼 이벤트
function searchTcPopSearch(page){
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/scheBasic/getScheCodeDetTcSearchList.html",
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
			displaycode: $('#searchTcPopTcnum').val(),
			description: $('#searchTcPopDesc').val()
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			
			scheTcSearchList = [];
			scheTcSearchList = result.list; // scheTcSearchList 배열 담기
			
			for(let i in jsonResult) {
				
				text +=`
					<tr class="cursor-pointer">
						<td class="text-left" onClick="selectTcNum(${i})">${jsonResult[i].displaycode}</td>
						<td class="text-left" onClick="selectTcNum(${i})">${jsonResult[i].description}</td>
						<td class="text-center" onClick="selectTcNum(${i})">${jsonResult[i].codelevel}</td>
					</tr>`;
			}

			$("#searchTcPopList").empty();
      
			if(jsonResult.length > 0) {
				$("#searchTcPopList").append(text);
			} else{
				$("#searchTcPopList").append('<tr><td class="text-center" colspan="3">' + $.i18n.t('share:noList') + '</td></tr>');
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
		text += '<div onclick="searchTcPopSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}
	  
	for(var k = paging_init_num; k <= paging_end_num; k++) {
	    if(parseInt(page) == k) {
			text += '<div onclick="searchTcPopSearch(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="searchTcPopSearch(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}
	
	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="searchTcPopSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$('#pagination').empty();
	$('#pagination').append(text);
}

// TC Num 조회 팝업 행 선택 시 이벤트 
function selectTcNum(idx){
	if(curTcSearchTr != null && scheTcSearchList != null && scheTcSearchList.length > 0){
		const chkbox = curTcSearchTr.find('input[name="scheCDetChk"]');
		const codeLv = curTcSearchTr.find('select[name="scheCDetCodeLv"]');
		const tcnum = curTcSearchTr.find('input[name="scheCDetTc"]');
		const desc = curTcSearchTr.find('input[name="scheCDetDesc"]');
		
		const flag = chkbox.attr('data-flag');
		
		if(flag == 'R'){
			chkbox.attr('data-flag','U');
		}
		codeLv.val(scheTcSearchList[idx].codelevel);
		tcnum.attr('data-schehieruid', scheTcSearchList[idx].uid);
		tcnum.val(scheTcSearchList[idx].displaycode);
		desc.val(scheTcSearchList[idx].description);
		
		tcnum.attr('data-lv1code', scheTcSearchList[idx].lv1code);
		tcnum.attr('data-lv2code', scheTcSearchList[idx].lv2code);
		tcnum.attr('data-lv3code', scheTcSearchList[idx].lv3code);
		tcnum.attr('data-lv4code', scheTcSearchList[idx].lv4code);
	}
	
	$('#search_tcnum_modal').modal('hide');
}

// 스케줄 업데이트.
function saveScheduleCode() {
	let isEmptySche = false;
	let emptyMsg = '';
	
	const pUid = scheCodeUid;
	const desc = $('#desc').val();
	const status = $('#status option:selected').val();
	const revnum = $('#revnum').val();
	
	const rowChk = $('input[name="scheCDetChk"]');
	const scheCodeLv = $('select[name="scheCDetCodeLv"]');
	const scheTcnum = $('input[name="scheCDetTc"]');
	const scheDesc = $('input[name="scheCDetDesc"]');
	const scheCtype = $('select[name="scheCDetCtype"');
	
	const scheDtype = $('select[name="scheCDetDtype"');
	const scheLoadStr = $('input[name="scheCDetLoadStr"');
	const scheLoadRate = $('input[name="scheCDetLoadRate"');
	const schePer = $('input[name="scheCDetPer"');
	const scheReadyTm = $('input[name="scheCDetReadTm"');
	
	const scheSeq = $('input[name="scheCDetSeq"');
	const scheSameTc = $('input[name="scheCDetSameTC"');
	
	const uidList = [];
	const codelvList = [];
	const tcnumList = [];
	const hieruidList = [];
	const lv1codeList = [];
	
	const lv2codeList = [];
	const lv3codeList = [];
	const lv4codeList = [];
	const descList = [];
	const ctypeList = [];
	
	const dtypeList = [];
	const loadStrList = [];
	const loadRateList = [];
	const perList = [];
	const readyTmList = [];
	
	const seqList = [];
	const sameTcnumList = [];
	const flagList = [];
	
	
	if(isEmpty(desc) || isEmpty(status)) {
		isEmptySche = true;
		emptyMsg = $.i18n.t('errScheMain');
	}else {
		for(let i = 0; i < rowChk.length; i++) {
			if((isEmpty(scheCodeLv.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) && rowChk.eq(i).attr('data-flag') != 'D' ) {
				isEmptySche = true;
				emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
				break;
			}else {
				uidList.push(parseInt(rowChk.eq(i).attr('data-uid')));
				codelvList.push(scheCodeLv.eq(i).val());
				tcnumList.push(scheTcnum.eq(i).val());
				hieruidList.push(scheTcnum.eq(i).attr('data-schehieruid'));
				lv1codeList.push(scheTcnum.eq(i).attr('data-lv1code'));
				
				lv2codeList.push(scheTcnum.eq(i).attr('data-lv2code'));
				lv3codeList.push(scheTcnum.eq(i).attr('data-lv3code'));
				lv4codeList.push(scheTcnum.eq(i).attr('data-lv4code'));
				descList.push(scheDesc.eq(i).val());
				ctypeList.push(scheCtype.eq(i).val());
				
				dtypeList.push(scheDtype.eq(i).val());
				loadStrList.push(scheLoadStr.eq(i).val());
				loadRateList.push(scheLoadRate.eq(i).val());
				perList.push(schePer.eq(i).val());
				readyTmList.push(scheReadyTm.eq(i).val());
				
				seqList.push(scheSeq.eq(i).val());
				sameTcnumList.push(scheSameTc.eq(i).val());
				flagList.push(rowChk.eq(i).attr('data-flag'));
			}
		}
	}

	if(isEmptySche) {
		alertPop(emptyMsg);
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/scheBasic/updateScheCode.html',
			traditional: true,
			data: {
				'uid': pUid,
				'description': desc,
				status,
				revnum,
				uidList,
				codelvList,   
				tcnumList,    
				hieruidList,  
				lv1codeList,  
				lv2codeList,  
				lv3codeList,  
				lv4codeList,  
				descList,     
				ctypeList,    
				dtypeList,    
				loadStrList,  
				loadRateList, 
				perList,      
				readyTmList,
				seqList,
				sameTcnumList,
				flagList
			},
			success: function(data) {
				var json = JSON.parse(data);
				
				if(json.result) {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/mng/scheBasic/modifyScheduleCode.html?uid='+ pUid;
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

//현재 모든 컴포넌트의 값을 반환 
function getCurElmData(){
	const curRowList = [];
	let isEmptySche = false;
	
	const rowChk = $('input[name="scheCDetChk"]');
	const scheCodeLv = $('select[name="scheCDetCodeLv"]');
	const scheTcnum = $('input[name="scheCDetTc"]');
	const scheDesc = $('input[name="scheCDetDesc"]');
	const scheCtype = $('select[name="scheCDetCtype"');
	
	const scheDtype = $('select[name="scheCDetDtype"');
	const scheLoadStr = $('input[name="scheCDetLoadStr"');
	const scheLoadRate = $('input[name="scheCDetLoadRate"');
	const schePer = $('input[name="scheCDetPer"');
	const scheReadyTm = $('input[name="scheCDetReadTm"');
	
	const scheSeq = $('input[name="scheCDetSeq"');
	const scheSameTc = $('input[name="scheCDetSameTC"');
	
	for(let i = 0; i < rowChk.length; i++) {
		if((isEmpty(scheCodeLv.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) && rowChk.eq(i).attr('data-flag') != 'D' ) {
			isEmptySche = true;
			emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
			break;
		}else {
			const curInputData = {
				uid: parseInt(rowChk.eq(i).attr('data-uid')),
				codelevel: scheCodeLv.eq(i).val(),
				displaycode: scheTcnum.eq(i).val(),
				schehierarchyuid: scheTcnum.eq(i).attr('data-schehieruid'),
				lv1code: scheTcnum.eq(i).attr('data-lv1code'),
				
				lv2code: scheTcnum.eq(i).attr('data-lv2code'),
				lv3code: scheTcnum.eq(i).attr('data-lv3code'),
				lv4code: scheTcnum.eq(i).attr('data-lv4code'),
				description: scheDesc.eq(i).val(),
				ctype: scheCtype.eq(i).val(),
				
				dtype: scheDtype.eq(i).val(),
				loadstr: scheLoadStr.eq(i).val(),
				loadrate: scheLoadRate.eq(i).val(),
				per: schePer.eq(i).val(),
				readytime: scheReadyTm.eq(i).val(),
				
				seq: scheSeq.eq(i).val(),
				sametcnum: scheSameTc.eq(i).val(),
				flag: rowChk.eq(i).attr('data-flag')
			};
			
			curRowList.push(curInputData);
		}
	}
	
	// 데이터 오류 시 팝업 호출 
	if(isEmptySche) {
		alertPop(emptyMsg);
		return [];
	}else {
		return curRowList;
	}
	
}

//ctype, dtype select의 option 구성
function getTypeSelOption(curSche, type){
	let selbox = '';
	if(!isEmpty(type)){
		if(type == 'ctype'){
			for(ctype of ctypeList){
				selbox += `<option value="${ctype.value}" ${!isEmpty(curSche) && curSche.ctype.toUpperCase() == ctype.value ? 'Selected' : ''}>${ctype.desc}</option> `;
			}
		} else if(type == 'dtype'){
			for(dtype of dtypeList){
				selbox += `<option value="${dtype.value}" ${!isEmpty(curSche) && curSche.dtype.toUpperCase() == dtype.value ? 'Selected' : ''}>${dtype.desc}</option> `;
			}
		}
	}
	return selbox;
}

//다음 입력 할 Sequence 구하기 
function getNextSeq(){
	const scheSeqs = $('input[name="scheCDetSeq"]');
	let maxSeq = 0.0;
	for(let i = 0; i < scheSeqs.length; i++){
		const curSeq = getFloatVal(scheSeqs.eq(i).val());
		if(maxSeq < curSeq){
			maxSeq = curSeq;
		}
	}
	return (maxSeq + 1.0);
}

// 멀티 추가 - TCNUM 조회 팝업
function showAddMultiSearchTcPop() {
	const chkList = $('input[name=scheCDetChk]:checked');
	
	if(chkList.length > 1) {
		alertPop($.i18n.t('selectOneMsg'));
	}else {
		if(isEmpty($('#shiptype option:selected').val()) || isEmpty($('#schedtype option:selected').val())){
			alertPop($.i18n.t('errScheMain'));
			return;
		}
		
		addMultiScheTcSearchListSelectIdx = [];
		addMultiScheTcSearchList = [];
		
		$('#addMultiSearchTcPopTcnum').val('');
		$('#addMultiSearchTcPopDesc').val('');
		$('#addMultiSearchTcPopList').empty();
		$('#addMultiSearchTcPopSelectList').empty();
		
		$('#add_multi_search_tcnum_modal').modal();
		addMultiSearchTcPopSearch();
	}
}

// 멀티 추가 - TCNUM 조회 팝업 검색 버튼 이벤트
function addMultiSearchTcPopSearch(){
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/scheBasic/getScheCodeDetTcSearchListForMulti.html',
		data: {
			displaycode: $('#addMultiSearchTcPopTcnum').val(),
			description: $('#addMultiSearchTcPopDesc').val()
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
				let text = '';
				
				addMultiScheTcSearchListSelectIdx = [];
				addMultiScheTcSearchList = [];
				addMultiScheTcSearchList = json.list;
				
				$('#addMultiSearchTcPopList').empty();
				$('#addMultiSearchTcPopSelectList').empty();
				
				for(let i = 0; i < addMultiScheTcSearchList.length; i++) {
					text += '<tr>' + 
								'<td class="text-center"><input type="checkbox" name="addMultiSearchTcPopListChk" onclick="addMultiSearchTcPopRefreshSelectList()"></td>' + 
								'<td class="text-left">' + addMultiScheTcSearchList[i].displaycode + '</td>' + 
								'<td class="text-left">' + addMultiScheTcSearchList[i].description + '</td>' + 
								'<td class="text-center">' + addMultiScheTcSearchList[i].codelevel + '</td>' + 
							'</tr>';
				}
				
				if(addMultiScheTcSearchList.length > 0) {
					$('#addMultiSearchTcPopList').append(text);
				} else{
					$('#addMultiSearchTcPopList').append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
				}
			}catch(e) {
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

// 멀티 추가 - TCNUM 조회 팝업 체크 목록 새로고침.
function addMultiSearchTcPopRefreshSelectList() {
	let listChkList = document.getElementsByName('addMultiSearchTcPopListChk');
	addMultiScheTcSearchListSelectIdx = [];
	$('#addMultiSearchTcPopSelectList').empty();
	
	let html = '<table class="tb-style">' + 
					'<tbody id="addMultiSearchTcPopList">';
			
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i].checked) {
			addMultiScheTcSearchListSelectIdx.push(i);
			
			html += '<tr>' + 
						'<td class="th-w-120 text-left border-bottom-0">' + addMultiScheTcSearchList[i].displaycode + '</td>' + 
						'<td class="text-left border-bottom-0">' + addMultiScheTcSearchList[i].description + '</td>' + 
						'<td class="th-w-90 text-center border-bottom-0">' + addMultiScheTcSearchList[i].codelevel + '</td>' + 
						'<td class="th-w-90 text-center border-bottom-0"><div onclick="addMultiSearchTcPopDelSelectList(' + i + ')" class="cursor-pointer"><i class="fa-solid fa-xmark"></i></div></td>' + 
					'</tr>';
		}
	}
	
	 html += '</tbody>' +
		'</table>';
		
	$('#addMultiSearchTcPopSelectList').html(html);
	
	setRowSelectedSetName('addMultiSearchTcPopListChk');
}

// 멀티 추가 - TCNUM 조회 팝업 삭제 버튼 이벤트.
function addMultiSearchTcPopDelSelectList(idx) {
	let listChkList = document.getElementsByName('addMultiSearchTcPopListChk');
	listChkList[idx].checked = false;
	
	addMultiSearchTcPopRefreshSelectList();
}
 
// 멀티 추가 - TCNUM 조회 팝업 추가 버튼 이벤트.
function addMultiSearchTcPopAddList() {
	let listChkList = document.getElementsByName('addMultiSearchTcPopListChk');
	let text = '';
	let nextSeq = getNextSeq();
	
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i].checked) {
			scheCodeTrIdx++; 
		
			text += `
				<tr id="scheCodeDetModTr${scheCodeTrIdx}">
					<td class="text-center"><input type="checkbox" data-uid="-1" data-flag="C" name="scheCDetChk" onclick="setRowSelectedSetName('scheCDetChk')"></td>
					<td class=""><select class="" name="scheCDetCodeLv">${getCodeLevelSel(addMultiScheTcSearchList[i])}</select></td>
					<td class="">
						<div class="d-flex align-items-center">
							<div>
								<input name="scheCDetTc" type="text" class="inputSearch inputSeachReadOnlyBackColor" data-schehieruid="${addMultiScheTcSearchList[i].uid}" data-lv1code="${addMultiScheTcSearchList[i].lv1code}" data-lv2code="${addMultiScheTcSearchList[i].lv2code}" data-lv3code="${addMultiScheTcSearchList[i].lv3code}" data-lv4code ="${addMultiScheTcSearchList[i].lv4code}" value="${addMultiScheTcSearchList[i].displaycode}" readonly>
							</div>
							<div class="flex-grow-1">
								<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${scheCodeTrIdx})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
							</div>
						</div>
					</td>
					<td class=""><input type="text" name="scheCDetDesc" class="" value="${addMultiScheTcSearchList[i].description}"></td>
					<td class=""><select name="scheCDetCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(null, 'ctype')}</select></td>
					<td class=""><input type="text" name="scheCDetLoadStr" class=" scheLoad" value=""></td>
					<td class=""><input type="text" name="scheCDetLoadRate" class=" scheLoad" value="" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
					<td class=""><select name="scheCDetDtype"class=" scheDtype"><option value=""></option>${getTypeSelOption(null, 'dtype')}</select></td>
					<td class=""><input type="text" name="scheCDetPer" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheCDetReadTm" class=" schePer" value="0" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="${nextSeq}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value=""></td>
					<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
				</tr>`;
				
			nextSeq++;
		}
	}
	
	$('#add_multi_search_tcnum_modal').modal('hide');
	
	const chkList = $('input[name=scheCDetChk]:checked');
	
	if(chkList.length == 1) {
		chkList.eq(0).closest('tr').after(text);
		chkList.eq(0).prop('checked', false);
	}else {
		$('#getScheCodeDetList').append(text);
	}
	
	refreshSeq(scheCodeDetList);
	setRowSelectedSetName('scheCDetChk');
}