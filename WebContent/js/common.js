const FALLBACK_LNG = 'en';
const COOKIE_LNG = 'shiLang';

dateTimeUtc = new Date();
dateTimeLmt = new Date();
dateTimeUtcTimer = null;
dateTimeLmtTimer = null;

dateTimePortUtc = new Date();
dateTimePortLmt = new Date();
dateTimePortUtcTimer = null;
dateTimePortLmtTimer = null;

function initServerCheck() {

}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

function forJsonHtml(str) {
    return str.replace(/\n/gi,'<br/>');
}

function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}

function isOldBrowser() {
	var agent = navigator.userAgent.toLowerCase();
	
	if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
	    return true;
	}else {
	    return false;
	}
}

function isNull(vl, defalutVl) {
	if(vl == null || vl == undefined || vl == 'undefined') {
		return defalutVl;
	}else {
		return vl;
	}
}

function isEmpty(vl) {
	if((vl == null || vl == undefined || vl == 'undefined' || vl == '') && (vl !== 0 && vl !== 0.0)) {
		return true;
	}else {
		return false;
	}
}

function getCurrLang() {
	var lang = navigator.language || navigator.userLanguage;

	if(lang == 'ko' || lang == 'ko-KR') {
		lang = 'ko';
	}else {
		lang = 'en';
	}

	return lang;
}

function getLangOnCk() {
	var lang = null;
	var cookies = document.cookie.split(';');

	for(var i in cookies) {
		if(cookies[i].search(COOKIE_LNG) != -1) {
			lang = decodeURIComponent(jQuery.trim(cookies[i].replace(COOKIE_LNG + '=', '')));
			break;
		}
	}

	return lang;
}

function setLangOnCk(lang) {
	var date = new Date();
	date.setDate(date.getDate() + 365);

	var temp = COOKIE_LNG + '=' + encodeURIComponent(lang) + ';';
	temp += 'Expires=' + date.toUTCString() + '';

	document.cookie = temp;
}

function changeLang(lang) {
	setLangOnCk(lang);

	$.i18n.setLng(lang);
	$('body').i18n();
}

function initLang() {
	var lang = getLangOnCk();

	if(!lang) {
		lang = getCurrLang();
	}

	return lang;
}

function alertPop(desc) {
	$('#alertPopDesc').text(desc);
	$('#alertPop').modal();
}

function alertPopBack(desc, callback) {
	$('#alertPopDesc').text(desc);
	$('#alertPop').modal();

	$('#alertPop button[data-dismiss="modal"]').on("click", function() {
		callback()
	})
}

function alertPopHtml(desc) {
	// <br/>, <br> 있는지 확인
	// 있는 것으로 split
	// 각 배열의 string 길이가 30자 이상인 것이 있으면
	// 큰 사이즈 팝업 띄우기
	let str = '';
	let isExist = false;
	let popId = '#alertPop';
	let popDescId = '#alertPopDesc';
	
	if(!isEmpty(desc)) {
		if(desc.includes('<br/>')) {
			str = '<br/>';
			isExist = true;
		}else if(desc.includes('<br>')) {
			str = '<br>';
			isExist = true;
		}
		
		if(isExist) {
			let arr = desc.split(str);
			let len = 0;
			
			for(let i = 0; i < arr.length; i++) {
				if(arr[i].length > len) {
					len = arr[i].length;
				}
			}
			
			if(len > 30) {
				popId = '#alertPopLg';
				popDescId = '#alertPopDescLg';
			}
		}else {
			if(desc.length > 30) {
				popId = '#alertPopLg';
				popDescId = '#alertPopDescLg';
			}
		}
	}
	
	$(popDescId).html(desc);
	$(popId).modal();
}

function userSetPop() {
	$('#userSetPopNewPw').val('');
	$('#userSetPopNewConfirmPw').val('');
	$('#userSetPop').modal();
}

// 프로필 파일 첨부
function profileFileAdded(input) {
	var isAddFiles = false;
	var addFileText = '';
	
	for(var i = 0; i < input.files.length; i++) {
		isAddFiles = true;
		addFileText += '<div class="chip-obj">' + input.files[i].name + '</div>';
	}
	
	if(isAddFiles) {
		$("#addProfileFile").empty();
		$("#addProfileFile").append('<div class="my-1">' + addFileText + '</div>');
	}
}

