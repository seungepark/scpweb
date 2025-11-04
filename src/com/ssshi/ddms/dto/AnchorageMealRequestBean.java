package com.ssshi.ddms.dto;

import java.util.List;

import com.ssshi.ddms.util.ExcelUtil;

public class AnchorageMealRequestBean {

	private int uid;
	private int schedulerInfoUid;
	private String ship;
	
	private String projNo;
	private String trialKey;
	private String kind;
	private String domesticYn;
	private String department;
	private String mealDate;
	private String orderStatus;
	private String orderDate;
	private String orderUid;
	private String deleteYn;
	private String comment;
	private String isPlan;

	private int breakfastP;
	private int lunchP;
	private int dinnerP;
	private int lateNightP;
	
	private String inputUid;
	private String inputDate;
	
	private String inDate;
	private String outDate;
	
	
	private String foodStyle;
	
	private List<AnchorageMealQtyBean> planList;
	private List<AnchorageMealQtyBean> resultList;
	
	private int userUid;
	
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
		
	public String getShip() {
		return ship;
	}	
	public void setShip(String ship) {
		this.ship = ship;
	}	
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
	public String getProjNo() {
		return projNo;
	}
	public void setProjNo(String projNo) {
		this.projNo = projNo;
	}
	public String getInputUid() {
		return inputUid;
	}
	public void setInputUid(String inputUid) {
		this.inputUid = inputUid;
	}
	public String getInputDate() {
		return inputDate;
	}
	public void setInDate(String inDate) {
		this.inDate = inDate;
	}
	public String getInDate() {
		return inDate;
	}
	public void setOutDate(String outDate) {
		this.outDate = outDate;
	}
	public String getOutDate() {
		return outDate;
	}
	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}
	public String getTrialKey() {
		return trialKey;
	}
	public void setTrialKey(String trialKey) {
		this.trialKey = trialKey;
	}
	public String getKind() {
		return kind;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}	
	public String getDomesticYn() {
		return domesticYn;
	}
	public String getIsPlan() {
		return isPlan;
	}
	public void setIsPlan(String isPlan) {
		this.isPlan = isPlan;
	}
	public void setDomesticYn(String domesticYn) {
		this.domesticYn = domesticYn;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getMealDate() {
		return mealDate;
	}
	public void setMealDate(String mealDate) {
		this.mealDate = mealDate;
	}	
	public String getOrderStatus() {
		return orderStatus;
	}
	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}	
	public String getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(String orderDate) {
		this.orderDate = orderDate;
	}	
	public String getOrderUid() {
		return orderUid;
	}
	public void setOrderUid(String orderUid) {
		this.orderUid = orderUid;
	}	
	public String getDeleteYn() {
		return deleteYn;
	}
	public void setDeleteYn(String deleteYn) {
		this.deleteYn = deleteYn;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getFoodStyle() {
		return foodStyle;
	}
	public void setFoodStyle(String foodStyle) {
		this.foodStyle = foodStyle;
	}
	
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	
	public List<AnchorageMealQtyBean> getPlanList() {
		return planList;
	}
	public void setPlanList(List<AnchorageMealQtyBean> planList) {
		this.planList = planList;
	}
	public List<AnchorageMealQtyBean> getResultList() {
		return resultList;
	}
	public void setResultList(List<AnchorageMealQtyBean> resultList) {
		this.resultList = resultList;
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
	
	public int getBreakfastP() {
		return breakfastP;
	}
	public void setBreakfastP(int breakfastP) {
		this.breakfastP = breakfastP;
	}
	public int getLunchP() {
		return lunchP;
	}
	public void setLunchP(int lunchP) {
		this.lunchP = lunchP;
	}
	public int getDinnerP() {
		return dinnerP;
	}
	public void setDinnerP(int dinnerP) {
		this.dinnerP = dinnerP;
	}
	public int getLateNightP() {
		return lateNightP;
	}
	public void setLateNightP(int lateNightP) {
		this.lateNightP = lateNightP;
	}
	
}
