<%--
  Created by IntelliJ IDEA.
  User: bgpark
  Date: 2022-12-26
  Time: 오후 2:21
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
{
"list": [
<c:forEach var="tmp" items="${list}" varStatus="status">
    {
    "uid": ${tmp.uid},
    "seq": "${tmp.seq}",
    "reqinfotitle": "${tmp.reqinfotitle}",
    "item": "${tmp.item}",
    "unit": "${tmp.unit}"
    }
    <c:if test="${!status.last}">,</c:if>
</c:forEach>
]
}
