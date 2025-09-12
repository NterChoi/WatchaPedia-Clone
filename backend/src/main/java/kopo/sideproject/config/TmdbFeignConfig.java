package kopo.sideproject.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TmdbFeignConfig {

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            template.query("api_key", tmdbApiKey);
        };
    }
}
