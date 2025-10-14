<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_MAIL_R'}">
		<c:set var="P_DB_MAIL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_MAIL_W'}">
		<c:set var="P_DB_MAIL_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_MAIL_R and empty P_DB_MAIL_W}">
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
  <link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
  <link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
  <link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
  <link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_6.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_6.jsp"%>
            <div class="main-container">
				<div class="tb-area">
					<c:if test="${P_DB_MAIL_W}">
						<div class="d-flex flex-row-reverse">
							<button class="bt-obj bt-primary" onClick="save()">
			                  	<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
			                  	<span data-i18n="btnSave"></span>
			                </button>
							<button class="bt-obj bt-secondary svg" onClick="add()">
			                  	<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
			                  	<span data-i18n="btnAdd"></span>
			                </button>
	                   	</div>
	                </c:if>
                   	<div class="sp-16"></div>
                   	<div class="tb-wrap tb-wrap-height-btn">
	                   	<table class="tb-style">
			                <thead>
				                <tr>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.email"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.name"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.company"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.department"></span></div></th>
				                  	<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.rank"></span></div></th>
				                  	<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.del"></span></div></th>
				                </tr>
			                </thead>
			                <tbody id="tbRowList">
			                	<c:choose>
			                		<c:when test="${not empty list and fn:length(list) > 0}">
			                			<c:forEach var="tc" items="${list}" varStatus="status">
			                				<tr>
			                					<td><input type="text" name="email" value="${tc.email}"></td>
			                					<td><input type="text" name="name" value="${tc.name}"></td>
			                					<td><input type="text" name="company" value="${tc.company}"></td>
			                					<td><input type="text" name="department" value="${tc.department}"></td>
			                					<td><input type="text" name="rank" value="${tc.rank}"></td>
			                					<td><div onclick="delEmail(this)" class="pointer"><i class="fa-solid fa-trash-can"></i></div></td>
			                				</tr>
										</c:forEach>
			                		</c:when>
			                		<c:otherwise>
			                			<tr>
						                	<td class="text-center" colspan="6" data-i18n="share:noList"></td>
						            	</tr>
			                		</c:otherwise>
			                	</c:choose>
			                </tbody>
		              	</table>
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
<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
<!-- Font Awesome -->
<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/sche/mailing.js"></script>
</body>
</html>
