package com.ssshi.ddms.system.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ssshi.ddms.dto.ApprLineBean;
import com.ssshi.ddms.dto.AuthGroupBean;
import com.ssshi.ddms.dto.AuthInfoBean;
import com.ssshi.ddms.dto.CodeInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.UserInfoBean;

public interface SystemServiceI {
	
	Map<String, Object> getGroupList(ParamBean bean) throws Exception;
	
	Map<String, Object> getUserList(ParamBean bean) throws Exception;
	
	List<AuthInfoBean> getAuthList() throws Exception;
	
	List<ApprLineBean> getLineGroupLeaderList() throws Exception;
	
	boolean insertGroup(HttpServletRequest request, AuthGroupBean bean) throws Exception;
	
	Map<String, Object> detailGroup(ParamBean bean) throws Exception;
	
	String updateGroup(HttpServletRequest request, AuthGroupBean bean) throws Exception;
	
	boolean changeStatusGroup(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> deleteGroup(HttpServletRequest request, ParamBean bean) throws Exception;
	
	List<ApprLineBean> line() throws Exception;
	
	boolean updateLine(HttpServletRequest request, ParamBean bean) throws Exception;
	
	boolean changeStatusUser(HttpServletRequest request, ParamBean bean) throws Exception;
	
	boolean deleteUser(HttpServletRequest request, ParamBean bean) throws Exception;
	
	Map<String, Object> detailUser(ParamBean bean) throws Exception;
	
	Map<String, Object> newUser() throws Exception;
	
	String insertUser(HttpServletRequest request, UserInfoBean bean) throws Exception;
	
	Map<String, Object> modifyUser(ParamBean bean) throws Exception;
	
	boolean updateUser(HttpServletRequest request, UserInfoBean bean) throws Exception;
	
	List<CodeInfoBean> codeInfo() throws Exception;
	
	Map<String, Object> getUserListForGroup(ParamBean bean) throws Exception;
	
	Map<String, Object> getAuditList(ParamBean bean) throws Exception;
}
