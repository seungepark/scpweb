<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/jsp/share/conf.jsp"%>
<c:forEach var="at" items="${auth}">
	<c:if test="${at eq 'P_MNG_DEPRPT'}">
		<c:set var="P_MNG_DEPRPT" value="true" />
	</c:if>
</c:forEach>
<c:if test="${empty P_MNG_DEPRPT}">
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

<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div id="includeLeft"></div>

			<!-- top navigation -->
			<div id="includeHeader"></div>
			<!-- /top navigation -->

			<!-- page content -->
			<div class="right_col" role="main">
				<div class="row">
					<div class="col-xl-12 col-lg-12">
						<div class="page-title">
							<div class="x_content">
								<h3 class="g_text_primary font-weight-bold my-0">
									<span data-i18n="title"></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<h4 id="scheduleTitle" class="g_text_primary font-weight-bold my-0">
								${bean.hullnum} / ${bean.shiptype} 
								<c:if test="${not empty bean.description}"> 
									/ ${bean.description}
								</c:if>
							</h4>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<div class="btn-toolbar" role="toolbar" aria-label="Status button groups">
								<div class="btn-group mr-2" role="group" aria-label="First group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'D' ? '' : 'disabled="disabled"'}>Departure</button>
								</div>
								<div class="btn-group mr-2" role="group" aria-label="Second group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'O' ? '' : 'disabled="disabled"'}>On Going</button>
								</div>
								<div class="btn-group" role="group" aria-label="Third group">
									<button type="button" class="btn btn-primary" style="cursor: default;" ${departureState eq 'C' ? '' : 'disabled="disabled"'}>Arrival</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_content">
							<ul class="nav nav-tabs bar_tabs" id="myTab" role="tablist">
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportScheduleChart.html?uid=${bean.uid}" role="tab" aria-controls="tab" aria-selected="false"> &nbsp; <span data-i18n="depChart">Chart</span> &nbsp;</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReport.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="regCrew">Crew Registration</span> &nbsp;</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegCompleteInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regCompleteInfo">Info Registration</span></a>
								</li>
								<li class="nav-item">
									<a class="nav-link active" href="${pageContext.request.contextPath}/mng/sche/departureCompleteReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depCompleteRpt">Departure Report</span> &nbsp;</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="x_panel">
							<div class="col-md-12 col-sm-12 pt-2">
								<button type="button" class="btn btn-primary float-right" onClick="submitReportInfo()" <c:if test="${departureState ne 'C'}"> disabled</c:if>>
									<img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px">
									<span class="text-white" data-i18n="btnSubmit">submit</span>
								</button>
							</div>

							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="departure_padding g_bg_light text-white text-center">
											<h2 data-i18n="list.title">${bean.hullnum} 해상 시운전 완료 보고</h2>
											<h2 data-i18n="list.title">
												<c:if test="${not empty bean.description}">
													(${bean.description})
												</c:if>
											</h2>
										</div>
									</div>
								</div>
							</div>

							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-2">
										<div class="row">
											<div class="col-md-12">
												<span class="text-center" style="display: block; border: 1px solid rgba(221,221,221,0.78); line-height: 50px; background: #313F52; color: #ECF0F1;">Schedule</span>
											</div>
											<div class="col-md-12">
												<div style="border: 1px solid rgba(221,221,221,0.78); padding-top: 5px; height: 121px;"></div>
											</div>
										</div>

									</div>
									<div class="col-md-5">
										<div class="col-md-12" style="border: 1px solid rgba(221,221,221,0.78); padding-top: 5px; height: 173px;">
											<div class="row mt-3" style="font-size: 15px; font-weight: bold;">
												<div class="col-md-2">
												계획:
												</div>
												<div class="col-md-10">
													${planDays}, ${planHour}시간
												</div>
											</div>
											<div class="row" style="font-size: 15px; font-weight: bold;">
												<div class="col-md-2">
												</div>
												<div class="col-md-10">
													${sdate} ${stime} ~ ${edate} ${etime}
												</div>
											</div>
											<div class="row" style="font-size: 15px; font-weight: bold;">
												<div class="col-md-2">
													실행:
												</div>
												<div class="col-md-10">
													${execDays}, ${execHour}시간
												</div>
											</div>
											<div class="row" style="font-size: 15px; font-weight: bold;">
												<div class="col-md-2">
												</div>
												<div class="col-md-10">
													${performancesdate} ${performancestime} ~ ${performanceedate} ${performanceetime}
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-5">
										<div class="col-md-12" style="border: 1px solid rgba(221,221,221,0.78); padding-top: 5px;">
											<div class="x_title border0">
												<h2 data-i18n="list.title">Commander</h2>
											</div>
											<table data-toggle="table" data-custom-sort="tblistSort" class="table table-borderless table-striped jambo_table bulk_action mg-0">
												<thead>
												<tr class="headings">
													<th class="column-title border text-center" colspan="3"><span data-i18n="list.commander">커맨더</span></th>
												</tr>
												</thead>
												<tbody>
												<tr class="even pointer">
													<td class="border text-center">정</td>
													<td class="border text-center">${commanderName}</td>
													<td class="border text-center">${commanderTel}</td>
												</tr>
												<tr class="even pointer">
													<td class="border text-center">부</td>
													<td class="border text-center">${subCommanderName}</td>
													<td class="border text-center">${subCommanderTel}</td>
												</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<br>
								<div class="x_title border0">
									<h2 data-i18n="list.title">Result of Sea trial</h2>
								</div>
								<br>
								<table data-toggle="table" data-custom-sort="tblistSort" class="table table-borderless table-striped jambo_table bulk_action mg-0">
									<thead>
										<tr class="headings">
											<th class="column-title border text-center" colspan="2"><span data-i18n="list.commander">구분</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">SN2307</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">SN2306</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">SN2308</span></th>
											<th class="column-title border text-center"><span data-i18n="list.commander">시리즈평균</span></th>
										</tr>
									</thead>
									<tbody id="schedulelist">
										<tr class="even pointer">
											<td class="border text-center" colspan="2">Period</td>
											<td class="border text-center">4박 5일</td>
											<td class="border text-center">4박 5일</td>
											<td class="border text-center">5박 6일</td>
											<td class="border text-center">4박 5일</td>
										</tr>
										<tr class="even pointer">
											<td class="border text-center" rowspan="3">Fuel Consumption</td>
											<td class="border text-center">HFO</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
										</tr>
										<tr class="even pointer">
											<td class="border text-center">MGO</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
											<td class="border text-center">0</td>
										</tr>
										<tr class="even pointer">
											<td class="border text-center">LNG</td>
											<td class="border text-center">100</td>
											<td class="border text-center">100</td>
											<td class="border text-center">300</td>
											<td class="border text-center">200</td>
										</tr>
									</tbody>
								</table>
								<br>
								<div class="row">
									<div class="col-md-12">
										<div class="row">
											<div class="col-md-6">
												<div class="row">
													<div class="col-md-12">
														<div class="x_title border0">
															<h2 data-i18n="list.title">Sea trial test progress</h2>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-md-12">
														<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
															<thead>
																<tr>
																	<th class="column-title border text-center" ><span data-i18n="list.commander">Total</span></th>
																	<th class="column-title border text-center" ><span data-i18n="list.commander">Hull</span></th>
																	<th class="column-title border text-center" ><span data-i18n="list.commander">Machinery</span></th>
																	<th class="column-title border text-center" ><span data-i18n="list.commander">Electric</span></th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td class="border text-center">${hullCompCnt + machCompCnt + elecCompCnt}/${hullCnt + machineryCnt + electricCnt}</td>
																	<td class="border text-center">${hullCompCnt}/${hullCnt}</td>
																	<td class="border text-center">${machCompCnt}/${machineryCnt}</td>
																	<td class="border text-center">${elecCompCnt}/${electricCnt}</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div class="col-md-6">
												<div class="row">
													<div class="col-md-12">
														<div class="x_title border0">
															<h2 data-i18n="list.title">Ship's Condition</h2>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-md-12">
														<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
															<thead>
															<tr>
																<th class="column-title border text-center" rowspan="2"><span data-i18n="list.commander">Fuel</span></th>
																<th class="column-title border text-center" ><span data-i18n="list.commander">HFO</span></th>
																<th class="column-title border text-center" ><span data-i18n="list.commander">MGO</span></th>
																<th class="column-title border text-center" ><span data-i18n="list.commander">LNG</span></th>
															</tr>
															</thead>
															<tbody>
															<tr>
																<td class="border text-center">63</td>
																<td class="border text-center">12</td>
																<td class="border text-center">5</td>
																<td class="border text-center">5</td>
															</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<br>
								<div class="row">
									<div class="col-md-12">
										<div class="row">
											<div class="col-md-12">
												<div class="x_title border0">
													<h2 data-i18n="list.title">Sea trial test progress</h2>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12">
												<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
													<thead>
													<tr class="headings">
														<th class="column-title border text-center" ><span data-i18n="list.commander">Total</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.m ach">SHI</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.hull">선주</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.elec">선급</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.elec">S/E</span></th>

														<th class="column-title border text-center" ><span data-i18n="list.depart">선장</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.name">타수</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.name">기관장</span></th>
														<th class="column-title border text-center" ><span data-i18n="list.name">간호사</span></th>
													</tr>
													</thead>
													<tbody>
													<tr class="even pointer">
														<td class="border text-center" ><input id="totalCnt" type="number" step="1" class="form-control" value="${totalCnt}" data-index="${empty totalCntuid ? 0 : totalCntuid}" disabled></td>
														<td class="border text-center" ><input id="shiCnt" type="number" step="1" class="form-control" value="${shiCnt}" data-index="${empty shiCntuid ? 0 : shiCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="companyCnt" type="number" step="1" class="form-control" value="${companyCnt}" data-index="${empty companyCntuid ? 0 : companyCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="classCnt" type="number" step="1" class="form-control" value="${classCnt}" data-index="${empty classCntuid ? 0 : classCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="seCnt" type="number" step="1" class="form-control" value="${seCnt}" data-index="${empty seCntuid ? 0 : seCntuid}" onchange="sumCrew()" disabled/></td>

														<td class="border text-center" ><input id="captainCnt" type="number" step="1" class="form-control" value="${captainCnt}" data-index="${empty captainCntuid ? 0 : captainCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="passengerCnt" type="number" step="1" class="form-control" value="${passengerCnt}" data-index="${empty passengerCntuid ? 0 : passengerCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="engineerCnt" type="number" step="1" class="form-control" value="${engineerCnt}" data-index="${empty engineerCntuid ? 0 : engineerCntuid}" onchange="sumCrew()" disabled/></td>
														<td class="border text-center" ><input id="medicCnt" type="number" step="1" class="form-control" value="${medicCnt}" data-index="${empty medicCntuid ? 0 : medicCntuid}" onchange="sumCrew()" disabled/></td>
													</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">State of board</h2>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-md-6">
										<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
											<tbody>
											<tr class="headings">
												<th class="column-title border text-center" rowspan="2"><span data-i18n="list.commander">Fuel</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">HFO</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">MGO</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">LNG</span></th>
											</tr>
											<tr class="even pointer">
												<td class="border text-center" ><input id="hfo" type="number" step="1" class="form-control" value="${hfo}" data-index="${empty hfouid ? 0 : hfouid}" disabled></td>
												<td class="border text-center" ><input id="mgo" type="number" step="1" class="form-control" value="${mgo}" data-index="${empty mgouid ? 0 : mgouid}" disabled></td>
												<td class="border text-center" ><input id="lng" type="number" step="1" class="form-control" value="${lng}" data-index="${empty lnguid ? 0 : lnguid}" disabled></td>
											</tr>
											</tbody>
										</table>
									</div>
									<div class="col-md-6">
										<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
											<tbody id="">
											<tr class="headings">
												<th class="column-title border text-center" rowspan="2"><span data-i18n="list.commander" style="color: red;">Draft</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">FWD</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">MID</span></th>
												<th class="column-title border text-center" ><span data-i18n="list.commander">AFT</span></th>
											</tr>
											<tr class="even pointer">
												<td class="border text-center" ><input id="fwd" type="number" step="1" class="form-control" value="${fwd}" data-index="${empty fwduid ? 0 : fwduid}" disabled></td>
												<td class="border text-center" ><input id="mid" type="number" step="1" class="form-control" value="${mid}" data-index="${empty miduid ? 0 : miduid}" disabled></td>
												<td class="border text-center" ><input id="aft" type="number" step="1" class="form-control" value="${aft}" data-index="${empty aftuid ? 0 : aftuid}" disabled></td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>

							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">Major issue</h2>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-md-12">
										<table data-toggle="table" data-custom-sort="tblistSort2" class="table table-borderless table-striped jambo_table bulk_action mg-0">
											<thead>
											<tr class="headings">
												<th class="column-title border text-center"><span data-i18n="majorissuelist.testcode">Test Code</span></th>
												<th class="column-title border text-center"><span data-i18n="majorissuelist.testitem">Test Item</span></th>
												<th class="column-title border text-center"><span data-i18n="majorissuelist.diff">차이</span></th>
												<th class="column-title border text-center"><span data-i18n="majorissuelist.errcode">비정상Code</span></th>
												<th class="column-title border text-center"><span data-i18n="majorissuelist.reason">사유</span></th>
											</tr>
											</thead>
											<tbody id="majorIssueList">
											<c:forEach var="item" items="${listmajorissue}">
												<tr class="even pointer">
													<td class="border text-center"><input type="text" name="testCode" class="form-control" data-index="${empty item.testCodeUid ? 0 : item.testCodeUid}" data-report-keytype="majorIssueList" value="${item.testCode}" disabled /></td>
													<td class="border text-center"><input type="text" name="testItem" class="form-control" data-index="${empty item.testItemUid ? 0 : item.testItemUid}" data-report-keytype="majorIssueList" value="${item.testItem}" disabled /></td>
													<td class="border text-center"><input type="text" name="diff" class="form-control" data-index="${empty item.diffUid ? 0 : item.diffUid}" data-report-keytype="majorIssueList" value="${item.diff}" disabled /></td>
													<td class="border text-center"><input type="text" name="errCode" class="form-control" data-index="${empty item.errCodeUid ? 0 : item.errCodeUid}" data-report-keytype="majorIssueList" value="${item.errCode}" disabled /></td>
													<td class="border text-center"><input type="text" name="reason" class="form-control" data-index="${empty item.reasonUid ? 0 : item.reasonUid}" data-report-keytype="majorIssueList" value="${item.reason}" disabled /></td>
												</tr>
											</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<br>
							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">특이사항</h2>
										</div>
									</div>
									<div class="col-md-12">
										<textarea id="reportEtc" style="width: 100%;" rows="3" cols="20" data-index="${empty reportEtcuid ? 0 : reportEtcuid}" disabled>${reportEtc}</textarea>
									</div>
								</div>
							</div>
							<br>
							<div class="col-md-12 col-sm-12 pt-2">
								<div class="row">
									<div class="col-md-12">
										<div class="x_title border0">
											<h2 data-i18n="list.title">진동/소음 결과</h2>
										</div>
									</div>
									<div class="col-md-12">
										<textarea id="vibenoiseEtc" style="width: 100%;" rows="3" cols="20" data-index="${empty vibenoiseEtcuid ? 0 : vibenoiseEtcuid}" disabled>${vibenoiseEtc}</textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="includeFooter"></div>
			</div>
		</div>
		<!-- /footer content -->
	</div>
	<!-- jQuery -->
	<script src="${pageContext.request.contextPath}/vendors/jquery/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/bootstrap/js/bootstrap-treeview.min.js"></script>
	<!-- Font Awesome -->
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/all.min.js"></script>
    <script src="${pageContext.request.contextPath}/vendors/fontawesome/js/v4-shims.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/i18next-1.11.2.min.js"></script>
	<script src="${pageContext.request.contextPath}/vendors/i18n/lang.js"></script>
	<script src="${pageContext.request.contextPath}/js/common.js"></script>

	<script>
		const uid = '${bean.uid}'
	</script>
	<script src="${pageContext.request.contextPath}/js/mng/sche/departureCompleteReport_check.js"></script>
</body>
</html>