function changeUserSet() {
	var newPw = $('#userSetPopNewPw').val();
	var newConfirmPw = $('#userSetPopNewConfirmPw').val();
	var profileFile = $('#profileFile')[0].files;
	
	if(newPw.length != 0 || newConfirmPw.length != 0) {
		if(newPw.length < 4 || newConfirmPw.length < 4) {
			alert($.i18n.t('share:userSetPop.errLength'));
			return;
		}
		
		if(newPw != newConfirmPw) {
			alert($.i18n.t('share:userSetPop.errNoMatch'));
			return;
		}
	}
	
	var formData = new FormData();
	
	formData.append('pw', newPw);
	
	for(var i = 0; i < profileFile.length; i++) {
		formData.append('file', profileFile[i]);
	}
	
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/changeUserSet.html',
		enctype: 'multipart/form-data',
		processData: false,
        contentType: false,
		data: formData,
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.result) {
				$('#userSetPop').modal('hide');
				alert($.i18n.t('share:userSetPop.compChanged'));
				location.href = contextPath;
			}else{
				alert($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			alert($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			$('#loading').css("display","block");
		},
		complete: function() {
			$('#loading').css('display',"none");
		}
	});
}

/// Big ///
/*
function initBigInfo() {
	getBigInfo(true);
	setInterval(getBigInfo, 60000, true);
	setInterval(getBigPos, 60000);
}
*/
/*
function getBigInfo(isLog) {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/big/getBigInfo.html',
		data: {},
		success: function(data) {
			try {
				var json = JSON.parse(data);
				
				if(json.result) {
					var utc = json.beanNav.utc;
					var lmt = json.beanNav.lmt;
					var utcYear = json.beanNav.utcYear;
					var utcMonth = json.beanNav.utcMonth;
					var utcDay = json.beanNav.utcDay;
					var utcTime = json.beanNav.utcTime;
					
					var lat = json.beanNav.lat;
					var lon = json.beanNav.lon;
					var latNs = json.beanNav.latNs;
					var lonEw = json.beanNav.lonEw;
					
					var etlSub = json.beanVoyaging.etlSub;
					var isVoyaging = json.beanVoyaging.isVoyaging;
					
					var portUtc = json.beanSv.utc;
					var portLmt = json.beanSv.lmt;
					var portName = json.beanSv.portName;
					
					var latHour = parseInt(lat);
					var latMin = parseInt((lat - latHour) * 60);
					var latSec = (((lat - latHour) * 60 - latMin) * 60).toFixed(2);
					
					var lonHour = parseInt(lon);
					var lonMin = parseInt((lon - lonHour) * 60);
					var lonSec = (((lon - lonHour) * 60 - lonMin) * 60).toFixed(2);
					
					$('#shipInfoLat').text(latHour + '˚ ' + latMin + "' " + latSec + '" ' + latNs);
					$('#shipInfoLon').text(lonHour + '˚ ' + lonMin + "' " + lonSec + '" ' + lonEw);
					
	//				if(utcYear > 2020) {
	//					if(utcMonth > 0 && utcMonth <= 12) {
	//						if(utcDay > 0 && utcDay <= 31) {
	//							var timeStr = utcTime + '';
	//							var timeHour = timeStr.slice(0, -4);
	//							var timeMin = timeStr.slice(-4, -2);
	//							var timeSec = timeStr.slice(-2);
	//							
	//							if(timeHour == '') {
	//								timeHour = '0';
	//							}
	//							
	//							if(timeMin == '') {
	//								timeMin = '0';
	//							}
	//							
	//							timeHour = parseInt(timeHour);
	//							timeMin = parseInt(timeMin);
	//							timeSec = parseInt(timeSec);
	//							
	//							dateTimeUtc = new Date(utcYear, utcMonth - 1, utcDay, timeHour, timeMin, timeSec, 0);
	//							
	//							if(dateTimeUtcTimer != null) {
	//								clearInterval(dateTimeUtcTimer);
	//							}
	//							
	//							dateTimeUtcTimer = setInterval(updateUtc, 1000);
	//						}
	//					}
	//				}
					
					if(utc.length >= 19) {
						dateTimeUtc = new Date(utc);
						
						if(dateTimeUtcTimer != null) {
							clearInterval(dateTimeUtcTimer);
						}
						
						dateTimeUtcTimer = setInterval(updateUtc, 1000);
					}
					
					if(lmt.length >= 19) {
						dateTimeLmt = new Date(lmt);
						
						if(dateTimeLmtTimer != null) {
							clearInterval(dateTimeLmtTimer);
						}
						
						dateTimeLmtTimer = setInterval(updateLmt, 1000);
					}
					
					if(portUtc.length >= 19) {
						dateTimePortUtc = new Date(portUtc);
						
						if(dateTimePortUtcTimer != null) {
							clearInterval(dateTimePortUtcTimer);
						}
						
						dateTimePortUtcTimer = setInterval(updatePortUtc, 1000);
					}
					
					if(portLmt.length >= 19) {
						dateTimePortLmt = new Date(portLmt);
						
						if(dateTimePortLmtTimer != null) {
							clearInterval(dateTimePortLmtTimer);
						}
						
						dateTimePortLmtTimer = setInterval(updatePortLmt, 1000);
					}
					
					if(isVoyaging == '1' || isVoyaging == 'True') {
						$('#shipInfoFwEng').attr('class','badge badge-secondary font-weight-normal');
						$('#shipInfoStBy').attr('class','badge badge-secondary font-weight-normal');
						$('#shipInfoAtSea').attr('class','badge badge-primary font-weight-normal');
					}else {
						if(etlSub == 40) {
							$('#shipInfoFwEng').attr('class','badge badge-primary font-weight-normal');
							$('#shipInfoStBy').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoAtSea').attr('class','badge badge-secondary font-weight-normal');
						}else if(etlSub == 20) {
							$('#shipInfoFwEng').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoStBy').attr('class','badge badge-primary font-weight-normal');
							$('#shipInfoAtSea').attr('class','badge badge-secondary font-weight-normal');
						}else if(etlSub == 30) {
							$('#shipInfoFwEng').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoStBy').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoAtSea').attr('class','badge badge-primary font-weight-normal');
						}else {
							$('#shipInfoFwEng').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoStBy').attr('class','badge badge-secondary font-weight-normal');
							$('#shipInfoAtSea').attr('class','badge badge-secondary font-weight-normal');
						}
					}
					
					$('#headerServerBigOn').show();
					$('#headerServerBigOff').hide();
					
					//if(isLog) {
					//	insertAuditForBigCheck('ON');
					//}
				}else {
					$('#headerServerBigOn').hide();
					$('#headerServerBigOff').show();
					
					if(isLog) {
						insertAuditForBigCheck('OFF');
					}
				}
			}catch(ex) {
				$('#headerServerBigOn').hide();
				$('#headerServerBigOff').show();
				
				if(isLog) {
					insertAuditForBigCheck('OFF');
				}
			}
		},
		error: function(req, status, err) {
			$('#headerServerBigOn').hide();
			$('#headerServerBigOff').show();
			
			if(isLog) {
				insertAuditForBigCheck('OFF');
			}
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}
*/
/*
function getBigPos() {
	jQuery.ajax({
		type: 'GET',
		url: contextPath + '/big/getBigPos.html',
		data: {},
		success: function(data) {
			var json = JSON.parse(data);
			
			if(json.bean.lat && json.bean.lon) {
				var lat = json.bean.lat;
				var lon = json.bean.lon;
				var latNs = json.bean.latNs;
				var lonEw = json.bean.lonEw;
				
				var latHour = parseInt(lat);
				var latMin = parseInt((lat - latHour) * 60);
				var latSec = (((lat - latHour) * 60 - latMin) * 60).toFixed(2);
				
				var lonHour = parseInt(lon);
				var lonMin = parseInt((lon - lonHour) * 60);
				var lonSec = (((lon - lonHour) * 60 - lonMin) * 60).toFixed(2);
				
				$('#shipInfoLat').text(latHour + '˚ ' + latMin + "' " + latSec + '" ' + latNs);
				$('#shipInfoLon').text(lonHour + '˚ ' + lonMin + "' " + lonSec + '" ' + lonEw);
			}
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}
*/

