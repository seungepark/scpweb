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
</c:forEach>
<c:if test="${(empty P_RESULT_SCHE_R and empty P_RESULT_SCHE_W) or empty P_RESULT_SCHE_CREW}">
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
                    <div class="tab-base active"><a href="${pageContext.request.contextPath}/sche/resultCrew.html?uid=${bean.uid}" data-i18n="tabCrew"></a></div>
                    <div class="tab-base"><a href="${pageContext.request.contextPath}/sche/resultInfo.html?uid=${bean.uid}" data-i18n="tabInfo"></a></div>
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
                <div class="tb-area">
                	<div class="d-flex flex-row-reverse">
                		<c:choose>
							<c:when test="${bean.isOff eq 'Y' or empty P_RESULT_SCHE_W}">
								<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-primary" onclick="save()"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:otherwise>
						</c:choose>
                   		<button class="bt-obj bt-primary" onclick="popDeleteCrewModal()"><i class="fa-solid fa-minus"></i></button>
						<button class="bt-obj bt-primary" onclick="addCrew()"><i class="fa-solid fa-plus"></i></button>
                   		<button class="bt-obj bt-primary mr-5" onclick="setInOutDate()" data-i18n="list.btnInOut"></button>
                   		<input type="date" id="ioDate"/>
                   		<div class="form-check form-check-inline">
						  	<input class="form-check-input" type="radio" name="ioCheck" id="ioCheckOut" value="U">
						  	<label class="form-check-label" for="ioCheckOut" data-i18n="list.out"></label>
						</div>
                   		<div class="form-check form-check-inline">
						  	<input class="form-check-input" type="radio" name="ioCheck" id="ioCheckIn" value="B" checked="checked">
						  	<label class="form-check-label" for="ioCheckIn" data-i18n="list.in"></label>
						</div>
                   	</div>
                   	<div class="sp-8"></div>
                   	<div class="d-flex">
						<select id="filterKind" onchange="searchList()" class="mr-3">
							<option value="ALL">[구분] All</option>
							<option value="SHI-A">SHI-기술지원직</option>
							<option value="SHI-B">SHI-생산직</option>
							<option value="SHI-C">SHI-협력사</option>
							<option value="OUTSIDE">외부</option>
						</select>
						<select id="filterWorkType1" onchange="setFilterWorkType2(this.value)" class="mr-3">
							<option value="ALL">[역할 1] All</option>
							<option value="A">시운전</option>
							<option value="B">생산</option>
							<option value="C">설계연구소</option>
							<option value="D">지원</option>
							<option value="E">외부</option>
						</select>
						<select id="filterWorkType2" onchange="searchList()" class="mr-3">
							<option value="ALL">[역할 2] All</option>
						</select>
						<select id="filterMainSub" onchange="searchList()" class="mr-3">
							<option value="ALL">[정/부] All</option>
							<option value="N">-</option>
							<option value="M">정</option>
							<option value="S">부</option>
						</select>
						<select id="filterFoodStyle" onchange="searchList()" class="mr-3">
							<option value="ALL">[한식/양식] All</option>
							<option value="K">한식</option>
							<option value="W">양식</option>
						</select>
						<div class="input-wrap">
               				<input id="filterWord" type="text" placeholder="검색어">
               				<button id="filterSearchBtn" onclick="searchList()"><img src="${pageContext.request.contextPath}/img/new/search.png"></button>
           				</div>
					</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap">
                        <table id="tbList" class="tb-style">
                            <thead>
                                <tr id="tbHeader"></tr>
                            </thead>
                            <tbody id="tbRowList">
                                <tr>
									<td class="text-center" data-i18n="share:noList">There is no data to display</td>
								</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
		</div>
	</div>
	<!--delete modal-->
  	<div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="delModal" aria-hidden="true">
    	<div class="modal-dialog modal-dialog-centered" role="document">
      		<div class="modal-content">
      			<div class="modal-body text-center pop-alert">
		        	<div class="pop-alert-title" data-i18n="delPop.title"></div>
		        	<div class="pop-alert-msg" data-i18n="delPop.msg"></div>
          			<button type="button" class="bt-obj bt-secondary" data-dismiss="modal" data-i18n="delPop.btnClose">Close</button>
		        	<button type="button" class="bt-obj bt-primary" onClick="deleteCrew()">
          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
						<span data-i18n="delPop.btnDel"></span>
          			</button>
				</div>
      		</div>
    	</div>
  	</div>
  	<%@ include file="/WEB-INF/jsp/sche/changeStatusPop.jsp"%>
	<script type="text/javascript">
	    let _scheUid = "${bean.uid}";
	    let _sDate = "${bean.sdate}";
	    let _eDate = "${bean.edate}";
	    let _crewList = [];
	    let _status = "${status}";
	    let _ongoMin = "${ongoMin}";
  	
	  	<c:forEach var="item" items="${list}">
	  		_crewList.push({
	 			uid: "${item.uid}",
	 			kind: "${item.kind}",
	 			company: "${item.company}",
	 			department: "${item.department}",
	 			name: "${item.name}",
	 			rank: "${item.rank}",
	 			idNo: "${item.idNo}",
	 			workType1: "${item.workType1}",
	 			workType2: "${item.workType2}",
	 			mainSub: "${item.mainSub}",
	 			foodStyle: "${item.foodStyle}",
	 			personNo: "${item.personNo}",
	 			phone: "${item.phone}",
	 			isPlan: "${item.isPlan}",
	 			inOutList: [
	 				<c:forEach var="inOut" items="${item.inOutList}" varStatus="status">
	 					{
			 				uid: "${inOut.uid}",
			 				inOutDate: "${inOut.inOutDate}",
			 				schedulerInOut: "${inOut.schedulerInOut}",
			 				performanceInOut: "${inOut.performanceInOut}"
			 			}
			 			<c:if test="${!status.last}">,</c:if>
		 			</c:forEach>
	 			]
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
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/resultCrew.js"></script>
	<script src="${pageContext.request.contextPath}/js/sche/changeStatusPop.js"></script>
</body>
</html>
