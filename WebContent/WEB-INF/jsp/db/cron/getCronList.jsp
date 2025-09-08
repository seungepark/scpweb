<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"cronid": "${tmp.cronid}",
				"description": "${tmp.description}",
				"status": "${tmp.status}",
				"frequency": "${tmp.frequency}",
				"cronclass": "${tmp.cronclass}"
			}
		<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}