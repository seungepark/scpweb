
$(function() {
	initI18n();
	
	setSearchOption();
	
	init();
	initServerCheck();
	autocompleteOff();
});

function initI18n() {
	var lang = initLang();

	$.i18n.init({
		lng : lang,
		fallbackLng : FALLBACK_LNG,
		fallbackOnNull : false,
		fallbackOnEmpty : false,
		useLocalStorage : false,
		ns : {
			namespaces : [ 'share', 'mngDepReport' ],
			defaultNs : 'mngDepReport'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	
//	$('.modal-dialog').draggable({handle: '.modal-header'});
	$("#trialMng").addClass("active"); // Left Menu 1depth open
	$("#trialMng ul").css("display", "block"); // Left Menu open
	$("#scheDepart").addClass("current-page"); // Left Menu 2depth open

	if (!isEmpty(scheSdate) && !isEmpty(scheEdate)) {
		const sd = new Date(scheSdate)
		const ed = new Date(scheEdate)
		const period = parseInt((ed - sd) / (24 * 60 * 60 * 1000))
		addScheduleDate(scheSdate, period === 0 ? 0 : period)
	}

	$('#listAllChk').click(function(){
		if($(this).is(':checked')) {
			$('input[name=scheCrewRowChk]').prop('checked', true);
		}else {
			$('input[name=scheCrewRowChk]').prop('checked', false);
		}
	});

	getSchedulerCrewInfoData()

	// 입력 컴포넌트 변경 이벤트
	let inputAll = 'select[name="scheCrewCateType"], select[name="scheCrewPositionType"], input[name="scheCrewCompany"], input[name="scheCrewDeparture"], input[name="scheCrewName"]';
	inputAll += ', input[name="scheCrewRank"], input[name="scheCrewComNum"], input[name="scheCrewWorkType"], input[name="scheCrewSsNum"], input[name="scheCrewTel"]'
	inputAll += ', select[name="scheCrewBarkingType"]'
	$('#schedulerCrewInfoData').on('change', inputAll , function(e){
		// Flag 처리
		setFlag($(this));
	});
}

function setSearchOption() {
	let sortNm = getSearchCookie('SK_SORTNM');
  	let sortOd = getSearchCookie('SK_SORTOD');
	
  	let shipType = getSearchCookie('SK_TYPE');
  	let hullnum = getSearchCookie('SK_SHIP');
  	let pic = getSearchCookie('SK_DESC');
  	
  	if(shipType != '') {
  		$('#shipType').val(shipType).prop('selected', true);
  	}
  	
	$('#hullnum').val(hullnum);
	$('#pic').val(pic);
	
	if(sortNm != '' && sortOd != '') {
		_isSetSort = true;
		$('#tbList').bootstrapTable('refreshOptions', {sortName: sortNm, sortOrder: sortOd});
	}
}

function saveSearchOption() {
	setSearchCookie('SK_SORTNM', listSort);
  	setSearchCookie('SK_SORTOD', listOrder);

  	setSearchCookie('SK_TYPE', $('#shipType option:selected').val());
  	setSearchCookie('SK_SHIP', $('#hullnum').val());
  	setSearchCookie('SK_DESC', $('#pic').val());
}

function setScheduleDate() {
	const scheCrewSdate = $("#sdate").val()
	let scheCrewPeriod = $("#period").val()

	if (isEmpty(scheCrewSdate)) {
		alertPop("승선 시작일을 입력해 주세요.")
		return;
	}

	if (isEmpty(scheCrewPeriod)) {
		scheCrewPeriod = 0
	}

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/updateScheCrewDays.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend: function() {
			$('#loading').css('display','block');
		},
		complete: function() {
			$('#loading').css('display',"none");
		},
		data: {
			uid: scheUid,
			scheCrewSdate: scheCrewSdate,
			scheCrewPeriod: parseInt(scheCrewPeriod)
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus === "success") {
			const beforePeriod = $("#schedulerCrewInfoHead th[data-group=\"dateGroup\"]").length - 1
			addScheduleDate(scheCrewSdate, parseInt(scheCrewPeriod))
			console.log(beforePeriod, parseInt(scheCrewPeriod))
			if (beforePeriod < parseInt(scheCrewPeriod)) {
				// 증가로직
				for(let i = 0; i < parseInt(scheCrewPeriod) - beforePeriod; i ++) {
					const day = $(`#schedulerCrewInfoHead th:eq(${ 11 + beforePeriod + 1 + i })`).data("date")
					$('#schedulerCrewInfoData tr').each((j, elm) => {
						$(elm).find(`td:eq(${ 11 + beforePeriod + i })`).after(`<td class="border"><select data-date="${day}" name="scheCrewBarkingType" class="form-control"><option value=""></option>${getTypeSelOption(null, 'barkingType')}</select></td>`);
					})
				}
			} else {
				// 감소 로직
				for(let i = 0; i < beforePeriod - parseInt(scheCrewPeriod) ; i ++) {
					$('#schedulerCrewInfoData tr').each((j, elm) => {
						$(elm).find(`td:eq(${ 11 + beforePeriod - i })`).remove()
					})
				}
			}

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}

function addScheduleDate(sdate, period) {
	$("#schedulerCrewInfoHead th[data-group=\"dateGroup\"]").remove()

	if (isEmpty(period) || period === 0) {
		const text = `${sdate.substring(5, 7)}/${sdate.substring(8, 10)}`
		$("#schedulerCrewInfoHead tr").append(`<th class="column-title border" data-group="dateGroup" data-field="date0" data-sortable="true" data-date="${sdate}"><span data-i18n="list.date0">${text}</span></th>`)
		// <th className="column-title border"></th>
	} else {
		for (let i = 0; i < period; i++) {
			const day = addDays(sdate, i)
			const text = `${day.substring(5, 7)}/${day.substring(8, 10)}`
			$("#schedulerCrewInfoHead tr").append(`<th class="column-title border" data-group="dateGroup" data-field="date${i}" data-sortable="true" data-date="${day}"><span data-i18n="list.date${i}">${text}</span></th>`)
		}
	}
	$("#schedulerCrewInfoHead tr").append('<th class="column-title border" data-group="dateGroup"></th>')
}

function addDays(date, days) {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return `${result.getFullYear()}-${result.getMonth() + 1 > 9 ? result.getMonth() + 1 : '0' + (result.getMonth() + 1)}-${result.getDate() > 9 ? result.getDate() : '0' + result.getDate()}`;
}

function openFileInput() {
	document.getElementById('fileInput').click();
}

function handleFiles(files) {
	if (files.length > 0) {
		uploadExcel(files[0])
	}
}

function uploadExcel(file) {
	if (file) {
		const formData = new FormData();
		formData.append('file', file);

		$.ajax({
			type: 'POST',
			url: `${contextPath}/mng/sche/uploadScheCrewExcel.html?uid=${scheUid}`,
			data: formData,
			contentType: false,
			processData: false,
			dataType: "json",
			success: function(response, textStatus, xhr) {
				if ("success" === textStatus) {
					$("#schedulerCrewInfoData tr").each((i, elm) => {
						$(elm).find("input[name='scheCrewRowChk']").attr("data-flag", "D")
						elm.style.display = 'none'
					})
					response.list.forEach((info) => { addTableForSchedulerCrewInfoData(info) })
				}
			},
			error: function(error) {
				console.error('Error uploading file:', error);
			}
		});
	} else {
		alert('Please select a file to upload.');
	}
}

function downloadExcel() {
	window.location.href = `${contextPath}/mng/sche/downloadScheCrewExcel.html?uid=${scheUid}`
}

function getSchedulerCrewInfoData() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/mng/sche/getSchedulerCrewInfoList.html',
		data: {
			uid: scheUid
		},
		dataType: "json",
		success: function(response, textStatus, xhr) {
			if ("success" === textStatus) {
				$("#schedulerCrewInfoData").empty()
				response.list.forEach((info) => { addTableForSchedulerCrewInfoData(info) })
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

function addTableForSchedulerCrewInfoData(bean) {

	const table = $("#schedulerCrewInfoData")
	const len = $("#schedulerCrewInfoData tr:visible").length + 1

	const sd = new Date(scheSdate)
	const ed = new Date(scheEdate)
	const period = parseInt((ed - sd) / (24 * 60 * 60 * 1000))

	let html = ''
	html += `
		<tr class="even border ui-sortable-handle" id="scheCrewModTr${len}">
			<td class="border"><input type="checkbox" data-uid="${bean && bean.uid ? bean.uid : -1}" data-flag="${bean && bean.uid ? 'R' : 'N'}" name="scheCrewRowChk"></td>
			<td class="border">${ len }</td>
			<td class="border"><select name="scheCrewCateType" class="form-control scheCrewCateType"><option value=""></option>${getTypeSelOption(bean, 'cateType')}</select></td>
			<td class="border"><select name="scheCrewPositionType" class="form-control scheCrewPositionType"><option value=""></option>${getTypeSelOption(bean, 'positionType')}</select></td>
			<td class="border"><input type="text" name="scheCrewCompany" class="form-control" value="${bean && bean.company ? bean.company : ''}" /></td>
			
			<td class="border"><input type="text" name="scheCrewDeparture" class="form-control" value="${bean && bean.departure ? bean.departure : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewName" class="form-control" value="${bean && bean.name ? bean.name : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewRank" class="form-control" value="${bean && bean.rank ? bean.rank : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewComNum" class="form-control" value="${bean && bean.comNum ? bean.comNum : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewWorkType" class="form-control" value="${bean && bean.workType ? bean.workType : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewSsNum" class="form-control" value="${bean && bean.ssNum ? bean.ssNum : ''}" /></td>
			<td class="border"><input type="text" name="scheCrewTel" class="form-control" value="${bean && bean.tel ? bean.tel : ''}" /></td>
	`

	for (let i = 0; i < period; i ++) {
		const day = addDays(scheSdate, i)
		if (bean && bean.detail?.length !== 0) {
			const tmp = bean.detail.find(detail => detail.barkingDate === day)
			if (tmp) {
				html += `<td class="border"><select data-date="${day}" name="scheCrewBarkingType" class="form-control"><option value=""></option>${getTypeSelOption(tmp, 'barkingType')}</select></td>`
			} else {
				html += `<td class="border"><select data-date="${day}" name="scheCrewBarkingType" class="form-control"><option value=""></option>${getTypeSelOption(null, 'barkingType')}</select></td>`
			}
		} else {
			html += `<td class="border"><select data-date="${day}" name="scheCrewBarkingType" class="form-control"><option value=""></option>${getTypeSelOption(null, 'barkingType')}</select></td>`
		}
	}

	html += `
			<td class="border text-center pointer" onClick="delRow(this)"><i class="fa-solid fa-trash-can"></i></td>
		</tr>
	`

	$(table).append(html)
}



function getTypeSelOption(curRow, type){
	let selOptions = '';
	if(!isEmpty(type)){
		if(type === 'cateType'){
			for (const cateType of cateList) {
				selOptions += `<option value="${cateType.value}" ${!isEmpty(curRow) && curRow.category.toUpperCase() === cateType.value ? 'Selected' : ''}>${cateType.desc}</option> `;
			}
		} else if(type === 'positionType'){
			for (const positionType of positionList) {
				selOptions += `<option value="${positionType.value}" ${!isEmpty(curRow) && curRow.position.toUpperCase() === positionType.value ? 'Selected' : ''}>${positionType.desc}</option> `;
			}
		} else if (type === 'barkingType') {
			for (const barkingType of barkingList) {
				selOptions += `<option value="${barkingType.value}" ${!isEmpty(curRow) && curRow.barkingCode.toUpperCase() === barkingType.value ? 'Selected' : ''}>${barkingType.desc}</option> `;
			}
		}
	}
	return selOptions;
}

function delTableForSchedulerCrewInfoData() {
	const checkList = $("#schedulerCrewInfoData input[name='scheCrewRowChk']:checked")
	$(checkList).each((i, elm) => {
		delRow($(elm).parent())
	})
}

function delRow(elm) {
	const delTr = $(elm).parent();
	const chk = delTr.children().find('input[name=scheCrewRowChk]');

	if(chk.attr('data-flag') != 'D'){
		chk.attr('data-flag', 'D');
		delTr.find('input[type="text"]').css('text-decoration', 'line-through');
		delTr.find('input[type="text"], input[type="date"]').prop('disabled', true);
		delTr.find('select').prop('disabled', true);

	} else{
		if(getFloatVal(chk.attr('data-uid')) > 0){
			chk.attr('data-flag', 'R');
		} else{
			chk.attr('data-flag', 'C');
		}
		delTr.find('input[type="text"]').css('text-decoration', 'none');
		delTr.find('input[type="text"], input[type="date"]').prop('disabled', false);
		delTr.find('select').prop('disabled', false);
	}
}

function saveScheCrewList() {
	const schedulerCrewInfoList = []

	var formData = new FormData();

	$("#schedulerCrewInfoData tr").each((i, elm) => {
		// 필수값 체크 필요
		const flag = $(elm).find("input[name='scheCrewRowChk']").data("flag")
		const uid = $(elm).find("input[name='scheCrewRowChk']").data("uid")
		const category = $(elm).find("select[name='scheCrewCateType']").val()
		const position = $(elm).find("select[name='scheCrewPositionType']").val()
		const company = $(elm).find("input[name='scheCrewCompany']").val()
		const departure = $(elm).find("input[name='scheCrewDeparture']").val()
		const name = $(elm).find("input[name='scheCrewName']").val()
		const rank = $(elm).find("input[name='scheCrewRank']").val()
		const comNum = $(elm).find("input[name='scheCrewComNum']").val()
		const workType = $(elm).find("input[name='scheCrewWorkType']").val()
		const ssNum = $(elm).find("input[name='scheCrewSsNum']").val()
		const tel = $(elm).find("input[name='scheCrewTel']").val()

		formData.append(`schedulerCrewInfoList[${i}].schedulerInfoUid`, scheUid)
		formData.append(`schedulerCrewInfoList[${i}].flag`, flag);
		formData.append(`schedulerCrewInfoList[${i}].uid`, uid);
		formData.append(`schedulerCrewInfoList[${i}].seq`, i + 1);
		formData.append(`schedulerCrewInfoList[${i}].category`, category);
		formData.append(`schedulerCrewInfoList[${i}].position`, position);
		formData.append(`schedulerCrewInfoList[${i}].comNum`, comNum);

		formData.append(`schedulerCrewInfoList[${i}].company`, company);
		formData.append(`schedulerCrewInfoList[${i}].departure`, departure);
		formData.append(`schedulerCrewInfoList[${i}].name`, name);
		formData.append(`schedulerCrewInfoList[${i}].rank`, rank);
		formData.append(`schedulerCrewInfoList[${i}].workType`, workType);

		formData.append(`schedulerCrewInfoList[${i}].ssNum`, ssNum);
		formData.append(`schedulerCrewInfoList[${i}].tel`, tel);

		let count = 0
		$("#schedulerCrewInfoHead th[data-group=\"dateGroup\"]").each((j, head) => {
			const date = $(head).data("date")
			if (date) {
				const barkingCode = $(elm).find(`select[data-date="${date}"]`).val()
				const barkingDate = date
				formData.append(`schedulerCrewInfoList[${i}].schedulerCrewDetailList[${j}].barkingCode`, barkingCode);
				formData.append(`schedulerCrewInfoList[${i}].schedulerCrewDetailList[${j}].barkingDate`, barkingDate);
			}
		})
	})

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/sche/updateScheCrew.html',
		data: formData,
		processData: false,
		contentType: false,
		dataType: "json",
		success: function(data) {
			if(data.result) {
				alertPop($.i18n.t('compUpdate'));
				getSchedulerCrewInfoData()
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

function setFlag(elm){
	const curChk = elm.closest('tr').children().find('[name="scheCrewRowChk"]');

	if(curChk.length > 0){
		// check box의 uid가 있는 지 확인 후 flag 처리
		if(curChk.attr('data-uid') == -1 && curChk.attr('data-flag') != 'C'){
			curChk.attr('data-flag', 'C');
		} else if(curChk.attr('data-uid') != -1 && curChk.attr('data-flag') == 'R'){
			curChk.attr('data-flag', 'U');
		}
	}
}