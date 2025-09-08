var scheTrIdx = 0;			/// 스케줄 다음 인덱스 (추가 후 ++)
var domainListArr = [];
let scheRowList = [];
let scheTcSearchList = [];
let curTcSearchTr = null;
let scheHullSearchList = [];
let curSchedulerUid = '';
let _searchSchePopList = [];
let isLoadData = false;			// 불러오기 유무.

// 불러오기로 가져오는 UID
var copyUid = -1;

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
			namespaces: ['share', 'mngNewSche'],
			defaultNs: 'mngNewSche'
		},
		resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init(){
	initDesign();
	$('.modal-dialog').draggable({handle: '.modal-header'});

	// shiptype, schedtype, schedList 에 따라 스케줄 기본 내용 변경
	$('#shiptype, #schedtype, #schedList').on('change', function(){

		

	});
	
	// 선박번호 팝업 입력값 엔터키 이벤트
	$('#searchHullPopHullnum, #searchHullPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchHullPopSearch(1);
		}
	});
	// TC 입력 팝업 입력값 엔터키 이벤트
	$('#searchTcPopTcnum, #searchTcPopDesc').keypress(function(e) {
		if(e.keyCode === 13) {
			searchTcPopSearch(1);
		}
	});
	// 불러오기 팝업 입력값 엔터키 이벤트
	$('#searchSchePopHullNum').keypress(function(e) {
		if(e.keyCode === 13) {
			searchSchePopSearch(1);
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

// 복사할 uid 가 있다면 불러오기
function getScheRowList(copyUid){

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
			uid: copyUid,
			search2: 'chart'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';

			jsonResult.forEach(r => {
				r.sdate = ""
				r.stime = ""
				r.edate = ""
				r.etime = ""
			})

			if (result.shiptype)
				$("#shiptype").val(result.shiptype)

			// Schedule Detail 스크롤 및 기본 크기 설정
//			$("#dDataPanel").css('overflow-y', 'auto');
//			$("#dDataPanel").css('max-height', (screen.height * 0.7) + 'px');

			scheRowList = [];
			scheRowList.push(result.list); // scheRowList 배열 담기

			const mainSdate = document.querySelector("#sdate").value

			for(let i in jsonResult) {
				if (isEmpty(jsonResult[i].sdate) && i == 0 && mainSdate) {
					jsonResult[i].sdate = mainSdate // 날짜 셋팅 되어 있으면 첫행의 날짜 입력
					jsonResult[i].stime = '09:30'

					const sdatetime = new Date(`${mainSdate} 09:30:00`)

					sdatetime.setMinutes(sdatetime.getMinutes() + Number(jsonResult[i].per))
					const edate = `${sdatetime.getFullYear()}-${ sdatetime.getMonth() + 1 < 10 ? '0' + (sdatetime.getMonth() + 1) : sdatetime.getMonth() + 1}-${sdatetime.getDate() < 10 ? '0' + sdatetime.getDate() : sdatetime.getDate()}`
					const etime = `${sdatetime.getHours() < 10 ? '0'+sdatetime.getHours() : sdatetime.getHours()}:${ sdatetime.getMinutes() < 10 ? '0'+sdatetime.getMinutes():sdatetime.getMinutes() }`

					jsonResult[i].edate = edate
					jsonResult[i].etime = etime
				}
				text +=`
						<tr id="scheTr${i}">
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
							<td class=""><input type="date" name="scheSdate"class="" value="${jsonResult[i].sdate}"></td>
							<td class=""><input type="text" name="scheStime" class=" scheTime" value="${jsonResult[i].stime}"></td>
							<td class=""><input type="date" name="scheEdate" class="" value="${jsonResult[i].edate}"></td>
							<td class=""><input type="text" name="scheEtime" class=" scheTime" value="${jsonResult[i].etime}"></td>
							
							<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
							<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
							<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
							<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
							<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i></td>
						</tr>`;

				scheTrIdx = i;
			}

			$('#scheduleList').empty();
			isLoadData = false;

			if(!isEmpty(text)) {
				$("#scheduleList").append(text);
				// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
				setCompEvent();
				scheTrIdx++;
				isLoadData = true;
			}

			$('#search_schedule_modal').modal('hide');
			
			for(let i = 0; i < _searchSchePopList.length; i++) {
				if(_searchSchePopList[i].uid == copyUid) {
					$('select[id=schedtype]').val(_searchSchePopList[i].schedtype).prop('selected', true);
					getSchedCodeList(false); 
					break;
				}
			}			
		} else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});

}

// 스케줄 추가
function addSchedule() {
	if(isEmpty($('#shiptype option:selected').val()) || isEmpty($('#schedtype option:selected').val())){
		alertPop($.i18n.t('errScheMain'));
		return;
	}

	let mainSdate = document.querySelector("#sdate").value
	let stime = ''

	if (0 === $('#scheduleList tr').length && mainSdate) {
		stime = '09:30'
	}

	let scheSeqList = null;
	let scheEndList = null;
	let maxEnd = null;
	let seq = 0;
	const text = `
	<tr id="scheTr${scheTrIdx}">
		<td class="">
			<input type="text" name="scheCate" class=" scheCate" value="">
		</td>
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
		<td class=""><input type="date" name="scheSdate" class="" value="${ mainSdate }"></td>
		<td class=""><input type="text" name="scheStime" class=" scheTime" value="${ stime }"></td>
		<td class=""><input type="date" name="scheEdate" class="" value=""></td>
		<td class=""><input type="text" name="scheEtime" class=" scheTime" value=""></td>
		
		<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
		<td class=""><input type="text" name="schePer" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
		<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
		<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value=""></td>
		<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i></td>
	</tr>`;


	$('#scheduleList').append(text);

	// Sequence 자동입력
	scheSeqList = $('input[name="scheSeq"]');
	for(let i = 0; i < scheSeqList.length; i++){
		const curSeq = parseInt(scheSeqList.eq(i).val());
		seq = (curSeq > seq) ? curSeq : seq;
	}
	$(`#scheTr${scheTrIdx} input[name="scheSeq"]`).val(++seq);

	// Date, Time 관련 컴포넌트 및 이벤트 추가
	setTimePicker(`#scheTr${scheTrIdx} input[name$="time"]`);

	// 이전 End Date, Time 기준으로 Start Date, Time 자동 입력
	scheEndList = $(`#scheTr${scheTrIdx - 1} input[name="scheEdate"]`);
	for(let i = 0; i < scheEndList.length; i++){
		const eDate = scheEndList.eq(i).val();
		const eTime = scheEndList.eq(i).parent().parent().find('input[name="scheEtime"]').val();

		if(!isEmpty(eDate) && !isEmpty(eTime)){
			const eDateTime = new Date(`${eDate} ${eTime}`);

			if(maxEnd == null || ( maxEnd != null && maxEnd.getTime() < eDateTime.getTime())){
				maxEnd = eDateTime;
			}
		}
	}

	if(maxEnd != null){
		$(`#scheTr${scheTrIdx} input[name="scheSdate"]`).val(convertDateToStr(maxEnd, 'D'));
		$(`#scheTr${scheTrIdx} input[name="scheStime"]`).val(convertDateToStr(maxEnd, 'T'));
	}

	// ADD 한 행으로 Focus 이동
	$('#scheTr' + scheTrIdx).children().find('input[name="scheCate"]').focus();

	// TR Index 증가
	scheTrIdx++;

	setCompEvent();
}

