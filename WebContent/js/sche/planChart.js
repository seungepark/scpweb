var mng = null;
let _vLine;
let newTcSearchModalScheTcSearchList = [];
let _isTcAddDel = false;		// TC 추가/삭제 여부.

$(function(){
    initI18n();
    init();

    getScheRowList();

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
            namespaces: ['share', 'planChart'],
            defaultNs: 'planChart'
        },
        resStore: RES_LANG
    }, function() {
        $('body').i18n();
    });
}

function init() {
	initDesign();
	
	$('#scheRowAllChk').click(function(){
		if($(this).is(':checked')) {
			$('input[name=scheRowChk]').prop('checked', true);
		}else {
			$('input[name=scheRowChk]').prop('checked', false);
		}
		
		setRowSelectedSetName('scheRowChk');
	});
}  

function toggleScheduleMode() {
    if('none' === $('#chartPanel').css('display')) {
		$('#chartPanel').css('display', 'block');
		$('#toggleBtnList').text($.i18n.t('btnList'));
	}else {
		$('#chartPanel').css('display', 'none');
	}

    if('none' === $('#dDataPanel').css('display')) {
		$('#dDataPanel').css('display', 'block');
		$('#toggleBtnList').text($.i18n.t('btnListChart'));
	}else {
		$('#dDataPanel').css('display', 'none');
	}
}

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
                codedettcnum: scheTcnum.eq(i).attr('data-codetcnum') ?? '',
                codedetdesc: scheTcnum.eq(i).attr('data-codedesc') ?? '',
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

function getScheRowList() {
    $.ajax({
        type: 'GET',
        url: contextPath + '/mng/sche/getScheRowList.html',
        dataType: 'json',
        headers: {
            'content-type': 'application/json'
        },
        beforeSend: function() {
            $('#loading').css('display','block');
        },
        complete: function() {
            $('#loading').css('display','none');
        },
        data: {
            uid: _scheUid,
            search2: 'chart'
        }
    }).done(function(result, textStatus, xhr) {
        if(textStatus == 'success') {
            let jsonResult = result.list;

            let text = '';
            scheRowList = [];
            scheRowList.push(result.list); // scheRowList 배열 담기

            // Schedule Detail 스크롤 및 기본 크기 설정
//            $('#dDataPanel').css('overflow-y', 'auto');
//            $('#dDataPanel').css('max-height', (screen.height * 0.7) + 'px');

            for(let i in jsonResult) {
                text +=`
					<tr id="scheModTr${i}">
						<td class=""><input type="checkbox" data-uid="${jsonResult[i].uid}" data-flag="R" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
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
						<td class=""><input type="date" name="scheSdate" class="" value="${jsonResult[i].sdate}"></td>
						<td class=""><input type="time" name="scheStime" class="" value="${jsonResult[i].stime}"></td>
						<td class=""><input type="date" name="scheEdate" class="" value="${jsonResult[i].edate}"></td>
						
						<td class=""><input type="time" name="scheEtime" class="" value="${jsonResult[i].etime}"></td>
						<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						
						<td class=" text-center pointer" onClick="delTc(false)"><i class="fa-solid fa-trash-can"></i>
							<input type="hidden" name="schePerformancesdate" class="" value="${jsonResult[i].performancesdate}" />
							<input type="hidden" name="schePerformancestime" class="" value="${jsonResult[i].performancestime}" />
							<input type="hidden" name="schePerformanceedate" class="" value="${jsonResult[i].performanceedate}" />
							<input type="hidden" name="schePerformanceetime" class="" value="${jsonResult[i].performanceetime}" />
						</td>
					</tr>`;

                scheTrIdx = i;
            }

            if ('' !== text) {
                $('#getScheRowList').html('')
                $('#getScheRowList').append(text);

                const jsonResults = getCurElmData();

                const schedule = {
                    datas: jsonResults,
                    isGanttChart: true,
                    isLineChart: true,
                    isEditable: true,
                    isPopup: true,
                    model: {
                        init: (modal) => {
                            modal.querySelector("input[name='seq']").addEventListener('change', (e) => {
                                e.target.setAttribute('data-seq', 'U')
                            })
                        }
                    }
                }

                mng = new ScheduleManager('scheduleManager', schedule);
                mng.init();
            }
        }else {
            alertPop($.i18n.t('share:tryAgain'));
        }

    }).fail(function(data, textStatus, errorThrown) {

    });
}

