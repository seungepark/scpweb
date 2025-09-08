package com.ssshi.ddms.dto;

public class ScheTrialInfoBean {

	private int uid;
	private int schedulerInfoUid;
	private int trial1SchedulerInfoUid;
	private int trial2SchedulerInfoUid;
	private Integer itpTotalRemain; 
	private Integer itpTotalBase; 
	private Integer itpTrialRemain; 
	private Integer itpTrialBase; 
	private Integer itpOutfittingRemain ; 
	private Integer itpOutfittingBase; 
	private Integer punchTotal; 
	private Integer punchTrial; 
	private Integer punchOutfitting; 
	private Float fuelHfoScheduler; 
	private Float fuelMgoScheduler; 
	private Float fuelMdoScheduler; 
	private Float fuelLngScheduler; 
	private Float fuelHfoPerformance; 
	private Float fuelMgoPerformance; 
	private Float fuelMdoPerformance; 
	private Float fuelLngPerformance; 
	private Float fuelHfoTemp; 
	private Float fuelMgoTemp; 
	private Float fuelMdoTemp; 
	private Float fuelLngTemp; 
	private Float fuelHfoUp; 
	private Float fuelMgoUp; 
	private Float fuelMdoUp; 
	private Float fuelLngUp; 
	private Float fuelHfoDown; 
	private Float fuelMgoDown; 
	private Float fuelMdoDown; 
	private Float fuelLngDown; 
	private Float draftFwdScheduler; 
	private Float draftMidScheduler; 
	private Float draftAftScheduler; 
	private Float draftFwdPerformance; 
	private Float draftMidPerformance; 
	private Float draftAftPerformance; 
	private Float draftFwdTemp; 
	private Float draftMidTemp; 
	private Float draftAftTemp; 
	private Float draftFwdUp; 
	private Float draftMidUp; 
	private Float draftAftUp; 
	private Float draftFwdDown; 
	private Float draftMidDown; 
	private Float draftAftDown; 
	private String crewRemark; 
	private String remark;
	private Float contractSpeed;
	private Float measureSpeed;
	private String compRemark;
	private String noiseVibration;
	private String trialStatus;
	
	private String trial1HullNum;
	private String trial1ShipType;
	private String trial2HullNum;
	private String trial2ShipType;
	private int trialTime;
	private int trial1Time;
	private int trial2Time;
	private int userUid;
	
