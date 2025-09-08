// 상태 변경 팝업.
function showChangeStatusPop() {
	if(_status != 'ONGO' || (isEmpty(_ongoMin) || _ongoMin > 60)) {
		alertPop($.i18n.t('share:changeStatusPop.changeStatus'));
		return;
	}
	
	$('#changeStatusPop').modal();
}

// 상태 변경.
function changeStatus() {
	jQuery.ajax({
		type: 'POST',
		url: contextPath + '/sche/changeStatus.html',
		data: {
			uid: _scheUid
		},
		success: function(data) {
			try {
				let json = JSON.parse(data);
			
				if(json.result) {
					$('#changeStatusPop').modal('hide');
					alertPopBack($.i18n.t('share:changeStatusPop.compChange'), function() {
						location.href = contextPath + '/sche/scheChart.html?uid=' + _scheUid;
					});
				}else{
					let code = json.code;
				
					if(code == 'DEPART' || code == 'ARRIVE') {
						_status = code;
						toastPop($.i18n.t('share:changeStatusPop.changeStatus'));
					}else if(code == 'EOO') {
						_ongoMin = 61;
						toastPop($.i18n.t('share:changeStatusPop.changeStatus'));
					}else {
						toastPop($.i18n.t('share:tryAgain'));
					}
				}
			}catch(ex) {
				toastPop($.i18n.t('share:tryAgain'));
			}
		},
		error: function(req, status, err) {
			toastPop($.i18n.t('share:tryAgain'));
		},
		beforeSend: function() {
			loadingOverlay.activate();
		},
		complete: function() {
			loadingOverlay.cancelAll();
		}
	});
}