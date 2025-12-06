/**
 * QR 발송 공통 함수
 * 시운전/앵카링 공통 사용
 */

/**
 * QR 발송 공통 함수
 * @param {Object} options - 옵션 객체
 * @param {String} options.qrType - QR 타입: 'SCH' (시운전) 또는 'AC' (앵카링)
 * @param {Function} options.getTrialKey - trialKey를 가져오는 함수 (예: function() { return $('#ship option:selected').text().trim(); })
 * @param {Function} options.getReceiver - receiver를 가져오는 함수 (tr 요소를 받아서 receiver 반환)
 * @param {Function} options.getContent - content를 생성하는 함수 (item 데이터를 받아서 content 반환)
 * @param {Function} options.getItemName - 항목 이름을 가져오는 함수 (tr 요소를 받아서 이름 반환, 검증 메시지용)
 */
function sendQRSMSCommon(options) {
	// 기본값 설정
	let qrType = options.qrType || 'SCH';
	let getTrialKey = options.getTrialKey || function() { return $('#ship option:selected').text().trim(); };
	let getReceiver = options.getReceiver;
	let getContent = options.getContent;
	let getItemName = options.getItemName || function(tr) { return tr.find('input[name=name]').val() || '항목'; };
	let checkPhoneRequired = options.checkPhoneRequired !== false; // 기본값은 true
	
	// 체크박스 선택 확인
	if($('input[name=listChk]:checked').length === 0) {
		alertPop('QR발송할 항목을 선택해주세요.');
		return;
	}
	
	// trialKey 가져오기
	let trialKey = getTrialKey();
	if(!trialKey || trialKey === '' || trialKey === '선택하세요') {
		alertPop('스케줄번호를 선택해주세요.');
		return;
	}
	
	// 발주 미완료 항목 확인
	let nonOrderedItems = [];
	$('input[name=listChk]:checked').each(function(index, checkbox) {
		let tr = $(checkbox).closest('tr');
		let orderStatusCheckbox = tr.find('input[name=orderStatus]');
		
		if(!orderStatusCheckbox.is(':checked')) {
			let itemName = getItemName(tr);
			nonOrderedItems.push(itemName);
		}
	});
	
	// 발주 미완료 항목이 있으면 팝업 띄우고 리턴
	if(nonOrderedItems.length > 0) {
		let message = '발주 완료되지 않은 항목이 있습니다.\n';
		if(nonOrderedItems.length <= 3) {
			message += '발주 미완료 항목: ' + nonOrderedItems.join(', ');
		} else {
			message += '발주 미완료 항목: ' + nonOrderedItems.slice(0, 3).join(', ') + ' 외 ' + (nonOrderedItems.length - 3) + '건';
		}
		alertPop(message);
		return;
	}
	
	// 발주된 항목 수집 및 검증
	let qrDataList = [];
	let noReceiverItems = [];
	
	$('input[name=listChk]:checked').each(function(index, checkbox) {
		let tr = $(checkbox).closest('tr');
		
		// orderStatus 확인
		let orderStatusCheckbox = tr.find('input[name=orderStatus]');
		if(!orderStatusCheckbox.is(':checked')) {
			return;
		}
		
		// receiver 가져오기
		let receiver = getReceiver ? getReceiver(tr) : tr.find('input[name=phone]').val();
		
		// receiver 검증 (휴대폰번호 체크가 필요한 경우)
		if(checkPhoneRequired) {
			if(!receiver || receiver.trim() === '') {
				let itemName = getItemName(tr);
				noReceiverItems.push(itemName);
				return;
			}
			
			// 휴대폰 번호 형식 정리
			receiver = receiver.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		}
		
		// content 생성
		let itemData = {
			trialKey: trialKey,
			uid: tr.find('input[name=uid]').val(),
			department: tr.find('input[name=department]').val()
		};
		let content = getContent ? getContent(itemData) : (trialKey + '%26' + itemData.uid);
		
		// 필수 데이터 확인
		if(!content || content.trim() === '') {
			return;
		}
		
		qrDataList.push({
			receiver: receiver,
			content: content
		});
	});
	
	// receiver가 없는 항목이 있으면 팝업 띄우고 리턴
	if(checkPhoneRequired && noReceiverItems.length > 0) {
		let message = '휴대폰번호가 없는 항목이 있습니다.\n';
		if(noReceiverItems.length <= 3) {
			message += '휴대폰번호 없음: ' + noReceiverItems.join(', ');
		} else {
			message += '휴대폰번호 없음: ' + noReceiverItems.slice(0, 3).join(', ') + ' 외 ' + (noReceiverItems.length - 3) + '건';
		}
		alertPop(message);
		return;
	}
	
	if(qrDataList.length === 0) {
		alertPop('QR발송할 수 있는 항목이 없습니다.');
		return;
	}
	
	// 확인 메시지
	if(!confirm('선택한 ' + qrDataList.length + '건에게 QR을 발송하시겠습니까?')) {
		return;
	}
	
	// SMS 요청 배열 생성 (BODY 형식)
	let smsRequestArray = [];
	
	qrDataList.forEach(function(item) {
		smsRequestArray.push({
			qrType: qrType,
			receiver: item.receiver,
			content: item.content
		});
	});
	
	$('#loading').css("display","block");
	
	// 컨트롤러를 통해 QR 발송 (JSON 배열로 전송)
	$.ajax({
		url: contextPath + '/crew/crewQRSend.html',
		type: 'POST',
		contentType: 'application/json; charset=UTF-8',
		data: JSON.stringify(smsRequestArray),
		success: function(data) {
			$('#loading').css("display","none");
			
			try {
				let json = typeof data === 'string' ? JSON.parse(data) : data;
				
				if(json.result) {
					let msg = json.msg || 'QR발송이 완료되었습니다.';
					
					// "Read timed out" 체크
					if(msg.indexOf('Read timed out') !== -1 || (json.msg && json.msg.indexOf('Read timed out') !== -1)) {
						msg += '\n [운영]SCP 웹페이지에서만 실행 가능합니다.';
					}
					
					alertPop(msg);
				} else {
					let msg = json.msg || 'QR발송에 실패했습니다.';
					
					// "Read timed out" 체크
					if(msg.indexOf('Read timed out') !== -1 || (json.msg && json.msg.indexOf('Read timed out') !== -1)) {
						msg += '\n [운영]SCP 웹페이지에서만 실행 가능합니다.';
					}
					
					alertPop(msg);
				}
			} catch(ex) {
				console.error('QR발송 응답 파싱 오류:', ex);
				let errorMsg = $.i18n.t('share:tryAgain');
				
				// 응답 데이터에 "Read timed out"이 포함되어 있는지 체크
				if(data && typeof data === 'string' && data.indexOf('Read timed out') !== -1) {
					errorMsg += '\n [운영]SCP 웹페이지에서만 실행 가능합니다.';
				}
				
				alertPop(errorMsg);
			}
		},
		error: function(xhr, status, error) {
			$('#loading').css("display","none");
			console.error('QR발송 요청 실패:', error);
			
			let errorMsg = 'QR발송 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
			
			// timeout 오류 체크
			if(status === 'timeout' || error === 'timeout' || (xhr.responseText && xhr.responseText.indexOf('Read timed out') !== -1)) {
				errorMsg += '\n [운영]SCP 웹페이지에서만 실행 가능합니다.';
			}
			
			alertPop(errorMsg);
		}
	});
}


