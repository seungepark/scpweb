package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;

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

public interface DbDaoI {
	
	List<DomainBean> getDomainList(DomainBean bean) throws Exception;
	
	List<DomainInfoBean> getDomainInfoList(int uid) throws Exception;
	
	int insertDomain(DomainBean bean) throws Exception;
	
	int insertDomainInfo(DomainInfoBean bean) throws Exception;
	
	int updateDomain(DomainBean bean) throws Exception;
	
	int updateDomainInfo(DomainInfoBean bean) throws Exception;
	
	List<ShipInfoBean> getVesselList(ShipInfoBean bean) throws Exception;
	
	int deleteVessel(int uid) throws Exception;
	
	int checkExistVessel(ShipInfoBean bean) throws Exception;
	
	int checkScheduleVessel(int uid) throws Exception;
	
	int insertVessel(ShipInfoBean bean) throws Exception;
	
	ShipInfoBean getVessel(ParamBean bean) throws Exception;
	
	int updateVessel(ShipInfoBean bean) throws Exception;
	
	DomainBean getDomain(int uid) throws Exception;
	
	int deleteDomainInfo(int uid) throws Exception;
	
	int deleteDomainInfoByDomainUid(int uid) throws Exception;
	
	int deleteDomain(int uid) throws Exception;
	
	int resetDefaultVessel(ParamBean bean) throws Exception;
	
	int setDefaultVessel(ParamBean bean) throws Exception;
	
	/**
	 * Domain ID 문자값으로 도메인 조회
	 * @param domain
	 * @return
	 * @throws Exception
	 */
	List<DomainInfoBean> getDomainInfoListByDomainID(String domain) throws Exception;
	
	/**
	 * 스케줄 팝업에서 선박 목록 조회
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	List<ShipInfoBean> getVesselListForPop(ShipInfoBean bean) throws Exception;
	
	/**
	 * 선박 목록 조회 갯수 
	 * @return
	 * @throws Exception
	 */
	int getVesselListForPopCnt() throws Exception;
	
	List<ShipInfoBean> getVesselPageList(ShipInfoBean bean) throws Exception;
	
	int getVesselPageListCnt() throws Exception;
	
	int updateVesselDetail(ShipInfoBean bean) throws Exception;
}
