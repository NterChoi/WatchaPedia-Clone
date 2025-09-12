package kopo.sideproject.util;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtil {

    /**
     * 날짜, 시간 출력하기
     *
     * @param fm 날짜 출력 형식
     * @return date
     */
    public static String getDateTime(String fm) {

        Date today = new Date();
        SimpleDateFormat date = new SimpleDateFormat(fm);

        return date.format(today);
    }

    /**
     * 날짜, 시간 출력하기
     *
     * @return 기본값은 년.월.일
     */
    public static String getDateTime() {
        return getDateTime("yyyy.MM.dd");

    }

    /**
     * Unix UTC 타입의 날짜, 시간 출력하기
     *
     * @param time 시간
     * @return date
     */
    public static String getLongDateTime(Object time) {

        return getLongDateTime(time, "yyyy-MM-dd HH:mm:ss");
    }

    /**
     * Unix UTC 타입의 날짜, 시간 출력하기
     *
     * @param time 시간
     * @return date
     */
    public static String getLongDateTime(Integer time) {

        return getLongDateTime(time, "yyyy-MM-dd HH:mm:ss");
    }

    /**
     * Unix UTC 타입의 날짜, 시간 출력하기
     *
     * @param time 시간
     * @param fm   날짜 출력 형식
     * @return date
     */
    public static String getLongDateTime(Object time, String fm) {
        return getLongDateTime((Integer) time, fm);

    }

    /**
     * Unix UTC 타입의 날짜, 시간 출력하기
     *
     * @param time 시간
     * @param fm   날짜 출력 형식
     * @return date
     */
    public static String getLongDateTime(Integer time, String fm) {
        Instant instant = Instant.ofEpochSecond(time);
        return DateTimeFormatter.ofPattern(fm)
                .withZone(ZoneId.systemDefault())
                .format(instant);

    }

    /**
     * 어제 날짜 출력하기
     *
     * @param fm 날짜 출력 형식
     * @return 어제 날짜
     */
    public static String getYesterdayDate(String fm) {
        LocalDate yesterday = LocalDate.now().minusDays(1); // 현재 날짜에서 하루 빼기
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(fm);
        return yesterday.format(formatter);
    }

    /**
     * 어제 날짜 출력하기 (기본 형식: yyyy.MM.dd)
     *
     * @return 어제 날짜
     */
    public static String getYesterdayDate() {
        return getYesterdayDate("yyyy.MM.dd");
    }


}
