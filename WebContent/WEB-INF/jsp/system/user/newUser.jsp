<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_USER_W'}">
		<c:set var="P_SYS_USER_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_USER_W}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Smart Commissioning Platform</title>

<!-- jQuery -->
<link href="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.css" rel="stylesheet">
<!-- Bootstrap -->
<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-treeview.min.css" rel="stylesheet">
<!-- Font Awesome -->
<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_2.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_2.jsp"%> --%>
				<div class="sec-card">
					<div class="lb-title" data-i18n="userId"></div>
					<input id="userId" type="text" value="${bean.userId}">
					<div class="sp-16"></div>
					<div class="d-inline-block mr-3">
						<div class="lb-title" data-i18n="firstName"></div>
						<input id="firstName" type="text" value="${bean.firstName}">
					</div>
					<div class="d-inline-block">
						<div class="lb-title" data-i18n="lastName"></div>
						<input id="lastName" type="text" value="${bean.lastName}">
					</div>
					<div class="sp-16"></div>
					<div class="lb-title" data-i18n="craft"></div>
					<select id="posCode">
						<c:forEach var="item" items="${listPos}">
							<option value="${item.code}">${item.codeName}</option>
						</c:forEach>
					</select>
					<div class="sp-16"></div>
					<div class="lb-title" data-i18n="workGroup"></div>
					<select id="workGroup">
						<option value="0">--</option>
						<c:forEach var="item" items="${listGroup}">
							<option value="${item.uid}">${item.groupName} (${item.description})</option>
						</c:forEach>
					</select>
					<div class="sp-16"></div>
					<div class="lb-title" data-i18n="status"></div>
					<select id="status">
						<option value="ACT">Active</option>
						<option value="INACT">Inactive </option>
					</select>
					<div class="sp-16"></div>
					<div class="lb-msg" data-i18n="msg"></div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="insertUser()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSave"></span>
						</button>
						<a href="${pageContext.request.contextPath}/system/user.html">
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
	<script type="text/javascript">
		let authKind = "${authKind}";
		let userShipUid = "${userInfo.shipInfoUid}";
	</script>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-treeview.min.js"></script>
	<!-- Font Awesome -->
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/system/new_user.js"></script>
</body>
</html>