function updateUtc() {
	dateTimeUtc = new Date(dateTimeUtc.getTime() + 1000);
	var utcYear = dateTimeUtc.getFullYear();
	var utcMonth = dateTimeUtc.getMonth() + 1;
	var utcDate = dateTimeUtc.getDate();
	var utcHour = dateTimeUtc.getHours();
	var utcMin = dateTimeUtc.getMinutes();
	
	if(utcMonth < 10) {
		utcMonth = '0' + '' + utcMonth;
	}
	
	if(utcDate < 10) {
		utcDate = '0' + '' + utcDate;
	}
	
	if(utcHour < 10) {
		utcHour = '0' + '' + utcHour;
	}
	
	if(utcMin < 10) {
		utcMin = '0' + '' + utcMin;
	}
	
	var utcTimeStr = utcHour + ':' + utcMin;
	
	$('#headerUtcTime').text(utcTimeStr);
}
/*
function updateLmt() {
	dateTimeLmt = new Date(dateTimeLmt.getTime() + 1000);
	var lmtYear = dateTimeLmt.getFullYear();
	var lmtMonth = dateTimeLmt.getMonth() + 1;
	var lmtDate = dateTimeLmt.getDate();
	var lmtHour = dateTimeLmt.getHours();
	var lmtMin = dateTimeLmt.getMinutes();
	
	if(lmtMonth < 10) {
		lmtMonth = '0' + '' + lmtMonth;
	}
	
	if(lmtDate < 10) {
		lmtDate = '0' + '' + lmtDate;
	}
	
	if(lmtHour < 10) {
		lmtHour = '0' + '' + lmtHour;
	}
	
	if(lmtMin < 10) {
		lmtMin = '0' + '' + lmtMin;
	}
	
	var lmtDateStr = lmtDate + '/' + lmtMonth + '/' + lmtYear;
	var lmtTimeStr = lmtHour + ':' + lmtMin;
	
	$('#headerLmtDate').text(lmtDateStr);
	$('#headerLmtTime').text(lmtTimeStr);
}
*/
/*
function updatePortUtc() {
	dateTimePortUtc = new Date(dateTimePortUtc.getTime() + 1000);
	var utcYear = dateTimePortUtc.getFullYear();
	var utcMonth = dateTimePortUtc.getMonth() + 1;
	var utcDate = dateTimePortUtc.getDate();
	var utcHour = dateTimePortUtc.getHours();
	var utcMin = dateTimePortUtc.getMinutes();
	
	if(utcMonth < 10) {
		utcMonth = '0' + '' + utcMonth;
	}
	
	if(utcDate < 10) {
		utcDate = '0' + '' + utcDate;
	}
	
	if(utcHour < 10) {
		utcHour = '0' + '' + utcHour;
	}
	
	if(utcMin < 10) {
		utcMin = '0' + '' + utcMin;
	}
	
	var utcDateStr = utcDate + '/' + utcMonth + '/' + utcYear;
	var utcTimeStr = utcHour + ':' + utcMin;
	
	$('#leftUtcDate').text(utcDateStr + ' ' + utcTimeStr);
}
*/
/*
function updatePortLmt() {
	dateTimePortLmt = new Date(dateTimePortLmt.getTime() + 1000);
	var lmtYear = dateTimePortLmt.getFullYear();
	var lmtMonth = dateTimePortLmt.getMonth() + 1;
	var lmtDate = dateTimePortLmt.getDate();
	var lmtHour = dateTimePortLmt.getHours();
	var lmtMin = dateTimePortLmt.getMinutes();
	
	if(lmtMonth < 10) {
		lmtMonth = '0' + '' + lmtMonth;
	}
	
	if(lmtDate < 10) {
		lmtDate = '0' + '' + lmtDate;
	}
	
	if(lmtHour < 10) {
		lmtHour = '0' + '' + lmtHour;
	}
	
	if(lmtMin < 10) {
		lmtMin = '0' + '' + lmtMin;
	}
	
	var lmtDateStr = lmtDate + '/' + lmtMonth + '/' + lmtYear;
	var lmtTimeStr = lmtHour + ':' + lmtMin;
	
	$('#leftLmtDate').text(lmtDateStr + ' ' + lmtTimeStr);
}
*/
function excelDownload(id, title, isCheckBox) {
	var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
	tab_text = tab_text + '<x:Name>Sheet</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
	tab_text = tab_text + "<table border='1px'>";
	
	var exportTable = $('#' + id).clone();
	
	if(isCheckBox) {
		for(var i = 0; i < exportTable[0].rows.length; i++) {
			exportTable[0].rows[i].deleteCell(0);
		}
	}
	
	exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
	
	tab_text = tab_text + exportTable.html();
	tab_text = tab_text + '</table></body></html>';
	
	var data_type = 'data:application/vnd.ms-excel';
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	
	var dateNow = new Date();
	var dateYear = dateNow.getFullYear();
	var dateMonth = dateNow.getMonth() + 1;
	var dateDate = dateNow.getDate();
	
	if(dateYear < 10) dateYear = '0' + '' + dateYear;
	if(dateMonth < 10) dateMonth = '0' + '' + dateMonth;
	if(dateDate < 10) dateDate = '0' + '' + dateDate;
	
	var fileName = title + '_' + dateYear + '-' + dateMonth + '-' + dateDate + '.xls';
	
	//Explorer
	if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if(window.navigator.msSaveBlob) {
			var blob = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
			navigator.msSaveBlob(blob, fileName);
		}
	}else {
		var blob2 = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
		var filename = fileName;
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob2);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}

