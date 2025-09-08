<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/jsp/share/conf.jsp" %>
<c:forEach var="at" items="${auth}">
    <c:if test="${at eq 'P_MNG_DEPRPT'}">
        <c:set var="P_MNG_DEPRPT" value="true" />
    </c:if>
</c:forEach>
<c:if test="${empty P_MNG_DEPRPT}">
    <c:redirect url="/index.html" />
</c:if>
<!DOCTYPE html>
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

    <style>
        .ui-timepicker-container {
            z-index:1151 !important;
        }
    </style>
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
                            <h3 class="g_text_primary font-weight-bold my-0">${bean.hullnum} / ${bean.shiptype} <c:if test="${not empty bean.description}"> / ${bean.description} </c:if></h3>
                        </div>
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
                <div class="col-xl-6 col-lg-12">
                    <div class="page-title">
                        <div class="x_content">
                            <!-- <br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br> -->
                            <ul class="nav nav-tabs bar_tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" href="${pageContext.request.contextPath}/mng/sche/departureReportScheduleChart.html?uid=${bean.uid}" role="tab" aria-controls="tab" aria-selected="true"> &nbsp; <span data-i18n="depChart">Chart</span> &nbsp;</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReport.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="regCrew">Crew Registration</span> &nbsp;</a>
                                </li>
                                <c:choose>
                                    <c:when test="${departureState eq 'D'}">
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regInfo">Info Registration</span></a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depRpt">Departure Report</span> &nbsp;</a>
                                        </li>
                                    </c:when>
                                    <c:when test="${departureState eq 'O'}">
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegDailyInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regDailyInfo">Info Registration</span></a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureDailyReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depDailyRpt">Departure Report</span> &nbsp;</a>
                                        </li>
                                    </c:when>
                                    <c:when test="${departureState eq 'C'}">
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegCompleteInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regComInfo">Info Registration</span></a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureCompleteReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="comRpt">Departure Report</span> &nbsp;</a>
                                        </li>
                                    </c:when>
                                    <c:otherwise>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportRegInfo.html?uid=${bean.uid}" role="tab" aria-selected="true"><span data-i18n="regInfo">Info Registration</span></a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="${pageContext.request.contextPath}/mng/sche/departureReportCheck.html?uid=${bean.uid}" role="tab" aria-selected="false"> &nbsp; <span data-i18n="depRpt">Departure Report</span> &nbsp;</a>
                                        </li>
                                    </c:otherwise>
                                </c:choose>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="x_panel">
                        <div class="col-xl-12 col-lg-12">
                            <div class="page-title">
                                <div class="x_title border0">
                                    <h3 class="g_text_primary font-weight-bold my-0" id="popChartTitle"></h3>
                                    <a href="${pageContext.request.contextPath}/mng/sche/departure.html">
                                        <button type="button" class="btn btn-primary float-right">
                                            <img src="${pageContext.request.contextPath}/img/i_btn_return.svg" class="mr-1" height="16px" alt="back btn" />
                                            <span class="text-white" data-i18n="btnBack">Back</span>
                                        </button>
                                    </a>
                                    <button type="button" class="btn btn-primary float-right" onclick="saveSchedule()">
                                        <img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px" alt="save btn" />
                                        <span class="text-white" data-i18n="btnSave">Save</span>
                                    </button>
                                    <button type="button" class="btn btn-primary float-right" onclick="toggleScheduleMode()">
                                        <img src="${pageContext.request.contextPath}/img/i_btn_list.svg" class="mr-1" height="16px" alt="show list">
                                        <span class="text-white" data-i18n="btnList">Schedule List</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="x_content" id="chartPanel">
                            <div>
                                <input type="hidden" id="parentPeriod" />
                                <input type="hidden" id="parentSdate" />
                                <input type="hidden" id="parentEdate" />
                                <input type="hidden" id="hullnum" />
                                <input type="hidden" id="sdate" value="${bean.sdate}" />
                                <input type="hidden" id="edate" value="${bean.edate}" />
                                <input type="hidden" id="desc" value="${bean.description}" />
                                <input type="hidden" id="shiptype" value="${bean.shiptype}" />
                                <input type="hidden" id="schedtype" value="${bean.schedtype}" />
                            </div>

                            <div class="row" style="display: block;" id="scheduleManager"></div>
                        </div>
                        <div class="x_content table_fixed_head" id="dDataPanel" style="display: none;">
                            <table id="tbNewSchedulerList"  class="table table-striped jambo_table bulk_action mg-0">
                                <thead>
                                <tr class="headings">
                                    <th class="border align-middle" ><input type="checkbox" id="scheRowAllChk"></th>
                                    <th class="column-title border" data-i18n="list.cate">Cat</th>
                                    <th class="column-title border" data-i18n="list.tcnum">TC_N</th>
                                    <th class="column-title border" data-i18n="list.desc">Description</th>
                                    <th class="column-title border" data-i18n="list.ctype">Graph</th>

                                    <th class="column-title border" data-i18n="list.loadrate">Load Rate</th>
                                    <th class="column-title border" data-i18n="list.dtype">Load Type</th>
                                    <th class="column-title border" data-i18n="list.sdate">Start Date</th>
                                    <th class="column-title border" data-i18n="list.stime">Start Time</th>
                                    <th class="column-title border" data-i18n="list.edate">End Date</th>

                                    <th class="column-title border" data-i18n="list.etime">End Time</th>
                                    <th class="column-title border" data-i18n="list.seq">Sequence</th>
                                    <th class="column-title border" data-i18n="list.per">Period</th>
                                    <th class="column-title border" data-i18n="list.readTm">Ready Time</th>
                                    <th class="column-title border" data-i18n="list.sametcnum">Same TC</th>

                                    <th class="column-title border"></th>
                                </tr>
                                </thead>
                                <tbody id="getScheRowList">
                                <tr class="even pointer">
                                    <td class="text-center" colspan="16" data-i18n="share:noList">There is no data to display</td>
                                </tr>
                                </tbody>
                            </table>
                            <br>&nbsp;<br>
                        </div>
                    </div>
                </div>
                <!-- /page content -->
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
                <select class="form-control" id="movePopCtype" disabled>
                    <option value="E_LOAD">Load</option>
                    <option value="SCHE">Schedule</option>
                </select>
                <label for="movePopCurSeq" data-i18n="movePop.curSeq">Current Sequence</label>
                <input type="text" class="form-control mr-2" id="movePopCurSeq" disabled>
                <label for="movePopSeq" data-i18n="movePop.seq">Sequence</label>
                <input type="text" class="form-control mr-2" id="movePopSeq" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
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
    <div class="modal-dialog modal-dialog-centered" role="document">
        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" data-i18n="modal.title">Schedule Detail</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h5 class="modal-title mt-1 mb-2" data-i18n="modal.titleinfo">Detail Info</h5>
                <table>
                    <colgroup>
                        <col width="20%" />
                        <col width="30%" />
                        <col width="20%" />
                        <col width="30%" />
                    </colgroup>
                    <tr>
                        <th data-i18n="modal.cate">Catgory</th>
                        <td><input type="text" name="category" class="form-control" disabled/></td>
                        <th data-i18n="modal.tcnum">TC Num</th>
                        <td>
                            <input type="text" name="scheTcnum" class="form-control inputSearch" data-codeuid="" value="" disabled/>
                        </td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.desc">Description</th>
                        <td colspan="3"><input type="text" name="desc" class="form-control" disabled/></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.ctype">Graph</th>
                        <td>
                            <input type="text" name="ctype" class="form-control" disabled/>
                        </td>
                        <th data-i18n="modal.loadrate">Load Rate</th>
                        <td><input type="text" name="loadrate" class="form-control" /></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.dtype">Load Type</th>
                        <td>
                            <input type="text" name="dtype" class="form-control" disabled/>
                        </td>
                        <th data-i18n="modal.seq">Sequence</th>
                        <td><input type="text" name="seq" class="form-control" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');"/></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.sdate">Start Date</th>
                        <td><input type="date" name="sdate" class="form-control" /></td>
                        <th data-i18n="modal.stime">Start Time</th>
                        <td><input type="text" name="stime" class="form-control" /></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.edate">End Date</th>
                        <td><input type="date" name="edate" class="form-control" /></td>
                        <th data-i18n="modal.etime">End Time</th>
                        <td><input type="text" name="etime" class="form-control" /></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.per">Period</th>
                        <td>
                            <input type="text" name="per" class="form-control" onchange="changePer()"/>
                            <%--								<input type="text" name="per" class="form-control" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');"/>--%>
                        </td>
                        <th data-i18n="modal.readTm">Ready</th>
                        <td>
                            <input type="text" name="readytime" class="form-control" />
                            <%--								<input type="text" name="readytime" class="form-control" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/(\--*)\-/g, '$1');"/>--%>
                        </td>
                    </tr>
                </table>
                <h5 class="modal-title mt-4 mb-2">
                    <p data-i18n="modal.titleperformance">Performance Info</p>
                    <div class="float-right" style="margin-top: -48px;">
                        <button type="button" class="btn btn-primary" onClick="setPerformanceDate()">
                            <img src="${pageContext.request.contextPath}/img/i_btn_save.svg" class="mr-1" height="16px">
                            <span class="text-white" data-i18n="btnSync">Sync Schedule Detail</span>
                        </button>
                    </div>

                </h5>
                <table>
                    <colgroup>
                        <col width="20%" />
                        <col width="30%" />
                        <col width="20%" />
                        <col width="30%" />
                    </colgroup>
                    <tr>
                        <th data-i18n="modal.performancesdate">Performance Start Date</th>
                        <td><input type="date" name="performancesdate" class="form-control" /></td>
                        <th data-i18n="modal.performancestime">Performance Start Time</th>
                        <td><input type="text" name="performancestime" class="form-control" /></td>
                    </tr>
                    <tr>
                        <th data-i18n="modal.performanceedate">Performance End Date</th>
                        <td><input type="date" name="performanceedate" class="form-control" /></td>
                        <th data-i18n="modal.performanceetime">Performance End Time</th>
                        <td><input type="text" name="performanceetime" class="form-control" /></td>
                    </tr>
                </table>
                <input type="hidden" name="uid" />
                <input type="hidden" name="schedinfouid" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary save">Ok</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- The Schedual Detail Modal End -->

