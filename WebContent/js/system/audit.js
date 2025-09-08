var logPageNo = ""; // 현재 page
var logArr = []; // 로그 목록 Data
var mainSort = "default";
var mainOrder = "desc";

$(function() {
	initI18n();
	init();
	getLogList(logPageNo);
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
			namespaces : [ 'share', 'audit' ],
			defaultNs : 'audit'
		},
		resStore : RES_LANG
	}, function() {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	
	var startDate = new Date();
	startDate.setMonth(startDate.getMonth() - 1);
	var startYear = startDate.getFullYear();
	var startMonth = startDate.getMonth() + 1;
	var startDay = startDate.getDate();
	
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	if(startMonth < 10){
		startMonth = '0' + '' + startMonth;
	}
	
	if(startDay < 10){
		startDay = '0' + '' + startDay;
	}
	
	if(month < 10){
		month = '0' + '' + month;
	}
	
	if(day < 10){
		day = '0' + '' + day;
	}
	
	var startDate = startYear + "-" + startMonth + "-" + startDay;
	var endDate = year + "-" + month + "-" + day;
		
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
	
	$("#info").keypress(function(e) {
		if(e.keyCode === 13) {
			getLogList(1);
		}
	});
	
	$("#desc").keypress(function(e) {
		if(e.keyCode === 13) {
			getLogList(1);
		}
	});
}

function tbMainListSort(sortName, sortOrder, data) {
	mainSort = sortName;
	mainOrder = sortOrder;
	
	getLogList(1);
}

function getLogList(pageNo) {
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	let kind = $("#kind").val();
	let tb = $("#tb").val();
	let info = $("#info").val();
	let desc = $("#desc").val();

	if(isDateFormat(startDate)) {
		if(isDateFormat(endDate)) {
			if(isDueDateFormat(startDate, endDate)) {
				if(pageNo == "") {
					pageNo = 1;
					logPageNo = 1;
				}else {
					logPageNo = pageNo; // 현재 페이지 저장
				}

				$.ajax({
					type : "GET",
					url : contextPath + "/system/log/getAuditList.html",
					dataType : "json",
					headers : {
						"content-type" : "application/json"
					},
					beforeSend : function() {
						$('#loading').css("display", "block");
					},
					complete : function() {
						$('#loading').css('display', "none");
					},
					data : {
						page : pageNo,
						startDate : startDate,
						endDate : endDate,
						kind : kind,
						tb : tb,
						info : info,
						description : desc,
					    sort: mainSort,
					    order: mainOrder
					}
				}).done(
					function(result, textStatus, xhr) {
						if (textStatus == "success") {
							var jsonResult = result.list;
							var text = '';

							logArr.push(result.list);

							for(var i in jsonResult) {
								text += '<tr>';
								text += '  <td class=" ">' + jsonResult[i].date + '</td>';
								text += '  <td class="text-center">' + jsonResult[i].code + '</td>';
								text += '  <td class=" ">' + jsonResult[i].table + '</td>';
								text += '  <td class=" ">' + jsonResult[i].info + '</td>';
								text += '  <td class=" ">' + jsonResult[i].desc + '</td>';
								text += '  <td class=" ">' + jsonResult[i].first + ' ' + jsonResult[i].last + '</td>';
								text += '</tr>';
							}

							$("#getLogList").empty();
							
							if(text == '') {
						    	$("#getLogList").append('<tr><td class="text-center" colspan="6">' + $.i18n.t('share:noList') + '</td></tr>');
						    }else {
							    $("#getLogList").append(text);
						    }

							var perPage = 10;
							var totalPage = Math.ceil(parseInt(result.listCnt) / perPage);
							var startPage = Math.floor((logPageNo - 1) / perPage) * perPage + 1;
							let endPage = startPage + perPage - 1;
							
							if(totalPage <= endPage) {
								endPage = totalPage;
							}
							
							logPaging(endPage, startPage, totalPage);
						}else {
							alertPop($.i18n.t('share:tryAgain'));
						}
					}).fail(function(data, textStatus, errorThrown) {
				});
			}
		}
	}
}

