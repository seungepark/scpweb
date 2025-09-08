<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_VESSEL_R'}">
		<c:set var="P_DB_VESSEL_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_DB_VESSEL_W'}">
		<c:set var="P_DB_VESSEL_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_VESSEL_R and empty P_DB_VESSEL_W}">
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_1.jsp"%> --%>
				<div class="sec-card">
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="imo"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.imo}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="ship"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.shipNum}
						</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="mmsi"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.mmsi}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="name"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.title}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="type"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.shipType}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="reg"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.regOwner}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="year"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.builtDate}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="flag"></span>
						</div>
						<div class="col-md-9 col-sm-12 detail-content-border-b">
							${bean.flag}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="gross"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.grossTon}
						</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="dwt"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.dwt}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="loa"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.loa}
						</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="draught"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.draught}
						</div>
					</div>
					<div class="row">
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="builder"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.builder}
						</div>
						<div class="col-md-3 col-sm-12 detail-label-border-b">
							<span data-i18n="built"></span>
						</div>
						<div class="col-md-3 col-sm-12 detail-content-border-b">
							${bean.builtBy}
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="d-flex flex-row-reverse">
						<c:if test="${P_DB_VESSEL_W}">
							<a href="${pageContext.request.contextPath}/db/vessel/modifyVessel.html?uid=${bean.uid}">
								<button class="bt-obj bt-primary">
									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
									<span data-i18n="btnModify"></span>
								</button>
							</a>
						</c:if>
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
	<script src="${pageContext.request.contextPath}/js/db/vessel/detail_vessel.js"></script>
</body>
</html>
