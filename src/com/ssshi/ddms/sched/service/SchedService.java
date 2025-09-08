package com.ssshi.ddms.sched.service;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.dto.DomainInfoBean;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.PjtEvntBean;
import com.ssshi.ddms.dto.PjtEvntColumnBean;
import com.ssshi.ddms.dto.PjtEvntSaveBean;
import com.ssshi.ddms.dto.ScenarioBean;
import com.ssshi.ddms.dto.ScenarioDetailBean;
import com.ssshi.ddms.dto.ShipBbsBean;
import com.ssshi.ddms.dto.ShipBbsFileInfoBean;
import com.ssshi.ddms.dto.ShipInfoBean;
import com.ssshi.ddms.dto.UserInfoBean;
import com.ssshi.ddms.dto.WorkStdBean;
import com.ssshi.ddms.mybatis.dao.SchedDaoI;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.FileUtil;
import com.ssshi.ddms.util.ValidUtil;

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

@Service
public class SchedService implements SchedServiceI {

	
	@Autowired
	private SchedDaoI dao;

	@Override
	public Map<String, Object> eventList(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		
		resultMap.put(Const.LIST + "ShipType", dao.getShipTypeList());
		resultMap.put(Const.LIST + "CrewKind", dao.getCrewKindList());
		resultMap.put("ifDate", dao.getLastIfDate());
		resultMap.put(Const.BEAN, dao.getEventColumnInfo(userUid));
		
		return resultMap;
	}

	@Override
	public List<PjtEvntBean> getEventList(ParamBean bean) throws Exception {
		return dao.getEventList(bean);
	}

