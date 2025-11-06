package com.ssshi.ddms.crew.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ssshi.ddms.constant.Const;
import com.ssshi.ddms.constant.DBConst;
import com.ssshi.ddms.crew.service.CrewServiceI;
import com.ssshi.ddms.dto.ParamBean;
import com.ssshi.ddms.dto.RegistrationCrewBean;
import com.ssshi.ddms.dto.RegistrationCrewListBean;
import com.ssshi.ddms.dto.ScheCrewBean;
import com.ssshi.ddms.dto.ScheCrewInOutBean;
import com.ssshi.ddms.util.CommonUtil;
import com.ssshi.ddms.util.DRMUtil;
import com.ssshi.ddms.util.ExcelUtil;
import com.ssshi.ddms.dto.AnchorageMealRequestBean;
import com.ssshi.ddms.dto.AnchorageMealQtyBean;
import com.ssshi.ddms.dto.AnchorageMealListBean;

/********************************************************************************
 * 프로그램 개요 : Crew
 * 
 * 최초 작성자 : picnic
 * 최초 작성일 : 
 * 
 * 최종 수정자 : 
 * 최종 수정일 :
 * 
 * 메모 : 없음
 * 
 *
 ********************************************************************************/

@Controller
public class CrewController {

	@Autowired
	private CrewServiceI service;
	
	//Main(시운전 승선자 신청)
	@RequestMapping(value="/crew/registrationCrew.html")
	public String registrationCrew(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean,
			@RequestParam(value="schedulerInfoUid", required=false) Integer schedulerInfoUid,
			@RequestParam(value="inDate", required=false) String inDate,
			@RequestParam(value="outDate", required=false) String outDate) throws Exception {
		// schedulerInfoUid 파라미터가 있으면 bean에 설정
		
		
		// 기간 파라미터가 있으면 bean에 설정
		if(inDate != null && !inDate.isEmpty()) {
			bean.setInDate(inDate);
		}
		if(outDate != null && !outDate.isEmpty()) {
			bean.setOutDate(outDate);
		}
		if(schedulerInfoUid != null && schedulerInfoUid>0) {
			bean.setSchedulerInfoUid(schedulerInfoUid);
		}		
		
		model.addAllAttributes(service.registrationCrew(request, bean));
		
		// 파라미터를 model에 추가하여 JSP에서 사용
		if(schedulerInfoUid != null) {
			model.addAttribute("schedulerInfoUid", schedulerInfoUid);
		}
		if(inDate != null && !inDate.isEmpty()) {
			model.addAttribute("inDate", inDate);
		}
		if(outDate != null && !outDate.isEmpty()) {
			model.addAttribute("outDate", outDate);
		}
		
		return "crew/registrationCrew";
	}
	
	//승선자 조회
	@RequestMapping(value="/crew/getRegistrationCrewList.html", method=RequestMethod.GET)
	public String getRegistrationCrewList(HttpServletRequest request, ModelMap model, RegistrationCrewBean bean) throws Exception {		
		model.addAllAttributes(service.getRegistrationCrewList(request, bean));

		return "crew/getRegistrationCrewList";
	}
	
	//승선자 저장
	@RequestMapping(value="/crew/registrationCrewSave.html", method=RequestMethod.POST)
	public String registrationCrewSave(HttpServletRequest request, ModelMap model, RegistrationCrewListBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewSave(request, bean));
		
