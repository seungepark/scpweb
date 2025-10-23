package com.ssshi.ddms.dto;

import java.util.List;

public class AnchorageMealListBean {

	private Integer schedulerInfoUid;
	
	private String uuid;
	
	private int[] uid;
	private String[] projNo;
	private String[] trialKey;
	private String[] kind;
	private String[] domesticYn;
	private String[] department;
	private String[] mealDate;
	private String[] orderStatus;
	private String[] orderDate;
	private String[] orderUid;
	private String[] deleteYn;
	private String[] comment;
	private String[] foodStyle;

	private String[] breakfast;
	private String[] lunch;
	private String[] dinner;
	private String[] lateNight;
	
	private String[] planMealDate;
	private String[] planMealTime;
	private String[] planMealGubun;
	private String[] planMealQty;
	
	private String[] resultMealDate;
	private String[] resultMealTime;
	private String[] resultMealGubun;
	private String[] resultMealQty;

	private int[] uidArr;
	
	public Integer getSchedulerInfoUid() {
		return schedulerInfoUid;
	}
	public void setSchedulerInfoUid(Integer schedulerInfoUid) {
		this.schedulerInfoUid = schedulerInfoUid;
	}
	
	public int[] getUid() {
		return uid;
	}
	public void setUid(int[] uid) {
		this.uid = uid;
	}	
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public String[] getProjNo() {
		return projNo;
	}
	public void setProjNo(String[] projNo) {
		this.projNo = projNo;
	}
	public String[] getTrialKey() {
		return trialKey;
	}
	public void setTrialKey(String[] trialKey) {
		this.trialKey = trialKey;
	}
	public String[] getKind() {
		return kind;
	}
	public void setKind(String[] kind) {
		this.kind = kind;
	}	
	public String[] getDomesticYn() {
		return domesticYn;
	}
	public void setDomesticYn(String[] domesticYn) {
		this.domesticYn = domesticYn;
	}
	public String[] getDepartment() {
		return department;
	}
	public void setDepartment(String[] department) {
		this.department = department;
	}
	public String[] getMealDate() {
		return mealDate;
	}
	public void setMealDate(String[] mealDate) {
		this.mealDate = mealDate;
	}	
	public String[] getOrderStatus() {
		return orderStatus;
	}
	public void setOrderStatus(String[] orderStatus) {
		this.orderStatus = orderStatus;
	}	
	public String[] getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(String[] orderDate) {
		this.orderDate = orderDate;
	}	
	public String[] getOrderUid() {
		return orderUid;
	}
	public void setOrderUid(String[] orderUid) {
		this.orderUid = orderUid;
	}	
	public String[] getDeleteYn() {
		return deleteYn;
	}
	public void setDeleteYn(String[] deleteYn) {
		this.deleteYn = deleteYn;
	}
	public String[] getComment() {
		return comment;
	}
	public void setComment(String[] comment) {
		this.comment = comment;
	}
	
	public String[] getPlanMealDate() {
		return planMealDate;
	}
	public void setPlanMealDate(String[] planMealDate) {
		this.planMealDate = planMealDate;
	}
	public String[] getPlanMealTime() {
		return planMealTime;
	}
	public void setPlanMealTime(String[] planMealTime) {
		this.planMealTime = planMealTime;
	}
	public String[] getPlanMealGubun() {
		return planMealGubun;
	}
	public void setPlanMealGubun(String[] planMealGubun) {
		this.planMealGubun = planMealGubun;
	}
	public String[] getPlanMealQty() {
		return planMealQty;
	}
	public void setPlanMealQty(String[] planMealQty) {
		this.planMealQty = planMealQty;
	}
	
	public String[] getResultMealDate() {
		return resultMealDate;
	}
	public void setResultMealDate(String[] resultMealDate) {
		this.resultMealDate = resultMealDate;
	}
	public String[] getResultMealTime() {
		return resultMealTime;
	}
	public void setResultMealTime(String[] resultMealTime) {
		this.resultMealTime = resultMealTime;
	}
	public String[] getResultMealGubun() {
		return resultMealGubun;
	}
	public String[] getFoodStyle() {
		return foodStyle;
	}
	public void setFoodStyle(String[] foodStyle) {
		this.foodStyle = foodStyle;
	}
	public void setResultMealGubun(String[] resultMealGubun) {
		this.resultMealGubun = resultMealGubun;
	}
	public String[] getResultMealQty() {
		return resultMealQty;
	}
	public void setResultMealQty(String[] resultMealQty) {
		this.resultMealQty = resultMealQty;
	}
	
	public String[] getBreakfast() {
		return breakfast;
	}
	public void setBreakfast(String[] breakfast) {
		this.breakfast = breakfast;
	}
	public String[] getLunch() {
		return lunch;
	}
	public void setLunch(String[] lunch) {
		this.lunch = lunch;
	}
	public String[] getDinner() {
		return dinner;
	}
	public void setDinner(String[] dinner) {
		this.dinner = dinner;
	}
	public String[] getLateNight() {
		return lateNight;
	}
	public void LateNight(String[] lateNight) {
		this.lateNight = lateNight;
	}
	/*
	 * public String[] getDeleteYn() { return deleteYn; } public void
	 * setDeleteYn(String[] deleteYn) { this.deleteYn = deleteYn; }
	 */
	
	public int[] getUidArr() {
		return uidArr;
	}
	public void setUidArr(int[] uidArr) {
		this.uidArr = uidArr;
	}
}
