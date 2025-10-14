<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"kind": "${tmp.kind}",
				"key": "${tmp.key}",
				"pjt": "${tmp.projectNo}",
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
				"gender": "${tmp.gender}",
				"phone": "${tmp.phone}",
				"inOutList": "${tmp.inOutList}",
				"inDate": "${tmp.inDate}",
				"outDate": "${tmp.outDate}",
				"terminal": "${tmp.terminal}",
				"ordering": "${tmp.ordering}"				
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}