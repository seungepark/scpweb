let scheCodeTrIdx = 0;			/// 스케줄 코드 다음 인덱스 (추가 후 ++)
let scheCodeDetList = [];
let scheTcSearchList = [];
let curTcSearchTr = null;
let addMultiScheTcSearchList = [];				// TC 멀티 추가용 전체 TC 검색 목록.
let addMultiScheTcSearchListSelectIdx = [];		// TC 멀티 추가용 추가 대상 TC 데이터 인덱스 목록.

$(function(){
	initI18n();
	init();
	
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
	      namespaces: ['share', 'mngNewScheCode'],
	      defaultNs: 'mngNewScheCode'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init(){
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
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
	
	// 이벤트 설정 
	setCompEvent();
}

// 스케줄 추가 - 250205 사용안함 : 멀티 추가로 변경.
function addScheduleCodeDet() {
	if(isEmpty($('#shiptype option:selected').val()) || isEmpty($('#schedtype option:selected').val())){
		alertPop($.i18n.t('errScheMain'));
		return;
	}
	let scheSeqList = null;
	let seq = 0;
	
	const text =`
		<tr id="scheCodeDetNewTr${scheCodeTrIdx}">
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
			<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
			<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value=""></td>
			<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
		</tr>`;
	
	$('#getScheCodeDetList').append(text);
	
	// Sequence 자동입력
	scheSeqList = $('input[name="scheCDetSeq"]');
	for(let i = 0; i < scheSeqList.length; i++){
		const curSeq = parseInt(scheSeqList.eq(i).val());
		seq = (curSeq > seq) ? curSeq : seq; 
	}
	$(`#scheCodeDetNewTr${scheCodeTrIdx} input[name="scheCDetSeq"]`).val(++seq);
	$(`#scheCodeDetNewTr${scheCodeTrIdx} input[name="scheCDetSeq"]`).prop('defaultValue', seq);
	
	// ADD 한 행으로 Focus 이동 
	$('#scheCodeDetNewTr' + scheCodeTrIdx).children().find('select[name="scheCDetCodeLv"]').focus();
	
	// 전체 행 Idx 증가 
	scheCodeTrIdx++;
}

// 컴포넌트 및 이벤트 추가
function setCompEvent(){
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
	$(elm).parent().remove();
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

//동일TC 컴포넌트 이벤트 추가
function setSameTcEvent(selStr){
	$('#getScheCodeDetList').on('change', selStr, function(e){
		const elm = $(this);
		const curTr = elm.closest('tr'); 
		const curVal = !isEmpty(elm.val()) ? elm.val().trim() : elm.val();
		
		const curTcnum = curTr.find('input[name="scheCDetTc"]').val();
		const scheTcnum = $('input[name="scheCDetTc"]');
		
		let tcIdx = -1;
		const curIdx = parseInt(curTr.attr('id').replace('scheCodeDetNewTr',''));
		
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
				
				const scheCurRowList = getCurDataAll(null, elm);
				
				const scheMoveRowList = [];
				let isDescMov = tcIdx < curIdx;
				
				for(let i = 0; i < scheCurRowList.length; i++){
					let rowData = null;
						
					if(isDescMov){
						if((tcIdx + 1) == i){
							rowData = getCurSameTcInputData(scheCurRowList[curIdx], curVal, (i+1));
						} else if(i <= tcIdx || curIdx < i){
							rowData = scheCurRowList[i];
						} else{
							rowData = getCurSameTcInputData(scheCurRowList[i-1], scheCurRowList[i-1].sametcnum, (i+1));
						}
					} else{
						if(tcIdx == i){
							rowData = getCurSameTcInputData(scheCurRowList[curIdx], curVal, (i+1));
						} else if(i > tcIdx || curIdx > i){
							rowData = scheCurRowList[i];
						} else{
							rowData = getCurSameTcInputData(scheCurRowList[i+1], scheCurRowList[i+1].sametcnum, (i+1));
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
		}
	});
}

//Sequence 컴포넌트 이벤트 추가 
function setSeqEvent(selStr){
	$('#getScheCodeDetList').on('change', selStr, function(e){
		const elm = $(this);
		
		const scheCurRowList = getCurDataAll(elm, null);
		
		const defVal = getFloatVal(elm.prop('defaultValue'));
		const curVal = getFloatVal(elm.val());
		
		const isAscMov = getFloatVal(curVal) > getFloatVal(defVal);
		
		const curRowData = getSeqChgCurRowData(scheCurRowList, defVal, elm);
		const maxSeq = getMaxSeq(scheCurRowList);
		const scheMoveRowList = [];
		
		for(let i = 0; i < scheCurRowList.length; i++){
			let iSeq = getFloatVal(scheCurRowList[i].seq);
			if(isAscMov){
				if(defVal > iSeq || curVal < iSeq){
					scheMoveRowList.push(scheCurRowList[i]);
				} else{
					if(defVal <= iSeq && curVal != iSeq && (i+1) < scheCurRowList.length){
						scheMoveRowList.push(getCurSeqInputData(scheCurRowList[i+1], iSeq));
					} else if(curVal == iSeq){
						scheMoveRowList.push(getCurSeqInputData(curRowData, iSeq));
					}
				}
			} else{
				if(defVal < iSeq || curVal > iSeq){
					scheMoveRowList.push(scheCurRowList[i]);
				} else{
					if(curVal == iSeq){
						scheMoveRowList.push(getCurSeqInputData(curRowData, iSeq));
					} else if(defVal >= iSeq && curVal != iSeq && (i-1) > -1){
						scheMoveRowList.push(getCurSeqInputData(scheCurRowList[i-1], iSeq));
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

//Row Data를 다시 그리는 함수
function refreshScheRowList(scheMoveRowList){
	scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));
	let text = '';
	scheCodeTrIdx = 1;
	
	for(let i in scheMoveRowList) {
		text +=`
			<tr id="scheCodeDetNewTr${i}">
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
	
	if(!isEmpty(text)) {
		$("#getScheCodeDetList").append(text);
	}
}

//Same Tc 입력용 데이터 생성 
function getCurSameTcInputData(rowData, sameTc, iSeq){
	const curInputData = {
			schehierarchyuid: rowData.schehierarchyuid,
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
function getSeqChgCurRowData(scheCurRowList, seq, elm){
	let curRow = null;
	
	for(let i = 0; i < scheCurRowList.length; i++){
		if(getFloatVal(scheCurRowList[i].seq) == seq){
			curRow = scheCurRowList[i];
			break;
		}
	}
	
	if(isEmpty(curRow) && !isEmpty(elm)){
		let prtTr = elm.closest('tr');
		
		curRow = {
			schehierarchyuid: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-schehieruid'),
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
			
			lv4code: prtTr.children().find('input[name="scheCDetTc"]').eq(0).attr('data-lv4code')
		};
	}
	
	return curRow;
}

//Seq 입력용 데이터 생성 
function getCurSeqInputData(rowData, iSeq){
	const curInputData = {
			schehierarchyuid: rowData.schehierarchyuid,
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
function getMaxSeq(scheCurRowList){
	let maxSeq = 0;
	
	for(let i = 0; i < scheCurRowList.length; i++){
		let seq = getFloatVal(scheCurRowList[i].seq);
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
		if(getFloatVal(scheSeq.val()) != (++seq)){
			scheSeq.val(seq);
		}
	}
}

// 현재 입력되어 있는 컴포넌트의 전체 값 반환
function getCurDataAll(seqElm, tcElm){
	let isEmptySche = false;
	let emptyMsg = '';
	const scheCurRowList = [];
	
	const scheCodeLv = $('select[name="scheCDetCodeLv"]');
	const scheTcnum = $('input[name="scheCDetTc"]');
	const scheDesc = $('input[name="scheCDetDesc"]');
	const scheCtype = $('select[name="scheCDetCtype"]');
	const scheDtype = $('select[name="scheCDetDtype"]');
	
	const scheLoadStr = $('input[name="scheCDetLoadStr"]');
	const scheLoadRate = $('input[name="scheCDetLoadRate"]');
	const schePer = $('input[name="scheCDetPer"]');
	const scheReadyTm = $('input[name="scheCDetReadTm"]');
	const scheSeq = $('input[name="scheCDetSeq"]');
	
	const scheSameTc = $('input[name="scheCDetSameTC"]');
	
	for(let i = 0; i < scheTcnum.length; i++) {
		if(isEmpty(scheCodeLv.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) {
			isEmptySche = true;
			emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
			break;
		}else {
			const curRow = {
				schehierarchyuid: scheTcnum.eq(i).attr('data-schehieruid'),
				codelevel: scheCodeLv.eq(i).val(),
				displaycode: scheTcnum.eq(i).val(),
				description: scheDesc.eq(i).val(),
				ctype: scheCtype.eq(i).val(),
				
				dtype: scheDtype.eq(i).val(),
				loadrate: scheLoadRate.eq(i).val(),
				loadstr: scheLoadStr.eq(i).val(),
				per: schePer.eq(i).val(),
				readytime: scheReadyTm.eq(i).val(),
				
				sametcnum: (!isEmpty(tcElm) && tcElm.get(0) == scheSameTc.eq(i).get(0)) ? tcElm.prop('defaultValue') : scheSameTc.eq(i).val(),
				seq: (!isEmpty(seqElm) && seqElm.get(0) == scheSeq.eq(i).get(0)) ? getFloatVal(seqElm.prop('defaultValue')) : getFloatVal(scheSeq.eq(i).val()),
				lv1code: scheTcnum.eq(i).attr('data-lv1code'),
				lv2code: scheTcnum.eq(i).attr('data-lv2code'),
				lv3code: scheTcnum.eq(i).attr('data-lv3code'),
				
				lv4code: scheTcnum.eq(i).attr('data-lv4code')
			};
			
			scheCurRowList.push(curRow);
		}
	}
	
	if(isEmptySche){
		alertPop(emptyMsg);
		return null;
	} else{
		return scheCurRowList;
	}
}

// TCNUM 검색 버튼 클릭 이벤트
function setTcnumBtn(idx){
	// 조회 값 초기화
	$('#searchTcPopTcnum').val('');
	$('#searchTcPopDesc').val('');
	
	$('#search_tcnum_modal').modal();
	curTcSearchTr = $('#scheCodeDetNewTr'+idx);
	searchTcPopSearch(1);
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
		const codeLv = curTcSearchTr.find('select[name="scheCDetCodeLv"]');
		const tcnum = curTcSearchTr.find('input[name="scheCDetTc"]');
		const desc = curTcSearchTr.find('input[name="scheCDetDesc"]');
				
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

// 스케줄 생성
function saveScheduleCode() {
	let isEmptySche = false;
	
	const shiptype = $('#shiptype option:selected').val();
	const desc = $('#desc').val();
	const status = $('#status option:selected').val();
	const revnum = $('#revnum').val();
	
	const scheCodeLv = $('select[name="scheCDetCodeLv"]');
	const scheTcnum = $('input[name="scheCDetTc"]');
	const scheDesc = $('input[name="scheCDetDesc"]');
	const scheCtype = $('select[name="scheCDetCtype"]');
	const scheCDetDtype = $('select[name="scheCDetDtype"]');
	
	const scheLoadStr = $('input[name="scheCDetLoadStr"]');
	const scheLoadRate = $('input[name="scheCDetLoadRate"]');
	const schePer = $('input[name="scheCDetPer"]');
	const scheReadyTm = $('input[name="scheCDetReadTm"]');
	const scheSeq = $('input[name="scheCDetSeq"]');
	
	const scheSameTc = $('input[name="scheCDetSameTC"]');
	const schedtype = $('#schedtype option:selected').val();

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

	if(isEmpty(shiptype) || isEmpty(schedtype) || isEmpty(desc) || isEmpty(status)) {
		isEmptySche = true;
	}else {
		for(let i = 0; i < scheTcnum.length; i++) {
			if(isEmpty(scheCodeLv.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) {
				isEmptySche = true;
				break;
			}else {
				codelvList.push(scheCodeLv.eq(i).val());
				tcnumList.push(scheTcnum.eq(i).val());
				hieruidList.push(scheTcnum.eq(i).attr('data-schehieruid'));
				lv1codeList.push(scheTcnum.eq(i).attr('data-lv1code'));
				lv2codeList.push(scheTcnum.eq(i).attr('data-lv2code'));
				
				lv3codeList.push(scheTcnum.eq(i).attr('data-lv3code'));
				lv4codeList.push(scheTcnum.eq(i).attr('data-lv4code'));
				descList.push(scheDesc.eq(i).val());
				ctypeList.push(scheCtype.eq(i).val());
				dtypeList.push(scheCDetDtype.eq(i).val());
				
				loadStrList.push(scheLoadStr.eq(i).val());
				loadRateList.push(scheLoadRate.eq(i).val());
				perList.push(schePer.eq(i).val());
				readyTmList.push(scheReadyTm.eq(i).val());
				seqList.push(scheSeq.eq(i).val());
				
				sameTcnumList.push(scheSameTc.eq(i).val());
			}
		}
	}

	if(isEmptySche) {
		alertPop($.i18n.t('errScheMain'));
	}else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/scheBasic/insertScheCode.html',
			traditional: true,
			data: {
				shiptype,
				'description': desc,
				schedtype,
				status,
				revnum,
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
				sameTcnumList
			},
			success: function(data) {
				var json = JSON.parse(data);

				if(json.result) {
					scheCodeTrIdx = 0;
					$('#shiptype option:eq(0)').prop("selected", true);
					$('#desc').val('');
					$('#status option:eq(0)').prop("selected", true);
					$('#revnum').val('0');
					$('#getScheCodeDetList').empty();

					$('#schedtype option:eq(0)').prop("selected", true);

					alertPop($.i18n.t('compNew'));

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

function getScheduleCode() {
	$('#search_schedule_code_modal').modal('show');
	getScheduleCodeInfoList(1)
}

function getScheduleCodeInfoList(page) {
	var shipType = $('#searchSchePopShipType option:selected').val();
	var schedtype = $('#searchSchePopSchedType option:selected').val();

	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/scheBasic/getScheduleCodeInfoList.html',
		data: {
			page: page,
			shiptype: shipType,
			schedtype: schedtype,
			sort: "shiptype",
			order: "desc"
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';

			for(var i = 0; i < json.list.length; i++) {
				text += '<tr class="cursor-pointer">';
				text += '	<td class="text-center"><input type="radio" data-uid=' + json.list[i].uid + ' name="searchSchePopCheck"></td>';
				text += '	<td class="text-center" onClick="checkScheduleCodeInfo(' + json.list[i].uid + ')">' + json.list[i].shiptype  + '</td>';
				text += '	<td class="" onClick="checkScheduleCodeInfo(' + json.list[i].uid + ')">' + json.list[i].description + '</td>';
				text += '	<td class="text-center" onClick="checkScheduleCodeInfo(' + json.list[i].uid + ')">' + json.list[i].schedtype + '</td>';
				text += '	<td class="text-center" onClick="checkScheduleCodeInfo(' + json.list[i].uid + ')">' + json.list[i].status + '</td>';
				text += '	<td class="text-center" onClick="checkScheduleCodeInfo(' + json.list[i].uid + ')">' + json.list[i].revnum + '</td>';

				text += '</tr>';
			}

			$('#searchSchePopScheduleCodelist').empty();

			if(json.list.length > 0) {
				$('#searchSchePopScheduleCodelist').append(text);
			}else {
				$('#searchSchePopScheduleCodelist').append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
			}

			searchSchePopPaging(json.listCnt, page);
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css('display', 'block');
		},
		complete: function() {
			$('#loading').css('display', 'none');
		}
	});
}

function searchSchePopPaging(cnt, page){
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
		text += '<div onclick="getScheduleCodeInfoList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}

	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(page) == k) {
			text += '<div onclick="getScheduleCodeInfoList(' + k + ');" class="pg-num active">' + k + '</div>';
		}else {
			text += '<div onclick="getScheduleCodeInfoList(' + k + ');" class="pg-num">' + k + '</div>';
		}
	}

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="getScheduleCodeInfoList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}

	$('#paginationforsearchSchePopScheduleCodelist').empty();
	$('#paginationforsearchSchePopScheduleCodelist').append(text);
}

function checkScheduleCodeInfo(uid) {
	$("input[type='radio'][name='searchSchePopCheck'][data-uid='"+uid+"']").prop("checked", "checked")
}

function setScheduleCodeInfo() {
	const uid = $("input[type='radio'][name='searchSchePopCheck']:checked").data("uid")
	getScheCodeDetList(uid)
}

function getScheCodeDetList(uid){

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
			uid: uid,
			sort: "",
			order: "asc"
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			scheCodeDetList = result.list;
			refreshScheRowList(scheCodeDetList)
			$('#search_schedule_code_modal').modal('hide');
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}

	}).fail(function(data, textStatus, errorThrown) {

	});
}

// 멀티 추가 - TCNUM 조회 팝업
function showAddMultiSearchTcPop() {
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
	
	for(let i = 0; i < listChkList.length; i++) {
		if(listChkList[i].checked) {
			let scheSeqList = null;
			let seq = 0;
			
			const text =`
				<tr id="scheCodeDetNewTr${scheCodeTrIdx}">
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
					<td class=""><input type="text" name="scheCDetSeq" class=" scheSeq" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheCDetSameTC" class=" scheSameTc" value=""></td>
					<td class=" text-center pointer" onClick="delScheduleCodeDet(this)"><i class="fa-solid fa-trash-can"></i></td>
				</tr>`;
			
			$('#getScheCodeDetList').append(text);
			
			scheSeqList = $('input[name="scheCDetSeq"]');
			
			for(let i = 0; i < scheSeqList.length; i++) {
				const curSeq = parseInt(scheSeqList.eq(i).val());
				seq = (curSeq > seq) ? curSeq : seq; 
			}
			
			$('#scheCodeDetNewTr' + scheCodeTrIdx + ' input[name="scheCDetSeq"]').val(++seq);
			$('#scheCodeDetNewTr' + scheCodeTrIdx + ' input[name="scheCDetSeq"]').prop('defaultValue', seq);

			scheCodeTrIdx++;
		}
	}
	
	$('#add_multi_search_tcnum_modal').modal('hide');
}
