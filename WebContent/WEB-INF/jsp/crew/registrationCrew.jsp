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
        <%@ include file="/WEB-INF/jsp/include/menu/sidebar_2_1.jsp"%>
        <div id="contentWrap" class="collapsed-content-wrap">
            <%@ include file="/WEB-INF/jsp/include/menu/header_2_1.jsp"%>
            <div class="main-container">
				<div class="tb-area">
					<div class="d-flex">
					<div class="d-flex flex-row-reverse">
					
						<!-- 승선일/하선일 기간 조회 -->
						<button class="bt-obj bt-primary" onclick="getCrewList()">
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
							<select id="ship">
                                <option value="ALL" data-i18n="listOp.shipAll"></option>
                                <c:forEach var="ship" items="${listShip}">
                                    <option value="${ship.val}">${ship.description}</option>
                                </c:forEach>
                            </select>
						</div>
						
						<div class="lb-title-no-sp" style="line-height: 44px;">호선번호</div>
						
                  	</div>
                  		<!-- <div style="padding-right: 7%;"></div> -->
                  		
					<div class="d-flex flex-row-reverse">
						
						<a href="${pageContext.request.contextPath}/mobile/mobileCrewinfo.html?uid=${bean.uid}" class="bt-obj bt-secondary mr-2" target="_blank">
							<i class="fas fa-mobile-alt"></i> QR발송
						</a>
						<c:choose>
							<c:when test="${bean.isOff eq 'Y' or empty P_REG_CREW_W}">
								<button class="bt-obj bt-primary" disabled><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:when>
							<c:otherwise>
								<button class="bt-obj bt-primary" onclick="save()"><img src="${pageContext.request.contextPath}/img/new/save.png" class="bt-icon"><span data-i18n="btnSave"></span></button>
							</c:otherwise>
						</c:choose>
						
                   		<button class="bt-obj bt-primary" onclick="popDeleteCrewModal()"><i class="fa-solid fa-minus"></i></button>
                   		<button class="bt-obj bt-primary" onclick="addCrew()"><i class="fa-solid fa-plus"></i></button>
                   		
                   		<!-- 엑셀 업로드/다운로드 -->
                   		<button class="bt-obj bt-secondary" onclick="downCrewExcel()" data-i18n="btnDownload"></button>
                   		<div class="bt-obj bt-secondary file-btn">
                   			<span data-i18n="btnUpload"></span>
							<input class="cursor-pointer" type="file" id="fileInput" onchange="excelUpload(event)" accept=".xlsx">
                   		</div> 
                   		
                   		<!-- 승선일/하선일 반영 -->
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
           				
           				<div style="padding-right: 145px;"></div>
           				
						<!-- SELECT -->
					    <div class="col-auto">
							<select id="ship_scp" class="">
                                <option value="ALL">전체</option>
                                <c:forEach var="ship" items="${listShip}">
                                    <option value="${ship.val}">${ship.description}</option>
                                </c:forEach>
                            </select>
						</div>
						<button class="bt-obj bt-primary" onclick="setInOutDate()">전송</button>
						<button class="bt-obj bt-primary" onclick="orderingSave()">발주</button>
						
						<!-- <button class="bt-obj bt-primary" onclick="setInOutDate()" target="_blank">다운로드</button> -->
						<button class="bt-obj bt-primary" onClick="crewListDownloadAll()"><img src="${pageContext.request.contextPath}/img/i_download.svg" height="16px">&nbsp&nbsp다운로드</button>
                   		
					</div>
                   	<div class="sp-16"></div>
                    <div class="tb-wrap table_fixed_head">
                        <table id="tbList" class="tb-style tb-layout-fixed ws-nowrap " style="width:3000px; height:200px; overflow-y: auto; white-space: nowrap;"> 
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
		        	<button type="button" class="bt-obj bt-primary" onClick="deleteCrew()">
          				<img src="${pageContext.request.contextPath}/img/i_btn_del.svg" class="bt-icon" height="16px">
						<span data-i18n="delPop.btnDel"></span>
          			</button>
				</div>
      		</div>
    	</div>
  	</div>
	<script type="text/javascript">
	    //let _crewUid = "${bean.uid}";
	    let _sDate = "${bean.sdate}";
	    let _eDate = "${bean.edate}";
	    let _crewList = [];
	    let _status = "${status}";
  	
	  	<c:forEach var="item" items="${list}">
	  		_crewList.push({
	  			uid:"${item.uid}",
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
	<script src="${pageContext.request.contextPath}/js/crew/registrationCrew.js"></script>
</body>
</html>