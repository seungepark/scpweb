package com.ssshi.ddms.mybatis.dao;

import java.util.List;

import com.ssshi.ddms.dto.ApprLineBean;
import com.ssshi.ddms.dto.AuditLogBean;
import com.ssshi.ddms.dto.AuthGroupBean;
import com.ssshi.ddms.dto.AuthInfoBean;
import com.ssshi.ddms.dto.AuthListBean;
import com.ssshi.ddms.dto.AuthUserBean;
import com.ssshi.ddms.dto.CodeInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;

/********************************************************************************
 * 프로그램 개요 : System
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
 * 
 * 최종 수정자 : 김한준
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

public interface SystemDaoI {
	
	List<AuthGroupBean> getGroupList(ParamBean bean) throws Exception;
	
	int getGroupListCnt() throws Exception;
	
	List<UserInfoBean> getUserList(ParamBean bean) throws Exception;
	
	int getUserListCnt() throws Exception;
	
	List<AuthInfoBean> getAuthList() throws Exception;
	
	int insertGroup(AuthGroupBean bean) throws Exception;
	
	int getCaptainUid() throws Exception;
	
	int insertLine(ApprLineBean bean) throws Exception;
	
	int insertAuthList(AuthListBean bean) throws Exception;
	
	int insertAuthUser(AuthUserBean bean) throws Exception;
	
	AuthGroupBean getGroup(ParamBean bean) throws Exception;
	
	Integer getApprLineToUidForWorker(int uid) throws Exception;
	
	List<AuthListBean> getAuthListList(ParamBean bean) throws Exception;
	
	List<UserInfoBean> getAuthUserList(ParamBean bean) throws Exception;
	
	int updateGroup(AuthGroupBean bean) throws Exception;
	
	int updateLineTo(AuthGroupBean bean) throws Exception;
	
	int deleteAuthList(int uid) throws Exception;
	
	int deleteAuthUser(int uid) throws Exception;
	
	int deleteLine(int uid) throws Exception;
	
	int changeStatusGroupForList(ParamBean bean) throws Exception;
	
	int changeStatusGroup(ParamBean bean) throws Exception;
	
	int deleteGroup(int uid) throws Exception;
	
	List<ApprLineBean> getLineGroupLeaderList() throws Exception;
	
	List<ApprLineBean> getLineWorkerList(int uid) throws Exception;
	
	int deleteLineWorker() throws Exception;
	
	int insertLineWorker(ApprLineBean bean) throws Exception;
	
	int changeStatusUserForList(ParamBean bean) throws Exception;
	
	int deleteUser(ParamBean bean) throws Exception;
	
	int deleteAuthUserForUser(int userUid) throws Exception;
	
	UserInfoBean getUser(ParamBean bean) throws Exception;
	
	List<CodeInfoBean> getPosCode() throws Exception;
	
	int isExistUserId(String userId) throws Exception;
	
	int insertUser(UserInfoBean bean) throws Exception;
	
	int updateUser(UserInfoBean bean) throws Exception;
	
	List<CodeInfoBean> getCodeGroupList() throws Exception;
	
	List<CodeInfoBean> getCodeInfoList(String code) throws Exception;
	
	List<UserInfoBean> getUserListForGroup(ParamBean bean) throws Exception;
	
	int getUserListForGroupCnt() throws Exception;
	
	List<AuditLogBean> getAuditList(ParamBean bean) throws Exception;
	
	int getAuditListCnt() throws Exception;
	
	List<AuthGroupBean> getGroupListForUser() throws Exception;
	
	List<AuthGroupBean> getGroupListAllowUser(int uid) throws Exception;
	
	List<ShipInfoBean> getShipInfoList() throws Exception;
}
