<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_R'}">
		<c:set var="P_PLAN_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="P_PLAN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_PLAN_SCHE_R and empty P_PLAN_SCHE_W}">
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
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-datepicker.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/ssLineGanttChart.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_1.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_1_1.jsp"%> --%>
				<div class="tab-area">
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/mng/sche/detailRowScheduler.html?uid=${bean.uid}" data-i18n="tab.row"></a></div>
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/mng/sche/detailChartScheduler.html?uid=${bean.uid}" data-i18n="tab.chart"></a></div>
                </div>
                <div class="sec-card">
                	<div class="row">
						<div class="col">
							<div class="d-flex chart-search-btn-area">
								<div class="input-wrap mg-r-4">
                    				<input id="chartSearchInput" type="text" placeholder="" data-i18n="[placeholder]chartBtnSearch">
                    				<button id="chartSearchBtn"><img src="${pageContext.request.contextPath}/img/new/search.png"></button>
                				</div>
                				<button id="chartSearchBtnPrev" class="bt-obj bt-secondary"><img src="${pageContext.request.contextPath}/img/new/arrow_l.png" class="bt-icon"><span data-i18n="chartBtnPrev"></span></button>
                				<button id="chartSearchBtnNext" class="bt-obj bt-secondary"><span data-i18n="chartBtnNext"></span><img src="${pageContext.request.contextPath}/img/new/arrow_r.png" class="bt-icon-end"></button>
								<div class="flex-grow-1 d-flex align-items-center ml-2"><div id="chartSearchMsg"></div></div>
								<c:if test="${P_PLAN_SCHE_W}">
									<c:choose>
										<c:when test="${bean.isOff eq 'Y'}">
											<button class="bt-obj bt-primary" disabled>
												<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
												<span data-i18n="btnModify"></span>
											</button>
										</c:when>
										<c:otherwise>
											<a href="${pageContext.request.contextPath}/mng/sche/modifyScheduler.html?uid=${bean.uid}">
												<button class="bt-obj bt-primary">
													<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px">
													<span data-i18n="btnModify"></span>
												</button>
											</a>
										</c:otherwise>
									</c:choose>
								</c:if>
								<button class="bt-obj bt-primary" onClick="viewReport()">
									<img src="${pageContext.request.contextPath}/img/i_btn_report.svg" class="bt-icon" height="16px">
									<span data-i18n="btnScheduleTable"></span>
								</button>
<%-- 								<button class="bt-obj bt-primary" onclick="reVisionSchedule(${bean.uid})"> --%>
<%-- 									<img src="${pageContext.request.contextPath}/img/i_btn_modify.svg" class="bt-icon" height="16px"> --%>
<!-- 									<span data-i18n="btnDepartureReport"></span> -->
<!-- 								</button> -->
								<a href="${pageContext.request.contextPath}/mng/sche/scheduler.html">
									<button class="bt-obj bt-primary">
										<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
										<span data-i18n="btnList"></span>
									</button>
								</a>
							</div>
							<div class="x_content" id="chartPanel">
								<!-- Parent Data List  START-->
								<div>
									<input type="hidden" id="parentUid" value="${bean.uid}"/>
									<input type="hidden" id="parentPeriod" value="${bean.period}"/>
									<input type="hidden" id="parentSdate" value="${bean.sdate}"/>
									<input type="hidden" id="parentEdate" value="${bean.edate}"/>
									<input type="hidden" id="shiptype" value="${bean.shiptype}"/>
									<input type="hidden" id="hullnum" value="${bean.hullnum}"/>
								</div>
								<!-- Parent Data List  END-->
								<div class="row" style="display: block;" id="scheduleManager"></div>
							</div>
						</div>
					</div>
                </div>
            </div>
		</div>
	</div>
	<!-- The Tooltip-->
	<div id="chartTooltip" class="tooltip"></div>

	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>

	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-datepicker.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/ssLineGanttChart.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/detail_draw_charts.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/detail_chart_scheduler.js"></script>
</body>
</html>
