<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"userId": "${tmp.userId}",
				"posCode": "${tmp.posCode}",
				"firstName": "${tmp.firstName}",
				"lastName": "${tmp.lastName}",
				"status": "${tmp.status}",
				"imo": "${tmp.imo}",
				"shipTitle": "${tmp.shipTitle}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}