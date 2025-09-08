<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
    "result": ${result},
    "errCode": "${errCode}",
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"val": "${tmp}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}