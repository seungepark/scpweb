package com.ssshi.ddms.dto;

public class CronInfoBean {
	private int uid;
	private String cronid;
	private String description;
	private String status;
	private String frequency;
	
	private String cronclass;
	private String lastrundate;
	private int runcnt;
	
	private int userUid;
	private String isExist;
	
	private int start;
	private int limit;
	private int page;
	private String isAll;
	
	
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getCronid() {
		return cronid;
	}
	public void setCronid(String cronid) {
		this.cronid = cronid;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	public String getCronclass() {
		return cronclass;
	}
	public void setCronclass(String cronclass) {
		this.cronclass = cronclass;
	}
	public String getLastrundate() {
		return lastrundate;
	}
	public void setLastrundate(String lastrundate) {
		this.lastrundate = lastrundate;
	}
	public int getRuncnt() {
		return runcnt;
	}
	public void setRuncnt(int runcnt) {
		this.runcnt = runcnt;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public String getIsExist() {
		return isExist;
	}
	public void setIsExist(String isExist) {
		this.isExist = isExist;
	}
	
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public String getIsAll() {
		return isAll;
	}
	public void setIsAll(String isAll) {
		this.isAll = isAll;
	}
	
	
}