// 구분 표시명 가져오기 함수 (전역)
function getKindLabelForExcel(value) {
	const kindMap = {
		'S': '직영',
		'H': '협력사',
		'V': '방문객',
		'O': 'Owner/Class'
	};
	return kindMap[value] || value;
}

// 한식/양식 표시명 가져오기 함수 (전역)
function getFoodStyleLabelForExcel(value) {
	const foodStyleMap = {
		'K': '한식',
		'W': '양식(Normal Western)',
		'H': '양식(Halal)',
		'V1': '양식(Veg. fruitarian)',
		'V2': '양식(Veg. vegan)',
		'V3': '양식(Veg. lacto-veg.)',
		'V4': '양식(Veg. ovo-veg.)',
		'V5': '양식(Veg. lacto-ovo-veg.)',
		'V6': '양식(Veg. pesco-veg.)',
		'V7': '양식(Veg. pollo-veg.)',
		'V8': '양식(Veg. flexitarian)'
	};
	return foodStyleMap[value] || value;
}

// 날짜시간 포맷 함수
function formatDateTimeForExcel(dateStr) {
	if(!dateStr || dateStr === '' || dateStr === 'null' || dateStr === null) {
		return '';
	}
	// 문자열로 변환
	dateStr = String(dateStr);
	// 날짜 문자열이 이미 시간 포함인 경우 (YYYY-MM-DD HH:MM:SS 형식)
	if(dateStr.length > 10) {
		// T가 있으면 공백으로 변환
		dateStr = dateStr.replace('T', ' ');
		// 19자리까지만 (YYYY-MM-DD HH:MM:SS)
		if(dateStr.length > 19) {
			dateStr = dateStr.substring(0, 19);
		}
		return dateStr;
	}
	// 날짜만 있는 경우 시간 추가
	if(dateStr.length === 10) {
		return dateStr + ' 00:00:00';
	}
	return dateStr;
}