const applyChart = () => {
    const datas = mng.getData()
    datas.forEach(d => {
        if (d.loadrate === 0) {
            d.loadrate = '0.00'
        }
    })
    // console.log(datas)
    refreshScheRowList(datas)
}

function refreshScheRowList(scheMoveRowList){
    scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));

    let text = '';
    for(let i in scheMoveRowList) {
		if(scheMoveRowList[i].flag == 'D') {
			text +=`
				<tr id="scheModTr${i}">
					<td class=""><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
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
					<td class=""><input type="date" name="scheSdate" class="" disabled value="${scheMoveRowList[i].sdate}"></td>
					<td class=""><input type="time" name="scheStime" class="" disabled value="${scheMoveRowList[i].stime}"></td>
					<td class=""><input type="date" name="scheEdate" class="" disabled value="${scheMoveRowList[i].edate}"></td>
					
					<td class=""><input type="time" name="scheEtime" class="" disabled value="${scheMoveRowList[i].etime}"></td>
					<td class=""><input type="text" name="scheSeq" class=" scheSeq" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="schePer" class=" schePer" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheReadyTm" class=" schePer" style="text-decoration:line-through;" disabled value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheSametc" class=" scheSameTc" style="text-decoration:line-through;" disabled value="${scheMoveRowList[i].sametcnum}"></td>
					
					<td class=" text-center pointer" onClick="delTc(false)">
						<i class="fa-solid fa-trash-can"></i>
						<input type="hidden" name="schePerformancesdate" class="" value="${scheMoveRowList[i].performancesdate}" />
						<input type="hidden" name="schePerformancestime" class="" value="${scheMoveRowList[i].performancestime}" />
						<input type="hidden" name="schePerformanceedate" class="" value="${scheMoveRowList[i].performanceedate}" />
						<input type="hidden" name="schePerformanceetime" class="" value="${scheMoveRowList[i].performanceetime}" />
					</td>
				</tr>`;
		}else {
			text +=`
				<tr id="scheModTr${i}">
					<td class=""><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheRowChk" onclick="setRowSelectedSetName('scheRowChk')"></td>
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
					<td class=""><input type="date" name="scheSdate" class="" value="${scheMoveRowList[i].sdate}"></td>
					<td class=""><input type="time" name="scheStime" class="" value="${scheMoveRowList[i].stime}"></td>
					<td class=""><input type="date" name="scheEdate" class="" value="${scheMoveRowList[i].edate}"></td>
					
					<td class=""><input type="time" name="scheEtime" class="" value="${scheMoveRowList[i].etime}"></td>
					<td class=""><input type="text" name="scheSeq" class=" scheSeq" value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="schePer" class=" schePer" value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheReadyTm" class=" schePer" value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
					<td class=""><input type="text" name="scheSametc" class=" scheSameTc" value="${scheMoveRowList[i].sametcnum}"></td>
					
					<td class=" text-center pointer" onClick="delTc(false)">
						<i class="fa-solid fa-trash-can"></i>
						<input type="hidden" name="schePerformancesdate" class="" value="${scheMoveRowList[i].performancesdate}" />
						<input type="hidden" name="schePerformancestime" class="" value="${scheMoveRowList[i].performancestime}" />
						<input type="hidden" name="schePerformanceedate" class="" value="${scheMoveRowList[i].performanceedate}" />
						<input type="hidden" name="schePerformanceetime" class="" value="${scheMoveRowList[i].performanceetime}" />
					</td>
				</tr>`;
		}
    }

    $('#getScheRowList').empty();

    if(text == '') {
        $('#getScheRowList').append('<tr><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
    } else{
        $('#getScheRowList').append(text);

        // check box 이벤트 변경, Time 관련 컴포넌트 및 이벤트 추가
        setTimePicker('input[name$="time"]');
//		setCompEvent();

        // Ctype의 유형에 따라 input 배경 처리
        setConvBg(scheMoveRowList);

    }
}

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

