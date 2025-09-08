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

	<!-- Gantt Chart -->
	<link href="${pageContext.request.contextPath}/vendors/chart/jsGanttImp/jsgantt.css" rel="stylesheet" type="text/css">
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/bootstrap/css/bootstrap-table.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/all.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/vendors/fontawesome/css/v4-shims.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/custom.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/common.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/css/ssLineGanttChartPopChart.css" rel="stylesheet">
	<style>
		.ui-timepicker-container {
			z-index:1151 !important;
		}
	</style>
</head>
<body>
	<div class="main_container px-3 pt-2">
		<div class="row">
			<div class="col">
				<div class="d-flex">
					<span class="header-title" id="popChartTitle"></span>
				</div>
				<div class="sp-8"></div>
				<div class="d-flex">
					<div class="input-wrap mg-r-4">
           				<input id="chartSearchInput" type="text" placeholder="" data-i18n="[placeholder]chartBtnSearch">
           				<button id="chartSearchBtn"><img src="${pageContext.request.contextPath}/img/new/search.png"></button>
       				</div>
       				<button id="chartSearchBtnPrev" class="bt-obj bt-secondary"><img src="${pageContext.request.contextPath}/img/new/arrow_l.png" class="bt-icon"><span data-i18n="chartBtnPrev"></span></button>
       				<button id="chartSearchBtnNext" class="bt-obj bt-secondary"><span data-i18n="chartBtnNext"></span><img src="${pageContext.request.contextPath}/img/new/arrow_r.png" class="bt-icon-end"></button>
					<div class="flex-grow-1 d-flex align-items-center ml-2"><div id="chartSearchMsg"></div></div>
					<button type="button" class="bt-obj bt-secondary svg" onClick="showShipCondModal()">
						<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
						<span data-i18n="btnShipCond"></span>
					</button>
					<button type="button" class="bt-obj bt-secondary svg" onClick="viewReport()">
						<img src="${pageContext.request.contextPath}/img/i_btn_report.svg" class="bt-icon" height="16px">
						<span data-i18n="btnReport"></span>
					</button>
					<button type="button" class="bt-obj bt-secondary svg" onClick="refreshChart()">
						<img src="${pageContext.request.contextPath}/img/i_btn_reverif.svg" class="bt-icon" height="16px">
						<span data-i18n="btnRef"></span>
					</button>
					<button type="button" class="bt-obj bt-primary" onClick="applyChart()">
						<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
						<span data-i18n="btnApply"></span>
					</button>
				</div>
				<div>
					<input type="hidden" id="parentPeriod" />
					<input type="hidden" id="parentSdate" />
					<input type="hidden" id="parentEdate" />
					<input type="hidden" id="hullnum" />
				</div>
				<!-- Parent Data List  END-->
				<div class="x_content border" id="chartPanel">
					<div style="display: block;" id="scheduleManager"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- The Tooltip-->
	<div id="chartTooltip" class="tooltip"></div>

	<!-- The Schedual Detail Modal -->
	<div id="scheduleDetailModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="scheduleDetailModal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<!-- Modal content -->
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="modal.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body pop-main-scroll-container">
					<div class="pop-title" data-i18n="modal.titleinfo"></div>
					<table class="tb-style-view">
						<colgroup>
							<col width="20%" />
							<col width="30%" />
							<col width="20%" />
							<col width="30%" />
						</colgroup>
						<tr>
							<td data-i18n="modal.cate"></td>
							<td><input type="text" name="category" disabled/></td>
							<td data-i18n="modal.tcnum"></td>
							<td><input type="text" name="scheTcnum" data-codeuid="" value="" disabled/></td>
						</tr>
						<tr>
							<td data-i18n="modal.desc"></td>
							<td colspan="3"><input type="text" name="desc" disabled/></td>
						</tr>
						<tr>
							<td data-i18n="modal.ctype"></td>
							<td><input type="text" name="ctype" disabled/></td>
							<td data-i18n="modal.loadrate"></td>
							<td><input type="text" name="loadrate" /></td>
						</tr>
						<tr>
							<td data-i18n="modal.dtype"></td>
							<td><input type="text" name="dtype" class="" disabled/></td>
							<td data-i18n="modal.seq"></td>
							<td><input type="text" name="seq" class="" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');"/></td>
						</tr>
						<tr class="d-none">
							<td data-i18n="modal.sdate"></td>
							<td><input type="date" name="sdate" class="" /></td>
							<td data-i18n="modal.stime"></td>
							<td><input type="time" name="stime" class="" /></td>
						</tr>
						<tr class="d-none">
							<td data-i18n="modal.edate"></td>
							<td><input type="date" name="edate" class="" /></td>
							<td data-i18n="modal.etime"></td>
							<td><input type="time" name="etime" class="" /></td>
						</tr>
						<tr>
							<td data-i18n="modal.sdate"></td>
							<td colspan="2"><input id="sdateTime" type="datetime-local" name="sdateTime" class="" /></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.edate"></td>
							<td colspan="2"><input id="edateTime" type="datetime-local" name="edateTime" class="" /></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.per"></td>
							<td><input type="text" name="per" class="" onchange="changePer()"/></td>
							<td data-i18n="modal.readTm"></td>
							<td><input type="text" name="readytime" class="" /></td>
						</tr>
						<tr>
							<td data-i18n="modal.sametcnum"></td>
							<td colspan="3"><input type="text" name="sametcnum" class="" /></td>
						</tr>
					</table>
					<div class="sp-40"></div>
					<div class="pop-title d-flex align-items-center">
						<div data-i18n="modal.titleperformance"></div>
						<div class="ml-auto">
							<button onclick="setPerformanceDate()" class="bt-obj bt-primary bt-sm">
								<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px"><span data-i18n="btnSync"></span>
							</button>
						</div>
					</div>
					<table class="tb-style-view">
						<colgroup>
							<col width="20%" />
							<col width="30%" />
							<col width="20%" />
							<col width="30%" />
						</colgroup>
						<tr class="d-none">
							<td data-i18n="modal.performancesdate"></td>
							<td><input type="date" name="performancesdate" class="" /></td>
							<td data-i18n="modal.performancestime"></td>
							<td><input type="time" name="performancestime" class="" /></td>
						</tr>
						<tr class="d-none">
							<td data-i18n="modal.performanceedate"></td>
							<td><input type="date" name="performanceedate" class="" /></td>
							<td data-i18n="modal.performanceetime"></td>
							<td><input type="time" name="performanceetime" class="" /></td>
						</tr>
						<tr>
							<td data-i18n="modal.performancesdate"></td>
							<td colspan="2"><input id="performancesdateTime" type="datetime-local" name="performancesdateTime" class="" /></td>
							<td></td>
						</tr>
						<tr>
							<td data-i18n="modal.performanceedate"></td>
							<td colspan="2"><input id="performanceedateTime" type="datetime-local" name="performanceedateTime" class="" /></td>
							<td></td>
						</tr>
					</table>
					<div class="sp-16"></div>
				  	<div class="form-check align-middle text-right">
  						<input id="detailPopIsPostpone" type="checkbox" class="form-check-input">
  						<label for="detailPopIsPostpone" class="form-check-label" data-i18n="modal.isPostpone"></label>
					</div>
					<input type="hidden" name="uid" />
					<input type="hidden" name="schedinfouid" />
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" aria-label="Close" data-i18n="modal.btnClose"></button>
					<button class="bt-obj bt-primary save" data-i18n="modal.btnOk"></button>
					<button class="bt-obj bt-danger" onclick="delTc(true)" data-i18n="modal.btnDel"></button>
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
							<td><input type="text" id="newTcModalCtype" class=""/></td>
							<td data-i18n="newTcModal.dtype"></td>
							<td><input type="text" id="newTcModalDtype" class=""/></td>
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
						<c:when test="${bean.isOff eq 'Y'}">
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

	<!-- ship cond modal start -->
	<div class="modal fade" id="ship_cond_modal" tabindex="-1" role="dialog" aria-labelledby="ship_cond_pop" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="shipcondPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex flex-row-reverse pop-op-area">
						<button onClick="shipcondPopAddChild()" class="bt-obj bt-primary">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="btnAdd"></span>
						</button>
					</div>
					<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
							<tr>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="shipcondPop.list.type"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="shipcondPop.list.sdate"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="shipcondPop.list.stime"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="shipcondPop.list.edate"></span></div></th>
								<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="shipcondPop.list.etime"></span></div></th>
								<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="shipcondPop.list.del"></span></div></th>
							</tr>
							</thead>
							<tbody id="shipcondPopList"></tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="shipcondPop.btnClose"></button>
					<button class="bt-obj bt-primary" onclick="insertShipCond()">
						<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
						<span data-i18n="shipcondPop.btnNew">Create</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- ship cond modal end -->

	<script>

		var shipcondtypeList = new Array();

		<c:forEach items="${listshipcondtype}" var="shipcondtype">
		shipcondtypeList.push({
			'value': '${shipcondtype.val}',
			'desc': '${shipcondtype.description}'
		});
		</c:forEach>

	</script>

	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jqueryui/jquery-ui.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.timepicker.min.js"></script>

	<!-- chart -->
	<script src="${pageContext.request.contextPath}/vendors/chart/chart.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-adapter-date-fns.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/chartjs-plugin-datalabels.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/chart/jsGanttImp/jsgantt.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-table.min.js"></script>
	<!-- Font Awesome -->
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>

	<!-- system -->
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/ssLineGanttChartPopChart.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/detail_draw_charts.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/popModify_SchedulerChart.js"></script>
</body>
</html>
