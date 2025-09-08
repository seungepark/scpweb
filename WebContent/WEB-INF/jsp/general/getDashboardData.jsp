<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"cntList": [
		<c:forEach var="tmp" items="${listCnt}" varStatus="status">
			{
				"cnt": ${tmp}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"hourList": [
		<c:forEach var="tmp" items="${listHour}" varStatus="status">
			{
				"cnt": ${tmp}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"seaList": [
		<c:forEach var="tmp" items="${listSea}" varStatus="status">
			{
				"hull": "${tmp.hullnum}",
				"desc": "${tmp.description}",
				"type": "${tmp.shiptype}",
				"per": ${tmp.per}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"quayList": [
		<c:forEach var="tmp" items="${listQuay}" varStatus="status">
			{
				"projNo": "${tmp.projNo}",
				"actv": "${tmp.actv}",
				"wkCnts": "${tmp.wkCnts}",
				"daStdt": "${tmp.daStdt}",
				"daFndt": "${tmp.daFndt}",
				"sknd": "${tmp.sknd}",
				"newSknd": "${tmp.newSknd}",
				"quayNm": "${tmp.quayNm}",
				"per": ${tmp.per}
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"eventList": [
		<c:forEach var="tmp" items="${listEvent}" varStatus="status">
			{
				"projNo": "${tmp.projNo}",
				"own": "${tmp.own}",
				"newSknd": "${tmp.newSknd}",
				"actv": "${tmp.actv}",
				"fndt": "${tmp.fndt}",
				"quayNm": "${tmp.quayNm}",
				"list": [
					<c:forEach var="tmp2" items="${tmp.list}" varStatus="status2">
						{
							"actv": "${tmp2.actv}",
							"stdt": "${tmp2.stdt}",
							"fndt": "${tmp2.fndt}",
							"diff": ${tmp2.diff}
						}
						<c:if test="${!status2.last}">,</c:if>
					</c:forEach>
				]
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}