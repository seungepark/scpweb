<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
		{
			"uid":"${tmp.uid}",
			"schedulerInfoUid": "${tmp.schedulerInfoUid}",
			"kind": "${tmp.kind}",
			"trialKey": "${tmp.trialKey}",
			"pjt": "${tmp.project}",
				"company": "${tmp.company}",
				"department": "${tmp.department}",
				"name": "${tmp.name}",
				"rank": "${tmp.rank}",
				"idNo": "${tmp.idNo}",
				"workType1": "${tmp.workType1}",
				"workType2": "${tmp.workType2}",
				"work": "${tmp.work}",
				"mainSub": "${tmp.mainSub}",
				"foodStyle": "${tmp.foodStyle}",
				"personNo": "${tmp.personNo}",
				"gender": "${tmp.gender}",
				"phone": "${tmp.phone}",
				"inOutList": [
				    <c:forEach var="inout" items="${tmp.inOutList}" varStatus="ioStatus">
				        {
				            "inOutDate": "${inout.inOutDate}",
				            "schedulerInOut": "${inout.schedulerInOut}",
				            "performanceInOut": "${inout.performanceInOut}"
				        }
				        <c:if test="${!ioStatus.last}">,</c:if>
				    </c:forEach>
				],
				"terminal": "${tmp.terminal}",
				"laptop": "${tmp.laptop}",
		  		"modelNm": "${tmp.modelNm}",
		  		"serialNo": "${tmp.serialNo}",
		  		"foreigner": "${tmp.foreigner}",	
		  		"passportNo": "${tmp.passportNo}",	 
				"orderStatus": "${tmp.orderStatus}",		
				"deleteYn": "${tmp.deleteYn}"			
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}