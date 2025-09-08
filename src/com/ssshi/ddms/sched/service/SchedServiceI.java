package com.ssshi.ddms.sched.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.PjtEvntBean;
import com.ssshi.ddms.dto.PjtEvntColumnBean;
import com.ssshi.ddms.dto.PjtEvntSaveBean;
import com.ssshi.ddms.dto.ScenarioBean;
import com.ssshi.ddms.dto.ShipBbsBean;
import com.ssshi.ddms.dto.WorkStdBean;

public interface SchedServiceI {

	Map<String, Object> eventList(HttpServletRequest request) throws Exception;
	
	List<PjtEvntBean> getEventList(ParamBean bean) throws Exception;
	
	boolean updateEventColumnInfo(HttpServletRequest request, PjtEvntColumnBean bean) throws Exception;
	
	boolean updateEventList(HttpServletRequest request, PjtEvntSaveBean bean) throws Exception;
	
	List<ShipBbsBean> getBbsList(ShipBbsBean bean) throws Exception;
	
	boolean insertBbs(HttpServletRequest request, ShipBbsBean bean) throws Exception;
	
	boolean deleteBbs(ParamBean bean) throws Exception;
	
	void downBbsFile(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception;
	
	Map<String, Object> scenarioList(HttpServletRequest request) throws Exception;
	
	Map<String, Object> getScenarioList(ScenarioBean bean) throws Exception;
	
	boolean changeStatusScenario(HttpServletRequest request, ParamBean bean) throws Exception;
	
	boolean deleteScenario(ParamBean bean) throws Exception;
	
	Map<String, Object> newScenario() throws Exception;
	
	List<WorkStdBean> getWorkStdSearchList(ParamBean bean) throws Exception;
	
	Map<String, Object> getCopyScenario(ParamBean bean) throws Exception;
	
	Map<String, Object> insertScenario(HttpServletRequest request, ScenarioBean bean) throws Exception;
	
	Map<String, Object> detailScenario(ParamBean bean) throws Exception;
	
	Map<String, Object> modifyScenario(ParamBean bean) throws Exception;
	
	boolean updateScenario(HttpServletRequest request, ScenarioBean bean) throws Exception;
	
	Map<String, Object> workStd() throws Exception;
	
	boolean updateWorkStd(WorkStdBean bean) throws Exception;
}