<!-- TCnum Search Modal Start -->
<div class="modal fade" id="search_tcnum_modal" tabindex="-1" role="dialog" aria-labelledby="search_tcnum_modal" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" data-i18n="searchTcPop.title">Search TC Number</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 col-sm-12 pt-2">
                        <label for="searchTcPopTcnum" data-i18n="searchTcPop.tcnum">TC Num</label>
                        <input type="text" class="form-control mr-2" id="searchTcPopTcnum">
                    </div>
                    <div class="col-md-5 col-sm-12 pt-2">
                        <label for="searchTcPopDesc" data-i18n="searchTcPop.desc">Description</label>
                        <input type="text" class="form-control mr-2" id="searchTcPopDesc">
                    </div>
                    <div class="col-md-3 col-sm-12 pt-2">
                        <label for="searchTcPopSearch">&nbsp;</label>
                        <div id="searchTcPopSearch">
                            <button type="button" onClick="searchTcPopSearch(1)" class="btn btn-primary mg-0">
                                <img src="${pageContext.request.contextPath}/img/i_btn_search.svg" class="mr-1" height="16px">
                                <span class="text-white" data-i18n="searchTcPop.btnSearch">Search</span>
                            </button>
                        </div>
                    </div>
                </div>
                <br>
                <table class="table table-borderless table-striped jambo_table bulk_action mg-0">
                    <thead>
                    <tr class="headings">
                        <th class="column-title border"  data-i18n="searchTcPop.tcnum">TC Num</th>
                        <th class="column-title border"  data-i18n="searchTcPop.desc">Description</th>
                        <th class="column-title border"  data-i18n="searchTcPop.dtype">Graph Type</th>
                        <th class="column-title border"  data-i18n="searchTcPop.ctype">Load Type</th>
                        <th class="column-title border"  data-i18n="searchTcPop.load">Load</th>
                        <th class="column-title border"  data-i18n="searchTcPop.per">Period</th>
                        <th class="column-title border"  data-i18n="searchTcPop.readytm">Ready Time</th>
                    </tr>
                    </thead>
                    <tbody id="searchTcPopList">
                    </tbody>
                </table>
                <br/>
                <div class="dataTables_paginate paging_simple_numbers float-none" id="datatable-fixed-header_paginate">
                    <ul class="pagination justify-content-center" id="pagination"></ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="searchTcPop.btnClose">Close</button>
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
                        <label for="setConvDatePopSdate" data-i18n="setConvDatePop.sdate">Start Date</label>
                        <input type="date" class="form-control mr-2" id="setConvDatePopSdate">
                    </div>
                    <div class="col-md-2 col-sm-12 pt-2">
                        <label for="setConvDatePopStime" data-i18n="setConvDatePop.stime">Start Time</label>
                        <input type="text" class="form-control" id="setConvDatePopStime" value="">
                    </div>
                    <div class="col-md-3 col-sm-12 pt-2">
                        <label for="setConvDatePopEdate" data-i18n="setConvDatePop.edate">End Date</label>
                        <input type="date" class="form-control mr-2" id="setConvDatePopEdate">
                    </div>
                    <div class="col-md-2 col-sm-12 pt-2">
                        <label for="setConvDatePopEtime" data-i18n="setConvDatePop.etime">End Time</label>
                        <input type="text" class="form-control" id="setConvDatePopEtime" value="">
                    </div>
                    <div class="col-md-2 col-sm-12 pt-2">
                        <label for="searchTcPopSearch">&nbsp;</label>
                        <div id="setConvDatePopApply">
                            <button type="button" onClick="setConvDateApplyBtn()" class="btn btn-primary mg-0">
                                <img src="${pageContext.request.contextPath}/img/i_btn_verif.svg" class="mr-1" height="16px">
                                <span class="text-white" data-i18n="setConvDatePop.btnApply">Apply</span>
                            </button>
                        </div>
                    </div>
                </div>
                <br>
                <table class="table table-borderless table-striped jambo_table bulk_action mg-0">
                    <thead>
                    <tr class="headings">
                        <th class="border align-middle" ><input type="checkbox" id="convDataAllChk"></th>
                        <th class="column-title border"  data-i18n="setConvDatePop.tcnum">TC Num</th>
                        <th class="column-title border"  data-i18n="setConvDatePop.desc">Description</th>
                        <th class="column-title border"  data-i18n="setConvDatePop.sdate">Start Date</th>
                        <th class="column-title border"  data-i18n="setConvDatePop.stime">Start Time</th>
                        <th class="column-title border"  data-i18n="setConvDatePop.edate">End Date</th>
                        <th class="column-title border"  data-i18n="setConvDatePop.etime">End Time</th>
                    </tr>
                    </thead>
                    <tbody id="setConvDatePopList">
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="setConvDatePop.btnClose">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- Conv Date Input Modal End -->

<script>
    var scheUid = "${bean.uid}";

    // ctype, dtype 데이터
    var ctypeList = new Array();
    var dtypeList = new Array();

    const schedtypeList = new Array();

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
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/mng/sche/ssLineGanttChart.js"></script>
<script src="${pageContext.request.contextPath}/js/mng/sche/departureReport_schedule_chart.js"></script>
</body>
</html>
