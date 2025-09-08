package com.ssshi.ddms.dto;

public class ScheCrewInOutBean {

	private int uid;
	private int scheCrewUid;
	private String inOutDate;
	private String schedulerInOut;
	private String performanceInOut;
	
	private int userUid;
	
	private int insertBy;
    private String insertDate;
	private int updateBy;
	private String updateDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;
	
	private int addDay;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getScheCrewUid() {
		return scheCrewUid;
	}
	public void setScheCrewUid(int scheCrewUid) {
		this.scheCrewUid = scheCrewUid;
	}
	public String getInOutDate() {
		return inOutDate;
	}
	public void setInOutDate(String inOutDate) {
		this.inOutDate = inOutDate;
	}
	public String getSchedulerInOut() {
		return schedulerInOut;
	}
	public void setSchedulerInOut(String schedulerInOut) {
		this.schedulerInOut = schedulerInOut;
	}
	public String getPerformanceInOut() {
		return performanceInOut;
	}
	public void setPerformanceInOut(String performanceInOut) {
		this.performanceInOut = performanceInOut;
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
	public int getAddDay() {
		return addDay;
	}
	public void setAddDay(int addDay) {
		this.addDay = addDay;
	}
}