function logPaging(end, start, total) {
	var paging_init_num = parseInt(start);
	var paging_end_num = parseInt(end);
	var total_paging_cnt = parseInt(total);
	var pre_no = parseInt(logPageNo) - 1;
	var next_no = parseInt(logPageNo) + 1;
	var text = '';
	
	if(total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == 0) {
		text += '<div class="pg-prev-inact">&nbsp;</div>';
	}else {
		text += '<div onclick="getLogList(' + pre_no + ');" class="pg-prev">&nbsp;</div>';
	}
	
	for(var k = paging_init_num; k <= paging_end_num; k++) {
		if(parseInt(logPageNo) == k) {
			text += '<div onclick="getLogList(' + k + ');" class="pg-num active">' + k + '</div>';
		}else {
			text += '<div onclick="getLogList(' + k + ');" class="pg-num">' + k + '</div>';
		}
	}
	
	if(total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt) {
		text += '<div class="pg-next-inact">&nbsp;</div>';
	}else {
		text += '<div onclick="getLogList(' + next_no + ');" class="pg-next">&nbsp;</div>';
	}
	
	if(total_paging_cnt == 0) {
		text = '';
	}
	
	$("#pagination").empty();
	$("#pagination").append(text);
}

function auditListDownloadAll() {
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	let kind = $("#kind").val();
	let tb = $("#tb").val();
	let info = $("#info").val();
	let desc = $("#desc").val();

	if(isDateFormat(startDate)) {
		if(isDateFormat(endDate)) {
			if(isDueDateFormat(startDate, endDate)) {
				$.ajax({
					type : "GET",
					url : contextPath + "/system/log/auditListDownloadAll.html",
					dataType : "json",
					headers : {
						"content-type" : "application/json"
					},
					beforeSend : function() {
						$('#loading').css("display", "block");
					},
					complete : function() {
						$('#loading').css('display', "none");
					},
					data : {
						isAll: 'Y',
						startDate : startDate,
						endDate : endDate,
						kind : kind,
						tb : tb,
						info : info,
						description : desc,
					    sort: mainSort,
					    order: mainOrder
					}
				}).done(function(result, textStatus, xhr) {
					if(textStatus == "success") {
						var jsonResult = result.list;
						var text = '<thead>' +
										'<tr class="headings">' +
											'<th class="column-title border">' + $.i18n.t('list.date') + '</th>' +
											'<th class="column-title border text-center">' + $.i18n.t('list.kind') + '</th>' +
											'<th class="column-title border">' + $.i18n.t('list.table') + '</th>' +
											'<th class="column-title border">' + $.i18n.t('list.info') + '</th>' +
											'<th class="column-title border">' + $.i18n.t('list.desc') + '</th>' +
											'<th class="column-title border">' + $.i18n.t('list.by') + '</th>' +
										'</tr>' +
									'</thead>' +
									'<tbody id="getLogList">';
			
						for(var i in jsonResult) {
							text += '<tr class="even pointer">';
							text += '  <td>' + jsonResult[i].date + '</td>';
							text += '  <td>' + jsonResult[i].code + '</td>';
							text += '  <td>' + jsonResult[i].table + '</td>';
							text += '  <td>' + jsonResult[i].info + '</td>';
							text += '  <td>' + jsonResult[i].desc + '</td>';
							text += '  <td>' + jsonResult[i].first + ' ' + jsonResult[i].last + '</td>';
							text += '</tr>';
						}
			
						text += '</tbody>';
						
						excelDownloadAll(text, 'audit_log_list');
					}else {
						alertPop($.i18n.t('share:tryAgain'));
					}
				}).fail(function(data, textStatus, errorThrown) {
					alertPop($.i18n.t('share:tryAgain'));
				});
			}
		}
	}
}
