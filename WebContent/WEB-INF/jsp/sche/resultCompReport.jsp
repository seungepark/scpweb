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
                    	<a href="${pageContext.request.contextPath}/sche/resultDailyReport.html?uid=${bean.uid}"><span data-i18n="tabReport"></span><span class="mx-2"> | </span></a>
                    	<a href="${pageContext.request.contextPath}/sche/resultDailyReport.html?uid=${bean.uid}">
	                    	<div class="tab-check">
	                    		<input type="checkbox" id="checkComp" checked>
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
													<div class="report-subtitle">${bean.description}</div>
												</div>
											</div>
										</div>
										<div class="sp-16"></div>
										<div class="report-comp-schedule-area">
											<div class="d-flex justify-content-center align-items-center report-comp-schedule-time-area">
												<div id="scheDiffSymbol" class="report-comp-schedule-time-symbol"></div>
												<div id="scheDiffHr" class="report-comp-schedule-time-num"></div>
												<div id="scheDiffUnit" class="report-comp-schedule-time-unit"></div>
											</div>
											<div></div>
											<div>
												<div class="d-flex report-comp-schedule-multi-row-area">
													<div class="report-comp-schedule-multi-row-title" data-i18n="[html]schePlan"></div>
													<div id="schePlan" class="report-comp-schedule-multi-row-time"></div>
													<div id="schePlanDate" class="flex-grow-1 report-comp-schedule-multi-row-date"></div>
												</div>
												<div class="sp-2"></div>
												<div class="d-flex report-comp-schedule-multi-row-area multi-row-bg-dark">
													<div class="report-comp-schedule-multi-row-title multi-row-title-dark" data-i18n="schePer"></div>
													<div id="schePer" class="report-comp-schedule-multi-row-time"></div>
													<div id="schePerDate" class="flex-grow-1 report-comp-schedule-multi-row-date multi-row-date-dark"></div>
												</div>
											</div>
											<div></div>
											<div>
												<div class="report-section-title pt-0" data-i18n="commander.title"></div>
												<div class="sp-2"></div>
												<table class="w-100">
													<tr>
														<td><div class="report-comp-commander-icon" data-i18n="commander.main"></div></td>
														<td id="commName1" class="report-comp-commander-name"></td>
														<td id="commPhone1" class="report-comp-commander-phone"></td>
													</tr>
													<tr><td colspan="3" class="sp-2"></td></tr>
													<tr>
														<td><div class="report-comp-commander-icon" data-i18n="commander.sub"></div></td>
														<td id="commName2" class="report-comp-commander-name"></td>
														<td id="commPhone2" class="report-comp-commander-phone"></td>
													</tr>
												</table>
											</div>
										</div>
										<div class="sp-10"></div>
		                            	<div class="report-graph-area">
											<div class="report-section-title pt-0" id="trialTitle"></div>
											<div class="sp-6"></div>
											<div class="report-graph-title report-graph-content-w mx-auto" data-i18n="trialList.subtitle1"></div>
											<div><canvas id="trialTimeGraph" class="mx-auto" style="width:95%; height:150px;"></canvas></div>
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
											<div><canvas id="trialFuelGraph" class="mx-auto" style="width:95%; height:150px;"></canvas></div>
											<div id="trialFuelGraphTotal" class="mx-auto report-graph-content-w"></div>
										</div>
										<div class="report-width-half">
											<div class="d-flex flex-column">
												<div class="report-section-title pt-0" data-i18n="progress.title"></div>
												<table class="report-tb h-100">
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
											</div>
											<div></div>
											<div class="report-graph-area">
												<div class="report-section-title pt-0" data-i18n="fuel.title"></div>
												<div><canvas id="fuelGraph" style="width:100%; height:130px;"></canvas></div>
											</div>
										</div>
										<div class="sp-8"></div>
		                            	<div class="report-graph-area">
											<div class="report-section-title pt-0" data-i18n="fuel.title2"></div>
											<div class="d-flex">
												<div class="flex-grow-1 report-graph-title"></div>
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
										<div class="report-section-title" data-i18n="compData.title"></div>
										<div class="report-comp-data-area">
											<div class="report-comp-data-title" data-i18n="compData.result"></div>
											<div class="report-comp-data-value">${beanInfo.compRemark}</div>
											<div></div>
											<div class="report-comp-data-title" data-i18n="compData.contractSpeed"></div>
											<div class="report-comp-data-value"><c:if test="${not empty beanInfo.contractSpeed}">${beanInfo.contractSpeed} Knots</c:if></div>
										</div>
										<div class="sp-4"></div>
										<table id="speedData" class="report-tb"></table>
										<div class="report-section-title" data-i18n="compData.noiseVibration"></div>
										<div class="report-comp-data-noise-area">
											<div class="report-comp-data-title" data-i18n="compData.result"></div>
											<div class="report-comp-data-value">${beanInfo.noiseVibration}</div>
										</div>
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
													<div class="report-subtitle">${bean.description}</div>
												</div>
											</div>
										</div>
										<div class="sp-16"></div>
										<div class="report-comp-schedule-area">
											<div class="d-flex justify-content-center align-items-center report-comp-schedule-time-area">
												<div id="scheDiffSymbol2" class="report-comp-schedule-time-symbol"></div>
												<div id="scheDiffHr2" class="report-comp-schedule-time-num"></div>
												<div id="scheDiffUnit2" class="report-comp-schedule-time-unit"></div>
											</div>
											<div></div>
											<div>
												<div class="d-flex report-comp-schedule-multi-row-area">
													<div class="report-comp-schedule-multi-row-title" data-i18n="[html]schePlan"></div>
													<div id="schePlan2" class="report-comp-schedule-multi-row-time"></div>
													<div id="schePlanDate2" class="flex-grow-1 report-comp-schedule-multi-row-date"></div>
												</div>
												<div class="sp-4"></div>
												<div class="d-flex report-comp-schedule-multi-row-area multi-row-bg-dark">
													<div class="report-comp-schedule-multi-row-title multi-row-title-dark" data-i18n="schePer"></div>
													<div id="schePer2" class="report-comp-schedule-multi-row-time"></div>
													<div id="schePerDate2" class="flex-grow-1 report-comp-schedule-multi-row-date multi-row-date-dark"></div>
												</div>
											</div>
											<div></div>
											<div>
												<div class="report-section-title pt-0" data-i18n="commander.title"></div>
												<div class="sp-6"></div>
												<table class="w-100">
													<tr>
														<td><div class="report-comp-commander-icon" data-i18n="commander.main"></div></td>
														<td id="commName12" class="report-comp-commander-name"></td>
														<td id="commPhone12" class="report-comp-commander-phone"></td>
													</tr>
													<tr><td colspan="3" class="sp-4"></td></tr>
													<tr>
														<td><div class="report-comp-commander-icon" data-i18n="commander.sub"></div></td>
														<td id="commName22" class="report-comp-commander-name"></td>
														<td id="commPhone22" class="report-comp-commander-phone"></td>
													</tr>
												</table>
											</div>
										</div>
										<div class="report-section-title" data-i18n="note.title"></div>
										<table class="report-tb">
											<thead>
												<tr>
													<th data-i18n="note.tc"></th>
													<th data-i18n="note.code"></th>
													<th data-i18n="note.remark"></th>
													<th data-i18n="note.date"></th>
													<th data-i18n="note.tcList"></th>
												</tr>
											</thead>
											<tbody>
												<c:choose>
													<c:when test="${not empty listNote and fn:length(listNote) > 0}">
														<c:set var="IS_ROW_ODD" value="true"></c:set>
														<c:forEach var="item" items="${listNote}">
															<tr>
																<c:choose>
																	<c:when test="${IS_ROW_ODD}">
																		<td>
																			<div>${item.tcNum}</div>
																		</td>
																		<td><div>${item.code}</div></td>
																		<td><div>${item.remark}</div></td>
																		<td><div>${item.startDate}<div>~</div>${item.endDate}</div></td>
																		<td>
																			<div>
																				<c:forEach var="tc" items="${item.tcList}" varStatus="status">
																					${tc.tcNum}
																					<c:if test="${!status.last}">, </c:if>
																				</c:forEach>
																			</div>
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td class="td-bg-dark">
																			<div>${item.tcNum}</div>
																		</td>
																		<td class="td-bg-dark"><div>${item.code}</div></td>
																		<td class="td-bg-dark"><div>${item.remark}</div></td>
																		<td class="td-bg-dark"><div>${item.startDate}<div>~</div>${item.endDate}</div></td>
																		<td class="td-bg-dark">
																			<div>
																				<c:forEach var="tc" items="${item.tcList}" varStatus="status">
																					${tc.tcNum}
																					<c:if test="${!status.last}">, </c:if>
																				</c:forEach>
																			</div>
																		</td>
																	</c:otherwise>
																</c:choose>
															</tr>
															<c:set var="IS_ROW_ODD" value="${!IS_ROW_ODD}"></c:set>
														</c:forEach>
													</c:when>
													<c:otherwise>
														<tr>
															<td class="text-center" colspan="5"><div>-</div></td>
														</tr>
													</c:otherwise>
												</c:choose>
											</tbody>
										</table>
										<div class="report-section-title" data-i18n="crewCnt.title"></div>
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
											</tbody>
										</table>
										<div class="sp-8"></div>
		                            	<div class="report-graph-area">
		                            		<div class="report-graph-subtitle-r" data-i18n="crewCnt.unit"></div>
											<div><canvas id="crewDateListGraph" style="width:100%; height:150px;"></canvas></div>
										</div>
										<div class="report-section-title" data-i18n="remark"></div>
										<div class="report-remark-area">${beanInfo.remark}</div>
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
        			<div class="text-primary mr-5" data-i18n="submitPop.rollbackMsg"></div>
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
	    let _infoBean = '';
	    let _schedule = [];
	    let _commanderList = [];
	    let _trialList = '';
	    let _trialListCurr = '';
	    let _trialList1 = '';
	    let _trialList2 = '';
	    let _trialList1Comp = '';
	    let _trialList2Comp = '';
	    let _tcCntList = [];
	    let _crewCntList = [];
	    let _status = "${status}";
	    let _ongoMin = "${ongoMin}";
	    let _crewDateCntList = [];
	    let _dateToday = "${beanDateInfo.today}";
	    let _dateSdate = "${beanDateInfo.sdate}";
	    let _dateEdate = "${beanDateInfo.edate}";
	    let _fuelDateList = [];
	    let _mailingList = [];
	    
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
	    		draftFwd: "${beanInfo.draftFwdScheduler}", 
	    		draftMid: "${beanInfo.draftMidScheduler}", 
	    		draftAft: "${beanInfo.draftAftScheduler}",
	    		draftFwdPerformance: "${beanInfo.draftFwdPerformance}", 
	    		draftMidPerformance: "${beanInfo.draftMidPerformance}", 
	    		draftAftPerformance: "${beanInfo.draftAftPerformance}",
	    		draftFwdTemp: "${beanInfo.draftFwdTemp}", 
	    		draftMidTemp: "${beanInfo.draftMidTemp}", 
	    		draftAftTemp: "${beanInfo.draftAftTemp}",
	    		contractSpeed: "${beanInfo.contractSpeed}",
		    	measureSpeed: "${beanInfo.measureSpeed}"
	    	};
		</c:if>
		
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
		
		<c:forEach var="item" items="${listCommander}">
	  		_commanderList.push({
	 			name: "${item.name}",
	 			phone: "${item.phone}",
	 			mainSub: "${item.mainSub}"
	 		});
	  	</c:forEach>
	  	
	  	<c:if test="${not empty beanInfo}">
			_trialList = {
		    	trialTime: "${beanInfo.trialTime}",
		    	trial1Uid: "${beanInfo.trial1SchedulerInfoUid}",
		    	trial1Num: "${beanInfo.trial1HullNum}",
		    	trial1Time: "${beanInfo.trial1Time}",
		    	trial2Uid: "${beanInfo.trial2SchedulerInfoUid}",
		    	trial2Num: "${beanInfo.trial2HullNum}",
		    	trial2Time: "${beanInfo.trial2Time}"
		    };
		    
		    _trialListCurr = {
		    	hfo: "${beanInfo.fuelHfoScheduler}",
		    	mgo: "${beanInfo.fuelMgoScheduler}",
		    	mdo: "${beanInfo.fuelMdoScheduler}",
		    	lng: "${beanInfo.fuelLngScheduler}",
		    	hfoDown: "${beanFuelDown.fuelHfoDown}",
		    	mgoDown: "${beanFuelDown.fuelMgoDown}",
		    	mdoDown: "${beanFuelDown.fuelMdoDown}",
		    	lngDown: "${beanFuelDown.fuelLngDown}"
		    };
		    
		    <c:if test="${not empty beanTrial1}">
				_trialList1 = {
			    	hfo: "${beanTrial1.fuelHfo}",
			    	mgo: "${beanTrial1.fuelMgo}",
			    	mdo: "${beanTrial1.fuelMdo}",
			    	lng: "${beanTrial1.fuelLng}"
			    };
			</c:if>
		    
		    <c:if test="${not empty beanTrial2}">
				_trialList2 = {
			    	hfo: "${beanTrial2.fuelHfo}",
			    	mgo: "${beanTrial2.fuelMgo}",
			    	mdo: "${beanTrial2.fuelMdo}",
			    	lng: "${beanTrial2.fuelLng}"
			    };
			</c:if>
		    
		    <c:if test="${not empty beanTrial1Comp}">
				_trialList1Comp = {
			    	measureSpeed: "${beanTrial1Comp.measureSpeed}"
			    };
			</c:if>
		    
		    <c:if test="${not empty beanTrial2Comp}">
				_trialList2Comp = {
			    	measureSpeed: "${beanTrial2Comp.measureSpeed}"
			    };
			</c:if>
		</c:if>
	  	
	  	<c:forEach var="item" items="${listTcCnt}">
	  		_tcCntList.push("${item}");
	  	</c:forEach>
	  	
	  	<c:forEach var="item" items="${listCrewCnt}">
	  		_crewCntList.push({
	 			cnt: "${item.cnt}",
	 			kind: "${item.kind}"
	 		});
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
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-plugin-annotation.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/resultCompReport.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/changeStatusPop.js"></script>
</body>
</html>
