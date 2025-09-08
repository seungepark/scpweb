<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
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
  <link href="${pageContext.request.contextPath}/css/dbGanttChart.css" rel="stylesheet">
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_0_0.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_0_0.jsp"%>
            <div class="main-container">
            	<div class="d-flex w-100">
            		<div>
            			<div class="dash-info-area bg1 d-flex flex-column">
	            			<div class="flex-fill d-flex align-items-center">
	            				<span id="dataCnt1" class="dash-info-text-lg"></span>
	            				<span id="dataCnt2" class="dash-info-text"></span>&nbsp;
	            				<span class="dash-info-text-sm" data-i18n="cnt"></span>
	           				</div>
	            			<div class="flex-fill d-flex align-items-center">
	            				<div class="dash-info-title" data-i18n="cntTitle"></div>
	            				<div class="ml-auto"><img src="${pageContext.request.contextPath}/img/new/dash_card_icon_01.png"/></div>
	            			</div>
	            		</div>
	            		<div class="sp-12"></div>
	            		<div class="dash-info-area bg2 d-flex flex-column">
	            			<div class="flex-fill d-flex align-items-center">
	            				<span id="dataHour1" class="dash-info-text-lg"></span>
	            				<span id="dataHour2" class="dash-info-text"></span>&nbsp;
	            				<span class="dash-info-text-sm" data-i18n="hour"></span>
	           				</div>
	            			<div class="flex-fill d-flex align-items-center">
	            				<div class="dash-info-title" data-i18n="hourTitle"></div>
	            				<div class="ml-auto"><img src="${pageContext.request.contextPath}/img/new/dash_card_icon_02.png"/></div>
	            			</div>
	            		</div>
            		</div>
            		<div class="flex-grow-1 d-flex dash-ship-area">
            			<div id="dashShipCard" class="d-flex flex-column justify-content-between dash-ship-card-wrap">
            				<div class="dash-ship-card-area dash-ship-card-dock" data-i18n="atSea"></div>
            				<div class="dash-ship-card-area dash-ship-card-quay mt-auto" data-i18n="quay"></div>
            			</div>
            			<div class="sp-w-12">&nbsp;</div>
            			<div class="flex-grow-1">
            				<div id="dashShipList" class="d-flex flex-column justify-content-between dash-ship-list-area-scroll dash-ship-list-area-sm">
	            				<div id="seaList" class="d-flex"></div>
	            				<div id="quayList" class="d-flex"></div>
	            			</div>
            			</div>
            		</div>
            	</div>
            	<div class="sp-16"></div>
            	<div class="dash-sec-chart-card">
            		<div class="d-flex flex-row-reverse">
            			<div class="dash-chart-color-box gast">Gas/T</div>
            			<div class="dash-chart-color-box bunk">LNG Bunk</div>
            			<div class="dash-chart-color-box cold">COLD/T</div>
            			<div class="dash-chart-color-box st">S/T</div>
            			<div class="dash-chart-color-box ac">A/C</div>
            		</div>
            		<div class="sp-4"></div>
            		<div id="dashboardScheduleManager"></div>
            	</div>
            </div>
		</div>
	</div>
  	<script type="text/javascript">
		var authKind = "${authKind}";
	</script>
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
  	  <!-- chartJS -->
  	  <script src="${pageContext.request.contextPath}/vendors/chart/chart.min.js"></script>
  	  <!-- Common and page -->
  	  <script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
      <script src="${pageContext.request.contextPath}/js/common.js"></script>
      <script src="${pageContext.request.contextPath}/js/general/kpi.js"></script>
      <script src="${pageContext.request.contextPath}/js/general/dbGanttChart.js"></script>
</body>
</html>
