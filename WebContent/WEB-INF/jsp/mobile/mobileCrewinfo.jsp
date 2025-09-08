<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_RESULT_SCHE_R'}">
		<c:set var="P_RESULT_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_W'}">
		<c:set var="P_RESULT_SCHE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_CREW'}">
		<c:set var="P_RESULT_SCHE_CREW" value="true" />
	</c:if>
</c:forEach>
<c:if test="${(empty P_RESULT_SCHE_R and empty P_RESULT_SCHE_W) or empty P_RESULT_SCHE_CREW}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<title>Smart Commissioning Platform - 승선자 등록</title>
	
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
	
	<style>
		.mobile-container {
			padding: 15px;
			max-width: 100%;
		}
		.mobile-header {
			background: #f8f9fa;
			padding: 15px;
			margin-bottom: 20px;
			border-radius: 8px;
		}
		.mobile-form-group {
			margin-bottom: 15px;
		}
		.mobile-form-label {
			font-weight: 600;
			margin-bottom: 5px;
			color: #495057;
		}
		.mobile-form-control {
			width: 100%;
			padding: 10px;
			border: 1px solid #ced4da;
			border-radius: 4px;
			font-size: 16px;
		}
		.mobile-btn {
			width: 100%;
			padding: 12px;
			margin-bottom: 10px;
			border: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: 500;
		}
		.mobile-btn-primary {
			background-color: #007bff;
			color: white;
		}
		.mobile-btn-secondary {
			background-color: #6c757d;
			color: white;
		}
		.mobile-btn-success {
			background-color: #28a745;
			color: white;
		}
		.mobile-btn-danger {
			background-color: #dc3545;
			color: white;
		}
		.mobile-select {
			width: 100%;
			padding: 10px;
			border: 1px solid #ced4da;
			border-radius: 4px;
			font-size: 16px;
			background-color: white;
		}
		.mobile-checkbox-group {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 5px;
		}
		.mobile-checkbox-item {
			display: flex;
			align-items: center;
			gap: 5px;
		}
		.mobile-radio-group {
			display: flex;
			flex-wrap: wrap;
			gap: 15px;
			margin-top: 5px;
		}
		.mobile-radio-item {
			display: flex;
			align-items: center;
			gap: 5px;
		}
		.mobile-alert {
			padding: 10px;
			margin-bottom: 15px;
			border-radius: 4px;
			display: none;
		}
		.mobile-alert-success {
			background-color: #d4edda;
			border: 1px solid #c3e6cb;
			color: #155724;
		}
		.mobile-alert-danger {
			background-color: #f8d7da;
			border: 1px solid #f5c6cb;
			color: #721c24;
		}
		.mobile-tab-area {
			display: flex;
			overflow-x: auto;
			margin-bottom: 20px;
			border-bottom: 1px solid #dee2e6;
		}
		.mobile-tab {
			padding: 10px 15px;
			white-space: nowrap;
			border-bottom: 2px solid transparent;
			color: #6c757d;
			text-decoration: none;
		}
		.mobile-tab.active {
			color: #007bff;
			border-bottom-color: #007bff;
		}
		.mobile-status {
			display: inline-flex;
			align-items: center;
			gap: 5px;
			padding: 5px 10px;
			border-radius: 20px;
			font-size: 14px;
			font-weight: 500;
		}
		.mobile-status-ongo {
			background-color: #fff3cd;
			color: #856404;
		}
		.mobile-status-arrive {
			background-color: #d1ecf1;
			color: #0c5460;
		}
		.mobile-status-default {
			background-color: #e2e3e5;
			color: #383d41;
		}
	</style>
