<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>

<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_ANCH_MEAL_W'}">
		<c:set var="P_ANCH_MEAL_W" value="true" />
	</c:if>
	<c:if test="${at eq 'P_ANCH_MEAL_W'}">
		<c:set var="P_ANCH_MEAL_W" value="true" />
	</c:if>

</c:forEach>
<c:if test="${(empty P_ANCH_MEAL_R and empty P_ANCH_MEAL_W)}">
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
	<link href="${pageContext.request.contextPath}/css/common_newcrew.css" rel="stylesheet">
</head>
<body>
	<div class="body-wrap">
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_2_4.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_2_2.jsp"%>
            <div class="main-container">
				<div class="tb-area">
					<div class="d-flex">
					<div class="d-flex flex-row-reverse">
					
						<!-- 승선일/하선일 기간 조회 -->
						<button class="bt-obj bt-primary" onclick="getAnchMealList()">
									<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
									<span data-i18n="listOp.btnSearch"></span>
						</button>
						<!--<button class="bt-obj bt-primary mr-5" onclick="getRegistrationCrewList(1)">조회</button>-->
	                   		<input type="date" id="outDate"/>&nbsp&nbsp
							<input type="date" id="inDate"/>
						<div class="lb-title-no-sp" style="line-height: 44px;">기간&nbsp&nbsp</div>
					
					    <!-- 호선번호 조회(스케줄키) -->
					    <!-- style="border: 1px solid red" -->
					    <div class="col-auto">
							<input type="text"
								   id="shipInput"
								   class="autocomplete-ship crew-filter-control"
								   placeholder=""
								   data-i18n="[placeholder]listOp.shipPlaceholder"
								   autocomplete="off">
							<input type="hidden" id="ship" value="">
							<select id="shipSource" class="select-data-source" style="display:none;">
                                <option value=""></option>
                                <c:forEach var="ship" items="${listShip}">
                                    <option value="<c:out value='${ship.val}'/>"><c:out value="${ship.description}"/></option>
                                </c:forEach>
                            </select>
						</div>
						
						<div class="lb-title-no-sp" style="line-height: 44px;">호선번호</div>						
                  	</div>
                  	
                  	<!-- <div style="padding-right: 7%;"></div> -->
                  		
					<div class="d-flex flex-row-reverse">
						
						
						<c:choose>
							<c:when test="${bean.isOff eq 'Y' or empty P_ANCH_MEAL_W}">
								<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-primary" onclick="save()"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:otherwise>
						</c:choose>
						
                   		<button class="bt-obj bt-primary" onclick="popDeleteAnchModal()"><i class="fa-solid fa-minus"></i></button>
                   		<button class="bt-obj bt-primary" onclick="addAnch()"><i class="fa-solid fa-plus"></i></button>
                   		
                   		<!-- 엑셀 업로드/다운로드 -->
                   		<button class="bt-obj bt-secondary" onclick="downAnchExcel()" data-i18n="btnDownload"></button>
                   		<div class="bt-obj bt-secondary file-btn">
                   			<span data-i18n="btnUpload"></span>
							<input class="cursor-pointer" type="file" id="fileInput" onchange="excelUpload(event)" accept=".xlsx">
                   		</div> 
                   		
                   		<!-- <div style="padding-right: 44px;"></div> 	 -->
                   	</div> 
					</div> 
					
                   	<div class="sp-8"></div>
                   	<div class="d-flex">
						<select id="filterKind" onchange="searchList()" class="mr-3">
							<option value="ALL">[구분] All</option>
							<option value="S">직영</option>
							<option value="H">협력사</option>
							<option value="V">방문객</option>
							<option value="O">Owner/Class</option>
						</select>
						<select id="filterDomesticYN" onchange="searchList()" class="mr-3">
							<option value="ALL">[내국/외국] All</option>
							<option value="Y">내국</option>
							<option value="N">외국</option>
						</select>
						<select id="filterFoodStyle" onchange="searchList()" class="mr-3">
							<option value="ALL">[한식/양식] All</option>
							<option value="K">한식</option>
							<option value="W">양식(Normal Western)</option>
							<option value="H">양식(Halal)</option>
							<option value="V1">양식(Veg. fruitarian)</option>
							<option value="V2">양식(Veg. vegan)</option>
							<option value="V3">양식(Veg. lacto-veg.)</option>
							<option value="V4">양식(Veg. ovo-veg.)</option>
							<option value="V5">양식(Veg. lacto-ovo-veg.)</option>
							<option value="V6">양식(Veg. pesco-veg.)</option>
							<option value="V7">양식(Veg. pollo-veg.)</option>
							<option value="V8">양식(Veg. flexitarian)</option>
						</select>
						<div class="input-wrap">
               				<input id="filterWord" type="text" placeholder="검색어">
               				<button id="filterSearchBtn" onclick="searchList()"><img src="${pageContext.request.contextPath}/img/new/search.png"></button>
           				</div>
           				
           			    <!-- <div style="padding-right: 40px;"></div>  -->
           				
						<%-- <a href="${pageContext.request.contextPath}/mobile/mobileCrewinfo.html?uid=${bean.uid}" class="bt-obj bt-secondary mr-2" target="_blank">
							<i class="fas fa-mobile-alt"></i> QR발송
						</a> --%>
						<a href="javascript:void(0);" class="bt-obj bt-secondary mr-2" onclick="sendQRSMS()">
							<i class="fas fa-mobile-alt"></i> QR발송
						</a>
						<button class="bt-obj bt-primary" onclick="orderSave()">발주</button>
						
						<!-- <button class="bt-obj bt-primary" onclick="setInOutDate()" target="_blank">다운로드</button> -->
						<button class="bt-obj bt-primary" onClick="anchListDownloadAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px">&nbsp&nbsp다운로드</button>
                   		
					</div>
                   	<div class="sp-16"></div>
                     <div class="tb-wrap table_fixed_head" style="overflow-x: auto;">
                        <table id="tbList" class="tb-style tb-layout-fixed ws-nowrap " style="width:3000px; height:200px; white-space: nowrap;"> <thead>
                                <tr id="tbHeader"></tr>
                            </thead>
                            <tbody id="tbRowList" class ="dash-ship-list-area-scroll">
                                <tr>
									<td class="text-center" data-i18n="share:noList">There is no data to display</td>
								</tr>
                            </tbody>
                    	</table>
					</div>
					<!-- <div class="sp-16"></div>
                    <div class="pg-area" id="pagination"></div> -->
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
		        	<button type="button" class="bt-obj bt-primary" onClick="deleteAnch()">
          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
						<span data-i18n="delPop.btnDel"></span>
          			</button>
				</div>
      		</div>
    	</div>
  	</div>
	<script type="text/javascript">
	    let _anchUid = "${sessionScope.userInfo.userId}";
	    let _sDate = "${bean.sdate}";
	    let _eDate = "${bean.edate}";
	    let _anchList = [];
	    let _status = "${status}";
  	
	    <c:forEach var="item" items="${list}">
			_anchList.push({
	  			uid:"${item.uid}",
	 			projNo: "${item.projNo}",
	 			trialKey: "${item.trialKey}",
				kind: "${item.kind}",				
	 			domesticYn: "${item.domesticYn}",
	 			department: "${item.department}",
	 			mealDate: "${item.mealDate}",
	 			orderStatus: "${item.orderStatus}",
	 			orderDate: "${item.orderDate}",
	 			orderUid: "${item.orderUid}",
	 			deleteYn: "${item.deleteYn}",
	 			comment: "${item.comment}",
	 			inputUid: "${item.inputUid}",
	 			inputDate: "${item.inputDate}",
	 			smsReceiver: "<c:out value='${item.smsReceiver}'/>",
	 			planList: [
	 				<c:forEach var="plan" items="${item.planList}" varStatus="status">
	 					{
	 						planMealDate: "${plan.planMealDate}",
	 						planMealTime: "${plan.planMealTime}",
			 				planMealGubun: "${plan.planMealGubun}",
			 				planMealQty: "${plan.planMealQty}"
			 			}
			 			<c:if test="${!status.last}">,</c:if>
		 			</c:forEach>
	 			],
	 			resultList: [
	 				<c:forEach var="result" items="${item.resultList}" varStatus="status">
	 					{
	 						resultMealDate: "${result.resultMealDate}",
	 						resultMealTime: "${result.resultMealTime}",
			 				resultMealGubun: "${result.resultMealGubun}",
			 				resultMealQty: "${result.resultMealQty}"
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
	<script src="${pageContext.request.contextPath}/vendors/sheetjs/xlsx.full.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/custom.min.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/crew/common.js"></script>
	<script src="${pageContext.request.contextPath}/js/crew/anchorageMealRequest.js"></script>
</body>
</html>