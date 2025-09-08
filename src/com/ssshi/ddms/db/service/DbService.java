package com.ssshi.ddms.db.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.mybatis.dao.DbDaoI;
import com.ssshi.ddms.mybatis.dao.LogDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.LogUtil;

/********************************************************************************
 * 프로그램 개요 : Database
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2022-03-28
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

@Service
public class DbService implements DbServiceI {

	@Autowired
	private DbDaoI dao;
	
	@Autowired
	private LogDaoI logDao;

	@Override
	public List<DomainBean> getDomainList(DomainBean bean) throws Exception {
		List<DomainBean> list = dao.getDomainList(bean);
		
		for(int i = 0; i < list.size(); i++) {
			list.get(i).setInfoList(dao.getDomainInfoList(list.get(i).getUid()));
		}
		
		return list;
	}

	@Override
	public boolean insertDomain(HttpServletRequest request, DomainBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		dao.insertDomain(bean);
		
		if(bean.getUid() > 0) {
			logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
					"New Domain - " + bean.getDomain() + " : " + bean.getDescription() + " (" + bean.getCat() + " - " + bean.getDataType() + ")", ""));
			
			for(int i = 0; i < bean.getValList().length; i++) {
				DomainInfoBean infoBean = new DomainInfoBean();
				infoBean.setUserUid(bean.getUserUid());
				infoBean.setDomainUid(bean.getUid());
				infoBean.setVal(bean.getValList()[i]);
				infoBean.setDescription(bean.getDescList()[i]);
				
				if(DBConst.DOMAIN_DATATYPE_SY.equals(bean.getDataType())) {
					infoBean.setInVal(bean.getInValList()[i]);
				}else {
					infoBean.setInVal("");
				}
				
				dao.insertDomainInfo(infoBean);
				
				logDao.insertAudit(LogUtil.createAudit(infoBean.getUid(), LogUtil.DOMAININFO, bean.getUserUid(),
						"Add Domain Value : " + infoBean.getVal(), ""));
			}
			
			return DBConst.SUCCESS;
		}else {
			return DBConst.FAIL;
		}
	}
	
	@Override
	public Map<String, Object> updateDomain(HttpServletRequest request, DomainBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> useValList = new ArrayList<String>();
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(dao.updateDomain(bean) > DBConst.ZERO) {
			logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
					"Update Domain - " + bean.getDomain() + " : " + bean.getDescription(), ""));
			
			boolean isUseData = false;
			
			for(int i = 0; i < bean.getUidList().length; i++) {
				int uid = bean.getUidList()[i];
				DomainInfoBean infoBean = new DomainInfoBean();
				infoBean.setUserUid(bean.getUserUid());
				infoBean.setDescription(bean.getDescList()[i]);
				
				if(uid > 0) {
					infoBean.setUid(uid);
					dao.updateDomainInfo(infoBean);
					
					logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.DOMAININFO, bean.getUserUid(),
							"Update Domain Value - " + bean.getValList()[i] + " : " + infoBean.getDescription(), ""));
				}else {
					infoBean.setDomainUid(bean.getUid());
					infoBean.setVal(bean.getValList()[i]);
					
					if(DBConst.DOMAIN_DATATYPE_SY.equals(bean.getDataType())) {
						infoBean.setInVal(bean.getInValList()[i]);
					}else {
						infoBean.setInVal("");
					}
					
					dao.insertDomainInfo(infoBean);
					
					logDao.insertAudit(LogUtil.createAudit(infoBean.getUid(), LogUtil.DOMAININFO, bean.getUserUid(),
							"Add Domain Value : " + infoBean.getVal(), ""));
				}
			}
			
			if(bean.getDelList() != null) {
				for(int i = 0; i < bean.getDelValList().length; i++) {
					bean.setVal(bean.getDelValList()[i]);
					dao.deleteDomainInfo(bean.getDelList()[i]);
				}
			}
			
			if(isUseData) {
				resultMap.put(Const.RESULT, DBConst.SUCCESS);
				resultMap.put(Const.ERRCODE, Const.ERRCODE_CANT_DELETE_PART);
			}else {
				resultMap.put(Const.RESULT, DBConst.SUCCESS);
				resultMap.put(Const.ERRCODE, Const.OK);
			}
		}else {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put(Const.ERRCODE, Const.FAIL);
		}
		
		resultMap.put(Const.LIST, useValList);
		
		return resultMap;
	}

	@Override
	public List<ShipInfoBean> getVesselList(ShipInfoBean bean) throws Exception {
		return dao.getVesselList(bean);
	}

	@Override
	public String deleteVessel(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		String result = Const.ERRCODE_CANT_DELETE;
		
		int scheCnt = dao.checkScheduleVessel(bean.getUid());
		
		if(scheCnt == DBConst.ZERO) {
			if(dao.deleteVessel(bean.getUid()) > DBConst.ZERO) {
				result = Const.OK;
				
				logDao.insertAudit(LogUtil.deleteAudit(bean.getUid(), LogUtil.SHIPINFO, bean.getUserUid(),
						"Delete Vessel", ""));
			}else {
				result = Const.FAIL;
			}
		}else if(scheCnt > DBConst.ZERO) {
			result = Const.ERRCODE_EXIST_SCHED;
		}
		
		return result;
	}
	
	@Override
	public Map<String, Object> newVessel() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST+"Ship", dao.getDomainInfoListByDomainID("shiptype")); 
		
		return resultMap;
	}
	
	@Override
	public String insertVessel(HttpServletRequest request, ShipInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		String result = Const.ERRCODE_EXIST_SHIP;
		
		int cnt = dao.checkExistVessel(bean);
		
		if(cnt == DBConst.ZERO) {
			if(dao.insertVessel(bean) > DBConst.ZERO) {
				result = Const.OK;
				
				logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.SHIPINFO, bean.getUserUid(),
						"New Vessel : IMO - " + bean.getImo() + ", Ship No. - " + bean.getShipNum() + ", (" + bean.getTitle() + ")", ""));
			}else {
				result = Const.FAIL;
			}
		}
		
		return result;
	}

	@Override
	public ShipInfoBean detailVessel(ParamBean bean) throws Exception {
		return dao.getVessel(bean);
	}
	
	@Override
	public String updateVessel(HttpServletRequest request, ShipInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		bean.setCmd("UPDATE");
		
		String result = Const.ERRCODE_EXIST_SHIP;
		
		int cnt = dao.checkExistVessel(bean);
		
		if(cnt == DBConst.ZERO) {
			if(dao.updateVessel(bean) > DBConst.ZERO) {
				result = Const.OK;
				
				logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.SHIPINFO, bean.getUserUid(),
						"Update Vessel : IMO - " + bean.getImo() + ", Ship No. - " + bean.getShipNum() + ", (" + bean.getTitle() + ")", ""));
			}
		}
		
		return result;
	}
	
	@Override
	public Map<String, Object> modifyVessel(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getVessel(bean));
		resultMap.put(Const.LIST+"Ship", dao.getDomainInfoListByDomainID("shiptype")); 
		
		return resultMap;
	}

	@Override
	public Map<String, Object> deleteDomain(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		DomainBean domain = dao.getDomain(bean.getUid());
		
		if(domain != null && !domain.getDomain().isEmpty()) {
			dao.deleteDomainInfoByDomainUid(bean.getUid());
			dao.deleteDomain(bean.getUid());
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put(Const.ERRCODE, Const.OK);
			
			logDao.insertAudit(LogUtil.deleteAudit(bean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
					"Delete Domain", domain.getDomain()));
		}else {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put(Const.ERRCODE, Const.FAIL);
		}
		
		return resultMap;
	}

	@Override
	public boolean setDefaultVessel(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		dao.resetDefaultVessel(bean);
		
		return dao.setDefaultVessel(bean) > DBConst.ZERO ? DBConst.SUCCESS : DBConst.FAIL;
	}
	
	@Override
	public Map<String, Object> getVesselListForPop(ShipInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);

		resultMap.put(Const.LIST, dao.getVesselListForPop(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselListForPopCnt());

		return resultMap;
	}

	@Override
	public List<DomainInfoBean> getDomainInfoList(String domain) throws Exception {
		return dao.getDomainInfoListByDomainID(domain);
	}
	
	@Override
	public Map<String, Object> getVesselPageList(ShipInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);

		resultMap.put(Const.LIST, dao.getVesselPageList(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselPageListCnt());

		return resultMap;
	}

	@Override
	public boolean updateVesselDetail(HttpServletRequest request, ShipInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		return dao.updateVesselDetail(bean) > DBConst.ZERO ? DBConst.SUCCESS : DBConst.FAIL;
	}
}