function setFlag(elm){
    const curChk = elm.closest('tr').children().find('[name="scheRowChk"]');

    if(curChk.length > 0){
        // check box의 uid가 있는 지 확인 후 flag 처리
        if(curChk.attr('data-uid') < 0 && curChk.attr('data-flag') != 'C'){
            curChk.attr('data-flag', 'C');
        } else if(curChk.attr('data-uid') > 0 && curChk.attr('data-flag') == 'R'){
            curChk.attr('data-flag', 'U');
        }
    }
}

function setConvBg(scheRowDataList){
    for(let i = 0; i < scheRowDataList.length; i++){
        if(!isEmpty(scheRowDataList[i].ctype) && (scheRowDataList[i].ctype == 'CONV' || scheRowDataList[i].ctype == 'CONVB')){
            $('#scheModTr'+i).find('input[type="text"], input[type="date"], select').addClass('scheConvBg');
        }
    }
}

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

// 250418 : 안 쓰는 메소드.
const setPerformanceDate = () => {
    const modalRoot = document.querySelector('#scheduleDetailModal');
    const sdate = modalRoot.querySelector("input[name='sdate']").value;
    const stime = modalRoot.querySelector("input[name='stime']").value;
    const edate = modalRoot.querySelector("input[name='edate']").value;
    const etime = modalRoot.querySelector("input[name='etime']").value;

    modalRoot.querySelector("input[name='performancesdate']").value = sdate;
    modalRoot.querySelector("input[name='performancestime']").value = stime;
    modalRoot.querySelector("input[name='performanceedate']").value = edate;
    modalRoot.querySelector("input[name='performanceetime']").value = etime;
}

function saveSchedule() {
	if(_status == 'ONGO' || _status == 'ARRIVE') {
		alertPop($.i18n.t('error.save'));
		return;
	}
					
    let isEmptySche = false;
    let emptyMsg = '';

    const pUid = _scheUid;
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

            codedettcnumList.push(curRow.codedettcnum ?? '')
            codedetdescList.push(curRow.codedetdesc ?? '')
        }
    }

    if(isEmptySche) {
        alertPop(emptyMsg);
    } else {
        jQuery.ajax({
            type: 'POST',
            url: contextPath + '/sche/planChartSave.html',
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
                codedettcnumList,
                codedetdescList
            },
            success: function(data) {
                let json = JSON.parse(data);

                if(json.result) {
                    alertPop($.i18n.t('compUpdate'));

					if(_isTcAddDel) {
						getScheRowList();
					}
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
            },
            error: function(req, status, err) {
                alertPop($.i18n.t('share:tryAgain'));
            },
            beforeSend: function() {
                $('#loading').css('display','block');
            },
            complete: function() {
                $('#loading').css('display','none');
            }
        });
    }
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

function moveSchedule() {
	
}

function closeMovePop() {
	
}

function setConvDateApplyBtn() {
	
}

