package com.ssshi.ddms.sche.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewListBean;
import com.ssshi.ddms.dto.ScheMailBean;
import com.ssshi.ddms.dto.ScheMailLogBean;
import com.ssshi.ddms.dto.ScheTcNoteBean;
import com.ssshi.ddms.dto.ScheTrialInfoBean;
import com.ssshi.ddms.dto.ScheduleCodeDetailBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.ShipCondBean;

public interface ScheServiceI {
	
	// ManagerServiceI.getSchedulerDepartureList
	Map<String, Object> getScheList(SchedulerInfoBean bean) throws Exception;
	
	Map<String, Object> scheChart(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> planChart(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> planChartSave(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;
	
	Map<String, Object> planCrew(HttpServletRequest request, ParamBean bean) throws Exception;
	
	void downCrewExcel(HttpServletResponse response, ParamBean bean) throws Exception;
	
	Map<String, Object> planCrewSave(HttpServletRequest request, ScheCrewListBean bean) throws Exception;
	
	Map<String, Object> planInfo(HttpServletRequest request, ParamBean bean) throws Exception;
	
	List<SchedulerInfoBean> searchTrial(ParamBean bean) throws Exception;
	
	Map<String, Object> planInfoSave(HttpServletRequest request, ScheTrialInfoBean bean) throws Exception;
	
	Map<String, Object> planDepartureReport(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> planDepartureReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception;
	
	Map<String, Object> resultChart(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> resultChartSave(HttpServletRequest request, SchedulerInfoBean bean) throws Exception;
	
	Map<String, Object> getScheRowList(SchedulerDetailInfoBean bean) throws Exception;
	
	List<ScheTcNoteBean> getTcNoteList(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> saveNote(HttpServletRequest request, ScheTcNoteBean bean) throws Exception;
	
	Map<String, Object> resultCrew(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> resultCrewSave(HttpServletRequest request, ScheCrewListBean bean) throws Exception;
	
	Map<String, Object> resultInfo(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> resultInfoSave(HttpServletRequest request, ScheTrialInfoBean bean) throws Exception;
	
	Map<String, Object> resultDailyReport(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> resultDailyReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception;
	
	Map<String, Object> resultCompReport(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> resultCompReportSubmit(HttpServletRequest request, ScheMailLogBean bean) throws Exception;
	
	List<ScheMailBean> searchEmail(ParamBean bean) throws Exception;
	
	Map<String, Object> changeStatus(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> getScheduleTcNumSearchList(HttpServletRequest request, ScheduleCodeDetailBean bean) throws Exception;
	
	Map<String, Object> reportSchedule(HttpServletRequest request) throws Exception;
	
	Map<String, Object> getVesselReqInfoDetListByHullNum(ParamBean bean) throws Exception;
	
	List<ShipCondBean> getShipCondList(ParamBean bean) throws Exception;
	
	List<ScheMailBean> mailing() throws Exception;
	
	Map<String, Object> mailingSave(HttpServletRequest request, ScheMailBean bean) throws Exception;
}
