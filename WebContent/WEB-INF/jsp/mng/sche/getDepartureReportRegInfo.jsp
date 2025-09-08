<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
    <c:forEach var="tmp" items="${list}" varStatus="status">
    "${tmp.reportKey}uid": ${tmp.uid},
    "${tmp.reportKey}": "${tmp.reportValue}"<c:if test="${!status.last}">,</c:if>
    </c:forEach>
}
