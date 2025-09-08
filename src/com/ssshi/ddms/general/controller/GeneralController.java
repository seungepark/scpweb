package com.ssshi.ddms.general.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.general.service.GeneralServiceI;

/********************************************************************************
 * 프로그램 개요 : General
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-11-18
 * 
 * 메모 : 없음
 * 
 * Copyright 2021 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2021 HLab.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class GeneralController {

	@Autowired
	private GeneralServiceI service;
	
	/**
	 * 기본 화면 분기
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/index.html")
	public String index(HttpServletRequest request) throws Exception {
		if(service.isLogined(request)) {
			return "general/kpi";
		}else {
			return "general/login";
		}
	}
	
	/**
	 * 로그인 체크
	 * @param request
	 * @param model
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/login.html", method=RequestMethod.POST)
	public String login(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.login(request, bean));
		
		return "general/loginReq";
	}
	
	/**
	 * 로그아웃
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/logout.html")
	public String logout(HttpServletRequest request) throws Exception {
		request.getSession().invalidate();
		
		return "redirect:/index.html";
	}
	
	/**
	 * 홈 - kpi 화면
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/home/kpi.html")
	public String kpi(HttpServletRequest request) throws Exception {
		return "general/kpi";
	}
	
	/**
	 * 사용자 세팅 정보 변경
	 * @param request
	 * @param model
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/changeUserSet.html", method=RequestMethod.POST)
	public String changeUserSet(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeUserSet(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/getProImgStream.html")
	public void getProImgStream(HttpServletRequest request, HttpServletResponse response) throws Exception {
		service.getProImgStream(request, response);
	}
	
	@RequestMapping(value="/getProImg.html")
	public void getProImg(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		service.getProImg(request, response, bean);
	}
	
	/**
	 * 도메인 목록
	 * @param request
	 * @param model
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getDomainList.html")
	public String getDomainList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getDomainList(bean));
		
		return "general/getDomainList";
	}
	
	@RequestMapping(value="/dash.html", method=RequestMethod.POST)
	public String getDashboardData(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.getDashboardData(request));
		
		return "general/getDashboardData";
	}
	
	@RequestMapping(value="/api/up/files.html", method=RequestMethod.POST)
	public String apiUploadFiles(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.apiUploadFiles(bean));
		
		return "share/result";
	}
}