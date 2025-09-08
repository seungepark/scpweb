
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	<c:if test="${not empty bean}">
		"hullnum": "${bean.hullnum}",
		"shiptype": "${bean.shiptype}",
		"schedtype": "${bean.schedtype}",
		"sdate": "${bean.sdate}",
		"edate": "${bean.edate}",
		"description": "${bean.description}",
		"revnum": "${bean.revnum}",
	</c:if>
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"schedinfouid": "${tmp.schedinfouid}",
				"category": "${tmp.category}",
				"tcnum": "${tmp.tcnum}",
				"desc": "${tmp.description}",
				"ctype": "${tmp.ctype}",
				"loadrate": "${tmp.loadrate}",
				"dtype": "${tmp.dtype}",
				"sdate": "${tmp.sdate}",
				"stime": "${tmp.stime}",
				"edate": "${tmp.edate}",
				"etime": "${tmp.etime}",
				"seq": "${tmp.seq}",
				"per": "${tmp.per}",
				"note": "${tmp.note}",
				"readytime": "${tmp.readytime}",
				"codedetuid": "${tmp.codedetuid}",
				"sametcnum": "${tmp.sametcnum}",
				"flag": "${tmp.flag}",
				"performancesdate": "${tmp.performancesdate}",
				"performancestime": "${tmp.performancestime}",
				"performanceedate": "${tmp.performanceedate}",
				"performanceetime": "${tmp.performanceetime}",
				"codedettcnum": "${tmp.codedettcnum}",
				"codedetdesc": "${tmp.codedetdesc}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	]
}