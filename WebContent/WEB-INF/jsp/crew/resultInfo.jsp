<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_RESULT_SCHE_R'}">
		<c:set var="P_RESULT_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_W'}">
		<c:set var="P_RESULT_SCHE_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_RESULT_SCHE_INFO'}">
		<c:set var="P_RESULT_SCHE_INFO" value="true" />
	</c:if>
</c:forEach>
<c:if test="${(empty P_RESULT_SCHE_R and empty P_RESULT_SCHE_W) or empty P_RESULT_SCHE_INFO}">
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
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/sche/resultInfo.html?uid=${bean.uid}" data-i18n="tabInfo"></a></div>
                    <div class="tab-base">
                    	<a href="#" onclick="viewReport()"><span data-i18n="tabReport"></span><span class="mx-2"> | </span></a>
                    	<div class="tab-check">
                    		<input type="checkbox" id="checkComp">
                    		<div class="d-inline-block" data-i18n="checkComp"></div>
                    	</div>
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
                <div class="sec-card">
                	<div class="d-flex flex-row-reverse">
						<c:choose>
							<c:when test="${bean.isOff eq 'Y'}">
								<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-primary" onclick="save()"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:otherwise>
						</c:choose>
					</div>
					<div class="sp-16"></div>
					<table class="tb-style-view">
						<thead>
							<tr>
								<th colspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="crew.01"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crew.02"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crew.03"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crew.04"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crew.05"></span></div></th>
								<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="crew.06"></span></div></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td id="commander01" class="align-middle text-center"></td>
								<td id="commander02" class="align-middle text-center"></td>
								<td id="crew01" class="align-middle text-center"></td>
								<td id="crew02" class="align-middle text-center"></td>
								<td id="crew03" class="align-middle text-center"></td>
								<td id="crew04" class="align-middle text-center"></td>
								<td id="crew05" class="align-middle text-center"></td>
							</tr>
							<tr>
								<td colspan="7">
									<textarea id="crewRemark" class="w-100" rows="3">${beanInfo.crewRemark}</textarea>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="sp-16"></div>
					<table class="tb-style-view">
						<thead>
							<tr>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.total"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.01"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.02"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.03"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.04"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.05"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="crewCnt.06"></span></div></th>
								<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="crewCnt.07"></span></div></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td id="crewCntTotal" class="text-center"></td>
								<td id="crewCnt01" class="text-center"></td>
								<td id="crewCnt02" class="text-center"></td>
								<td id="crewCnt03" class="text-center"></td>
								<td id="crewCnt04" class="text-center"></td>
								<td id="crewCnt05" class="text-center"></td>
								<td id="crewCnt06" class="text-center"></td>
								<td id="crewCnt07" class="text-center"></td>
							</tr>
						</tbody>
					</table>
					<div class="sp-16"></div>
					<div class="row m-0 p-0">
						<div class="col p-0">
							<div class="lb-title" data-i18n="trial.title"></div>
							<table class="tb-style-view">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trial.test"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trial.hull"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trial.machinery"></span></div></th>
										<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="trial.eletric"></span></div></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td id="trialCnt1" class="text-center"></td>
										<td id="trialCnt2" class="text-center"></td>
										<td id="trialCnt3" class="text-center"></td>
										<td id="trialCnt4" class="text-center"></td>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
							<div class="lb-title" data-i18n="fuel.title"></div>
							<table class="tb-style-view">
								<tbody>
									<tr>
										<td class="to-th text-center w_15" rowSpan="3"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="fuel.fuel"></span></div></td>
										<c:if test="${not empty beanInfo.fuelHfoScheduler}">
											<td class="to-th text-center" colspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.hfo"></span></div></td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMgoScheduler}">
											<td class="to-th text-center" colspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.mgo"></span></div></td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMdoScheduler}">
											<td class="to-th text-center" colspan="2"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.mdo"></span></div></td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelLngScheduler}">
											<td class="to-th text-center" colspan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="fuel.lng"></span></div></td>
										</c:if>
									</tr>
									<tr>
										<c:if test="${not empty beanInfo.fuelHfoScheduler}">
											<td colspan="2">
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.fuelHfoPerformance}">${beanInfo.fuelHfoPerformance}</c:when>
															<c:otherwise>${beanInfo.fuelHfoScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="fuelHfoTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelHfoTemp}">
												</div>
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMgoScheduler}">
											<td colspan="2">
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.fuelMgoPerformance}">${beanInfo.fuelMgoPerformance}</c:when>
															<c:otherwise>${beanInfo.fuelMgoScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="fuelMgoTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMgoTemp}">
												</div>
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMdoScheduler}">
											<td colspan="2">
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.fuelMdoPerformance}">${beanInfo.fuelMdoPerformance}</c:when>
															<c:otherwise>${beanInfo.fuelMdoScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="fuelMdoTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMdoTemp}">
												</div>
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelLngScheduler}">
											<td colspan="2">
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.fuelLngPerformance}">${beanInfo.fuelLngPerformance}</c:when>
															<c:otherwise>${beanInfo.fuelLngScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="fuelLngTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelLngTemp}">
												</div>
											</td>
										</c:if>
									</tr>
									<tr>
										<c:if test="${not empty beanInfo.fuelHfoScheduler}">
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.up"></span>
												<input id="fuelHfoUp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelHfoUp}">
											</td>
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.down"></span>
												<input id="fuelHfoDown" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelHfoDown}">
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMgoScheduler}">
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.up"></span>
												<input id="fuelMgoUp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMgoUp}">
											</td>
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.down"></span>
												<input id="fuelMgoDown" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMgoDown}">
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelMdoScheduler}">
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.up"></span>
												<input id="fuelMdoUp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMdoUp}">
											</td>
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.down"></span>
												<input id="fuelMdoDown" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMdoDown}">
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.fuelLngScheduler}">
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.up"></span>
												<input id="fuelLngUp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelLngUp}">
											</td>
											<td class="text-center">
												<span class="px-2" data-i18n="fuel.down"></span>
												<input id="fuelLngDown" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelLngDown}">
											</td>
										</c:if>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
							<table class="tb-style-view">
								<tbody>
									<tr>
										<td class="to-th text-center w_15" rowSpan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="draft.draft"></span></div></td>
										<c:if test="${not empty beanInfo.draftFwdScheduler}">
											<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="draft.fwd"></span></div></td>
										</c:if>
										<c:if test="${not empty beanInfo.draftMidScheduler}">
											<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="draft.mid"></span></div></td>
										</c:if>
										<c:if test="${not empty beanInfo.draftAftScheduler}">
											<td class="to-th text-center"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="draft.aft"></span></div></td>
										</c:if>
									</tr>
									<tr>
										<c:if test="${not empty beanInfo.draftFwdScheduler}">
											<td>
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.draftFwdPerformance}">${beanInfo.draftFwdPerformance}</c:when>
															<c:otherwise>${beanInfo.draftFwdScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="draftFwdTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftFwdTemp}">
												</div>
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.draftMidScheduler}">
											<td>
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.draftMidPerformance}">${beanInfo.draftMidPerformance}</c:when>
															<c:otherwise>${beanInfo.draftMidScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="draftMidTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftMidTemp}">
												</div>
											</td>
										</c:if>
										<c:if test="${not empty beanInfo.draftAftScheduler}">
											<td>
												<div class="input-group mb-0 d-flex align-items-center justify-content-center">
													<span>
														<c:choose>
															<c:when test="${not empty beanInfo.draftAftPerformance}">${beanInfo.draftAftPerformance}</c:when>
															<c:otherwise>${beanInfo.draftAftScheduler}</c:otherwise>
														</c:choose>
													</span>
													<span class="px-2"><i class="fa-solid fa-angles-right"></i></span>
													<input id="draftAftTemp" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftAftTemp}">
												</div>
											</td>
										</c:if>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
							<div class="lb-title" data-i18n="remark"></div>
							<textarea id="remark" class="w-100" rows="3">${beanInfo.remark}</textarea>
						</div>
						<div class="col-auto py-0 px-2"></div>
						<div class="col p-0">
							<div class="lb-title">&nbsp;</div>
							<div class="sec-inner-card">
								<div class="lb-sec-title" data-i18n="comp.title"></div>
								<div class="sp-32"></div>
								<div class="lb-title" data-i18n="comp.speedTitle"></div>
								<table class="tb-style-view">
									<tbody>
										<tr>
											<td class="bg text-center w-25" data-i18n="comp.speedContract"></td>
											<td class="text-center w-25">
												<input id="contractSpeed" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.contractSpeed}">
											</td>
											<td class="bg text-center w-25" data-i18n="comp.speedMeasure"></td>
											<td class="text-center w-25">
												<input id="measureSpeed" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.measureSpeed}">
											</td>
										</tr>
									</tbody>
								</table>
								<div class="sp-16"></div>
								<textarea id="compRemark" class="w-100" rows="7">${beanInfo.compRemark}</textarea>
								<div class="sp-16"></div>
								<div class="lb-title" data-i18n="comp.noiseVibration"></div>
								<textarea id="noiseVibration" class="w-100" rows="8">${beanInfo.noiseVibration}</textarea>
							</div>
						</div>
					</div>
				</div>
            </div>
		</div>
	</div>
	<%@ include file="/WEB-INF/jsp/sche/changeStatusPop.jsp"%>
	<script type="text/javascript">
	    let _scheUid = "${bean.uid}";
	    let _commanderList = [];
	    let _mainCrewList = [];
	    let _crewCntList = [];
	    let _tcCntList = [];
	    let _status = "${status}";
	    let _ongoMin = "${ongoMin}";
  	
	  	<c:forEach var="item" items="${listCommander}">
	  		_commanderList.push({
	 			name: "${item.name}",
	 			phone: "${item.phone}",
	 			mainSub: "${item.mainSub}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listMainCrew}">
	  		_mainCrewList.push({
	 			name: "${item.name}",
	 			phone: "${item.phone}",
	 			workType2: "${item.workType2}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listCrewCnt}">
	  		_crewCntList.push({
	 			cnt: "${item.cnt}",
	 			kind: "${item.kind}"
	 		});
	  	</c:forEach>
  	
	  	<c:forEach var="item" items="${listTcCnt}">
	  		_tcCntList.push(${item});
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
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/resultInfo.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/changeStatusPop.js"></script>
</body>
</html>
