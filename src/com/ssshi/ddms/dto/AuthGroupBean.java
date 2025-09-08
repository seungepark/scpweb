package com.ssshi.ddms.dto;

public class AuthGroupBean {

	private int uid;
	private String groupName;
	private String description;
	private String kind;
	private String status;
	
	private int toUid;
	private int[] authInfoUidList;
	private int[] userUidList;
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getToUid() {
		return toUid;
	}
	public void setToUid(int toUid) {
		this.toUid = toUid;
	}
	public int[] getAuthInfoUidList() {
		return authInfoUidList;
	}
	public void setAuthInfoUidList(int[] authInfoUidList) {
		this.authInfoUidList = authInfoUidList;
	}
	public int[] getUserUidList() {
		return userUidList;
	}
	public void setUserUidList(int[] userUidList) {
		this.userUidList = userUidList;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
