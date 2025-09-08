
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
	"list": [
		<c:forEach var="tmp" items="${list}" varStatus="status">
			{
				"uid": ${tmp.uid},
				"schecodeinfouid": "${tmp.schecodeinfouid}",
				"displaycode": "${tmp.displaycode}",
				"description": "${tmp.description}",
				"dtype": "${tmp.dtype}",
				"ctype": "${tmp.ctype}",
				"dtypedesc": "${tmp.dtypedesc}",
				"ctypedesc": "${tmp.ctypedesc}",
				"loadrate": "${tmp.loadrate}",
				"loadstr": "${tmp.loadstr}",
				"per": "${tmp.per}",
				"seq": "${tmp.seq}",
				"readytime": "${tmp.readytime}",
				"schehierarchyuid": "${tmp.schehierarchyuid}",
				"codelevel": "${tmp.codelevel}",
				"sametcnum": "${tmp.sametcnum}",
				"lv1code": "${tmp.lv1code}",
				"lv2code": "${tmp.lv2code}",
				"lv3code": "${tmp.lv3code}",
				"lv4code": "${tmp.lv4code}",
				"flag": "${tmp.flag}"
			}
			<c:if test="${!status.last}">,</c:if>
		</c:forEach>
	],
	"listCnt": ${listCnt}
}