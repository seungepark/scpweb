package com.ssshi.ddms.dto;

public class ScheduleHierarchyBean {
	private int uid;
	private String code;
	private String displaycode;	
	private String description; 	
	private int codelevel;	
	private String parentuid;
	private int userUid;
	
	private String parentcode;
	
	private int page;
	private int start;
	private int limit;
	
	private String flag;
	private int[] uidList;
	private int[] codeLvList;
	private String[] parentuidList;
	private String[] codeList;
	private String[] disCodeList;
	
	private String[] descList;
	private String[] flagList;
	
	private String lv1code;
	private String lv2code;
	private String lv3code;
	private String lv4code;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDisplaycode() {
		return displaycode;
	}
	public void setDisplaycode(String displaycode) {
		this.displaycode = displaycode;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getCodelevel() {
		return codelevel;
	}
	public void setCodelevel(int codelevel) {
		this.codelevel = codelevel;
	}
	public String getParentuid() {
		return parentuid;
	}
	public void setParentuid(String parentuid) {
		this.parentuid = parentuid;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public String getParentcode() {
		return parentcode;
	}
	public void setParentcode(String parentcode) {
		this.parentcode = parentcode;
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
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	
	
	
	
	public int[] getUidList() {
		return uidList;
	}
	public void setUidList(int[] uidList) {
		this.uidList = uidList;
	}
	public int[] getCodeLvList() {
		return codeLvList;
	}
	public void setCodeLvList(int[] codeLvList) {
		this.codeLvList = codeLvList;
	}
	public String[] getParentuidList() {
		return parentuidList;
	}
	public void setParentuidList(String[] parentuidList) {
		this.parentuidList = parentuidList;
	}
	public String[] getCodeList() {
		return codeList;
	}
	public void setCodeList(String[] codeList) {
		this.codeList = codeList;
	}
	public String[] getDisCodeList() {
		return disCodeList;
	}
	public void setDisCodeList(String[] disCodeList) {
		this.disCodeList = disCodeList;
	}
	public String[] getDescList() {
		return descList;
	}
	public void setDescList(String[] descList) {
		this.descList = descList;
	}
	public String[] getFlagList() {
		return flagList;
	}
	public void setFlagList(String[] flagList) {
		this.flagList = flagList;
	}
	
	
	public String getLv1code() {
		return lv1code;
	}
	public void setLv1code(String lv1code) {
		this.lv1code = lv1code;
	}
	public String getLv2code() {
		return lv2code;
	}
	public void setLv2code(String lv2code) {
		this.lv2code = lv2code;
	}
	public String getLv3code() {
		return lv3code;
	}
	public void setLv3code(String lv3code) {
		this.lv3code = lv3code;
	}
	public String getLv4code() {
		return lv4code;
	}
	public void setLv4code(String lv4code) {
		this.lv4code = lv4code;
	}
	
}
