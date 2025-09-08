<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"title": "${tmp.title}",
				"desc": "${tmp.description}",
				"shipType": "${tmp.shipType}",
				"status": "${tmp.status}",
				"projEvent": "${tmp.projEvent}",
				"workTime": "${tmp.workTime}",
				"lngTotal": "${tmp.lngTotal}",
				"ln2Total": "${tmp.ln2Total}",
				"margin": "${tmp.margin}",
				"marginCur": "${tmp.marginCurrency}",
				"shipTypeDesc": "${tmp.shipTypeDesc}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}