		return "share/resultCode";
	}
	
	//승선자 양식 다운로드
	@RequestMapping(value="/crew/downCrewExcel.html")
	public void downCrewExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		service.downCrewExcel(response);
	}
	
	//승선자 삭제
	@RequestMapping(value="/crew/registrationCrewRemove.html", method=RequestMethod.POST)
	public String registrationCrewRemove(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.registrationCrewRemove(request, bean));
	   
	    return "share/resultCode";
	}
	
	//승선자 발주
	@RequestMapping(value="/crew/crewOrderUpdate.html", method=RequestMethod.POST)
	public String crewOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.crewOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	
	//Main(앵카링 식사 신청)
	@RequestMapping(value="/crew/anchorageMealRequest.html")
	public String anchorageMealRequest(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean,
		@RequestParam(value="schedulerInfoUid", required=false) Integer schedulerInfoUid,	
		@RequestParam(value="inDate", required=false) String inDate,
		@RequestParam(value="outDate", required=false) String outDate) throws Exception {
	// schedulerInfoUid 파라미터가 있으면 bean에 설정	
		
	// 기간 파라미터가 있으면 bean에 설정
	if(inDate != null && !inDate.isEmpty()) {
		bean.setInDate(inDate);
	}
	if(outDate != null && !outDate.isEmpty()) {
		bean.setOutDate(outDate);
	}
	if(schedulerInfoUid != null && schedulerInfoUid>0) {
		bean.setSchedulerInfoUid(schedulerInfoUid);
	}		
	
	model.addAllAttributes(service.anchorageMealRequest(request, bean));
	
	// 파라미터를 model에 추가하여 JSP에서 사용
	if(schedulerInfoUid != null) {
		model.addAttribute("schedulerInfoUid", schedulerInfoUid);
	}
	if(inDate != null && !inDate.isEmpty()) {
		model.addAttribute("inDate", inDate);
	}
	if(outDate != null && !outDate.isEmpty()) {
		model.addAttribute("outDate", outDate);
	}
		return "crew/anchorageMealRequest";
	}
	
	@RequestMapping(value="/crew/getAnchorageMealList.html", method=RequestMethod.GET)
	public String getAnchorageMealList(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {		
		model.addAllAttributes(service.getAnchorageMealList(request, bean));

		return "crew/anchorageMealRequestList";
	}
	
	@RequestMapping(value="/crew/anchorageMealSave.html", method=RequestMethod.POST)
	public String anchorageMealSave(HttpServletRequest request, ModelMap model, AnchorageMealListBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealSave(request, bean));
		
		return "share/resultCode";
	}
	
	//앵카링 식사 신청 삭제
	@RequestMapping(value="/crew/anchorageMealRemove.html", method=RequestMethod.POST)
	public String anchorageMealRemove(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.anchorageMealRemove(request, bean));
	   
	    return "share/resultCode";
	}
	
	//앵카링 발주
	@RequestMapping(value="/crew/anchOrderUpdate.html", method=RequestMethod.POST)
	public String anchOrderUpdate(HttpServletRequest request, ModelMap model, ParamBean bean) throws Exception {
		model.addAllAttributes(service.anchOrderUpdate(request, bean));
	   
	    return "share/resultCode";
	}
	
	//앵카링 양식 다운로드
		@RequestMapping(value="/crew/downAnchExcel.html")
		public void downAnchExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
			service.downAnchExcel(response);
		}
		
		//방배정 양식 다운로드
		@RequestMapping(value="/crew/downRoomAssignmentExcel.html")
		public void downRoomAssignmentExcel(HttpServletRequest request, HttpServletResponse response,
				@RequestParam(value="schedulerInfoUid", required=false, defaultValue="0") int schedulerInfoUid) throws Exception {
			if(schedulerInfoUid <= 0) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("스케줄번호를 선택해주세요.");
				return;
			}
			service.downRoomAssignmentExcel(response, schedulerInfoUid);
		}
	
	//앵카링 식사 신청 파일 업로드
	@RequestMapping(value="/crew/anchorageMealDRM.html")
	public String anchorageMealDRM(HttpServletRequest request, ModelMap model, @RequestParam("file") MultipartFile file) throws Exception {
		
		// 암호화 해제
		String path = DRMUtil.getDecodingExcel(file);
		
		// 반환 값 오류 발생인 경우 오류 반환
		if(path.startsWith("ERROR")) {
			return "share/exception";
			
		}
		// 정상인 경우 엑셀 파일 기반으로 승선자 데이터 생성
		else {
			String rtnDataFormat = "crew/getAnchMealDRMList";
			
			XSSFWorkbook workbook = new XSSFWorkbook(path);
			
			Sheet sheet = workbook.getSheetAt(0);
			int rowNum = 0;

			try {
				List<AnchorageMealRequestBean> anchorageMealList = new ArrayList<AnchorageMealRequestBean>();
				for (Row row : sheet) {
					if (rowNum != 0) {
						AnchorageMealRequestBean anchBean = new AnchorageMealRequestBean();
						
						// 각 데이터 읽기
						String no = ExcelUtil.getCellValue(row.getCell(0)).toString();
						String kind = ExcelUtil.getCellValue(row.getCell(1)).toString();
						String domesticYn = ExcelUtil.getCellValue(row.getCell(2)).toString();
						String department = ExcelUtil.getCellValue(row.getCell(3)).toString();
						String mealDate = CommonUtil.excelDateStringFormatDate(ExcelUtil.getCellValue(row.getCell(4)).toString());
						
						String foodStyle =  ExcelUtil.getCellValue(row.getCell(5)).toString();
						int breakfastP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(6)).toString());
						int lunchP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(7)).toString());
						int dinnerP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(8)).toString());
						int lateNightP = Integer.parseInt(ExcelUtil.getCellValue(row.getCell(9)).toString());
						
						String orderStatus = ExcelUtil.getCellValue(row.getCell(10)).toString();
						String comment = ExcelUtil.getCellValue(row.getCell(11)).toString();
						
						// Bean에 데이터 입력
						anchBean.setCnt(Integer.parseInt(no));
						anchBean.setKind(kind);
						anchBean.setDomesticYn(domesticYn);
						anchBean.setDepartment(department);
						anchBean.setMealDate(mealDate);
						
						anchBean.setFoodStyle(foodStyle);
