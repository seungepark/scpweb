package com.ssshi.ddms.dto;

public class WorkStdBean {

	private int uid;
	private int parentUid;
	private int codeLevel;
	private String description;
	private String isOption;
	private String color;
	
	private int[] addCodeLevelList;
	private int[] addParentUidList;
	private String[] addDescriptionList;
	private String[] addIsOptionList;
	private String[] addColorList;
	
	private int[] modifyUidList;
	private int[] modifyCodeLevelList;
	private int[] modifyParentUidList;
	private String[] modifyDescriptionList;
	private String[] modifyIsOptionList;
	private String[] modifyColorList;
	
	private int[] deleteUidList;
	
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getParentUid() {
		return parentUid;
	}
	public void setParentUid(int parentUid) {
		this.parentUid = parentUid;
	}
	public int getCodeLevel() {
		return codeLevel;
	}
	public void setCodeLevel(int codeLevel) {
		this.codeLevel = codeLevel;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getIsOption() {
		return isOption;
	}
	public void setIsOption(String isOption) {
		this.isOption = isOption;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public int[] getAddCodeLevelList() {
		return addCodeLevelList;
	}
	public void setAddCodeLevelList(int[] addCodeLevelList) {
		this.addCodeLevelList = addCodeLevelList;
	}
	public int[] getAddParentUidList() {
		return addParentUidList;
	}
	public void setAddParentUidList(int[] addParentUidList) {
		this.addParentUidList = addParentUidList;
	}
	public String[] getAddDescriptionList() {
		return addDescriptionList;
	}
	public void setAddDescriptionList(String[] addDescriptionList) {
		this.addDescriptionList = addDescriptionList;
	}
	public String[] getAddIsOptionList() {
		return addIsOptionList;
	}
	public void setAddIsOptionList(String[] addIsOptionList) {
		this.addIsOptionList = addIsOptionList;
	}
	public String[] getAddColorList() {
		return addColorList;
	}
	public void setAddColorList(String[] addColorList) {
		this.addColorList = addColorList;
	}
	public int[] getModifyUidList() {
		return modifyUidList;
	}
	public void setModifyUidList(int[] modifyUidList) {
		this.modifyUidList = modifyUidList;
	}
	public int[] getModifyCodeLevelList() {
		return modifyCodeLevelList;
	}
	public void setModifyCodeLevelList(int[] modifyCodeLevelList) {
		this.modifyCodeLevelList = modifyCodeLevelList;
	}
	public int[] getModifyParentUidList() {
		return modifyParentUidList;
	}
	public void setModifyParentUidList(int[] modifyParentUidList) {
		this.modifyParentUidList = modifyParentUidList;
	}
	public String[] getModifyDescriptionList() {
		return modifyDescriptionList;
	}
	public void setModifyDescriptionList(String[] modifyDescriptionList) {
		this.modifyDescriptionList = modifyDescriptionList;
	}
	public String[] getModifyIsOptionList() {
		return modifyIsOptionList;
	}
	public void setModifyIsOptionList(String[] modifyIsOptionList) {
		this.modifyIsOptionList = modifyIsOptionList;
	}
	public String[] getModifyColorList() {
		return modifyColorList;
	}
	public void setModifyColorList(String[] modifyColorList) {
		this.modifyColorList = modifyColorList;
	}
	public int[] getDeleteUidList() {
		return deleteUidList;
	}
	public void setDeleteUidList(int[] deleteUidList) {
		this.deleteUidList = deleteUidList;
	}
}
