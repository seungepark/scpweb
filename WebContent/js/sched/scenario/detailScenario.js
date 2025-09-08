$(function(){
	initI18n();
	init();
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
	      	namespaces: ['share', 'detailScenario'],
	      	defaultNs: 'detailScenario'
	    },
	    resStore: RES_LANG
	}, function () {
		$('body').i18n();
	});
}

function init() {
	initDesign();
	initData();
}

function initData() {
	$('#lngTotal').text(numberFormat(_lngTotal, true, true, true));
	$('#ln2Total').text(numberFormat(_ln2Total, true, true, true));
	$('#margin').text(numberFormat(_margin, true, false, true) + ' ' + _marginCurrency);
	$('#revenue').text(numberFormat(_revenue, false, false, true) + ' ' + _revenueCurrency);
	$('#cost').text(numberFormat(_cost, false, false, true) + ' ' + _costCurrency);
	$('#exRate').text(numberFormat(_exRate, false, true, true));
	
	if(!isNanEmpty(_workTime)) {
		let workTimeHour = 0;
		let workTimeMin = parseInt(_workTime);
		
		if(workTimeMin >= 60) {
			workTimeHour = Math.floor(workTimeMin / 60);
			workTimeMin = workTimeMin % 60;
		}
		
		$('#workTime').text(workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin);
	}else {
		$('#workTime').text('');
	}
	
	let html = '';
	
	for(let i = 0; i < _list.length; i++) {
		let item = _list[i];
		let options = '';
		let workTime = '';
		
		if(item.isOption == 'Y') {
			for(let x = 0; x < _optionList.length; x++) {
				options += '<div class="form-check form-check-inline">' + 
								'<input class="form-check-input" type="checkbox" onclick="return false;" ' + (item.option.includes(_optionList[x]) ? 'checked' : '') + '>' + 
								'<label class="form-check-label">' + _optionList[x] + '</label>' + 
							'</div>';
			}
		}
		
		if(!isNanEmpty(item.workTime)) {
			let workTimeHour = 0;
			let workTimeMin = parseInt(item.workTime);
			
			if(workTimeMin >= 60) {
				workTimeHour = Math.floor(workTimeMin / 60);
				workTimeMin = workTimeMin % 60;
			}
			
			workTime = workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin;
		}
		
		html += '<tr>' +
					'<td class="th-w-120 text-center">' + numberFormat(item.seq, false, false, false) + '</td>' +
					'<td>' + item.desc + '</td>' +
					'<td><div style="width: 100%; height: 100%; border: 1px solid #000000; border-radius: 4px; background-color: #' + item.color + ';"></div></td>' +
					'<td><div class="ws-nowrap">' + options + '</div></td>' +
					'<td class="text-right">' + workTime + '</td>' +
					'<td class="text-right">' + numberFormat(item.lng, true, true, true) + '</td>' +
					'<td class="text-right">' + numberFormat(item.ln2, true, true, true) + '</td>' +
				'</tr>';
	}
	
	if(html != '') {
		$('#list').empty();
		$('#list').append(html);
	}
}

function listDown() {
	let html = '<tr>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.seq') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.desc') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.color') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.option') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.workTime') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.lng') + '&nbsp;&nbsp;&nbsp;</td>' + 
					'<td style="padding: 30px; text-align: center; font-weight: bold;">&nbsp;&nbsp;&nbsp;' + $.i18n.t('list.ln2') + '&nbsp;&nbsp;&nbsp;</td>' + 
				'</tr>';
				
	for(let i = 0; i < _list.length; i++) {
		let item = _list[i];
		let workTime = '';
		
		if(!isNanEmpty(item.workTime)) {
			let workTimeHour = 0;
			let workTimeMin = parseInt(item.workTime);
			
			if(workTimeMin >= 60) {
				workTimeHour = Math.floor(workTimeMin / 60);
				workTimeMin = workTimeMin % 60;
			}
			
			workTime = workTimeHour + ':' + (workTimeMin > 9 ? '' : '0') + workTimeMin;
		}
		
		html += '<tr>' +
					'<td style="text-align: center;">' + numberFormat(item.seq, false, false, false) + '</td>' +
					'<td>' + item.desc + '</td>' +
					'<td style="width: 100%; height: 100%; border: 1px solid #000000; background-color: #' + item.color + ';"> </td>' +
					'<td>' + item.option + '</td>' +
					'<td style="text-align: right;">' + workTime + '</td>' +
					'<td style="text-align: right;">' + numberFormat(item.lng, true, true, true) + '</td>' +
					'<td style="text-align: right;">' + numberFormat(item.ln2, true, true, true) + '</td>' +
				'</tr>';
	}
	
	excelDownloadAll(html, _title + '-' + _shipType + '-' + _projEvent);
}