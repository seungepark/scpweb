<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_RESULT_SCHE_R'}">
		<c:set var="P_RESULT_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_W'}">
		<c:set var="P_RESULT_SCHE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_CREW'}">
		<c:set var="P_RESULT_SCHE_CREW" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_INFO'}">
		<c:set var="P_RESULT_SCHE_INFO" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_RESULT_SCHE_R and empty P_RESULT_SCHE_W}">
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
</head>
<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_2.jsp"%>
            <div class="main-container">
<%--             	<%@ include file="/WEB-INF/jsp/include/menu/bread_1_2.jsp"%> --%>
				<div class="tab-area">
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/resultChart.html?uid=${bean.uid}" data-i18n="tabChart"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/resultCrew.html?uid=${bean.uid}" data-i18n="tabCrew"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/resultInfo.html?uid=${bean.uid}" data-i18n="tabInfo"></a></div>
                    <div class="tab-base active">
                    	<a href="${pageContext.request.contextPath}/sche/resultCompReport.html?uid=${bean.uid}"><span data-i18n="tabReport"></span><span class="mx-2"> | </span></a>
                    	<a href="${pageContext.request.contextPath}/sche/resultCompReport.html?uid=${bean.uid}">
	                    	<div class="tab-check">
	                    		<input type="checkbox" id="checkComp">
	                    		<div class="d-inline-block" data-i18n="checkComp"></div>
	                    	</div>
                    	</a>
                    </div>
                    <div class="tab-extra-area mr-auto">
                        <a href="${pageContext.request.contextPath}/sche/planChart.html?uid=${bean.uid}"><button class="bt-obj bt-tertiary" data-i18n="statusBtnPlan"></button></a>
                        <a href="${pageContext.request.contextPath}/sche/resultChart.html?uid=${bean.uid}"><button class="bt-obj bt-secondary" data-i18n="statusBtnResult"></button></a>
                        <c:choose>
							<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
								<button class="bt-obj bt-primary" data-i18n="statusBtnChangeStatus" disabled></button>
							</c:when>
							<c:otherwise>
								<button onclick="showChangeStatusPop()" class="bt-obj bt-primary" data-i18n="statusBtnChangeStatus"></button>
							</c:otherwise>
						</c:choose>
                    </div>
                    <c:choose>
                       	<c:when test="${status eq 'ONGO'}"><i class="fa-solid fa-circle trial-status-prefix-ongo"></i><span data-i18n="share:trialStatus.ongo"></span></c:when>
                       	<c:when test="${status eq 'ARRIVE'}"><i class="fa-solid fa-circle trial-status-prefix-arrive"></i><span data-i18n="share:trialStatus.arrive"></span></c:when>
                       	<c:otherwise><i class="fa-solid fa-circle trial-status-prefix-default"></i><span data-i18n="share:trialStatus.depart"></span></c:otherwise>
                    </c:choose>
                </div>
				<div class="row">
					<div class="col-12">
						<div class="x_panel">
							<div class="d-flex flex-row-reverse py-2">
								<c:choose>
									<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
										<button class="bt-obj bt-primary" data-i18n="btnSend" disabled></button>
									</c:when>
									<c:otherwise>
										<button class="bt-obj bt-primary" onclick="showSubmitPop()" data-i18n="btnSend"></button>
									</c:otherwise>
								</c:choose>
								<button class="bt-obj bt-primary" onclick="onPrintPdfPage2('printArea', 'printArea2')" data-i18n="btnPrint"></button>
							</div>
							<page id="templatePage" size="A4" class="d-flex flex-column" layout="">
								<div id="printArea" class="page-area">
									<div class="container-fluid p-2">
										<div class="report-type-logo-area">
											<div id="typeLogo" class="d-flex justify-content-center align-items-center report-type-logo-base">
												<div>
													<div id="typeTitle" class="report-type-logo-title"></div>
													<div id="typeSubtitle" class="report-type-logo-subtitle"></div>
												</div>
											</div>
											<div class="d-flex align-items-center">
												<div class="w-100">
													<div class="d-flex report-title">
														<div class="flex-grow-1">${bean.hullnum} <span id="titleSchedType"></span> <span data-i18n="reportTitle"></span></div>
														<div class="report-page-info">1/2</div>
													</div>
													<div class="sp-4"></div>
													<div class="d-flex report-subtitle">
														<div class="flex-grow-1">${bean.description}</div>
														<div class="report-daily-report-date my-auto">${beanDateInfo.today}</div>
													</div>
												</div>
											</div>
										</div>
										<div class="sp-16"></div>
										<div class="report-daily-schedule-area">
											<div>
												<div class="d-flex report-daily-schedule-multi-row-area">
													<div class="report-daily-schedule-multi-row-title" data-i18n="[html]schePlan"></div>
													<div id="schePlanDate" class="flex-grow-1 report-daily-schedule-multi-row-date"></div>
													<div id="schePlan" class="report-daily-schedule-multi-row-time"></div>
												</div>
												<div class="sp-2"></div>
												<div class="d-flex report-daily-schedule-multi-row-area multi-row-bg-dark">
													<div class="report-daily-schedule-multi-row-title multi-row-title-dark" data-i18n="[html]schePred"></div>
													<div id="schePredDate" class="flex-grow-1 report-daily-schedule-multi-row-date multi-row-date-dark"></div>
													<div id="schePred" class="report-daily-schedule-multi-row-time"></div>
												</div>
												<div class="sp-2"></div>
												<div class="d-flex report-daily-schedule-multi-row-area">
													<div class="report-daily-schedule-multi-row-title" data-i18n="progress.time"></div>
													<div class="flex-grow-1 report-daily-schedule-multi-row-date">
														<div class="report-daily-progress-container">
															<div class="report-daily-progress-bar-bg"></div>
															<div id="progressTimeBar" class="report-daily-progress-bar"></div>
														</div>
													</div>
													<div id="progressTimePer" class="report-daily-schedule-multi-row-per">25%</div>
													<div class="report-daily-schedule-multi-row-empty"></div>
													<div class="report-daily-schedule-multi-row-time">
														<span id="progressTime" class="multi-row-text-active"></span>
														<span id="progressTimeTotal"></span>
													</div>
												</div>
											</div>
											<div></div>
											<div class="d-flex justify-content-center align-items-center report-daily-schedule-time-area">
												<div id="scheDiffSymbol" class="report-daily-schedule-time-symbol"></div>
												<div id="scheDiffHr" class="report-daily-schedule-time-num"></div>
												<div id="scheDiffUnit" class="report-daily-schedule-time-unit"></div>
											</div>
										</div>
										<div class="report-section-title" data-i18n="progress.title"></div>
										<table class="report-tb">
											<thead>
												<tr>
													<th data-i18n="progress.total"></th>
													<th data-i18n="progress.hull"></th>
													<th data-i18n="progress.machinery"></th>
													<th data-i18n="progress.eletric"></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><div class="report-doughnut-chart-size"><canvas id="progressCnt1Graph"></canvas></div></td>
													<td><div class="report-doughnut-chart-size"><canvas id="progressCnt2Graph"></canvas></div></td>
													<td><div class="report-doughnut-chart-size"><canvas id="progressCnt3Graph"></canvas></div></td>
													<td><div class="report-doughnut-chart-size"><canvas id="progressCnt4Graph"></canvas></div></td>
												</tr>
											</tbody>
										</table>
										<div class="report-section-title" data-i18n="crew.title"></div>
										<div class="report-section-subtitle">
											<span data-i18n="crew.commander"></span><span id="commander"></span>
										</div>
										<table class="report-tb">
											<thead>
												<tr>
													<th data-i18n="crewCnt.total"></th>
													<th data-i18n="crewCnt.01"></th>
													<th data-i18n="crewCnt.02"></th>
													<th data-i18n="crewCnt.03"></th>
													<th data-i18n="crewCnt.04"></th>
													<th data-i18n="crewCnt.05"></th>
													<th data-i18n="crewCnt.06"></th>
													<th data-i18n="crewCnt.07"></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><div id="crewCntTotal"></div></td>
													<td><div id="crewCnt01"></div></td>
													<td><div id="crewCnt02"></div></td>
													<td><div id="crewCnt03"></div></td>
													<td><div id="crewCnt04"></div></td>
													<td><div id="crewCnt05"></div></td>
													<td><div id="crewCnt06"></div></td>
													<td><div id="crewCnt07"></div></td>
												</tr>
												<tr>
													<td class="td-bg-dark"><div id="crewUpDownTotal"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown01"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown02"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown03"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown04"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown05"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown06"></div></td>
													<td class="td-bg-dark"><div id="crewUpDown07"></div></td>
												</tr>
											</tbody>
										</table>
										<div class="sp-8"></div>
		                            	<div class="report-graph-area">
		                            		<div class="report-graph-subtitle-r" data-i18n="crew.unit"></div>
											<div><canvas id="crewDateListGraph" class="mx-auto" style="width:100%; height:150px;"></canvas></div>
										</div>
										<div class="sp-8"></div>
		                            	<div class="report-graph-area">
											<div class="report-section-title pt-0" data-i18n="fuel.title"></div>
											<div class="d-flex mx-auto report-graph-content-w">
												<div class="flex-grow-1 report-graph-title" data-i18n="trialList.subtitle2"></div>
												<div class="d-flex align-items-center">
													<div class="report-fuel-box report-fuel-box-hfo"></div>
													<div class="report-fuel-box-label" data-i18n="fuel.hfo"></div>
													<div class="report-fuel-box report-fuel-box-mgo"></div>
													<div class="report-fuel-box-label" data-i18n="fuel.mgo"></div>
													<div class="report-fuel-box report-fuel-box-lng"></div>
													<div class="report-fuel-box-label" data-i18n="fuel.lng"></div>
													<div class="report-fuel-box report-fuel-box-mdo"></div>
													<div class="report-fuel-box-label" data-i18n="fuel.mdo"></div>
												</div>
											</div>
											<div><canvas id="fuelDateGraph" style="width:100%; height:150px;"></canvas></div>
											<div id="fuelDateGraphTotal"></div>
										</div>
										<div class="report-section-title" data-i18n="remark"></div>
										<div class="report-remark-area">${beanInfo.remark}</div>
									</div>
								</div>
							</page>
							<page id="templatePage2" size="A4" class="d-flex flex-column" layout="">
								<div id="printArea2" class="page-area">
									<div class="container-fluid p-2">
										<div class="report-type-logo-area">
											<div id="typeLogo2" class="d-flex justify-content-center align-items-center report-type-logo-base">
												<div>
													<div id="typeTitle2" class="report-type-logo-title"></div>
													<div id="typeSubtitle2" class="report-type-logo-subtitle"></div>
												</div>
											</div>
											<div class="d-flex align-items-center">
												<div class="w-100">
													<div class="d-flex report-title">
														<div class="flex-grow-1">${bean.hullnum} <span id="titleSchedType2"></span> <span data-i18n="reportTitle"></span></div>
														<div class="report-page-info">2/2</div>
													</div>
													<div class="sp-4"></div>
													<div class="d-flex report-subtitle">
														<div class="flex-grow-1">${bean.description}</div>
														<div class="report-daily-report-date my-auto">${beanDateInfo.today}</div>
													</div>
												</div>
											</div>
										</div>
										<div class="sp-16"></div>
										<table class="report-tb">
											<thead>
												<tr>
													<th data-i18n="tcList.state"></th>
													<th data-i18n="tcList.tcnum"></th>
													<th data-i18n="tcList.desc"></th>
													<th data-i18n="tcList.gap"></th>
													<th data-i18n="tcList.start"></th>
													<th data-i18n="tcList.finish"></th>
												</tr>
											</thead>
											<tbody id="tcList"></tbody>
										</table>
									</div>
								</div>
							</page>
						</div>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- 제출 modal-->
  	<div class="modal fade" id="submitPop" tabindex="-1" role="dialog" aria-labelledby="submit_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="submitPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
        			<div class="pop-op-area">
       					<div class="pop-inner-title" data-i18n="submitPop.toList"></div>
       					<div id="submitPopToList"></div>
       					<hr>
       					<div class="pop-inner-title" data-i18n="submitPop.ccList"></div>
       					<div id="submitPopCcList"></div>
       					<hr>
       					<div class="pop-inner-title" data-i18n="submitPop.bccList"></div>
       					<div id="submitPopBccList"></div>
       					<hr>
        			</div>
        			<div class="d-flex pop-op-area">
        				<input id="submitPopSearchDesc" type="text" class="" data-i18n="[placeholder]submitPop.searchEmail">
        				<button class="bt-obj bt-primary" onclick="searchEmail()">
							<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
							<span data-i18n="submitPop.search"></span>
						</button>
   						<select id="submitPopNewEmailKind" class=" ml-auto">
       						<option value="TO" data-i18n="submitPop.selTo"></option>
       						<option value="CC" data-i18n="submitPop.selCc"></option>
       						<option value="BCC" data-i18n="submitPop.selBcc"></option>
       					</select>
						<input id="submitPopNewEmail" type="text" class="" data-i18n="[placeholder]submitPop.newEmail">
						<button class="bt-obj bt-primary" onclick="addNewEmail()">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="submitPop.btnAddNewEmail"></span>
						</button>
        			</div>
        			<div class="tb-wrap report-submit-tb-scroll-area">
						<table class="tb-style">
							<thead>
								<tr class="headings">
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.name"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.rank"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.department"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.company"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.email"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.to"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="submitPop.cc"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="submitPop.bcc"></span></div></th>
								</tr>
							</thead>
							<tbody id="submitPopMailList">
								<tr><td class="text-center" colspan="8" data-i18n="share:noList"></td></tr>
							</tbody>
						</table>
					</div>
        		</div>
        		<div class="modal-footer">
        			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="submitPop.btnClose"></button>
					<c:choose>
						<c:when test="${bean.isOff eq 'Y'}">
							<button class="bt-obj bt-primary" data-i18n="submitPop.btnSend" disabled></button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary" data-i18n="submitPop.btnSend" onclick="submitReport()"></button>
						</c:otherwise>
					</c:choose>
        		</div>
      		</div>
    	</div>
  	</div>
  	<%@ include file="/WEB-INF/jsp/sche/changeStatusPop.jsp"%>
	<script type="text/javascript">
	    let _scheUid = "${bean.uid}";
	    let _schedType = "${bean.schedtype}";
	    let _hullNum = "${bean.hullnum}";
	    let _commanderList = [];
	    let _tcCntList = [];
	    let _status = "${status}";
	    let _ongoMin = "${ongoMin}";
	    let _isExistReport = ${isExist};
	    let _schedule = [];
	    let _infoBean = '';
	    let _lastBean = '';
	    let _crewDateCntList = [];
	    let _dateToday = "${beanDateInfo.today}";
	    let _dateSdate = "${beanDateInfo.sdate}";
	    let _dateEdate = "${beanDateInfo.edate}";
	    let _fuelDateList = [];
	    let _tcList = [];
	    let _mailingList = [];
	    
	    <c:if test="${not empty listSche and fn:length(listSche) > 0}">
	    	_schedule.push({
		    	sDate: "${listSche[0].startDate}",
		    	eDate: "${listSche[0].endDate}",
		    	hour: "${listSche[0].timeHour}",
		    	day: "${listSche[0].timeDay}"
		    });
			    
	    	<c:if test="${fn:length(listSche) > 1}">
			    _schedule.push({
			    	sDate: "${listSche[1].startDate}",
			    	eDate: "${listSche[1].endDate}",
			    	hour: "${listSche[1].timeHour}",
			    	day: "${listSche[1].timeDay}"
			    });
			</c:if>
		</c:if>
		
		<c:if test="${not empty beanInfo}">
	    	_infoBean = {
	    		fuelHfo: "${beanInfo.fuelHfoScheduler}", 
	    		fuelMgo: "${beanInfo.fuelMgoScheduler}", 
	    		fuelMdo: "${beanInfo.fuelMdoScheduler}", 
	    		fuelLng: "${beanInfo.fuelLngScheduler}", 
	    		fuelHfoPerformance: "${beanInfo.fuelHfoPerformance}", 
	    		fuelMgoPerformance: "${beanInfo.fuelMgoPerformance}", 
	    		fuelMdoPerformance: "${beanInfo.fuelMdoPerformance}", 
	    		fuelLngPerformance: "${beanInfo.fuelLngPerformance}", 
	    		fuelHfoTemp: "${beanInfo.fuelHfoTemp}", 
	    		fuelMgoTemp: "${beanInfo.fuelMgoTemp}", 
	    		fuelMdoTemp: "${beanInfo.fuelMdoTemp}", 
	    		fuelLngTemp: "${beanInfo.fuelLngTemp}", 
	    		fuelHfoDown: "${beanInfo.fuelHfoDown}", 
	    		fuelMgoDown: "${beanInfo.fuelMgoDown}", 
	    		fuelMdoDown: "${beanInfo.fuelMdoDown}", 
	    		fuelLngDown: "${beanInfo.fuelLngDown}", 
	    		fuelHfoUp: "${beanInfo.fuelHfoUp}", 
	    		fuelMgoUp: "${beanInfo.fuelMgoUp}", 
	    		fuelMdoUp: "${beanInfo.fuelMdoUp}", 
	    		fuelLngUp: "${beanInfo.fuelLngUp}", 
	    		draftFwd: "${beanInfo.draftFwdScheduler}", 
	    		draftMid: "${beanInfo.draftMidScheduler}", 
	    		draftAft: "${beanInfo.draftAftScheduler}",
	    		draftFwdPerformance: "${beanInfo.draftFwdPerformance}", 
	    		draftMidPerformance: "${beanInfo.draftMidPerformance}", 
	    		draftAftPerformance: "${beanInfo.draftAftPerformance}",
	    		draftFwdTemp: "${beanInfo.draftFwdTemp}", 
	    		draftMidTemp: "${beanInfo.draftMidTemp}", 
	    		draftAftTemp: "${beanInfo.draftAftTemp}"
	    	};
		</c:if>
		
		<c:if test="${not empty beanLast}">
	    	_lastBean = {
	    		fuelHfo: "${beanLast.fuelHfo}", 
	    		fuelMgo: "${beanLast.fuelMgo}", 
	    		fuelMdo: "${beanLast.fuelMdo}", 
	    		fuelLng: "${beanLast.fuelLng}", 
	    		draftFwd: "${beanLast.draftFwd}", 
	    		draftMid: "${beanLast.draftMid}", 
	    		draftAft: "${beanLast.draftAft}"
	    	};
		</c:if>
  	
	  	<c:forEach var="item" items="${listCommander}">
	  		_commanderList.push({
	 			name: "${item.name}",
	 			phone: "${item.phone}",
	 			mainSub: "${item.mainSub}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listTcCnt}">
	  		_tcCntList.push("${item}");
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listCrewDateCnt}">
	  		_crewDateCntList.push({
	 			total: "${item.crewTotal}",
	 			shi: "${item.crewShi}",
	 			out: "${item.crewOut}",
	 			owner: "${item.crewOwner}",
	 			class: "${item.crewClass}",
	 			se: "${item.crewSe}",
	 			captain: "${item.crewCaptain}",
	 			mate: "${item.crewMate}",
	 			eng: "${item.crewEng}",
	 			etc: "${item.crewEtc}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listFuelDate}">
	  		_fuelDateList.push({
	 			hfo: "${item.fuelHfoScheduler}",
	 			mgo: "${item.fuelMgoScheduler}",
	 			lng: "${item.fuelLngScheduler}",
	 			mdo: "${item.fuelMdoScheduler}",
	 			date: "${item.insertDate}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listTc}">
	  		_tcList.push({
	 			state: "${item.state}",
	 			tcnum: "${item.tcnum}",
	 			desc: "${item.description}",
	 			sdate: "${item.sdate}",
	 			stime: "${item.stime}",
	 			edate: "${item.edate}",
	 			etime: "${item.etime}",
	 			gap: "${item.gap}"
	 		});
	  	</c:forEach>
	  	
	  	<c:forEach var="item" items="${listMail}">
	  		_mailingList.push({
	 			email: "${item.email}",
	 			name: "${item.name}"
	 		});
	  	</c:forEach>
	</script> 
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
	<script src="${pageContext.request.contextPath}/vendors/loading/loadingOverlay.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/html2canvas/html2canvas.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jspdf/jspdf.umd.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chart.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-plugin-datalabels.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/resultDailyReport.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/changeStatusPop.js"></script>
</body>
</html>