	private String ongoChangeDate;
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
	public int getTrial1SchedulerInfoUid() {
		return trial1SchedulerInfoUid;
	}
	public void setTrial1SchedulerInfoUid(int trial1SchedulerInfoUid) {
		this.trial1SchedulerInfoUid = trial1SchedulerInfoUid;
	}
	public int getTrial2SchedulerInfoUid() {
		return trial2SchedulerInfoUid;
	}
	public void setTrial2SchedulerInfoUid(int trial2SchedulerInfoUid) {
		this.trial2SchedulerInfoUid = trial2SchedulerInfoUid;
	}
	public Integer getItpTotalRemain() {
		return itpTotalRemain;
	}
	public void setItpTotalRemain(Integer itpTotalRemain) {
		this.itpTotalRemain = itpTotalRemain;
	}
	public Integer getItpTotalBase() {
		return itpTotalBase;
	}
	public void setItpTotalBase(Integer itpTotalBase) {
		this.itpTotalBase = itpTotalBase;
	}
	public Integer getItpTrialRemain() {
		return itpTrialRemain;
	}
	public void setItpTrialRemain(Integer itpTrialRemain) {
		this.itpTrialRemain = itpTrialRemain;
	}
	public Integer getItpTrialBase() {
		return itpTrialBase;
	}
	public void setItpTrialBase(Integer itpTrialBase) {
		this.itpTrialBase = itpTrialBase;
	}
	public Integer getItpOutfittingRemain() {
		return itpOutfittingRemain;
	}
	public void setItpOutfittingRemain(Integer itpOutfittingRemain) {
		this.itpOutfittingRemain = itpOutfittingRemain;
	}
	public Integer getItpOutfittingBase() {
		return itpOutfittingBase;
	}
	public void setItpOutfittingBase(Integer itpOutfittingBase) {
		this.itpOutfittingBase = itpOutfittingBase;
	}
	public Integer getPunchTotal() {
		return punchTotal;
	}
	public void setPunchTotal(Integer punchTotal) {
		this.punchTotal = punchTotal;
	}
	public Integer getPunchTrial() {
		return punchTrial;
	}
	public void setPunchTrial(Integer punchTrial) {
		this.punchTrial = punchTrial;
	}
	public Integer getPunchOutfitting() {
		return punchOutfitting;
	}
	public void setPunchOutfitting(Integer punchOutfitting) {
		this.punchOutfitting = punchOutfitting;
	}
	public Float getFuelHfoScheduler() {
		return fuelHfoScheduler;
	}
	public void setFuelHfoScheduler(Float fuelHfoScheduler) {
		this.fuelHfoScheduler = fuelHfoScheduler;
	}
	public Float getFuelMgoScheduler() {
		return fuelMgoScheduler;
	}
	public void setFuelMgoScheduler(Float fuelMgoScheduler) {
		this.fuelMgoScheduler = fuelMgoScheduler;
	}
	public Float getFuelMdoScheduler() {
		return fuelMdoScheduler;
	}
	public void setFuelMdoScheduler(Float fuelMdoScheduler) {
		this.fuelMdoScheduler = fuelMdoScheduler;
	}
	public Float getFuelLngScheduler() {
		return fuelLngScheduler;
	}
	public void setFuelLngScheduler(Float fuelLngScheduler) {
		this.fuelLngScheduler = fuelLngScheduler;
	}
	public Float getFuelHfoPerformance() {
		return fuelHfoPerformance;
	}
	public void setFuelHfoPerformance(Float fuelHfoPerformance) {
		this.fuelHfoPerformance = fuelHfoPerformance;
	}
	public Float getFuelMgoPerformance() {
		return fuelMgoPerformance;
	}
	public void setFuelMgoPerformance(Float fuelMgoPerformance) {
		this.fuelMgoPerformance = fuelMgoPerformance;
	}
	public Float getFuelMdoPerformance() {
		return fuelMdoPerformance;
	}
	public void setFuelMdoPerformance(Float fuelMdoPerformance) {
		this.fuelMdoPerformance = fuelMdoPerformance;
	}
	public Float getFuelLngPerformance() {
		return fuelLngPerformance;
	}
	public void setFuelLngPerformance(Float fuelLngPerformance) {
		this.fuelLngPerformance = fuelLngPerformance;
	}
	public Float getFuelHfoTemp() {
		return fuelHfoTemp;
	}
	public void setFuelHfoTemp(Float fuelHfoTemp) {
		this.fuelHfoTemp = fuelHfoTemp;
	}
	public Float getFuelMgoTemp() {
		return fuelMgoTemp;
	}
	public void setFuelMgoTemp(Float fuelMgoTemp) {
		this.fuelMgoTemp = fuelMgoTemp;
	}
	public Float getFuelMdoTemp() {
		return fuelMdoTemp;
	}
	public void setFuelMdoTemp(Float fuelMdoTemp) {
		this.fuelMdoTemp = fuelMdoTemp;
	}
	public Float getFuelLngTemp() {
		return fuelLngTemp;
	}
	public void setFuelLngTemp(Float fuelLngTemp) {
		this.fuelLngTemp = fuelLngTemp;
	}
	public Float getFuelHfoUp() {
		return fuelHfoUp;
	}
	public void setFuelHfoUp(Float fuelHfoUp) {
		this.fuelHfoUp = fuelHfoUp;
	}
	public Float getFuelMgoUp() {
		return fuelMgoUp;
	}
	public void setFuelMgoUp(Float fuelMgoUp) {
		this.fuelMgoUp = fuelMgoUp;
	}
	public Float getFuelMdoUp() {
		return fuelMdoUp;
	}
	public void setFuelMdoUp(Float fuelMdoUp) {
		this.fuelMdoUp = fuelMdoUp;
	}
	public Float getFuelLngUp() {
		return fuelLngUp;
	}
	public void setFuelLngUp(Float fuelLngUp) {
		this.fuelLngUp = fuelLngUp;
	}
	public Float getFuelHfoDown() {
		return fuelHfoDown;
	}
	public void setFuelHfoDown(Float fuelHfoDown) {
		this.fuelHfoDown = fuelHfoDown;
	}
	public Float getFuelMgoDown() {
		return fuelMgoDown;
	}
	public void setFuelMgoDown(Float fuelMgoDown) {
		this.fuelMgoDown = fuelMgoDown;
	}
	public Float getFuelMdoDown() {
		return fuelMdoDown;
	}
	public void setFuelMdoDown(Float fuelMdoDown) {
		this.fuelMdoDown = fuelMdoDown;
	}
	public Float getFuelLngDown() {
		return fuelLngDown;
	}
	public void setFuelLngDown(Float fuelLngDown) {
		this.fuelLngDown = fuelLngDown;
	}
	public Float getDraftFwdScheduler() {
		return draftFwdScheduler;
	}
	public void setDraftFwdScheduler(Float draftFwdScheduler) {
		this.draftFwdScheduler = draftFwdScheduler;
	}
	public Float getDraftMidScheduler() {
		return draftMidScheduler;
	}
	public void setDraftMidScheduler(Float draftMidScheduler) {
		this.draftMidScheduler = draftMidScheduler;
	}
	public Float getDraftAftScheduler() {
		return draftAftScheduler;
	}
	public void setDraftAftScheduler(Float draftAftScheduler) {
		this.draftAftScheduler = draftAftScheduler;
	}
	public Float getDraftFwdPerformance() {
		return draftFwdPerformance;
	}
	public void setDraftFwdPerformance(Float draftFwdPerformance) {
		this.draftFwdPerformance = draftFwdPerformance;
	}
	public Float getDraftMidPerformance() {
		return draftMidPerformance;
	}
	public void setDraftMidPerformance(Float draftMidPerformance) {
		this.draftMidPerformance = draftMidPerformance;
	}
	public Float getDraftAftPerformance() {
		return draftAftPerformance;
	}
	public void setDraftAftPerformance(Float draftAftPerformance) {
		this.draftAftPerformance = draftAftPerformance;
	}
	public Float getDraftFwdTemp() {
		return draftFwdTemp;
	}
	public void setDraftFwdTemp(Float draftFwdTemp) {
		this.draftFwdTemp = draftFwdTemp;
	}
	public Float getDraftMidTemp() {
		return draftMidTemp;
	}
	public void setDraftMidTemp(Float draftMidTemp) {
		this.draftMidTemp = draftMidTemp;
	}
	public Float getDraftAftTemp() {
		return draftAftTemp;
	}
	public void setDraftAftTemp(Float draftAftTemp) {
		this.draftAftTemp = draftAftTemp;
	}
	public Float getDraftFwdUp() {
		return draftFwdUp;
	}
	public void setDraftFwdUp(Float draftFwdUp) {
		this.draftFwdUp = draftFwdUp;
	}
	public Float getDraftMidUp() {
		return draftMidUp;
	}
	public void setDraftMidUp(Float draftMidUp) {
		this.draftMidUp = draftMidUp;
	}
	public Float getDraftAftUp() {
		return draftAftUp;
	}
	public void setDraftAftUp(Float draftAftUp) {
		this.draftAftUp = draftAftUp;
	}
	public Float getDraftFwdDown() {
		return draftFwdDown;
	}
	public void setDraftFwdDown(Float draftFwdDown) {
		this.draftFwdDown = draftFwdDown;
	}
	public Float getDraftMidDown() {
		return draftMidDown;
	}
	public void setDraftMidDown(Float draftMidDown) {
		this.draftMidDown = draftMidDown;
	}
	public Float getDraftAftDown() {
		return draftAftDown;
	}
	public void setDraftAftDown(Float draftAftDown) {
		this.draftAftDown = draftAftDown;
	}
	public String getCrewRemark() {
		return crewRemark;
	}
	public void setCrewRemark(String crewRemark) {
		this.crewRemark = crewRemark;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Float getContractSpeed() {
		return contractSpeed;
	}
	public void setContractSpeed(Float contractSpeed) {
		this.contractSpeed = contractSpeed;
	}
	public Float getMeasureSpeed() {
		return measureSpeed;
	}
	public void setMeasureSpeed(Float measureSpeed) {
		this.measureSpeed = measureSpeed;
	}
	public String getCompRemark() {
		return compRemark;
	}
	public void setCompRemark(String compRemark) {
		this.compRemark = compRemark;
	}
	public String getNoiseVibration() {
		return noiseVibration;
	}
	public void setNoiseVibration(String noiseVibration) {
		this.noiseVibration = noiseVibration;
	}
	public String getTrialStatus() {
		return trialStatus;
	}
	public void setTrialStatus(String trialStatus) {
		this.trialStatus = trialStatus;
	}
	public String getTrial1HullNum() {
		return trial1HullNum;
	}
	public void setTrial1HullNum(String trial1HullNum) {
		this.trial1HullNum = trial1HullNum;
	}
	public String getTrial1ShipType() {
		return trial1ShipType;
	}
	public void setTrial1ShipType(String trial1ShipType) {
		this.trial1ShipType = trial1ShipType;
	}
	public String getTrial2HullNum() {
		return trial2HullNum;
	}
	public void setTrial2HullNum(String trial2HullNum) {
		this.trial2HullNum = trial2HullNum;
	}
	public String getTrial2ShipType() {
		return trial2ShipType;
	}
	public void setTrial2ShipType(String trial2ShipType) {
		this.trial2ShipType = trial2ShipType;
	}
	public int getTrialTime() {
		return trialTime;
	}
	public void setTrialTime(int trialTime) {
		this.trialTime = trialTime;
	}
	public int getTrial1Time() {
		return trial1Time;
	}
	public void setTrial1Time(int trial1Time) {
		this.trial1Time = trial1Time;
	}
	public int getTrial2Time() {
		return trial2Time;
	}
	public void setTrial2Time(int trial2Time) {
		this.trial2Time = trial2Time;
	}
	public int getUserUid() {
		return userUid;
	}
	public void setUserUid(int userUid) {
		this.userUid = userUid;
	}
	public String getOngoChangeDate() {
		return ongoChangeDate;
	}
	public void setOngoChangeDate(String ongoChangeDate) {
		this.ongoChangeDate = ongoChangeDate;
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
