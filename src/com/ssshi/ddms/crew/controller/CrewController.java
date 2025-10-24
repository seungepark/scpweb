package com.ssshi.ddms.crew.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ssshi.ddms.crew.service.CrewServiceI;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
import com.ssshi.ddms.dto.AnchorageMealRequestBean;
import com.ssshi.ddms.dto.AnchorageMealQtyBean;
import com.ssshi.ddms.dto.AnchorageMealListBean;

/********************************************************************************
 * 프로그램 개요 : Crew
 * 
 * 최초 작성자 : 
 * 최초 작성일 : 
 * 
 * 최종 수정자 : 
 * 최종 수정일 :
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
public class CrewController {

	@Autowired
	private CrewServiceI service;
	
	//Main(시운전 승선자 신청)
	@RequestMapping(value="/crew/registrationCrew.html")
	public String registrationCrew(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/registrationCrew";
	}
	
	//승선자 조회
	@RequestMapping(value="/crew/getRegistrationCrewList.html", method=RequestMethod.GET)
	public String getRegistrationCrewList(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {		
		model.addAllAttributes(service.getRegistrationCrewList(request, bean));

		return "crew/getRegistrationCrewList";
	}
	
	//승선자 저장
	@RequestMapping(value="/crew/registrationCrewSave.html", method=RequestMethod.POST)
	public String registrationCrewSave(HttpServletRequest request, ModelMap model, RegistrationCrewListBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewSave(request, bean));
		
		return "share/resultCode";
	}
	
	//승선자 양식 다운로드
	@RequestMapping(value="/crew/downCrewExcel.html")
	public void downCrewExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		service.downCrewExcel(response);
	}
	
	//승선자 삭제
	@RequestMapping(value="/crew/registrationCrewRemove.html", method=RequestMethod.POST)
	public String registrationCrewRemove(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewRemove(request, bean));
	   
	    return "share/resultCode";
	}
	
	//승선자 발주
	@RequestMapping(value="/crew/crewOrderUpdate.html", method=RequestMethod.POST)
	public String crewOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.crewOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	
	//Main(앵카링 식사 신청)
	@RequestMapping(value="/crew/anchorageMealRequest.html")
	public String anchorageMealRequest(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealRequest(request, bean));
		
		return "crew/anchorageMealRequest";
	}
	
	@RequestMapping(value="/crew/getAnchorageMealList.html", method=RequestMethod.GET)
	public String getAnchorageMealList(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {		
		model.addAllAttributes(service.getAnchorageMealList(request, bean));

		return "crew/anchorageMealRequestList";
	}
	
	@RequestMapping(value="/crew/anchorageMealSave.html", method=RequestMethod.POST)
	public String anchorageMealSave(HttpServletRequest request, ModelMap model, AnchorageMealListBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealSave(request, bean));
		
		return "share/resultCode";
	}
	
	//Main(실적 확인)
	@RequestMapping(value="/crew/resultMeal.html")
	public String resultMeal(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		return "crew/resultMeal";
	}
}