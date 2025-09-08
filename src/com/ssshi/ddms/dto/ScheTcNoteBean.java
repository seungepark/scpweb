package com.ssshi.ddms.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class ScheTcNoteBean {

	private int uid;
	private int schedulerInfoUid;
	private int schedulerDetailUid;
	private String codeKind;
	private String code;
	private String startDate;
	private String endDate;
	private String remark;
	private String isReport;
	
	private String tcNum;
	private String tcDesc;
	private List<ScheTcNoteTcInfoBean> tcList;
	private List<ScheTcNoteFileInfoBean> fileList;
	private int[] tcUidList;
	private int[] existFileUidList;
	private List<MultipartFile> files;
	private int userUid;
	
	private int insertBy;
    private String insertDate;
	private int updateBy;
	private String updateDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getSchedulerInfoUid() {
		return schedulerInfoUid;
	}
	public void setSchedulerInfoUid(int schedulerInfoUid) {
		this.schedulerInfoUid = schedulerInfoUid;
	}
	public int getSchedulerDetailUid() {
		return schedulerDetailUid;
	}
	public void setSchedulerDetailUid(int schedulerDetailUid) {
		this.schedulerDetailUid = schedulerDetailUid;
	}
	public String getCodeKind() {
		return codeKind;
	}
	public void setCodeKind(String codeKind) {
		this.codeKind = codeKind;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getIsReport() {
		return isReport;
	}
	public void setIsReport(String isReport) {
		this.isReport = isReport;
	}
	public String getTcNum() {
		return tcNum;
	}
	public void setTcNum(String tcNum) {
		this.tcNum = tcNum;
	}
	public String getTcDesc() {
		return tcDesc;
	}
	public void setTcDesc(String tcDesc) {
		this.tcDesc = tcDesc;
	}
	public List<ScheTcNoteTcInfoBean> getTcList() {
		return tcList;
	}
	public void setTcList(List<ScheTcNoteTcInfoBean> tcList) {
		this.tcList = tcList;
	}
	public List<ScheTcNoteFileInfoBean> getFileList() {
		return fileList;
	}
	public void setFileList(List<ScheTcNoteFileInfoBean> fileList) {
		this.fileList = fileList;
	}
	public int[] getTcUidList() {
		return tcUidList;
	}
	public void setTcUidList(int[] tcUidList) {
		this.tcUidList = tcUidList;
	}
	public int[] getExistFileUidList() {
		return existFileUidList;
	}
	public void setExistFileUidList(int[] existFileUidList) {
		this.existFileUidList = existFileUidList;
	}
	public List<MultipartFile> getFiles() {
		return files;
	}
	public void setFiles(List<MultipartFile> files) {
		this.files = files;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
	}
	public String getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(String insertDate) {
		this.insertDate = insertDate;
	}
	public int getUpdateBy() {
		return updateBy;
	}
	public void setUpdateBy(int updateBy) {
		this.updateBy = updateBy;
	}
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	public int getOrgUid() {
		return orgUid;
	}
	public void setOrgUid(int orgUid) {
		this.orgUid = orgUid;
	}
	public String getRevKind() {
		return revKind;
	}
	public void setRevKind(String revKind) {
		this.revKind = revKind;
	}
	public String getRevDay() {
		return revDay;
	}
	public void setRevDay(String revDay) {
		this.revDay = revDay;
	}
}
