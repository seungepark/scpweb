<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_SYS_CRON_R'}">
		<c:set var="P_SYS_CRON_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_SYS_CRON_W'}">
		<c:set var="P_SYS_CRON_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_SYS_CRON_R and empty P_SYS_CRON_W}">
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
  	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
  	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_5_6.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_5_6.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_5_6.jsp"%> --%>
				<div class="sec-card">
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b ">
							<span data-i18n="cron">Cron</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.cronid}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b ">
							<span data-i18n="desc">Description</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.description}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b ">
							<span data-i18n="status">Status</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.status}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b ">
							<span data-i18n="freq">Frequency</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.frequency}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="cronclass">Class</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.cronclass}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="lastrundt">Last Run Date</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.lastrundate}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b ">
							<span data-i18n="runcnt">Run Count</span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b ">
							${bean.runcnt}
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<c:if test="${P_SYS_CRON_W}">
							<a href="${pageContext.request.contextPath}/db/cron/modifyCron.html?uid=${bean.uid}">
								<button class="bt-obj bt-primary">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="btnModify"></span>
								</button>
							</a>
						</c:if>
						<a href="${pageContext.request.contextPath}/db/cron/cron.html">
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
	<script src="${pageContext.request.contextPath}/js/db/cron/detail_cron.js"></script>
</body>
</html>
