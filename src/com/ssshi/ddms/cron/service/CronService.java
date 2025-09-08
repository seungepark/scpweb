package com.ssshi.ddms.cron.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.CronInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.mybatis.dao.CronDao;
import com.ssshi.ddms.mybatis.dao.CronDaoI;
import com.ssshi.ddms.mybatis.dao.LogDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.FileUtil;
import com.ssshi.ddms.util.LogUtil;

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

@Service
public class CronService implements CronServiceI {
	
	static Logger logger = Logger.getLogger(CronService.class);

	@Autowired
	private CronDaoI dao;
	
	@Autowired
	private LogDaoI logDao;
	
	@Autowired
	Environment env;

	@Override
	public void updateShipInfo() throws Exception {
		List<ShipInfoBean> list = CronDao.getProjList();
		
		if(list != null) {
			for(int i = 0; i < list.size(); i++) {
				ShipInfoBean siBean = list.get(i);
				int tempSeq = 0;
				
				if(siBean.getProjSeq() != null && !siBean.getProjSeq().isEmpty()) {
					String[] tempProjSeq = siBean.getProjSeq().split("/");
					
					if(tempProjSeq != null && tempProjSeq.length == 2) {
						try {
							tempSeq = Integer.parseInt(tempProjSeq[0]);
						}catch(NumberFormatException e) {
							tempSeq = 0;
						}
					}
				}
				
				siBean.setSeqNo(tempSeq);
				
				if(dao.existShipInfo(siBean.getShipNum()) > DBConst.ZERO) {
					dao.updateShipInfo(siBean);
				}else {
					dao.insertShipInfo(siBean);
				}
			}
		}
	}

