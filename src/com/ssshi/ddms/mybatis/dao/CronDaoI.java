package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.CronInfoBean;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;

/********************************************************************************
 * 프로그램 개요 : Cron
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-07-11
 * 
 * 최종 수정자 : KHJ
 * 최종 수정일 : 2024-11-18
 * 
 * 메모 : 없음
 * 
 * Copyright 2024 by SiriusB. Confidential and proprietary information
 * This document contains information, which is the property of SiriusB, 
 * and is furnished for the sole purpose of the operation and the maintenance.  
 * Copyright © 2024 SiriusB.  All rights reserved.
 *
 ********************************************************************************/

public interface CronDaoI {
	
	int existShipInfo(String shipNum) throws Exception;
	
	int updateShipInfo(ShipInfoBean bean) throws Exception;
	
	int insertShipInfo(ShipInfoBean bean) throws Exception;
	
	List<String> getFileInfoFileList() throws Exception;
	
	List<CronInfoBean> getCronList(CronInfoBean bean) throws Exception;
	
	int getCronListCnt() throws Exception;
	
	CronInfoBean getCron(ParamBean bean) throws Exception;
	
	int updateCron(CronInfoBean bean) throws Exception;
	
	int checkExistCron(CronInfoBean bean) throws Exception;
	
	int changeStatusCron(ParamBean bean) throws Exception;
	
	int deleteCron(int uid) throws Exception;
	
	int insertCron(CronInfoBean bean) throws Exception;
	
	int increaseCronRunCntAndDate(String cronId) throws Exception;
	
	List<DomainInfoBean> getDomainInfoList(String domain) throws Exception;
	
	String getVesselInfoData(String column) throws Exception;
}