function excelDownloadAll(exportTable, title) {
	var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
	tab_text = tab_text + '<x:Name>Sheet</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
	tab_text = tab_text + "<table border='1px'>";
	
	tab_text = tab_text + exportTable;
	tab_text = tab_text + '</table></body></html>';
	
	var data_type = 'data:application/vnd.ms-excel';
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	
	var dateNow = new Date();
	var dateYear = dateNow.getFullYear();
	var dateMonth = dateNow.getMonth() + 1;
	var dateDate = dateNow.getDate();
	
	if(dateYear < 10) dateYear = '0' + '' + dateYear;
	if(dateMonth < 10) dateMonth = '0' + '' + dateMonth;
	if(dateDate < 10) dateDate = '0' + '' + dateDate;
	
	var fileName = title + '_' + dateYear + '-' + dateMonth + '-' + dateDate + '.xls';
	
	//Explorer
	if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if(window.navigator.msSaveBlob) {
			var blob = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
			navigator.msSaveBlob(blob, fileName);
		}
	}else {
		var blob2 = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
		var filename = fileName;
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob2);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}

function isDateFormat(date) {
	var datatimeRegexp = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

	if(!datatimeRegexp.test(date)) {
		alertPop($.i18n.t('share:checkDateFormat'));
		return false;
	}else {
		return true;
	}
}