// 안내선.
function initVLine() {
	_vLine = document.querySelector('.v-line');
	_vLine.setAttribute('style', 'visibility: hidden;');
	
	document.getElementById('chartPanel').addEventListener('mousemove', e => {
		let posX = e.clientX - 126;
		
		for(let i = 0; i < _dateTimeList.length; i++) {
			document.getElementById(_dateTimeList[i]).classList.remove('v-line-head');
			document.getElementById(_dateTimeList[i]).classList.add('v-line-head-out');
		}

		if(posX > 60) {
			_vLine.setAttribute('style', 'visibility: visible;');
			_vLine.setAttribute('style', 'left: ' + posX + 'px;');
			
			let scrollX = document.getElementById('chartScrollArea').scrollLeft;
			let vLineHeadStart = posX + scrollX - 90;
			
			if(vLineHeadStart > 0) {
				let vLineHead = Math.round(vLineHeadStart / 30);
				
				if(vLineHead < _dateTimeList.length) {
					document.getElementById(_dateTimeList[vLineHead]).classList.remove('v-line-head-out');
					document.getElementById(_dateTimeList[vLineHead]).classList.add('v-line-head');
					_currDateTime = _dateTimeList[vLineHead];
				}else {
					_currDateTime = _dateTimeList[0];
				}
			}else {
				_currDateTime = _dateTimeList[0];
			}			
		}else {
			_vLine.setAttribute('style', 'visibility: hidden;');
			_currDateTime = _dateTimeList[0];
		}
	});

	document.querySelector('#chartPanel').addEventListener('mouseenter', e => {
		_vLine.setAttribute('style', 'visibility: visible;');
	});

	document.querySelector('#chartPanel').addEventListener('mouseleave', e => {
		_vLine.setAttribute('style', 'visibility: hidden;');
		_currDateTime = _dateTimeList[0];
		
		for(let i = 0; i < _dateTimeList.length; i++) {
			document.getElementById(_dateTimeList[i]).classList.remove('v-line-head');
			document.getElementById(_dateTimeList[i]).classList.add('v-line-head-out');
		}
	});
}

// 시작/완료 변경.
function changeDateTime() {
	let start = new Date($('#detailSdateTime').val());
	let end = new Date($('#detailEdateTime').val());
	let diff = end.getTime() - start.getTime();
	let min = diff / (60 * 1000);
	
	if(isNanEmpty(min)) {
		$('#detailPer').val(0);
	}else if(min < 0) {
		$('#detailEdateTime').val($('#detailSdateTime').val());
		$('#detailPer').val(0);
	}else {
		$('#detailPer').val(min);
	}
}

// 기간 변경.
function changePer() {
	let min = $('#detailPer').val();
	let sdateTime = $('#detailSdateTime').val().split('T');
	let sdate = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[0] : '';
	let stime = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[1] : '';
	
	if(!isNanEmpty(min)) {
		if(isValidDate(sdate) && isValidTime(stime)) {
			min = parseInt(min);
			let start = new Date(sdate + ' ' + stime);
			start.setMinutes(start.getMinutes() + min);
			
			let endYear = start.getFullYear();
			let endMonth = start.getMonth() + 1;
			let endDate = start.getDate();
			let endHour = start.getHours();
			let endMin = start.getMinutes();
			
			if(endMonth < 10) {
				endMonth = '0' + '' + endMonth;
			}
			
			if(endDate < 10) {
				endDate = '0' + '' + endDate;
			}
			
			if(endHour < 10) {
				endHour = '0' + '' + endHour;
			}
			
			if(endMin < 10) {
				endMin = '0' + '' + endMin;
			}
			
			$('#detailEdateTime').val(endYear + '-' + endMonth + '-' + endDate + 'T' + endHour + ':' + endMin);
		}
		
	}
}

// 시작/완료 변경 (추가 팝업).
function newTcModalChangeDateTime() {
	let start = new Date($('#newTcModalSdateTime').val());
	let end = new Date($('#newTcModalEdateTime').val());
	let diff = end.getTime() - start.getTime();
	let min = diff / (60 * 1000);
	
	if(isNanEmpty(min)) {
		$('#newTcModalPer').val(0);
	}else if(min < 0) {
		$('#newTcModalEdateTime').val($('#newTcModalSdateTime').val());
		$('#newTcModalPer').val(0);
	}else {
		$('#newTcModalPer').val(min);
	}
}

