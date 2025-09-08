<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_LOG_R'}">
		<c:set var="P_SYS_LOG_R" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_LOG_R}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_5.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_5.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_5.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.kind"></div>
							<select id="kind" class="">
								<option value="ALL">All</option>
								<option value="C">Create</option>
								<option value="U">Update</option>
								<option value="D">Delete</option>
								<option value="S">System</option>
								<option value="E">Error</option>
							</select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.tb"></div>
							<select id="tb" class="">
								<option value="ALL">All</option>
								<option value="BACKUPDB">BACKUPDB</option>
								<option value="BACKUPFILE">BACKUPFILE</option>
								<option value="BIG">BIG</option>
								<option value="DOMAIN">DOMAIN</option>
								<option value="DOMAININFO">DOMAININFO</option>
								<option value="SHIPINFO">SHIPINFO</option>
								<option value="USERINFO">USERINFO</option>
							</select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.info"></div>
							<input id="info" type="text" class="">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.desc"></div>
							<input id="desc" type="text" class="">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.startDate"></div>
							<input id="startDate" type="date" class="">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.endDate"></div>
							<input id="endDate" type="date" class="">
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="getLogList(1)">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.search"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
                   		<button class="bt-obj bt-primary" onClick="auditListDownloadAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px"></button>
                   	</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap">
                    	<table id="tbMainList" class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.date"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.kind"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.table"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.info"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.by"></span></div></th>
								</tr>
							</thead>
							<tbody id="getLogList">
								<tr>
									<td class="text-center" colspan="6" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
                    </div>
                    <div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
                </div>
            </div>
		</div>
	</div>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
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
	<script src="${pageContext.request.contextPath}/js/system/audit.js"></script>
</body>
</html>