function isDueDateFormat(start, end) {
	if(start == end) {
		return true;
	}else {
		var sDate = new Date(start);
		var eDate = new Date(end);
		
		var day = (eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24);
		
		if(day > 0) {
			return true;
		}else {
			alertPop($.i18n.t('share:checkDueDateFormat'));
			return false;
		}
	}
}

function insertAuditForBigCheck(onOff){
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/audit/insertAuditForBigCheck.html',
		data: {
			remark: onOff
		},
		success: function(data) {
		},
		error: function(req, status, err) {
		},
		beforeSend: function() {
		},
		complete: function() {
		}
	});
}

function autocompleteOff() {
	$('input').attr('autocomplete', 'off');
}

function toPageWithInit(uri) {
	delSearchCookie();
	location.href = uri;
}

function delSearchCookie() {
	const searchKeys = [
		'SK_PAGE', 'SK_SORTNM', 'SK_SORTOD', 
		'SK_CTGR', 'SK_WORK', 'SK_STTS', 'SK_SHIP', 'SK_CODE', 'SK_DESC',
		'SK_CAT', 'SK_CRAFT', 'SK_MAP', 'SK_TEMP', 'SK_SD', 'SK_ED', 'SK_TYPE',
		'SK_TITLE'
	]; 

	let date = new Date();
	date = date.toGMTString();
	
	for(let i = 0; i < searchKeys.length; i++) {
		document.cookie = searchKeys[i] + "=; path=/; expires=" + date + ";";
	}
}

function setSearchCookie(key, vl) {
	let date = new Date();
	date.setDate(date.getDate() + 2);
	document.cookie = key + "=" + encodeURIComponent(vl) + "; path=/; expires=" + date.toGMTString() + ";";
}

function getSearchCookie(key) {
	// let vl = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	// return vl ? decodeURIComponent(vl[2]) : '';
	let cookie = new RegExp(key + '=([^;]*)');
	return cookie.test(document.cookie) ? decodeURIComponent(RegExp.$1) : '';
}

//문자 제거
function removeChar(event) {
    event = event || window.event;
    let keyID = (event.which) ? event.which : event.keyCode;

//    if(keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
    if(keyID == 37 || keyID == 39)
        return;
    else
        //숫자와 소수점만 입력가능
        event.target.value = event.target.value.replace(/[^-\.0-9]/g, "");
}

//콤마 찍기
function setComma(obj) {
    let regx = new RegExp(/(-?\d+)(\d{3})/);
    let bExists = obj.indexOf(".", 0);		//0번째부터 .을 찾는다.
    let strArr = obj.split('.');

    while(regx.test(strArr[0])) {			//문자열에 정규식 특수문자가 포함되어 있는지 체크
        //정수 부분에만 콤마 달기 
        strArr[0] = strArr[0].replace(regx, "$1,$2");		//콤마추가하기
    }

    if(bExists > -1) {
        //. 소수점 문자열이 발견되지 않을 경우 -1 반환
        obj = strArr[0] + "." + strArr[1];
    }else { 			//정수만 있을경우 //소수점 문자열 존재하면 양수 반환 
        obj = strArr[0];
    }

    return obj;			//문자열 반환
}

