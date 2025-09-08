package com.ssshi.ddms.dto;

public class AuthListBean {

	private int uid;
	private int authGroupUid;
	private int authInfoUid;
	
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getAuthGroupUid() {
		return authGroupUid;
	}
	public void setAuthGroupUid(int authGroupUid) {
		this.authGroupUid = authGroupUid;
	}
	public int getAuthInfoUid() {
		return authInfoUid;
	}
	public void setAuthInfoUid(int authInfoUid) {
		this.authInfoUid = authInfoUid;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
