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
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/planChart.html?uid=${bean.uid}" data-i18n="tabChart"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/planCrew.html?uid=${bean.uid}" data-i18n="tabCrew"></a></div>
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/sche/planInfo.html?uid=${bean.uid}" data-i18n="tabInfo"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/planDepartureReport.html?uid=${bean.uid}" data-i18n="tabReport"></a></div>
                    <div class="tab-extra-area mr-auto">
                        <a href="${pageContext.request.contextPath}/sche/planChart.html?uid=${bean.uid}"><button class="bt-obj bt-secondary" data-i18n="statusBtnPlan"></button></a>
                        <a href="${pageContext.request.contextPath}/sche/resultChart.html?uid=${bean.uid}"><button class="bt-obj bt-tertiary" data-i18n="statusBtnResult"></button></a>
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
							<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
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
								<td id="commander01" class="text-center"></td>
								<td id="commander02" class="text-center"></td>
								<td id="crew01" class="text-center"></td>
								<td id="crew02" class="text-center"></td>
								<td id="crew03" class="text-center"></td>
								<td id="crew04" class="text-center"></td>
								<td id="crew05" class="text-center"></td>
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
							<div class="lb-title" data-i18n="otherTrial"></div>
							<div class="row m-0 p-0 bd-top-bottom">
								<div class="col d-flex align-items-center justify-content-center px-0 py-1">
									<div id="trialList1" class="flex-grow-1 text-center">
										<c:if test="${beanInfo.trial1SchedulerInfoUid > 0}">${beanInfo.trial1HullNum} (${beanInfo.trial1ShipType})</c:if>
									</div>
									<button class="bt-obj bt-primary" onclick="showTrialSearchPop(1)"><i class="fa-solid fa-plus"></i></button>
									<button class="bt-obj bt-primary" onclick="delTrialList(1)"><i class="fa-solid fa-minus"></i></button>
								</div>
								<div class="col d-flex align-items-center justify-content-center px-0 py-1">
									<div id="trialList2" class="flex-grow-1 text-center">
										<c:if test="${beanInfo.trial2SchedulerInfoUid > 0}">${beanInfo.trial2HullNum} (${beanInfo.trial2ShipType})</c:if>
									</div>
									<button class="bt-obj bt-primary" onclick="showTrialSearchPop(2)"><i class="fa-solid fa-plus"></i></button>
									<button class="bt-obj bt-primary" onclick="delTrialList(2)"><i class="fa-solid fa-minus"></i></button>
								</div>
							</div>
							<div class="sp-16"></div>
							<div class="lb-title" data-i18n="itpPunch.title"></div>
							<table class="tb-style-view">
								<thead>
									<tr>
										<th><div class="tb-th-col"><span class="tb-th-content">&nbsp;</span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="itpPunch.total"></span></div></th>
										<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="itpPunch.trial"></span></div></th>
										<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="itpPunch.outfit"></span></div></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="text-center" data-i18n="itpPunch.itp"></td>
										<td class="text-center">
											<table class="tb-style-view-none">
												<tr>
													<td>
														<input id="itpTotalRemain" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.rem" value="${beanInfo.itpTotalRemain}">
													</td>
													<td><span class="px-2">/</span></td>
													<td>
														<input id="itpTotalBase" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.trem" value="${beanInfo.itpTotalBase}">
													</td>
												</tr>
											</table>
										</td>
										<td class="text-center">
											<table class="tb-style-view-none">
												<tr>
													<td>
														<input id="itpTrialRemain" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.rem" value="${beanInfo.itpTrialRemain}">
													</td>
													<td><span class="px-2">/</span></td>
													<td>
														<input id="itpTrialBase" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.trem" value="${beanInfo.itpTrialBase}">
													</td>
												</tr>
											</table>
										</td>
										<td class="text-center">
											<table class="tb-style-view-none">
												<tr>
													<td>
														<input id="itpOutfittingRemain" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.rem" value="${beanInfo.itpOutfittingRemain}">
													</td>
													<td><span class="px-2">/</span></td>
													<td>
														<input id="itpOutfittingBase" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]itpPunch.trem" value="${beanInfo.itpOutfittingBase}">
													</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr>
										<td class="text-center" data-i18n="[html]itpPunch.punch"></td>
										<td class="text-center"><input id="punchTotal" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.punchTotal}"></td>
										<td class="text-center"><input id="punchTrial" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.punchTrial}"></td>
										<td class="text-center"><input id="punchOutfitting" onkeyup="this.value=numberFormat(this.value, false, false, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.punchOutfitting}"></td>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
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
						</div>
						<div class="col-auto py-0 px-2"></div>
						<div class="col p-0">
							<div class="lb-title" data-i18n="fuel.title"></div>
							<table class="tb-style-view">
								<tbody>
									<tr>
										<td class="to-th text-center w_15" rowSpan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="fuel.fuel"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.hfo"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.mgo"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="fuel.mdo"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="fuel.lng"></span></div></td>
									</tr>
									<tr>
										<td class="text-center"><input id="fuelHfoScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelHfoScheduler}"></td>
										<td class="text-center"><input id="fuelMgoScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMgoScheduler}"></td>
										<td class="text-center"><input id="fuelMdoScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelMdoScheduler}"></td>
										<td class="text-center"><input id="fuelLngScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.fuelLngScheduler}"></td>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
							<table class="tb-style-view">
								<tbody>
									<tr>
										<td class="to-th text-center w_15" rowSpan="2"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="draft.draft"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="draft.fwd"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col"><span class="tb-th-content" data-i18n="draft.mid"></span></div></td>
										<td class="to-th text-center"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="draft.aft"></span></div></td>
									</tr>
									<tr>
										<td class="text-center"><input id="draftFwdScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftFwdScheduler}"></td>
										<td class="text-center"><input id="draftMidScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftMidScheduler}"></td>
										<td class="text-center"><input id="draftAftScheduler" onkeyup="this.value=numberFormat(this.value, false, true, false)" type="text" data-i18n="[placeholder]share:data" value="${beanInfo.draftAftScheduler}"></td>
									</tr>
								</tbody>
							</table>
							<div class="sp-16"></div>
							<div class="lb-title" data-i18n="remark"></div>
							<textarea id="remark" class="w-100" rows="5">${beanInfo.remark}</textarea>
						</div>
					</div>
					
                </div>
            </div>
		</div>
	</div>
	<!-- 시운전 실적 modal-->
  	<div class="modal fade" id="trialSearchPop" tabindex="-1" role="dialog" aria-labelledby="trialSearchPop" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
      		<div class="modal-content">
        		<div class="modal-header">
          			<h5 class="modal-title" data-i18n="trialSearchPop.title"></h5>
          			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
        		</div>
        		<div class="modal-body">
        			<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="trialSearchPop.seriesTitle"></div>
        					<select id="trialSearchPopHullNum">
	       						<option value="ALL" data-i18n="trialSearchPop.all"></option>
	       						<c:forEach var="tmp" items="${listSeries}">
	       							<option value="${tmp.shipNum}">
	       								${tmp.shipNum}
	       								<c:if test="${not empty tmp.shipType}">(${tmp.shipType})</c:if>
	       							</option>
	       						</c:forEach>
	       					</select>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="trialSearchPop.wordTitle"></div>
        					<input id="trialSearchPopWord" type="text" data-i18n="[placeholder]trialSearchPop.word">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="searchTrial()">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchVersionHistoryPop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
	          			<table class="tb-style">
	            			<thead>
	              				<tr>
	                				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trialSearchPop.listHull"></span></div></th>
	                				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trialSearchPop.listType"></span></div></th>
	                				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trialSearchPop.listDesc"></span></div></th>
	                				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trialSearchPop.listStart"></span></div></th>
	                				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="trialSearchPop.listEnd"></span></div></th>
	                				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="trialSearchPop.listSelect"></span></div></th>
	              				</tr>
	            			</thead>
	            			<tbody id="trialSearchPopList">
	            				<tr><td class="text-center" colspan="6" data-i18n="share:noList"></td></tr>
	            			</tbody>
	          			</table>
	          		</div>
        		</div>
        		<div class="modal-footer">
          			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="trialSearchPop.btnClose"></button>
        		</div>
      		</div>
    	</div>
  	</div>
	<script type="text/javascript">
	    let _scheUid = "${bean.uid}";
	    let _commanderList = [];
	    let _mainCrewList = [];
	    let _crewCntList = [];
	    let _tcCntList = [];
	    let _trialList1 = 0;
		let _trialList2 = 0;
		let _status = "${status}";
  	
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
	  	
	  	<c:if test="${not empty beanInfo.trial1SchedulerInfoUid}">
	  		_trialList1 = ${beanInfo.trial1SchedulerInfoUid};
	  	</c:if>
	  	
	  	<c:if test="${not empty beanInfo.trial2SchedulerInfoUid}">
	  		_trialList2 = ${beanInfo.trial2SchedulerInfoUid};
	  	</c:if>
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
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/planInfo.js"></script>
</body>
</html>
