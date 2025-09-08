package com.ssshi.ddms.dto;

import java.util.List;

public class ScheCrewBean {

	private int uid;
	private int schedulerInfoUid;
	private String kind;
	private String company;
	private String department;
	private String name;
	private String rank;
	private String idNo;
	private String workType1;
	private String workType2;
	private String mainSub;
	private String foodStyle;
	private String personNo;
	private String phone;
	private String isPlan;
	
	private int userUid;
	private List<ScheCrewInOutBean> inOutList;
	private int cnt;
	private boolean isBoard;
	private boolean isUnboard;
	private int diff;
	
	private String isNone;
	private int insertBy;
    private String insertDate;
	private int updateBy;
	private String updateDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getSchedulerInfoUid() {
		return schedulerInfoUid;
	}
	public void setSchedulerInfoUid(int schedulerInfoUid) {
		this.schedulerInfoUid = schedulerInfoUid;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRank() {
		return rank;
	}
	public void setRank(String rank) {
		this.rank = rank;
	}
	public String getIdNo() {
		return idNo;
	}
	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}
	public String getWorkType1() {
		return workType1;
	}
	public void setWorkType1(String workType1) {
		this.workType1 = workType1;
	}
	public String getWorkType2() {
		return workType2;
	}
	public void setWorkType2(String workType2) {
		this.workType2 = workType2;
	}
	public String getMainSub() {
		return mainSub;
	}
	public void setMainSub(String mainSub) {
		this.mainSub = mainSub;
	}
	public String getFoodStyle() {
		return foodStyle;
	}
	public void setFoodStyle(String foodStyle) {
		this.foodStyle = foodStyle;
	}
	public String getPersonNo() {
		return personNo;
	}
	public void setPersonNo(String personNo) {
		this.personNo = personNo;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getIsPlan() {
		return isPlan;
	}
	public void setIsPlan(String isPlan) {
		this.isPlan = isPlan;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public List<ScheCrewInOutBean> getInOutList() {
		return inOutList;
	}
	public void setInOutList(List<ScheCrewInOutBean> inOutList) {
		this.inOutList = inOutList;
	}
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
	public boolean isBoard() {
		return isBoard;
	}
	public void setBoard(boolean isBoard) {
		this.isBoard = isBoard;
	}
	public boolean isUnboard() {
		return isUnboard;
	}
	public void setUnboard(boolean isUnboard) {
		this.isUnboard = isUnboard;
	}
	public int getDiff() {
		return diff;
	}
	public void setDiff(int diff) {
		this.diff = diff;
	}
	public String getIsNone() {
		return isNone;
	}
	public void setIsNone(String isNone) {
		this.isNone = isNone;
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
	public int getUpdateBy() {
		return updateBy;
	}
	public void setUpdateBy(int updateBy) {
		this.updateBy = updateBy;
	}
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	public int getOrgUid() {
		return orgUid;
	}
	public void setOrgUid(int orgUid) {
		this.orgUid = orgUid;
	}
	public String getRevKind() {
		return revKind;
	}
	public void setRevKind(String revKind) {
		this.revKind = revKind;
	}
	public String getRevDay() {
		return revDay;
	}
	public void setRevDay(String revDay) {
		this.revDay = revDay;
	}
}
