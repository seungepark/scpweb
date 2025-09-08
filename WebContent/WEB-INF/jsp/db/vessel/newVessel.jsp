<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_VESSEL_W'}">
		<c:set var="P_DB_VESSEL_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_VESSEL_W}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  	<meta charset="utf-8">
  	<meta http-equiv="X-UA-Compatible" content="IE=edge">
  	<meta name="viewport" content="width=device-width, initial-scale=1">

  	<title>Smart Commissioning Platform</title>

  	<!-- jQuery -->
  	<link href="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.css" rel="stylesheet">
  	<!-- Bootstrap -->
  	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-datepicker.min.css" rel="stylesheet">
  	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_1.jsp"%> --%>
				<div class="sec-card">
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="imo"></div>
						<input id="imo" type="text" class="w-100">
					</div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="ship"></div>
						<input id="ship" type="text" class="w-100">
					</div>
					<div class="d-inline-block">
						<div class="lb-title" data-i18n="mmsi"></div>
						<input id="mmsi" type="text" class="w-100">
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="name"></div>
						<input id="name" type="text" class="w-100">
					</div>
					<div class="d-inline-block w_30">
						<div class="lb-title" data-i18n="type"></div>
						<select id="type">
							<option value=""></option>
							<c:forEach var="shiptype" items="${listShip}">
								<option value="${shiptype.val}" >${shiptype.description}</option>
							</c:forEach>
						</select>
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="reg"></div>
						<input id="reg" type="text" class="w-100">
					</div>
					<div class="d-inline-block w_30">
						<div class="lb-title" data-i18n="year"></div>
						<input id="year" type="text" class="bg-transparent w-100" readonly>
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="flag"></div>
						<input id="flag" type="text" class="w-100">
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="gross"></div>
						<input id="gross" type="text" class="w-100">
					</div>
					<div class="d-inline-block w_30">
						<div class="lb-title" data-i18n="dwt"></div>
						<input id="dwt" type="text" class="w-100">
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="loa"></div>
						<input id="loa" type="text" class="w-100">
					</div>
					<div class="d-inline-block w_30">
						<div class="lb-title" data-i18n="draught"></div>
						<input id="draught" type="text" class="w-100">
					</div>
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3 w_30">
						<div class="lb-title" data-i18n="builder"></div>
						<input id="builder" type="text" class="w-100">
					</div>
					<div class="d-inline-block w_30">
						<div class="lb-title" data-i18n="built"></div>
						<input id="built" type="text" class="w-100">
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="insertVessel()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSave"></span>
						</button>
						<a href="${pageContext.request.contextPath}/db/vessel/vessel.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList"></span>
							</button>
						</a>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-datepicker.min.js"></script>
	<!-- Font Awesome -->
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/db/vessel/new_vessel.js"></script>
</body>
</html>
