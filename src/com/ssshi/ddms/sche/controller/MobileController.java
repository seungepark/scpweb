package com.ssshi.ddms.sche.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheCrewListBean;
import com.ssshi.ddms.sche.service.ScheServiceI;

/********************************************************************************
 * 프로그램 개요 : Mobile Controller
 * 
 * 최초 작성자 : AI Assistant
 * 최초 작성일 : 2025-01-27
 * 
 * 최종 수정자 : AI Assistant
 * 최종 수정일 : 2025-01-27
 * 
 * 메모 : 모바일 승선자 등록 페이지를 위한 컨트롤러
 * 
 * Copyright 2025 by HLab. Confidential and proprietary information
 * This document contains information, which is the property of HLab, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2025 HLab.  All rights reserved.
 *
 ********************************************************************************/

@Controller
public class MobileController {

	@Autowired
	private ScheServiceI service;
	
	/**
	 * 모바일 승선자 등록 페이지
	 * @param request
	 * @param model
	 * @param uid
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/mobile/mobileCrewinfo.html", method=RequestMethod.GET)
	public String mobileCrewinfo(HttpServletRequest request, ModelMap model, @RequestParam("uid") int uid) throws Exception {
		ParamBean bean = new ParamBean();
		bean.setUid(uid);
		
		// 기존 planCrew와 동일한 데이터 로드
		model.addAllAttributes(service.planCrew(request, bean));
		
		return "mobile/mobileCrewinfo";
	}
	
	/**
	 * 모바일 승선자 등록 저장
	 * @param request
	 * @param model
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/mobile/mobileCrewSave.html", method=RequestMethod.POST)
	public String mobileCrewSave(HttpServletRequest request, ModelMap model, ScheCrewListBean bean) throws Exception {
		try {
			// 기존 planCrewSave 서비스 호출하여 승선자 저장
			model.addAllAttributes(service.planCrewSave(request, bean));
			
			// 성공 시 결과 반환
			model.addAttribute(Const.RESULT, Const.OK);
			model.addAttribute("message", "승선자가 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			model.addAttribute(Const.RESULT, Const.FAIL);
			model.addAttribute("message", "승선자 등록 중 오류가 발생했습니다: " + e.getMessage());
		}
		
		return "share/resultCode";
	}
}
