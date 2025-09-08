package com.ssshi.ddms.dto;

public class DomainInfoBean {

	private int uid;
	private int domainUid;
	private String val;
	private String inVal;
	private String description;
	
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getDomainUid() {
		return domainUid;
	}
	public void setDomainUid(int domainUid) {
		this.domainUid = domainUid;
	}
	public String getVal() {
		return val;
	}
	public void setVal(String val) {
		this.val = val;
	}
	public String getInVal() {
		return inVal;
	}
	public void setInVal(String inVal) {
		this.inVal = inVal;
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
}
