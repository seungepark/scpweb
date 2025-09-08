package com.ssshi.ddms.dto;

public class ScheMailBean {

	private int uid;
	private String name;
	private String company;
	private String department;
	private String rank;
	private String email;
	
	private String[] nameArr;
	private String[] companyArr;
	private String[] departmentArr;
	private String[] rankArr;
	private String[] emailArr;
	private int userUid;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public String getRank() {
		return rank;
	}
	public void setRank(String rank) {
		this.rank = rank;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String[] getNameArr() {
		return nameArr;
	}
	public void setNameArr(String[] nameArr) {
		this.nameArr = nameArr;
	}
	public String[] getCompanyArr() {
		return companyArr;
	}
	public void setCompanyArr(String[] companyArr) {
		this.companyArr = companyArr;
	}
	public String[] getDepartmentArr() {
		return departmentArr;
	}
	public void setDepartmentArr(String[] departmentArr) {
		this.departmentArr = departmentArr;
	}
	public String[] getRankArr() {
		return rankArr;
	}
	public void setRankArr(String[] rankArr) {
		this.rankArr = rankArr;
	}
	public String[] getEmailArr() {
		return emailArr;
	}
	public void setEmailArr(String[] emailArr) {
		this.emailArr = emailArr;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
}
