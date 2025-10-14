package kopo.sideproject.service;

import kopo.sideproject.config.KoficFeignConfig;
import kopo.sideproject.dto.KoficApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

// KOFIC API를 위한 Feign 클라이언트
@FeignClient(name = "kofic-api", url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice", configuration = KoficFeignConfig.class)
public interface IKoficApiService {

    /**
     * 일별 박스오피스 목록을 조회합니다.
     *
     * @param targetDt 조회할 날짜 (형식: yyyyMMdd)
     * @return KOFIC API 응답 DTO
     */
    @GetMapping("/searchDailyBoxOfficeList.json")
    KoficApiResponse getDailyBoxOffice(@RequestParam("targetDt") String targetDt);

}
