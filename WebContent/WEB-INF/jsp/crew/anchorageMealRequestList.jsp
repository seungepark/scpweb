<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid":"${item.uid}",
	 			"projNo": "${item.projNo}",
	 			"trialKey": "${item.trialKey}",
				"kind": "${item.kind}",				
	 			"domesticYn": "${item.domesticYn}",
	 			"department": "${item.department}",
	 			"mealDate": "${item.mealDate}",
	 			"orderStatus": "${item.orderStatus}",
	 			"orderDate": "${item.orderDate}",
	 			"orderUid": "${item.orderUid}",
	 			"deleteYn": "${item.deleteYn}",
	 			"comment": "${item.comment}",
	 			"inputUid": "${item.inputUid}",
	 			"inputDate": "${item.inputDate}",
	 			"planList": [
	 				<c:forEach var="plan" items="${item.planList}" varStatus="status">
	 					{
	 						"planMealDate": "${plan.planMealDate}",
			 				"planMealTime": "${plan.planMealTime}",
			 				"planMealGubun": "${plan.planMealGubun}",
			 				"planMealPlanQty": "${plan.planMealPlanQty}"
			 			}
			 			<c:if test="${!status.last}">,</c:if>
		 			</c:forEach>
	 			],
	 			"resultList: [
	 				<c:forEach var="result" items="${item.resultList}" varStatus="status">
	 					{
	 						"resultMealDate": "${result.resultMealDate}",
			 				"resultMealTime": "${result.resultMealTime}",
			 				"resultMealGubun": "${result.resultMealGubun}",
			 				"resultMealPlanQty": "${result.resultMealPlanQty}"
			 			}
			 			<c:if test="${!status.last}">,</c:if>
		 			</c:forEach>
	 			]			
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}