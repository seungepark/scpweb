package com.ssshi.ddms.dto;

import java.util.List;

public class SchedulerInfoBean {
	
	private int uid;
	private String hullnum;
	private String shiptype;
	private String description;
	private int owner;
	
	private String ownerName;
	private String department;
	private String sdate;
	private String edate;
	private int period;
	
	private String status;
	private String insertdate;
	private String insertName;
	
	private int userUid;
	
	private int start;
	private int limit;
	private int page;
	private String isAll;
	
	private String sort;
	private String order;

	private String schedtype;

	private String scheCrewSdate;
	private int scheCrewPeriod;
	
	private int[] uidList;
	private String[] cateList;
	private String[] tcnumList;
	private String[] descList;
	private String[] loadList;
	private String[] sdateList;
	private String[] stimeList;
	private String[] edateList;
	private String[] etimeList;
	private String[] seqList;
	private String[] perList;
	private String[] flagList;
	private String[] ctypeList;
	private String[] dtypeList;
	private String[] readyTmList;
	private String[] codedetuidList;
	private String[] sametcnumList;

	private String[] performancesdateList;
	private String[] performancestimeList;
	private String[] performanceedateList;
	private String[] performanceetimeList;
//	private SchedulerDetailInfoBean[] detailList;

	private String[] codedettcnumList;
	private String[] codedetdescList;

	private List<SchedulerCrewInfoBean> schedulerCrewInfoList;

	private int schedulerVersionInfoUid;
	private String revnum;
	private String workFinish;
	
	private String trialStatus;
	private String trialKey;
	private int keyNo;
	
	private String regOwner;
	private String projSeq;
	private int seqNo;
	private int seriesCnt;
	private int per;
	private String isOff;
	
	private int insertBy;
	private int updateBy;
	private String updateDate;
	private int offBy;
	private String offDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;
	
