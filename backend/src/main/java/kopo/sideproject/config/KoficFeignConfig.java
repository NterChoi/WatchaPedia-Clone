package kopo.sideproject.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KoficFeignConfig {

    @Value("${kofic.api.key}")
    private String koficApiKey;

    @Bean
    public RequestInterceptor koficRequestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // 모든 요청에 'key' 쿼리 파라미터로 API 키를 추가합니다.
                template.query("key", koficApiKey);
            }
        };
    }
}
