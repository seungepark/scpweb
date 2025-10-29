<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
{
    "list": [
        <c:forEach var="tmp" items="${list}" varStatus="status">        
			{
				"No.":"${tmp.cnt}",
	 			"구분": "${tmp.kind}",
	 			"내국/외국": "${tmp.domesticYn}",
				"부서": "${tmp.department}",				
	 			"날짜": "${tmp.mealDate}",
	 			"한식/양식": "${tmp.foodStyle}",
	 			"조식": "${tmp.breakfastP}",
				"중식": "${tmp.lunchP}",				
	 			"석식": "${tmp.dinnerP}",
	 			"야식": "${tmp.lateNightP}",
	 			"발주": "${tmp.orderStatus}",
	 			"특이사항": "${tmp.comment}"
	 		}
			<c:if test="${!status.last}">,</c:if>
        </c:forEach>
    ]
}