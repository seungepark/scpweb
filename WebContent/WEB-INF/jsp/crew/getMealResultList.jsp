<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid":"${tmp.uid}",
	 			"projNo": "${tmp.projNo}",
	 			"department": "${tmp.department}",
	 			"mealDate": "${tmp.mealDate}",
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
	   