// 기간 변경 (추가 팝업).
function newTcModalChangePer() {
	let min = $('#newTcModalPer').val();
	let sdateTime = $('#newTcModalSdateTime').val().split('T');
	let sdate = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[0] : '';
	let stime = !isEmpty(sdateTime) && sdateTime.length == 2 ? sdateTime[1] : '';
	
	if(!isNanEmpty(min)) {
		if(isValidDate(sdate) && isValidTime(stime)) {
			min = parseInt(min);
			let start = new Date(sdate + ' ' + stime);
			start.setMinutes(start.getMinutes() + min);
			
			let endYear = start.getFullYear();
			let endMonth = start.getMonth() + 1;
			let endDate = start.getDate();
			let endHour = start.getHours();
			let endMin = start.getMinutes();
			
			if(endMonth < 10) {
				endMonth = '0' + '' + endMonth;
			}
			
			if(endDate < 10) {
				endDate = '0' + '' + endDate;
			}
			
			if(endHour < 10) {
				endHour = '0' + '' + endHour;
			}
			
			if(endMin < 10) {
				endMin = '0' + '' + endMin;
			}
			
			$('#newTcModalEdateTime').val(endYear + '-' + endMonth + '-' + endDate + 'T' + endHour + ':' + endMin);
		}
		
	}
}

// TC 추가 (추가 팝업).
function addTc() {
	let sd = '';
	let st = '';
	let ed = '';
	let et = '';
	
	if(!isEmpty(_currDateTimeHold) && _currDateTimeHold.length == 13) {
		let arr = _currDateTimeHold.split('-');
		
		sd = arr[0] + '-' + arr[1] + '-' + arr[2];
		ed = arr[0] + '-' + arr[1] + '-' + arr[2];
		st = arr[3] + ':' + '00';
		et = arr[3] + ':' + '30';
	}
	
	$('#newTcModalScheTcnum').val('');
	$('#newTcModalDesc').val('');
	$('#newTcModalCtype option:eq(0)').prop('selected', true);
	$('#newTcModalDtype option:eq(0)').prop('selected', true);
	$('#newTcModalSeq').val(_currSeq);
	$('#newTcModalLoadrate').val('');
	
	$('#newTcModalSdateTime').val(sd + 'T' + st);
	$('#newTcModalEdateTime').val(ed + 'T' + et);
	
	$('#newTcModalPer').val('');
	$('#newTcModalReadytime').val('');
	$('#newTcModalSameTcNum').val('');
	
	newTcModalChangeDateTime();
	
	$('#newTcModal').modal();
}

// TC Num 검색 (추가 팝업).
function popSearchTcNum() {
	newTcSearchModalSearch(1);
	$('#newTcSearchModal').modal();
	$('#newTcModal').modal('hide');
}

