<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid":"${tmp.uid}",
	 			"projNo": "${tmp.projNo}",
	 			"trialKey": "${tmp.trialKey}",
				"kind": "${tmp.kind}",				
	 			"domesticYn": "${tmp.domesticYn}",
	 			"department": "${tmp.department}",
	 			"mealDate": "${tmp.mealDate}",
	 			"orderStatus": "${tmp.orderStatus}",
	 			"orderDate": "${tmp.orderDate}",
	 			"orderUid": "${tmp.orderUid}",
	 			"deleteYn": "${tmp.deleteYn}",
	 			"comment": "${tmp.comment}",
	 			"inputUid": "${tmp.inputUid}",
	 			"inputDate": "${tmp.inputDate}",
	 			"smsReceiver": <c:choose><c:when test="${tmp.smsReceiver != null && tmp.smsReceiver != ''}">"<c:out value='${tmp.smsReceiver}' escapeXml='false'/>"</c:when><c:otherwise>null</c:otherwise></c:choose>,
	 			"planList": [
	 				<c:forEach var="plan" items="${tmp.planList}" varStatus="planStatus">
	 					{
	 						"planMealDate": "${plan.planMealDate}",
			 				"planMealTime": "${plan.planMealTime}",
			 				"planMealGubun": "${plan.planMealGubun}",
			 				"planMealQty": "${plan.planMealQty}"
			 			}
			 			<c:if test="${!planStatus.last}">,</c:if>
		 			</c:forEach>
	 			],
	 			"resultList": [
	 				<c:forEach var="result" items="${tmp.resultList}" varStatus="resultStatus">
	 					{
	 						"resultMealDate": "${result.resultMealDate}",
			 				"resultMealTime": "${result.resultMealTime}",
			 				"resultMealGubun": "${result.resultMealGubun}",
			 				"resultMealQty": "${result.resultMealQty}"
			 			}
			 			<c:if test="${!resultStatus.last}">,</c:if>
		 			</c:forEach>
	 			]	
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}