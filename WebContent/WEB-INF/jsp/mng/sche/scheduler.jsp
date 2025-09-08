<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_PLAN_SCHE_R'}">
		<c:set var="P_PLAN_SCHE_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_PLAN_SCHE_W'}">
		<c:set var="P_PLAN_SCHE_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_PLAN_SCHE_R and empty P_PLAN_SCHE_W}">
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
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.shipType"></div>
							<select id="shipType" class="">
                                <option value="ALL" data-i18n="listOp.typeAll"></option>
                                <c:forEach var="shiptype" items="${listShip}">
                                    <option value="${shiptype.val}">${shiptype.description}</option>
                                </c:forEach>
                            </select>
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.hullnum"></div>
							<input type="text" class="" id="hullnum">
						</div>
						<div class="col-auto">
							<div class="lb-title" data-i18n="listOp.pic"></div>
							<input type="text" class="" id="pic">
						</div>
						<div class="col">
							<div class="lb-title">&nbsp;</div>
							<div id="searchBtn">
								<button class="bt-obj bt-primary" onclick="getScheduleList(1)">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.btnSearch"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="sp-24"></div>
				<div class="tb-area">
					<div class="d-flex flex-row-reverse">
                   		<c:if test="${P_PLAN_SCHE_W}">
                   			<a href="${pageContext.request.contextPath}/mng/sche/newScheduler.html">
								<button class="bt-obj bt-secondary svg">
									<img src="${pageContext.request.contextPath}/img/i_btn_new.svg" class="bt-icon" height="16px">
									<span data-i18n="btnNew"></span>
								</button>
							</a>
                   			<button class="bt-obj bt-secondary svg" onClick="popChangeStatusModal()">
								<img src="${pageContext.request.contextPath}/img/i_btn_newstatus.svg" class="bt-icon" height="16px">
								<span data-i18n="btnChange"></span>
							</button>
							<button class="bt-obj bt-danger-outline svg" onClick="popDeleteScheModal()">
								<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
								<span data-i18n="btnDel"></span>
							</button>
						</c:if>
                   	</div>
                   	<div class="sp-16"></div>
					<div class="tb-wrap">
						<table id="tbList" class="tb-style">
							<thead>
		                    	<tr>
	                                <th><div class="tb-th-col"><span class="tb-th-content"><input type="checkbox" id="listAllChk"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list0" onclick="tbAlign(this, 0)"><span class="tb-th-content" data-i18n="list.hullnum"></span></div></th>
	                                <th><div class="tb-th-col"><span class="tb-th-content" data-i18n="list.trialKey"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list1" onclick="tbAlign(this, 1)"><span class="tb-th-content" data-i18n="list.regOwner"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list2" onclick="tbAlign(this, 2)"><span class="tb-th-content" data-i18n="list.shipType"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list3" onclick="tbAlign(this, 3)"><span class="tb-th-content" data-i18n="list.series"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list4" onclick="tbAlign(this, 4)"><span class="tb-th-content" data-i18n="list.schedType"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list5" onclick="tbAlign(this, 5)"><span class="tb-th-content" data-i18n="list.sdate"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list6" onclick="tbAlign(this, 6)"><span class="tb-th-content" data-i18n="list.edate"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list7" onclick="tbAlign(this, 7)"><span class="tb-th-content" data-i18n="list.trialStatus"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list8" onclick="tbAlign(this, 8)"><span class="tb-th-content" data-i18n="list.insertName"></span></div></th>
	                                <th><div class="tb-th-col cursor-pointer tb-th-col-align" id="list9" onclick="tbAlign(this, 9)"><span class="tb-th-content" data-i18n="list.insertdate"></span></div></th>
	                            	<th><div class="tb-th-col-last"><span class="tb-th-content" data-i18n="list.onoff"></span></div></th>
	                            </tr>
		                  	</thead>
							<tbody id="schedulelist">
								<tr>
									<td class="text-center" colspan="13" data-i18n="share:noList"></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div>
				</div>
            </div>
		</div>
	</div>
	<!-- Change Status Modal -->
	<div class="modal fade" id="change_status_modal" tabindex="-1" role="dialog" aria-labelledby="change_status_modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" data-i18n="changePop.title"></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
         			<span data-i18n="changePop.msg"></span>
         			<div class="sp-40"></div>
					<div class="pop-inner-title" data-i18n="changePop.selectStatus"></div>
					<select class="w-100" id="changeStatusSel">
						<option value="ACT">Active</option>
						<option value="INACT">Inactive</option>
					</select>
				</div>
				<div class="modal-footer">
					<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="changePop.btnClose"></button>
					<button class="bt-obj bt-primary" onClick="changeStatus()" data-i18n="changePop.btnChange"></button>
				</div>
			</div>
		</div>
	</div>
	
	<!--delete modal-->
	<div class="modal fade" id="del_modal" tabindex="-1" role="dialog" aria-labelledby="del_modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-body text-center pop-alert">
		        	<div class="pop-alert-title" data-i18n="delPop.title"></div>
		        	<div class="pop-alert-msg" data-i18n="delPop.msg"></div>
          			<button class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="delPop.btnClose"></button>
		        	<button class="bt-obj bt-primary" onClick="deleteSchedule()">
          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
						<span data-i18n="delPop.btnDel"></span>
          			</button>
				</div>
			</div>
		</div>
	</div>
  	
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
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/scheduler.js"></script>
</body>
</html>