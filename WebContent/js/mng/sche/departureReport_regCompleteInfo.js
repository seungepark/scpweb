
$(function() {
	initI18n();

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
			namespaces : [ 'share', 'mngDepCompleteReportRegInfo' ],
			defaultNs : 'mngDepCompleteReportRegInfo'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {

	$("#trialMng").addClass("active"); // Left Menu 1depth open
	$("#trialMng ul").css("display", "block"); // Left Menu open
	$("#scheDepart").addClass("current-page"); // Left Menu 2depth open
}

function sumCrew() {

	const shiCnt = document.querySelector("#shiCnt").value ?? 0
	const companyCnt = document.querySelector("#companyCnt").value ?? 0
	const classCnt = document.querySelector("#classCnt").value ?? 0
	const seCnt = document.querySelector("#seCnt").value ?? 0
	const captainCnt = document.querySelector("#captainCnt").value ?? 0
	const passengerCnt = document.querySelector("#passengerCnt").value ?? 0
	const engineerCnt = document.querySelector("#engineerCnt").value ?? 0
	const medicCnt = document.querySelector("#medicCnt").value ?? 0

	document.querySelector("#totalCnt").value = Number(shiCnt) + Number(companyCnt) + Number(classCnt)
		+ Number(seCnt) + Number(captainCnt) + Number(passengerCnt) + Number(engineerCnt) + Number(medicCnt)
}

function applyReportRegInfo() {
	const param = {
		totalCnt : document.querySelector("#totalCnt"),
		shiCnt : document.querySelector("#shiCnt"),
		companyCnt : document.querySelector("#companyCnt"),
		classCnt : document.querySelector("#classCnt"),
		seCnt : document.querySelector("#seCnt"),
		captainCnt : document.querySelector("#captainCnt"),
		passengerCnt : document.querySelector("#passengerCnt"),
		engineerCnt : document.querySelector("#engineerCnt"),
		medicCnt : document.querySelector("#medicCnt"),
		contractSpeed : document.querySelector("#contractSpeed"),
		instruSpeed : document.querySelector("#instruSpeed"),
		hfo : document.querySelector("#hfo"),
		mgo : document.querySelector("#mgo"),
		lng : document.querySelector("#lng"),
		fwd : document.querySelector("#fwd"),
		mid : document.querySelector("#mid"),
		aft : document.querySelector("#aft"),
		reportEtc : document.querySelector("#reportEtc"),
		vibenoiseEtc : document.querySelector("#vibenoiseEtc")
	}

	const majorIssueListParam = {
		testCode: document.querySelectorAll("input[name='testCode']"),
		testItem: document.querySelectorAll("input[name='testItem']"),
		diff: document.querySelectorAll("input[name='diff']"),
		errCode: document.querySelectorAll("input[name='errCode']"),
		reason: document.querySelectorAll("input[name='reason']"),
	}

	const formData = new FormData()
	let index = 0
	Object.keys(param).forEach((key, i) => {

		formData.append(`reportInfoBeanList[${index}].reportKey`, key)
		formData.append(`reportInfoBeanList[${index}].uid`, param[key].getAttribute('data-index'))
		formData.append(`reportInfoBeanList[${index}].reportValue`, param[key].value)
		formData.append(`reportInfoBeanList[${index}].rowIdx`, 0)
		if (param[key].getAttribute('data-flag')) formData.append(`reportInfoBeanList[${index}].flag`, param[key].getAttribute('data-flag'))
		if (param[key].getAttribute('data-report-keytype')) formData.append(`reportInfoBeanList[${index}].reportKeyType`, param[key].getAttribute('data-report-keytype'))

		index ++
	})

	const getRowIndex = (rowIdx) => {
		if (rowIdx === 0) return 0
		const table = document.querySelector("#majorIssueList")
		const rows = table.rows
		let delCount = 0
		for (let i = 0; i < rowIdx; i++) {
			if (rows[i].querySelector("input").getAttribute("data-flag") == 'D') delCount ++
		}

		return delCount
	}

	Object.keys(majorIssueListParam).forEach((listKey, li) => {
		majorIssueListParam[listKey].forEach((d, di) => {
			formData.append(`reportInfoBeanList[${index}].reportKey`, listKey)
			formData.append(`reportInfoBeanList[${index}].uid`, d.getAttribute('data-index'))
			formData.append(`reportInfoBeanList[${index}].reportValue`, d.value)
			formData.append(`reportInfoBeanList[${index}].rowIdx`, di - getRowIndex(di))

			if (d.getAttribute('data-flag')) formData.append(`reportInfoBeanList[${index}].flag`, d.getAttribute('data-flag'))
			if (d.getAttribute('data-report-keytype')) formData.append(`reportInfoBeanList[${index}].reportKeyType`, d.getAttribute('data-report-keytype'))
			index ++
		})
	})

	formData.append("schedulerVersionInfoUid", schedulerVersionInfoUid)

	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/mng/sche/insertDepartureReportRegInfo.html',
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false,
		data: formData,
		success: function(data) {
			window.location.reload(true);
			alertPop($.i18n.t('message.saved'));
			const result = JSON.parse(data)
			Object.keys(param).forEach((key, i) => {
				param[key].setAttribute("data-index", result[`${key}uid`])
			})
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

function addMajorIssue() {
	const table = document.querySelector("#majorIssueList")

	const html = `
		<tr class="even pointer">
			<td class="border text-center"><input type="text" name="testCode" class="form-control" data-index="0" data-report-keytype="majorIssueList" value="" /></td>
			<td class="border text-center"><input type="text" name="testItem" class="form-control" data-index="0" data-report-keytype="majorIssueList" value="" /></td>
			<td class="border text-center"><input type="text" name="diff" class="form-control" data-index="0" data-report-keytype="majorIssueList" value="" /></td>
			<td class="border text-center"><input type="text" name="errCode" class="form-control" data-index="0" data-report-keytype="majorIssueList" value="" /></td>
			<td class="border text-center"><input type="text" name="reason" class="form-control" data-index="0" data-report-keytype="majorIssueList" value="" /></td>
			<td class="border text-center pointer" onClick="delMajorIssue(this)"><i class="fa-solid fa-trash-can"></i>
		</tr>
	`

	table.insertAdjacentHTML("beforeend", html)
}

function delMajorIssue(e) {
	const root = e.closest("tr")
	root.querySelectorAll("td > input").forEach(input => {
		input.setAttribute("data-flag", "D")
	})

	root.style.display = 'none'
}
