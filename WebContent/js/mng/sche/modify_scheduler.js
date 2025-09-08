let scheTrIdx = 0;			/// 스케줄 다음 인덱스 (추가 후 ++)
const domainListArr = [];
// 차트 팝업 조회를 위해 let -> var 변경 
var scheRowList = [];
let scheSeqList = [];
let scheTcSearchList = [];
let curTcSearchTr = null;
const READY_TIME_H = 30;

let childPopup = null;

$(function(){
	initI18n();
	init();
	
	getScheRowList();
	
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
	      namespaces: ['share', 'mngModifySche'],
	      defaultNs: 'mngModifySche'
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
			$('input[name=scheRowChk]').prop('checked', true);
		}else {
			$('input[name=scheRowChk]').prop('checked', false);
		}
		
		setRowSelectedSetName('scheRowChk');
	});
	
	// Tcnum Search 팝업 조회 이벤트 설정
	$('#searchTcPopTcnum, #searchTcPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchTcPopSearch(1);
		}
	});
	
	// Conv 일시 입력 팝업 컴포넌트 설정
	$('#setConvDatePopStime, #setConvDatePopEtime').timepicker({
		timeFormat: 'HH:mm',
		interval: 10,
		dropdown: true,
		dynamic: false,
		scrollbar: true
	});
	$('#convDataAllChk').click(function(){
		if($(this).is(':checked')) {
			$('input[name=convDataChk]').prop('checked', true);
		}else {
			$('input[name=convDataChk]').prop('checked', false);
		}
		
		setRowSelectedSetName('convDataChk');
	});
}

