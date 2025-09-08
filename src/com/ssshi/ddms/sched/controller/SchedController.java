package com.ssshi.ddms.sched.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.PjtEvntColumnBean;
import com.ssshi.ddms.dto.PjtEvntSaveBean;
import com.ssshi.ddms.dto.ScenarioBean;
import com.ssshi.ddms.dto.ShipBbsBean;
import com.ssshi.ddms.dto.WorkStdBean;
import com.ssshi.ddms.sched.service.SchedServiceI;

/********************************************************************************
 * 프로그램 개요 : Sched
 * 
 * 최초 작성자 : KHJ
 * 최초 작성일 : 2025-05-26
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-06-25
 * 
 * 메모 : 없음
 * 
 * Copyright 2025 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2025 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class SchedController {

	@Autowired
	private SchedServiceI service;
	
	@RequestMapping(value="/sched/eventList.html")
	public String eventList(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.eventList(request));
		
		return "sched/eventList";
	}
	
	@RequestMapping(value="/sched/getEventList.html", method = RequestMethod.POST)
	public String getEventList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getEventList(bean));
		
		return "sched/getEventList";
	}
	
	@RequestMapping(value="/sched/updateEventColumnInfo.html", method = RequestMethod.POST)
	public String updateEventColumnInfo(HttpServletRequest request, ModelMap model, PjtEvntColumnBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateEventColumnInfo(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/updateEventList.html", method = RequestMethod.POST)
	public String updateEventList(HttpServletRequest request, ModelMap model, PjtEvntSaveBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateEventList(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/getBbsList.html", method = RequestMethod.POST)
	public String getBbsList(HttpServletRequest request, ModelMap model, ShipBbsBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getBbsList(bean));
		
		return "sched/getBbsList";
	}
	
	@RequestMapping(value="/sched/bbs.html", method = RequestMethod.POST)
	public String insertBbs(HttpServletRequest request, ModelMap model, ShipBbsBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.insertBbs(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/deleteBbs.html", method = RequestMethod.POST)
	public String deleteBbs(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteBbs(bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/downBbsFile.html")
	public void downDocFile(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		service.downBbsFile(request, response, bean);
	}
	
	@RequestMapping(value="/sched/scenario/scenarioList.html")
	public String scenarioList(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.scenarioList(request));
		
		return "sched/scenario/scenarioList";
	}
	
	@RequestMapping(value="/sched/scenario/getScenarioList.html")
	public String getScenarioList(HttpServletRequest request, ModelMap model, ScenarioBean bean) throws Exception {
		model.addAllAttributes(service.getScenarioList(bean));
		
		return "sched/scenario/getScenarioList";
	}
	
	@RequestMapping(value="/sched/scenario/changeStatusScenario.html")
	public String changeStatusScenario(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusScenario(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/scenario/deleteScenario.html")
	public String deleteScenario(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteScenario(bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/scenario/newScenario.html")
	public String newScenario(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.newScenario());
		
		return "sched/scenario/newScenario";
	}
	
	@RequestMapping(value="/sched/scenario/getWorkStdSearchList.html", method = RequestMethod.POST)
	public String getWorkStdSearchList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getWorkStdSearchList(bean));
		
		return "sched/scenario/getWorkStdSearchList";
	}
	
	@RequestMapping(value="/sched/scenario/getCopyScenario.html", method = RequestMethod.POST)
	public String getCopyScenario(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getCopyScenario(bean));
		
		return "sched/scenario/getCopyScenario";
	}
	
	@RequestMapping(value="/sched/scenario/scenario.html", method = RequestMethod.POST)
	public String insertScenario(HttpServletRequest request, ModelMap model, ScenarioBean bean) throws Exception {
		model.addAllAttributes(service.insertScenario(request, bean));
		
		return "share/resultCode";
	}
	
	@RequestMapping(value="/sched/scenario/detailScenario.html")
	public String detailScenario(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.detailScenario(bean));
		
		return "sched/scenario/detailScenario";
	}
	
	@RequestMapping(value="/sched/scenario/modifyScenario.html")
	public String modifyScenario(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.modifyScenario(bean));
		
		return "sched/scenario/modifyScenario";
	}
	
	@RequestMapping(value="/sched/scenario/updateScenario.html", method = RequestMethod.POST)
	public String updateScenario(HttpServletRequest request, ModelMap model, ScenarioBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateScenario(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/sched/workStd/workStd.html")
	public String workStd(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.workStd());
		
		return "sched/workStd/workStd";
	}
	
	@RequestMapping(value="/sched/workStd/updateWorkStd.html", method = RequestMethod.POST)
	public String updateWorkStd(HttpServletRequest request, ModelMap model, WorkStdBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateWorkStd(bean));
		
		return "share/result";
	}
}
