package com.ssshi.ddms.dto;

import java.util.List;

public class ApprLineBean {

	private int uid;
	private int fromAuthGroupUid;
	private int toAuthGroupUid;
	private String apprAuth;
	private String status;
	
	private String groupName;
	private List<ApprLineBean> subList;
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getFromAuthGroupUid() {
		return fromAuthGroupUid;
	}
	public void setFromAuthGroupUid(int fromAuthGroupUid) {
		this.fromAuthGroupUid = fromAuthGroupUid;
	}
	public int getToAuthGroupUid() {
		return toAuthGroupUid;
	}
	public void setToAuthGroupUid(int toAuthGroupUid) {
		this.toAuthGroupUid = toAuthGroupUid;
	}
	public String getApprAuth() {
		return apprAuth;
	}
	public void setApprAuth(String apprAuth) {
		this.apprAuth = apprAuth;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public List<ApprLineBean> getSubList() {
		return subList;
	}
	public void setSubList(List<ApprLineBean> subList) {
		this.subList = subList;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