function getScheRowList(){
	
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheRowList.html",
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
			uid: scheUid,
			search2: 'chart'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;

			var text = '';
			scheRowList = [];
			scheRowList.push(result.list); // scheRowList 배열 담기

			// Schedule Detail 스크롤 및 기본 크기 설정
//			$("#dDataPanel").css('overflow-y', 'auto');
//			$("#dDataPanel").css('max-height', (screen.height * 0.7) + 'px');

			for(let i in jsonResult) {
				
				text +=`
					<tr id="scheModTr${i}">
						<td class="text-center"><input type="checkbox" data-uid="${jsonResult[i].uid}" data-flag="R" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
						<td class=""><input type="text" name="scheCate" class=" scheCate" value="${jsonResult[i].category}"></td>
						<td class="">
							<div class="d-flex align-items-center">
								<div>
									<input name="scheTcnum" type="text" class="inputSearch" data-codeuid="${jsonResult[i].codedetuid}" data-codetcnum="${jsonResult[i].codedettcnum}" data-codedesc="${jsonResult[i].codedetdesc}" value="${jsonResult[i].tcnum}">
								</div>
								<div class="flex-grow-1">
									<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
								</div>
							</div>
						</td>
						<td class=""><input type="text" name="scheDesc" class="" value="${jsonResult[i].desc}"></td>
						<td class=""><select name="scheCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'ctype')}</select></td>
						<td class=""><input type="text" name="scheLoad" class=" scheLoad" value="${getLoadRate(jsonResult[i].loadrate, true)}"></td>
						<td class=""><select name="scheDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'dtype')}</select></td>
						<td class=""><input type="date" name="scheSdate" class=" scheDate" value="${jsonResult[i].sdate}"></td>
						<td class=""><input type="text" name="scheStime" class=" scheTime" value="${jsonResult[i].stime}"></td>
						<td class=""><input type="date" name="scheEdate" class=" scheDate" value="${jsonResult[i].edate}"></td>
						<td class=""><input type="text" name="scheEtime" class=" scheTime" value="${jsonResult[i].etime}"></td>
						<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i>
							<input type="hidden" name="schePerformancesdate" class=" schePerformancesdate" value="${jsonResult[i].performancesdate}" />
							<input type="hidden" name="schePerformancestime" class=" schePerformancestime" value="${jsonResult[i].performancestime}" />
							<input type="hidden" name="schePerformanceedate" class=" schePerformanceedate" value="${jsonResult[i].performanceedate}" />
							<input type="hidden" name="schePerformanceetime" class=" schePerformanceetime" value="${jsonResult[i].performanceetime}" />
						</td>
					</tr>`;
				
				scheTrIdx = i;
			}

			$("#getScheRowList").empty();
      
			if(text == '') {
				$("#getScheRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
			} else{
				$("#getScheRowList").append(text);
				
				// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
				setCompEvent();
				
				// SEQ 정렬
				refreshSeq(scheRowList[0]);
				
				// Ctype의 유형에 따라 input 배경 처리
				setConvBg(scheRowList[0]);
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
	
}

// 스케줄 추가
function addSchedule() {
	const chkList = $('input[name=scheRowChk]:checked');
	if(chkList.length > 1 ) {
		alertPop($.i18n.t('selectOneMsg'));
	} else{
		closeViewChart();
		scheTrIdx++; 
		let seqVal = getNextSeq();
		let preTr = $('#scheModTr' + (parseInt(scheTrIdx) - 1));
		let sdate = '';
		let stime = '';
		
		if(chkList.length == 1){
			seqVal = getFloatVal(getFloatVal(chkList.eq(0).closest('tr').find('input[name="scheSeq"]').val()) + 0.1);
			preTr = chkList.eq(0).closest('tr');
		}
		
		if(preTr.length > 0){
			const preEdate = preTr.find('input[name="scheEdate"]').val();
			const preEtime = preTr.find('input[name="scheEtime"]').val();
			
			if(!isEmpty(preEdate) && !isEmpty(preEtime)){
				const preEdatetime = new Date( new Date(`${preEdate} ${preEtime}`).getTime() + (1000 * 60) );
				
				sdate = convertDateToStr(preEdatetime, 'D');
				stime = convertDateToStr(preEdatetime, 'T');
			}
		}
		
		const text =`
			<tr id="scheModTr${scheTrIdx}">
				<td class="text-center"><input type="checkbox" data-uid="-1" data-flag="C" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
				<td class=""><input type="text" name="scheCate" class=" scheCate" value=""></td>
				<td class="">
					<div class="d-flex align-items-center">
						<div>
							<input name="scheTcnum" type="text" class="inputSearch" data-codeuid="" value="" data-codetcnum="" data-codedesc="">
						</div>
						<div class="flex-grow-1">
							<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${scheTrIdx})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
						</div>
					</div>
				</td>
				<td class=""><input type="text" name="scheDesc" class="" value=""></td>
				<td class=""><select name="scheCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(null, 'ctype')}</select></td>
				
				<td class=""><input type="text" name="scheLoad" class=" scheLoad" value=""></td>
				<td class=""><select name="scheDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(null, 'dtype')}</select></td>
				<td class=""><input type="date" name="scheSdate" class=" scheDate" value="${sdate}"></td>
				<td class=""><input type="text" name="scheStime" class=" scheTime" value="${stime}"></td>
				<td class=""><input type="date" name="scheEdate" class=" scheDate" value=""></td>
				
				<td class=""><input type="text" name="scheEtime" class=" scheTime" value=""></td>
				<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${seqVal}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="schePer" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value=""></td>
				
				<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i>
					<input type="hidden" name="schePerformancesdate" class=" schePerformancesdate" value="" />
					<input type="hidden" name="schePerformancestime" class=" schePerformancestime" value="" />
					<input type="hidden" name="schePerformanceedate" class=" schePerformanceedate" value="" />
					<input type="hidden" name="schePerformanceetime" class=" schePerformanceetime" value="" />
				</td>
			</tr>`;
		
		if(chkList.length == 1){
			chkList.eq(0).closest('tr').after(text)
			chkList.eq(0).prop('checked', false);
		} else{
			$('#getScheRowList').append(text);
		}
		
		// Time 컴포넌트 설정
		setTimePicker('#scheModTr' + scheTrIdx + ' input[name$="time"]');
		
		// ADD 한 행으로 Focus 이동 
		$('#scheModTr' + scheTrIdx).children().find('input[name="scheCate"]').focus();
		
	}
}

// Row Data를 다시 그리는 함수
function refreshScheRowList(scheMoveRowList){
	scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));

	let text = '';
	for(let i in scheMoveRowList) {
		if(scheMoveRowList[i].flag == 'D') {
			text +=`
				<tr id="scheModTr${i}">
					<td class="text-center"><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
					<td class=""><input type="text" name="scheCate" class=" scheCate" style="text-decoration:line-through;" disabled value="${scheMoveRowList[i].category}"></td>
					<td class="">
						<div class="d-flex align-items-center">
							<div>
								<input name="scheTcnum" type="text" class="inputSearch" style="text-decoration:line-through;" disabled data-codeuid="${scheMoveRowList[i].codedetuid}" data-codetcnum="${scheMoveRowList[i].codedettcnum}" data-codedesc="${scheMoveRowList[i].codedetdesc}" value="${scheMoveRowList[i].tcnum}">
							</div>
							<div class="flex-grow-1">
								<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" disabled onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
							</div>
						</div>
					</td>
					<td class=""><input type="text" name="scheDesc" class="" style="text-decoration:line-through;" disabled value="${scheMoveRowList[i].desc}"></td>
					<td class=""><select name="scheCtype" class=" scheCtype" disabled><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'ctype')}</select></td>
					
					<td class=""><input type="text" name="scheLoad" class=" scheLoad" style="text-decoration:line-through;" disabled value="${getLoadRate(scheMoveRowList[i].loadrate, true)}"></td>
					<td class=""><select name="scheDtype" class=" scheDtype" disabled><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'dtype')}</select></td>
					<td class=""><input type="date" name="scheSdate" class=" scheDate" disabled value="${scheMoveRowList[i].sdate}"></td>
					<td class=""><input type="text" name="scheStime" class=" scheTime" disabled value="${scheMoveRowList[i].stime}"></td>
					<td class=""><input type="date" name="scheEdate" class=" scheDate" disabled value="${scheMoveRowList[i].edate}"></td>
					
					<td class=""><input type="text" name="scheEtime" class=" scheTime" disabled value="${scheMoveRowList[i].etime}"></td>
					<td class=""><input type="text" name="scheSeq" class=" scheSeq" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="schePer" class=" schePer" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheReadyTm" class=" schePer" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheSametc" class=" scheSameTc" style="text-decoration:line-through;" disabled value="${scheMoveRowList[i].sametcnum}"></td>
					
					<td class=" text-center pointer" onClick="delSchedule(this)">
						<i class="fa-solid fa-trash-can"></i>
						<input type="hidden" name="schePerformancesdate" class=" schePerformancesdate" value="${scheMoveRowList[i].performancesdate}" />
						<input type="hidden" name="schePerformancestime" class=" schePerformancestime" value="${scheMoveRowList[i].performancestime}" />
						<input type="hidden" name="schePerformanceedate" class=" schePerformanceedate" value="${scheMoveRowList[i].performanceedate}" />
						<input type="hidden" name="schePerformanceetime" class=" schePerformanceetime" value="${scheMoveRowList[i].performanceetime}" />
					</td>
				</tr>`;
		}else {
			text +=`
				<tr id="scheModTr${i}">
					<td class="text-center"><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
					<td class=""><input type="text" name="scheCate" class=" scheCate" value="${scheMoveRowList[i].category}"></td>
					<td class="">
						<div class="d-flex align-items-center">
							<div>
								<input name="scheTcnum" type="text" class="inputSearch" data-codeuid="${scheMoveRowList[i].codedetuid}" data-codetcnum="${scheMoveRowList[i].codedettcnum}" data-codedesc="${scheMoveRowList[i].codedetdesc}" value="${scheMoveRowList[i].tcnum}">
							</div>
							<div class="flex-grow-1">
								<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
							</div>
						</div>
					</td>
					<td class=""><input type="text" name="scheDesc" class="" value="${scheMoveRowList[i].desc}"></td>
					<td class=""><select name="scheCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'ctype')}</select></td>
					
					<td class=""><input type="text" name="scheLoad" class=" scheLoad" value="${getLoadRate(scheMoveRowList[i].loadrate, true)}"></td>
					<td class=""><select name="scheDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'dtype')}</select></td>
					<td class=""><input type="date" name="scheSdate" class=" scheDate" value="${scheMoveRowList[i].sdate}"></td>
					<td class=""><input type="text" name="scheStime" class=" scheTime" value="${scheMoveRowList[i].stime}"></td>
					<td class=""><input type="date" name="scheEdate" class=" scheDate" value="${scheMoveRowList[i].edate}"></td>
					
					<td class=""><input type="text" name="scheEtime" class=" scheTime" value="${scheMoveRowList[i].etime}"></td>
					<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${scheMoveRowList[i].sametcnum}"></td>
					
					<td class=" text-center pointer" onClick="delSchedule(this)">
						<i class="fa-solid fa-trash-can"></i>
						<input type="hidden" name="schePerformancesdate" class=" schePerformancesdate" value="${scheMoveRowList[i].performancesdate}" />
						<input type="hidden" name="schePerformancestime" class=" schePerformancestime" value="${scheMoveRowList[i].performancestime}" />
						<input type="hidden" name="schePerformanceedate" class=" schePerformanceedate" value="${scheMoveRowList[i].performanceedate}" />
						<input type="hidden" name="schePerformanceetime" class=" schePerformanceetime" value="${scheMoveRowList[i].performanceetime}" />
					</td>
				</tr>`;
		}
	}

	$("#getScheRowList").empty();

	if(text == '') {
		$("#getScheRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
	} else{
		$("#getScheRowList").append(text);
		
		// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
		setTimePicker('input[name$="time"]');
//		setCompEvent();
		
		// Ctype의 유형에 따라 input 배경 처리
		setConvBg(scheMoveRowList);
		
	}
}

// 스케줄 Line 타입 변경
function changeDtype(obj, id) {
	if(obj.value !=  null && !(obj.value === '') && $('#'+id).val() == 'SCHE'){
		$(obj).val('').attr('selected', 'selected');
		alertPop($.i18n.t('errDtype'));
	}
}

// 컴포넌트 및 이벤트 추가
function setCompEvent(){
	
	// 스케줄 상세 정보 접기 및 이벤트로 토글
	$('#dParentData').hide();
	$('#dParentDataHide').off().on('click', function() {
		if($('#dParentData').is(":visible")){
			$('#dParentData').hide();
			$('#dParentDataHide').text($.i18n.t('hideParent'));
//			$("#dDataPanel").css('max-height', (screen.height * 0.7) + 'px');
			document.getElementById('tbWrap').classList.remove('scroll-area-sche');
			document.getElementById('tbWrap').classList.add('scroll-area-sche-hide');
		} else{
			$('#dParentData').show();
			$('#dParentDataHide').text($.i18n.t('showParent'));
//			$("#dDataPanel").css('max-height', (screen.height * 0.5) + 'px');
			document.getElementById('tbWrap').classList.remove('scroll-area-sche-hide');
			document.getElementById('tbWrap').classList.add('scroll-area-sche');
		}
	});
	
	// checkbox는 1건만 체크 
	$('#getScheRowList').on('click', 'input[name=scheRowChk]' , function(e){
		if($(this).is(':checked')){
			$('#getScheRowList').children().find('input[type="checkbox"]').not($(this)).prop('checked', false);
		}
	});
	
	// 입력 컴포넌트 변경 이벤트
	const inputAll = 'input[name="scheCate"], input[name="scheTcnum"], input[name="scheDesc"], input[name="scheLoad"], select[name="scheDtype"], input[name="schePer"], input[name="scheReadyTm"]';
	$('#getScheRowList').on('change', inputAll , function(e){
		// Flag 처리 
		setFlag($(this));
	});
	
	// 그래프 변경 컴포넌트 이벤트 설정
	setCTypeEvent('select[name="scheCtype"]');
	
	// 동일TC 변경 컴포넌트 이벤트 설정
	setSameTcEvent('input[name="scheSametc"]');
	
	// 순서 변경 컴포넌트 이벤트 설정
	setSeqEvent('input[name="scheSeq"]');
	
	// 헤더의 sdate, edate 컨포넌트 Change 이벤트 설정
	$('#sdate, #edate').off().on('change', function(e){
		const sdate = $('#sdate').val();
		const edate = $('#edate').val();
		
		if(!isEmpty(sdate)){
			$('input[name="scheSdate"], input[name="scheEdate"]').prop('min', sdate);
		}
//		$('input[name="scheSdate"], input[name="scheEdate"]').prop('max', edate);
		
		// sdate, edate 모두 있는 경우 period 변경 
		setMainPeriod(sdate, edate);
	});
	
	// input Date 컴포넌트 Change이벤트 설정 
	setDateChgEvent('input[name="scheSdate"], input[name="scheEdate"]');
	
	// Time Picker 설정 
	setTimePicker('input[name$="time"]');
	
	// Table 행 Drag & Drop 설정
	$('#getScheRowList').sortable({
		axis: "y",
		start: function(event, ui){
		},
		update: function(event, ui){
//			console.log('getShceRowList.sortable.update START');
			
			// TC 번호가 입력되어 있는 지 확인
			const tcList = $(this).children().find('input[name="scheTcnum"]');
			
			for(let i = 0; i < tcList.length; i++){
				if(isEmpty(tcList.eq(i).val())){
					alertPop($.i18n.t('required'));
					$(this).sortable('cancel');
				}
			}
			
			// 전체 Date, Time이 입력되어 있는 지 확인
			const datetimeChk = datetimeInputChk();
			if(datetimeChk != '-1'){
				alertPop($.i18n.t('errScheDateTimeRow').replace('{0}', datetimeChk));
				$(this).sortable('cancel');
			}
			
//			console.log('getShceRowList.sortable.update END');
		},
		stop: function(event, ui){
//			console.log('getShceRowList.sortable.stop START');
//			console.log(event);
//			console.log(ui);
			
			// 전체 Seq 재설정
			refreshSeq(scheRowList);
//			console.log('getShceRowList.sortable.stop END');
		}
	});
}

// 스케줄 삭제
function delSchedule(elm) {
	const delTr = $(elm).parent();
	const chk = delTr.children().find('input[name=scheRowChk]');
	
	if(chk.attr('data-flag') != 'D'){
		chk.attr('data-flag', 'D');
		delTr.find('input[type="text"]').css('text-decoration', 'line-through');
		delTr.find('input[type="text"], input[type="date"]').prop('disabled', true);
	} else{
		if(getFloatVal(chk.attr('data-uid')) > 0){
			chk.attr('data-flag', 'R');
		} else{
			chk.attr('data-flag', 'C');
		}
		delTr.find('input[type="text"]').css('text-decoration', 'none');
		delTr.find('input[type="text"], input[type="date"]').prop('disabled', false);
	}
	
	if(childPopup != null) {
		childPopup._detailPopTcUid = chk.attr('data-uid');
		childPopup.delTc(false);
	}
}

// 기간 값 자동 설정
function setPeriod(elm, sDateTime, eDateTime){
	if(!isEmpty(sDateTime) && !isEmpty(eDateTime)){
		const per = eDateTime.getTime() - sDateTime.getTime(); 
		elm.closest('tr').children().find('[name="schePer"]').val(per / 1000 / 60);
	}
}

// 동일 TC 번호에 값 자동 입력
function setDateForSameTc(elm, sDateTime, eDateTime){
	const curTr = elm.closest('tr');
	const curTcnum = curTr.find('input[name="scheTcnum"]').val();

	const curElmDataList = getCurElmData();
	const curPer = (eDateTime.getTime() - sDateTime.getTime()) / 1000 / 60;
	
	for(i in curElmDataList){
		if(curElmDataList[i].sametcnum == curTcnum){
			$('#scheModTr' + i).find('input[name="scheSdate"]').val(convertDateToStr(sDateTime, 'D'));
			$('#scheModTr' + i).find('input[name="scheStime"]').val(convertDateToStr(sDateTime, 'T'));
			
			$('#scheModTr' + i).find('input[name="scheEdate"]').val(convertDateToStr(eDateTime, 'D'));
			$('#scheModTr' + i).find('input[name="scheEtime"]').val(convertDateToStr(eDateTime, 'T'));
			
			$('#scheModTr' + i).find('input[name="schePer"]').val(curPer);
			
			// 값 입력한 항목 Flag Update
			setFlag($('#scheModTr' + i).find('input[name="schePer"]'));
		}
	}
}

// 날짜 변경 값 반환
function getAddDate(date, time, addMils){
	return new Date(new Date(`${date} ${time}`).getTime() + addMils);
}

// Flag 처리 함수 
function setFlag(elm){
	const curChk = elm.closest('tr').children().find('[name="scheRowChk"]');
	
	if(curChk.length > 0){
		// check box의 uid가 있는 지 확인 후 flag 처리
		if(curChk.attr('data-uid') == -1 && curChk.attr('data-flag') != 'C'){
			curChk.attr('data-flag', 'C');
		} else if(curChk.attr('data-uid') != -1 && curChk.attr('data-flag') == 'R'){
			curChk.attr('data-flag', 'U');
		}
	}
}

// Input Date Change 이벤트 설정
function setDateChgEvent(selStr){
	$('#getScheRowList').on('change', selStr, function(e){
		const elm = $(this);
		const curDate = elm.val();
		const othDate = elm.closest('tr').children().find('[name$="date"]').not(this).val();
		const stime = elm.closest('tr').children().find('[name="scheStime"]').val();
		const etime = elm.closest('tr').children().find('[name="scheEtime"]').val();
		
		// Flag 처리 
		setFlag(elm);
		
		if((elm.attr('name') == 'scheSdate' && new Date($('#sdate').val()).getTime() > new Date(elm.val()).getTime())
			/*|| (elm.attr('name') == 'scheEdate' && new Date($('#edate').val()).getTime() < new Date(elm.val()).getTime())*/){
			elm.val(elm.prop('defaultValue'));
			alertPop($.i18n.t('errTime'));
		} else{
			if(!isEmpty(curDate) && !isEmpty(othDate) && !isEmpty(stime) && !isEmpty(etime)){
				if((elm.attr('name') == 'scheSdate' && new Date(curDate + ' ' + stime).getTime() > new Date(othDate + ' ' + etime).getTime())
						|| (elm.attr('name') == 'scheEdate' && new Date(othDate + ' ' + stime).getTime() > new Date(curDate + ' ' + etime).getTime())){
					elm.val(elm.prop('defaultValue'));
					alertPop($.i18n.t('errTime'));
				} else{
					if(elm.attr('name') == 'scheSdate'){
						setPeriod(elm, new Date(`${curDate} ${stime}`), new Date(`${othDate} ${etime}`));
						setDateForSameTc(elm, new Date(`${curDate} ${stime}`), new Date(`${othDate} ${etime}`));
					} else{
						setPeriod(elm, new Date(`${othDate} ${stime}`), new Date(`${curDate} ${etime}`));
						setDateForSameTc(elm, new Date(`${othDate} ${stime}`), new Date(`${curDate} ${etime}`));
					}
				}
			}
			elm.prop('defaultValue', elm.val());
			
		}
		
	});
	
	$(selStr).prop('min', $('#sdate').val());
//	$(selStr).prop('max', $('#edate').val());
}

// Time Picker 설정 및 이벤트 설정
function setTimePicker(selStr){
	// Time 관련 컴포넌트 및 이벤트 추가
	$(selStr).timepicker({
		timeFormat: 'HH:mm',
		interval: 10,
		dropdown: true,
		dynamic: false,
		scrollbar: true,
		change: function(time) {
			const elm = $(this);
			const curTime = elm.val();
			const othTime = elm.closest('tr').children().find('[name*="time"]').not(this).val();
			const sDate = elm.closest('tr').children().find('[name="scheSdate"]').val();
			const eDate = elm.closest('tr').children().find('[name="scheEdate"]').val();
			const per = elm.closest('tr').children().find('[name="schePer"]').val();
			
			// Flag 처리 
			setFlag(elm);
			
			if(sDate != null  && !(sDate === '') && eDate != null  && !(eDate === '') && othTime != null  && !(othTime === '') && curTime != null  && !(curTime === '')){
				if((elm.attr('name') == 'scheStime' && new Date(sDate + ' ' + curTime).getTime() > new Date(eDate + ' ' + othTime).getTime())
					|| (elm.attr('name') == 'scheEtime' && new Date(sDate + ' ' + othTime).getTime() > new Date(eDate + ' ' + curTime).getTime())){
					elm.val(elm.prop('defaultValue'));
					alertPop($.i18n.t('errTime'));
				} else{
					if(elm.attr('name') == 'scheStime'){
						setPeriod(elm, new Date(`${sDate} ${curTime}`), new Date(`${eDate} ${othTime}`));
						setDateForSameTc(elm, new Date(`${sDate} ${curTime}`), new Date(`${eDate} ${othTime}`));
					} else{
						setPeriod(elm, new Date(`${sDate} ${othTime}`), new Date(`${eDate} ${curTime}`));
						setDateForSameTc(elm, new Date(`${sDate} ${othTime}`), new Date(`${eDate} ${curTime}`));
					}
				}
			} else if(elm.attr('name') == 'scheStime' && !isEmpty(curTime) && !isEmpty(sDate) && !isEmpty(per) && isEmpty(eDate) && (isEmpty(othTime) || othTime == '00:00')){
				setEndTm(elm, new Date(`${sDate} ${curTime}`), per);
			}
		}
	});
}

// Sequence 컴포넌트 이벤트 추가 
function setSeqEvent(selStr){
	$('#getScheRowList').on('focus', selStr, function(e){
		
	});
	
	$('#getScheRowList').on('change', selStr, function(e){
		const elm = $(this);
		
		const defVal = getFloatVal(elm.prop('defaultValue'));
		const curVal = getFloatVal(elm.val());
		
		const isAscMov = getFloatVal(curVal) > getFloatVal(defVal);
		
		const curElmDataList = getCurElmData();
		const seqElmList = $(selStr);
		
		// 전체 Date, Time이 입력되어 있는 지 확인
		const datetimeChk = datetimeInputChk();
		if(datetimeChk != '-1'){
			elm.val(defVal);
			alertPop($.i18n.t('errScheDateTimeRow').replace('{0}', datetimeChk));
			return;
		}
		
		const curRowData = getSeqChgCurRowData(defVal, elm);
		curRowData.loadrate = getLoadRate(curRowData.loadrate, false)
		const curClacTime = getCurRowCalcTime(curRowData);
		const maxSeq = getMaxSeq();
		const scheMoveRowList = [];

		for(let i = 0; i < curElmDataList.length; i++){
//			let iSeq = getFloatVal(scheRowList[0][i].seq);
			let iSeq = getFloatVal(seqElmList.eq(i).prop('defaultValue'));
			// Date 값이 있는 경우
			if(!isEmpty(curRowData.sdate) && !isEmpty(curRowData.edate)){
				// 상위 에서 하위로 내릴 때
				if(isAscMov){
					if(defVal > iSeq || curVal < iSeq){
						scheMoveRowList.push(curElmDataList[i]);
					} else{
						let sDateTime = null;
						let eDateTime = null;
						let rowData = null;
						if(defVal <= iSeq && curVal != iSeq && (i+1) < curElmDataList.length){
							rowData = curElmDataList[i+1];
							sDateTime = new Date(new Date(`${curElmDataList[i+1].sdate} ${curElmDataList[i+1].stime}`).getTime() - curClacTime);
							eDateTime = new Date(new Date(`${curElmDataList[i+1].edate} ${curElmDataList[i+1].etime}`).getTime() - curClacTime);
							
						} else if(curVal == iSeq || curVal >= maxSeq){
							const preRowData = scheMoveRowList[scheMoveRowList.length - 1];
							rowData = curRowData;
							sDateTime = new Date(new Date(`${preRowData.edate} ${preRowData.etime}`).getTime() + (getFloatVal(rowData.readytime) * 1000 * 60));
							eDateTime = new Date(sDateTime.getTime() + (getFloatVal(rowData.per) * 1000 * 60));
						}
						
						if(!isEmpty(rowData)){
							scheMoveRowList.push(getCurSeqInputData(rowData, sDateTime, eDateTime, iSeq));
						} else{
							alertPop($.i18n.t('share:tryAgain'));
							return;
						}
					}
					
				} 
				// 하위 에서 상위로 올릴 때 
				else{
					if(defVal < iSeq || curVal > iSeq){
						scheMoveRowList.push(curElmDataList[i]);
					} else{
						let sDateTime = null;
						let eDateTime = null;
						let rowData = null;
						
						if(curVal == iSeq && curVal != 1){
							const preRowData = scheMoveRowList[scheMoveRowList.length - 1];
							rowData = curRowData;
							sDateTime = new Date(new Date(`${preRowData.edate} ${preRowData.etime}`).getTime() + (getFloatVal(rowData.readytime) * 1000 * 60));
							eDateTime = new Date(sDateTime.getTime() + (getFloatVal(rowData.per) * 1000 * 60));
							
						} else if(defVal >= iSeq && curVal != iSeq && (i-1) > -1){
							rowData = curElmDataList[i-1];
							sDateTime = new Date(new Date(`${curElmDataList[i-1].sdate} ${curElmDataList[i-1].stime}`).getTime() + curClacTime);
							eDateTime = new Date(new Date(`${curElmDataList[i-1].edate} ${curElmDataList[i-1].etime}`).getTime() + curClacTime);
						} else if(curVal == 1){
							rowData = curRowData;
							sDateTime = new Date(new Date(`${curElmDataList[0].sdate} ${curElmDataList[0].stime}`).getTime());
							eDateTime = new Date(sDateTime.getTime() + (getFloatVal(rowData.per) * 1000 * 60));
						}
													
						if(!isEmpty(rowData)){
							scheMoveRowList.push(getCurSeqInputData(rowData, sDateTime, eDateTime, iSeq));
						} else{
							alertPop($.i18n.t('share:tryAgain'));
							return;
						}
					}
				}
			} 
			// Date 값이 없는 경우
			else{
				if(isAscMov){
					if(defVal > iSeq || curVal < iSeq){
						scheMoveRowList.push(curElmDataList[i]);
					} else{
						if(defVal <= iSeq && curVal != iSeq && (i+1) < curElmDataList.length){
							scheMoveRowList.push(getCurSeqInputData(curElmDataList[i+1], null, null, iSeq));
						} else if(curVal == iSeq){
							scheMoveRowList.push(getCurSeqInputData(curRowData, null, null, iSeq));
						}
					}
				} else{
					if(defVal < iSeq || curVal > iSeq){
						scheMoveRowList.push(curElmDataList[i]);
					} else{
						if(curVal == iSeq){
							scheMoveRowList.push(getCurSeqInputData(curRowData, null, null, iSeq));
						} else if(defVal >= iSeq && curVal != iSeq && (i-1) > -1){
							scheMoveRowList.push(getCurSeqInputData(curElmDataList[i-1], null, null, iSeq));
						}
					}
				}
			}
		}

		// 이동 한 데이터로 테이블 재 생성
		refreshScheRowList(scheMoveRowList);
		
		// 전체 목록 데이터 초기화
		scheRowList = [];
		scheRowList.push(scheMoveRowList);
	});
}

// 동일TC 컴포넌트 이벤트 추가
function setSameTcEvent(selStr){
	$('#getScheRowList').on('change', selStr, function(e){
		const elm = $(this);
		const curTr = elm.closest('tr'); 
		const curVal = !isEmpty(elm.val()) ? elm.val().trim() : elm.val();
		
		const curTcnum = curTr.find('input[name="scheTcnum"]').val();
		const scheTcnum = $('input[name="scheTcnum"]');
		
		let tcIdx = -1;
		const curIdx = parseInt(curTr.attr('id').replace('scheModTr',''));
		
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
				
				// 현재 컴포넌트 데이터로 scheRowList 초기화
				const curElmDataList = getCurElmData();
				
				const scheMoveRowList = [];
				let isDescMov = tcIdx < curIdx;
				
				for(let i = 0; i < curElmDataList.length; i++){
					let rowData = null;
						
					if(isDescMov){
						if((tcIdx + 1) == i){
							rowData = getCurSameTcInputData(curElmDataList[curIdx], curVal, (i+1), curElmDataList[i-1]);
						} else if(i <= tcIdx || curIdx < i){
							rowData = curElmDataList[i];
						} else{
							rowData = getCurSameTcInputData(curElmDataList[i-1], scheRowList[0][i-1].sametcnum, (i+1), null);
						}
					} else{
						if(tcIdx == i){
							rowData = getCurSameTcInputData(curElmDataList[curIdx], curVal, (i+1), curElmDataList[i]);
						} else if(i > tcIdx || curIdx > i){
							rowData = curElmDataList[i];
						} else{
							rowData = getCurSameTcInputData(curElmDataList[i+1], scheRowList[0][i+1].sametcnum, (i+1), null);
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
				scheRowList = [];
				scheRowList.push(scheMoveRowList);
			}
			// 오류 값이면 메시지 출력 후 원래 값 입력
			else{
				alertPop($.i18n.t('sameTcErr'));
				elm.val(elm.prop('defaultValue'));
			}
		}
	});
}

// 테이블 로드 시 그래프가 Convenient 유형일 때 배경 처리 
function setConvBg(scheRowDataList){
	for(let i = 0; i < scheRowDataList.length; i++){
		if(!isEmpty(scheRowDataList[i].ctype) && (scheRowDataList[i].ctype == 'CONV' || scheRowDataList[i].ctype == 'CONVB')){
			$('#scheModTr'+i).find('input[type="text"], input[type="date"], select').addClass("scheConvBg");
		}
	}
}

// ctype 변경 이벤트 추가 
function setCTypeEvent(selStr){
	$('#getScheRowList').on('change', selStr, function(e){



		const elm = $(this);
		const curElms = elm.closest('tr').find('input[type="text"], input[type="date"], select');

		console.log(elm.val())

		if((elm.val() == 'CONV' || elm.val() == 'CONVB') && !curElms.hasClass('scheConvBg')){
			console.log(1)
			curElms.addClass("scheConvBg");
		} else if((elm.val() != 'CONV' && elm.val() != 'CONVB') && curElms.hasClass('scheConvBg')){
			console.log(2)
			curElms.removeClass("scheConvBg");
		}
		
		setFlag(elm);
	});
	
}

//End Date, Time 자동 설정
function setEndTm(elm, sDateTime, per){
	if(!isEmpty(sDateTime) && !isEmpty(per)){
		const edate = elm.closest('tr').children().find('[name="scheEdate"]');
		const etime = elm.closest('tr').children().find('[name="scheEtime"]');
		
		const eDateTime = new Date(sDateTime.getTime() + (per * 1000 * 60));
		
		edate.val(convertDateToStr(eDateTime, 'D'));
		etime.val(convertDateToStr(eDateTime, 'T'));
	}
}

// 내부적으로 계산하는 Period 값 계산
function setMainPeriod(sdate, edate){
	if(!isEmpty(sdate) && !isEmpty(edate)){
		$('#period').val(((new Date(new Date(edate).getTime() - new Date(sdate).getTime()).getTime()) / 1000 / 60 / 60 / 24) + 1);
	}
}

// TCNUM 검색 버튼 클릭 이벤트
function setTcnumBtn(idx){
	// 조회 값 초기화
	$('#searchTcPopTcnum').val('');
	$('#searchTcPopDesc').val('');
	
	$('#search_tcnum_modal').modal();
	curTcSearchTr = $('#scheModTr'+idx);
	searchTcPopSearch(1);
}

function setChartTcnumBtn(idx){
	// 조회 값 초기화
	$('#searchTcPopTcnum').val('');
	$('#searchTcPopDesc').val('');

	$('#search_tcnum_modal').modal();

	// searchTcPopSearch(1);
}

// TCNUM 조회 팝업 검색 버튼 이벤트
function searchTcPopSearch(page){
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheTcNumSearchList.html",
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
			shiptype: $('#shiptype').val(),
			displaycode: $('#searchTcPopTcnum').val(),
			description: $('#searchTcPopDesc').val(),
			schedtype: $('#schedtype option:selected').val(),
			status: 'ACT'
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
						<td class="text-center" onClick="selectTcNum(${i})">${jsonResult[i].dtype}</td>
						<td class="text-center" onClick="selectTcNum(${i})">${jsonResult[i].ctype}</td>
						<td class="text-center" onClick="selectTcNum(${i})">${jsonResult[i].loadstr}</td>
						<td class="text-right" onClick="selectTcNum(${i})">${getFloatVal(jsonResult[i].per)}</td>
						<td class="text-right" onClick="selectTcNum(${i})">${getFloatVal(jsonResult[i].readytime)}</td>
					</tr>`;
			}

			$("#searchTcPopList").empty();
      
			if(jsonResult.length > 0) {
				$("#searchTcPopList").append(text);
			} else{
				$("#searchTcPopList").append('<tr><td class="text-center" colspan="7">' + $.i18n.t('share:noList') + '</td></tr>');
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
		const chkbox = curTcSearchTr.find('input[name="scheRowChk"]');
		const cate = curTcSearchTr.find('input[name="scheCate"]');
		const tcnum = curTcSearchTr.find('input[name="scheTcnum"]');
		const desc = curTcSearchTr.find('input[name="scheDesc"]');
		const ctype = curTcSearchTr.find('select[name="scheCtype"]');
		
		const load = curTcSearchTr.find('input[name="scheLoad"]');
		const dtype = curTcSearchTr.find('select[name="scheDtype"]');
		const sdate = curTcSearchTr.find('input[name="scheSdate"]');
		const stime = curTcSearchTr.find('input[name="scheStime"]');
		const edate = curTcSearchTr.find('input[name="scheEdate"]');
		
		const etime = curTcSearchTr.find('input[name="scheEtime"]');
		const per = curTcSearchTr.find('input[name="schePer"]');
		const readyTm = curTcSearchTr.find('input[name="scheReadyTm"]');
		const sameTc = curTcSearchTr.find('input[name="scheSametc"]');
		
		const flag = chkbox.attr('data-flag');
		
		const selPer = getFloatVal(scheTcSearchList[idx].per);
		const selReadyTm = getFloatVal(scheTcSearchList[idx].readytime);
		
		// 플래그 처리 및 값 입력
		if(flag == 'R'){
			chkbox.attr('data-flag','U');
		}
		cate.val(scheTcSearchList[idx].lv1code);
		tcnum.val(scheTcSearchList[idx].displaycode);
		tcnum.attr('data-codeuid', scheTcSearchList[idx].uid);
		tcnum.attr('data-codetcnum', scheTcSearchList[idx].displaycode);
		tcnum.attr('data-codedesc', scheTcSearchList[idx].description);
		desc.val(scheTcSearchList[idx].description);
		ctype.val(scheTcSearchList[idx].ctype);
		load.val(getLoadRate(scheTcSearchList[idx].loadrate, true));
		
		dtype.val(scheTcSearchList[idx].dtype);
		per.val(selPer);
		readyTm.val(selReadyTm);
		sameTc.val(scheTcSearchList[idx].sametcnum);
		
		// 최초 추가 인 경우 준비 시간, 기간에 따른 시작일시, 완료 일시 설정
		if(flag == 'C'){
			let tmpSdate = sdate.val();
			let tmpStime = stime.val();
			
			if(tmpSdate === '' || tmpStime === ''){
				let totEdate = $('input[name="scheEdate"]');
				let totEtime = $('input[name="scheEtime"]');
				for(let i = totEdate.length - 1; i > -1; i--){
					if(totEdate.eq(i).val() !== '' && totEtime.eq(i).val() !== ''){
						tmpSdate = totEdate.eq(i).val();
						tmpStime = totEtime.eq(i).val();
						break;
					}
				}
			}
			
			const sDateTime = new Date( new Date(`${tmpSdate} ${tmpStime}`).getTime() + (1000 * 60 * (selReadyTm === '' ? READY_TIME_H : selReadyTm)) );
			const eDateTime = new Date( new Date(`${convertDateToStr(sDateTime, 'D')} ${convertDateToStr(sDateTime, 'T')}`).getTime() + (1000 * 60 * (selPer === '' ? 0 : selPer)) );
			
			sdate.val(convertDateToStr(sDateTime, 'D'));
			stime.val(convertDateToStr(sDateTime, 'T'));
			edate.val(convertDateToStr(eDateTime, 'D'));
			etime.val(convertDateToStr(eDateTime, 'T'));
		}
	}
	
	$('#search_tcnum_modal').modal('hide');
}

// 시작일시 기준 전체 시각 설정
function setAllDateTime(){
	
	let enddate = null;
	const rowChk = $('input[name="scheRowChk"]');
	const scheSdate = $('input[name="scheSdate"]');
	const scheStime = $('input[name="scheStime"]');
	const scheEdate = $('input[name="scheEdate"]');
	const scheEtime = $('input[name="scheEtime"]');
	
	const schePer = $('input[name="schePer"]');
	const scheReady = $('input[name="scheReadyTm"]');
	const scheSametc = $('input[name="scheSametc"]');
	const scheTcnum = $('input[name="scheTcnum"]');
	const scheCtype = $('select[name="scheCtype"]');
	
	// 첫 행의 Start Date, Time 이 없으면 오류
	if(isEmpty(scheSdate.eq(0).val()) || isEmpty(scheStime.eq(0).val())){
		alertPop($.i18n.t('required'));
		return;
	}
	
	// Date, Time 입력 로직
	for(let i = 0; i < scheSdate.length; i++){
		// Flag 값이 D, Ctype이 Convenient 인 경우 제외 진행 
		if(rowChk.eq(i).attr('data-flag') != 'D' && (scheCtype.eq(i).val() != 'CONV' || scheCtype.eq(i).val() != 'CONVB')){
			const perMil = convertMinToMill(schePer.eq(i).val());
			const readyMil = convertMinToMill(scheReady.eq(i).val());
			let startDate = null;
			let endDate = null;
			let isChg = false;
			
			if(i == 0){
				endDate = new Date(new Date(`${scheSdate.eq(0).val()} ${scheStime.eq(0).val()}`).getTime() + perMil);
				scheEdate.eq(0).val(convertDateToStr(endDate, 'D'));
				scheEtime.eq(0).val(convertDateToStr(endDate, 'T'));
				isChg = true;
			} else{
				if(isEmpty(scheSametc.eq(i).val())){
					let revIdx = -1;
					for(let j = i-1; j >= 0; j--){
						if(rowChk.eq(j).attr('data-flag') != 'D' && (scheCtype.eq(j).val() != 'CONV' || scheCtype.eq(j).val() != 'CONVB')){
							revIdx = j;
							break;
						}
					}
					
					if(revIdx > -1){
						startDate = new Date(new Date(`${scheEdate.eq(revIdx).val()} ${scheEtime.eq(revIdx).val()}`).getTime() + readyMil);
						endDate = new Date(startDate.getTime() + perMil);
					} 
				} else{
					const sameIdx = getSameTcIdx(scheTcnum, scheSametc.eq(i).val());
					
					if(sameIdx > 0){
						startDate = new Date(`${scheSdate.eq(sameIdx).val()} ${scheStime.eq(sameIdx).val()}`);
						endDate = new Date(`${scheEdate.eq(sameIdx).val()} ${scheEtime.eq(sameIdx).val()}`);
					} else{
						alertPop($.i18n.t('required'));
						return;
					}
				}
				
				if(!isEmpty(startDate) && !isEmpty(endDate)){
					scheSdate.eq(i).val(convertDateToStr(startDate, 'D'));
					scheStime.eq(i).val(convertDateToStr(startDate, 'T'));
					
					scheEdate.eq(i).val(convertDateToStr(endDate, 'D'));
					scheEtime.eq(i).val(convertDateToStr(endDate, 'T'));
					isChg = true;
					
					// 조회 데이터 업데이트
					scheRowList[0][i].sdate = convertDateToStr(startDate, 'D');
					scheRowList[0][i].stime = convertDateToStr(startDate, 'T');
					
					scheRowList[0][i].edate = convertDateToStr(endDate, 'D');
					scheRowList[0][i].etime = convertDateToStr(endDate, 'T');
				}
			}
			
			if(isChg && rowChk.eq(i).attr('data-flag') != 'C'){
				rowChk.eq(i).attr('data-flag', 'U');
				scheRowList[0][i].flag = 'U';
			}
		}
	}
	enddate = getEndDate(scheEdate);
	
	$('#edate').val(enddate);
	
	// Period 자동 갱신 
	setMainPeriod($('#sdate').val(), enddate);
}

// 동일한 TC NUM의 Index 반환
function getSameTcIdx(scheTcnum, tcnum){
	let rtnIdx = -1;
	
	for(let i = 0; i < scheTcnum.length; i++){
		if(scheTcnum.eq(i).val().trim() == tcnum.trim()){
			rtnIdx = i;
			break;
		}
	}
	
	return rtnIdx;
}

// 현재 이동 하려는 Seq의 시간 계산 값 반환
function getCurRowCalcTime(curRowData){
	let rtnTime = 0;
	
	if(!isEmpty(curRowData) && (!isEmpty(curRowData.per) || !isEmpty(curRowData.readytime))){
		rtnTime = (getFloatVal(curRowData.per) + getFloatVal(curRowData.readytime)) * 1000 * 60;
	}
	
	return rtnTime;
}

// 현재 이동 하려는 Seq의 행 데이터 반환 
function getSeqChgCurRowData(seq, elm){
	let prtTr = elm.closest('tr');
	
	const curRow = {
		uid: prtTr.children().find('input[name="scheRowChk"]').eq(0).attr('data-uid'),
		category: prtTr.children().find('input[name="scheCate"]').eq(0).val(),
		tcnum: prtTr.children().find('input[name="scheTcnum"]').eq(0).val(),
		ctype: prtTr.children().find('select[name="scheCtype"]').eq(0).val(),
		desc: prtTr.children().find('input[name="scheDesc"]').eq(0).val(),
		dtype: prtTr.children().find('select[name="scheDtype"]').eq(0).val(),
		edate: prtTr.children().find('input[name="scheEdate"]').eq(0).val(),
		etime: prtTr.children().find('input[name="scheEtime"]').eq(0).val(),
		loadrate: prtTr.children().find('input[name="scheLoad"]').eq(0).val(),
		per: prtTr.children().find('input[name="schePer"]').eq(0).val(),
		readytime: prtTr.children().find('input[name="scheReadyTm"]').eq(0).val(),
		sametcnum: prtTr.children().find('input[name="scheSametc"]').eq(0).val(),
		sdate: prtTr.children().find('input[name="scheSdate"]').eq(0).val(),
		stime: prtTr.children().find('input[name="scheStime"]').eq(0).val(),
		codedetuid: prtTr.children().find('input[name="scheTcnum"]').eq(0).attr('data-codeuid'),
		codedettcnum: prtTr.children().find('input[name="scheTcnum"]').eq(0).attr('data-codetcnum'),
		codedetdesc: prtTr.children().find('input[name="scheTcnum"]').eq(0).attr('data-codedesc'),
		seq: seq,
		flag: prtTr.children().find('input[name="scheRowChk"]').eq(0).attr('data-flag'),
		performancesdate: prtTr.children().find('input[name="schePerformancesdate"]').eq(0).val(),
		performancestime: prtTr.children().find('input[name="schePerformancestime"]').eq(0).val(),
		performanceedate: prtTr.children().find('input[name="schePerformanceedate"]').eq(0).val(),
		performanceetime: prtTr.children().find('input[name="schePerformanceetime"]').eq(0).val(),
	};
	
	return curRow;
}

// Seq 입력용 데이터 생성 
function getCurSeqInputData(rowData, sDateTime, eDateTime, iSeq){
	const curInputData = {
			uid: rowData.uid,
			category: rowData.category,
			tcnum: rowData.tcnum,
			ctype: rowData.ctype,
			desc: rowData.desc,
			dtype: rowData.dtype,
			edate: !isEmpty(eDateTime) ? convertDateToStr(eDateTime, 'D') : '',
			etime: !isEmpty(eDateTime) ? convertDateToStr(eDateTime, 'T') : '',
			loadrate: rowData.loadrate,
			note: rowData.note,
			per: rowData.per,
			readytime: rowData.readytime,
			sametcnum: rowData.sametcnum,
			sdate: !isEmpty(sDateTime) ? convertDateToStr(sDateTime, 'D') : '',
			stime: !isEmpty(sDateTime) ? convertDateToStr(sDateTime, 'T') : '',
			codedetuid: rowData.codedetuid,
			seq: iSeq,
			flag: (rowData.flag != 'D' && rowData.flag != 'C') ? 'U' : rowData.flag,
			performancesdate : rowData.performancesdate,
			performancestime : rowData.performancestime,
			performanceedate : rowData.performanceedate,
			performanceetime : rowData.performanceetime
		};
	
	return curInputData;
}

// Same Tc 입력용 데이터 생성 
function getCurSameTcInputData(rowData, sameTc, iSeq, prevData){
	let extPre = !isEmpty(prevData) ? true : false;
	const curInputData = {
			schedinfouid: rowData.schedinfouid,
			uid: rowData.uid,
			category: rowData.category,
			tcnum: rowData.tcnum,
			ctype: rowData.ctype,
			desc: rowData.desc,
			dtype: rowData.dtype,
			edate: extPre ? prevData.edate : rowData.edate,
			etime: extPre ? prevData.etime : rowData.etime,
			loadrate: rowData.loadrate,
			note: rowData.note,
			per: extPre ? prevData.per : rowData.per,
			readytime: rowData.readytime,
			sametcnum: sameTc,
			sdate: extPre ? prevData.sdate : rowData.sdate,
			stime: extPre ? prevData.stime : rowData.stime,
			codedetuid: rowData.codedetuid,
			seq: iSeq,
			flag: (rowData.flag != 'D' && rowData.flag != 'C') ? 'U' : rowData.flag,
			performancesdate : rowData.performancesdate,
			performancestime : rowData.performancestime,
			performanceedate : rowData.performanceedate,
			performanceetime : rowData.performanceetime
		};
	
	return curInputData;
}

// Sequence 최대 값
function getMaxSeq(){
	let maxSeq = 0;
	
	for(let i = 0; i < scheRowList[0].length; i++){
		let seq = getFloatVal(scheRowList[0][i].seq);
		if(maxSeq < seq){
			maxSeq = seq;
		}
	}
	
	return maxSeq;
}

// End Date 중 최대값
function getEndDate(scheEdate){
	let maxDate = null;
	for(let i = 0; i < scheEdate.length; i++){
		const curDate = new Date(scheEdate.eq(i).val());
		if(isEmpty(maxDate) || (!isEmpty(maxDate) && maxDate.getTime() < curDate.getTime())){
			maxDate = curDate;
		}
	}
	
	return convertDateToStr(maxDate, 'D');
}

// Sequence 전체 재 설정
function refreshSeq(scheChgRowList){
	const scheSeqList = $('input[name="scheSeq"]');
	let seq = 0;
	for(let i = 0; i < scheSeqList.length; i++){
		const scheSeq = scheSeqList.eq(i);
		const scheChk = scheSeq.closest('tr').children().find('[name="scheRowChk"]').eq(0);
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

// 전체 Chart 팝업으로 출력
function viewChart(){
	const scheNewRowList = getCurElmData();
	if(isEmpty(scheNewRowList) || scheNewRowList.length == 0) {
		alertPop($.i18n.t('required'));
	} else{
		scheRowList = [];
		scheRowList.push(scheNewRowList); 
		
		// 팝업 호출 
		childPopup = window.open(contextPath + '/mng/sche/popModifySchedulerChart.html', 'viewChart', '');
	}
}

// Conv 유형 날짜 일괄 입력 버튼 설정
function setConvDateBtn(){
	// 날짜 적용 값 초기화
	$('#setConvDatePopSdate').val($('#sdate').val());
	$('#setConvDatePopStime').val('00:00');
	$('#setConvDatePopEdate').val($('#sdate').val());
	$('#setConvDatePopEtime').val('00:00');
	
	$('#setConvDatePopSdate').prop('min', $('#sdate').val());
	$('#setConvDatePopEdate').prop('min', $('#sdate').val());
	
	$('#set_conv_modal').modal();
	setConvDataList();
}

// Conv 유형 데이터 목록 설정
function setConvDataList(){
	const allDataList = getCurElmData();
	let tbody = '';
	
	for(data of allDataList){
		if(data.ctype == 'CONV' || data.ctype == 'CONVB'){
			tbody += `
			<tr>
				<td class=" scheCate"><input type="checkbox" data-uid="${data.uid}" name="convDataChk" onclick="setRowSelectedSetName('convDataChk')"></td>
				<td class=" scheTime" name="convTcnum">${data.tcnum}</td>
				<td class=" scheConvDesc">${data.desc}</td>
				<td class="">${data.sdate}</td>
				<td class="">${data.stime}</td>
				<td class="">${data.edate}</td>
				<td class="">${data.etime}</td>
			</tr>`;
		}
	}
	
	$("#setConvDatePopList").empty();
	
	if(tbody === ''){
		$('#setConvDatePopList').append('<tr><td class="text-center" colspan="7">' + $.i18n.t('share:noList') + '</td></tr>');
	} else{
		$('#setConvDatePopList').append(tbody);
	}
}

//Conv 유형 적용 버튼 클릭 이벤트 설정
function setConvDateApplyBtn(){
	const sdate = $('#setConvDatePopSdate').val();
	const stime = $('#setConvDatePopStime').val();
	const edate = $('#setConvDatePopEdate').val();
	const etime = $('#setConvDatePopEtime').val();
	
	const chkList = $('input[name=convDataChk]:checked');
	const totChkList = $('input[name=scheRowChk]');
	
	// 체크된 스케줄이 있는지 확인
	if(chkList.length == 0){
		// 알림 팝업 가장 위로 올린 후에 오류 메시지 발생 
		$('#alertPop').css('z-index', 9999);
		alertPop($.i18n.t('setConvDatePop.selectMsg'));
		return;
	}
	
	// 시작일시, 완료일시 입력 값이 모두 있는 지 확인
	if(sdate !== '' && stime !== '' && edate !== '' && etime !== ''){
		
		for(let i = 0; i < totChkList.length; i++){
			let totUid = getFloatVal(totChkList.eq(i).attr('data-uid'));
			
			for(let j = 0; j < chkList.length; j++){
				let uid = getFloatVal(chkList.eq(j).attr('data-uid'));
				
				if(totUid == uid){
					const chgTr = totChkList.eq(i).closest('tr');
					chgTr.find('input[name="scheSdate"]').val(sdate);
					chgTr.find('input[name="scheStime"]').val(stime);
					chgTr.find('input[name="scheEdate"]').val(edate);
					chgTr.find('input[name="scheEtime"]').val(etime);
					
					// flag 업데이트 
					setFlag(chgTr.find('input[name="scheRowChk"]'));
				}
			}
		}
		
		// 입력 한 값 재 조회 
		setConvDataList();
		$('#convDataAllChk').prop('checked', false);
		
	} else{
		// 알림 팝업 가장 위로 올린 후에 오류 메시지 발생 
		$('#alertPop').css('z-index', 9999);
		alertPop($.i18n.t('setConvDatePop.errDateEmpty'));
	}
}

// 스케줄 저장
function saveSchedule() {
	let isEmptySche = false;
	let emptyMsg = '';
	
	const pUid = scheUid;
	const desc = $('#desc').val();
	const sdate = $('#sdate').val();
	let edate = $('#edate').val();
	const schedtype = $('#schedtype').val();
	const shiptype = $('#shiptype').val();

	const scheEdate = $('input[name="scheEdate"]');
	
//	const detailList = [];
	const uidList = [];
	const cateList = [];
	const tcnumList = [];
	const descList = [];
	const loadList = [];
	
	const sdateList = [];
	const stimeList = [];
	const edateList = [];
	const etimeList = [];
	const seqList = [];
	
	const perList = [];
	const flagList = [];
	
	const ctypeList = [];
	const dtypeList = [];
	const readyTmList = [];
	const codedetuidList = [];
	const sametcnumList = [];

	const performancesdateList = []
	const performancestimeList = []
	const performanceedateList = []
	const performanceetimeList = []

	const codedettcnumList = [];
	const codedetdescList = [];
	
	// 스케줄이 있고 End Date 가 비어 있는 경우 보정
	if(isEmpty(edate)){
		edate = getEndDate(scheEdate);
	}

	if(isEmpty(sdate) || isEmpty(edate)) {
		isEmptySche = true;
		emptyMsg = $.i18n.t('errScheMain');
	} else {
		const curRowList = getCurElmData();

		for(curRow of curRowList) {
			uidList.push(curRow.uid);
			cateList.push(curRow.category);
			tcnumList.push(curRow.tcnum);
			descList.push(curRow.desc);
			ctypeList.push(curRow.ctype);

			loadList.push(curRow.loadrate);
			dtypeList.push(curRow.dtype);
			sdateList.push(curRow.sdate);
			stimeList.push(curRow.stime);
			edateList.push(curRow.edate);

			etimeList.push(curRow.etime);
			seqList.push(curRow.seq);
			perList.push(curRow.per);
			readyTmList.push(curRow.readytime);
			flagList.push(curRow.flag);

			codedetuidList.push(curRow.codedetuid);
			sametcnumList.push(curRow.sametcnum);

			performancesdateList.push(curRow.performancesdate)
			performancestimeList.push(curRow.performancestime)
			performanceedateList.push(curRow.performanceedate)
			performanceetimeList.push(curRow.performanceetime)

			codedettcnumList.push(curRow.codedettcnum ?? "")
			codedetdescList.push(curRow.codedetdesc ?? "")
		}
	}

	if(isEmptySche) {
		alertPop(emptyMsg);
	} else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/sche/updateSche.html',
			traditional: true,
			data: {
				'uid': pUid,
				'description': desc,
				shiptype,
				sdate,
				edate,
				schedtype,
				uidList,
				cateList, 
				tcnumList,
				descList,
				loadList,
				sdateList,
				stimeList,
				edateList,
				etimeList,
				seqList,
				perList,
				flagList,
				ctypeList,
				dtypeList,
				readyTmList,
				codedetuidList,
				sametcnumList,
				performancesdateList,
				performancestimeList,
				performanceedateList,
				performanceetimeList,
				codedettcnumList,
				codedetdescList
			},
			success: function(data) {
				var json = JSON.parse(data);

				closeViewChart();
				
				if(json.result) {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/mng/sche/modifyScheduler.html?uid='+ pUid;
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

// 현재 모든 컴포넌트의 값을 반환 
function getCurElmData(){
	const curRowList = [];
	let isEmptySche = false;
	
	const rowChk = $('input[name="scheRowChk"]');
	const scheCate = $('input[name="scheCate"]');
	const scheTcnum = $('input[name="scheTcnum"]');
	const scheDesc = $('input[name="scheDesc"]');
	const scheCtype = $('select[name="scheCtype"]');
	
	const scheLoad = $('input[name="scheLoad"]');
	const scheDtype = $('select[name="scheDtype"]');
	const scheSdate = $('input[name="scheSdate"]');
	const scheStime = $('input[name="scheStime"]');
	const scheEdate = $('input[name="scheEdate"]');
	
	const scheEtime = $('input[name="scheEtime"]');
	const scheSeq = $('input[name="scheSeq"]');
	const schePer = $('input[name="schePer"]');
	const scheReady = $('input[name="scheReadyTm"]');
	const scheSametc = $('input[name="scheSametc"]');

	const schePerformancesdate = $('input[name="schePerformancesdate"]');
	const schePerformancestime = $('input[name="schePerformancestime"]');
	const schePerformanceedate = $('input[name="schePerformanceedate"]');
	const schePerformanceetime = $('input[name="schePerformanceetime"]');
	
	
	for(let i = 0; i < scheCate.length; i++) {
		if((isEmpty(scheCate.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) && rowChk.eq(i).attr('data-flag') != 'D' ) {
			isEmptySche = true;
			emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
			break;
		}else {
			const curInputData = {
				uid: parseInt(rowChk.eq(i).attr('data-uid')),
				category: scheCate.eq(i).val().trim(),
				tcnum: scheTcnum.eq(i).val().trim(),
				ctype: scheCtype.eq(i).val(),
				desc: scheDesc.eq(i).val(),
				dtype: scheDtype.eq(i).val(),
				edate: scheEdate.eq(i).val(),
				etime: scheEtime.eq(i).val(),
				loadrate: getLoadRate(scheLoad.eq(i).val(), false),
//				note: rowData.note,
				per: getFloatVal(schePer.eq(i).val()),
				readytime: scheReady.eq(i).val(),
				sametcnum: scheSametc.eq(i).val().trim(),
				sdate: scheSdate.eq(i).val(),
				stime: scheStime.eq(i).val(),
				codedetuid: scheTcnum.eq(i).attr('data-codeuid'),
				codedettcnum: scheTcnum.eq(i).attr('data-codetcnum') ?? "",
				codedetdesc: scheTcnum.eq(i).attr('data-codedesc') ?? "",
				seq: getFloatVal(scheSeq.eq(i).val()),
				flag: rowChk.eq(i).attr('data-flag'),
				performancesdate: schePerformancesdate.eq(i).val(),
				performancestime: schePerformancestime.eq(i).val(),
				performanceedate: schePerformanceedate.eq(i).val(),
				performanceetime: schePerformanceetime.eq(i).val()
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

// 다음 입력 할 Sequence 구하기 
function getNextSeq(){
	const scheSeqs = $('input[name="scheSeq"]');
	let maxSeq = 0.0;
	for(let i = 0; i < scheSeqs.length; i++){
		const curSeq = getFloatVal(scheSeqs.eq(i).val());
		if(maxSeq < curSeq){
			maxSeq = curSeq;
		}
	}
	return (maxSeq + 1.0);
}

// 입력 할 분단위 숫자를 Long 유형으로 변경
function convertMinToMill(min){
	if(isEmpty(min) || parseInt(min) < 0){
		return 0;
	} else{
		return parseInt(min) * 1000 * 60; 
	}
}

// ctype, dtype select의 option 구성
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

// 모든 Date, Time이 입력 되어 있는지 확인 - 모두 입력되어 있으면 -1, 미 입력 값이 있으면 해당 값 반환
function datetimeInputChk(){
	let result = '-1';
	
	let totSdate = $('input[name="scheSdate"]');
	let totStime = $('input[name="scheStime"]');
	let totEdate = $('input[name="scheEdate"]');
	let totEtime = $('input[name="scheEtime"]');
	let totSeq = $('input[name="scheSeq"]');
	
	for(let i = 0; i < totSdate.length; i++){
		if(totSdate.eq(i).val() === '' || totStime.eq(i).val() === '' || totEdate.eq(i).val() === '' || totEtime.eq(i).val() === ''){
			result = (result == '-1' ? '' : (result + ', ' )) + totSeq.eq(i).val();
		}
	}
	
	return result;
}

function saveNewVersionSchedule() {
	let isEmptySche = false;
	let emptyMsg = '';

	const pUid = scheUid;
	const desc = $('#desc').val();
	const sdate = $('#sdate').val();
	let edate = $('#edate').val();
	const schedtype = $('#schedtype').val();
	const shiptype = $('#shiptype').val();

	const scheEdate = $('input[name="scheEdate"]');

//	const detailList = [];
	const uidList = [];
	const cateList = [];
	const tcnumList = [];
	const descList = [];
	const loadList = [];

	const sdateList = [];
	const stimeList = [];
	const edateList = [];
	const etimeList = [];
	const seqList = [];

	const perList = [];
	const flagList = [];

	const ctypeList = [];
	const dtypeList = [];
	const readyTmList = [];
	const codedetuidList = [];
	const sametcnumList = [];

	const performancesdateList = []
	const performancestimeList = []
	const performanceedateList = []
	const performanceetimeList = []

	const codedettcnumList = [];
	const codedetdescList = [];

	// 스케줄이 있고 End Date 가 비어 있는 경우 보정
	if(isEmpty(edate)){
		edate = getEndDate(scheEdate);
	}

	if(isEmpty(sdate) || isEmpty(edate)) {
		isEmptySche = true;
		emptyMsg = $.i18n.t('errScheMain');
	} else {
		const curRowList = getCurElmData();

		for(curRow of curRowList) {
			uidList.push(curRow.uid);
			cateList.push(curRow.category);
			tcnumList.push(curRow.tcnum);
			descList.push(curRow.desc);
			ctypeList.push(curRow.ctype);

			loadList.push(curRow.loadrate);
			dtypeList.push(curRow.dtype);
			sdateList.push(curRow.sdate);
			stimeList.push(curRow.stime);
			edateList.push(curRow.edate);

			etimeList.push(curRow.etime);
			seqList.push(curRow.seq);
			perList.push(curRow.per);
			readyTmList.push(curRow.readytime);
			flagList.push(curRow.flag);

			codedetuidList.push(curRow.codedetuid);
			sametcnumList.push(curRow.sametcnum);

			performancesdateList.push(curRow.performancesdate)
			performancestimeList.push(curRow.performancestime)
			performanceedateList.push(curRow.performanceedate)
			performanceetimeList.push(curRow.performanceetime)

			codedettcnumList.push(curRow.codedettcnum ?? "")
			codedetdescList.push(curRow.codedetdesc ?? "")
		}
	}

	if(isEmptySche) {
		alertPop(emptyMsg);
	} else {
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/sche/updateScheNewRevNum.html',
			traditional: true,
			data: {
				'uid': pUid,
				'description': desc,
				shiptype,
				sdate,
				edate,
				schedtype,
				uidList,
				cateList,
				tcnumList,
				descList,
				loadList,
				sdateList,
				stimeList,
				edateList,
				etimeList,
				seqList,
				perList,
				flagList,
				ctypeList,
				dtypeList,
				readyTmList,
				codedetuidList,
				sametcnumList,
				performancesdateList,
				performancestimeList,
				performanceedateList,
				performanceetimeList,
				codedettcnumList,
				codedetdescList
			},
			success: function(data) {
				var json = JSON.parse(data);

				if(json.result) {
					alertPopBack($.i18n.t('compUpdate'), function() {
						location.href = contextPath + '/mng/sche/modifyScheduler.html?uid='+ pUid;
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

function showScheduleVersionHistoryModal() {
	getVersionHistoryList()
	$("#scheduler_version_history_modal").modal()
}

function getVersionHistoryList() {

	const revnum = $("#searchVersionHistoryPopRevnum").val()

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/sche/getScheduleVersionList.html',
		traditional: true,
		dataType: 'json',
		data: {
			'uid': scheUid,
			revnum
		},
		success: function(result, textStatus, xhr) {
			$("#versionHistorylist").empty()
			if (textStatus === 'success') {
				if (result.list.length !== 0) {
					result.list.forEach(obj => {
						$("#versionHistorylist").append(`
							<tr class="cursor-pointer">
								<td class=" text-center"><input type="radio" data-uid="${obj.uid}" name="versionHistoryUid" /></td>
								<td class=" text-center" onClick="setVersionHistoryUid('${obj.uid}')">${obj.revnum}</td>
								<td class=" text-center" onClick="setVersionHistoryUid('${obj.uid}')">${obj.insertdate}</td>
							</tr>
						`)
					})
				} else {
					$("#versionHistorylist").append(`<tr><td class="text-center" colspan="3" data-i18n="${$.i18n.t('share:noList')}"></td></tr>`)
				}
			} else {
				$("#versionHistorylist").append(`<tr><td class="text-center" colspan="3" data-i18n="${$.i18n.t('share:noList')}"></td></tr>`)
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

function setVersionHistoryUid(uid) {
	$(`[name='versionHistoryUid'][data-uid='${uid}']`).prop("checked", true)
}

function loadVersionHistory() {
	$("#scheduler_version_history_modal").modal('hide')
	const uid = $(`input[type='radio'][name='versionHistoryUid']:checked`).data('uid')

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheRowList.html",
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
			uid
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			$("#hullnum").val(result.hullnum)
			$("#shiptype").val(result.shiptype)
			$("#schedtype").val(result.schedtype)
			$("#sdate").val(result.sdate)
			$("#edate").val(result.edate)
			$("#desc").val(result.description)
			$("#revnum").val(result.revnum)

			var jsonResult = result.list;

			var text = '';
			scheRowList = [];
			scheRowList.push(result.list); // scheRowList 배열 담기

			// Schedule Detail 스크롤 및 기본 크기 설정
//			$("#dDataPanel").css('overflow-y', 'auto');
//			$("#dDataPanel").css('max-height', (screen.height * 0.7) + 'px');

			for(let i in jsonResult) {

				text +=`
					<tr id="scheModTr${i}">
						<td class="text-center"><input type="checkbox" data-uid="${jsonResult[i].uid}" data-flag="R" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
						<td class=""><input type="text" name="scheCate" class=" scheCate" value="${jsonResult[i].category}"></td>
						<td class="">
							<div class="d-flex align-items-center">
								<div>
									<input name="scheTcnum" type="text" class="inputSearch" data-codeuid="${jsonResult[i].codedetuid}" data-codetcnum="${jsonResult[i].codedettcnum}" data-codedesc="${jsonResult[i].codedetdesc}" value="${jsonResult[i].tcnum}">
								</div>
								<div class="flex-grow-1">
									<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
								</div>
							</div>
						</td>
						<td class=""><input type="text" name="scheDesc" class="" value="${jsonResult[i].desc}"></td>
						<td class=""><select name="scheCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'ctype')}</select></td>
						
						<td class=""><input type="text" name="scheLoad" class=" scheLoad" value="${getLoadRate(jsonResult[i].loadrate, true)}"></td>
						<td class=""><select name="scheDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'dtype')}</select></td>
						<td class=""><input type="date" name="scheSdate" class=" scheDate" value="${jsonResult[i].sdate}"></td>
						<td class=""><input type="text" name="scheStime" class=" scheTime" value="${jsonResult[i].stime}"></td>
						<td class=""><input type="date" name="scheEdate" class=" scheDate" value="${jsonResult[i].edate}"></td>
						
						<td class=""><input type="text" name="scheEtime" class=" scheTime" value="${jsonResult[i].etime}"></td>
						<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						
						<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i>
							<input type="hidden" name="schePerformancesdate" class=" schePerformancesdate" value="${jsonResult[i].performancesdate}" />
							<input type="hidden" name="schePerformancestime" class=" schePerformancestime" value="${jsonResult[i].performancestime}" />
							<input type="hidden" name="schePerformanceedate" class=" schePerformanceedate" value="${jsonResult[i].performanceedate}" />
							<input type="hidden" name="schePerformanceetime" class=" schePerformanceetime" value="${jsonResult[i].performanceetime}" />
						</td>
					</tr>`;

				scheTrIdx = i;
			}

			$("#getScheRowList").empty();

			if(text == '') {
				$("#getScheRowList").append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
			} else{
				$("#getScheRowList").append(text);

				// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
				setCompEvent();

				// SEQ 정렬
				refreshSeq(scheRowList[0]);

				// Ctype의 유형에 따라 input 배경 처리
				setConvBg(scheRowList[0]);
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

// 차트 팝업 닫기.
function closeViewChart() {
	if(childPopup != null && !childPopup.closed) {
		childPopup.close();
	}
}