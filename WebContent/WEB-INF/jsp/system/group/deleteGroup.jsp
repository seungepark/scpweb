<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
    "result": ${result},
    "errCode": "${errCode}",
    "listOk": [
		<c:forEach var="tmp" items="${listOk}" varStatus="status">
			{
				"uid": ${tmp}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listFail": [
		<c:forEach var="tmp" items="${listFail}" varStatus="status">
			{
				"uid": ${tmp}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}