	@Override
	public boolean updateEventColumnInfo(HttpServletRequest request, PjtEvntColumnBean bean) throws Exception {
		bean.setUserInfoUid(((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid());
		dao.deletePjtEvntColumn(bean.getUserInfoUid());
		
		return dao.insertPjtEvntColumn(bean) > DBConst.ZERO ? DBConst.SUCCESS : DBConst.FAIL;
	}

	@Override
	public  boolean updateEventList(HttpServletRequest request, PjtEvntSaveBean bean) throws Exception {
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		boolean isLc = bean.getIsLc() == 1;
		boolean isSp = bean.getIsSp() == 1;
		boolean isBt = bean.getIsBt() == 1;
		boolean isGt = bean.getIsGt() == 1;
		boolean isCmr = bean.getIsCmr() == 1;
		boolean isMt = bean.getIsMt() == 1;
		boolean isIe = bean.getIsIe() == 1;
		boolean isAc = bean.getIsAc() == 1;
		boolean isSt = bean.getIsSt() == 1;
		boolean isCold = bean.getIsCold() == 1;
		boolean isLng = bean.getIsLng() == 1;
		boolean isGas = bean.getIsGas() == 1;
		boolean isWf = bean.getIsWf() == 1;
		boolean isDl = bean.getIsDl() == 1;
		
		if(bean.getUidArr() != null && bean.getUidArr().length > 0) {
			if(isLc || isSp || isBt || isGt || isCmr || isMt || isIe || isAc || isSt || isCold || isLng || isGas || isWf || isDl) {
				for(int i = 0; i < bean.getUidArr().length; i++) {
					PjtEvntBean event = new PjtEvntBean();
					event.setUid(bean.getUidArr()[i]);
					event.setUserInfoUid(userUid);
					
					event.setIsLc(bean.getIsLc());
					event.setIsSp(bean.getIsSp());
					event.setIsBt(bean.getIsBt());
					event.setIsGt(bean.getIsGt());
					event.setIsCmr(bean.getIsCmr());
					event.setIsMt(bean.getIsMt());
					event.setIsIe(bean.getIsIe());
					event.setIsAc(bean.getIsAc());
					event.setIsSt(bean.getIsSt());
					event.setIsCold(bean.getIsCold());
					event.setIsLng(bean.getIsLng());
					event.setIsGas(bean.getIsGas());
					event.setIsWf(bean.getIsWf());
					event.setIsDl(bean.getIsDl());
					
					if(isLc) event.setProsLc(bean.getProsLcArr()[i]);
					if(isSp) event.setProsSp(bean.getProsSpArr()[i]);
					if(isBt) event.setProsBt(bean.getProsBtArr()[i]);
					if(isGt) event.setProsGt(bean.getProsGtArr()[i]);
					if(isCmr) event.setProsCmr(bean.getProsCmrArr()[i]);
					if(isMt) event.setProsMt(bean.getProsMtArr()[i]);
					if(isIe) event.setProsIe(bean.getProsIeArr()[i]);
					if(isWf) event.setProsWf(bean.getProsWfArr()[i]);
					if(isDl) event.setProsDl(bean.getProsDlArr()[i]);
					
					if(isAc) {
						event.setProsAcFrom(bean.getProsAcFromArr()[i]);
						event.setProsAcTo(bean.getProsAcToArr()[i]);
					}
					
					if(isSt) {
						event.setProsStFrom(bean.getProsStFromArr()[i]);
						event.setProsStTo(bean.getProsStToArr()[i]);
					}
					
					if(isCold) {
						event.setProsColdFrom(bean.getProsColdFromArr()[i]);
						event.setProsColdTo(bean.getProsColdToArr()[i]);
					}
					
					if(isLng) {
						event.setProsLngFrom(bean.getProsLngFromArr()[i]);
						event.setProsLngTo(bean.getProsLngToArr()[i]);
					}
					
					if(isGas) {
						event.setProsGasFrom(bean.getProsGasFromArr()[i]);
						event.setProsGasTo(bean.getProsGasToArr()[i]);
					}
					
					dao.insertPjtEvntLog(event);
					dao.updatePjtEvnt(event);
				}
			}
		}
		
		if(bean.getPjtArr() != null && bean.getPjtArr().length > 0) {
			for(int i = 0; i < bean.getPjtArr().length; i++) {
				if(dao.isExistShipNum(bean.getPjtArr()[i]) == DBConst.ZERO) {
					ShipInfoBean shipInfo = new ShipInfoBean();
					shipInfo.setShipNum(bean.getPjtArr()[i]);
					shipInfo.setRegOwner(bean.getRegOwnerArr()[i]);
					shipInfo.setShipType(bean.getShipTypeArr()[i]);
					shipInfo.setTypeModel(bean.getTypeModelArr()[i]);
					shipInfo.setUserUid(userUid);
					
					if(dao.insertShipInfo(shipInfo) > DBConst.ZERO) {
						PjtEvntBean event = new PjtEvntBean();
						event.setPjt(bean.getPjtArr()[i]);
						event.setUserInfoUid(userUid);
						
						if(isLc) event.setProsLc(bean.getNewLcArr()[i]);
						if(isSp) event.setProsSp(bean.getNewSpArr()[i]);
						if(isBt) event.setProsBt(bean.getNewBtArr()[i]);
						if(isGt) event.setProsGt(bean.getNewGtArr()[i]);
						if(isCmr) event.setProsCmr(bean.getNewCmrArr()[i]);
						if(isMt) event.setProsMt(bean.getNewMtArr()[i]);
						if(isIe) event.setProsIe(bean.getNewIeArr()[i]);
						if(isWf) event.setProsWf(bean.getNewWfArr()[i]);
						if(isDl) event.setProsDl(bean.getNewDlArr()[i]);
						
						if(isAc) {
							event.setProsAcFrom(bean.getNewAcFromArr()[i]);
							event.setProsAcTo(bean.getNewAcToArr()[i]);
						}
						
						if(isSt) {
							event.setProsStFrom(bean.getNewStFromArr()[i]);
							event.setProsStTo(bean.getNewStToArr()[i]);
						}
						
						if(isCold) {
							event.setProsColdFrom(bean.getNewColdFromArr()[i]);
							event.setProsColdTo(bean.getNewColdToArr()[i]);
						}
						
						if(isLng) {
							event.setProsLngFrom(bean.getNewLngFromArr()[i]);
							event.setProsLngTo(bean.getNewLngToArr()[i]);
						}
						
						if(isGas) {
							event.setProsGasFrom(bean.getNewGasFromArr()[i]);
							event.setProsGasTo(bean.getNewGasToArr()[i]);
						}
						
						dao.insertPjtEvnt(event);
					}
				}
			}
		}
		
		return DBConst.SUCCESS;
	}

	@Override
	public List<ShipBbsBean> getBbsList(ShipBbsBean bean) throws Exception {
		List<ShipBbsBean> list = dao.getShipBbsList(bean.getPjt());
		
		if(list != null) {
			for(int i = 0; i < list.size(); i++) {
				list.get(i).setRemark(ValidUtil.forJson(ValidUtil.forHtml(list.get(i).getRemark())));
				list.get(i).setFileList(dao.getShipBbsFileList(list.get(i).getUid()));
			}
		}
		
		return list;
	}

	@Override
	public boolean insertBbs(HttpServletRequest request, ShipBbsBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setInsertBy(userUid);
		
		if(dao.insertShipBbs(bean) > DBConst.ZERO) {
			if(bean.getFiles() != null) {
				try {
					ShipBbsFileInfoBean fileBean = new ShipBbsFileInfoBean();
					fileBean.setShipBbsUid(bean.getUid());
					fileBean.setInsertBy(userUid);
					
					for(int i = 0; i < bean.getFiles().size(); i++) {
						MultipartFile file = bean.getFiles().get(i);
						String saveName = FileUtil.getSaveFileName(FileUtil.BBS_FILE);
						
						file.transferTo(new File(FileUtil.FILE_DIR_ROOT + FileUtil.FILE_DIR_FOR_BBS + "/" + saveName));
						
						fileBean.setFileName(file.getOriginalFilename());
						fileBean.setSaveName(saveName);
						fileBean.setFileSize(file.getSize());
						fileBean.setFileType(FileUtil.getFileType(file.getOriginalFilename()));
						dao.insertShipBbsFileInfo(fileBean);
					}
				}catch(Exception e) {}
			}
			
			isResult = DBConst.SUCCESS;
		}
		
		return isResult;
	}

	@Override
	public boolean deleteBbs(ParamBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		List<ShipBbsFileInfoBean> fileList = dao.getShipBbsFileList(bean.getUid());
		
		if(fileList != null) {
			for(int i = 0; i < fileList.size(); i++) {
				FileUtil.deleteFile(FileUtil.FILE_DIR_FOR_BBS + "/" + fileList.get(i).getSaveName());
			}
			
			dao.deleteShipBbsFileAll(bean.getUid());
		}
		
		if(dao.deleteShipBbs(bean.getUid()) > DBConst.ZERO) {
			isResult = DBConst.SUCCESS;
		}
		
		return isResult;
	}

	@Override
	public void downBbsFile(HttpServletRequest request, HttpServletResponse response, ParamBean bean) throws Exception {
		InputStream is = null;
		OutputStream os = null;
		BufferedInputStream bis = null;
		
		try {
			ShipBbsFileInfoBean file = dao.getShipBbsFile(bean.getUid());
			String fileName = FileUtil.decodeFileName(file.getFileName(), request.getHeader("User-Agent"));
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
			
			is = FileUtil.getFile(FileUtil.FILE_DIR_FOR_BBS + "/" + file.getSaveName());
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
	public Map<String, Object> scenarioList(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.LIST + "ShipType", dao.getShipTypeList());
		resultMap.put(Const.LIST + "Status", dao.getStatusList());
		
		return resultMap;
	}

	@Override
	public Map<String, Object> getScenarioList(ScenarioBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		bean.setStart(CommonUtil.getListStart(bean.getPage()));
		bean.setLimit(CommonUtil.LIST_LIMIT);

		resultMap.put(Const.LIST, dao.getScenarioList(bean));
		resultMap.put(Const.LIST_CNT, dao.getScenarioListCnt());
		
		return resultMap;
	}
	
	@Override
	public boolean changeStatusScenario(HttpServletRequest request, ParamBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		
		if(bean.getUidArr() != null) {
			for(int i = 0; i < bean.getUidArr().length; i++) {
				bean.setUid(bean.getUidArr()[i]);
				dao.updateScenarioStatus(bean);
			}
		}
		
		isResult = DBConst.SUCCESS;
		
		return isResult;
	}
	
	@Override
	public boolean deleteScenario(ParamBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		
		if(bean.getUidArr() != null) {
			for(int i = 0; i < bean.getUidArr().length; i++) {
				int uid = bean.getUidArr()[i];
				
				if(dao.deleteScenario(uid) > DBConst.ZERO) {
					dao.deleteScenarioDetailList(uid);
				}
			}
		}
		
		isResult = DBConst.SUCCESS;
		
		return isResult;
	}

	@Override
	public Map<String, Object> newScenario() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<DomainInfoBean> currency = dao.getCurrencyList();
		
		resultMap.put(Const.LIST + "ShipType", dao.getShipTypeList());
		resultMap.put(Const.LIST + "ProjEvent", dao.getProjEventList());
		resultMap.put(Const.LIST + "MarginCur", currency);
		resultMap.put(Const.LIST + "RevenueCur", currency);
		resultMap.put(Const.LIST + "CostCur", currency);
		resultMap.put(Const.LIST + "Color", dao.getColorList());
		resultMap.put(Const.LIST + "Option", dao.getScenarioOptionList());
		
		return resultMap;
	}

	@Override
	public List<WorkStdBean> getWorkStdSearchList(ParamBean bean) throws Exception {
		return dao.getWorkStdSearchList(bean);
	}
	
	@Override
	public Map<String, Object> getCopyScenario(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getScenario(bean.getUid()));
		resultMap.put(Const.LIST, dao.getScenarioDetail(bean.getUid()));
		
		return resultMap;
	}

	@Override
	public Map<String, Object> insertScenario(HttpServletRequest request, ScenarioBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		boolean isResult = DBConst.FAIL;
		
		if(dao.isExistScenario(bean.getTitle()) > DBConst.ZERO) {
			resultMap.put(Const.ERRCODE, Const.ERRCODE_EXIST_SCENARIO);
		}else {
			int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
			bean.setUserUid(userUid);
			
			if(dao.insertScenario(bean) > DBConst.ZERO && bean.getUid() > DBConst.ZERO) {
				if(bean.getSeqList() != null) {
					for(int i = 0; i < bean.getSeqList().length; i++) {
						ScenarioDetailBean detail = new ScenarioDetailBean();
						detail.setScenarioUid(bean.getUid());
						detail.setSeq(bean.getSeqList()[i]);
						detail.setDescription(bean.getDescriptionList()[i]);
						detail.setColor(bean.getColorList()[i]);
						detail.setIsOption(bean.getIsOptionList()[i]);
						detail.setOptionData(bean.getOptionDataList()[i]);
						detail.setWorkTime(bean.getWorkTimeList()[i]);
						detail.setLng(bean.getLngList()[i]);
						detail.setLn2(bean.getLn2List()[i]);
						detail.setUserUid(userUid);
						
						dao.insertScenarioDetail(detail);
					}
				}
				
				isResult = DBConst.SUCCESS;
			}
		}
		
		resultMap.put(Const.RESULT, isResult);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> detailScenario(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put(Const.BEAN, dao.getScenario(bean.getUid()));
		resultMap.put(Const.LIST, dao.getScenarioDetail(bean.getUid()));
		resultMap.put(Const.LIST + "Option", dao.getScenarioOptionList());
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> modifyScenario(ParamBean bean) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<DomainInfoBean> currency = dao.getCurrencyList();
		
		resultMap.put(Const.BEAN, dao.getScenario(bean.getUid()));
		resultMap.put(Const.LIST, dao.getScenarioDetail(bean.getUid()));
		resultMap.put(Const.LIST + "ShipType", dao.getShipTypeList());
		resultMap.put(Const.LIST + "ProjEvent", dao.getProjEventList());
		resultMap.put(Const.LIST + "MarginCur", currency);
		resultMap.put(Const.LIST + "RevenueCur", currency);
		resultMap.put(Const.LIST + "CostCur", currency);
		resultMap.put(Const.LIST + "Color", dao.getColorList());
		resultMap.put(Const.LIST + "Option", dao.getScenarioOptionList());
		
		return resultMap;
	}
	
	@Override
	public boolean updateScenario(HttpServletRequest request, ScenarioBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		int userUid = ((UserInfoBean)(request.getSession().getAttribute(Const.SS_USERINFO))).getUid();
		bean.setUserUid(userUid);
		
		if(dao.updateScenario(bean) > DBConst.ZERO) {
			dao.deleteScenarioDetailList(bean.getUid());
			
			if(bean.getSeqList() != null) {
				for(int i = 0; i < bean.getSeqList().length; i++) {
					ScenarioDetailBean detail = new ScenarioDetailBean();
					detail.setScenarioUid(bean.getUid());
					detail.setSeq(bean.getSeqList()[i]);
					detail.setDescription(bean.getDescriptionList()[i]);
					detail.setColor(bean.getColorList()[i]);
					detail.setIsOption(bean.getIsOptionList()[i]);
					detail.setOptionData(bean.getOptionDataList()[i]);
					detail.setWorkTime(bean.getWorkTimeList()[i]);
					detail.setLng(bean.getLngList()[i]);
					detail.setLn2(bean.getLn2List()[i]);
					detail.setUserUid(userUid);
					
					dao.insertScenarioDetail(detail);
				}
			}
			
			isResult = DBConst.SUCCESS;
		}
		
		return isResult;
	}

	@Override
	public Map<String, Object> workStd() throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<WorkStdBean> list = new ArrayList<WorkStdBean>();
		List<WorkStdBean> lv1List = dao.getWorkStdLv1List();
		
		if(lv1List != null) {
			for(int i = 0; i < lv1List.size(); i++) {
				WorkStdBean lv1 = lv1List.get(i);
				list.add(lv1);
				
				List<WorkStdBean> lv2 = dao.getWorkStdLv2List(lv1.getUid());
				
				if(lv2 != null) {
					list.addAll(lv2);
				}
			}
		}
		
		resultMap.put(Const.LIST, list);
		resultMap.put(Const.LIST + "Group", lv1List);
		resultMap.put(Const.LIST + "Color", dao.getColorList());
		
		return resultMap;
	}

	@Override
	public boolean updateWorkStd(WorkStdBean bean) throws Exception {
		boolean isResult = DBConst.FAIL;
		
		if(bean.getModifyUidList() != null) {
			for(int i = 0; i < bean.getModifyUidList().length; i++) {
				WorkStdBean workStd = new WorkStdBean();
				workStd.setUid(bean.getModifyUidList()[i]);
				workStd.setParentUid(bean.getModifyParentUidList()[i]);
				workStd.setCodeLevel(bean.getModifyCodeLevelList()[i]);
				workStd.setDescription(bean.getModifyDescriptionList()[i]);
				workStd.setIsOption(bean.getModifyIsOptionList()[i]);
				workStd.setColor(bean.getModifyColorList()[i]);
				
				dao.updateWorkStd(workStd);
			}
		}
		
		if(bean.getAddCodeLevelList() != null) {
			for(int i = 0; i < bean.getAddCodeLevelList().length; i++) {
				WorkStdBean workStd = new WorkStdBean();
				workStd.setParentUid(bean.getAddParentUidList()[i]);
				workStd.setCodeLevel(bean.getAddCodeLevelList()[i]);
				workStd.setDescription(bean.getAddDescriptionList()[i]);
				workStd.setIsOption(bean.getAddIsOptionList()[i]);
				workStd.setColor(bean.getAddColorList()[i]);
				
				dao.insertWorkStd(workStd);
			}
		}
		
		if(bean.getDeleteUidList() != null) {
			for(int i = 0; i < bean.getDeleteUidList().length; i++) {
				dao.deleteWorkStd(bean.getDeleteUidList()[i]);
			}
		}
		
		isResult = DBConst.SUCCESS;
		
		return isResult;
	}
}
