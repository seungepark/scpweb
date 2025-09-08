<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="P_PLAN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_PLAN_SCHE_W}">
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
	<link href="${pageContext.request.contextPath}/vendors/jquery/jquery.timepicker.min.css" rel="stylesheet">
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-datepicker.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
	<style>
		.ui-timepicker-container {
			z-index:1151 !important;
		}
	</style>
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_1.jsp"%>
            <div class="main-container">
<%--             	<%@ include file="/WEB-INF/jsp/include/menu/bread_1_1.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-xl-4 col-lg-6 col-md-12">
							<div class="lb-title" data-i18n="hullnum"></div>
							<div class="input-wrap mg-r-4">
                   				<input id="hullnum" type="text" readonly>
                   				<button onClick="searchHullnum()"><img src="${pageContext.request.contextPath}/img/new/search.png"></button>
               				</div>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12">
							<div class="lb-title" data-i18n="shipType"></div>
							<select id="shiptype" class="" onchange="getSchedCodeList(true)">
								<option value=""  />
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}">${shiptype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12">
							<div class="lb-title" data-i18n="schedtype"></div>
							<select id="schedtype" class="" onchange="getSchedCodeList(true)"> 
								<option value=""  />
								<c:forEach var="schedtype" items="${listschedtype}">
									<option value="${schedtype.val}">${schedtype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-xl-2 col-lg-6 col-md-12 ">
							<div class="lb-title" data-i18n="schedCodeList"></div>
							<div class="d-flex">
								<select id="schedCodeList" class="" onchange="getSchedCodeDetailList()">
									<option value=""  />
								</select>
							</div>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="row">
						<div class="col-xl-2 col-lg-6 col-md-12">
							<div class="lb-title" data-i18n="sdate"></div>
							<input id="sdate" type="date" class="">
						</div>
						<div class="col-xl-2 col-lg-6 col-md-12">
							<div class="lb-title" data-i18n="edate"></div>
							<input id="edate" type="date" class="">
						</div>
						<div class="col-xl-3 col-lg-4 col-md-12">
							<div class="lb-title" data-i18n="department"></div>
							<input id="dept" type="text" class="" >
						</div>
						<div class="col-xl-3 col-lg-4 col-md-12">
							<div class="lb-title" data-i18n="desc"></div>
							<input id="desc" type="text" class="">
						</div>
						<div class="col-xl-2 col-lg-4 col-md-12">
							<div class="lb-title" data-i18n="pic"></div>
							<input id="pic" type="text" class="" value="${bean.firstName} ${bean.lastName}" disabled>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-wrap flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="insertSchedule()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSave"></span>
						</button>
						<a href="${pageContext.request.contextPath}/mng/sche/scheduler.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList"></span>
							</button>
						</a>
						<button class="bt-obj bt-secondary svg" onClick="addSchedule()">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="btnAdd"></span>
						</button>
						<button class="bt-obj bt-secondary svg" onClick="setAllDateTime()">
							<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSetDT"></span>
						</button>
						<button class="bt-obj bt-secondary svg" onClick="setConvDateBtn()">
							<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSetConvDT">Set Conv Date Time</span>
						</button>
						<button class="bt-obj bt-secondary svg" onClick="searchSchedule()">
							<img src="${pageContext.request.contextPath}/img/i_logout.svg" class="bt-icon" height="16px">
							<span data-i18n="btnLoad"></span>
						</button>
                   	</div>
                   	<div class="sp-16"></div>
					<div id="tbWrap" class="tb-wrap scroll-area-sche">
						<table id="tbNewSchedulerList"  class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.cate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.tcnum"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.ctype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.dtype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sdate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.stime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.edate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.etime"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.per"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.readTm"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sametcnum"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content">&nbsp;</span></div></th>
								</tr>
							</thead>
							<tbody id="scheduleList"></tbody>
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- TCnum Search Modal Start -->
  	<div class="modal fade" id="search_tcnum_modal" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchTcPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchTcPop.tcnum"></div>
        					<input id="searchTcPopTcnum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchTcPop.desc"></div>
        					<input id="searchTcPopDesc" type="text">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchTcPopSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchTcPop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
        				<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.dtype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.ctype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.load"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.per"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchTcPop.readytm"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchTcPopList"></tbody>
						</table>
        			</div>
        			<div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchTcPop.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- TCnum Search Modal End -->

	<!-- Vessel Request info Modal Start -->
	<div class="modal fade" id="vssl_req_info_modal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="vsslRepInfoPop.title"></h5>
				</div>
				<div class="modal-body">
					<div class="d-flex flex-row-reverse pop-op-area">
       					<button class="bt-obj bt-primary" onclick="addVesselReqInfoDet()">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="btnAdd"></span>
						</button>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
        				<table id="tbModVesselReqInfoDetList" class="tb-style">
							<thead>
	         					<tr>
			           				<th class="th-w-120"><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.seq"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.title"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.item"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.unit"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.name"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.rpm"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="vsslRepInfoPop.list.loadrate"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content">&nbsp;</span></div></th>
	         					</tr>
							</thead>
							<tbody id="getVesselReqInfoDetList">
								<tr>
									<td class="text-center" colspan="8" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
        			</div>
				</div>
				<div class="modal-footer">
					<div id="vsslReqInfoModalMsg" class="text-danger pr-3"></div>
					<button class="bt-obj bt-primary" onclick="saveVesselReqInfo()" data-i18n="btnSave"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Vessel Request info Modal Start -->

	<!-- Search schedule Modal Start -->
	<div class="modal fade" id="search_schedule_modal" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchSchePop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchSchePop.hullNum"></div>
        					<input id="searchSchePopHullNum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchSchePop.shipType"></div>
        					<select id="searchSchePopShipType" class="">
								<option value="ALL" data-i18n="searchSchePop.typeAll"></option>
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}">${shiptype.description}</option>
								</c:forEach>
							</select>
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchSchePopSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchSchePop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content">&nbsp;</span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.shipType"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.hullnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.trialKey"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.pic"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.department"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.sdate"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchSchePop.list.edate"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchSchePop.list.status"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchschedulelist">
								<tr>
									<td class="text-center" colspan="10" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="sp-16"></div>
                    <div class="pg-area" id="paginationforsearchsche"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="btnClose"></button>
					<button class="bt-obj bt-primary" onclick="getScheDetail()" data-dismiss="modal" data-i18n="btnConfirm"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Search schedule info Modal Start -->
	
	<!-- Hullnum Search Modal Start -->
  	<div class="modal fade" id="search_hullnum_modal" tabindex="-1" role="dialog" aria-labelledby="search_hullnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchHullnumPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchHullnumPop.shipType"></div>
        					<select id="searchHullPopShiptype" class="">
								<option value=""  />
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}">${shiptype.description}</option>
								</c:forEach>
							</select>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchHullnumPop.hullNum"></div>
        					<input id="searchHullPopHullnum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchHullnumPop.desc"></div>
        					<input id="searchHullPopDesc" type="text">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchHullPopSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchHullnumPop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchHullnumPop.imo"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchHullnumPop.hullNum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchHullnumPop.desc"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchHullnumPop.shipType"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchHullPopList"></tbody>
						</table>
					</div>
					<div class="sp-16"></div>
                    <div class="pg-area" id="searchHullPop-pagination"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchHullnumPop.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Hullnum Search Modal End -->
	
	<!-- Conv Date Input Modal Start -->
	<div class="modal fade" id="set_conv_modal" tabindex="-1" role="dialog" aria-labelledby="set_conv_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="setConvDatePop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.sdate"></div>
        					<input id="setConvDatePopSdate" type="date">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.stime"></div>
        					<input id="setConvDatePopStime" type="time">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.edate"></div>
        					<input id="setConvDatePopEdate" type="date">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="setConvDatePop.etime"></div>
        					<input id="setConvDatePopEtime" type="time">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="setConvDateApplyBtn()">
								<img src="${pageContext.request.contextPath}/img/i_btn_verif.svg" class="bt-icon" height="16px">
								<span data-i18n="setConvDatePop.btnApply"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
	         						<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="convDataAllChk"></span></div></th>
			           				<th class="th-w-120"><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.sdate"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.stime"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="setConvDatePop.edate"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="setConvDatePop.etime"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="setConvDatePopList"></tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondar" data-dismiss="modal" data-i18n="setConvDatePop.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Conv Date Input Modal End -->

	
	<script>
		// ctype, dtype 데이터 
		var ctypeList = new Array();
		var dtypeList = new Array();
		const reqinfotitleList = new Array();
		const schedtypeList = new Array();
		
		<c:forEach items="${listctype}" var="ctype">
		ctypeList.push({
			'value': '${ctype.val}',
			'desc': '${ctype.description}'
		});
		</c:forEach>
		<c:forEach items="${listdtype}" var="dtype">
		dtypeList.push({
			'value': '${dtype.val}',
			'desc': '${dtype.description}'
		});
		</c:forEach>

		<c:forEach items="${listreqinfotitle}" var="item">
		reqinfotitleList.push({
			'value': '${item.val}',
			'desc': '${item.description}'
		});
		</c:forEach>

		<c:forEach items="${listschedtype}" var="item">
		schedtypeList.push({
			'value': '${item.val}',
			'desc': '${item.description}'
		})
		</c:forEach>
	</script>
	
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.timepicker.min.js"></script>
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
	<script src="${pageContext.request.contextPath}/js/mng/sche/new_scheduler.js"></script>
</body>
</html>