//TCNUM 조회 팝업 검색 버튼 이벤트 (추가 팝업).
function newTcSearchModalSearch(page){
	$.ajax({
		type: "GET",
		url: contextPath + "/sche/getScheTcNumSearchList.html",
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
			displaycode: $('#newTcSearchModalTcnum').val(),
			description: $('#newTcSearchModalDesc').val(),
			schedtype: $('#schedtype').val(),
			status: 'ACT'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';

			newTcSearchModalScheTcSearchList = [];
			newTcSearchModalScheTcSearchList = result.list;

			for(let i in jsonResult) {
				text +=`
					<tr class="cursor-pointer">
						<td class="text-left" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].displaycode}</td>
						<td class="text-left" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].description}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].dtype}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].ctype}</td>
						<td class="text-center" onClick="newTcSearchModalSelectTcNum(${i})">${jsonResult[i].loadstr}</td>
						
						<td class="text-right" onClick="newTcSearchModalSelectTcNum(${i})">${getFloatVal(jsonResult[i].per)}</td>
						<td class="text-right" onClick="newTcSearchModalSelectTcNum(${i})">${getFloatVal(jsonResult[i].readytime)}</td>
					</tr>`;
			}

			$('#newTcSearchModalList').empty();

			if(jsonResult.length > 0) {
				$("#newTcSearchModalList").append(text);
			} else{
				$("#newTcSearchModalList").append('<tr><td class="text-center" colspan="7">' + $.i18n.t('share:noList') + '</td></tr>');
			}

			newTcSearchModalPaging(result.listCnt, page);

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

//Tc Num 조회 팝업 페이징 처리 (추가 팝업).
function newTcSearchModalPaging(cnt, page){
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
		text += '<div onclick="newTcSearchModalSearch(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}else {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}

	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(page) == k) {
			text += '<div onclick="newTcSearchModalSearch(' + k + ');" class="pg-num active">' + k + '</div>';
	    }else {
			text += '<div onclick="newTcSearchModalSearch(' + k + ');" class="pg-num">' + k + '</div>';
	    }
	}

	if(total_paging_cnt != 0 && total_paging_cnt != 1 && next_no <= total_paging_cnt) {
		text += '<div onclick="newTcSearchModalSearch(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}else {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}

	$('#newTcSearchModalPagination').empty();
	$('#newTcSearchModalPagination').append(text); 
}
 
// TC Num 조회 팝업 행 선택 시 이벤트 (추가 팝업).
function newTcSearchModalSelectTcNum(idx){
	$('#newTcModalCategory').val(newTcSearchModalScheTcSearchList[idx].lv1code).prop('selected', true);
	$('#newTcModalScheTcnum').val(newTcSearchModalScheTcSearchList[idx].displaycode);
	$('#newTcModalDesc').val(newTcSearchModalScheTcSearchList[idx].description);
	$('#newTcModalCtype').val(newTcSearchModalScheTcSearchList[idx].ctype).prop('selected', true);
	$('#newTcModalDtype').val(newTcSearchModalScheTcSearchList[idx].dtype).prop('selected', true);
	$('#newTcModalLoadrate').val(getLoadRate(newTcSearchModalScheTcSearchList[idx].loadrate, true));
	$('#newTcModalPer').val(getFloatVal(newTcSearchModalScheTcSearchList[idx].per));
	$('#newTcModalReadytime').val(getFloatVal(newTcSearchModalScheTcSearchList[idx].readytime));
	$('#newTcModalSameTcNum').val(newTcSearchModalScheTcSearchList[idx].sametcnum);
	
	newTcModalChangePer();
	newTcModalChangeDateTime();
	newTcSearchModalClose();
}

// TC Num 조회 팝업 닫기 (추가 팝업).
function newTcSearchModalClose() {
	$('#newTcModal').modal();
	$('#newTcSearchModal').modal('hide');
}

// TC 추가 반영 (추가 팝업).
function saveAddTc() {
	// 해당 순서에 신규 데이터 끼워넣기.
	// 이후 순서 TC부터 차례로 1만틈 증가 (seq).
	// bar 반영.
	// 표 반영.
	// 반영 된 상태 확인.
	
	// 서버 저장.
	// 저장 확인.
	
	if(isEmpty($('#newTcModalCategory').val())) {
		toastPop($.i18n.t('newTcModal.errCate'));
	}else if(isEmpty($('#newTcModalScheTcnum').val())) {
		toastPop($.i18n.t('newTcModal.errTcNum'));
	}else if(isEmpty($('#newTcModalSdateTime').val())) {
		toastPop($.i18n.t('newTcModal.errSdate'));
	}else if(isEmpty($('#newTcModalEdateTime').val())) {
		toastPop($.i18n.t('newTcModal.errEdate'));
	}else if(isEmpty($('#newTcModalPer').val())) {
		toastPop($.i18n.t('newTcModal.errPer'));
	}else {
		_isTcAddDel = true;
		mng.saveAddTc();
	}
}

// TC 삭제.
function delTc(isPop) {
	_isTcAddDel = true;
	mng.delTc(isPop);
}

function viewReportPrint() {
	window.open(contextPath + '/sche/planReportSchedule.html', 'reportSchedulePlan', '');
}