//input box 콤마달기
function inputNumberFormat(obj) {
    obj.value = setComma(obj.value);
}

function isValidLat(str) {
	// 00 00 00 N
	let re = /^\d{2} \d{2}( \d{2})? [NS]$/gi;
	return re.test(str);
}

function isValidLon(str) {
	// 000 00 00 E
	let re = /^\d{3} \d{2}( \d{2})? [EW]$/gi;
	return re.test(str);
}

function isValidDateTime(str) {
	// 0000-00-00 00:00
	let re = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/g;
	return re.test(str);
}

function isValidDate(str) {
	// 0000-00-00
	let re = /^\d{4}-\d{2}-\d{2}$/g;
	return re.test(str);
}

function isValidTime(str) {
	// 00:00
	let re = /^\d{2}:\d{2}$/g;
	return re.test(str);
}

function removePosMark(str) {
	return str.replaceAll('˚', '').replaceAll("'", '').replaceAll('"', '').replaceAll('&quot;', '');
}

//Date 값을 문자열로 반환
function convertDateToStr(date, type){
	let rtnStr = '';
	const monthStr = (date.getMonth() + 1).toString().padStart(2,'0');  
	const dayStr = date.getDate().toString().padStart(2,'0');
	const hourStr = date.getHours().toString().padStart(2,'0');
	const minStr = date.getMinutes().toString().padStart(2,'0');
	
	if(type == 'T'){
		rtnStr = `${hourStr}:${minStr}`;
	} else if(type == 'D'){
		rtnStr = `${date.getFullYear()}-${monthStr}-${dayStr}`;
	} else{
		rtnStr = `${date.getFullYear()}-${monthStr}-${dayStr} ${hourStr}:${minStr}`;
	}
	
	return rtnStr;
}

// Double 값을 Float 파싱 후 전달
function getFloatVal(val){
	if(isEmpty(val)){
		return '';
	} else{
		return parseFloat(val);
	}
}

//LoadRate 의 값 변환
function getLoadRate(loadrate, isToStr){

	if (loadrate == 0 && isToStr) {
		isEmpty(loadrate)
	}

	if(isEmpty(loadrate)){
		return '';
	}

	let rtnVal = getFloatVal(loadrate);

	if(isToStr){

		if(loadrate == 0){
			rtnVal = 'STOP';
		} else if(loadrate == -25 || loadrate == -50){
			rtnVal = 'ASTERN';
		}
	} else{
		if(!isEmpty(loadrate) && loadrate.trim().toUpperCase() == 'STOP'){
			rtnVal = 0.0;
		} else if(!isEmpty(loadrate) && loadrate.trim().toUpperCase() == 'ASTERN'){
			rtnVal = -50;
		}
	}
	
	return rtnVal;
}

// 두 날짜 사이의 일수.
function getDateDiff(start, end) {
	let sDate = new Date(start);
	let eDate = new Date(end);
	
	let diffDate = (eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24);
	
	if(diffDate < 0) {
		diffDate = 0;
	}
	
	return diffDate;
}

//숫자 입력 (마이너스, 소수점, 콤마)
function numberFormat(val, isMinus, isFloat, isComma) {
  	let str = val;
  	str = str.replace(/[^-\.0-9]/g, '');

  	if(isMinus) {
     	str = chgMinusFormat(str);   
  	}else {
     	str = str.replace('-', '');
  	}
  
  	if(isFloat) {
     	str = chgFloatFormat(str);       
  	}else {
     	if(!isMinus ) {
        	str = str.replace('-', '');
     	}

     	str = str.replace('.', '');

     	if(str.length>1) {
        	str = Math.floor(str);
        	str = String(str);
     	}
  	}
  
  	if(isComma) {
     	let parts = str.toString().split('.');

     	if(str.substring(str.length - 1, str.length) == '.') {
        	str = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") + ".";
     	}else {
        	str = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") + (parts[1] ? "." + parts[1] : "");
     	}
  	}

  	return str;
}

function chgFloatFormat(str){
  	let idx = str.indexOf('.');  

  	if(idx < 0) {  
     	return str;
  	}else if(idx > 0) {
     	let tmpStr = str.substr(idx + 1);   
 
     	if(tmpStr.length>1) {             
        	if(tmpStr.indexOf('.') >= 0) {        
           		tmpStr = tmpStr.replace(/[^\d]+/g, '');                  
           		str = str.substr(0, idx + 1) + tmpStr;
        	}
     	}    
  	}else if(idx == 0) {
        str = '0' + str;
  }
  return str;  
}
  
