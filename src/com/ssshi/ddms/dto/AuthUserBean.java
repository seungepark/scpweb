package com.ssshi.ddms.dto;

public class AuthUserBean {

	private int uid;
	private int userInfoUid;
	private int authGroupUid;
	
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getUserInfoUid() {
		return userInfoUid;
	}
	public void setUserInfoUid(int userInfoUid) {
		this.userInfoUid = userInfoUid;
	}
	public int getAuthGroupUid() {
		return authGroupUid;
	}
	public void setAuthGroupUid(int authGroupUid) {
		this.authGroupUid = authGroupUid;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