// 스케줄 삭제
function delSchedule(elm) {
	$(elm).parent().remove();

}

// 기간 값 자동 설정
function setPeriod(elm, sDateTime, eDateTime){
	const elmName = elm.attr('name');

	if(!isEmpty(sDateTime) && !isEmpty(eDateTime)){
		const per = eDateTime.getTime() - sDateTime.getTime();
		elm.parent().parent().children().find('[name="schePer"]').val(per / 1000 / 60);
	}
}

// End Date, Time 자동 설정
function setEndTm(elm, sDateTime, per){
	if(!isEmpty(sDateTime) && !isEmpty(per)){
		const edate = elm.closest('tr').children().find('[name="scheEdate"]');
		const etime = elm.closest('tr').children().find('[name="scheEtime"]');

		const eDateTime = new Date(sDateTime.getTime() + (per * 1000 * 60));

		edate.val(convertDateToStr(eDateTime, 'D'));
		etime.val(convertDateToStr(eDateTime, 'T'));
	}
}

//컴포넌트 및 이벤트 추가
function setCompEvent(){
	// 헤더의 sdate, edate 컨포넌트 Change 이벤트 설정
	$('#sdate, #edate').off().on('change', function(e){
		const elm = $(this);

		$('input[name="scheSdate"], input[name="scheEdate"]').prop('min', $('#sdate').val());

		if ($('#scheduleList tr').length != 0) {
			const sdate = $('#sdate').val()
			const stime = '09:30'
			var tr0 = $('#scheduleList tr')[0]
			$(tr0).find("input[name='scheSdate']").val(sdate)
			$(tr0).find("input[name='scheStime']").val(stime)

			const per = $(tr0).find("input[name='schePer']").val()

			if (!isEmpty(per)) {
				const sdatetime = new Date(`${sdate} ${stime}:00`)
				sdatetime.setMinutes(sdatetime.getMinutes() + Number(per))

				const edate = `${sdatetime.getFullYear()}=${sdatetime.getMonth() + 1 < 10 ? '0' + sdatetime.getMonth() + 1 : sdatetime.getMonth() + 1}-${sdatetime.getDate() < 10 ? '0' + sdatetime.getDate() : sdatetime.getDate() }`
				const etime = `${sdatetime.getHours() < 10 ? '0' + sdatetime.getHours() : sdatetime.getHours()}:${sdatetime.getMinutes() < 10 ? '0'+sdatetime.getMinutes() : sdatetime.getMinutes()}`

				$(tr0).find(`input[name='edate']`).val(edate)
				$(tr0).find(`input[name='etime']`).val(etime)
			}
		}

//		$('input[name="scheSdate"], input[name="scheEdate"]').prop('max', $('#edate').val());
	});

	// input Date 컴포넌트 Change이벤트 설정
	setDateChgEvent('input[name="scheSdate"], input[name="scheEdate"]');

	// Time Picker 설정
	setTimePicker('input[name$="time"]');

	// 소요시간 입력 시 완료 날짜 자동 입력 설정
	setPerInputEvent('input[name="schePer"]');

	// 순서 변경 컴포넌트 이벤트 설정
	setSeqEvent('input[name="scheSeq"]');

	// 동일TC 변경 컴포넌트 이벤트 설정
	setSameTcEvent('input[name="scheSametc"]');

	// Table 행 Drag & Drop 설정
	$('#scheduleList').sortable({
		axis: "y",
		start: function(event, ui){
		},
		update: function(event, ui){
			console.log('scheduleList.sortable.update START');

			const tcList = $(this).children().find('input[name="scheTcnum"]');

			for(let i = 0; i < tcList.length; i++){
				if(isEmpty(tcList.eq(i).val())){
					alertPop($.i18n.t('required'));
					$(this).sortable('cancel');
				}
			}

			console.log('scheduleList.sortable.update END');
		},
		stop: function(event, ui){
			console.log('scheduleList.sortable.stop START');
			console.log(event);
			console.log(ui);

			// 전체 Seq 재설정
			refreshSeq(scheRowList);
			console.log('scheduleList.sortable.stop END');
		}
	});
}

//Input Date Change 이벤트 설정
function setDateChgEvent(selStr){
	$('#scheduleList').on('change', selStr, function(e){
		const elm = $(this);
		const curDate = elm.val();
		const othDate = elm.closest('tr').children().find('[name$="date"]').not(this).val();
		const stime = elm.closest('tr').children().find('[name="scheStime"]').val();
		const etime = elm.closest('tr').children().find('[name="scheEtime"]').val();
		const per = elm.closest('tr').children().find('[name="schePer"]').val();

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
					} else{
						setPeriod(elm, new Date(`${othDate} ${stime}`), new Date(`${curDate} ${etime}`));
					}
				}
			} else if(elm.attr('name') == 'scheSdate' && !isEmpty(curDate) && !isEmpty(stime) && !isEmpty(per) && isEmpty(othDate) && isEmpty(etime)){
				setEndTm(elm, new Date(`${curDate} ${stime}`), per);
			}
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
			const sDate = elm.closest('tr').children().find('[name="scheSdate"]').val();
			const eDate = elm.closest('tr').children().find('[name="scheEdate"]').val();
			const othTime = elm.closest('tr').children().find('[name*="time"]').not(this).val();
			const curTime = elm.val();
			const per = elm.closest('tr').children().find('[name="schePer"]').val();

			if(sDate != null  && !(sDate === '') && eDate != null  && !(eDate === '') && othTime != null  && !(othTime === '') && curTime != null  && !(curTime === '')){
				if((elm.attr('name') == 'scheStime' && new Date(sDate + ' ' + curTime).getTime() > new Date(eDate + ' ' + othTime).getTime())
					|| (elm.attr('name') == 'scheEtime' && new Date(sDate + ' ' + othTime).getTime() > new Date(eDate + ' ' + curTime).getTime())){
					elm.val(elm.prop('defaultValue'));
					alertPop($.i18n.t('errTime'));
				} else{
					if(elm.attr('name') == 'scheStime'){
						setPeriod(elm, new Date(`${sDate} ${curTime}`), new Date(`${eDate} ${othTime}`));

					} else{
						setPeriod(elm, new Date(`${sDate} ${othTime}`), new Date(`${eDate} ${curTime}`));
					}
				}
			} else if(elm.attr('name') == 'scheStime' && !isEmpty(curTime) && !isEmpty(sDate) && !isEmpty(per) && isEmpty(eDate) && isEmpty(othTime)){
				setEndTm(elm, new Date(`${sDate} ${curTime}`), per);
			}
		}
	});
}

