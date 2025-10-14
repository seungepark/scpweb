-- 호선 870개 : 리스트 조건 필요
select count(*) from scp_db.shipinfo;

-- 현재 화면내 검색 호선리스트
select SHIPNUM as VAL, TITLE as DESCRIPTION from scp_db.shipinfo where title <> '';