	private String today;

	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getHullnum() {
		return hullnum;
	}
	public void setHullnum(String hullnum) {
		this.hullnum = hullnum;
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
	public int getOwner() {
		return owner;
	}
	public void setOwner(int owner) {
		this.owner = owner;
	}
	public String getOwnerName() {
		return ownerName;
	}
	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getSdate() {
		return sdate;
	}
	public void setSdate(String sdate) {
		this.sdate = sdate;
	}
	public String getEdate() {
		return edate;
	}
	public void setEdate(String edate) {
		this.edate = edate;
	}
	public int getPeriod() {
		return period;
	}
	public void setPeriod(int period) {
		this.period = period;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getInsertdate() {
		return insertdate;
	}
	public void setInsertdate(String insertdate) {
		this.insertdate = insertdate;
	}
	public String getInsertName() {
		return insertName;
	}
	public void setInsertName(String insertName) {
		this.insertName = insertName;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
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
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
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

	public String getSchedtype() { return schedtype; }
	public void setSchedtype(String schedtype) { this.schedtype = schedtype; }

	public int[] getUidList() {
		return uidList;
	}
	public void setUidList(int[] uidList) {
		this.uidList = uidList;
	}
	public String[] getCateList() {
		return cateList;
	}
	public void setCateList(String[] cateList) {
		this.cateList = cateList;
	}
	public String[] getTcnumList() {
		return tcnumList;
	}
	public void setTcnumList(String[] tcnumList) {
		this.tcnumList = tcnumList;
	}
	public String[] getDescList() {
		return descList;
	}
	public void setDescList(String[] descList) {
		this.descList = descList;
	}
	public String[] getLoadList() {
		return loadList;
	}
	public void setLoadList(String[] loadList) {
		this.loadList = loadList;
	}
	public String[] getSdateList() {
		return sdateList;
	}
	public void setSdateList(String[] sdateList) {
		this.sdateList = sdateList;
	}
	public String[] getStimeList() {
		return stimeList;
	}
	public void setStimeList(String[] stimeList) {
		this.stimeList = stimeList;
	}
	public String[] getEdateList() {
		return edateList;
	}
	public void setEdateList(String[] edateList) {
		this.edateList = edateList;
	}
	public String[] getEtimeList() {
		return etimeList;
	}
	public void setEtimeList(String[] etimeList) {
		this.etimeList = etimeList;
	}
	public String[] getSeqList() {
		return seqList;
	}
	public void setSeqList(String[] seqList) {
		this.seqList = seqList;
	}
	public String[] getPerList() {
		return perList;
	}
	public void setPerList(String[] perList) {
		this.perList = perList;
	}
	public String[] getFlagList() {
		return flagList;
	}
	public void setFlagList(String[] flagList) {
		this.flagList = flagList;
	}
	public String[] getCtypeList() {
		return ctypeList;
	}
	public void setCtypeList(String[] ctypeList) {
		this.ctypeList = ctypeList;
	}
	public String[] getDtypeList() {
		return dtypeList;
	}
	public void setDtypeList(String[] dtypeList) {
		this.dtypeList = dtypeList;
	}
	public String[] getReadyTmList() {
		return readyTmList;
	}
	public void setReadyTmList(String[] readyTmList) {
		this.readyTmList = readyTmList;
	}
	public String[] getCodedetuidList() {
		return codedetuidList;
	}
	public void setCodedetuidList(String[] codedetuidList) {
		this.codedetuidList = codedetuidList;
	}
	public String[] getSametcnumList() {
		return sametcnumList;
	}
	public void setSametcnumList(String[] sametcnumList) {
		this.sametcnumList = sametcnumList;
	}

	public String[] getPerformancesdateList() {
		return performancesdateList;
	}

	public void setPerformancesdateList(String[] performancesdateList) {
		this.performancesdateList = performancesdateList;
	}

	public String[] getPerformancestimeList() {
		return performancestimeList;
	}

	public void setPerformancestimeList(String[] performancestimeList) {
		this.performancestimeList = performancestimeList;
	}

	public String[] getPerformanceedateList() {
		return performanceedateList;
	}

	public void setPerformanceedateList(String[] performanceedateList) { this.performanceedateList = performanceedateList; }

	public String[] getPerformanceetimeList() {
		return performanceetimeList;
	}

	public void setPerformanceetimeList(String[] performanceetimeList) { this.performanceetimeList = performanceetimeList; }
	/*public SchedulerDetailInfoBean[] getDetailList() {
		return detailList;
	}
	public void setDetailList(SchedulerDetailInfoBean[] detailList) {
		this.detailList = detailList;
	}*/

	public String[] getCodedettcnumList() { return codedettcnumList; }

	public void setCodedettcnumList(String[] codedettcnumList) { this.codedettcnumList = codedettcnumList; }

	public String[] getCodedetdescList() { return codedetdescList; }

	public void setCodedetdescList(String[] codedetdescList) { this.codedetdescList = codedetdescList; }

	public String getScheCrewSdate() { return scheCrewSdate; }

	public void setScheCrewSdate(String scheCrewSdate) { this.scheCrewSdate = scheCrewSdate; }

	public int getScheCrewPeriod() { return scheCrewPeriod; }

	public void setScheCrewPeriod(int scheCrewPeriod) { this.scheCrewPeriod = scheCrewPeriod; }

	public List<SchedulerCrewInfoBean> getSchedulerCrewInfoList() {
		return schedulerCrewInfoList;
	}

	public void setSchedulerCrewInfoList(List<SchedulerCrewInfoBean> schedulerCrewInfoList) {
		this.schedulerCrewInfoList = schedulerCrewInfoList;
	}

	public int getSchedulerVersionInfoUid() {
		return schedulerVersionInfoUid;
	}

	public void setSchedulerVersionInfoUid(int schedulerVersionInfoUid) {
		this.schedulerVersionInfoUid = schedulerVersionInfoUid;
	}

	public String getRevnum() {
		return revnum;
	}

	public void setRevnum(String revnum) {
		this.revnum = revnum;
	}
	public String getWorkFinish() {
		return workFinish;
	}
	public void setWorkFinish(String workFinish) {
		this.workFinish = workFinish;
	}
	public String getTrialStatus() {
		return trialStatus;
	}
	public void setTrialStatus(String trialStatus) {
		this.trialStatus = trialStatus;
	}
	public String getTrialKey() {
		return trialKey;
	}
	public void setTrialKey(String trialKey) {
		this.trialKey = trialKey;
	}
	public int getKeyNo() {
		return keyNo;
	}
	public void setKeyNo(int keyNo) {
		this.keyNo = keyNo;
	}
	public String getRegOwner() {
		return regOwner;
	}
	public void setRegOwner(String regOwner) {
		this.regOwner = regOwner;
	}
	public String getProjSeq() {
		return projSeq;
	}
	public void setProjSeq(String projSeq) {
		this.projSeq = projSeq;
	}
	public int getSeqNo() {
		return seqNo;
	}
	public void setSeqNo(int seqNo) {
		this.seqNo = seqNo;
	}
	public int getSeriesCnt() {
		return seriesCnt;
	}
	public void setSeriesCnt(int seriesCnt) {
		this.seriesCnt = seriesCnt;
	}
	public int getPer() {
		return per;
	}
	public void setPer(int per) {
		this.per = per;
	}
	public String getIsOff() {
		return isOff;
	}
	public void setIsOff(String isOff) {
		this.isOff = isOff;
	}
	public int getInsertBy() {
		return insertBy;
	}
	public void setInsertBy(int insertBy) {
		this.insertBy = insertBy;
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
	public int getOffBy() {
		return offBy;
	}
	public void setOffBy(int offBy) {
		this.offBy = offBy;
	}
	public String getOffDate() {
		return offDate;
	}
	public void setOffDate(String offDate) {
		this.offDate = offDate;
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
	public String getToday() {
		return today;
	}
	public void setToday(String today) {
		this.today = today;
	}
}
