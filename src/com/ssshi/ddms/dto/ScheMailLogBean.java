package com.ssshi.ddms.dto;

import org.springframework.web.multipart.MultipartFile;

public class ScheMailLogBean {

	int schedulerInfoUid;
	String toStep;
	int toStepUid;
	String kind;
	String email;
	int insertBy;
	
	String[] toList;
	String[] ccList; 
	String[] bccList; 
	String title;
	String desc;
	MultipartFile file;
	String fileName;
	
	public int getSchedulerInfoUid() {
		return schedulerInfoUid;
	}
	public void setSchedulerInfoUid(int schedulerInfoUid) {
		this.schedulerInfoUid = schedulerInfoUid;
	}
	public String getToStep() {
		return toStep;
	}
	public void setToStep(String toStep) {
		this.toStep = toStep;
	}
	public int getToStepUid() {
		return toStepUid;
	}
	public void setToStepUid(int toStepUid) {
		this.toStepUid = toStepUid;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
	}
	public String[] getToList() {
		return toList;
	}
	public void setToList(String[] toList) {
		this.toList = toList;
	}
	public String[] getCcList() {
		return ccList;
	}
	public void setCcList(String[] ccList) {
		this.ccList = ccList;
	}
	public String[] getBccList() {
		return bccList;
	}
	public void setBccList(String[] bccList) {
		this.bccList = bccList;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
