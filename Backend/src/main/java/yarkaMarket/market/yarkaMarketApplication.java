package yarkaMarket.market;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class yarkaMarketApplication {

	public static void main(String[] args) {
		SpringApplication.run(yarkaMarketApplication.class, args);
	}
}
