package kopo.sideproject.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings (CorsRegistry registry) {
        registry.addMapping("/") // "/" 는 모든 경로에 이 설정을 적용한다는 의미입니다.
                .allowedOrigins("http://localhost:3000") // 허용할 출처(Origin)를 지정합니다. 우리 React 앱의 주소입니다.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 허용할 HTTP 메서드를 지정합니다.
                .allowCredentials(true) // 요청에 쿠키/인증 정보 포함을 허용합니다 (로그인 처리를 위해 true로 설정)
                .maxAge(3600); // Pre-flight 요청의 캐시 시간을 설정합니다. (초 단위)
    }
}
