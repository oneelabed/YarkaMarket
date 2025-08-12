package yarkaMarket.market.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import io.micrometer.common.lang.NonNull;

@Configuration
@SuppressWarnings("null") 
public class StaticResourceConfig implements WebMvcConfigurer {
  @Override
  public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
      .addResourceLocations("file:uploads/");
  }
}

