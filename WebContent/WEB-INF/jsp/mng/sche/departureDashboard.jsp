<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
  <c:if test="${at eq 'P_MNG_DEPRPT'}">
    <c:set var="P_MNG_DEPRPT" value="true" />
  </c:if>
</c:forEach>
<c:if test="${empty P_MNG_DEPRPT}">
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
  <style>
    #dropArea {
      width: 430px;
      height: 200px;
      border: 2px dashed #ccc;
      text-align: center;
      padding: 50px;
      margin: 12px auto;
      cursor: pointer;
    }

    #fileInput {
      display: none;
    }

    #fileList {
      margin-top: 20px;
    }
  </style>
</head>

<body class="nav-md">
<div class="container body">
  <div class="main_container">
    <div id="includeLeft"></div>

    <!-- top navigation -->
    <div id="includeHeader"></div>
    <!-- /top navigation -->

    <!-- page content -->
    <div class="right_col" role="main">
      <div class="row">
        <div class="col-xl-12 col-lg-12">
          <div class="page-title">
            <div class="x_content">
              <h3 class="g_text_primary font-weight-bold my-0">${bean.hullnum} / ${bean.shiptype} <c:if test="${not empty bean.description}"> / ${bean.description} </c:if></h3>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="x_content">
            <div class="btn-toolbar" role="toolbar" aria-label="Status button groups">
              <div class="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" class="btn btn-primary" style="cursor: default;">Departure</button>
              </div>
              <div class="btn-group mr-2" role="group" aria-label="Second group">
                <button type="button" class="btn btn-primary" disabled="disabled">On Going</button>
              </div>
              <div class="btn-group" role="group" aria-label="Third group">
                <button type="button" class="btn btn-primary" disabled="disabled">Arrival</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="x_content">
            <ul class="nav nav-tabs bar_tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportScheduleChart.html?uid=${bean.uid}" role="tab" aria-selected="false"><span data-i18n="depChart">Schedule Chart</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReport.html?uid=${bean.uid}" role="tab" aria-selected="false"><span data-i18n="regCrew">Crew Registration</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegInfo.html?uid=${bean.uid}" role="tab" aria-selected="false">  &nbsp; <span data-i18n="regInfo">Info Registration</span> &nbsp;</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depRpt">Departure Report</span> &nbsp;</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="x_panel">


          </div>
        </div>
      </div>
      <div id="includeFooter"></div>
    </div>
  </div>
  <!-- /footer content -->
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
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script>

</script>
<script src="${pageContext.request.contextPath}/js/mng/sche/departure_dashboard.js"></script>
</body>
</html>