	@Override
	public void dbBackup() throws Exception {
		Calendar cal = Calendar.getInstance();
		String date = (new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss").format(cal.getTime()));
		String fileName = FileUtil.FILE_DIR_FOR_DB_BACKUP + "//scp_db_" + date + ".sql";
		PrintWriter printWriter = null;
		BufferedReader bufferedReader = null;
		
		try {
			printWriter = new PrintWriter(new OutputStreamWriter(new FileOutputStream(fileName), "utf8"));
			Process process = Runtime.getRuntime().exec(FileUtil.RUNTIME);
			InputStreamReader inputStreamReader = new InputStreamReader(process.getInputStream(), "utf8");
			bufferedReader = new BufferedReader(inputStreamReader);
			String line;
			
			while((line = bufferedReader.readLine())!= null){
				printWriter.println(line);
			}
			
			printWriter.flush();
			
			logDao.insertAudit(LogUtil.systemAudit(0, LogUtil.BACKUP_DB, 1,
					"Data Backup : scp_db_" + date + ".sql", "BACKUP"));
		}catch(Exception e) {
		}finally {
			try {
				if(bufferedReader != null) {bufferedReader.close();}
				if(printWriter != null) {printWriter.close();}
			}catch(IOException e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	public void fileBackup() throws Exception {
		// 폴더 생성
		// doc 파일
		// 프로필 파일
		// 일일보고서 파일
		// 커스텀 파일
		String copyRoot = FileUtil.FILE_DIR_BACKUP_ROOT;
		String foldName = (new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss").format(Calendar.getInstance().getTime()));
		File fold = new File(copyRoot + "//" + foldName);
		
		if(!fold.exists()) {fold.mkdirs();}
		
		File foldProfile = new File(copyRoot + "//" + foldName + "//PROFILE");
		
		if(!foldProfile.exists()) {foldProfile.mkdirs();}
		
		List<String> backFile = dao.getFileInfoFileList();

		try {
			if(backFile != null) {
				for(String back : backFile) {
					Path orgFile = Paths.get(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_PROFILE + "//" + back);
					Path copyFile = Paths.get(copyRoot + "//" + foldName + FileUtil.FILE_DIR_FOR_PROFILE + "//" + back);
					
					try {
						Files.copy(orgFile, copyFile);
					}catch(Exception ex) {}
				}
			}
			
			logDao.insertAudit(LogUtil.systemAudit(0, LogUtil.BACKUP_FILE, 1,
					"File Backup : " + foldName, "BACKUP"));
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	@Override
	public CronInfoBean getCron(ParamBean bean) throws Exception {
		return dao.getCron(bean);
	}
	
	@Override
	public Map<String, Object> getCronList(CronInfoBean bean) throws Exception{
		Map<String, Object> cronMap = new HashMap<String, Object>();
		
		if("Y".equals(bean.getIsAll())) {
			bean.setStart(0);
			bean.setLimit(CommonUtil.LIST_LIMIT_FOR_ALL);
		}else {
			bean.setStart(CommonUtil.getListStart(bean.getPage()));
			bean.setLimit(CommonUtil.LIST_LIMIT);
		}
		
		cronMap.put(Const.LIST, dao.getCronList(bean));
		cronMap.put(Const.LIST_CNT, dao.getCronListCnt());
		
		return cronMap;
	}
	
	@Override
	public CronInfoBean detailCron(ParamBean bean) throws Exception {
		return dao.getCron(bean);
	}
	
	@Override
	public CronInfoBean modifyCron(ParamBean bean) throws Exception {
		return dao.getCron(bean);
	}
	
	@Override
	public String updateCron(HttpServletRequest request, CronInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		String result = Const.ERRCODE_EXIST_CRON;
		
		int cnt = dao.checkExistCron(bean);
		
		if(cnt == DBConst.ZERO) {
			if(dao.updateCron(bean) > DBConst.ZERO) {
				result = Const.OK;
				
				logDao.insertAudit(LogUtil.updateAudit(bean.getUid(), LogUtil.CRONINFO, bean.getUserUid(),
						"Update Cron : CronID - " + bean.getCronid() +  ", (" + bean.getDescription() + ")", ""));
			}
		}
		
		return result;
	}
	
	@Override
	public boolean changeStatusCron(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
						
			bean.setUid(uid);
			dao.changeStatusCron(bean);
			
			logDao.insertAudit(LogUtil.updateAudit(uid, LogUtil.CRONINFO, bean.getUserUid(),
					"Cron Change Status : " + bean.getStatus(), ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public boolean deleteCron(HttpServletRequest request, ParamBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		for(int i = 0; i < bean.getUidArr().length; i++) {
			int uid = bean.getUidArr()[i];
			
			dao.deleteCron(uid);
			
			logDao.insertAudit(LogUtil.deleteAudit(uid, LogUtil.CRONINFO, bean.getUserUid(),
					"Delete Cron", ""));
		}
		
		return DBConst.SUCCESS;
	}
	
	@Override
	public String insertCron(HttpServletRequest request, CronInfoBean bean) throws Exception {
		bean.setUserUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		
		if(dao.checkExistCron(bean) > 0) {
			return Const.ERRCODE_EXIST_CRON;
		}else {
			String result = dao.insertCron(bean) > DBConst.ZERO ? Const.OK : Const.FAIL;
			
			if(Const.OK.equals(result)) {
				logDao.insertAudit(LogUtil.createAudit(bean.getUid(), LogUtil.CRONINFO, bean.getUserUid(),
						"New Cron [" + bean.getCronid() + "] : " + bean.getDescription() + " Status (" + bean.getStatus() + "), Frequency :" + bean.getFrequency() + ", CronClass : " + bean.getCronclass(), ""));
			}
			
			return result;
		}
	}
	
	@Override
	public boolean increaseCronRunCntAndDate(String cronId) throws Exception {
		boolean result = DBConst.FAIL;
		CronInfoBean bean = new CronInfoBean();
		bean.setCronid(cronId);
		bean.setIsExist("Y");
		
		if(dao.checkExistCron(bean) > 0) {
			if(dao.increaseCronRunCntAndDate(cronId) > DBConst.ZERO) {
				result = DBConst.SUCCESS;
			}
		}
		return result;
	}
}