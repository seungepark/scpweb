package com.ssshi.ddms.db.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.cron.cron.CronScheduler;
import com.ssshi.ddms.cron.service.CronServiceI;
import com.ssshi.ddms.db.service.DbServiceI;
import com.ssshi.ddms.dto.CronInfoBean;
import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;

/********************************************************************************
 * 프로그램 개요 : Database
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2022-03-28
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-06-24
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
public class DbController {

	@Autowired
	private DbServiceI service;
	
	@Autowired
	private CronServiceI cronService;
	
	@Autowired
	private CronScheduler cs;
	
	@RequestMapping(value="/db/cron/cron.html")
	public String cron(HttpServletRequest request) throws Exception {
		return "db/cron/cron";
	}
	
	@RequestMapping(value="/db/cron/getCronList.html")
	public String getCronList(HttpServletRequest request, ModelMap model, CronInfoBean bean) throws Exception {
		model.addAllAttributes(cronService.getCronList(bean));
		return "db/cron/getCronList";
	}
	
	@RequestMapping(value="/db/cron/cronListDownloadAll.html")
	public String cronListDownloadAll(HttpServletRequest request, ModelMap model, CronInfoBean bean) throws Exception {
		model.addAllAttributes(cronService.getCronList(bean));
		return "db/cron/getCronList";
	}
	
	@RequestMapping(value="/db/cron/detailCron.html")
	public String detailCron(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.BEAN, cronService.detailCron(bean));
		
		return "db/cron/detailCron";
	}
	
	@RequestMapping(value="/db/cron/modifyCron.html")
	public String modifyCron(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.BEAN, cronService.modifyCron(bean));
		
		return "db/cron/modifyCron";
	}
	
	@RequestMapping(value="/db/cron/updateCron.html")
	public String updateCron(HttpServletRequest request, ModelMap model, CronInfoBean bean) throws Exception {
		String result = cronService.updateCron(request, bean);
		
		// Result 값이 OK 일 때 Cron 스케줄 변경 
		if(Const.OK.equals(result)) {
			cs.stopScheduler(bean.getCronid(), bean.getCronclass());
			Thread.sleep(1000);
			cs.startScheduler(bean.getCronid(), bean.getCronclass(), bean.getFrequency());
		}
		
		model.addAttribute(Const.RESULT, result);
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/db/cron/changeStatusCron.html")
	public String changeStatusCron(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		
		boolean result = cronService.changeStatusCron(request, bean);
		
		if(result == DBConst.SUCCESS) {
			for(int i = 0; i < bean.getUidArr().length; i++) {
				int uid = bean.getUidArr()[i];
				bean.setUid(uid);
				
				CronInfoBean cronBean = cronService.getCron(bean);
				
				if(DBConst.STATUS_ACTIVE.equals(bean.getStatus())) {
					cs.startScheduler(cronBean.getCronid(), cronBean.getCronclass(), cronBean.getFrequency());
				} else if(DBConst.STATUS_INACTIVE.equals(bean.getStatus())) {
					cs.stopScheduler(cronBean.getCronid(), cronBean.getCronclass());
				}
			}
		}
		
		model.addAttribute(Const.RESULT, result);
		
		return "share/result";
	}
	
	@RequestMapping(value="/db/cron/deleteCron.html")
	public String deleteCron(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, cronService.deleteCron(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/db/cron/newCron.html")
	public String newCron(HttpServletRequest request) throws Exception {
		return "db/cron/newCron";
	}
	
	@RequestMapping(value="/db/cron/insertCron.html")
	public String insertCron(HttpServletRequest request, ModelMap model, CronInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, cronService.insertCron(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/db/domain/domain.html")
	public String domain(HttpServletRequest request) throws Exception {
		return "db/domain/domain";
	}
	
	@RequestMapping(value="/db/domain/getDomainList.html")
	public String getDomainList(HttpServletRequest request, ModelMap model, DomainBean bean) throws Exception {
		model.addAttribute(Const.LIST, service.getDomainList(bean));
		
		return "db/domain/getDomainList";
	}
	
	@RequestMapping(value="/db/domain/insertDomain.html")
	public String insertDomain(HttpServletRequest request, ModelMap model, DomainBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.insertDomain(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/db/domain/updateDomain.html")
	public String updateDomain(HttpServletRequest request, ModelMap model, DomainBean bean) throws Exception {
		model.addAllAttributes(service.updateDomain(request, bean));
		
		return "db/domain/updateDomain";
	}
	
	@RequestMapping(value="/db/vessel/vessel.html")
	public String vessel(HttpServletRequest request) throws Exception {
		return "db/vessel/vessel";
	}
	
	@RequestMapping(value="/db/vessel/getVesselList.html")
	public String getVesselList(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		List<ShipInfoBean> vesselList = service.getVesselList(bean);
		
		model.addAttribute(Const.LIST, vesselList);
		model.addAttribute(Const.LIST_CNT, vesselList.size());
		return "db/vessel/getVesselList";
	}
	
	@RequestMapping(value="/db/vessel/deleteVessel.html")
	public String deleteVessel(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.deleteVessel(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/db/vessel/newVessel.html")
	public String newVessel(HttpServletRequest request, ModelMap model) throws Exception {
		model.addAllAttributes(service.newVessel());
		
		return "db/vessel/newVessel";
	}
	
	@RequestMapping(value="/db/vessel/insertVessel.html")
	public String insertVessel(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.insertVessel(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/db/vessel/detailVessel.html")
	public String detailVessel(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.BEAN, service.detailVessel(bean));
		
		return "db/vessel/detailVessel";
	}
	
	@RequestMapping(value="/db/vessel/modifyVessel.html")
	public String modifyVessel(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.modifyVessel(bean));
		
		return "db/vessel/modifyVessel";
	}
	
	@RequestMapping(value="/db/vessel/updateVessel.html")
	public String updateVessel(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateVessel(request, bean));
		
		return "share/resultString";
	}
	
	@RequestMapping(value="/db/domain/deleteDomain.html")
	public String deleteDomain(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.deleteDomain(request, bean));
		
		return "db/domain/deleteDomain";
	}
	
	@RequestMapping(value="/db/vessel/setDefaultVessel.html")
	public String setDefaultVessel(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.setDefaultVessel(request, bean));
		
		return "share/result";
	}
	
	@RequestMapping(value="/db/vessel/getVesselListForPop.html")
	public String getVesselListForPop(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		model.addAllAttributes(service.getVesselListForPop(bean));
		
		return "db/vessel/getVesselList";
	}
	
	@RequestMapping(value="/db/vessel/getVesselPageList.html")
	public String getVesselPageList(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		model.addAllAttributes(service.getVesselPageList(bean));
		
		return "db/vessel/getVesselPageList";
	}
	
	@RequestMapping(value="/db/vessel/updateVesselDetail.html")
	public String updateVesselDetail(HttpServletRequest request, ModelMap model, ShipInfoBean bean) throws Exception {
		model.addAttribute(Const.RESULT, service.updateVesselDetail(request, bean));
		
		return "share/result";
	}
}