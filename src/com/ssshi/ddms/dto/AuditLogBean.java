package com.ssshi.ddms.dto;

public class AuditLogBean {

	private int uid;
	private int targetUid;
	private String targetTb;
	private String targetDesc;
	private String kind;
	private String description;
	private int insertBy;
	private String insertDate;
	
	private String codeName;
	private String firstName;
	private String lastName;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getTargetUid() {
		return targetUid;
	}
	public void setTargetUid(int targetUid) {
		this.targetUid = targetUid;
	}
	public String getTargetTb() {
		return targetTb;
	}
	public void setTargetTb(String targetTb) {
		this.targetTb = targetTb;
	}
	public String getTargetDesc() {
		return targetDesc;
	}
	public void setTargetDesc(String targetDesc) {
		this.targetDesc = targetDesc;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
	public String getCodeName() {
		return codeName;
	}
	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
}
