package com.ssshi.ddms.manager.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScheduleCodeDetailBean;
import com.ssshi.ddms.dto.ScheduleCodeInfoBean;
import com.ssshi.ddms.dto.ScheduleHierarchyBean;
import com.ssshi.ddms.dto.SchedulerCrewDetailBean;
import com.ssshi.ddms.dto.SchedulerCrewInfoBean;
import com.ssshi.ddms.dto.SchedulerDetailInfoBean;
import com.ssshi.ddms.dto.SchedulerInfoBean;
import com.ssshi.ddms.dto.SchedulerReportInfoBean;
import com.ssshi.ddms.dto.SchedulerVersionInfoBean;
import com.ssshi.ddms.dto.ShipCondBean;
import com.ssshi.ddms.dto.StandardReqInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.dto.VesselReqInfoBean;
import com.ssshi.ddms.dto.VesselReqInfoDetailBean;
import com.ssshi.ddms.mybatis.dao.DbDaoI;
import com.ssshi.ddms.mybatis.dao.LogDaoI;
import com.ssshi.ddms.mybatis.dao.ManagerDaoI;
import com.ssshi.ddms.mybatis.dao.SystemDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.LogUtil;

/********************************************************************************
 * 프로그램 개요 : Manager
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2025-05-12
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
public class ManagerService implements ManagerServiceI {

	@Autowired
	private ManagerDaoI dao;
	
//	@Autowired
//	private GeneralDaoI gDao;
	
	@Autowired
	private LogDaoI logDao;
	
	@Autowired
	private SystemDaoI sysDao;
	
	@Autowired
	private DbDaoI dbDao;
	
	@Override
	public Map<String, Object> scheduler() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getSchedulerList(SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		} else{
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getSchedulerList(bean));
		resultMap.put(Const.LIST_CNT, dao.getSchedulerListCnt());
		
		return resultMap;
	}

	@Override
	public SchedulerInfoBean getScheduler(ParamBean bean) throws Exception {
		return dao.getScheduler(bean);
	}
	
	@Override
	public SchedulerInfoBean detailScheduler(ParamBean bean) throws Exception {
		return dao.getScheduler(bean);
	}

	@Override
	public Map<String, Object> getSchedulerRowDataList(SchedulerDetailInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ParamBean param = new ParamBean();
		param.setUid(bean.getUid());
		resultMap.put(Const.BEAN, dao.getScheduler(param));
		resultMap.put(Const.LIST, dao.getSchedulerRowDataList(bean));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getSchedulerChartDataList(SchedulerDetailInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST, dao.getSchedulerRowDataList(bean));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> newScheduler(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, sysDao.getUser(bean));
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"reqinfotitle", dbDao.getDomainInfoListByDomainID("reqinfotitle"));
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));

		return resultMap;
	}
	
	@Override
	public Map<String, Object> modifyScheduler(HttpServletRequest request, ParamBean bean) throws Exception {
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		resultMap.put(Const.BEAN, scheBean);
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		scheBean.getHullnum();
//		resultMap.put(Const.LIST, dao.getSchedulerRowDataList(scheBean));
		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));
		
		return resultMap;
	}

	@Override
	public boolean updateScheduler(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		ParamBean userBean = new ParamBean();
		ParamBean paramBean = new ParamBean();
		
		if(DBConst.Y.equals(dao.isOfflineMode(bean.getUid()))) {
			return DBConst.FAIL;
		}else {
			// 업데이트 로직
			dao.updateScheduler(bean);

			for(int i = 0; i < bean.getUidList().length; i++) {
				if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
					SchedulerDetailInfoBean detBean = new SchedulerDetailInfoBean();
					
					detBean.setUid(bean.getUidList()[i]);
					detBean.setCategory(bean.getCateList()[i]);
					detBean.setTcnum(bean.getTcnumList()[i]);
					detBean.setDescription(bean.getDescList()[i]);
					detBean.setLoadrate(getNumOrNullData(bean.getLoadList()[i]));
					detBean.setSdate(bean.getSdateList()[i]);
					detBean.setStime(bean.getStimeList()[i]);
					detBean.setEdate(bean.getEdateList()[i]);
					detBean.setEtime(bean.getEtimeList()[i]);
					detBean.setSeq(getNumOrNullData(bean.getSeqList()[i]));
					detBean.setPer(getNumOrNullData(bean.getPerList()[i]));
					detBean.setFlag(bean.getFlagList()[i]);
					detBean.setCtype(bean.getCtypeList()[i]);
					detBean.setDtype(bean.getDtypeList()[i]);
					detBean.setReadytime(getNumOrNullData(bean.getReadyTmList()[i]));
					detBean.setCodedetuid(getNumOrNullData(bean.getCodedetuidList()[i]));
					detBean.setSametcnum(bean.getSametcnumList()[i]);
					detBean.setSchedinfouid(bean.getUid());
					detBean.setUserUid(bean.getUserUid());

					detBean.setPerformancesdate(bean.getPerformancesdateList()[i]);
					detBean.setPerformancestime(bean.getPerformancestimeList()[i]);
					detBean.setPerformanceedate(bean.getPerformanceedateList()[i]);
					detBean.setPerformanceetime(bean.getPerformanceetimeList()[i]);

					detBean.setCodedetdesc(bean.getCodedetdescList()[i]);
					detBean.setCodedettcnum(bean.getCodedettcnumList()[i]);
				
					if("C".equalsIgnoreCase(detBean.getFlag())){
						dao.insertSchedulerDetail(detBean);

//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//								"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
						
					} else if(detBean.getUid() > 0 && "U".equalsIgnoreCase(detBean.getFlag())) {
						dao.updateSchedulerDetail(detBean);
						
//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//						"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
					} else if(detBean.getUid() > 0 &&"D".equalsIgnoreCase(detBean.getFlag())) {
						dao.deleteSchedulerDetail(detBean.getUid());
						
//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//						"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
					}
				}
			}
			
			userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
			paramBean.setUid(bean.getUid());
			
			return DBConst.SUCCESS;
		}
	}

	@Override
	public String insertScheduler(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		bean.setStatus("INACT");

		SchedulerVersionInfoBean versionInfoBean = new SchedulerVersionInfoBean();
		versionInfoBean.setPlanRevNum("A-0");
		versionInfoBean.setUserUid(userUid);
		dao.insertSchedulerVersionInfo(versionInfoBean);

		bean.setSchedulerVersionInfoUid(versionInfoBean.getUid());
		bean.setRevnum(versionInfoBean.getPlanRevNum());
		
		// 선박번호, 시운전종류, 마지막 키NO 기준으로 다음 키NO 확인.
		// 키값 생성.
		String schedType = bean.getSchedtype();
		
		if(DBConst.SCHEDTYPE_SEA.equals(schedType)) {
			schedType = DBConst.KEY_SCHEDTYPE_SEA;
		}else if(DBConst.SCHEDTYPE_GAS.equals(schedType)) {
			schedType = DBConst.KEY_SCHEDTYPE_GAS;
		}else if(DBConst.SCHEDTYPE_TOTAL.equals(schedType)) {
			schedType = DBConst.KEY_SCHEDTYPE_TOTAL;
		}
		
		int nextKeyNo = dao.getLastKeyNo(bean) + 1;
		String trialKey = bean.getHullnum() + schedType + (nextKeyNo > 9 ? "" : "0") + nextKeyNo;
		bean.setKeyNo(nextKeyNo);
		bean.setTrialKey(trialKey);
		
		dao.insertScheduler(bean);

		if(bean.getUid() > 0) {


			logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.SCHEDULERINFO, bean.getUserUid(),
					"New Scheduler - " + bean.getHullnum() + " : " + bean.getShiptype() + " : " + bean.getDescription(), ""));
			
			for(int i = 0; i < bean.getCateList().length; i++) {
				SchedulerDetailInfoBean detBean = new SchedulerDetailInfoBean();
				detBean.setCategory(bean.getCateList()[i]);
				detBean.setTcnum(bean.getTcnumList()[i]);
				detBean.setDescription(bean.getDescList()[i]);
				detBean.setLoadrate(getNumOrNullData(bean.getLoadList()[i]));
				detBean.setSdate(bean.getSdateList()[i]);
				detBean.setStime(bean.getStimeList()[i]);
				detBean.setEdate(bean.getEdateList()[i]);
				detBean.setEtime(bean.getEtimeList()[i]);
				detBean.setSeq(getNumOrNullData(bean.getSeqList()[i]));
				detBean.setPer(getNumOrNullData(bean.getPerList()[i]));
				detBean.setCtype(bean.getCtypeList()[i]);
				detBean.setDtype(bean.getDtypeList()[i]);
				detBean.setReadytime(getNumOrNullData(bean.getReadyTmList()[i]));
				detBean.setCodedetuid(getNumOrNullData(bean.getCodedetuidList()[i]));
				detBean.setSametcnum(bean.getSametcnumList()[i]);
				detBean.setSchedinfouid(bean.getUid());
				detBean.setUserUid(bean.getUserUid());
				detBean.setCodedetdesc(bean.getCodedetdescList()[i]);
				detBean.setCodedettcnum(bean.getCodedettcnumList()[i]);

				dao.insertSchedulerDetail(detBean);
			}
			
		}
		
//		return Const.OK + "" + bean.getUid();
		return "" + bean.getUid();
	}
	
	// 사용 여부 확인 필요 (24.10.29. 계획신규 수정 )
	@Override
	public Map<String, Object> getScheduleTcNumSearchList(HttpServletRequest request, ScheduleCodeDetailBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getScheduleTcNumSearchList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheduleTcNumSearchListCnt());
		
		return resultMap;
	}
	
	@Override
	public boolean deleteScheduler(HttpServletRequest request, ParamBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];

			if(DBConst.Y.equals(dao.isOfflineMode(uid))) {
				continue;
			}
			
			dao.deleteVesselReqInfoDetailFromScheduler(uid);
			dao.deleteVesselReqInfoFromScheduler(uid);
			dao.deleteSchedulerDetailForList(uid);
			dao.deleteScheduler(uid);
			
			logDao.insertAudit(LogUtil.deleteAudit(uid, LogUtil.SCHEDULERINFO, userUid,
					"Delete Scheduler", ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public boolean changeStatusScheduler(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
			
			if(DBConst.Y.equals(dao.isOfflineMode(uid))) {
				continue;
			}
						
			bean.setUid(uid);
			
			dao.changeStatusVesselReqInfoFromScheduler(bean);
			dao.changeStatusScheduler(bean);
			
			logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.SCHEDULERINFO, bean.getUserUid(),
					"Scheduler Change Status : " + bean.getStatus(), ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> getScheduleHierarchyList(HttpServletRequest request, ScheduleHierarchyBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		List<ScheduleHierarchyBean> rtnList = new ArrayList<ScheduleHierarchyBean>();
		List<ScheduleHierarchyBean> allList = dao.getScheduleHierarchyList(bean);
		
		for(int i = 0; i < allList.size(); i++){
			ScheduleHierarchyBean topHire = allList.get(i);
			// Lv1 Add
			if(topHire.getCodelevel() == 1) {
				rtnList.add(topHire);
				
				// Lv2 Add
				for(int j = 0; j < allList.size(); j++) {
					ScheduleHierarchyBean lv2Hire = allList.get(j);
					
					if(lv2Hire.getCodelevel() == 2 && lv2Hire.getParentuid() != null &&  Integer.parseInt(lv2Hire.getParentuid()) == topHire.getUid()) {
						rtnList.add(lv2Hire);
						
						// Lv3 Add
						for(int k = 0; k < allList.size(); k++){
							ScheduleHierarchyBean lv3Hire = allList.get(k);
							
							if(lv3Hire.getCodelevel() == 3 && lv3Hire.getParentuid() != null && Integer.parseInt(lv3Hire.getParentuid()) == lv2Hire.getUid()) {
								rtnList.add(lv3Hire);
								
								// lv4 Add
								for(int n = 0; n < allList.size(); n++) {
									ScheduleHierarchyBean lv4Hire = allList.get(n);
									
									if(lv4Hire.getCodelevel() == 4 && lv4Hire.getParentuid() != null && Integer.parseInt(lv4Hire.getParentuid()) == lv3Hire.getUid()) {
										rtnList.add(lv4Hire);
									}
								}
							}
						}
					}
				}
			}
		}
		
		resultMap.put(Const.LIST, rtnList);
		resultMap.put(Const.LIST_CNT, dao.getScheduleHierarchyListCnt());
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getScheduleHierarchyParentList(HttpServletRequest request, ScheduleHierarchyBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);
		
		resultMap.put(Const.LIST, dao.getScheduleHierarchyParentList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheduleHierarchyListCnt());
		return resultMap;
	}
	
	@Override
	public boolean updateScheduleHierarchy(HttpServletRequest request, ScheduleHierarchyBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(bean.getCodeLvList() != null) {
			for(int i = 0; i < bean.getCodeLvList().length; i++) {
				if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
					ScheduleHierarchyBean hireBean = new ScheduleHierarchyBean();
					
					hireBean.setUid(bean.getUidList()[i]);
					hireBean.setCodelevel(bean.getCodeLvList()[i]);
					hireBean.setCode(bean.getCodeList()[i]);
					hireBean.setDisplaycode(bean.getDisCodeList()[i]);
					hireBean.setDescription(getNumOrNullData(bean.getDescList()[i]));
					hireBean.setParentuid(getNumOrNullData(bean.getParentuidList()[i]));
					hireBean.setFlag(bean.getFlagList()[i]);
					hireBean.setUserUid(bean.getUserUid());
				
					if("C".equalsIgnoreCase(hireBean.getFlag())){
						dao.insertScheduleHirerarchy(hireBean);
						
//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//								"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
						
					} else if(hireBean.getUid() > 0 && "U".equalsIgnoreCase(hireBean.getFlag())) {
						dao.updateScheduleHirerarchy(hireBean);
						
//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//						"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
					} else if(hireBean.getUid() > 0 &&"D".equalsIgnoreCase(hireBean.getFlag())) {
						dao.deleteScheduleHirerarchy(hireBean.getUid());
						
//						logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//						"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
					}
				}
			}
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> scheduleCode(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getScheduleCodeInfoList(HttpServletRequest request, ScheduleCodeInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getScheduleCodeInfoList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheduleCodeInfoListCnt());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getScheduleCodeInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getScheduleCodeInfo(bean));

		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));

		return resultMap;
	}
	
	@Override
	public Map<String, Object> getSchedulerCodeDetList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getScheduleCodeDetList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScheduleCodeDetListCnt());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getScheduleHierarchyForCodeDetList(HttpServletRequest request, ScheduleHierarchyBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);
		
		List<ScheduleHierarchyBean> allHierarchy = dao.getScheduleHierarchyList(new ScheduleHierarchyBean());
		List<ScheduleHierarchyBean> searchList = dao.getScheduleHierarchyParentList(bean);
		
		for(int i = 0; i < searchList.size(); i++){
			ScheduleHierarchyBean curHier = searchList.get(i);
			int codeLv = curHier.getCodelevel();
			if(codeLv == 2) {
				curHier.setLv2code(curHier.getCode());
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
				
			} else if(codeLv == 3) {
				String lv1Uid = null;
				curHier.setLv3code(curHier.getCode());
				
				// Lv2Code 입력
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv2code(allHierarchy.get(j).getCode());
						lv1Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv1Uid != null && Integer.parseInt(lv1Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
			} else if(codeLv == 4){
				String lv1Uid = null;
				String lv2Uid = null;
				curHier.setLv4code(curHier.getCode());
				
				// Lv3Code 입력
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv3code(allHierarchy.get(j).getCode());
						lv2Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv2Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv2Uid != null && Integer.parseInt(lv2Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv2code(allHierarchy.get(j).getCode());
						lv1Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv1Uid != null && Integer.parseInt(lv1Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
			}
		}
		
		resultMap.put(Const.LIST, searchList);
		resultMap.put(Const.LIST_CNT, dao.getScheduleHierarchyParentListCnt());
		return resultMap;
	}
	
	@Override
	public boolean updateScheduleCode(HttpServletRequest request, ScheduleCodeInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		ParamBean userBean = new ParamBean();
		ParamBean paramBean = new ParamBean();
		
		// 업데이트 로직
		dao.updateScheduleCode(bean);
		
		for(int i = 0; i < bean.getUidList().length; i++) {
			if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
				ScheduleCodeDetailBean detBean = new ScheduleCodeDetailBean();
				
				detBean.setSchecodeinfouid(bean.getUid());
				
				detBean.setUid(bean.getUidList()[i]);
				detBean.setCodelevel(bean.getCodelvList()[i]);
				detBean.setDisplaycode(bean.getTcnumList()[i]);
				detBean.setSchehierarchyuid(getNumOrNullData(bean.getHieruidList()[i]));
				detBean.setLv1code(bean.getLv1codeList()[i]);
				
				detBean.setLv2code(bean.getLv2codeList()[i]);
				detBean.setLv3code(bean.getLv3codeList()[i]);
				detBean.setLv4code(bean.getLv4codeList()[i]);
				detBean.setDescription(bean.getDescList()[i]);
				detBean.setCtype(bean.getCtypeList()[i]);
				
				detBean.setDtype(bean.getDtypeList()[i]);
				detBean.setLoadstr(bean.getLoadStrList()[i]);
				detBean.setLoadrate(getNumOrNullData(bean.getLoadRateList()[i]));
				detBean.setPer(getNumOrNullData(bean.getPerList()[i]));
				detBean.setReadytime(getNumOrNullData(bean.getReadyTmList()[i]));
				
				detBean.setSeq(getNumOrNullData(bean.getSeqList()[i]));
				detBean.setSametcnum(bean.getSameTcnumList()[i]);
				detBean.setFlag(bean.getFlagList()[i]);
				detBean.setUserUid(bean.getUserUid());
			
				if("C".equalsIgnoreCase(detBean.getFlag())){
					dao.insertScheduleCodeDetail(detBean);
					
//					logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//							"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
					
				} else if(detBean.getUid() > 0 && "U".equalsIgnoreCase(detBean.getFlag())) {
					dao.updateScheduleCodeDetail(detBean);
					
//					logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//					"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
				} else if(detBean.getUid() > 0 &&"D".equalsIgnoreCase(detBean.getFlag())) {
					dao.deleteScheduleCodeDetail(detBean.getUid());
					
//					logDao.insertAudit(LogUtil.createAudit(detBean.getUid(), LogUtil.DOMAIN, bean.getUserUid(),
//					"New Mapping - " + mBean.getDocCode() + " [" + mBean.getCtgr() + "] : " + mBean.getDescription(), ""));
				}
			}
		}
		
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		paramBean.setUid(bean.getUid());
		return DBConst.SUCCESS;
	}
	
	@Override
	public boolean changeStatusScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
						
			bean.setUid(uid);
			dao.changeStatusScheduleCode(bean);
			
			logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.SCHEDULECODE, bean.getUserUid(),
					"ScheduleCode Change Status : " + bean.getStatus(), ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public boolean deleteScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
			
			dao.deleteScheduleCode(uid);
			dao.deleteScheduleCodeDetailForList(uid);
			
			logDao.insertAudit(LogUtil.deleteAudit(uid, LogUtil.SCHEDULECODE, userUid,
					"Delete ScheduleCode", ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> newScheduleCode(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));
		
		return resultMap;
	}
	
	@Override
	public boolean insertScheduleCode(HttpServletRequest request, ScheduleCodeInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		// 헤더 정보 입력
		dao.insertScheduleCode(bean);
		
		// 상세 정보 입력 
		if(bean.getUid() > 0 && bean.getCodelvList() != null) {
			for(int i = 0; i < bean.getCodelvList().length; i++) {
				ScheduleCodeDetailBean detBean = new ScheduleCodeDetailBean();
				
				detBean.setSchecodeinfouid(bean.getUid());
				
				detBean.setCodelevel(bean.getCodelvList()[i]);
				detBean.setDisplaycode(bean.getTcnumList()[i]);
				detBean.setSchehierarchyuid(getNumOrNullData(bean.getHieruidList()[i]));
				detBean.setLv1code(bean.getLv1codeList()[i]);
				
				detBean.setLv2code(bean.getLv2codeList()[i]);
				detBean.setLv3code(bean.getLv3codeList()[i]);
				detBean.setLv4code(bean.getLv4codeList()[i]);
				detBean.setDescription(bean.getDescList()[i]);
				detBean.setCtype(bean.getCtypeList()[i]);
				
				detBean.setDtype(bean.getDtypeList()[i]);
				detBean.setLoadstr(bean.getLoadStrList()[i]);
				detBean.setLoadrate(getNumOrNullData(bean.getLoadRateList()[i]));
				detBean.setPer(getNumOrNullData(bean.getPerList()[i]));
				detBean.setReadytime(getNumOrNullData(bean.getReadyTmList()[i]));
				
				detBean.setSeq(getNumOrNullData(bean.getSeqList()[i]));
				detBean.setSametcnum(bean.getSameTcnumList()[i]);
				detBean.setUserUid(bean.getUserUid());
			
				dao.insertScheduleCodeDetail(detBean);
			}
		}
		return DBConst.SUCCESS;
	}
	
	/**
	 * 숫자 값 컬럼에 필요 시 null 입력용 함수 
	 * @param val
	 * @return
	 */
	private String getNumOrNullData(String val) {
		return val == null || "".equals(val) ? null : val;
	}

	@Override
	public Map<String, Object> getStndReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap.put(Const.LIST+"reqinfotitle", dbDao.getDomainInfoListByDomainID("reqinfotitle"));
		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));

		return resultMap;
	}

	@Override
	public Map<String, Object> getStandardReqInfoList() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap.put(Const.LIST, dao.getStandardReqInfoList());

		return resultMap;
	}

	@Override
	public boolean deleteStandardReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		dao.deleteStandardReqInfo(bean.getUid());

		logDao.insertAudit(LogUtil.deleteAudit(bean.getUid(), LogUtil.STANDARDREQINFO, userUid,
				"Delete Standard Req Info", ""));

		return DBConst.SUCCESS;
	}

	public boolean insertStandardReqInfo(HttpServletRequest request, List<StandardReqInfoBean> params) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		for (StandardReqInfoBean bean: params) {
			if (!"R".equals(bean.getFlag())) {
				bean.setUserUid(userUid);

				if ("D".equals(bean.getFlag())) {
					dao.deleteStandardReqInfo(bean.getUid());

					logDao.insertAudit(LogUtil.deleteAudit(bean.getUid(), LogUtil.STANDARDREQINFO, userUid,
							"Delete Standard Req Info", ""));
				} else if ("U".equals(bean.getFlag())) {
					dao.updateStandardReqInfo(bean);

					logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.STANDARDREQINFO, userUid,
							"Change Standard Req Info", ""));
				} else if ("C".equals(bean.getFlag())) {
					dao.insertStandardReqInfo(bean);

					logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.STANDARDREQINFO, userUid,
							"Insert Standard Req Info", ""));
				}
			}
		}

		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> vesselReqInfo() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		
		return resultMap;
	}

	@Override
	public Map<String, Object> getVessleReqInfoList(HttpServletRequest request, VesselReqInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}

		resultMap.put(Const.LIST, dao.getVesselReqInfoList(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselReqInfoListCnt());

		return resultMap;
	}

	@Override
	public boolean changeStatusVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];

			bean.setUid(uid);
			dao.changeStatusVesselReqInfo(bean);

			logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.VESSELREQINFO, bean.getUserUid(),
					"Vessel Req Info Change Status : " + bean.getStatus(), ""));
		}

		return DBConst.SUCCESS;
	}

	@Override
	public boolean deleteVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		for (int uid : bean.getUidArr()) {
			bean.setUid(uid);

			dao.deleteVesselReqInfoDetailByVsslReqInfoUid(uid);
			dao.deleteVesselReqInfo(uid);

			logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.VESSELREQINFO, bean.getUserUid(),
					"Vessel Req Info Delete : " + bean.getStatus(), ""));
		}

		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> getVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"reqinfotitle", dbDao.getDomainInfoListByDomainID("reqinfotitle"));

		if (bean.getTempUid() != 0) {
			resultMap.put(Const.BEAN, dao.getVesselReqInfoByTempUid(bean));
		} else {
			resultMap.put(Const.BEAN, dao.getVesselReqInfo(bean));
		}

		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));


		return resultMap;
	}

	@Override
	public Map<String, Object> getVesselReqInfoDetList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}

		resultMap.put(Const.LIST, dao.getVesselReqInfoDetList(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselReqInfoDetListCnt());

		return resultMap;
	}

	@Override
	public Map<String, Object> getVesselReqInfoDetListByHullNum(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.LIST, dao.getVesselReqInfoDetListBySchedinfoUid(bean));
		resultMap.put(Const.LIST_CNT, dao.getVesselReqInfoDetListBySchedinfoUidCnt());
		resultMap.put(Const.BEAN, dao.getVesselReqInfoBySchedinfoUid(bean));
		return resultMap;
	}

	@Override
	@Transactional
	public boolean insertVesselReqInfoDet(HttpServletRequest request, VesselReqInfoBean param) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		for (VesselReqInfoDetailBean bean: param.getParams()) {
			if (!"R".equals(bean.getFlag()) && param != null && param.getUid() != 0 ) {
				bean.setUserUid(userUid);
				bean.setVsslreqinfouid(param.getUid());

				if ("D".equals(bean.getFlag())) {
					dao.deleteVesselReqInfoDetail(bean.getUid());

					logDao.insertAudit(LogUtil.deleteAudit(bean.getUid(), LogUtil.VESSELREQINFODETAIL, userUid,
							"Delete Vessel Req Info Detail", ""));
				} else if ("U".equals(bean.getFlag())) {
					dao.updateVesselReqInfoDetail(bean);

					logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.VESSELREQINFODETAIL, userUid,
							"Change Vessel Req Info Detail", ""));
				} else if ("C".equals(bean.getFlag())) {
					dao.insertVesselReqInfoDetail(bean);

					logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.VESSELREQINFODETAIL, userUid,
							"Insert Vessel Req Info Detail", ""));
				}
			}
		}

		dao.updateVesselReqInfo(param);
		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> newVesselReqInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"reqinfotitle", dbDao.getDomainInfoListByDomainID("reqinfotitle"));

		return resultMap;
	}

	@Override
	@Transactional
	public boolean insertVesselReqInfo(HttpServletRequest request, VesselReqInfoBean param) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		param.setUserUid(userUid);

		dao.insertVesselReqInfo(param);

		logDao.insertAudit(LogUtil.updateAudit(param.getUid(), LogUtil.VESSELREQINFO, userUid,
				"Insert Vessel Req Info", ""));

		for (VesselReqInfoDetailBean bean: param.getParams()) {
			if (!"R".equals(bean.getFlag()) && param != null && param.getUid() != 0 ) {
				bean.setUserUid(userUid);
				bean.setVsslreqinfouid(param.getUid());

				if ("C".equals(bean.getFlag())) {
					dao.insertVesselReqInfoDetail(bean);

					logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.VESSELREQINFODETAIL, userUid,
							"Insert Vessel Req Info Detail", ""));
				}
			}
		}

		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> getCurReqInfoDetList(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		if(bean.getCopyUid() > 0) {
			bean.setUid(bean.getCopyUid());
			
			resultMap.put(Const.LIST, dao.getVesselReqInfoDetListBySchedinfoUid(bean));
			resultMap.put(Const.LIST_CNT, dao.getVesselReqInfoDetListBySchedinfoUidCnt());
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> popModifyScheChart(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"shipcondtype", dbDao.getDomainInfoListByDomainID("shipcondtype"));
		resultMap.put(Const.LIST + "Code", dao.get1LevelCodeList());
		
		return resultMap;
	}

	@Override
	@Transactional
	public boolean insertShipCond(HttpServletRequest request, ShipCondBean param) throws Exception {
		dao.deleteShipCond(param.getSchedinfouid());
		if (param.getShipconds() != null) {
			for (ShipCondBean bean: param.getShipconds()) {
				dao.insertShipCond(bean);
			}
		}
		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> getShipCondList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.LIST, dao.getShipCondList(bean));
		return resultMap;
	}

	@Override
	public Map<String, Object> reportSchedule(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put(Const.LIST+"shipcondtype", dbDao.getDomainInfoListByDomainID("shipcondtype"));
		resultMap.put(Const.LIST + "Code", dao.get1LevelCodeList());
		
		return resultMap;
	}

	@Override
	public Map<String, Object> departureDashboard(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		resultMap.put(Const.BEAN, scheBean);

		return resultMap;
	}
	
	@Override
	public Map<String, Object> departureReport(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		List<DomainInfoBean> cates = dbDao.getDomainInfoListByDomainID(DBConst.DOMAIN_CREW_CATE);
		List<DomainInfoBean> positions = dbDao.getDomainInfoListByDomainID(DBConst.DOMAIN_CREW_POSITION);
		List<DomainInfoBean> barkings = dbDao.getDomainInfoListByDomainID(DBConst.DOMAIN_CREW_BARKING);

		resultMap.put(Const.BEAN, scheBean);
		resultMap.put(Const.LIST + "Cate", cates);
		resultMap.put(Const.LIST + "Position", positions);
		resultMap.put(Const.LIST + "Barking", barkings);

		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		if (versionInfoBean.getCompRevNum() != null) {
			resultMap.put("departureState", "C");
		} else if (versionInfoBean.getExecRevNum() == null || "B-0".equals(versionInfoBean.getExecRevNum())) {
			resultMap.put("departureState", "D");
		} else {
			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			int version = extractNumbers(versionInfoBean.getExecRevNum());

			if (version <= diff + 1) resultMap.put("departureState", "O");
			else resultMap.put("departureState", "A");
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> departureReportRegInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		SchedulerDetailInfoBean detailInfoBean = new SchedulerDetailInfoBean();
		detailInfoBean.setUid(scheBean.getUid());
		List<SchedulerDetailInfoBean> schedulerRowDataList = dao.getSchedulerRowDataList(detailInfoBean);

		int hullCnt = 0;
		int machineryCnt = 0;
		int electricCnt = 0;
		for (SchedulerDetailInfoBean r: schedulerRowDataList) if ("A".equals(r.getCategory())) hullCnt ++;
		for (SchedulerDetailInfoBean r: schedulerRowDataList) if ("B".equals(r.getCategory())) machineryCnt ++;
		for (SchedulerDetailInfoBean r: schedulerRowDataList) if ("C".equals(r.getCategory())) electricCnt ++;

		int totalSeaTrialCnt = schedulerRowDataList.size();

		resultMap.put("hullCnt", hullCnt);
		resultMap.put("machineryCnt", machineryCnt);
		resultMap.put("electricCnt", electricCnt);
		resultMap.put("totalSeaTrialCnt", totalSeaTrialCnt);

		resultMap.put(Const.BEAN, scheBean);
		if (schedulerRowDataList.size() != 0) {
			String startDateTime = dao.getSchedulerDetailStartTime(bean.getUid());
			String endDateTime = dao.getSchedulerDetailEndTime(bean.getUid());
			if (startDateTime != null && endDateTime != null) {
				resultMap.put("planText", "[PLAN] " + startDateTime + " ~ " + endDateTime);
				int dateDiff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
				resultMap.put("schedulerDaysText", dateDiff + "박 " + (dateDiff + 1) + "일");

				// 날짜 포매터 정의
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

				// 문자열을 LocalDateTime으로 변환
				LocalDateTime dateTime1 = LocalDateTime.parse(startDateTime, formatter);
				LocalDateTime dateTime2 = LocalDateTime.parse(endDateTime, formatter);

				// 두 날짜와 시간 사이의 차이 계산
				Duration duration = Duration.between(dateTime1, dateTime2);
				resultMap.put("schedulerHoursText", duration.toHours());
			}
		}

		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		List<SchedulerReportInfoBean> reportInfoBeanList = dao.getSchedulerReportInfo(versionInfoBean.getUid(), "B-0");

		for (SchedulerReportInfoBean info: reportInfoBeanList) {
			if (info.getReportKey().contains("Etc")) {
				info.setReportValue(info.getReportValue().replace("<br>", "\r\n"));
			}
			resultMap.put(info.getReportKey() + "uid", info.getUid());
			resultMap.put(info.getReportKey(), info.getReportValue());
		}

		if (versionInfoBean.getCompRevNum() != null) {
			resultMap.put("departureState", "C");
		} else if (versionInfoBean.getExecRevNum() == null || "B-0".equals(versionInfoBean.getExecRevNum())) {
			resultMap.put("departureState", "D");
		} else {
			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			int version = extractNumbers(versionInfoBean.getExecRevNum());

			if (version <= diff + 1) resultMap.put("departureState", "O");
			else resultMap.put("departureState", "A");
		}

		return resultMap;
	}

	@Override
	public boolean updateScheCrewDays(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		dao.updateScheCrewDays(bean);
		return DBConst.SUCCESS;
	}

	@Override
	public boolean updateSchedulerCrew(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		for(int i = 0; i < bean.getSchedulerCrewInfoList().size(); i++) {

			SchedulerCrewInfoBean infoBean = bean.getSchedulerCrewInfoList().get(i);
			if ("N".equals(infoBean.getFlag()) || "U".equals(infoBean.getFlag()) || "D".equals(infoBean.getFlag())) {
				infoBean.setUserUid(userUid);
				if ("N".equals(infoBean.getFlag())) dao.insertSchedulerCrewInfo(infoBean);
				else if (infoBean.getUid() != 0 && "U".equals(infoBean.getFlag())) dao.updateSchedulerCrewInfo(infoBean);
				else if (infoBean.getUid() != 0 && "D".equals(infoBean.getFlag())) dao.deleteSchedulerCrewInfo(infoBean.getUid());
				if (infoBean.getSchedulerCrewDetailList() != null) {
					dao.deleteSchedulerCrewDetailAll(infoBean.getUid());
					for (SchedulerCrewDetailBean detailBean: infoBean.getSchedulerCrewDetailList()) {
						detailBean.setSchedulerCrewInfoUid(infoBean.getUid());
						if ("N".equals(infoBean.getFlag()) && !"".equals(detailBean.getBarkingCode())) dao.insertSchedulerCrewDetail(detailBean);
						else if ("U".equals(infoBean.getFlag()) && !"".equals(detailBean.getBarkingCode())) dao.insertSchedulerCrewDetail(detailBean);
						else if ("D".equals(infoBean.getFlag())) dao.deleteSchedulerCrewDetailAll(infoBean.getUid());
					}
				}
			}
		}

		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> getSchedulerCrewInfoList(HttpServletRequest request, int schedulerInfoUid) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.LIST, dao.getSchedulerCrewInfoList(schedulerInfoUid));
		return resultMap;
	}

	/**
	 * 시운전 스케줄러 업데이트
	 * @param userUid
	 * @param uid
	 * @param stage
	 * @return
	 * @throws Exception
	 */
	public String updateScheRevNum(int userUid, int uid, String stage) throws Exception {

		SchedulerVersionInfoBean bean = dao.getSchedulerVersionInfo(uid);
		bean.setUserUid(userUid);

		if ("PLAN".equals(stage)) {
			String revNum = bean.getPlanRevNum();
			String newRevNum = newRevNum(revNum);
			if (newRevNum != null) {
				bean.setPlanRevNum(newRevNum);
				dao.updateSchedulerVersionInfoPlanRevNum(bean);
				return newRevNum;
			}
			return null;
		} else if ("EXEC".equals(stage)) {
			String revNum = bean.getExecRevNum();
			String newRevNum = newRevNum(revNum);
			if (newRevNum != null) {
				bean.setExecRevNum(newRevNum);
				dao.updateSchedulerVersionInfoExecRevNum(bean);
				return newRevNum;
			}
			return null;
		} else if ("COMP".equals(stage)) {
			String revNum = bean.getPlanRevNum();
			String newRevNum = newRevNum(revNum);
			if (newRevNum != null) {
				bean.setCompRevNum(newRevNum);
				dao.updateSchedulerVersionInfoCompRevNum(bean);
				return newRevNum;
			}
			return null;
		}
		return null;
	}
	private String newRevNum(String revNum) {
		String [] tmp = revNum.split("-");
		if (tmp.length == 2) {
			try {
				return tmp[0] + "-" + (Integer.parseInt(tmp[1]) + 1);
			} catch (Exception e) {
				return null;
			}
		} else {
			return null;
		}
	}

	@Override
	public boolean updateScheNewRevNum(HttpServletRequest request, SchedulerInfoBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		
		if(DBConst.Y.equals(dao.isOfflineMode(bean.getUid()))) {
			return DBConst.FAIL;
		}else {
			ParamBean paramBean = new ParamBean();
			paramBean.setUid(bean.getUid());
			SchedulerInfoBean schedulerInfoBean = dao.getScheduler(paramBean);

			/*
			* 이전 정보 그대로 새로 만듬
			* */
			schedulerInfoBean.setUserUid(userUid);
			dao.insertSchedulerNewVersion(schedulerInfoBean);
			SchedulerDetailInfoBean newDetail = new SchedulerDetailInfoBean();
			newDetail.setNewschedinfouid(schedulerInfoBean.getUid());
			newDetail.setSchedinfouid(bean.getUid());
			newDetail.setUserUid(userUid);
			dao.insertSchedulerDetailNewVersion(newDetail);

			// 업데이트 로직
			dao.updateScheduler(bean);
			String newRevNum = updateScheRevNum(userUid, schedulerInfoBean.getSchedulerVersionInfoUid(), "PLAN");
			bean.setRevnum(newRevNum);
			dao.updateSchdulerRevNum(bean);

			for (int i = 0; i < bean.getUidList().length; i++) {
				if(!"R".equalsIgnoreCase(bean.getFlagList()[i])) {
					SchedulerDetailInfoBean detBean = new SchedulerDetailInfoBean();

					detBean.setUid(bean.getUidList()[i]);
					detBean.setCategory(bean.getCateList()[i]);
					detBean.setTcnum(bean.getTcnumList()[i]);
					detBean.setDescription(bean.getDescList()[i]);
					detBean.setLoadrate(getNumOrNullData(bean.getLoadList()[i]));
					detBean.setSdate(bean.getSdateList()[i]);
					detBean.setStime(bean.getStimeList()[i]);
					detBean.setEdate(bean.getEdateList()[i]);
					detBean.setEtime(bean.getEtimeList()[i]);
					detBean.setSeq(getNumOrNullData(bean.getSeqList()[i]));
					detBean.setPer(getNumOrNullData(bean.getPerList()[i]));
					detBean.setFlag(bean.getFlagList()[i]);
					detBean.setCtype(bean.getCtypeList()[i]);
					detBean.setDtype(bean.getDtypeList()[i]);
					detBean.setReadytime(getNumOrNullData(bean.getReadyTmList()[i]));
					detBean.setCodedetuid(getNumOrNullData(bean.getCodedetuidList()[i]));
					detBean.setSametcnum(bean.getSametcnumList()[i]);
					detBean.setSchedinfouid(bean.getUid());
					detBean.setUserUid(bean.getUserUid());

					detBean.setPerformancesdate(bean.getPerformancesdateList()[i]);
					detBean.setPerformancestime(bean.getPerformancestimeList()[i]);
					detBean.setPerformanceedate(bean.getPerformanceedateList()[i]);
					detBean.setPerformanceetime(bean.getPerformanceetimeList()[i]);

					detBean.setCodedetdesc(bean.getCodedetdescList()[i]);
					detBean.setCodedettcnum(bean.getCodedettcnumList()[i]);

					if("C".equalsIgnoreCase(detBean.getFlag())){
						dao.insertSchedulerDetail(detBean);
					} else if(detBean.getUid() > 0 && "U".equalsIgnoreCase(detBean.getFlag())) {
						dao.updateSchedulerDetail(detBean);
					} else if(detBean.getUid() > 0 &&"D".equalsIgnoreCase(detBean.getFlag())) {
						dao.deleteSchedulerDetail(detBean.getUid());
					}
				}
			}

			return DBConst.SUCCESS;
		}
	}

	@Override
	public Map<String, Object> getSchedulerVersionList(SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		ParamBean paramBean = new ParamBean();
		paramBean.setUid(bean.getUid());
		SchedulerInfoBean schedulerInfoBean = dao.getScheduler(paramBean);

		bean.setStart(0);
		bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		bean.setSchedulerVersionInfoUid(schedulerInfoBean.getSchedulerVersionInfoUid());
		resultMap.put(Const.LIST, dao.getSchedulerVersionList(bean));
		resultMap.put(Const.LIST_CNT, dao.getSchedulerVersionListCnt());

		return resultMap;
	}

	@Override
	public Map<String, Object> departureReportScheduleChart(HttpServletRequest request, ParamBean bean) throws Exception {
		ParamBean userBean = new ParamBean();
		userBean.setUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());

		Map<String, Object> resultMap = new HashMap<String, Object>();
		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		resultMap.put(Const.BEAN, scheBean);
		resultMap.put(Const.LIST+"Ship", dao.getShipType());
		resultMap.put(Const.LIST+"ctype", dbDao.getDomainInfoListByDomainID("ctype"));
		resultMap.put(Const.LIST+"dtype", dbDao.getDomainInfoListByDomainID("dtype"));
		resultMap.put(Const.LIST+"schedtype", dbDao.getDomainInfoListByDomainID("schedtype"));

		resultMap.put(Const.SS_USERINFO, sysDao.getUser(userBean));

		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		if (versionInfoBean.getCompRevNum() != null) {
			resultMap.put("departureState", "C");
		} else if (versionInfoBean.getExecRevNum() == null || "B-0".equals(versionInfoBean.getExecRevNum())) {
			resultMap.put("departureState", "D");
		} else {
			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			int version = extractNumbers(versionInfoBean.getExecRevNum());

			if (version <= diff + 1) resultMap.put("departureState", "O");
			else resultMap.put("departureState", "A");
		}

		return resultMap;
	}

	@Override
	public boolean updateDepartureReport(HttpServletRequest request, ParamBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		SchedulerInfoBean schedulerInfoBean  = dao.getScheduler(bean);
		SchedulerVersionInfoBean versionInfoBean = new SchedulerVersionInfoBean();

		versionInfoBean.setUid(schedulerInfoBean.getSchedulerVersionInfoUid());
		versionInfoBean.setUserUid(userUid);
		versionInfoBean.setExecRevNum("B-0");
		dao.updateSchedulerVersionInfoExecRevNum(versionInfoBean);

		return DBConst.SUCCESS;
	}

	// ScheService.getScheList 으로 이동.
	@Override
	public Map<String, Object> getSchedulerDepartureList(SchedulerInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		} else{
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}

		resultMap.put(Const.LIST, dao.getSchedulerDepartureList(bean));
		resultMap.put(Const.LIST_CNT, dao.getSchedulerDepartureListCnt());

		return resultMap;
	}

	@Override
	public Map<String, Object> insertDepartureReportRegInfo(HttpServletRequest request, SchedulerReportInfoBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(bean.getSchedulerVersionInfoUid());
		for (SchedulerReportInfoBean info : bean.getReportInfoBeanList()) {
			if (info.getReportKey().contains("Etc")) {
				info.setReportValue(info.getReportValue().replace("\r\n", "<br>"));
			}

			if ("D".equals(info.getFlag()) && info.getUid() > 0)
				dao.deleteDepartureReportRegInfo(info.getUid());
			else if (!"D".equals(info.getFlag()) && 0 == info.getUid())
				dao.insertDepartureReportRegInfo(bean.getSchedulerVersionInfoUid(), info.getRowIdx(), versionInfoBean.getPlanRevNum(), versionInfoBean.getExecRevNum(), versionInfoBean.getCompRevNum(), info.getReportKey(), info.getReportValue(), info.getReportKeyType(), userUid);
			else if (!"D".equals(info.getFlag()) && info.getUid() > 0)
				dao.updateDepartureReportRegInfo(info.getUid(), info.getReportKey(), info.getReportValue(), info.getRowIdx(), userUid);
		}
		
		resultMap.put(Const.LIST, dao.getSchedulerReportInfo(versionInfoBean.getUid(), versionInfoBean.getExecRevNum()));

		return resultMap;
	}

	@Override
	public boolean submitDepartureReportInfo(HttpServletRequest request, ParamBean paramBean) throws Exception {

		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();

		SchedulerInfoBean scheBean = dao.getScheduler(paramBean);
		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		SchedulerVersionInfoBean newVersionInfoBean = new SchedulerVersionInfoBean();

		newVersionInfoBean.setUid(scheBean.getSchedulerVersionInfoUid());
		newVersionInfoBean.setUserUid(userUid);

		int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate()); // 일수 차이 계산
		int version = extractNumbers(versionInfoBean.getExecRevNum()); // 다음 버전으로 변경

		// 다음 버전이 일일 보고 가능하다면
		if (version <= diff + 1) {
			if (version == diff + 1) {
				if (versionInfoBean.getCompRevNum() == null) newVersionInfoBean.setCompRevNum("C-0");
				else newVersionInfoBean.setCompRevNum("C-1");
				dao.updateSchedulerVersionInfoCompRevNum(newVersionInfoBean);
			} else {
				newVersionInfoBean.setExecRevNum("B-" + (version + 1));
				dao.updateSchedulerVersionInfoExecRevNum(newVersionInfoBean);
			}

			return DBConst.SUCCESS;
		} else {
			return DBConst.FAIL;
		}
	}

	/**
	 * 입력된 두 날짜 사이의 차이값 검사
	 * @param date1
	 * @param date2
	 * @return
	 */
	public int calculateDateDifference(String date1, String date2) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate localDate1 = LocalDate.parse(date1, formatter);
		LocalDate localDate2 = LocalDate.parse(date2, formatter);

		return localDate1.until(localDate2).getDays();
	}

	/**
	 * 입력된 버전의 숫자값 추출
	 * @param input
	 * @return
	 */
	public int extractNumbers(String input) {
		String numberPart = input.replaceAll("\\D+", "");

		if (!numberPart.isEmpty()) {
			return Integer.parseInt(numberPart);
		} else {
			return 0;
		}
	}

	/**
	 * 시운전 계획 - 일일보고 정보 등록 화면
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@Override
	public Map<String, Object> departureReportRegDailyInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		resultMap.put(Const.BEAN, scheBean);

		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		List<SchedulerReportInfoBean> reportInfoBeanList = dao.getSchedulerReportInfo(versionInfoBean.getUid(), versionInfoBean.getExecRevNum());

		if (reportInfoBeanList.size() != 0) {
			for (SchedulerReportInfoBean info: reportInfoBeanList) {
				if (info.getReportKey().contains("Etc")) {
					info.setReportValue(info.getReportValue().replace("<br>", "\r\n"));
				}
				resultMap.put(info.getReportKey() + "uid", info.getUid());
				resultMap.put(info.getReportKey(), info.getReportValue());
			}
		}

//		else { // 이전 버전 정보의 호출
//			int versionNum = extractNumbers(versionInfoBean.getExecRevNum());
//			if (versionNum != 0) {
//				List<SchedulerReportInfoBean> beforeInfoBeanList = dao.getSchedulerReportInfo(versionInfoBean.getUid(), "B-"+ (versionNum-1));
//				for (SchedulerReportInfoBean info: beforeInfoBeanList) {
//					if (info.getReportKey().contains("Etc")) {
//						info.setReportValue(info.getReportValue().replace("<br>", "\r\n"));
//					}
//					resultMap.put(info.getReportKey(), info.getReportValue());
//				}
//			}
//		}

		if (versionInfoBean.getCompRevNum() != null) {
			resultMap.put("departureState", "C");
		} else if (versionInfoBean.getExecRevNum() == null || "B-0".equals(versionInfoBean.getExecRevNum())) {
			resultMap.put("departureState", "D");
		} else {
			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			int version = extractNumbers(versionInfoBean.getExecRevNum());

			SchedulerDetailInfoBean detailInfoBean = new SchedulerDetailInfoBean();
			detailInfoBean.setUid(scheBean.getUid());
			List<SchedulerDetailInfoBean> schedulerRowDataList = dao.getSchedulerRowDataList(detailInfoBean);

			/*
			 * 추후 화면에 셋팅 하는 값은 하나의 bean 을 만들어서 설정하게 변경
			 * */
			detailInfoBean.setSdate(addDaysAndGetFormattedDate(scheBean.getSdate(), version -1));
			detailInfoBean.setEdate(null);
			List<SchedulerDetailInfoBean> schedulerCompRowDataList = dao.getSchedulerCompRowDataList(detailInfoBean);

			int hullCnt = 0;
			int hullCompCnt = 0;
			int machineryCnt = 0;
			int machCompCnt = 0;
			int electricCnt = 0;
			int elecCompCnt = 0;

			String sdate = null;
			String stime = null;
			String edate = null;
			String etime = null;
			String performancesdate = null;
			String performancestime = null;
			String performanceedate = null;
			String performanceetime = null;

			for (int i = 0; i < schedulerCompRowDataList.size(); i ++) {
				SchedulerDetailInfoBean r = schedulerRowDataList.get(i);
				if ("A".equals(r.getCategory())) hullCompCnt++;
				else if ("B".equals(r.getCategory())) machCompCnt++;
				else if ("C".equals(r.getCategory())) elecCompCnt++;

				if (r.getPerformancesdate() != null && r.getPerformancestime() != null && performancesdate == null) {
					performancesdate = r.getPerformancesdate();
					performancestime = r.getPerformancestime();
				}

				if (r.getPerformanceedate() != null && r.getPerformanceetime() != null && !"0000-00-00".equals(r.getPerformanceedate())) {
					performanceedate = r.getPerformanceedate();
					performanceetime = r.getPerformanceetime();
				}
			}

			for (int i = 0; i < schedulerRowDataList.size(); i ++) {
				SchedulerDetailInfoBean r = schedulerRowDataList.get(i);
				if ("A".equals(r.getCategory())) hullCnt++;
				else if ("B".equals(r.getCategory())) machineryCnt++;
				else if ("C".equals(r.getCategory())) electricCnt++;

				if (r.getSdate() != null && r.getStime() != null && sdate == null) {
					sdate = r.getSdate();
					stime = r.getStime();
				}

				if (r.getEdate() != null && r.getEtime() != null && !"0000-00-00".equals(r.getEdate())) {
					edate = r.getEdate();
					etime = r.getEtime();
				}
			}

			String commanderName = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "commanderName");
			String commanderTel = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "commanderTel");

			resultMap.put("commanderName", commanderName);
			resultMap.put("commanderTel", commanderTel);

			resultMap.put("hullCnt", hullCnt);
			resultMap.put("machineryCnt", machineryCnt);
			resultMap.put("electricCnt", electricCnt);
			resultMap.put("hullCompCnt", hullCompCnt);
			resultMap.put("machCompCnt", machCompCnt);
			resultMap.put("elecCompCnt", elecCompCnt);
			resultMap.put("sdate", sdate);
			resultMap.put("stime", stime);
			resultMap.put("edate", edate);
			resultMap.put("etime", etime);
			resultMap.put("performancesdate", performancesdate);
			resultMap.put("performancestime", performancestime);
			resultMap.put("performanceedate", performanceedate);
			resultMap.put("performanceetime", performanceetime);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
			// 두 날짜와 시간 사이의 차이 계산
			LocalDateTime dateTime1 = LocalDateTime.parse(sdate + " " + stime, formatter);
			LocalDateTime dateTime2 = LocalDateTime.parse(edate + " " + etime, formatter);
			Duration planTime = Duration.between(dateTime1, dateTime2);
			resultMap.put("planHour", planTime.getSeconds() / 60);

			if (performancesdate != null && performancestime != null && performanceedate != null && performanceetime != null) {
				LocalDateTime dateTime3 = LocalDateTime.parse(performancesdate + " " + performancestime, formatter);
				LocalDateTime dateTime4 = LocalDateTime.parse(performanceedate + " " + performanceetime, formatter);
				Duration execTime = Duration.between(dateTime3, dateTime4);
				resultMap.put("execHour", execTime.getSeconds() / 60);
			} else {
				resultMap.put("execHour", 0);
			}

			if (version <= diff + 1) {
				resultMap.put("version", version);
				resultMap.put("maxVersion", diff + 1);
				resultMap.put("departureState", "O");
			} else resultMap.put("departureState", "A");
		}

		return resultMap;
	}

	/**
	 * 시운전 계획 - 완료보고 정보 등록 화면
	 * @param request
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	@Override
	public Map<String, Object> departureReportRegCompleteInfo(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();

		SchedulerInfoBean scheBean = dao.getScheduler(bean);
		resultMap.put(Const.BEAN, scheBean);

		SchedulerVersionInfoBean versionInfoBean = dao.getSchedulerVersionInfo(scheBean.getSchedulerVersionInfoUid());

		List<SchedulerReportInfoBean> reportInfoBeanList = dao.getSchedulerCompReportInfo(versionInfoBean.getUid(), versionInfoBean.getCompRevNum());

		for (SchedulerReportInfoBean info: reportInfoBeanList) {
			if (info.getReportKey().contains("Etc")) {
				info.setReportValue(info.getReportValue().replace("<br>", "\r\n"));
			}
			resultMap.put(info.getReportKey() + "uid", info.getUid());
			resultMap.put(info.getReportKey(), info.getReportValue());
		}

		List<SchedulerReportInfoBean> majorIssueBeanList = dao.getSchedulerCompReportList(versionInfoBean.getUid(), versionInfoBean.getCompRevNum(), "majorIssueList");
		int cnt = dao.getSchedulerCompReportListCnt(versionInfoBean.getUid(), versionInfoBean.getCompRevNum(), "majorIssueList");

		List<HashMap<String, Object>> majorIssueList = new ArrayList<>();
		for (int i = 0; i < cnt; i ++) {
			majorIssueList.add(new HashMap<String, Object>());
		}

		for (SchedulerReportInfoBean info: majorIssueBeanList) {
			HashMap<String, Object> dataMap = majorIssueList.get(info.getRowIdx());
			dataMap.put(info.getReportKey() + "uid", info.getUid());
			dataMap.put(info.getReportKey(), info.getReportValue());
			dataMap.put(info.getReportKeyType(), info.getReportKeyType());
		}

		resultMap.put(Const.LIST + "majorissue", majorIssueList);

		if (versionInfoBean.getCompRevNum() != null) {

			SchedulerDetailInfoBean detailInfoBean = new SchedulerDetailInfoBean();
			detailInfoBean.setUid(scheBean.getUid());
			List<SchedulerDetailInfoBean> schedulerRowDataList = dao.getSchedulerRowDataList(detailInfoBean);

			/*
			 * 추후 화면에 셋팅 하는 값은 하나의 bean 을 만들어서 설정하게 변경
			 * */
			detailInfoBean.setSdate(scheBean.getSdate());
			detailInfoBean.setEdate(scheBean.getEdate());
			List<SchedulerDetailInfoBean> schedulerCompRowDataList = dao.getSchedulerCompRowDataList(detailInfoBean);

			int hullCnt = 0;
			int hullCompCnt = 0;
			int machineryCnt = 0;
			int machCompCnt = 0;
			int electricCnt = 0;
			int elecCompCnt = 0;

			String sdate = null;
			String stime = null;
			String edate = null;
			String etime = null;
			String performancesdate = null;
			String performancestime = null;
			String performanceedate = null;
			String performanceetime = null;

			for (int i = 0; i < schedulerCompRowDataList.size(); i ++) {
				SchedulerDetailInfoBean r = schedulerRowDataList.get(i);
				if ("A".equals(r.getCategory())) hullCompCnt++;
				else if ("B".equals(r.getCategory())) machCompCnt++;
				else if ("C".equals(r.getCategory())) elecCompCnt++;

				if (r.getPerformancesdate() != null && r.getPerformancestime() != null && performancesdate == null) {
					performancesdate = r.getPerformancesdate();
					performancestime = r.getPerformancestime();
				}

				if (r.getPerformanceedate() != null && r.getPerformanceetime() != null && !"0000-00-00".equals(r.getPerformanceedate())) {
					performanceedate = r.getPerformanceedate();
					performanceetime = r.getPerformanceetime();
				}
			}

			for (int i = 0; i < schedulerRowDataList.size(); i ++) {
				SchedulerDetailInfoBean r = schedulerRowDataList.get(i);
				if ("A".equals(r.getCategory())) hullCnt++;
				else if ("B".equals(r.getCategory())) machineryCnt++;
				else if ("C".equals(r.getCategory())) electricCnt++;

				if (r.getSdate() != null && r.getStime() != null && sdate == null) {
					sdate = r.getSdate();
					stime = r.getStime();
				}

				if (r.getEdate() != null && r.getEtime() != null && !"0000-00-00".equals(r.getEdate())) {
					edate = r.getEdate();
					etime = r.getEtime();
				}
			}

			String commanderName = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "commanderName");
			String commanderTel = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "commanderTel");

			String subCommanderName = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "subCommanderName");
			String subCommanderTel = dao.getSchedulerReportInfoKey(versionInfoBean.getUid(), "B-0", "subCommanderTel");

			resultMap.put("commanderName", commanderName);
			resultMap.put("commanderTel", commanderTel);
			resultMap.put("subCommanderName", subCommanderName);
			resultMap.put("subCommanderTel", subCommanderTel);

			resultMap.put("hullCnt", hullCnt);
			resultMap.put("machineryCnt", machineryCnt);
			resultMap.put("electricCnt", electricCnt);
			resultMap.put("hullCompCnt", hullCompCnt);
			resultMap.put("machCompCnt", machCompCnt);
			resultMap.put("elecCompCnt", elecCompCnt);
			resultMap.put("sdate", sdate);
			resultMap.put("stime", stime);
			resultMap.put("edate", edate);
			resultMap.put("etime", etime);
			resultMap.put("performancesdate", performancesdate);
			resultMap.put("performancestime", performancestime);
			resultMap.put("performanceedate", performanceedate);
			resultMap.put("performanceetime", performanceetime);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
			// 두 날짜와 시간 사이의 차이 계산
			LocalDateTime dateTime1 = LocalDateTime.parse(sdate + " " + stime, formatter);
			LocalDateTime dateTime2 = LocalDateTime.parse(edate + " " + etime, formatter);
			Duration planTime = Duration.between(dateTime1, dateTime2);
			resultMap.put("planHour", planTime.getSeconds() / 3600);

			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			resultMap.put("planDays", diff + "박 " + (diff + 1) + "일");

			if (performancesdate != null && performancestime != null && performanceedate != null && performanceetime != null) {
				LocalDateTime dateTime3 = LocalDateTime.parse(performancesdate + " " + performancestime, formatter);
				LocalDateTime dateTime4 = LocalDateTime.parse(performanceedate + " " + performanceetime, formatter);
				Duration execTime = Duration.between(dateTime3, dateTime4);
				resultMap.put("execHour", execTime.getSeconds() / 3600);

				int execDiff = calculateDateDifference(performancesdate, performanceedate);
				if (execDiff != 0) resultMap.put("execDays", execDiff + "박 " + (execDiff + 1) + "일");
				else resultMap.put("execDays", "1일");
			} else {
				resultMap.put("execHour", 0);
			}

			resultMap.put("departureState", "C");
		} else if (versionInfoBean.getExecRevNum() == null || "B-0".equals(versionInfoBean.getExecRevNum())) {
			resultMap.put("departureState", "D");
		} else {
			int diff = calculateDateDifference(scheBean.getSdate(), scheBean.getEdate());
			int version = extractNumbers(versionInfoBean.getExecRevNum());

			if (version <= diff + 1) {
				resultMap.put("version", version);
				resultMap.put("maxVersion", diff + 1);
				resultMap.put("departureState", "O");
			} else resultMap.put("departureState", "A");
		}

		return resultMap;
	}

	public String addDaysAndGetFormattedDate(String inputDate, int daysToAdd) {
		DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse(inputDate, inputFormatter);

		LocalDate resultDate = date.plusDays(daysToAdd);

		DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		return resultDate.format(outputFormatter);
	}
	
	@Override
	public List<ScheduleCodeInfoBean> getScheduleCodeInfoListForNewSche(ScheduleCodeDetailBean bean) throws Exception {
		return dao.getScheduleCodeInfoListForNewSche(bean);
	}
	
	@Override
	public List<ScheduleCodeDetailBean> getScheduleCodeDetailListForNewSche(ParamBean bean) throws Exception {
		return dao.getScheduleCodeDetailListForNewSche(bean.getUid());
	}
	
	// 선종별 코드 멀티 등록 팝업 TC 조회 - 250205. 
	@Override
	public List<ScheduleHierarchyBean> getScheCodeDetTcSearchListForMulti(ScheduleHierarchyBean bean) throws Exception {
		List<ScheduleHierarchyBean> allHierarchy = dao.getScheduleHierarchyList(new ScheduleHierarchyBean());
		List<ScheduleHierarchyBean> searchList = dao.getScheCodeDetTcSearchListForMulti(bean);
		
		for(int i = 0; i < searchList.size(); i++) {
			ScheduleHierarchyBean curHier = searchList.get(i);
			int codeLv = curHier.getCodelevel();
			
			if(codeLv == 2) {
				curHier.setLv2code(curHier.getCode());
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
				
			}else if(codeLv == 3) {
				String lv1Uid = null;
				curHier.setLv3code(curHier.getCode());
				
				// Lv2Code 입력
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv2code(allHierarchy.get(j).getCode());
						lv1Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv1Uid != null && Integer.parseInt(lv1Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
			}else if(codeLv == 4){
				String lv1Uid = null;
				String lv2Uid = null;
				curHier.setLv4code(curHier.getCode());
				
				// Lv3Code 입력
				for(int j = 0; j < allHierarchy.size(); j++) {
					int pUid = allHierarchy.get(j).getUid();
					
					if(pUid > 0 && pUid == Integer.parseInt(curHier.getParentuid())) {
						curHier.setLv3code(allHierarchy.get(j).getCode());
						lv2Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv2Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv2Uid != null && Integer.parseInt(lv2Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv2code(allHierarchy.get(j).getCode());
						lv1Uid = allHierarchy.get(j).getParentuid();
						break;
					}
				}
				
				// Lv1Code 입력 
				for(int j = 0; j < allHierarchy.size(); j++) {
					if(lv1Uid != null && Integer.parseInt(lv1Uid) == allHierarchy.get(j).getUid()) {
						curHier.setLv1code(allHierarchy.get(j).getCode());
						break;
					}
				}
			}
		}
		
		return searchList;
	}
}
