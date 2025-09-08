package com.ssshi.ddms.dto;

public class AuthInfoBean {

	private int uid;
	private String authCode;
	private String kind;
	private String description;
	private int upAuthInfoUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getAuthCode() {
		return authCode;
	}
	public void setAuthCode(String authCode) {
		this.authCode = authCode;
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
	public int getUpAuthInfoUid() {
		return upAuthInfoUid;
	}
	public void setUpAuthInfoUid(int upAuthInfoUid) {
		this.upAuthInfoUid = upAuthInfoUid;
	}
}
