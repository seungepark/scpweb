package com.ssshi.ddms.dto;

/********************************************************************************
 * 프로그램 개요 : Mobile Room Info Bean
 * 
 * 최초 작성자 : picnic
 * 최초 작성일 : 2025-11-02 
 * 
 * 메모 : 모바일 방정보 테이블용 Bean 
 *
 ********************************************************************************/

public class MobileRoomInfoBean {

	private long uid;
	private String projNo;
	private Integer schedulerInfoUid;
	private String trialKey;
	private String deck;
	private String roomNo;
	private String roomName;
	private String tel;
	private String sizeM2;
	private Integer bedCount;
	private String bathroomYn;
	private String status;
	private String delYn;
	private String androidId;
	private String mobileDeviceId;
	private String insertDate;
	private String regUsername;
	private String updateDate;
	private String updateUsername;
	
	public long getUid() {
		return uid;
	}
	public void setUid(long uid) {
		this.uid = uid;
	}
	public String getProjNo() {
		return projNo;
	}
	public void setProjNo(String projNo) {
		this.projNo = projNo;
	}
	public Integer getSchedulerInfoUid() {
		return schedulerInfoUid;
	}
	public void setSchedulerInfoUid(Integer schedulerInfoUid) {
		this.schedulerInfoUid = schedulerInfoUid;
	}
	public String getTrialKey() {
		return trialKey;
	}
	public void setTrialKey(String trialKey) {
		this.trialKey = trialKey;
	}
	public String getDeck() {
		return deck;
	}
	public void setDeck(String deck) {
		this.deck = deck;
	}
	public String getRoomNo() {
		return roomNo;
	}
	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getSizeM2() {
		return sizeM2;
	}
	public void setSizeM2(String sizeM2) {
		this.sizeM2 = sizeM2;
	}
	public Integer getBedCount() {
		return bedCount;
	}
	public void setBedCount(Integer bedCount) {
		this.bedCount = bedCount;
	}
	public String getBathroomYn() {
		return bathroomYn;
	}
	public void setBathroomYn(String bathroomYn) {
		this.bathroomYn = bathroomYn;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDelYn() {
		return delYn;
	}
	public void setDelYn(String delYn) {
		this.delYn = delYn;
	}
	public String getAndroidId() {
		return androidId;
	}
	public void setAndroidId(String androidId) {
		this.androidId = androidId;
	}
	public String getMobileDeviceId() {
		return mobileDeviceId;
	}
	public void setMobileDeviceId(String mobileDeviceId) {
		this.mobileDeviceId = mobileDeviceId;
	}
	public String getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(String insertDate) {
		this.insertDate = insertDate;
	}
	public String getRegUsername() {
		return regUsername;
	}
	public void setRegUsername(String regUsername) {
		this.regUsername = regUsername;
	}
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	public String getUpdateUsername() {
		return updateUsername;
	}
	public void setUpdateUsername(String updateUsername) {
		this.updateUsername = updateUsername;
	}
}
