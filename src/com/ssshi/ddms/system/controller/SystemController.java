package com.ssshi.ddms.system.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.dto.AuthGroupBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.system.service.SystemServiceI;

/********************************************************************************
 * 프로그램 개요 : System
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
 * 최종 수정일 : 2022-08-09
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
public class SystemController {

	@Autowired
	private SystemServiceI service;
	
	@RequestMapping(value="/system/group.html")
	public String group(HttpServletRequest request) throws Exception {
		return "system/group";
	}
	
	@RequestMapping(value="/system/getGroupList.html")
	public String getGroupList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getGroupList(bean));
		
		return "system/group/getGroupList";
	}
	
	@RequestMapping(value="/system/groupListDownloadAll.html")
	public String groupListDownloadAll(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getGroupList(bean));
		
		return "system/group/getGroupList";
	}
	
	@RequestMapping(value="/system/user.html")
	public String user(HttpServletRequest request) throws Exception {
		return "system/user";
	}
	
	@RequestMapping(value="/system/getUserList.html")
	public String getUserList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getUserList(bean));
		
		return "system/getUserList";
	}
	
	@RequestMapping(value="/system/userListDownloadAll.html")
	public String userListDownloadAll(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getUserList(bean));
		
		return "system/getUserList";
	}
	
	@RequestMapping(value="/system/group/newGroup.html")
	public String newGroup(HttpServletRequest request) throws Exception {
		return "system/group/newGroup";
	}
	
	@RequestMapping(value="/system/group/getAuthList.html")
	public String getAuthList(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.getAuthList());
		
		return "system/group/getAuthList";
	}
	
	@RequestMapping(value="/system/group/getLineGroupLeaderList.html")
	public String getLineGroupLeaderList(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.getLineGroupLeaderList());
		
		return "system/group/getLineGroupLeaderList";
	}
	
	@RequestMapping(value="/system/group/insertGroup.html")
	public String insertGroup(HttpServletRequest request, ModelMap model, AuthGroupBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.insertGroup(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/group/detailGroup.html")
	public String detailGroup(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.detailGroup(bean));
		
		return "system/group/detailGroup";
	}
	
	@RequestMapping(value="/system/group/modifyGroup.html")
	public String modifyGroup(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.detailGroup(bean));
		
		return "system/group/modifyGroup";
	}
	
	@RequestMapping(value="/system/group/updateGroup.html")
	public String updateGroup(HttpServletRequest request, ModelMap model, AuthGroupBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateGroup(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/system/group/changeStatusGroup.html")
	public String changeStatusGroup(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusGroup(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/group/deleteGroup.html")
	public String deleteGroup(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.deleteGroup(request, bean));
		
		return "system/group/deleteGroup";
	}
	
	@RequestMapping(value="/system/line/line.html")
	public String line(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.line());
		
		return "system/line/line";
	}
	
	@RequestMapping(value="/system/line/modifyLine.html")
	public String modifyLine(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.line());
		
		return "system/line/modifyLine";
	}
	
	@RequestMapping(value="/system/line/updateLine.html")
	public String updateLine(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateLine(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/user/changeStatusUser.html")
	public String changeStatusUser(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.changeStatusUser(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/user/deleteUser.html")
	public String deleteUser(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteUser(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/user/detailUser.html")
	public String detailUser(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.detailUser(bean));
		
		return "system/user/detailUser";
	}
	
	@RequestMapping(value="/system/user/newUser.html")
	public String newUser(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.newUser());
		return "system/user/newUser";
	}
	
	@RequestMapping(value="/system/user/insertUser.html")
	public String insertUser(HttpServletRequest request, ModelMap model, UserInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.insertUser(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/system/user/modifyUser.html")
	public String modifyUser(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.modifyUser(bean));
		
		return "system/user/modifyUser";
	}
	
	@RequestMapping(value="/system/user/updateUser.html")
	public String updateUser(HttpServletRequest request, ModelMap model, UserInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateUser(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/system/code/codeInfo.html")
	public String codeInfo(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAttribute(Const.LIST, service.codeInfo());
		
		return "system/code/codeInfo";
	}
	
	@RequestMapping(value="/system/group/getUserListForGroup.html")
	public String getUserListForGroup(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getUserListForGroup(bean));
		
		return "system/group/getUserListForGroup";
	}
	
	@RequestMapping(value="/system/log/audit.html")
	public String audit(HttpServletRequest request) throws Exception {
		return "system/log/audit";
	}
	
	@RequestMapping(value="/system/log/getAuditList.html")
	public String getAuditList(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getAuditList(bean));
		
		return "system/log/getAuditList";
	}
	
	@RequestMapping(value="/system/log/auditListDownloadAll.html")
	public String auditListDownloadAll(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.getAuditList(bean));
		
		return "system/log/getAuditList";
	}
}