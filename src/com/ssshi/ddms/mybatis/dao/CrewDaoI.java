package com.ssshi.ddms.mybatis.dao;

import java.util.List;
import java.util.Map;

import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.PjtEvntBean;
import com.ssshi.ddms.dto.PjtEvntColumnBean;
import com.ssshi.ddms.dto.ScenarioBean;
import com.ssshi.ddms.dto.ScenarioDetailBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.dto.ShipBbsBean;
import com.ssshi.ddms.dto.ShipBbsFileInfoBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.WorkStdBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewDetailBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;

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

public interface CrewDaoI {

	// 호선 목록.
	List<DomainInfoBean> getShipList() throws Exception;
	
	// 승선자 신청 목록.
	List<RegistrationCrewBean> getRegistrationCrewList(RegistrationCrewBean bean) throws Exception;
	
	// 승선자별 승하선 정보.
	List<ScheCrewInOutBean> getCrewInOutList(ParamBean bean) throws Exception;
	
	// 승선자 신청 목록 개수.
	int getRegistrationCrewListCnt() throws Exception;
	
	// 승선자 저장.
	int insertRegistrationCrew(RegistrationCrewBean bean) throws Exception;
	
	// 승선자 상세정보 저장.
	int insertCrewDetail(RegistrationCrewDetailBean bean) throws Exception;
	
	// 기존 승선자 목록 삭제.
	int deleteCrewList(int crewUid) throws Exception;
	
	// 기존 승선자 디테일 정보 삭제.
	int deleteCrewDetailList(int crewUid) throws Exception;
	
	// 기존 승선자 승하선 정보 삭제.
	int deleteCrewInoutList(int crewUid) throws Exception;
	
	// 승선자 발주
	int updateCrewOrder(Map<String, Object> map) throws Exception;
}
