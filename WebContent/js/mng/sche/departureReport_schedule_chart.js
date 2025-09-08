let mng = null;
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
            namespaces: ['share', 'mngDepScheChart'],
            defaultNs: 'mngDepScheChart'
        },
        resStore: RES_LANG
    }, function () {
        $('body').i18n();
    });
}

function init() {
    //	$('.modal-dialog').draggable({handle: '.modal-header'});
    $("#trialMng").addClass("active"); // Left Menu 1depth open
    $("#trialMng ul").css("display", "block"); // Left Menu open
    $("#scheDepart").addClass("current-page"); // Left Menu 2depth open

}

function toggleScheduleMode() {
    if ("none" === $("#chartPanel").css('display')) $("#chartPanel").css('display', 'block')
    else $("#chartPanel").css('display', 'none')

    if ("none" === $("#dDataPanel").css('display')) $("#dDataPanel").css('display', 'block')
    else $("#dDataPanel").css('display', 'none')
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

function getScheRowList() {
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
            $("#dDataPanel").css('overflow-y', 'auto');
            $("#dDataPanel").css('max-height', (screen.height * 0.7) + 'px');

            for(let i in jsonResult) {
                text +=`
					<tr class="even border" id="scheModTr${i}">
						<td class="border"><input type="checkbox" data-uid="${jsonResult[i].uid}" data-flag="R" name="scheRowChk"></td>
						<td class="border"><input type="text" name="scheCate" class="form-control scheCate" value="${jsonResult[i].category}"></td>
						<td class="border">
							<div class="inputSearchDiv">
								<input type="text" name="scheTcnum" class="form-control inputSearch" data-codeuid="${jsonResult[i].codedetuid}" data-codetcnum="${jsonResult[i].codedettcnum}" data-codedesc="${jsonResult[i].codedetdesc}" value="${jsonResult[i].tcnum}">
								<button type="button" class="btn btn-primary inputSearchBtn" onClick="setTcnumBtn(${i})">
									<i class="fa fa-search"></i>
								</button
							</div>
						</td>
						<td class="border"><input type="text" name="scheDesc" class="form-control" value="${jsonResult[i].desc}"></td>
						<td class="border"><select name="scheCtype" class="form-control scheCtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'ctype')}</select></td>
						
						<td class="border"><input type="text" name="scheLoad" class="form-control scheLoad" value="${getLoadRate(jsonResult[i].loadrate, true)}"></td>
						<td class="border"><select name="scheDtype" class="form-control scheDtype"><option value=""></option>${getTypeSelOption(jsonResult[i], 'dtype')}</select></td>
						<td class="border"><input type="date" name="scheSdate" class="form-control scheDate" value="${jsonResult[i].sdate}"></td>
						<td class="border"><input type="text" name="scheStime" class="form-control scheTime" value="${jsonResult[i].stime}"></td>
						<td class="border"><input type="date" name="scheEdate" class="form-control scheDate" value="${jsonResult[i].edate}"></td>
						
						<td class="border"><input type="text" name="scheEtime" class="form-control scheTime" value="${jsonResult[i].etime}"></td>
						<td class="border"><input type="text" name="scheSeq" class="form-control scheSeq" value="${getFloatVal(jsonResult[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class="border"><input type="text" name="schePer" class="form-control schePer" value="${getFloatVal(jsonResult[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class="border"><input type="text" name="scheReadyTm" class="form-control schePer" value="${getFloatVal(jsonResult[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
						<td class="border"><input type="text" name="scheSametc" class="form-control scheSameTc" value="${jsonResult[i].sametcnum}"></td>
						
						<td class="border text-center pointer" onClick="delSchedule(this)"><i class="fa-solid fa-trash-can"></i>
							<input type="hidden" name="schePerformancesdate" class="form-control schePerformancesdate" value="${jsonResult[i].performancesdate}" />
							<input type="hidden" name="schePerformancestime" class="form-control schePerformancestime" value="${jsonResult[i].performancestime}" />
							<input type="hidden" name="schePerformanceedate" class="form-control schePerformanceedate" value="${jsonResult[i].performanceedate}" />
							<input type="hidden" name="schePerformanceetime" class="form-control schePerformanceetime" value="${jsonResult[i].performanceetime}" />
						</td>
					</tr>`;

                scheTrIdx = i;
            }

            if ("" !== text) {
                $("#getScheRowList").html('')
                $("#getScheRowList").append(text);

                const jsonResults = getCurElmData();

                const schedule = {
                    datas: jsonResults,
                    isGanttChart: true,
                    isLineChart: true,
                    isEditable: true,
                    isPopup: true,
                    model: {
                        init: (modal) => {
                            // Date 변경 이벤트 설정
                            modal.querySelector("input[name='sdate']").addEventListener(("change"), () => {
                                setDateTimeChgEvent(modal, 'start')
                            })

                            modal.querySelector("input[name='edate']").addEventListener(("change"), () => {
                                setDateTimeChgEvent(modal, 'end')
                            })

                            modal.querySelector("input[name='seq']").addEventListener("change", (e) => {
                                e.target.setAttribute("data-seq", "U")
                            })
                        }
                    }
                }

                mng = new ScheduleManager("scheduleManager", schedule);
                mng.init()
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
            d.loadrate = "0.00"
        }
    })
    // console.log(datas)
    refreshScheRowList(datas)
}