</head>
<body>
	<div class="mobile-container">
		<!-- 모바일 헤더 -->
		<div class="mobile-header">
			<div class="d-flex justify-content-between align-items-center">
				<h5 class="mb-0">승선자 등록</h5>
				<a href="javascript:void(0)" onclick="goToPCVersion()" class="btn btn-sm btn-outline-secondary">
					<i class="fas fa-desktop"></i> PC버전
				</a>
			</div>
			<div class="mt-2">
				<span class="mobile-status mobile-status-${status eq 'ONGO' ? 'ongo' : status eq 'ARRIVE' ? 'arrive' : 'default'}">
					<i class="fa-solid fa-circle"></i>
					<c:choose>
						<c:when test="${status eq 'ONGO'}">진행중</c:when>
						<c:when test="${status eq 'ARRIVE'}">도착</c:when>
						<c:otherwise>출발</c:otherwise>
					</c:choose>
				</span>
			</div>
		</div>

		<!-- 탭 영역 -->
		<div class="mobile-tab-area">
			<a href="javascript:void(0)" onclick="goToTab('planChart')" class="mobile-tab">간트차트</a>
			<a href="javascript:void(0)" onclick="goToTab('planCrew')" class="mobile-tab active">승선자</a>
			<a href="javascript:void(0)" onclick="goToTab('planInfo')" class="mobile-tab">기본정보</a>
			<a href="javascript:void(0)" onclick="goToTab('planDepartureReport')" class="mobile-tab">보고서</a>
		</div>

		<!-- 알림 메시지 -->
		<div id="mobileAlert" class="mobile-alert"></div>

		<!-- 승선자 등록 폼 -->
		<form id="mobileCrewForm">
			<div class="mobile-form-group">
				<label class="mobile-form-label">구분 *</label>
				<select id="mobileKind" class="mobile-select" required>
					<option value="">구분 선택</option>
					<option value="SHI-A">SHI-기술지원직</option>
					<option value="SHI-B">SHI-생산직</option>
					<option value="SHI-C">SHI-협력사</option>
					<option value="OUTSIDE">외부</option>
				</select>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">회사 *</label>
				<input type="text" id="mobileCompany" class="mobile-form-control" placeholder="회사명 입력" required>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">부서</label>
				<input type="text" id="mobileDepartment" class="mobile-form-control" placeholder="부서명 입력">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">이름 *</label>
				<input type="text" id="mobileName" class="mobile-form-control" placeholder="이름 입력" required>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">직급</label>
				<input type="text" id="mobileRank" class="mobile-form-control" placeholder="직급 입력">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">주민번호</label>
				<input type="text" id="mobileIdNo" class="mobile-form-control" placeholder="주민번호 입력" maxlength="14">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">역할 1 *</label>
				<select id="mobileWorkType1" class="mobile-select" required onchange="setMobileWorkType2(this.value)">
					<option value="">역할 1 선택</option>
					<option value="A">시운전</option>
					<option value="B">생산</option>
					<option value="C">설계연구소</option>
					<option value="D">지원</option>
					<option value="E">외부</option>
				</select>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">역할 2</label>
				<select id="mobileWorkType2" class="mobile-select">
					<option value="">역할 2 선택</option>
				</select>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">정/부</label>
				<div class="mobile-radio-group">
					<div class="mobile-radio-item">
						<input type="radio" id="mobileMainSubN" name="mobileMainSub" value="N" checked>
						<label for="mobileMainSubN">-</label>
					</div>
					<div class="mobile-radio-item">
						<input type="radio" id="mobileMainSubM" name="mobileMainSub" value="M">
						<label for="mobileMainSubM">정</label>
					</div>
					<div class="mobile-radio-item">
						<input type="radio" id="mobileMainSubS" name="mobileMainSub" value="S">
						<label for="mobileMainSubS">부</label>
					</div>
				</div>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">한식/양식</label>
				<div class="mobile-radio-group">
					<div class="mobile-radio-item">
						<input type="radio" id="mobileFoodStyleK" name="mobileFoodStyle" value="K">
						<label for="mobileFoodStyleK">한식</label>
					</div>
					<div class="mobile-radio-item">
						<input type="radio" id="mobileFoodStyleW" name="mobileFoodStyle" value="W">
						<label for="mobileFoodStyleW">양식</label>
					</div>
				</div>
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">인원수</label>
				<input type="number" id="mobilePersonNo" class="mobile-form-control" placeholder="인원수 입력" min="1" value="1">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">연락처</label>
				<input type="tel" id="mobilePhone" class="mobile-form-control" placeholder="연락처 입력">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">승선일</label>
				<input type="date" id="mobileInDate" class="mobile-form-control">
			</div>

			<div class="mobile-form-group">
				<label class="mobile-form-label">하선일</label>
				<input type="date" id="mobileOutDate" class="mobile-form-control">
			</div>

			<!-- 버튼 영역 -->
			<div class="mt-4">
				<button type="submit" class="mobile-btn mobile-btn-success">
					<i class="fas fa-save"></i> 승선자 등록
				</button>
				<button type="button" class="mobile-btn mobile-btn-secondary" onclick="resetMobileForm()">
					<i class="fas fa-undo"></i> 초기화
				</button>
				<button type="button" class="mobile-btn mobile-btn-primary" onclick="goToCrewList()">
					<i class="fas fa-list"></i> 승선자 목록
				</button>
			</div>
		</form>
	</div>

	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	
	<script>
		let _scheUid = "${bean.uid}";
		let _sDate = "${bean.sdate}";
		let _eDate = "${bean.edate}";
		let _status = "${status}";
		
		$(function(){
			initMobileI18n();
			initMobileForm();
			setMobileWorkType2('A'); // 기본값 설정
		});
		
		function initMobileI18n() {
			let lang = initLang();
			
			$.i18n.init({
				lng: lang,
				fallbackLng: FALLBACK_LNG,
				fallbackOnNull: false,
				fallbackOnEmpty: false,
				useLocalStorage: false,
				ns: {
					namespaces: ['share', 'planCrew'],
					defaultNs: 'planCrew'
				},
				resStore: RES_LANG
			}, function() {
				$('body').i18n();
			});
		}
		
		function initMobileForm() {
			// 폼 제출 이벤트
			$('#mobileCrewForm').on('submit', function(e) {
				e.preventDefault();
				saveMobileCrew();
			});
			
			// 오늘 날짜를 기본값으로 설정
			let today = new Date().toISOString().split('T')[0];
			$('#mobileInDate').val(today);
			
			// 기본값 설정
			$('#mobilePersonNo').val(1);
			$('#mobileMainSubN').prop('checked', true);
			$('#mobileFoodStyleK').prop('checked', true);
		}
		
		function setMobileWorkType2(workType1) {
			let workType2Select = $('#mobileWorkType2');
			workType2Select.empty();
			workType2Select.append('<option value="">역할 2 선택</option>');
			
			if (workType1 === 'A') { // 시운전
				workType2Select.append('<option value="A1">시운전 총괄</option>');
				workType2Select.append('<option value="A2">시운전 엔지니어</option>');
				workType2Select.append('<option value="A3">시운전 기술자</option>');
			} else if (workType1 === 'B') { // 생산
				workType2Select.append('<option value="B1">생산 관리</option>');
				workType2Select.append('<option value="B2">생산 기술</option>');
				workType2Select.append('<option value="B3">생산 작업</option>');
			} else if (workType1 === 'C') { // 설계연구소
				workType2Select.append('<option value="C1">설계</option>');
				workType2Select.append('<option value="C2">연구</option>');
				workType2Select.append('<option value="C3">기술개발</option>');
			} else if (workType1 === 'D') { // 지원
				workType2Select.append('<option value="D1">안전</option>');
				workType2Select.append('<option value="D2">품질</option>');
				workType2Select.append('<option value="D3">구매</option>');
			} else if (workType1 === 'E') { // 외부
				workType2Select.append('<option value="E1">감독</option>');
				workType2Select.append('<option value="E2">검사</option>');
				workType2Select.append('<option value="E3">기타</option>');
			}
		}
		
		function saveMobileCrew() {
			// 필수 필드 검증
			if (!$('#mobileKind').val()) {
				showMobileAlert('구분을 선택해주세요.', 'danger');
				return;
			}
			if (!$('#mobileCompany').val()) {
				showMobileAlert('회사를 입력해주세요.', 'danger');
				return;
			}
			if (!$('#mobileName').val()) {
				showMobileAlert('이름을 입력해주세요.', 'danger');
				return;
			}
			if (!$('#mobileWorkType1').val()) {
				showMobileAlert('역할 1을 선택해주세요.', 'danger');
				return;
			}
			
			// 승선자 데이터 구성 (ScheCrewListBean 형식에 맞춤)
			let crewData = {
				uid: _scheUid,
				kind: $('#mobileKind').val(),
				company: $('#mobileCompany').val(),
				department: $('#mobileDepartment').val(),
				name: $('#mobileName').val(),
				rank: $('#mobileRank').val(),
				idNo: $('#mobileIdNo').val(),
				workType1: $('#mobileWorkType1').val(),
				workType2: $('#mobileWorkType2').val(),
				mainSub: $('input[name="mobileMainSub"]:checked').val(),
				foodStyle: $('input[name="mobileFoodStyle"]:checked').val(),
				personNo: $('#mobilePersonNo').val(),
				phone: $('#mobilePhone').val(),
				inOutList: [
					{
						inOutDate: $('#mobileInDate').val(),
						schedulerInOut: 'B'  // 승선
					},
					{
						inOutDate: $('#mobileOutDate').val(),
						schedulerInOut: 'N'  // 하선
					}
				]
			};
			
			// 서버로 데이터 전송 (AJAX 호출)
			$.ajax({
				url: '${pageContext.request.contextPath}/mobile/mobileCrewSave.html',
				type: 'POST',
				data: crewData,
								success: function(response) {
					// 응답이 문자열인 경우 JSON으로 파싱
					if (typeof response === 'string') {
						try {
							response = JSON.parse(response);
						} catch (e) {
							// 파싱 실패 시 기본 응답 처리
							response = { result: 'OK', message: '승선자가 성공적으로 등록되었습니다.' };
						}
					}
					
					if (response.result === 'OK') {
						showMobileAlert('승선자가 성공적으로 등록되었습니다.', 'success');
						// 성공 메시지 표시 후 PC 버전으로 이동
						setTimeout(() => {
							if (confirm('승선자 등록이 완료되었습니다. PC 버전으로 이동하시겠습니까?')) {
								goToPCVersion();
							} else {
								resetMobileForm();
							}
						}, 1000);
					} else {
						showMobileAlert('승선자 등록에 실패했습니다: ' + (response.message || '알 수 없는 오류'), 'danger');
					}
				},
				error: function(xhr, status, error) {
					showMobileAlert('서버 통신 중 오류가 발생했습니다: ' + error, 'danger');
				}
			});
		}
		
		function resetMobileForm() {
			$('#mobileCrewForm')[0].reset();
			$('#mobileWorkType2').empty().append('<option value="">역할 2 선택</option>');
			let today = new Date().toISOString().split('T')[0];
			$('#mobileInDate').val(today);
			$('#mobilePersonNo').val(1);
			$('#mobileMainSubN').prop('checked', true);
			$('#mobileFoodStyleK').prop('checked', true);
			hideMobileAlert();
		}
		
		function goToCrewList() {
			window.location.href = '${pageContext.request.contextPath}/sche/planCrew.html?uid=' + _scheUid;
		}
		
		function goToPCVersion() {
			window.location.href = '${pageContext.request.contextPath}/sche/planCrew.html?uid=' + _scheUid;
		}
		
		function goToTab(tabName) {
			let url = '';
			switch(tabName) {
				case 'planChart':
					url = '${pageContext.request.contextPath}/sche/planChart.html?uid=' + _scheUid;
					break;
				case 'planCrew':
					url = '${pageContext.request.contextPath}/sche/planCrew.html?uid=' + _scheUid;
					break;
				case 'planInfo':
					url = '${pageContext.request.contextPath}/sche/planInfo.html?uid=' + _scheUid;
					break;
				case 'planDepartureReport':
					url = '${pageContext.request.contextPath}/sche/planDepartureReport.html?uid=' + _scheUid;
					break;
				default:
					url = '${pageContext.request.contextPath}/sche/planCrew.html?uid=' + _scheUid;
			}
			window.location.href = url;
		}
		
		function showMobileAlert(message, type) {
			let alertDiv = $('#mobileAlert');
			alertDiv.removeClass().addClass('mobile-alert mobile-alert-' + type);
			alertDiv.text(message).show();
		}
		
		function hideMobileAlert() {
			$('#mobileAlert').hide();
		}
	</script>
</body>
</html>