//						anchBean.setBreakfastP(breakfastP);
//						anchBean.setLunchP(lunchP);
//						anchBean.setDinnerP(dinnerP);
//						anchBean.setLateNightP(lateNightP);
						
						anchBean.setOrderStatus(orderStatus);
						anchBean.setComment(comment);
						
						// 수량
						List<AnchorageMealQtyBean> mealQtyList = new ArrayList<AnchorageMealQtyBean>();
						AnchorageMealQtyBean breakfastBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean lunchBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean dinnerBean = new AnchorageMealQtyBean();
						AnchorageMealQtyBean lateNightBean = new AnchorageMealQtyBean();
						
						if(breakfastP > 0) {
							breakfastBean.setPlanMealDate(mealDate);
							breakfastBean.setPlanMealGubun(foodStyle);
							breakfastBean.setPlanMealTime("조식");
							breakfastBean.setPlanMealQty(breakfastP);
						}
						if(lunchP > 0) {
							lunchBean.setPlanMealDate(mealDate);
							lunchBean.setPlanMealGubun(foodStyle);
							lunchBean.setPlanMealTime("중식");
							lunchBean.setPlanMealQty(lunchP);
						}
						if(dinnerP > 0) {
							dinnerBean.setPlanMealDate(mealDate);
							dinnerBean.setPlanMealGubun(foodStyle);
							dinnerBean.setPlanMealTime("석식");
							dinnerBean.setPlanMealQty(dinnerP);
						}
						if(lateNightP > 0) {
							lateNightBean.setPlanMealDate(mealDate);
							lateNightBean.setPlanMealGubun(foodStyle);
							lateNightBean.setPlanMealTime("야식");
							lateNightBean.setPlanMealQty(lateNightP);
						}
						
						mealQtyList.add(breakfastBean);
						mealQtyList.add(lunchBean);
						mealQtyList.add(dinnerBean);
						mealQtyList.add(lateNightBean);
						
						anchBean.setPlanList(mealQtyList);
						anchorageMealList.add(anchBean);
					}
					rowNum++;
				}
	
				// 워크북 닫기
				workbook.close();
	
				model.addAttribute(Const.LIST, anchorageMealList);
			} catch(Exception e) {
				rtnDataFormat = "share/exception";
				
//				System.out.println("@@@ ERROR: Excel Process Fail=" + e.getMessage());
				e.printStackTrace();
			}
			
			return rtnDataFormat;
		}
	}
	
	//Main(실적 확인)
	@RequestMapping(value="/crew/resultMeal.html")
	public String resultMeal(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {
		model.addAllAttributes(service.resultMeal(request, bean));
		
		return "crew/resultMeal";
	}
	//앵카링 실적 리스트 조회
	@RequestMapping(value="/crew/getMealResultList.html")
	public String getMealResultList(HttpServletRequest request, ModelMap model, AnchorageMealRequestBean bean) throws Exception {
		model.addAllAttributes(service.resultMeal(request, bean));
		
		return "crew/getMealResultList";
	}
	
	//방배정 업로드 (DRM 파일)
	@RequestMapping(value="/crew/roomAssignmentDRM.html", method=RequestMethod.POST)
	public String roomAssignmentDRM(HttpServletRequest request, ModelMap model, 
			@RequestParam("file") MultipartFile file,
			@RequestParam(value="schedulerInfoUid", required=false, defaultValue="0") int schedulerInfoUid,
			@RequestParam(value="trialKey", required=false, defaultValue="") String trialKey,
			@RequestParam(value="projNo", required=false, defaultValue="") String projNo) throws Exception {
		
		// 파일이 없으면 오류 반환
		if(file == null || file.isEmpty()) {
			model.addAttribute(Const.RESULT, DBConst.FAIL);
			model.addAttribute("msg", "파일이 없습니다.");
			return "share/result";
		}
		
		// 스케줄 정보가 없으면 ship select에서 가져오기
		if((schedulerInfoUid == 0 || trialKey.isEmpty()) && request.getParameter("ship") != null) {
			String shipVal = request.getParameter("ship");
			if(!shipVal.isEmpty() && !shipVal.equals("ALL")) {
				try {
					schedulerInfoUid = Integer.parseInt(shipVal);
					// trialKey와 projNo는 DB에서 조회 필요하지만, 일단 기본값 사용
					if(trialKey.isEmpty()) {
						// 나중에 DB에서 조회하도록 수정 필요
					}
				} catch(Exception e) {
					// 파싱 실패 시 무시
				}
			}
		}
		
		Map<String, Object> resultMap = service.roomAssignmentUpload(request, null, file, schedulerInfoUid, trialKey, projNo);
		model.addAllAttributes(resultMap);
		
		return "share/result";
	}
	
	//방배정 업로드 (일반 파일)
	@RequestMapping(value="/crew/roomAssignmentUpload.html", method=RequestMethod.POST)
	public String roomAssignmentUpload(HttpServletRequest request, ModelMap model,
			@RequestParam("file") MultipartFile file,
			@RequestParam(value="schedulerInfoUid", required=false, defaultValue="0") int schedulerInfoUid,
			@RequestParam(value="trialKey", required=false, defaultValue="") String trialKey,
			@RequestParam(value="projNo", required=false, defaultValue="") String projNo) throws Exception {
		
		// 파일이 없으면 오류 반환
		if(file == null || file.isEmpty()) {
			model.addAttribute(Const.RESULT, DBConst.FAIL);
			model.addAttribute("msg", "파일이 없습니다.");
			return "share/result";
		}
		
		Map<String, Object> resultMap = service.roomAssignmentUpload(request, null, file, schedulerInfoUid, trialKey, projNo);
		model.addAllAttributes(resultMap);
		
		return "share/result";
	}
}