<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_DB_PJT_W'}">
		<c:set var="P_DB_PJT_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_DB_PJT_W}">
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
</head>

<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_3_4.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_3_4.jsp"%>
            <div class="main-container">
<%-- 				<%@ include file="/WEB-INF/jsp/include/menu/bread_3_4.jsp"%> --%>
				<div class="sec-option-card">
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="shipType"></div>
							<select id="shiptype">
								<option value=""></option>
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}">${shiptype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="schedType"></div>
							<select id="schedtype">
								<option value=""></option>
								<c:forEach var="schedtype" items="${listschedtype}">
									<option value="${schedtype.val}">${schedtype.description}</option>
								</c:forEach>
							</select>
						</div>
						<div class="col-md-3 col-sm-12">
							<div class="lb-title" data-i18n="status"></div>
							<select id="status" class=""  disabled>
								<option value="ACT" selected>Active</option>
          						<option value="INACT">Inactive</option>
							</select>
						</div>
					</div>
					<div class="sp-16"></div>
					<div class="row">
						<div class="col-md-6 col-sm-12">
							<div class="lb-title" data-i18n="desc"></div>
							<input id="desc" type="text" class="w-100">
						</div>
						<div class="col-md-6 col-sm-12">
							<div class="lb-title" data-i18n="revnum"></div>
							<input id="revnum" type="text" class="" value="0" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');">
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
						<button class="bt-obj bt-primary" onClick="saveScheduleCode()">
							<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="bt-icon" height="16px">
							<span data-i18n="btnSave"></span>
						</button>
               			<button class="bt-obj bt-secondary svg" onClick="showAddMultiSearchTcPop()">
							<img src="${pageContext.request.contextPath}/img/i_btn_add.svg" class="bt-icon" height="16px">
							<span data-i18n="btnAdd"></span>
						</button>
						<a href="${pageContext.request.contextPath}/mng/scheBasic/scheduleCode.html">
							<button class="bt-obj bt-secondary svg">
								<img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="bt-icon" height="16px">
								<span data-i18n="btnList"></span>
							</button>
						</a>
						<button class="bt-obj bt-secondary svg" onclick="getScheduleCode()">
							<img src="${pageContext.request.contextPath}/img/i_logout.svg" class="bt-icon" height="16px">
							<span data-i18n="btnLoad"></span>
						</button>
                   	</div>
                   	<div class="sp-16"></div>
					<div id="tbWrap" class="tb-wrap tb-wrap-height-op2-btn">
						<table id="tbModSchduleCodeDetList"  class="tb-style">
							<thead>
								<tr>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.codelv"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.displaycode"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.desc"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.ctype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadstr"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.loadrate"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.dtype"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.per"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.readTm"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.seq"></span></div></th>
									<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.sametcnum"></span></div></th>
									<th><div class="tb-th-col-last"><span class="tb-th-content">&nbsp;</span></div></th>
								</tr>
							</thead>
							<tbody id="getScheCodeDetList"></tbody>
						</table>
					</div>
				</div>
            </div>
		</div>
	</div>
	<!-- TCnum Search Modal Start -->
	<div class="modal fade" id="search_tcnum_modal" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
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
			           				<th class="th-w-120"><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchTcPop.desc"></span></div></th>
			           				<th class="th-w-90"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchTcPop.codelv"></span></div></th>
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

	<!-- Search schedule code Modal Start -->
	<div class="modal fade" id="search_schedule_code_modal" tabindex="-1" role="dialog" aria-labelledby="search_schedule_code_modal" aria-hidden="true">
		<div class="modal-dialog modal-xl modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="searchScheCodePop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchScheCodePop.schedType"></div>
        					<select id="searchSchePopSchedType" class="">
								<option value="ALL" data-i18n="searchScheCodePop.typeAll"></option>
								<c:forEach var="schedtype" items="${listschedtype}">
									<option value="${schedtype.val}">${schedtype.description}</option>
								</c:forEach>
							</select>
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="searchScheCodePop.shipType"></div>
        					<select id="searchSchePopShipType" class="">
								<option value="ALL" data-i18n="searchScheCodePop.typeAll"></option>
								<c:forEach var="shiptype" items="${listShip}">
									<option value="${shiptype.val}">${shiptype.description}</option>
								</c:forEach>
							</select>
        				</div>
        				<div>
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="getScheduleCodeInfoList(1)">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="searchScheCodePop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap pop-op-tb-scroll-area">
						<table class="tb-style">
							<thead>
	         					<tr>
			           				<th><div class="tb-th-col"><span class="tb-th-content">&nbsp;</span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchScheCodePop.list.shipType"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchScheCodePop.list.desc"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchScheCodePop.list.schedtype"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="searchScheCodePop.list.status"></span></div></th>
			           				<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="searchScheCodePop.list.revnum"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="searchSchePopScheduleCodelist">
								<tr>
									<td class="text-center" colspan="6" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="sp-16"></div>
                    <div class="pg-area" id="paginationforsearchSchePopScheduleCodelist"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="searchScheCodePop.close"></button>
					<button class="bt-obj bt-primary" onclick="setScheduleCodeInfo()" data-i18n="searchScheCodePop.confirm"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- Search schedule info Modal Start -->
	
	<!-- Add Multi - TCnum Search Modal Start -->
	<div class="modal fade" id="add_multi_search_tcnum_modal" tabindex="-1" role="dialog" aria-labelledby="add_multi_search_tcnum_modal" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="addMultiSearchTcPop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="d-flex pop-op-area">
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="addMultiSearchTcPop.searchTcnum"></div>
        					<input id="addMultiSearchTcPopTcnum" type="text">
        				</div>
        				<div class="pop-op-obj">
        					<div class="pop-inner-title" data-i18n="addMultiSearchTcPop.searchDesc"></div>
        					<input id="addMultiSearchTcPopDesc" type="text">
        				</div>
        				<div class="ml-auto">
        					<div class="pop-inner-title">&nbsp;</div>
        					<button class="bt-obj bt-primary" onclick="addMultiSearchTcPopSearch()">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="addMultiSearchTcPop.btnSearch"></span>
							</button>
        				</div>
        			</div>
        			<div class="tb-wrap multi-add-pop-op-tb-scroll-area border-bottom border-dark">
						<table class="tb-style">
							<thead>
	         					<tr>
	         						<th class="th-w-90"><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="addMultiSearchTcPopListAllChk"></span></div></th>
			           				<th class="th-w-120"><div class="tb-th-col"><span class="tb-th-content" data-i18n="addMultiSearchTcPop.tcnum"></span></div></th>
			           				<th><div class="tb-th-col"><span class="tb-th-content" data-i18n="addMultiSearchTcPop.desc"></span></div></th>
			           				<th class="th-w-90"><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="addMultiSearchTcPop.codelv"></span></div></th>
	         					</tr>
							</thead>
							<tbody id="addMultiSearchTcPopList"></tbody>
						</table>
					</div>
					<div class="sp-32"></div>
					<div id="addMultiSearchTcPopSelectList" class="multi-add-tc-list-area inner-scroll-container"></div>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-primary" onclick="addMultiSearchTcPopAddList()" data-i18n="addMultiSearchTcPop.btnAdd"></button>
				</div>
			</div>
		</div>
	</div>
	<!-- TCnum Search Modal End -->

	<script>
		// ctype, dtype 데이터 
		var ctypeList = new Array();
		var dtypeList = new Array();
		var schedtypeList = new Array();
		
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

		<c:forEach items="${listschedtype}" var="schedtype">
		schedtypeList.push({
			'value': '${schedtype.val}',
			'desc': '${schedtype.description}'
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
	<script src="${pageContext.request.contextPath}/js/mng/scheBasic/new_scheduleCode.js"></script>
</body>
</html>
