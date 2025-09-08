package com.ssshi.ddms.dto;

public class ScenarioDetailBean {

	private int uid;
	private int scenarioUid;
	private int seq;
	private String description;
	private String color;
	private String isOption;
	private String optionData;
	private Integer workTime;
	private String lng;
	private String ln2;
	
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getScenarioUid() {
		return scenarioUid;
	}
	public void setScenarioUid(int scenarioUid) {
		this.scenarioUid = scenarioUid;
	}
	public int getSeq() {
		return seq;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getIsOption() {
		return isOption;
	}
	public void setIsOption(String isOption) {
		this.isOption = isOption;
	}
	public String getOptionData() {
		return optionData;
	}
	public void setOptionData(String optionData) {
		this.optionData = optionData;
	}
	public Integer getWorkTime() {
		return workTime;
	}
	public void setWorkTime(Integer workTime) {
		this.workTime = workTime;
	}
	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}
	public String getLn2() {
		return ln2;
	}
	public void setLn2(String ln2) {
		this.ln2 = ln2;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