// 날짜만 포맷 함수 (YYYY-MM-DD)
function formatDateForExcel(dateStr) {
	if(!dateStr || dateStr === '' || dateStr === 'null' || dateStr === null) {
		return '';
	}
	// 문자열로 변환
	dateStr = String(dateStr);
	// 날짜 문자열이 이미 시간 포함인 경우 날짜만 추출
	if(dateStr.length > 10) {
		// T가 있으면 공백으로 변환
		dateStr = dateStr.replace('T', ' ');
		// 날짜 부분만 추출 (YYYY-MM-DD)
		dateStr = dateStr.substring(0, 10);
	}
	// 날짜만 있는 경우 그대로 반환
	if(dateStr.length === 10) {
		return dateStr;
	}
	return dateStr;
}

// 현재일자시간 포맷 함수 (파일명용)
function getCurrentDateTimeForFileName() {
	var dateNow = new Date();
	var year = dateNow.getFullYear();
	var month = String(dateNow.getMonth() + 1).padStart(2, '0');
	var date = String(dateNow.getDate()).padStart(2, '0');
	var hours = String(dateNow.getHours()).padStart(2, '0');
	var minutes = String(dateNow.getMinutes()).padStart(2, '0');
	var seconds = String(dateNow.getSeconds()).padStart(2, '0');
	
	return year + month + date + hours + minutes + seconds;
}

// 날짜 범위 값 가져오기 함수 (공통)
function getDateRangeValues() {
	let startDate = ($('#inDate').val() || '').trim();
	let endDate = ($('#outDate').val() || '').trim();

	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);

	if (!startDate) {
		startDate = todayStr;
		$('#inDate').val(startDate);
	}
	if (!endDate) {
		endDate = todayStr;
		$('#outDate').val(endDate);
	}

	if (startDate > endDate) {
		const temp = startDate;
		startDate = endDate;
		endDate = temp;
		$('#inDate').val(startDate);
		$('#outDate').val(endDate);
	}
	return { startDate, endDate };
}

// 커스텀 파일명을 지원하는 Excel 다운로드 함수
function excelDownloadAllWithCustomFileName(exportTable, fileName) {
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
	
	//Explorer
	if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if(window.navigator.msSaveBlob) {
			var blob = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
			navigator.msSaveBlob(blob, fileName);
		}
	}else {
		var blob2 = new Blob([tab_text], {type: "application/csv;charset=utf-8;"});
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob2);
		elem.download = fileName;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}
