var scheRowList = []; //Scheduler Row Data
var scheRowSort = "";
var scheRowOrder = "asc";

$(function(){
	initI18n();
	init();
	
	// getScheChartList();
	getScheRowList(); // scheRowList ajax function
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
    		namespaces: ['share', 'mngDetRowSche'],
    		defaultNs: 'mngDetRowSche'
    	},
    	resStore: RES_LANG
	}, function () {
		$('body').i18n();
    });
}

function init() {
	initDesign();
	
	$('.modal-dialog').draggable({handle: '.modal-header'});
	
	$("#tcnum").keypress(function(e) {
		if(e.keyCode === 13) {
			getScheRowList();
		}
	});
	$("#desc").keypress(function(e) {
		if(e.keyCode === 13) {
			getScheRowList();
		}
	});
	
	// ctype 값이 Schedule 인 경우 dtype 값 초기화 
	$('#ctype').change(function(){
		if(this.value == 'SCHE'){
			$('#dtype').val('ALL').attr('selected', 'selected');
		}
	});
}

function scheRowListSort(sortName, sortOrder, data) {
	scheRowSort = sortName;
	scheRowOrder = sortOrder;
	
	getScheRowList();
}

function getScheRowList(){
	const parentUid = $("#parentUid").val();
	
	const tcnum = $('#tcnum').val();
	const desc = $('#desc').val();
	
	const ctype = $('#ctype').val();
	const dtype = $('#dtype').val();
	const sdate = $('#sdate').val();
	const edate = $('#edate').val();

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
			uid: parentUid,
			tcnum,
			description: desc,
			ctype,
			dtype,
			sdate,
			edate,
			sort: scheRowSort,
			order: scheRowOrder
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			scheRowList = [];
			scheRowList.push(result.list); // scheRowList 배열 담기
			
			for(var i in jsonResult) {
				text +='<tr>';
				
				text +='  <td class="text-center">'+jsonResult[i].category+'</td>';
				text +='  <td class="">'+jsonResult[i].tcnum+'</td>';
				text +='  <td class="">' + jsonResult[i].desc + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].ctype + '</td>';
				text +='  <td class="text-center">' + getLoadRate(jsonResult[i].loadrate, true) + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].sdate + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].stime + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].edate + '</td>';
				text +='  <td class="text-center">' + jsonResult[i].etime + '</td>';
				text +='  <td class="text-center">' + getFloatVal(jsonResult[i].seq) + '</td>';
				text +='  <td class="text-right">' + getFloatVal(jsonResult[i].per) + '</td>';
				
				text +='</tr>';
			}

			$("#getScheRowList").empty();
      
			if(text == '') {
				$("#getScheRowList").append('<tr <td class="text-center" colspan="11">' + $.i18n.t('share:noList') + '</td></tr>');
			}else {
				$("#getScheRowList").append(text);
			}

			const schedule = {
				datas: result.list,
				isGanttChart: false,
				isLineChart: true,
				isEditable: false,
				isPopup: false,
			}

			const mng = new ScheduleManager("scheduleManager", schedule);
			mng.init()

		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {

	});
}

function getScheChartList(){
	let parentUid = $("#parentUid").val();

	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/getScheChartList.html",
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
			search2: 'chart',
			uid: parentUid,
			sort: '',
			order: 'asc'
		}
	}).done(function(result, textStatus, xhr) {
		if(textStatus == "success") {
			var jsonResult = result.list;
			var text = '';
			scheChartList = [];
			scheChartList.push(result.list); // scheChartList 배열 담기
			
			drawChartLineOnly(jsonResult);
			
		}else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}

//approval remark 아이콘 클릭했을대 실행
function apprRemark(uid){
	var targetArr = scheRowList[0].filter(function(arr){
		return arr.uid == uid;
	});
	$("#remarkText").text(targetArr[0].remark);
}

function scheDetRowListDownAll(){
	
	const parentUid = $("#parentUid").val();
	
	const tcnum = $('#tcnum').val();
	const desc = $('#desc').val();
	
	const ctype = $('#ctype').val();
	const dtype = $('#dtype').val();
	const sdate = $('#sdate').val();
	const edate = $('#edate').val();
				
	$.ajax({
		type: "GET",
		url: contextPath + "/mng/sche/scheDetRowListDownAll.html",
		dataType: "json",
		headers: {
			"content-type": "application/json"
		},
		beforeSend:function() {
			$('#loading').css("display","block");
		},
		complete:function() {
			$('#loading').css('display',"none");
		},
		data:{
			isAll: 'Y',
			uid: parentUid,
			tcnum,
			description: desc,
			ctype,
			dtype,
			sdate,
			edate,
			sort: scheRowSort,
			order: scheRowOrder
		}
	}).done(function (result, textStatus, xhr) {
		if(textStatus == "success") {
			let jsonResult = result.list;
			let text = '<thead>' +
				'<tr class="headings">' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.cate') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.tcnum') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.desc') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.ctype') + '</span></div><div class="fht-cell"></div></th>' +					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.loadrate') + '</span></div><div class="fht-cell"></div></th>' +
					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.sdate') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.stime') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.edate') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.etime') + '</span></div><div class="fht-cell"></div></th>' +
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.seq') + '</span></div><div class="fht-cell"></div></th>' +
					
					'<th class="column-title border" style=""><div class="th-inner sortable both"><span>' + $.i18n.t('list.per') + '</span></div><div class="fht-cell"></div></th>' +
				'</tr>' +
			'</thead>' +
			'<tbody id="getScheRowList">';
						
			for(let i in jsonResult) {
				text +='<tr class="even pointer">';
				
				text +='  <td>'+jsonResult[i].category+'</td>';
				text +='  <td>'+jsonResult[i].tcnum+'</td>';
				text +='  <td>'+jsonResult[i].desc+'</td>';
				text +='  <td>'+jsonResult[i].ctype+'</td>';
				text +='  <td>'+getLoadRate(jsonResult[i].loadrate, true)+'</td>';
				
				text +='  <td>'+jsonResult[i].sdate+'</td>';
				text +='  <td>'+jsonResult[i].stime+'</td>';
				text +='  <td>'+jsonResult[i].edate+'</td>';
				text +='  <td>'+jsonResult[i].etime+'</td>';
				text +='  <td>'+getFloatVal(jsonResult[i].seq)+'</td>';
				
				text +='  <td>'+getFloatVal(jsonResult[i].per)+'</td>';
					        
				text +='</tr>';
			}
			
			text += '</tbody>';
						
			excelDownloadAll(text, 'Scheduler_RowData_List');
		} else {
			alertPop($.i18n.t('share:tryAgain'));
		}
	}).fail(function(data, textStatus, errorThrown) {
		alertPop($.i18n.t('share:tryAgain'));
	});
}

function showVsslReqInfo () {
	window.open(contextPath + '/mng/vssl/reportSchedule.html', 'reportSchedule', '');
}