function chgMinusFormat(str) {
	let idx = str.indexOf('-');

  	if(idx == 0) {
  		let tmpStr = str.substr(idx + 1);

     	if(tmpStr.indexOf('-') >= 0) {
     		tmpStr = tmpStr.replace('-', '');
        	str = str.substr(0, idx + 1) + tmpStr;  
     	}
  	}else if(idx > 0) {
        str = str.replace('-', '');
  	}else if(idx < 0) {
        return str;
  	}
	
	return str;
}

function onPrint(id) {
    const html = document.querySelector('html');
    const printContents = document.getElementById(id).innerHTML;
    const printDiv = document.createElement('DIV');
    printDiv.className = 'print-div';

	html.style.background = '#FFFFFF';
    html.appendChild(printDiv);
    printDiv.innerHTML = printContents;
    document.body.style.display = 'none';
    window.print();
    document.body.style.display = 'block';
    printDiv.style.display = 'none';
	html.style.background = '#F7F7F7';
}

function onPrintPdf(id) {
    html2canvas(document.getElementById(id), {}).then(canvas => {
		window.jsPDF = window.jspdf.jsPDF;
		
        const pdf = new jsPDF({
		  	orientation: 'p',
		  	unit: 'px',
		  	format: [canvas.width, canvas.height]
		});
		
        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height); 
		const pdfData = pdf.output('datauristring');
		const popup = window.open('', '_blank', 'width=' + 600 + ',height=' + 900);

	    if(popup) {
			popup.document.write('<iframe src="' + pdfData + '" style="width:100%; height:100%; border:none;"></iframe>');
	    }
    });
}

function onPrintPdfPage2(id, id2) {
    html2canvas(document.getElementById(id), {}).then(canvas => {
		window.jsPDF = window.jspdf.jsPDF;
		
        const pdf = new jsPDF({
		  	orientation: 'p',
		  	unit: 'px',
		  	format: [canvas.width, canvas.height]
		});
		
        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height); 

		html2canvas(document.getElementById(id2), {}).then(canvas => {
			pdf.addPage();
	        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, canvas.width, canvas.height); 
			const pdfData = pdf.output('datauristring');
			const popup = window.open('', '_blank', 'width=' + 600 + ',height=' + 900);
	
		    if(popup) {
				popup.document.write('<iframe src="' + pdfData + '" style="width:100%; height:100%; border:none;"></iframe>');
		    }
	    });
    });
}

function toastPop(title) {
	$('#toastTitle').text(title);
	$('#toastPop').toast('show');
}

// 디자인 초기화.
function initDesign() {
	let sidebar = document.querySelector('.sidebar-wrap');
    let collapsedSidebar = document.querySelector('.collapsed-sidebar-wrap');
    let contentWrap = document.querySelector('#contentWrap');
    let dashShipList = document.querySelector('#dashShipList');

    collapsedSidebar.addEventListener('mouseenter', (event) => {
        sidebar.style.display = 'block';
        collapsedSidebar.style.display = 'none';
        contentWrap.className = 'content-wrap';

		if(!isEmpty(dashShipList)) {
			dashShipList.classList.remove('dash-ship-list-area-sm');
			dashShipList.classList.add('dash-ship-list-area');
		}
    });

    sidebar.addEventListener('mouseleave', (event) => {
        collapsedSidebar.style.display = 'block';
        sidebar.style.display = 'none';
        contentWrap.className = 'collapsed-content-wrap';

		if(!isEmpty(dashShipList)) {
			dashShipList.classList.remove('dash-ship-list-area');
			dashShipList.classList.add('dash-ship-list-area-sm');
		}
    });
}

// 체크된 행 표시.
function setRowSelected() {
	let chkList = $('input[name=listChk]');
	
	for(let i = 0; i < chkList.length; i++) {
		let tr = chkList[i].parentElement.parentElement;
		tr.classList.remove('active');
		
		if(chkList[i].checked) {
			tr.classList.add('active');
		}
	}
}

// 체크된 행 표시.
function setRowSelectedSetName(name) {
	let chkList = $('input[name=' + name + ']');
	
	for(let i = 0; i < chkList.length; i++) {
		let tr = chkList[i].parentElement.parentElement;
		tr.classList.remove('active');
		
		if(chkList[i].checked) {
			tr.classList.add('active');
		}
	}
}

// 일자 비교
function isDueDateValid(start, end) {
	if(start == end) {
		return true;
	}else {
		let sDate = new Date(start);
		let eDate = new Date(end);
		
		let day = (eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24);
		
		if(day > 0) {
			return true;
		}else {
			return false;
		}
	}
}