// 시작일시 입력 후 시작시간 입력 시 완료 일시 자동 입력
function setPerInputEvent(selStr){
	$('#scheduleList').on('input', selStr, function(e){
		const elm = $(this);
		const sDate = elm.parent().parent().children().find('[name="scheSdate"]').val();
		const sTime = elm.parent().parent().children().find('[name="scheStime"]').val();

		if(!isEmpty(sDate) && !isEmpty(sTime)){
			const sDateTime = new Date(`${sDate} ${sTime}`);
			const eDateTime = new Date(sDateTime.getTime() + ($(this).val() * 1000 * 60));

			elm.parent().parent().children().find('[name="scheEdate"]').val(convertDateToStr(eDateTime, 'D'));
			elm.parent().parent().children().find('[name="scheEtime"]').val(convertDateToStr(eDateTime, 'T'));
		}
	});
}

//Sequence 컴포넌트 이벤트 추가
function setSeqEvent(selStr){
	$('#scheduleList').on('change', selStr, function(e){
		const elm = $(this);

		const scheCurRowList = getCurDataAll(elm, null);

		const defVal = getFloatVal(elm.prop('defaultValue'));
		const curVal = getFloatVal(elm.val());

		const isAscMov = getFloatVal(curVal) > getFloatVal(defVal);

		const curRowData = getSeqChgCurRowData(scheCurRowList, defVal, elm);
		const curClacTime = getCurRowCalcTime(curRowData);
		const maxSeq = getMaxSeq(scheCurRowList);
		const scheMoveRowList = [];

		for(let i = 0; i < scheCurRowList.length; i++){
			let iSeq = getFloatVal(scheCurRowList[i].seq);
			// Date 값이 있는 경우
			if(!isEmpty(curRowData.sdate) && !isEmpty(curRowData.edate)){
				// 상위 에서 하위로 내릴 때
				if(isAscMov){
					if(defVal > iSeq || curVal < iSeq){
						scheMoveRowList.push(scheCurRowList[i]);
					} else{
						let sDateTime = null;
						let eDateTime = null;
						let rowData = null;
						if(defVal <= iSeq && curVal != iSeq && (i+1) < scheCurRowList.length){
							rowData = scheCurRowList[i+1];
							sDateTime = new Date(new Date(`${scheCurRowList[i+1].sdate} ${scheCurRowList[i+1].stime}`).getTime() - curClacTime);
							eDateTime = new Date(new Date(`${scheCurRowList[i+1].edate} ${scheCurRowList[i+1].etime}`).getTime() - curClacTime);

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
						scheMoveRowList.push(scheCurRowList[i]);
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
							rowData = scheCurRowList[i-1];
							sDateTime = new Date(new Date(`${scheCurRowList[i-1].sdate} ${scheCurRowList[i-1].stime}`).getTime() + curClacTime);
							eDateTime = new Date(new Date(`${scheCurRowList[i-1].edate} ${scheCurRowList[i-1].etime}`).getTime() + curClacTime);
						} else if(curVal == 1){
							rowData = curRowData;
							sDateTime = new Date(new Date(`${scheCurRowList[0].sdate} ${scheCurRowList[0].stime}`).getTime());
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
						scheMoveRowList.push(scheCurRowList[i]);
					} else{
						if(defVal <= iSeq && curVal != iSeq && (i+1) < scheCurRowList.length){
							scheMoveRowList.push(getCurSeqInputData(scheCurRowList[i+1], null, null, iSeq));
						} else if(curVal == iSeq){
							scheMoveRowList.push(getCurSeqInputData(curRowData, null, null, iSeq));
						}
					}
				} else{
					if(defVal < iSeq || curVal > iSeq){
						scheMoveRowList.push(scheCurRowList[i]);
					} else{
						if(curVal == iSeq){
							scheMoveRowList.push(getCurSeqInputData(curRowData, null, null, iSeq));
						} else if(defVal >= iSeq && curVal != iSeq && (i-1) > -1){
							scheMoveRowList.push(getCurSeqInputData(scheCurRowList[i-1], null, null, iSeq));
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

//Sequence 전체 재 설정
function refreshSeq(scheChgRowList){
	const scheSeqList = $('input[name="scheSeq"]');
	let seq = 0;
	for(let i = 0; i < scheSeqList.length; i++){
		const scheSeq = scheSeqList.eq(i);
		const scheChk = scheSeq.closest('tr').children().find('[name="scheRowChk"]').eq(0);
		if(getFloatVal(scheSeq.val()) != (++seq)){
			scheSeq.val(seq);
		}
	}
}

//Row Data를 다시 그리는 함수
function refreshScheRowList(scheMoveRowList){
	scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));
	let text = '';
	for(let i in scheMoveRowList) {

		text +=`
			<tr id="scheTr${i}">
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
				<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i></td>
			</tr>`;
	}

	$("#scheduleList").empty();


	if(!isEmpty(text)) {
		$("#scheduleList").append(text);

		// Time 관련 컴포넌트 추가
		setTimePicker('input[name$="time"]');

	}
}

//동일TC 컴포넌트 이벤트 추가
function setSameTcEvent(selStr){
	$('#scheduleList').on('change', selStr, function(e){
		const elm = $(this);
		const curTr = elm.closest('tr');
		const curVal = !isEmpty(elm.val()) ? elm.val().trim() : elm.val();

		const curTcnum = curTr.find('input[name="scheTcnum"]').val();
		const scheTcnum = $('input[name="scheTcnum"]');

		let tcIdx = -1;
		const curIdx = parseInt(curTr.attr('id').replace('scheTr',''));

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
							rowData = getCurSameTcInputData(scheCurRowList[curIdx], curVal, (i+1), scheCurRowList[i-1]);
						} else if(i <= tcIdx || curIdx < i){
							rowData = scheCurRowList[i];
						} else{
							rowData = getCurSameTcInputData(scheCurRowList[i-1], scheCurRowList[i-1].sametcnum, (i+1), null);
						}
					} else{
						if(tcIdx == i){
							rowData = getCurSameTcInputData(scheCurRowList[curIdx], curVal, (i+1), scheCurRowList[i]);
						} else if(i > tcIdx || curIdx > i){
							rowData = scheCurRowList[i];
						} else{
							rowData = getCurSameTcInputData(scheCurRowList[i+1], scheCurRowList[i+1].sametcnum, (i+1), null);
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


//TCNUM 검색 버튼 클릭 이벤트
function setTcnumBtn(idx){
	// 조회 값 초기화
	$('#searchTcPopTcnum').val('');
	$('#searchTcPopDesc').val('');

	$('#search_tcnum_modal').modal();
	curTcSearchTr = $('#scheTr'+idx);
	searchTcPopSearch(1);
}

//TCNUM 조회 팝업 검색 버튼 이벤트
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
			shiptype: $('#shiptype option:selected').val(),
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

			$('#searchTcPopList').empty();

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

//Tc Num 조회 팝업 페이징 처리
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
		const cate = curTcSearchTr.find('input[name="scheCate"]');
		const tcnum = curTcSearchTr.find('input[name="scheTcnum"]');
		const desc = curTcSearchTr.find('input[name="scheDesc"]');
		const ctype = curTcSearchTr.find('select[name="scheCtype"]');
		const load = curTcSearchTr.find('input[name="scheLoad"]');

		const dtype = curTcSearchTr.find('select[name="scheDtype"]');
		const per = curTcSearchTr.find('input[name="schePer"]');
		const readyTm = curTcSearchTr.find('input[name="scheReadyTm"]');
		const sameTc = curTcSearchTr.find('input[name="scheSametc"]');

		cate.val(scheTcSearchList[idx].lv1code);
		tcnum.val(scheTcSearchList[idx].displaycode);
		tcnum.attr('data-codeuid', scheTcSearchList[idx].uid);
		tcnum.attr('data-codetcnum', scheTcSearchList[idx].displaycode);
		tcnum.attr('data-codedesc', scheTcSearchList[idx].description)
		desc.val(scheTcSearchList[idx].description);
		ctype.val(scheTcSearchList[idx].ctype);
		load.val(getLoadRate(scheTcSearchList[idx].loadrate, true));

		dtype.val(scheTcSearchList[idx].dtype);
		per.val(getFloatVal(scheTcSearchList[idx].per));
		readyTm.val(getFloatVal(scheTcSearchList[idx].readytime));
		sameTc.val(scheTcSearchList[idx].sametcnum);
	}

	$('#search_tcnum_modal').modal('hide');
}

//시작일시 기준 전체 시각 설정
function setAllDateTime(){

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
		if(scheCtype.eq(i).val() != 'CONV' || scheCtype.eq(i).val() != 'CONVB'){
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
						if(scheCtype.eq(j).val() != 'CONV' || scheCtype.eq(j).val() != 'CONVB'){
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
//						alertPop($.i18n.t('required'));
//						return;
						let revIdx = -1;
						
						for(let j = i - 1; j >= 0; j--){
							if(scheCtype.eq(j).val() != 'CONV' || scheCtype.eq(j).val() != 'CONVB'){
								revIdx = j;
								break;
							}
						}
	
						if(revIdx > -1){
							startDate = new Date(new Date(`${scheEdate.eq(revIdx).val()} ${scheEtime.eq(revIdx).val()}`).getTime() + readyMil);
							endDate = new Date(startDate.getTime() + perMil);
						}
					}
				}

				if(!isEmpty(startDate) && !isEmpty(endDate)){
					scheSdate.eq(i).val(convertDateToStr(startDate, 'D'));
					scheStime.eq(i).val(convertDateToStr(startDate, 'T'));

					scheEdate.eq(i).val(convertDateToStr(endDate, 'D'));
					scheEtime.eq(i).val(convertDateToStr(endDate, 'T'));
					isChg = true;
				}
			}
		}
	}

	$('#edate').val(getEndDate(scheEdate));

}

//동일한 TC NUM의 Index 반환
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

//현재 이동 하려는 Seq의 시간 계산 값 반환
function getCurRowCalcTime(curRowData){
	let rtnTime = 0;

	if(!isEmpty(curRowData) && (!isEmpty(curRowData.per) || !isEmpty(curRowData.readytime))){
		rtnTime = (getFloatVal(curRowData.per) + getFloatVal(curRowData.readytime)) * 1000 * 60;
	}

	return rtnTime;
}

// 현재 이동 하려는 Seq의 행 데이터 반환
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
			seq: seq
		};
	}

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
		seq: iSeq
	};

	return curInputData;
}

//Same Tc 입력용 데이터 생성
function getCurSameTcInputData(rowData, sameTc, iSeq, prevData){
	let extPre = !isEmpty(prevData) ? true : false;
	const curInputData = {
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
		seq: iSeq
	};

	return curInputData;
}

// 현재 입력되어 있는 컴포넌트의 전체 값 반환
function getCurDataAll(seqElm, tcElm){
	let isEmptySche = false;
	let emptyMsg = '';
	const scheCurRowList = [];

	const scheCate = $('input[name="scheCate"]');
	const scheTcnum = $('input[name="scheTcnum"]'); // data-codeuid
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

	for(let i = 0; i < scheCate.length; i++) {
		if(isEmpty(scheCate.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())) {
			isEmptySche = true;
			emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
			break;
		}else {
			const curRow = {
				category: scheCate.eq(i).val(),
				tcnum: scheTcnum.eq(i).val(),
				ctype: scheCtype.eq(i).val(),
				desc: scheDesc.eq(i).val(),
				dtype: scheDtype.eq(i).val(),
				edate: scheEdate.eq(i).val(),
				etime: scheEtime.eq(i).val(),
				loadrate: getLoadRate(scheLoad.eq(i).val(), false),
				per: getFloatVal(schePer.eq(i).val()),
				readytime: scheReady.eq(i).val(),
				sdate: scheSdate.eq(i).val(),
				stime: scheStime.eq(i).val(),
				sametcnum: (!isEmpty(tcElm) && tcElm.get(0) == scheSametc.eq(i).get(0)) ? tcElm.prop('defaultValue') : scheSametc.eq(i).val(),
				codedetuid: scheTcnum.eq(i).attr('data-codeuid'),
				codedettcnum: scheTcnum.eq(i).attr('data-codetcnum') ?? "",
				codedetdesc: scheTcnum.eq(i).attr('data-codedesc') ?? "",
				seq: (!isEmpty(seqElm) && seqElm.get(0) == scheSeq.eq(i).get(0)) ? getFloatVal(seqElm.prop('defaultValue')) : getFloatVal(scheSeq.eq(i).val())
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

//End Date 중 최대값
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

//Conv 유형 날짜 일괄 입력 버튼 설정
function setConvDateBtn(){
	// 날짜 적용 값 초기화
	$('#setConvDatePopSdate').val('');
	$('#setConvDatePopStime').val('');
	$('#setConvDatePopEdate').val('');
	$('#setConvDatePopEtime').val('');
	
	$('#setConvDatePopSdate').prop('min', $('#sdate').val());
	$('#setConvDatePopEdate').prop('min', $('#sdate').val());
	
	$('#set_conv_modal').modal();
	setConvDataList();
}

// Conv 유형 데이터 목록 설정
function setConvDataList(){
	const allDataList = getCurDataAll();
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
	const totTcList = $('input[name=scheTcnum]');
	
	// 체크된 스케줄이 있는지 확인
	if(chkList.length == 0){
		// 알림 팝업 가장 위로 올린 후에 오류 메시지 발생 
		$('#alertPop').css('z-index', 9999);
		alertPop($.i18n.t('setConvDatePop.selectMsg'));
		return;
	}
	
	// 시작일시, 완료일시 입력 값이 모두 있는 지 확인
	if(sdate !== '' && stime !== '' && edate !== '' && etime !== ''){
		
		for(let i = 0; i < totTcList.length; i++){
			let totTc = totTcList.eq(i).val();
			
			for(let j = 0; j < chkList.length; j++){
				let tc = chkList.eq(j).closest('tr').find('td[name=convTcnum]').text();;
				
				if(totTc == tc){
					const chgTr = totTcList.eq(i).closest('tr');
					chgTr.find('input[name="scheSdate"]').val(sdate);
					chgTr.find('input[name="scheStime"]').val(stime);
					chgTr.find('input[name="scheEdate"]').val(edate);
					chgTr.find('input[name="scheEtime"]').val(etime);
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
 
// 스케줄 생성
function insertSchedule() {
	let isEmptySche = false;
	let emptyMsg = '';

	const hullnum = $('#hullnum').val();
	const shiptype = $('#shiptype option:selected').val();
	const sdate = $('#sdate').val();
	const edate = $('#edate').val();
	const desc = $('#desc').val();
	const schedtype = $('#schedtype option:selected').val();
	const schedCodeList = $('#schedCodeList option:selected').val();

	const dept = $('#dept').val();

	const scheCate = $('input[name="scheCate"]');
	const scheTcnum = $('input[name="scheTcnum"]'); // data-codeuid
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


	// 상세 데이터 입력 용
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

	const ctypeList = [];
	const dtypeList = [];
	const readyTmList = [];
	const codedetuidList = [];
	const sametcnumList = [];

	const codedettcnumList = [];
	const codedetdescList = [];


	if(isEmpty(hullnum) || isEmpty(shiptype) || isEmpty(sdate) || isEmpty(schedtype)) {
		isEmptySche = true;
		emptyMsg = $.i18n.t('errScheMain');
	}else if(isEmpty(schedCodeList) && !isLoadData) {
		isEmptySche = true;
		emptyMsg = $.i18n.t('errScheMain2');
	}else {
		for(var i = 0; i < scheCate.length; i++) {
			if(isEmpty(scheCate.eq(i).val()) || isEmpty(scheTcnum.eq(i).val()) || isEmpty(scheDesc.eq(i).val())){
				isEmptySche = true;
				emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(scheSeq.eq(i).val()));
				break;
			}else {
				cateList.push(scheCate.eq(i).val().trim());
				tcnumList.push(scheTcnum.eq(i).val().trim());
				descList.push(scheDesc.eq(i).val());
				loadList.push(getLoadRate(scheLoad.eq(i).val(), false));
				sdateList.push(scheSdate.eq(i).val());

				stimeList.push(scheStime.eq(i).val());
				edateList.push(scheEdate.eq(i).val());
				etimeList.push(scheEtime.eq(i).val());
				seqList.push(getFloatVal(scheSeq.eq(i).val()));
				perList.push(getFloatVal(schePer.eq(i).val()));

				ctypeList.push(scheCtype.eq(i).val());
				dtypeList.push(scheDtype.eq(i).val());
				readyTmList.push(scheReady.eq(i).val());
				codedetuidList.push(scheTcnum.eq(i).attr('data-codeuid'));
				codedettcnumList.push(scheTcnum.eq(i).attr('data-codetcnum'));
				codedetdescList.push(scheTcnum.eq(i).attr('data-codedesc'));
				sametcnumList.push(scheSametc.eq(i).val().trim());
			}
		}
	}

	if(isEmptySche) {
		alertPop(emptyMsg);
	} else{
		jQuery.ajax({
			type: 'POST',
			url: contextPath + '/mng/sche/insertSche.html',
			traditional: true,
			data: {
				schedtype,
				hullnum,
				shiptype,
				'description': desc,
				sdate,
				edate,
				'department': dept,
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
				ctypeList,
				dtypeList,
				readyTmList,
				codedetuidList,
				codedettcnumList,
				codedetdescList,
				sametcnumList
			},
			success: function(data) {
				var json = JSON.parse(data);

				if(json.result) {
					curSchedulerUid = json.result; 
					scheTrIdx = 0;
					alertPopBack($.i18n.t('compNew') + '\n' + '호선별 필요 정보를 입력해 주세요.', function () {
						getVesselReqInfoDetList();
						$('#vsslReqInfoModalMsg').text('');
						$('#vssl_req_info_modal').modal('show');
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

//입력 할 분단위 숫자를 Long 유형으로 변경
function convertMinToMill(min){
	if(isEmpty(min) || parseInt(min) < 0){
		return 0;
	} else{
		return parseInt(min) * 1000 * 60;
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
		} else if ("reqinfotitle" === type) {
			for (reqinfotitle of reqinfotitleList) {
				selbox += `<option value="${reqinfotitle.value}" ${curSche && curSche.reqinfotitle.toUpperCase() == reqinfotitle.value ? 'Selected' : ''}>${reqinfotitle.desc}</option> `;
			}
			return selbox
		}
	}
	return selbox;
}

const getVesselReqInfoDetList = () => {

	// copyUid 값이 있는 경우 이전 불러온 내용 조회 
	let urlReqInfo = copyUid > 0 ? "/mng/stnd/getCurReqInfoRowList.html" : "/mng/stnd/getStndReqInfoRowList.html";
	
	$.ajax({
		type: "GET",
		url: contextPath + urlReqInfo,
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
			copyUid
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			const jsonResult = result.list;
			$("#getVesselReqInfoDetList").empty();

			jsonResult.forEach((row) => {
				addVesselReqInfoDet(row)
			})
			// Title에 따라 읽기전용 처리 추가 
			setVesselReqinfoTitleEvent();
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

const addVesselReqInfoDet = (row) => {

	if (row && 0 !== row.uid) {
		const text = `
            <tr data-uid="${row.uid}" data-flag="C">
                <td class="" style="width: 68px;"><input type="text" name="vsslRIDetSeq" class=" vsslRIDetSeq" value="${getFloatVal(row.seq)}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="vsslRIDetReqInfoTitle" class=" vsslRIDetReqInfoTitle"><option value=""></option>${getTypeSelOption(row, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="vsslRIDetItem" class=" vsslRIDetItem" value="${row.item}" maxlength="20"></td>
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetUnit" class=" vsslRIDetUnit" value="${row.unit}" maxlength="10"></td>
                <td class=""><input type="text" name="vsslRIDetName" class=" vsslRIDetName" value="${isEmpty(row.name) ? "" : row.name}" maxlength="100"></td>
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetRpm" class=" vsslRIDetRpm" value="${isEmpty(row.rpm) ? "" : row.rpm}" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><input type="text" name="vsslRIDetLoadrate" class=" vsslRIDetLoadrate" value="${isEmpty(row.loadrate) ? "" : row.loadrate}" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');" ${row.reqinfotitle == 'DRFTBT' ? "disabled" : ""}></td>
                <td class=" text-center pointer" onClick="delVesselReqInfoDet(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `
		$("#getVesselReqInfoDetList").append(text)
	} else {
		const len = $("#getVesselReqInfoDetList tr[data-uid]").length

		if (0 === len) $("#getVesselReqInfoDetList").empty()

		const text = `
            <tr data-uid="0" data-flag="C">
                <td class="" style="width: 68px;"><input type="text" name="vsslRIDetSeq" class=" vsslRIDetSeq" value="${len + 1}" maxlength="5" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><select name="vsslRIDetReqInfoTitle" class=" vsslRIDetReqInfoTitle"><option value=""></option>${getTypeSelOption(null, 'reqinfotitle')}</select></td>
                <td class=""><input type="text" name="vsslRIDetItem" class=" vsslRIDetItem" value="" maxlength="20"></td>
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetUnit" class=" vsslRIDetUnit" value="" maxlength="10"></td>
                <td class=""><input type="text" name="vsslRIDetName" class=" vsslRIDetName" value="" maxlength="100"></td>
                <td class="" style="width: 97px;"><input type="text" name="vsslRIDetRpm" class=" vsslRIDetRpm" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=""><input type="text" name="vsslRIDetLoadrate" class=" vsslRIDetLoadrate" value="" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1').replace(/(\\--*)\\-/g, '$1');"></td>
                <td class=" text-center pointer" onClick="delVesselReqInfoDet(this)"><i class="fa-solid fa-trash-can"></i></td>
            </tr>
        `

		$("#getVesselReqInfoDetList").append(text)
	}
}

const delVesselReqInfoDet = (elm) => {
	const delTr = $(elm).parent();
	
	delTr.remove();
	
	refreshReqInfoDetSeq();
}

const refreshReqInfoDetSeq = () => {
	$('#getVesselReqInfoDetList tr[data-flag!="D"]').each((i, e) => {
		$(e).find("input[name='vsslRIDetSeq']").val(i + 1)
	})
}

// Title이 Draft : Ballast 인 경우 그래프 읽기전용 처리
const setVesselReqinfoTitleEvent = () => {
	$('#getVesselReqInfoDetList').on('change', 'select[name="vsslRIDetReqInfoTitle"]', function(e){
		const elm = $(this);
		
		elm.closest('tr').children().find('input[name="vsslRIDetLoadrate"]').val('');
		elm.closest('tr').children().find('input[name="vsslRIDetLoadrate"]').attr('disabled', elm.val() == 'DRFTBT' ? true : false)
	});
}

const saveVesselReqInfo = () => {
	$('#vsslReqInfoModalMsg').text('');
	
	const obj = {}
	let isEmpty = false
	let emptyMsg = ""
	let isExistList = false;

	const hullNum = $("#hullnum").val()
	const desc = $("#desc").val()
	const shiptype = $('#shiptype option:selected').val()
	const status = "INACT"

	$(`#getVesselReqInfoDetList tr[data-uid]`).each((i, e) => {
		const flag = $(e).attr("data-flag")
		const uid = $(e).attr("data-uid")
		const seq = $(e).find(`input[name="vsslRIDetSeq"]`).val()
		const reqinfotitle = $(e).find(`select[name="vsslRIDetReqInfoTitle"]`).val()
		const item = $(e).find(`input[name="vsslRIDetItem"]`).val()
		const unit = $(e).find(`input[name="vsslRIDetUnit"]`).val()
		const name = $(e).find(`input[name="vsslRIDetName"]`).val()
		const rpm = $(e).find(`input[name="vsslRIDetRpm"]`).val()
		const loadrate = $(e).find(`input[name="vsslRIDetLoadrate"]`).val()

		if ("D" === flag && "0" === uid) {

		} else {
			if("D" !== flag && (!reqinfotitle || !item || !seq)) {
				emptyMsg = $.i18n.t('errScheRow').replace('{0}',getFloatVal(i + 1));
				isEmpty = true
				return false
			}

			obj[`params[${i}].flag`] = flag
			obj[`params[${i}].uid`] = uid
			obj[`params[${i}].seq`] = seq
			obj[`params[${i}].reqinfotitle`] = reqinfotitle
			obj[`params[${i}].item`] = item
			obj[`params[${i}].unit`] = unit
			obj[`params[${i}].name`] = name
			obj[`params[${i}].rpm`] = rpm
			obj[`params[${i}].loadrate`] = loadrate
			
			isExistList = true;
		}
	})

	if (isEmpty == false) {
		if(isExistList) {
			obj['uid'] = 0
			obj['hullNum'] = hullNum
			obj['shiptype'] = shiptype
			obj['description'] = desc
			obj['status'] = status
			obj['schedinfouid'] = curSchedulerUid
	
			$.ajax({
				type: "POST",
				url: contextPath + "/mng/vssl/insertVesselReqInfo.html",
				traditional: true,
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8;",
				beforeSend: function() {
					$('#vssl_req_info_modal').modal('hide').on('hidden.bs.modal', function () {
						$('#vssl_req_info_modal').remove();
					});
					$('#loading').css("display","block");
				},
				complete: function() {
					$('#loading').css('display',"none");
				},
				data: obj
			}).done((result, textStatus, xhr) => {
				if(textStatus == "success") {
					$('#hullnum').val('');
					$("#shiptype option:eq(0)").prop("selected", true);
					$('#sdate').val('');
					$('#edate').val('');
					$('#desc').val('');
					$('#dept').val('');
					$('#scheduleList').empty();
					alertPop($.i18n.t('compNew'));
					curSchedulerUid = '';
				}else {
					alertPop($.i18n.t('share:tryAgain'));
				}
			}).fail((data, textStatus, errorThrown) => {
				// console.log(data, textStatus, errorThrown)
			});
		}else {
//			alertPop($.i18n.t('vsslRepInfoPop.errNoList'));
			$('#vsslReqInfoModalMsg').text($.i18n.t('vsslRepInfoPop.errNoList'));
		}
	} else {
//		alertPop(emptyMsg);
		$('#vsslReqInfoModalMsg').text(emptyMsg);
	}
}

const searchSchedule = () => {
	const hullnum = $('#hullnum').val();
	
	if(isEmpty(hullnum)) {
		alertPop($.i18n.t('errEnterHull'));
	}else {
		$('#search_schedule_modal').modal('show');
	searchSchePopSearch(1);
	}
}

const searchSchePopSearch = (page) => {
	var shipType = $('#searchSchePopShipType').val();
	var hullnum = $('#searchSchePopHullNum').val();

	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/sche/getScheduleList.html',
		data: {
			page: page,
			shiptype: shipType,
			hullnum: hullnum,
			sort: '',
			order: ''
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';

			listArr = json.list;
			_searchSchePopList = json.list;

			for(var i = 0; i < json.list.length; i++) {
				let trialKey = json.list[i].trialKey;
				
				if(!isEmpty(trialKey)) {
					let tempArr = trialKey.split('_');
					
					if(tempArr.length == 2) {
						trialKey = tempArr[1];
					}
				}
				
				text += '<tr>';
				text += '	<td class=" text-center"><input type="radio" data-uid=' + json.list[i].uid + ' name="listChk"></td>';
				text += '	<td class=" text-center cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].shiptype  + '</td>';
				text += '	<td class=" text-center cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].hullnum + '</td>';
				text += '	<td class=" text-center cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + trialKey + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].desc + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].ownerName + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].department + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].sdate + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].edate + '</td>';
				text += '	<td class=" cursor-pointer" onClick="checkSearchPopSche(' + json.list[i].uid + ')">' + json.list[i].status + '</td>';

				text += '</tr>';
			}

			$('#searchschedulelist').empty();

			if(json.list.length > 0) {
				$('#searchschedulelist').append(text);
			}else {
				$('#searchschedulelist').append('<tr><td class="text-center" colspan="10">' + $.i18n.t('share:noList') + '</td></tr>');
			}

			pagingforsearchschepop(json.listCnt, page);
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

const checkSearchPopSche = (id) => {
	$(`input[name="listChk"][data-uid="${id}"]`).prop("checked", "checked")
}

const getScheDetail = () => {
	const uid = $(`input[name="listChk"]:checked`).attr("data-uid")
	if (!uid || uid === '') {
		// $.i18n.t('compNew')
		alertPop("선택된 스케쥴이 없습니다.");
	} else {
		copyUid = uid;
		getScheRowList(uid)
	}

}

function pagingforsearchschepop(cnt, page){
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
		text += '<div onclick="searchSchePopSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}

	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(page) == k) {
			text += '<div onclick="searchSchePopSearch(' + k + ');" class="pg-num active">' + k + '</div>';
		}else {
			text += '<div onclick="searchSchePopSearch(' + k + ');" class="pg-num">' + k + '</div>';
		}
	}

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="searchSchePopSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}

	$('#paginationforsearchsche').empty();
	$('#paginationforsearchsche').append(text);
}


// Hullnum 조회 팝업 호출 
function searchHullnum() {
	// 조회 값 초기화
	$('#searchHullPopShiptype').val('');
	$('#searchHullPopHullnum').val('');
	$('#searchHullPopDesc').val('');

	// 팝업 호출
	$('#search_hullnum_modal').modal();
	searchHullPopSearch(1);
}

// Hullnum 팝업 조회
const searchHullPopSearch = (page) => {
	var shipType = $('#searchHullPopShiptype option:selected').val();
	var hullnum = $('#searchHullPopHullnum').val();
	var title = $('#searchHullPopDesc').val();

	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/db/vessel/getVesselListForPop.html',
		data: {
			page: page,
			shipType: shipType,
			shipNum: hullnum,
			title: title,
			sort: '',
			order: ''
		},
		success: function(data) {
			var json = JSON.parse(data);
			var text = '';

			listArr = json.list;
			
			scheHullSearchList = [];
			scheHullSearchList = listArr; 

			for(let i in listArr) {
				let shipType = isEmpty(listArr[i].shipType) ? '' : listArr[i].shipType.split('/')[1];
				
				text += '<tr class="cursor-pointer">';
				text += '	<td class=" text-center" onClick="selectHullnum(' + i + ')">' + listArr[i].imo  + '</td>';
				text += '	<td class=" text-center" onClick="selectHullnum(' + i + ')">' + listArr[i].shipNum + '</td>';
				text += '	<td class="" onClick="selectHullnum(' + i + ')">' + listArr[i].title + '</td>';
				text += '	<td class=" text-center" onClick="selectHullnum(' + i + ')">' + shipType + '</td>';
				text += '</tr>';
			}

			$('#searchHullPopList').empty();

			if(listArr.length > 0) {
				$('#searchHullPopList').append(text);
			}else {
				$('#searchHullPopList').append('<tr><td class="text-center" colspan="4">' + $.i18n.t('share:noList') + '</td></tr>');
			}

			pagingforsearchHullpop(json.listCnt, page);
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

// Hullnum 팝업 페이징 처리
function pagingforsearchHullpop(cnt, page){

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
		text += '<div onclick="searchHullPopSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}

	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(page) == k) {
			text += '<div onclick="searchHullPopSearch(' + k + ');" class="pg-num active">' + k + '</div>';
		}else {
			text += '<div onclick="searchHullPopSearch(' + k + ');" class="pg-num">' + k + '</div>';
		}
	}

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="searchHullPopSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}

	$('#searchHullPop-pagination').empty();
	$('#searchHullPop-pagination').append(text);

}

// 팝업에서 선박 선택 이벤트 
function selectHullnum(idx){
	$('#hullnum').val(scheHullSearchList[idx].shipNum);
	$('#desc').val(scheHullSearchList[idx].title);
	
	if(!isEmpty(scheHullSearchList[idx].shipType)){
		$('#shiptype').val(scheHullSearchList[idx].shipType.split('/')[0]);
	}
	
	$('#search_hullnum_modal').modal('hide');
}

// 스케쥴 유형에 따른 스케쥴 코드 목록 가져오기.
function getSchedCodeList(isEmptyScheduleList) {
	const shiptype = $('#shiptype option:selected').val();
	const schedtype = $('#schedtype option:selected').val();
	
	if(isEmpty(shiptype) || isEmpty(schedtype)){
		$('#scheduleList').empty();
		$('#schedCodeList').children('option:not(:first)').remove();
		return;
	}
		
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/sche/getScheduleCodeInfoListForNewSche.html',
		data: {
			shiptype: shiptype,
			schedtype: schedtype
		},
		success: function(data) {
			let json = JSON.parse(data);
			
			if(isEmptyScheduleList) {
				$('#scheduleList').empty();
				isLoadData = false;
			}
			
			$('#schedCodeList').children('option:not(:first)').remove();
			
			if(!isEmpty(json.list) && json.list.length > 0) {
				for(let i = 0; i < json.list.length; i++) {
					$('#schedCodeList').append('<option value="' + json.list[i].uid + '">' + json.list[i].desc + '</option>');
				}
			}
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

// 스케쥴 코드 목록에 따른 스케쥴 코드 상세 목록 가져오기.
function getSchedCodeDetailList() {
	const shiptype = $('#shiptype option:selected').val();
	const schedtype = $('#schedtype option:selected').val();
	const schedCodeList = $('#schedCodeList option:selected').val();

	if(isEmpty(shiptype) || isEmpty(schedtype)){
		$('#scheduleList').empty();
		$('#schedCodeList').children('option:not(:first)').remove();
		return;
	}

	if(isEmpty(schedCodeList)){
		$('#scheduleList').empty();
		return;
	}
	
	const uid = schedCodeList;

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheduleCodeDetailListForNewSche.html",
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
			var jsonResult = result.list;
			var text = '';
			scheRowList = [];
			scheRowList.push(result.list); // scheRowList 배열 담기

			const mainSdate = document.querySelector("#sdate").value

			for(let i in jsonResult) {

				if (isEmpty(jsonResult[i].sdate) && i == 0 && mainSdate) {
					jsonResult[i].sdate = mainSdate // 날짜 셋팅 되어 있으면 첫행의 날짜 입력
					jsonResult[i].stime = '09:30'

					const sdatetime = new Date(`${mainSdate} 09:30:00`)

					sdatetime.setMinutes(sdatetime.getMinutes() + Number(jsonResult[i].per))
					const edate = `${sdatetime.getFullYear()}-${ sdatetime.getMonth() + 1 < 10 ? '0' + (sdatetime.getMonth() + 1) : sdatetime.getMonth() + 1}-${sdatetime.getDate() < 10 ? '0' + sdatetime.getDate() : sdatetime.getDate()}`
					const etime = `${sdatetime.getHours() < 10 ? '0'+sdatetime.getHours() : sdatetime.getHours()}:${ sdatetime.getMinutes() < 10 ? '0'+sdatetime.getMinutes():sdatetime.getMinutes() }`

					jsonResult[i].edate = edate
					jsonResult[i].etime = etime
				} else {
					jsonResult[i].sdate = ''
					jsonResult[i].stime = ''
					jsonResult[i].edate = ''
					jsonResult[i].etime = ''
				}

				text +=`
					<tr id="scheTr${i}">
						<td class=""><input type="text" name="scheCate" class=" scheCate" value="${jsonResult[i].lv1code}"></td>
						<td class="">
							<div class="d-flex align-items-center">
								<div>
									<input name="scheTcnum" type="text" class="inputSearch" data-codeuid="${jsonResult[i].uid}" data-codetcnum="${jsonResult[i].displaycode}" data-codedesc="${jsonResult[i].description}" value="${jsonResult[i].displaycode}">
								</div>
								<div class="flex-grow-1">
									<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="setTcnumBtn(${i})"><img src="${contextPath}/img/i_btn_search.svg" height="20px"></button>
								</div>
							</div>
						</td>
						<td class=""><input type="text" name="scheDesc" class="" value="${jsonResult[i].description}"></td>
						<td class=""><select name="scheCtype" class=" scheCtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'ctype')}</select></td>
						<td class=""><input type="text" name="scheLoad" class=" scheLoad" value="${getLoadRate(jsonResult[i].loadrate, true)}"></td>
						
						<td class=""><select name="scheDtype" class=" scheDtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'dtype')}</select></td>
						<td class=""><input type="date" name="scheSdate"class="" value="${jsonResult[i].sdate}"></td>
						<td class=""><input type="text" name="scheStime" class=" scheTime" value="${jsonResult[i].stime}"></td>
						<td class=""><input type="date" name="scheEdate" class="" value="${jsonResult[i].edate}"></td>
						<td class=""><input type="text" name="scheEtime" class=" scheTime" value="${jsonResult[i].etime}"></td>
						
						<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						<td class=" text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i></td>
					</tr>`;

				scheTrIdx = i;
			}

			$('#scheduleList').empty();

			if(!isEmpty(text)) {
				$("#scheduleList").append(text);

				// check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
				setCompEvent();

				scheTrIdx++;
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}