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
	<link href="${pageContext.request.contextPath}/css/ssLineGanttChart.css" rel="stylesheet">
</head>
<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_1_2.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_1_2.jsp"%>
            <div class="main-container">
<%--             	<%@ include file="/WEB-INF/jsp/include/menu/bread_1_2.jsp"%> --%>
				<div class="tab-area">
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/sche/planChart.html?uid=${bean.uid}" data-i18n="tabChart"></a></div>
                    <c:if test="${P_RESULT_SCHE_CREW}">
                    	<div class="tab-base"><a href="${pageContext.request.contextPath}/sche/planCrew.html?uid=${bean.uid}" data-i18n="tabCrew"></a></div>
                    </c:if>
                    <c:if test="${P_RESULT_SCHE_INFO}">
                    	<div class="tab-base"><a href="${pageContext.request.contextPath}/sche/planInfo.html?uid=${bean.uid}" data-i18n="tabInfo"></a></div>
					</c:if>
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
								<button onclick="toggleScheduleMode()" class="bt-obj bt-primary">
<%-- 									<img src="${pageContext.request.contextPath}/img/new/date.png" class="bt-icon"> --%>
									<span id="toggleBtnList" data-i18n="btnList"></span>
								</button>
								<button class="bt-obj bt-primary" onClick="viewReportPrint()">
									<img src="${pageContext.request.contextPath}/img/i_btn_report.svg" class="bt-icon" height="16px">
									<span data-i18n="btnReportView"></span>
								</button>
								<a href="${pageContext.request.contextPath}/mng/sche/departure.html">
									<button class="bt-obj bt-primary"><img src="${pageContext.request.contextPath}/img/new/list.png" class="bt-icon"><span data-i18n="btnBack"></span></button>
								</a>
								<c:choose>
									<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
										<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
									</c:when>
									<c:otherwise>
										<button onclick="saveSchedule()" class="bt-obj bt-primary"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
									</c:otherwise>
								</c:choose>
							</div>
							<div class="x_content" id="chartPanel">
								<div>
									<input type="hidden" id="parentPeriod" /> 
									<input type="hidden" id="parentSdate" /> 
									<input type="hidden" id="parentEdate" />
									<input type="hidden" id="uid" value="${bean.uid}" /> 
									<input type="hidden" id="hullnum" value="${bean.hullnum}" /> 
									<input type="hidden" id="sdate" value="${bean.sdate}" /> 
									<input type="hidden" id="edate" value="${bean.edate}" /> 
									<input type="hidden" id="desc" value="${bean.description}" /> 
									<input type="hidden" id="shiptype" value="${bean.shiptype}" /> 
									<input type="hidden" id="schedtype" value="${bean.schedtype}" />
								</div>
								<div class="row" style="display: block;" id="scheduleManager"></div>
							</div>
							<div id="dDataPanel" style="display: none;">
								<div class="sp-16"></div>
								<div class="tb-wrap scroll-area-chartlist">
									<table id="tbNewSchedulerList" class="tb-style">
										<thead>
											<tr>
												<th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="scheRowAllChk"></span></div></th>
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
										<tbody id="getScheRowList">
											<tr>
												<td class="text-center" colspan="16" data-i18n="share:noList"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
            </div>
        </div>
    </div>

	<!-- Move Schedule Modal Start-->
	<div class="modal fade" id="move_schedule_modal" tabindex="-1" role="dialog" aria-labelledby="move_schedule_modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="movePop.title">Move Schedule</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<label for="movePopCtype" data-i18n="movePop.ctype">CType</label> 
					<select class="" id="movePopCtype" disabled>
						<option value="E_LOAD">Load</option>
						<option value="SCHE">Schedule</option>
					</select> 
					<label for="movePopCurSeq" data-i18n="movePop.curSeq">Current Sequence</label> 
					<input type="text" class=" mr-2" id="movePopCurSeq" disabled> 
					<label for="movePopSeq" data-i18n="movePop.seq">Sequence</label> 
					<input type="text" class=" mr-2" id="movePopSeq" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" onClick="moveSchedule()" data-i18n="movePop.btnMove">Move</button>
					<button type="button" class="btn btn-secondary" onClick="closeMovePop()" data-i18n="movePop.btnClose">Close</button>
				</div>
			</div>
		</div>
	</div>
	<!-- Move Schedule Modal End-->

	<!-- The Tooltip-->
	<div id="chartTooltip" class="tooltip"></div>

	<!-- The Schedual Detail Modal -->
	<div id="scheduleDetailModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="scheduleDetailModal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<!-- Modal content -->
			<div class="modal-content">
				<div class="modal-header">
					<span id="detailPopTitle" class="modal-title"></span>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div id="detailPopSubTitle" class="pop-title"></div>
					<table class="tb-style-view">
						<colgroup>
							<col width="20%" />
							<col width="30%" />
							<col width="20%" />
							<col width="30%" />
						</colgroup>
						<tr class="d-none">
							<td data-i18n="modal.cate"></td>
							<td><input type="text" name="category" class="" disabled /></td>
							<td data-i18n="modal.tcnum"></td>
							<td><input type="text" name="scheTcnum" class=" inputSearch" data-codeuid="" value="" disabled /></td>
						</tr>
						<tr class="d-none">
							<td data-i18n="modal.desc"></td>
							<td colspan="3"><input type="text" name="desc" class="" disabled /></td>
						</tr>
						<tr class="d-none">
							<td data-i18n="modal.ctype"></td>
							<td><input type="text" name="ctype" class="" disabled /></td>
							<td data-i18n="modal.dtype"></td>
							<td><input type="text" name="dtype" class="" disabled /></td>
						</tr>
						<tr>
							<td data-i18n="modal.seq"></td>
							<td><input type="text" name="seq" class="" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');" /></td>
							<td id="detailPopCdType"></td>
							<td><input type="text" name="loadrate" class="" /></td>
						</tr>
						<tr>
							<td data-i18n="modal.sdate"></td>
							<td colspan="2"><input id="detailSdateTime" type="datetime-local" name="detailSdateTime" class="" onchange="changeDateTime()"/></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.edate"></td>
							<td colspan="2"><input id="detailEdateTime" type="datetime-local" name="detailEdateTime" class="" onchange="changeDateTime()"/></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.per"></td>
							<td><input type="text" name="per" id="detailPer" class="" onchange="changePer()"/></td>
							<td data-i18n="modal.readTm"></td>
							<td><input type="text" name="readytime" class="" /></td>
						</tr>
					</table>
					<h5 class="modal-title mt-4 mb-2 d-none">
						<p data-i18n="modal.titleperformance"></p>
						<div class="float-right" style="margin-top: -48px;">
							<button type="button" class="btn btn-primary" onClick="setPerformanceDate()">
								<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px"> <span class="text-white" data-i18n="modal.btnSync"></span>
							</button>
						</div>
					</h5>
					<table class="d-none">
						<colgroup>
							<col width="20%" />
							<col width="30%" />
							<col width="20%" />
							<col width="30%" />
						</colgroup>
						<tr>
							<th data-i18n="modal.performancesdate"></th>
							<td><input type="date" name="performancesdate" class="" /></td>
							<th data-i18n="modal.performancestime"></th>
							<td><input type="time" name="performancestime" class="" /></td>
						</tr>
						<tr>
							<th data-i18n="modal.performanceedate"></th>
							<td><input type="date" name="performanceedate" class="" /></td>
							<th data-i18n="modal.performanceetime"></th>
							<td><input type="time" name="performanceetime" class="" /></td>
						</tr>
					</table>
					<div class="sp-16"></div>
				  	<div class="form-check align-middle text-right">
  						<input id="detailPopIsPostpone" type="checkbox" class="form-check-input">
  						<label for="detailPopIsPostpone" class="form-check-label" data-i18n="modal.isPostpone"></label>
					</div>
					<input type="hidden" name="uid" /> <input type="hidden" name="schedinfouid" />
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" aria-label="Close" data-i18n="modal.btnClose"></button>
					<c:choose>
						<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
							<button class="bt-obj bt-primary save" data-i18n="modal.btnOk" disabled></button>
							<button class="bt-obj bt-danger" data-i18n="modal.btnDel" disabled></button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary save" data-i18n="modal.btnOk"></button>
							<button class="bt-obj bt-danger" onclick="delTc(true)" data-i18n="modal.btnDel"></button>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
	</div>
	<!-- The Schedual Detail Modal End -->

	<!-- New TC Modal -->
	<div id="newTcModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="newTcModal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<!-- Modal content -->
			<div class="modal-content">
				<div class="modal-header">
					<span id="newTcModalTitle" class="modal-title" data-i18n="newTcModal.title"></span>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div id="newTcModalSubTitle" class="pop-title"></div>
					<table class="tb-style-view">
						<colgroup>
							<col width="20%" />
							<col width="30%" />
							<col width="20%" />
							<col width="30%" />
						</colgroup>
						<tr>
							<td data-i18n="newTcModal.cate"></td>
							<td>
								<select id="newTcModalCategory">
									<c:forEach var="cat" items="${listCode}">
									 	<option value="${cat.displaycode}">${cat.displaycode} [${cat.description}]</option>
								    </c:forEach>
								</select>
							</td>
							<td data-i18n="newTcModal.tcnum"></td>
							<td>
								<div class="d-flex align-items-center">
									<div>
										<input id="newTcModalScheTcnum" type="text" class="inputSearch">
									</div>
									<div class="flex-grow-1">
										<button class="bt-obj-adapter bt-primary bt-sm border-left-0 inputSearchBtnTemp" onClick="popSearchTcNum()"><img src="${pageContext.request.contextPath}/img/i_btn_search.svg" height="20px"></button>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.desc"></td>
							<td colspan="3"><input type="text" id="newTcModalDesc" class=""/></td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.ctype"></td>
							<td>
								<select id="newTcModalCtype">
									<option value=""></option>
									 <c:forEach var="ctype" items="${listctype}">
									 	<option value="${ctype.val}">${ctype.description}</option>
								    </c:forEach>
								</select>
							</td>
							<td data-i18n="newTcModal.dtype"></td>
							<td>
								<select id="newTcModalDtype">
									<option value=""></option>
									<c:forEach var="dtype" items="${listdtype}">
										<option value="${dtype.val}">${dtype.description}</option>
								    </c:forEach>
								</select>
							</td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.seq"></td>
							<td><input type="text" id="newTcModalSeq" class="" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');" /></td>
							<td data-i18n="newTcModal.loadrate"></td>
							<td><input type="text" id="newTcModalLoadrate" class="" /></td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.sdate"></td>
							<td colspan="2"><input id="newTcModalSdateTime" type="datetime-local" class="" onchange="newTcModalChangeDateTime()"/></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.edate"></td>
							<td colspan="2"><input id="newTcModalEdateTime" type="datetime-local" class="" onchange="newTcModalChangeDateTime()"/></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="newTcModal.per"></td>
							<td><input type="text" id="newTcModalPer" class="" onchange="newTcModalChangePer()"/></td>
							<td data-i18n="newTcModal.readTm"></td>
							<td><input type="text" id="newTcModalReadytime" class="" /></td>
						</tr> 
						<tr>
							<td data-i18n="newTcModal.sametcnum"></td>
							<td><input type="text" id="newTcModalSameTcNum" class=""/></td>
							<td></td>
							<td></td>
						</tr>
					</table>
					<div class="sp-16"></div>
				  	<div class="form-check align-middle text-right">
  						<input id="newTcModalIsPostpone" type="checkbox" class="form-check-input">
  						<label for="newTcModalIsPostpone" class="form-check-label" data-i18n="newTcModal.isPostpone"></label>
					</div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" aria-label="Close" data-i18n="newTcModal.btnClose"></button>
					<c:choose>
						<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
							<button class="bt-obj bt-primary" data-i18n="newTcModal.btnOk" disabled></button>
						</c:when>
						<c:otherwise>
							<button class="bt-obj bt-primary" onclick="saveAddTc()" data-i18n="newTcModal.btnOk"></button>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
	</div>
	<!-- New TC Modal End -->
	
	<!-- TCnum Search Modal Start -->
  	<div class="modal fade" id="newTcSearchModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="newTcSearchModal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="newTcSearchModal.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newTcSearchModal.tcnum"></div>
        					<input id="newTcSearchModalTcnum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="newTcSearchModal.desc"></div>
        					<input id="newTcSearchModalDesc" type="text">
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="newTcSearchModalSearch(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="newTcSearchModal.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
        				<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.dtype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.ctype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.load"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="newTcSearchModal.per"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="newTcSearchModal.readytm"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="newTcSearchModalList"></tbody>
						</table>
        			</div>
        			<div class="sp-16"></div>
                    <div class="pg-area" id="newTcSearchModalPagination"></div>
				</div>
				<div class="modal-footer">
					<button onclick="newTcSearchModalClose()" class="bt-obj bt-secondary" data-i18n="newTcSearchModal.btnClose"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- TCnum Search Modal End -->

	<!-- Conv Date Input Modal Start -->
	<div class="modal fade" id="set_conv_modal" tabindex="-1" role="dialog" aria-labelledby="set_conv_modal" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="setConvDatePop.title">Set Convenient Date</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-3 col-sm-12 pt-2">
							<label for="setConvDatePopSdate" data-i18n="setConvDatePop.sdate">Start Date</label> <input type="date" class=" mr-2" id="setConvDatePopSdate">
						</div>
						<div class="col-md-2 col-sm-12 pt-2">
							<label for="setConvDatePopStime" data-i18n="setConvDatePop.stime">Start Time</label> <input type="text" class="" id="setConvDatePopStime" value="">
						</div>
						<div class="col-md-3 col-sm-12 pt-2">
							<label for="setConvDatePopEdate" data-i18n="setConvDatePop.edate">End Date</label> <input type="date" class=" mr-2" id="setConvDatePopEdate">
						</div>
						<div class="col-md-2 col-sm-12 pt-2">
							<label for="setConvDatePopEtime" data-i18n="setConvDatePop.etime">End Time</label> <input type="text" class="" id="setConvDatePopEtime" value="">
						</div>
						<div class="col-md-2 col-sm-12 pt-2">
							<label for="searchTcPopSearch">&nbsp;</label>
							<div id="setConvDatePopApply">
								<button type="button" onClick="setConvDateApplyBtn()" class="btn btn-primary mg-0">
									<img src="${pageContext.request.contextPath}/img/i_btn_verif.svg" class="mr-1" height="16px"> <span class="text-white" data-i18n="setConvDatePop.btnApply">Apply</span>
								</button>
							</div>
						</div>
					</div>
					<br>
					<table class="table table-borderless table-striped jambo_table bulk_action mg-0">
						<thead>
							<tr class="headings">
								<th class="border align-middle"><input type="checkbox" id="convDataAllChk"></th>
								<th class="column-title border" data-i18n="setConvDatePop.tcnum">TC Num</th>
								<th class="column-title border" data-i18n="setConvDatePop.desc">Description</th>
								<th class="column-title border" data-i18n="setConvDatePop.sdate">Start Date</th>
								<th class="column-title border" data-i18n="setConvDatePop.stime">Start Time</th>
								<th class="column-title border" data-i18n="setConvDatePop.edate">End Date</th>
								<th class="column-title border" data-i18n="setConvDatePop.etime">End Time</th>
							</tr>
						</thead>
						<tbody id="setConvDatePopList"></tbody>
					</table>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="setConvDatePop.btnClose">Close</button>
				</div>
			</div>
		</div>
	</div>
	<!-- Conv Date Input Modal End -->
	<script type="text/javascript">
	    let _scheUid = "${bean.uid}";
	
	    // ctype, dtype 데이터
	    let ctypeList = new Array();
	    let dtypeList = new Array();
	
	    const schedtypeList = new Array();
	    
	    let _status = "${status}";
	    
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
	
	    <c:forEach items="${listschedtype}" var="item">
		    schedtypeList.push({
		        'value': '${item.val}',
		        'desc': '${item.description}'
		    })
	    </c:forEach>
	    
	    let _gHull = '';
	    let _gKey = '';
	    let _gShipType = '';
	    
	    <c:if test="${not empty bean and bean['class'].simpleName == 'SchedulerInfoBean'}">
	    	_gHull = "${bean.hullnum}";
	    	_gKey = "${bean.trialKey}";
	    	_gShipType = "${bean.shiptype}";
		</c:if>
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
	<script src="${pageContext.request.contextPath}/vendors/loading/loadingOverlay.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/ssLineGanttChartPlan.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/planChart.js"></script>
</body>
</html>
