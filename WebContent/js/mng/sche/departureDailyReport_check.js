
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
			namespaces : [ 'share', 'mngDepDailyReportCheck' ],
			defaultNs : 'mngDepDailyReportCheck'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	
	// drawTitleShape();
	
//	$('.modal-dialog').draggable({handle: '.modal-header'});

	//	$('.modal-dialog').draggable({handle: '.modal-header'});
	$("#trialMng").addClass("active"); // Left Menu 1depth open
	$("#trialMng ul").css("display", "block"); // Left Menu open
	$("#scheDepart").addClass("current-page"); // Left Menu 2depth open
}

function drawTitleShape(){
	const canvas = document.getElementById("titleCanvas");
	const ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "green";
	ctx.strokeStyle = "blue";
	
	ctx.beginPath();
	ctx.moveTo(10, 40);
    ctx.lineTo(800, 40);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.fillRect(100, 25, 200, 15);
    
    ctx.beginPath();
    ctx.arc(600, 40, 10, 0, (Math.PI + (Math.PI * 3) / 2), false);
    ctx.fill();
    
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillText("Sea Trial", 160, 20);
    
    ctx.beginPath();
    ctx.fillText("W/F", 590, 25);
    
    ctx.beginPath();
    ctx.fillText("13 Feb-19 Feb", 150, 61);
    
    ctx.beginPath();
    ctx.fillText("28 Feb", 580, 61);

}

function submitReportInfo() {
	if (confirm('일일보고를 제출 하시겠습니까?')) {
		jQuery.ajax({
			type: 'GET',
			url: contextPath + '/mng/sche/submitDepartureReportInfo.html',
			data: {
				uid: uid
			},
			success: function(data) {
				const response = JSON.parse(data)
				if (response.result) {
					alertPopBack($.i18n.t('message.submit'), () => {
						location.href = `${contextPath}/mng/sche/departureReportScheduleChart.html?uid=${uid}`
					})
				} else {
					alert($.i18n.t('share:tryAgain'));
				}
			},
			error: function(req, status, err) {
				alert($.i18n.t('share:tryAgain'));
			},
			beforeSend: function() {
				$('#loading').css('display', 'block');
			},
			complete: function() {
				$('#loading').css('display', 'none');
			}
		});
	}

}