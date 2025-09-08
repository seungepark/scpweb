package com.ssshi.ddms.dto;

import java.util.List;

public class VesselReqInfoBean {

    private int uid;
    private String hullNum;
    private String shiptype;
    private String description;
    private String status;
    private int userUid;
    private int  schedinfouid;

    private String insertbyNm;

    private int page;
    private int start;
    private int limit;
    private String isAll;
    private String sort;
    private String order;
    private String registerdowner;
    private String grosstonnage;
    private String drawn;
    private String checked;
    private String manager;

    private List<VesselReqInfoDetailBean> params;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getHullNum() {
        return hullNum;
    }

    public void setHullNum(String hullNum) {
        this.hullNum = hullNum;
    }

    public String getShiptype() {
        return shiptype;
    }

    public void setShiptype(String shiptype) {
        this.shiptype = shiptype;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getUserUid() {
        return userUid;
    }

    
    public int getSchedinfouid() {
		return schedinfouid;
	}

	public void setSchedinfouid(int schedinfouid) {
		this.schedinfouid = schedinfouid;
	}

	public void setUserUid(int userUid) {
        this.userUid = userUid;
    }

    public String getInsertbyNm() {
        return insertbyNm;
    }

    public void setInsertbyNm(String insertbyNm) {
        this.insertbyNm = insertbyNm;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String getIsAll() {
        return isAll;
    }

    public void setIsAll(String isAll) {
        this.isAll = isAll;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public List<VesselReqInfoDetailBean> getParams() {
        return params;
    }

    public void setParams(List<VesselReqInfoDetailBean> params) {
        this.params = params;
    }

    public String getRegisterdowner() {
        return registerdowner;
    }

    public void setRegisterdowner(String registerdowner) {
        this.registerdowner = registerdowner;
    }

    public String getGrosstonnage() {
        return grosstonnage;
    }

    public void setGrosstonnage(String grosstonnage) {
        this.grosstonnage = grosstonnage;
    }

    public String getDrawn() {
        return drawn;
    }

    public void setDrawn(String drawn) {
        this.drawn = drawn;
    }

    public String getChecked() {
        return checked;
    }

    public void setChecked(String checked) {
        this.checked = checked;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }
}