function isNanEmpty(vl) {
	if(isEmpty(vl)) {
		return true;
	}else {
		return isNaN(vl);
	}
}

function getMonthStr(month) {
	let str = 'January';
	
	switch(month) {
		case 1: str = 'February'; break;
		case 2 : str = 'March'; break;
		case 3 : str = 'April'; break;
		case 4 : str = 'May'; break;
		case 5 : str = 'June'; break;
		case 6 : str = 'July'; break;
		case 7 : str = 'August'; break;
		case 8 : str = 'September'; break;
		case 9 : str = 'October'; break;
		case 10 : str = 'November'; break;
		case 11: str = 'December'; break;
	}
	
	return str;
}

function diffMinutes(start, end) {
	if(start == end) {
		return 0;
	}else {
		let sDate = new Date(start);
		let eDate = new Date(end);
		
		return (eDate.getTime() - sDate.getTime()) / (1000 * 60);
	}
}

function formatShortDate(str) {
	if(!isEmpty(str) && isValidDate(str)) {
		return str.substring(2);
	}else {
		return str;
	}
}

function formatFullDate(date) {
	if(isEmpty(date)) {
		return '';
	}else {
		let dateYear = date.getFullYear();
		let dateMonth = date.getMonth() + 1;
		let dateDate = date.getDate();
		
		if(dateMonth < 10) dateMonth = '0' + '' + dateMonth;
		if(dateDate < 10) dateDate = '0' + '' + dateDate;
		
		return dateYear + '-' + dateMonth + '-' + dateDate;
	}
}

function getFileIcon(name) {
	let iconPath = contextPath + '/img/new/';
	let temp = name.split('.');
		
	if(!isEmpty(temp) && temp.length > 0) {
		let exe = temp[temp.length - 1].toLowerCase();
		
		if(exe == 'txt') {
			iconPath += 'file_doc.png';
		}else if(exe == 'pdf') {
			iconPath += 'file_doc.png';
		}else if(exe == 'xls' || exe == 'xlsx' || exe == 'csv' || exe == 'xlsm' || exe == 'xlsb' || exe == 'xltm' || exe == 'xlam' || exe == 'xltx') {
			iconPath += 'file_doc.png';
		}else if(exe == 'doc' || exe == 'docx' || exe == 'hwp' || exe == 'hwpt' || exe == 'hwpx') {
			iconPath += 'file_doc.png';
		}else if(exe == 'ppt' || exe == 'pptx') {
			iconPath += 'file_doc.png';
		}else if(exe == 'png' || exe == 'jpg' || exe == 'jpeg' || exe == 'bmp' || exe == 'gif' || exe == 'svg' || exe == 'tif' || exe == 'tiff' || exe == 'psd' || exe == 'ai') {
			iconPath += 'file_img.png';
		}else if(exe == 'zip' || exe == '7z' || exe == 'alz' || exe == 'rar') {
			iconPath += 'file_zip.png';
		}else if(exe == 'avi' || exe == 'mp4' || exe == 'mov' || exe == 'mpeg' || exe == 'mpg' || exe == 'mkv' || exe == 'wmv' || exe == 'asf' || exe == 'flv') {
			iconPath += 'file_video.png';
		}else if(exe == 'mp3' || exe == 'wav' || exe == 'ogg' || exe == 'flac' || exe == 'wma' || exe == 'aif' || exe == 'aiff' || exe == 'aac') {
			iconPath += 'file_audio.png';
		}else if(exe == 'java' || exe == 'class' || exe == 'c' || exe == 'cpp' || exe == 'js' || exe == 'css' || exe == 'jsp' || exe == 'html' || exe == 'htm' || exe == 'py' || exe == 'exe' || exe == 'jar') {
			iconPath += 'file_code.png';
		}else {
			iconPath += 'file_default.png';
		}
	}else {
		iconPath += 'file_default.png';
	}
	
	return iconPath;
}

function isValidTimeForRealTime(str) {
	// 00:00
	// :			값 없음
	// 숫자만	(1~2)	분
	// :숫자(1~2)		분
	// 숫자:			시
	// 숫자:숫자(1~2)	시:분
	
	if(':' == str || 
		/^\d{1,2}$/g.test(str) ||
		/^:\d{1,2}$/g.test(str) ||
		/^\d+:$/g.test(str) ||
		/^\d+:\d{1,2}$/g.test(str)
	) {
		return true;
	}else {
		return false;
	}
}