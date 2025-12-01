<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>

<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_REG_CREW_R'}">
		<c:set var="P_REG_CREW_R" value="true" />
	</c:if>
	<c:if test="${at eq 'P_REG_CREW_W'}">
		<c:set var="P_REG_CREW_W" value="true" />
	</c:if>
</c:forEach>
<c:if test="${(empty P_REG_CREW_R and empty P_REG_CREW_W)}">
	<c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_2_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_2_1.jsp"%>
            <div class="main-container">
				<div class="tb-area">
					<!-- 첫 번째 줄: 검색 영역(왼쪽) + 버튼 영역(오른쪽) -->
					<div class="d-flex justify-content-between align-items-center mb-3">
						<!-- 왼쪽: 검색 영역 -->
						<div class="d-flex align-items-center">
							<div class="lb-title-no-sp" style="line-height: 44px; margin-right: 8px;">스케줄번호</div>
							<div class="col-auto" style="margin-right: 16px;">
								<select id="ship">
									<option value="">선택하세요</option>
									<c:forEach var="ship" items="${listShip}">
										<option value="${ship.val}" <c:if test="${not empty schedulerInfoUid and schedulerInfoUid eq ship.val}">selected</c:if>>${ship.description}</option>
									</c:forEach>
								</select>
							</div>
							<div class="lb-title-no-sp" style="line-height: 44px; margin-right: 8px;">기간</div>
							<input type="date" id="inDate" value="${inDate}" style="margin-right: 8px;"/>
							<input type="date" id="outDate" value="${outDate}" style="margin-right: 16px;"/>
							<button class="bt-obj bt-primary" onclick="searchAndReload()">
								<img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="bt-icon" height="16px">
								<span data-i18n="listOp.btnSearch"></span>
							</button>
							
						</div>
						
						<!-- 오른쪽: outline 스타일 버튼 영역 -->
						<div class="d-flex align-items-center">
							<div class="bt-obj bt-secondary file-btn" style="margin-right: 8px;">
								<span>방배정 업로드</span>
								<input class="cursor-pointer" type="file" id="roomAssignmentFileInput" onchange="roomUpload(event)" accept=".xlsx">
							</div>
							<button class="bt-obj bt-secondary" onclick="roomDownExcel()" style="margin-right: 8px;">방배정 다운로드</button>
							<div class="bt-obj bt-secondary file-btn" style="margin-right: 8px;">
								<span data-i18n="btnUpload"></span>
								<input class="cursor-pointer" type="file" id="fileInput" onchange="excelUpload(event)" accept=".xlsx">
							</div>
							<button class="bt-obj bt-secondary" onclick="downCrewExcel()" style="margin-right: 8px;" data-i18n="btnDownload"></button>
							
						</div>
					</div>  	
					<!-- 두 번째 줄: 필터 영역(왼쪽) + 버튼 영역(오른쪽) -->
					<div class="d-flex justify-content-between align-items-center">
						<!-- 왼쪽: 필터 영역 -->
						<div class="d-flex align-items-center">
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
						</div>
						
						<!-- 오른쪽: filled 스타일 버튼 영역 -->
						<div class="d-flex align-items-center">
							
							
							<!-- 승선일/하선일 반영 -->
							<div style="margin-left: 16px; padding-left: 16px;">										
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="ioCheck" id="ioCheckIn" value="B" checked="checked">
									<label class="form-check-label" for="ioCheckIn" data-i18n="list.in"></label>
								</div>						
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="ioCheck" id="ioCheckOut" value="U">
									<label class="form-check-label" for="ioCheckOut" data-i18n="list.out"></label>
								</div>
								<input type="date" id="ioDate" style="margin-right: 8px;"/>								
								<button class="bt-obj bt-primary" onclick="setInOutDate()" style="margin-right: 8px;" data-i18n="list.btnInOut"></button>
							</div>
							<button class="bt-obj bt-primary" onclick="addCrew()" style="margin-right: 8px;"><i class="fa-solid fa-plus"></i></button>
							<button class="bt-obj bt-primary" onclick="popDeleteCrewModal()" style="margin-right: 8px;"><i class="fa-solid fa-minus"></i></button>
							<button class="bt-obj bt-primary" onclick="orderSave()" style="margin-right: 8px;">발주</button>
							
							<c:choose>
								<c:when test="${bean.isOff eq 'Y' or empty P_REG_CREW_W}">
									<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
								</c:when>
								<c:otherwise>
									<button class="bt-obj bt-primary" onclick="save()"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
								</c:otherwise>
							</c:choose>
							
							
							<a href="javascript:void(0);" class="bt-obj bt-secondary" onclick="sendQRSMS()">
								<i class="fas fa-mobile-alt"></i> QR발송
							</a>
							
							
							<button class="bt-obj bt-primary" onClick="crewListDownloadAll()" style="margin-right: 8px;">
								<img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px">&nbsp&nbsp다운로드
							</button>
						</div>
					</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap table_fixed_head" style="overflow-x: auto;">
                        <table id="tbList" class="tb-style tb-layout-fixed ws-nowrap crew-registration-table" style="width:3000px; height:200px; white-space: nowrap;"> 
                            <thead>
                                <tr id="tbHeader"></tr>
                            </thead>
                            <tbody id="tbRowList" class ="dash-ship-list-area-scroll">
                                <tr>
									<td class="text-center" data-i18n="share:noList">There is no data to display</td>
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
	<script type="text/javascript">
	    let _crewUid = "${sessionScope.userInfo.userId}";
	    let _sDate = "${bean.sdate}";
	    let _eDate = "${bean.edate}";
	    let _crewList = [];
	    let _status = "${status}";
	    
  	
	  	<c:forEach var="item" items="${list}">
	  		_crewList.push({
	  			uid:"${item.uid}",
	  			schedulerInfoUid: "${item.schedulerInfoUid}",
	 			kind: "${item.kind}",
	 			trialKey: "${item.trialKey}",
				pjt: "${item.project}",
	 			company: "${item.company}",
	 			department: "${item.department}",
	 			name: "${item.name}",
	 			rank: "${item.rank}",
	 			idNo: "${item.idNo}",
	 			workType1: "${item.workType1}",
	 			workType2: "${item.workType2}",
	 			work: "${item.work}",
	 			mainSub: "${item.mainSub}",
	 			foodStyle: "${item.foodStyle}",
	 			personNo: "${item.personNo}",
	 			gender: "${item.gender}",
	 			phone: "${item.phone}",
	 			roomNo: "${item.roomNo}",
	 			inOutList: [
	 				<c:forEach var="inOut" items="${item.inOutList}" varStatus="status">
	 					{
			 				inOutDate: "${inOut.inOutDate}",
			 				schedulerInOut: "${inOut.schedulerInOut}",
			 				performanceInOut: "${inOut.performanceInOut}"
			 			}
			 			<c:if test="${!status.last}">,</c:if>
		 			</c:forEach>
	 			],
		  		terminal: "${item.terminal}",
		  		laptop: "${item.laptop}",
		  		modelNm: "${item.modelNm}",
		  		serialNo: "${item.serialNo}",
		  		foreigner: "${item.foreigner}",	 
		  		passportNo: "${item.passportNo}",	
		  		boatNm : "${item.boatNm}",
		  		role : "${item.role}",
		  		//deleteYn: "${item.deleteYn}",
				orderStatus: "${item.orderStatus}"				
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
	<script src="${pageContext.request.contextPath}/js/crew/registrationCrew.js"></script>
</body>
</html>
