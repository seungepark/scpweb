package com.ssshi.ddms.dto;

public class SchedulerDetailInfoBean {
	
	private int uid;
	private int  schedinfouid;
	private String category;
	private String tcnum;
	
	private String description;
	private String ctype;
	private String loadrate;
	private String dtype;
	private String sdate;
	
	private String stime;
	private String edate;
	private String etime;
	private String seq;
	private String per;
	
	private String note;
	private String sametcnum;
	
	private int userUid;
	private int start;
	private int limit;
	private int page;
	private String isAll;
	private String sort;
	private String search2;
	private String order;
	
	private String flag;
	
	private String readytime;
	private String codedetuid;

	// 실적 관련 추가, 실적 시작일, 실적 시작 시간, 실적 완료일, 실적 완료 시간
	private String performancesdate;
	private String performancestime;
	private String performanceedate;
	private String performanceetime;

	private String codedettcnum;
	private String codedetdesc;

	private int newschedinfouid;
	
	private int insertBy;
    private String insertDate;
	private int updateBy;
	private String updateDate;
	
	private int orgUid;
	private String revKind;
	private String revDay;
	
	private String state;
	private int gap;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getSchedinfouid() {
		return schedinfouid;
	}
	public void setSchedinfouid(int schedinfouid) {
		this.schedinfouid = schedinfouid;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getTcnum() {
		return tcnum;
	}
	public void setTcnum(String tcnum) {
		this.tcnum = tcnum;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCtype() {
		return ctype;
	}
	public void setCtype(String ctype) {
		this.ctype = ctype;
	}
	public String getLoadrate() {
		return loadrate;
	}
	public void setLoadrate(String loadrate) {
		this.loadrate = loadrate;
	}
	public String getDtype() {
		return dtype;
	}
	public void setDtype(String dtype) {
		this.dtype = dtype;
	}
	public String getSdate() {
		return sdate;
	}
	public void setSdate(String sdate) {
		this.sdate = sdate;
	}
	public String getStime() {
		return stime;
	}
	public void setStime(String stime) {
		this.stime = stime;
	}
	public String getEdate() {
		return edate;
	}
	public void setEdate(String edate) {
		this.edate = edate;
	}
	public String getEtime() {
		return etime;
	}
	public void setEtime(String etime) {
		this.etime = etime;
	}
	public String getSeq() {
		return seq;
	}
	public void setSeq(String seq) {
		this.seq = seq;
	}
	public String getPer() {
		return per;
	}
	public void setPer(String per) {
		this.per = per;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
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
	public String getSearch2() {
		return search2;
	}
	public void setSearch2(String search2) {
		this.search2 = search2;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getReadytime() {
		return readytime;
	}
	public void setReadytime(String readytime) {
		this.readytime = readytime;
	}
	public String getCodedetuid() {
		return codedetuid;
	}
	public void setCodedetuid(String codedetuid) {
		this.codedetuid = codedetuid;
	}
	public String getSametcnum() {
		return sametcnum;
	}
	public void setSametcnum(String sametcnum) {
		this.sametcnum = sametcnum;
	}

	public String getPerformancesdate() { return performancesdate; }

	public void setPerformancesdate(String performancesdate) { this.performancesdate = performancesdate; }

	public String getPerformancestime() { return performancestime; }

	public void setPerformancestime(String performancestime) { this.performancestime = performancestime; }

	public String getPerformanceedate() { return performanceedate; }

	public void setPerformanceedate(String performanceedate) { this.performanceedate = performanceedate; }

	public String getPerformanceetime() { return performanceetime; }

	public void setPerformanceetime(String performanceetime) { this.performanceetime = performanceetime; }

	public String getCodedettcnum() { return codedettcnum; }

	public void setCodedettcnum(String codedettcnum) { this.codedettcnum = codedettcnum; }

	public String getCodedetdesc() { return codedetdesc; }

	public void setCodedetdesc(String codedetdesc) { this.codedetdesc = codedetdesc; }

	public int getNewschedinfouid() {
		return newschedinfouid;
	}

	public void setNewschedinfouid(int newschedinfouid) {
		this.newschedinfouid = newschedinfouid;
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
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public int getGap() {
		return gap;
	}
	public void setGap(int gap) {
		this.gap = gap;
	}
}
