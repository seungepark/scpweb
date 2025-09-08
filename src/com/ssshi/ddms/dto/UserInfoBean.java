package com.ssshi.ddms.dto;

public class UserInfoBean {
	
	private int uid;
	private String userId;
	private String firstName;
	private String lastName;
	private String posCode;
	private String status;
	
	private String codeName;
	private int userUid;
	private int authGroupUid;
	private int shipInfoUid;
	private String imo;
	private String shipTitle;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
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
	public String getPosCode() {
		return posCode;
	}
	public void setPosCode(String posCode) {
		this.posCode = posCode;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCodeName() {
		return codeName;
	}
	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public int getAuthGroupUid() {
		return authGroupUid;
	}
	public void setAuthGroupUid(int authGroupUid) {
		this.authGroupUid = authGroupUid;
	}
	public int getShipInfoUid() {
		return shipInfoUid;
	}
	public void setShipInfoUid(int shipInfoUid) {
		this.shipInfoUid = shipInfoUid;
	}
	public String getImo() {
		return imo;
	}
	public void setImo(String imo) {
		this.imo = imo;
	}
	public String getShipTitle() {
		return shipTitle;
	}
	public void setShipTitle(String shipTitle) {
		this.shipTitle = shipTitle;
	}
}
