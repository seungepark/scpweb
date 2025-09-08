package com.ssshi.ddms.dto;

public class ScheTcNoteTcInfoBean {

	private int uid;
	private int schedulerInfoUid;
	private int scheTcNoteUid;
	private int schedulerDetailUid;
	
	private String tcNum;
	private String description;
	private int userUid;
	
	private int insertBy;
    private String insertDate;
	
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
	public int getScheTcNoteUid() {
		return scheTcNoteUid;
	}
	public void setScheTcNoteUid(int scheTcNoteUid) {
		this.scheTcNoteUid = scheTcNoteUid;
	}
	public int getSchedulerDetailUid() {
		return schedulerDetailUid;
	}
	public void setSchedulerDetailUid(int schedulerDetailUid) {
		this.schedulerDetailUid = schedulerDetailUid;
	}
	public String getTcNum() {
		return tcNum;
	}
	public void setTcNum(String tcNum) {
		this.tcNum = tcNum;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
