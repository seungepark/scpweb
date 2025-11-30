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

