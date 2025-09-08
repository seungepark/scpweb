
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	<c:if test="${not empty bean}">
		"drawn": "${bean.drawn}",
		"checked": "${bean.checked}",
		"manager": "${bean.manager}",
		"description": "${bean.description}",
	</c:if>
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"vsslreqinfouid": "${tmp.vsslreqinfouid}",
				"seq": "${tmp.seq}",
				"reqinfotitle": "${tmp.reqinfotitle}",
				"item": "${tmp.item}",
				"unit": "${tmp.unit}",
				"name": "${tmp.name}",
				"rpm": "${tmp.rpm}",
				"loadrate": "${tmp.loadrate}",
				"flag": "${tmp.flag}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}