function refreshScheRowList(scheMoveRowList){
    scheMoveRowList = JSON.parse(JSON.stringify(scheMoveRowList));

    let text = '';
    for(let i in scheMoveRowList) {
        text +=`
			<tr class="even border" id="scheModTr${i}">
				<td class="border"><input type="checkbox" data-uid="${scheMoveRowList[i].uid}" data-flag="${scheMoveRowList[i].flag}" name="scheRowChk"></td>
				<td class="border"><input type="text" name="scheCate" class="form-control scheCate" value="${scheMoveRowList[i].category}"></td>
				<td class="border">
					<div class="inputSearchDiv">
						<input type="text" name="scheTcnum" class="form-control inputSearch" data-codeuid="${scheMoveRowList[i].codedetuid}" data-codetcnum="${scheMoveRowList[i].codedettcnum}" data-codedesc="${scheMoveRowList[i].codedetdesc}" value="${scheMoveRowList[i].tcnum}">
						<button type="button" class="btn btn-primary inputSearchBtn" onClick="setTcnumBtn(${i})">
							<i class="fa fa-search"></i>
						</button
					</div>
				</td>
				<td class="border"><input type="text" name="scheDesc" class="form-control" value="${scheMoveRowList[i].desc}"></td>
				<td class="border"><select name="scheCtype" class="form-control scheCtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'ctype')}</select></td>
				
				<td class="border"><input type="text" name="scheLoad" class="form-control scheLoad" value="${getLoadRate(scheMoveRowList[i].loadrate, true)}"></td>
				<td class="border"><select name="scheDtype" class="form-control scheDtype"><option value=""></option>${getTypeSelOption(scheMoveRowList[i], 'dtype')}</select></td>
				<td class="border"><input type="date" name="scheSdate" class="form-control scheDate" value="${scheMoveRowList[i].sdate}"></td>
				<td class="border"><input type="text" name="scheStime" class="form-control scheTime" value="${scheMoveRowList[i].stime}"></td>
				<td class="border"><input type="date" name="scheEdate" class="form-control scheDate" value="${scheMoveRowList[i].edate}"></td>
				
				<td class="border"><input type="text" name="scheEtime" class="form-control scheTime" value="${scheMoveRowList[i].etime}"></td>
				<td class="border"><input type="text" name="scheSeq" class="form-control scheSeq" value="${getFloatVal(scheMoveRowList[i].seq)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class="border"><input type="text" name="schePer" class="form-control schePer" value="${getFloatVal(scheMoveRowList[i].per)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class="border"><input type="text" name="scheReadyTm" class="form-control schePer" value="${getFloatVal(scheMoveRowList[i].readytime)}" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');"></td>
				<td class="border"><input type="text" name="scheSametc" class="form-control scheSameTc" value="${scheMoveRowList[i].sametcnum}"></td>
				
				<td class="border text-center pointer" onClick="delSchedule(this)">
					<i class="fa-solid fa-trash-can"></i>
					<input type="hidden" name="schePerformancesdate" class="form-control schePerformancesdate" value="${scheMoveRowList[i].performancesdate}" />
					<input type="hidden" name="schePerformancestime" class="form-control schePerformancestime" value="${scheMoveRowList[i].performancestime}" />
					<input type="hidden" name="schePerformanceedate" class="form-control schePerformanceedate" value="${scheMoveRowList[i].performanceedate}" />
					<input type="hidden" name="schePerformanceetime" class="form-control schePerformanceetime" value="${scheMoveRowList[i].performanceetime}" />
				</td>
			</tr>`;
    }

    $("#getScheRowList").empty();

    if(text == '') {
        $("#getScheRowList").append('<tr class="even pointer"><td class="text-center" colspan="16">' + $.i18n.t('share:noList') + '</td></tr>');
    } else{
        $("#getScheRowList").append(text);

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
        if(curChk.attr('data-uid') == -1 && curChk.attr('data-flag') != 'C'){
            curChk.attr('data-flag', 'C');
        } else if(curChk.attr('data-uid') != -1 && curChk.attr('data-flag') == 'R'){
            curChk.attr('data-flag', 'U');
        }
    }
}

function setConvBg(scheRowDataList){
    for(let i = 0; i < scheRowDataList.length; i++){
        if(!isEmpty(scheRowDataList[i].ctype) && (scheRowDataList[i].ctype == 'CONV' || scheRowDataList[i].ctype == 'CONVB')){
            $('#scheModTr'+i).find('input[type="text"], input[type="date"], select').addClass("scheConvBg");
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

const setPerformanceDate = () => {
    const modalRoot = document.querySelector("#scheduleDetailModal")
    const sdate = modalRoot.querySelector("input[name='sdate']").value
    const stime = modalRoot.querySelector("input[name='stime']").value
    const edate = modalRoot.querySelector("input[name='edate']").value
    const etime = modalRoot.querySelector("input[name='etime']").value

    modalRoot.querySelector("input[name='performancesdate']").value = sdate
    modalRoot.querySelector("input[name='performancestime']").value = stime
    modalRoot.querySelector("input[name='performanceedate']").value = edate
    modalRoot.querySelector("input[name='performanceetime']").value = etime
}

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

                if(json.result) {
                    alertPop($.i18n.t('compUpdate'));
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