package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.PjtEvntBean;
import com.ssshi.ddms.dto.PjtEvntColumnBean;
import com.ssshi.ddms.dto.ScenarioBean;
import com.ssshi.ddms.dto.ScenarioDetailBean;
import com.ssshi.ddms.dto.ShipBbsBean;
import com.ssshi.ddms.dto.ShipBbsFileInfoBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.WorkStdBean;

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

public interface SchedDaoI {

	List<DomainInfoBean> getShipTypeList() throws Exception;
	
	List<DomainInfoBean> getCrewKindList() throws Exception;
	
	String getLastIfDate() throws Exception;
	
	PjtEvntColumnBean getEventColumnInfo(int userUid) throws Exception;
	
	List<PjtEvntBean> getEventList(ParamBean bean) throws Exception;
	
	int deletePjtEvntColumn(int userInfoUid) throws Exception;
	
	int insertPjtEvntColumn(PjtEvntColumnBean bean) throws Exception;
	
	int insertPjtEvntLog(PjtEvntBean bean) throws Exception;
	
	int updatePjtEvnt(PjtEvntBean bean) throws Exception;
	
	int isExistShipNum(String shipNum) throws Exception;
	
	int insertShipInfo(ShipInfoBean bean) throws Exception;
	
	int insertPjtEvnt(PjtEvntBean bean) throws Exception;
	
	List<ShipBbsBean> getShipBbsList(String pjt) throws Exception;
	
	List<ShipBbsFileInfoBean> getShipBbsFileList(int shipBbsUid) throws Exception;
	
	int insertShipBbs(ShipBbsBean bean) throws Exception;
	
	int insertShipBbsFileInfo(ShipBbsFileInfoBean bean) throws Exception;
	
	int deleteShipBbsFileAll(int shipBbsUid) throws Exception;
	
	int deleteShipBbs(int uid) throws Exception;
	
	ShipBbsFileInfoBean getShipBbsFile(int uid) throws Exception;
	
	List<DomainInfoBean> getStatusList() throws Exception;
	
	List<ScenarioBean> getScenarioList(ScenarioBean bean) throws Exception;
	
	int getScenarioListCnt() throws Exception;
	
	int updateScenarioStatus(ParamBean bean) throws Exception;
	
	int deleteScenario(int uid) throws Exception;
	
	int deleteScenarioDetailList(int uid) throws Exception;
	
	List<DomainInfoBean> getProjEventList() throws Exception;
	
	List<DomainInfoBean> getCurrencyList() throws Exception;
	
	List<DomainInfoBean> getColorList() throws Exception;
	
	List<DomainInfoBean> getScenarioOptionList() throws Exception;
	
	List<WorkStdBean> getWorkStdSearchList(ParamBean bean) throws Exception;
	
	int isExistScenario(String title) throws Exception;
	
	int insertScenario(ScenarioBean bean) throws Exception;
	
	int insertScenarioDetail(ScenarioDetailBean bean) throws Exception;
	
	ScenarioBean getScenario(int uid) throws Exception;
	
	List<ScenarioDetailBean> getScenarioDetail(int uid) throws Exception;
	
	int updateScenario(ScenarioBean bean) throws Exception;
	
	List<WorkStdBean> getWorkStdLv1List() throws Exception;
	
	List<WorkStdBean> getWorkStdLv2List(int parentUid) throws Exception;
	
	int updateWorkStd(WorkStdBean bean) throws Exception;
	
	int insertWorkStd(WorkStdBean bean) throws Exception;
	
	int deleteWorkStd(int uid) throws Exception;
}
