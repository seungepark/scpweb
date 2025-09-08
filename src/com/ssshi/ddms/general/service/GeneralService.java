package com.ssshi.ddms.general.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.DomainBean;
import com.ssshi.ddms.dto.FileInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ScdvmEvntSchBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.mybatis.dao.GeneralDao;
import com.ssshi.ddms.mybatis.dao.GeneralDaoI;
import com.ssshi.ddms.mybatis.dao.LogDaoI;
import com.ssshi.ddms.util.FileUtil;
import com.ssshi.ddms.util.LogUtil;

/********************************************************************************
 * 프로그램 개요 : General
 * 
 * 최초 작성자 : 김한준
 * 최초 작성일 : 2021-06-07
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
public class GeneralService implements GeneralServiceI {

	@Autowired
	private GeneralDaoI dao;
	
	@Autowired
	private LogDaoI logDao;

	@Override
	public boolean isLogined(HttpServletRequest request) throws Exception {
		if(((UserInfoBean) request.getSession().getAttribute(Const.SS_USERINFO)) != null) {
			return true;
		}else {
			return false;
		}
	}
	
	@Override
	public Map<String, Object> login(HttpServletRequest request, ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		UserInfoBean user = dao.login(bean);
		
		if(user != null) {
			HttpSession session = request.getSession();
			session.setAttribute(Const.SS_USERINFO, user);
			session.setAttribute(Const.SS_AUTH, dao.getAuthList(user.getUid()));
			
			List<String> authKindList = dao.getAuthKindList(user.getUid());
			String authKind = "";
			
			for(int i = 0; i < authKindList.size(); i++) {
				authKind += authKindList.get(i) + ".";
			}
			
			session.setAttribute(Const.SS_AUTH_KIND, authKind);
			
			if(!authKind.contains(DBConst.AUTH_KIND_CAPTAIN)) {
				ParamBean param = new ParamBean();
				param.setUserUid(user.getUid());
				param.setAuthKind(authKind.contains(DBConst.AUTH_KIND_GROUP) ? DBConst.AUTH_KIND_GROUP : DBConst.AUTH_KIND_WORKER);
				
				List<Integer> groupUidList = dao.getSearchAuthGroupUidList(param);
				int[] groupUidArr = new int[groupUidList.size()];
				
				for(int i = 0; i < groupUidList.size(); i++) {
					groupUidArr[i] = groupUidList.get(i);
				}
				
				session.setAttribute(Const.SS_SEARCH_AUTH_GROUP_UID, groupUidArr);
			}
			
			resultMap.put(Const.RESULT, DBConst.SUCCESS);
			resultMap.put(Const.ERRCODE, "");
		}else {
			resultMap.put(Const.RESULT, DBConst.FAIL);
			resultMap.put(Const.ERRCODE, Const.ERRCODE_INVALID);
		}
		
		return resultMap;
	}

	@Override
	public boolean changeUserSet(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		String userId = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUserId();
		String logDesc = userId;
		
		if(bean.getPw() != null && bean.getPw().length() >= 4) {
			dao.changePw(bean);
			
			logDao.insertAudit(LogUtil.updateAudit(bean.getUserUid(), LogUtil.USERINFO, bean.getUserUid(),
					"Update Password", logDesc));
		}
		
		if(bean.getFile() != null && bean.getFile().size() > 0) {
			try {
				FileInfoBean oldFileBean = dao.getProfileFile(bean.getUserUid());
				
				if(oldFileBean != null && oldFileBean.getSaveName() != null) {
					dao.delProfileFile(bean.getUserUid());
					FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_PROFILE + "/" + oldFileBean.getSaveName());
				}
				
				MultipartFile file = bean.getFile().get(0);
				String saveName = FileUtil.getSaveFileNameForUser(FileUtil.PROFILE_FILE, userId, bean.getUserUid());
				file.transferTo(new File(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_PROFILE + "/" + saveName));
				
				FileInfoBean fileBean = new FileInfoBean();
				fileBean.setFileName(file.getOriginalFilename());
				fileBean.setSaveName(saveName);
				fileBean.setFileSize(file.getSize());
				fileBean.setFileType(FileUtil.getFileType(file.getOriginalFilename()));
				fileBean.setUserUid(bean.getUserUid());
				
				dao.insertProfileFile(fileBean);
				
				logDao.insertAudit(LogUtil.updateAudit(fileBean.getUid(), LogUtil.FILEINFO, fileBean.getUserUid(),
						"Update Profile Image : " + fileBean.getFileName(), logDesc));
			}catch(Exception e) {
				e.printStackTrace();
				return DBConst.FAIL;
			}
		}
		
		return DBConst.SUCCESS;
	}

	@Override
	public void getProImgStream(HttpServletRequest request, HttpServletResponse response) throws Exception {
		InputStream is = null;
		OutputStream os = null;
		BufferedInputStream bis = null;
		FileInfoBean fileBean = dao.getProfileFile(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		try {
			if(fileBean != null && fileBean.getSaveName() != null && fileBean.getSaveName().length() > 4) {
				response.setContentType(FileUtil.getContentTypeByType(fileBean.getFileType()));
				is = FileUtil.getFile(FileUtil.FILE_DIR_FOR_PROFILE + "/" + fileBean.getSaveName());
			}else {
				response.setContentType(FileUtil.FILE_EXTENSION_PNG);
				is = FileUtil.getFile(FileUtil.FILE_DIR_FOR_PROFILE + "/" + FileUtil.PROFILE_DEFAULT_FILE_NAME);
			}
			
			os = response.getOutputStream();
			bis = new BufferedInputStream(is);
			int data = 0;
			
			while((data = bis.read()) != -1) {
				os.write(data);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			if(bis != null) try {bis.close();}catch(IOException e) {};
			if(os != null) try {os.close();}catch(IOException e) {};
			if(is != null) try {is.close();}catch(IOException e) {};
		}
	}
	
	@Override
	public void getProImg(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		InputStream is = null;
		OutputStream os = null;
		BufferedInputStream bis = null;
		FileInfoBean fileBean = dao.getProfileFile(bean.getUid());
		
		try {
			if(fileBean != null && fileBean.getSaveName() != null && fileBean.getSaveName().length() > 4) {
				response.setContentType(FileUtil.getContentTypeByType(fileBean.getFileType()));
				is = FileUtil.getFile(FileUtil.FILE_DIR_FOR_PROFILE + "/" + fileBean.getSaveName());
			}else {
				response.setContentType(FileUtil.FILE_EXTENSION_PNG);
				is = FileUtil.getFile(FileUtil.FILE_DIR_FOR_PROFILE + "/" + FileUtil.PROFILE_DEFAULT_FILE_NAME);
			}
			
			os = response.getOutputStream();
			bis = new BufferedInputStream(is);
			int data = 0;
			
			while((data = bis.read()) != -1) {
				os.write(data);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			if(bis != null) try {bis.close();}catch(IOException e) {};
			if(os != null) try {os.close();}catch(IOException e) {};
			if(is != null) try {is.close();}catch(IOException e) {};
		}
	}
	
	@Override
	public List<DomainBean> getDomainList(ParamBean bean) throws Exception {
		List<DomainBean> list = dao.getDomainList(bean);
		
		for(int i = 0; i < list.size(); i++) {
			list.get(i).setInfoList(dao.getDomainInfoList(list.get(i).getUid()));
		}
		
		return list;
	}

	@Override
	public Map<String, Object> getDashboardData(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put(Const.LIST + "Cnt", dao.getDashTrialCnt());
		resultMap.put(Const.LIST + "Hour", dao.getDashTrialHour());
		resultMap.put(Const.LIST + "Sea", dao.getDashAtSeaList());
		resultMap.put(Const.LIST + "Quay", GeneralDao.getDashQuayList());
		
		List<ScdvmEvntSchBean> eventTempList = GeneralDao.getDashEventList();
		List<ScdvmEvntSchBean> eventList = new ArrayList<ScdvmEvntSchBean>();
				
		if(eventTempList != null) {
			String prevProjNo = "";
			int minDiff = 10000;
			String minActv = "";
			String minFndt = "";
			
			for(int i = 0; i < eventTempList.size(); i++) {
				ScdvmEvntSchBean event = eventTempList.get(i);
				
				if(!prevProjNo.equals(event.getProjNo())) {
					if(i > 0) {
						eventList.get(eventList.size() - 1).setActv(minActv);
						eventList.get(eventList.size() - 1).setFndt(minFndt);
					}
					
					prevProjNo = event.getProjNo();
					ScdvmEvntSchBean temp = new ScdvmEvntSchBean();
					temp.setProjNo(event.getProjNo());
					temp.setOwn(event.getOwn());
					temp.setNewSknd(event.getNewSknd());
					temp.setQuayNm(event.getQuayNm());
					minDiff = Math.abs(event.getDiff());
					minActv = event.getActv();
					minFndt = event.getFndt();
					
					ScdvmEvntSchBean tempSub = new ScdvmEvntSchBean();
					tempSub.setActv(event.getActv());
					tempSub.setStdt(event.getStdt());
					tempSub.setFndt(event.getFndt());
					tempSub.setDiff(event.getDiff());
					temp.setList(new ArrayList<ScdvmEvntSchBean>());
					temp.getList().add(tempSub);					
					
					eventList.add(temp);
				}else {
					if(minDiff > Math.abs(event.getDiff())) {
						minDiff = Math.abs(event.getDiff());
						minActv = event.getActv();
						minFndt = event.getFndt();
					}
					
					ScdvmEvntSchBean tempSub = new ScdvmEvntSchBean();
					tempSub.setActv(event.getActv());
					tempSub.setStdt(event.getStdt());
					tempSub.setFndt(event.getFndt());
					tempSub.setDiff(event.getDiff());
					
					eventList.get(eventList.size() - 1).getList().add(tempSub);
				}
				
				if(i == eventTempList.size() - 1) {
					eventList.get(eventList.size() - 1).setActv(minActv);
					eventList.get(eventList.size() - 1).setFndt(minFndt);
				}
			}
		}
		
		resultMap.put(Const.LIST + "Event", eventList);
		
		return resultMap;
	}

	@Override
	public boolean apiUploadFiles(ParamBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		
		try {
			if(bean.getDelFiles() != null) {
				for(int i = 0; i < bean.getDelFiles().length; i++) {
					FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_NOTE + "/" + bean.getDelFiles()[i]);
				}
			}
			
			if(bean.getFile() != null) {
				List<MultipartFile> fileList = bean.getFile();
				
				for(int i = 0; i < fileList.size(); i++) {
					MultipartFile file = fileList.get(i);
					file.transferTo(new File(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_NOTE + "/" + file.getOriginalFilename()));
				}
			}
			
			isResult = DBConst.SUCCESS;
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return isResult;
	}
}