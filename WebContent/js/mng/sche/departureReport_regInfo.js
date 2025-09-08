
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
			namespaces : [ 'share', 'mngDepReport' ],
			defaultNs : 'mngDepReport'
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
		commanderName : document.querySelector("#commanderName"),
		commanderTel : document.querySelector("#commanderTel"),
		subCommanderName : document.querySelector("#subCommanderName"),
		subCommanderTel : document.querySelector("#subCommanderTel"),
		masterName : document.querySelector("#masterName"),
		masterTel : document.querySelector("#masterTel"),
		pilotName : document.querySelector("#pilotName"),
		pilotTel : document.querySelector("#pilotTel"),
		admiralName : document.querySelector("#admiralName"),
		admiralTel : document.querySelector("#admiralTel"),
		designName : document.querySelector("#designName"),
		designTel : document.querySelector("#designTel"),
		qmName : document.querySelector("#qmName"),
		qmTel : document.querySelector("#qmTel"),
		sbEtc : document.querySelector("#sbEtc"),
		totalCnt : document.querySelector("#totalCnt"),
		shiCnt : document.querySelector("#shiCnt"),
		companyCnt : document.querySelector("#companyCnt"),
		classCnt : document.querySelector("#classCnt"),
		seCnt : document.querySelector("#seCnt"),
		captainCnt : document.querySelector("#captainCnt"),
		passengerCnt : document.querySelector("#passengerCnt"),
		engineerCnt : document.querySelector("#engineerCnt"),
		medicCnt : document.querySelector("#medicCnt"),
		totalITP : document.querySelector("#totalITP"),
		seaShedITP : document.querySelector("#seaShedITP"),
		outFitITP : document.querySelector("#outFitITP"),
		totalPunch : document.querySelector("#totalPunch"),
		seaShedPunch : document.querySelector("#seaShedPunch"),
		outFitPunch : document.querySelector("#outFitPunch"),
		hfo : document.querySelector("#hfo"),
		mgo : document.querySelector("#mgo"),
		lng : document.querySelector("#lng"),
		fwd : document.querySelector("#fwd"),
		mid : document.querySelector("#mid"),
		aft : document.querySelector("#aft"),
		reportEtc : document.querySelector("#reportEtc")
	}

	const formData = new FormData()

	Object.keys(param).forEach((key, i) => {
		formData.append(`reportInfoBeanList[${i}].reportKey`, key)
		formData.append(`reportInfoBeanList[${i}].uid`, param[key].getAttribute('data-index'))
		formData.append(`reportInfoBeanList[${i}].reportValue`, param[key].value)
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
