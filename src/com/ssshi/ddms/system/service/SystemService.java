package com.ssshi.ddms.system.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.ApprLineBean;
import com.ssshi.ddms.dto.AuditLogBean;
import com.ssshi.ddms.dto.AuthGroupBean;
import com.ssshi.ddms.dto.AuthInfoBean;
import com.ssshi.ddms.dto.AuthListBean;
import com.ssshi.ddms.dto.AuthUserBean;
import com.ssshi.ddms.dto.CodeInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.mybatis.dao.LogDaoI;
import com.ssshi.ddms.mybatis.dao.SystemDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.LogUtil;
import com.ssshi.ddms.util.ValidUtil;

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

@Service
public class SystemService implements SystemServiceI {

	@Autowired
	private SystemDaoI dao;
	
	@Autowired
	private LogDaoI logDao;

	@Override
	public Map<String, Object> getGroupList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getGroupList(bean));
		resultMap.put(Const.LIST_CNT, dao.getGroupListCnt());
		
		return resultMap;
	}

	@Override
	public Map<String, Object> getUserList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		resultMap.put(Const.LIST, dao.getUserList(bean));
		resultMap.put(Const.LIST_CNT, dao.getUserListCnt());
		
		return resultMap;
	}

	@Override
	public List<AuthInfoBean> getAuthList() throws Exception {
		return dao.getAuthList();
	}
	
	@Override
	public List<ApprLineBean> getLineGroupLeaderList() throws Exception {
		return dao.getLineGroupLeaderList();
	}

	@Override
	public boolean insertGroup(HttpServletRequest request, AuthGroupBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		dao.insertGroup(bean);
		
		if(bean.getUid() > 0 && DBConst.AUTH_KIND_GROUP.equals(bean.getKind())) {
			ApprLineBean lineBean = new ApprLineBean();
			lineBean.setFromAuthGroupUid(bean.getUid());
			lineBean.setToAuthGroupUid(dao.getCaptainUid());
			lineBean.setApprAuth(DBConst.AUTH_KIND_CAPTAIN);
			lineBean.setUserUid(bean.getUserUid());
			dao.insertLine(lineBean);
		}
		
		if(bean.getUid() > 0 && DBConst.AUTH_KIND_WORKER.equals(bean.getKind())) {
			ApprLineBean lineBean = new ApprLineBean();
			lineBean.setFromAuthGroupUid(bean.getUid());
			lineBean.setToAuthGroupUid(bean.getToUid());
			lineBean.setApprAuth(DBConst.AUTH_KIND_GROUP);
			lineBean.setUserUid(bean.getUserUid());
			dao.insertLine(lineBean);
		}
		
		if(bean.getUid() > 0 && bean.getAuthInfoUidList() != null) {
			for(int i = 0; i < bean.getAuthInfoUidList().length; i++) {
				AuthListBean authBean = new AuthListBean();
				authBean.setAuthGroupUid(bean.getUid());
				authBean.setAuthInfoUid(bean.getAuthInfoUidList()[i]);
				authBean.setUserUid(bean.getUserUid());
				dao.insertAuthList(authBean);
			}
		}
		
		if(bean.getUid() > 0 && bean.getUserUidList()!= null) {
			for(int i = 0; i < bean.getUserUidList().length; i++) {
				AuthUserBean userBean = new AuthUserBean();
				userBean.setAuthGroupUid(bean.getUid());
				userBean.setUserInfoUid(bean.getUserUidList()[i]);
				userBean.setUserUid(bean.getUserUid());
				dao.insertAuthUser(userBean);
			}
		}
		
		if(bean.getUid() > 0) {
			logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.AUTHGROUP, bean.getUserUid(),
					"New Authority Group - " + bean.getGroupName() + " [" + bean.getKind() + "] : " + bean.getDescription(), ""));
		}
		
		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> detailGroup(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Integer toUid = dao.getApprLineToUidForWorker(bean.getUid());
		
		resultMap.put(Const.BEAN, dao.getGroup(bean));
		resultMap.put("toUid", toUid == null ? 0 : toUid);
		resultMap.put(Const.LIST, dao.getAuthListList(bean));
		resultMap.put(Const.LIST + "User", dao.getAuthUserList(bean));
		resultMap.put(Const.RESULT, DBConst.SUCCESS);
		
		return resultMap;
	}

	@Override
	public String updateGroup(HttpServletRequest request, AuthGroupBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		dao.updateGroup(bean);
		dao.deleteAuthList(bean.getUid());
		dao.deleteAuthUser(bean.getUid());
		
		if(bean.getUid() > 0 && DBConst.AUTH_KIND_WORKER.equals(bean.getKind())) {
			dao.updateLineTo(bean);
		}
		
		if(bean.getAuthInfoUidList() != null) {
			for(int i = 0; i < bean.getAuthInfoUidList().length; i++) {
				AuthListBean authBean = new AuthListBean();
				authBean.setAuthGroupUid(bean.getUid());
				authBean.setAuthInfoUid(bean.getAuthInfoUidList()[i]);
				authBean.setUserUid(bean.getUserUid());
				dao.insertAuthList(authBean);
			}
		}
		
		if(bean.getUserUidList()!= null) {
			for(int i = 0; i < bean.getUserUidList().length; i++) {
				AuthUserBean userBean = new AuthUserBean();
				userBean.setAuthGroupUid(bean.getUid());
				userBean.setUserInfoUid(bean.getUserUidList()[i]);
				userBean.setUserUid(bean.getUserUid());
				dao.insertAuthUser(userBean);
			}
		}
		
		logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.AUTHGROUP, bean.getUserUid(),
				"Update Authority Group - " + bean.getGroupName() + " [" + bean.getKind() + "] : " + bean.getDescription(), ""));
		
		return Const.OK;
	}

	@Override
	public boolean changeStatusGroup(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(DBConst.STATUS_ACTIVE.equals(bean.getStatus())) {
			dao.changeStatusGroupForList(bean);
			
			if(bean.getUidArr() != null) {
				for(int i = 0; i < bean.getUidArr().length; i++) {
					logDao.insertAudit(LogUtil.updateAudit(bean.getUidArr()[i], LogUtil.AUTHGROUP, bean.getUserUid(),
							"Authority Group Change Status : " + bean.getStatus(), ""));
				}
			}
		}else {
			for(int i = 0; i < bean.getUidArr().length; i++) {
				int uid = bean.getUidArr()[i];
				bean.setUid(uid);
				dao.changeStatusGroup(bean);
				
				logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.AUTHGROUP, bean.getUserUid(),
						"Authority Group Change Status : " + bean.getStatus(), ""));
			}
		}
		
		return DBConst.SUCCESS;
	}

	@Override
	public Map<String, Object> deleteGroup(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Integer> okList = new ArrayList<Integer>();
		List<Integer> failList = new ArrayList<Integer>();
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
			dao.deleteAuthList(uid);
			dao.deleteAuthUser(uid);
			dao.deleteGroup(uid);
			dao.deleteLine(uid);
			okList.add(uid);
			
			logDao.insertAudit(LogUtil.deleteAudit(uid, LogUtil.AUTHGROUP, bean.getUserUid(),
					"Delete Authority Group", ""));
		}
		
		if(failList.isEmpty()) {
			resultMap.put(Const.ERRCODE, Const.OK);
		}else {
			if(okList.isEmpty()) {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_CANT_DELETE_ALL);
			}else {
				resultMap.put(Const.ERRCODE, Const.ERRCODE_CANT_DELETE_PART);
			}
		}
		
		resultMap.put(Const.LIST + "Ok", okList);
		resultMap.put(Const.LIST + "Fail", failList);
		resultMap.put(Const.RESULT, true);
		
		return resultMap;
	}

	@Override
	public List<ApprLineBean> line() throws Exception {
		List<ApprLineBean> list = dao.getLineGroupLeaderList();
		
		for(int i = 0; i < list.size(); i++) {
			list.get(i).setSubList(dao.getLineWorkerList(list.get(i).getFromAuthGroupUid()));
		}
		
		return list;
	}

	@Override
	public boolean updateLine(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(bean.getFromUidList() != null && bean.getFromUidList().length > 0 && bean.getFromUidList().length == bean.getToUidList().length) {
			dao.deleteLineWorker();
			
			for(int i = 0; i < bean.getFromUidList().length; i++) {
				ApprLineBean lineBean = new ApprLineBean();
				lineBean.setFromAuthGroupUid(bean.getFromUidList()[i]);
				lineBean.setToAuthGroupUid(bean.getToUidList()[i]);
				lineBean.setUserUid(bean.getUserUid());
				
				dao.insertLineWorker(lineBean);
			}
			
			logDao.insertAudit(LogUtil.updateAudit(0, LogUtil.APPRLINE, bean.getUserUid(),
					"Update Approval Line", ""));
			
			return DBConst.SUCCESS;
		}else {
			return DBConst.FAIL;
		}
	}
	
	@Override
	public boolean changeStatusUser(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		dao.changeStatusUserForList(bean);
		
		return DBConst.SUCCESS;
	}

	@Override
	public boolean deleteUser(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
			bean.setUid(uid);
			
			if(dao.deleteUser(bean) > DBConst.ZERO) {
				dao.deleteAuthUserForUser(uid);
				logDao.insertAudit(LogUtil.deleteAudit(uid, LogUtil.USERINFO, bean.getUserUid(),
						"Delete User", ""));
			}
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public Map<String, Object> detailUser(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getUser(bean));
		resultMap.put(Const.LIST + "Group", dao.getGroupListAllowUser(bean.getUid()));
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> newUser() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST + "Pos", dao.getPosCode());
		resultMap.put(Const.LIST + "Group", dao.getGroupListForUser());
		
		return resultMap;
	}

	@Override
	public String insertUser(HttpServletRequest request, UserInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(dao.isExistUserId(bean.getUserId()) > 0) {
			return Const.ERRCODE_EXIST_USERID;
		}else {
			String result = dao.insertUser(bean) > DBConst.ZERO ? Const.OK : Const.FAIL;
			
			if(bean.getUid() > 0 && bean.getAuthGroupUid() > 0) {
				AuthUserBean userBean = new AuthUserBean();
				userBean.setAuthGroupUid(bean.getAuthGroupUid());
				userBean.setUserInfoUid(bean.getUid());
				userBean.setUserUid(bean.getUserUid());
				dao.insertAuthUser(userBean);
			}
			
			if(Const.OK.equals(result)) {
				logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.USERINFO, bean.getUserUid(),
						"New User [" + bean.getUserId() + "] : " + bean.getFirstName() + " " + bean.getLastName() + " Craft (" + bean.getPosCode() + "), Status (" + bean.getStatus() + ")", ""));
			}
			
			return result;
		}
	}

	@Override
	public Map<String, Object> modifyUser(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getUser(bean));
		resultMap.put(Const.LIST + "Pos", dao.getPosCode());
		resultMap.put(Const.LIST + "Ship", dao.getShipInfoList());
		
		return resultMap;
	}

	@Override
	public boolean updateUser(HttpServletRequest request, UserInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		boolean result = dao.updateUser(bean) > DBConst.ZERO ? DBConst.SUCCESS : DBConst.FAIL;
		
		if(result) {
			logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.USERINFO, bean.getUserUid(),
					"Update User : " + bean.getFirstName() + " " + bean.getLastName() + " Craft (" + bean.getPosCode() + "), Status (" + bean.getStatus() + ")", ""));
		}
		
		return result;
	}

	@Override
	public List<CodeInfoBean> codeInfo() throws Exception {
		List<CodeInfoBean> groupList = dao.getCodeGroupList();
		List<CodeInfoBean> list = new ArrayList<CodeInfoBean>();
		
		for(int i = 0; i < groupList.size(); i++) {
			CodeInfoBean group = groupList.get(i);
			list.add(group);
			list.addAll(dao.getCodeInfoList(group.getCode()));
		}
		
		return list;
	}

	@Override
	public Map<String, Object> getUserListForGroup(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);
		
		resultMap.put(Const.LIST, dao.getUserListForGroup(bean));
		resultMap.put(Const.LIST_CNT, dao.getUserListForGroupCnt());
		
		return resultMap;
	}

	@Override
	public Map<String, Object> getAuditList(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		List<AuditLogBean> list = dao.getAuditList(bean);
		
		for(int i = 0; i < list.size(); i++) {
			list.get(i).setDescription(ValidUtil.forJson(list.get(i).getDescription()));
		}
		
		resultMap.put(Const.LIST, list);
		resultMap.put(Const.LIST_CNT, dao.getAuditListCnt());
		
		return resultMap;
	}
}